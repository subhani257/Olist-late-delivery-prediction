"""
feature_builder.py — Compute the 67 model features from raw user inputs.

This module replicates the exact feature-engineering logic from the training
pipeline (Notebooks 03-05) so that training and serving never diverge.

Usage:
    from feature_builder import build_features
    df = build_features(raw_input_dict)   # -> DataFrame with 67 columns (scaled)
"""

import json
import math
import numpy as np
import pandas as pd
from pathlib import Path
import joblib

# ── Lookup paths ──────────────────────────────────────────────────────────────
_LOOKUP_DIR = Path(__file__).resolve().parent / "lookups"
_BASE_DIR = Path(__file__).resolve().parent.parent.parent

with open(_LOOKUP_DIR / "geo_zip_lookup.json") as f:
    GEO_ZIP_LOOKUP: dict = json.load(f)

with open(_LOOKUP_DIR / "state_target_enc.json") as f:
    STATE_TARGET_ENC: dict = json.load(f)

with open(_LOOKUP_DIR / "category_target_enc.json") as f:
    CATEGORY_TARGET_ENC: dict = json.load(f)

with open(_LOOKUP_DIR / "training_defaults.json") as f:
    DEFAULTS: dict = json.load(f)

# Load scaler & feature names
_SCALER_PATH = _BASE_DIR / "data" / "final" / "scaler.pkl"
_FEATURE_NAMES_PATH = _BASE_DIR / "data" / "final" / "feature_names.txt"

scaler = joblib.load(_SCALER_PATH)
SCALER_FEATURES: list[str] = list(scaler.feature_names_in_)  # 44 numeric features

with open(_FEATURE_NAMES_PATH) as f:
    ALL_67_FEATURES: list[str] = [line.strip() for line in f if line.strip()]


# ══════════════════════════════════════════════════════════════════════════════
# Helpers
# ══════════════════════════════════════════════════════════════════════════════

def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Great-circle distance between two points (in km)."""
    R = 6371.0
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    return R * 2 * math.asin(math.sqrt(a))


def _safe_div(numerator: float, denominator: float, default: float = 0.0) -> float:
    """Division that returns *default* when denominator is zero or NaN."""
    if denominator == 0 or math.isnan(denominator):
        return default
    return numerator / denominator


def _lookup_geo(zip_prefix: int | str) -> dict | None:
    """Return {lat, lng, state, region} for a zip prefix, or None."""
    key = str(int(zip_prefix)).zfill(5)
    return GEO_ZIP_LOOKUP.get(key)


# ══════════════════════════════════════════════════════════════════════════════
# Main builder
# ══════════════════════════════════════════════════════════════════════════════

def build_features(raw: dict) -> pd.DataFrame:
    """
    Accept a dictionary of raw, user-friendly inputs and return a 1-row
    DataFrame containing all 67 model features, with numeric features scaled.
    """

    # ── 1. Parse dates ────────────────────────────────────────────────────────
    purchase_dt = pd.Timestamp(raw["purchase_datetime"])
    est_delivery = pd.Timestamp(raw["estimated_delivery_date"])

    purchase_month = purchase_dt.month
    purchase_dayofweek = purchase_dt.dayofweek        # Mon=0 … Sun=6
    purchase_hour = purchase_dt.hour
    purchase_quarter = (purchase_month - 1) // 3 + 1
    estimated_delivery_days = max(
        (est_delivery - purchase_dt).total_seconds() / 86_400, 0.0
    )

    # ── 2. Approval lag ───────────────────────────────────────────────────────
    val_lag = raw.get("approval_lag_hours")
    approval_lag_hours = float(
        val_lag if val_lag is not None else DEFAULTS["approval_lag_hours_median"]
    )

    # ── 3. Geography lookup ───────────────────────────────────────────────────
    cust_geo = _lookup_geo(raw["customer_zip_prefix"])
    sell_geo = _lookup_geo(raw["seller_zip_prefix"])

    customer_geolocation_missing = 1 if cust_geo is None else 0
    missing_customer_coordinates = customer_geolocation_missing
    missing_seller_coordinates = 1 if sell_geo is None else 0

    if cust_geo:
        customer_latitude = cust_geo["lat"]
        customer_longitude = cust_geo["lng"]
        customer_state = cust_geo["state"]
        customer_region = cust_geo.get("region", "Southeast")
    else:
        # Fallback: rough centre of Brazil
        customer_latitude = -15.78
        customer_longitude = -47.93
        customer_state = "DF"
        customer_region = "Center-West"

    if sell_geo:
        seller_lat = sell_geo["lat"]
        seller_lng = sell_geo["lng"]
        seller_state = sell_geo.get("state", "")
        seller_region = sell_geo.get("region", "")
    else:
        seller_lat = -23.55
        seller_lng = -46.63
        seller_state = "SP"
        seller_region = "Southeast"

    # ── 4. Distance ───────────────────────────────────────────────────────────
    distance_km = _haversine_km(
        customer_latitude, customer_longitude, seller_lat, seller_lng
    )
    minimum_distance_km = distance_km
    average_distance_km = distance_km
    maximum_distance_km = distance_km

    # ── 5. Seller geography features ──────────────────────────────────────────
    val_sc = raw.get("seller_count")
    seller_count = int(val_sc if val_sc is not None else 1)
    geographic_seller_count = seller_count
    distinct_seller_states = 1
    distinct_seller_regions = 1

    any_seller_same_state = 1 if customer_state == seller_state else 0
    all_sellers_same_state = any_seller_same_state
    any_seller_same_region = 1 if customer_region == seller_region else 0
    all_sellers_same_region = any_seller_same_region
    is_multi_seller = 1 if seller_count > 1 else 0
    is_cross_state = 1 if customer_state != seller_state else 0

    # ── 6. Item / product features ────────────────────────────────────────────
    val_ic = raw.get("item_count")
    item_count = int(val_ic if val_ic is not None else 1)
    price = float(raw["price"])
    freight_value = float(raw["freight_value"])
    weight_g = float(raw["weight_g"])
    length_cm = float(raw["length_cm"])
    height_cm = float(raw["height_cm"])
    width_cm = float(raw["width_cm"])
    volume_cm3 = length_cm * height_cm * width_cm

    total_price = price * item_count
    average_item_price = price
    total_freight_value = freight_value * item_count
    average_freight_value = freight_value
    total_weight_g = weight_g * item_count
    average_weight_g = weight_g
    total_volume_cm3 = volume_cm3 * item_count

    distinct_seller_count = seller_count
    distinct_product_count = 1
    distinct_category_count = 1

    # Outlier flags
    outlier_price_item_count = int(price > DEFAULTS["price_outlier_upper"])
    outlier_freight_item_count = int(freight_value > DEFAULTS["freight_outlier_upper"])

    missing_weight_count = 0
    missing_dims_count = 0

    # ── 7. Payment features ──────────────────────────────────────────────────
    payment_type = str(raw["payment_type"]).lower()
    installments = int(raw["installments"])
    total_payment_value = total_price + total_freight_value
    payment_record_count = 1
    payment_method_count = 1
    max_installments = installments
    total_installments = installments

    outlier_payment_count = int(total_payment_value > DEFAULTS["payment_outlier_upper"])
    average_payment_value = total_payment_value
    installment_ratio = _safe_div(max_installments, payment_method_count)
    is_high_value_order = int(total_payment_value > DEFAULTS.get("high_value_threshold", 175.5))

    has_boleto = 1 if payment_type == "boleto" else 0
    has_credit_card = 1 if payment_type == "credit_card" else 0
    has_debit_card = 1 if payment_type == "debit_card" else 0
    has_voucher = 1 if payment_type == "voucher" else 0
    has_other = 1 if payment_type not in ["boleto", "credit_card", "debit_card", "voucher"] else 0

    primary_payment_type__credit_card = has_credit_card
    primary_payment_type__debit_card = has_debit_card
    primary_payment_type__voucher = has_voucher

    # ── 8. Shipping limit lead days ───────────────────────────────────────────
    val_sl = raw.get("shipping_limit_lead_days")
    shipping_limit_lead_days = float(
        val_sl if val_sl is not None else DEFAULTS["shipping_limit_lead_days_median"]
    )

    # ── 9. Engineered ratios ──────────────────────────────────────────────────
    freight_to_price_ratio = _safe_div(total_freight_value, total_price + 1e-5)
    weight_per_item = _safe_div(total_weight_g, item_count)
    volume_per_item = _safe_div(total_volume_cm3, item_count)
    distance_x_items = distance_km * item_count
    freight_per_km = _safe_div(total_freight_value, distance_km + 1.0)

    # ── 10. Target Encoding Lookups ───────────────────────────────────────────
    global_mean = DEFAULTS["global_mean_late_rate"]
    customer_state_target_enc = STATE_TARGET_ENC.get(customer_state, global_mean)

    cat_raw = str(raw["product_category"]).strip().lower()
    dominant_product_category_target_enc = CATEGORY_TARGET_ENC.get(cat_raw, global_mean)

    # ── 11. Region One-Hot Dummies (reference: Center-West dropped) ───────────
    customer_region__North = 1 if customer_region == "North" else 0
    customer_region__Northeast = 1 if customer_region == "Northeast" else 0
    customer_region__South = 1 if customer_region == "South" else 0
    customer_region__Southeast = 1 if customer_region == "Southeast" else 0

    # ── 12. Combine into feature dictionary ───────────────────────────────────
    feature_dict = {
        "purchase_month": purchase_month,
        "purchase_dayofweek": purchase_dayofweek,
        "purchase_hour": purchase_hour,
        "estimated_delivery_days": estimated_delivery_days,
        "approval_lag_hours": approval_lag_hours,
        "customer_latitude": customer_latitude,
        "customer_longitude": customer_longitude,
        "customer_geolocation_missing": customer_geolocation_missing,
        "geographic_seller_count": geographic_seller_count,
        "distinct_seller_states": distinct_seller_states,
        "distinct_seller_regions": distinct_seller_regions,
        "any_seller_same_state": any_seller_same_state,
        "all_sellers_same_state": all_sellers_same_state,
        "any_seller_same_region": any_seller_same_region,
        "all_sellers_same_region": all_sellers_same_region,
        "minimum_distance_km": minimum_distance_km,
        "average_distance_km": average_distance_km,
        "maximum_distance_km": maximum_distance_km,
        "missing_customer_coordinates": missing_customer_coordinates,
        "missing_seller_coordinates": missing_seller_coordinates,
        "total_payment_value": total_payment_value,
        "payment_record_count": payment_record_count,
        "payment_method_count": payment_method_count,
        "max_installments": max_installments,
        "total_installments": total_installments,
        "outlier_payment_count": outlier_payment_count,
        "has_boleto": has_boleto,
        "has_credit_card": has_credit_card,
        "has_debit_card": has_debit_card,
        "has_other": has_other,
        "has_voucher": has_voucher,
        "average_payment_value": average_payment_value,
        "installment_ratio": installment_ratio,
        "is_high_value_order": is_high_value_order,
        "item_count": item_count,
        "distinct_seller_count": distinct_seller_count,
        "distinct_product_count": distinct_product_count,
        "distinct_category_count": distinct_category_count,
        "total_price": total_price,
        "average_item_price": average_item_price,
        "total_freight_value": total_freight_value,
        "average_freight_value": average_freight_value,
        "total_weight_g": total_weight_g,
        "average_weight_g": average_weight_g,
        "total_volume_cm3": total_volume_cm3,
        "missing_weight_count": missing_weight_count,
        "missing_dims_count": missing_dims_count,
        "outlier_price_item_count": outlier_price_item_count,
        "outlier_freight_item_count": outlier_freight_item_count,
        "shipping_limit_lead_days": shipping_limit_lead_days,
        "freight_to_price_ratio": freight_to_price_ratio,
        "weight_per_item": weight_per_item,
        "volume_per_item": volume_per_item,
        "is_multi_seller": is_multi_seller,
        "is_cross_state": is_cross_state,
        "distance_x_items": distance_x_items,
        "freight_per_km": freight_per_km,
        "purchase_quarter": purchase_quarter,
        "customer_state_target_enc": customer_state_target_enc,
        "dominant_product_category_target_enc": dominant_product_category_target_enc,
        "customer_region__North": customer_region__North,
        "customer_region__Northeast": customer_region__Northeast,
        "customer_region__South": customer_region__South,
        "customer_region__Southeast": customer_region__Southeast,
        "primary_payment_type__credit_card": primary_payment_type__credit_card,
        "primary_payment_type__debit_card": primary_payment_type__debit_card,
        "primary_payment_type__voucher": primary_payment_type__voucher,
    }

    # Build DataFrame in exact order of ALL_67_FEATURES
    df = pd.DataFrame([feature_dict])[ALL_67_FEATURES]

    # Scale the 44 numeric features using the fitted scaler
    df[SCALER_FEATURES] = scaler.transform(df[SCALER_FEATURES])

    return df
