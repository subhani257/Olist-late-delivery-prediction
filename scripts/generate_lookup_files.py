"""
Generate serving-time lookup files from training data.
Saves to app/backend/lookups/:
  - geo_zip_lookup.json       (zip_prefix -> {lat, lng, state, region})
  - state_target_enc.json     (state -> target_encoding_value)
  - category_target_enc.json  (category -> target_encoding_value)
  - training_defaults.json    (medians and thresholds from training set)
"""
import pandas as pd
import numpy as np
import pickle
import json
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

BASE = r"c:\Users\SKY PC\Documents\Olist-late-delivery-prediction"
OUT_DIR = os.path.join(BASE, "app", "backend", "lookups")
os.makedirs(OUT_DIR, exist_ok=True)

# ══════════════════════════════════════════════════════════════════════════════
# 1. Geolocation lookup  (zip_prefix -> avg lat/lng + state + region)
# ══════════════════════════════════════════════════════════════════════════════
geo = pd.read_csv(os.path.join(BASE, "data", "processed", "geolocation_zip_clean.csv"))
# Build a lookup: zip -> (lat, lng, state, region)
# Use the average lat/lng per zip prefix
geo_lookup = {}
for _, row in geo.iterrows():
    zp = str(int(row["geolocation_zip_code_prefix"])).zfill(5)
    geo_lookup[zp] = {
        "lat": round(float(row["geolocation_lat"]), 6),
        "lng": round(float(row["geolocation_lng"]), 6),
        "state": str(row["geolocation_state"]),
        "region": str(row["geolocation_region"]),
    }

with open(os.path.join(OUT_DIR, "geo_zip_lookup.json"), "w") as f:
    json.dump(geo_lookup, f)
print(f"geo_zip_lookup.json: {len(geo_lookup)} zip prefixes")

# ══════════════════════════════════════════════════════════════════════════════
# 2. Target-frequency encoding maps
# ══════════════════════════════════════════════════════════════════════════════
with open(os.path.join(BASE, "data", "final", "target_freq_encodings.pkl"), "rb") as f:
    target_freq_maps = pickle.load(f)

# customer_state -> encoding
state_enc = {k: round(float(v), 8) for k, v in target_freq_maps["customer_state"].items()}
with open(os.path.join(OUT_DIR, "state_target_enc.json"), "w") as f:
    json.dump(state_enc, f, indent=2)
print(f"state_target_enc.json: {len(state_enc)} states")

# dominant_product_category -> encoding
cat_enc = {k: round(float(v), 8) for k, v in target_freq_maps["dominant_product_category"].items()}
with open(os.path.join(OUT_DIR, "category_target_enc.json"), "w") as f:
    json.dump(cat_enc, f, indent=2)
print(f"category_target_enc.json: {len(cat_enc)} categories")

# Global mean (for unseen values)
# We need to compute this from training data
merged = pd.read_csv(os.path.join(BASE, "data", "processed", "merged_raw_orders.csv"),
                     low_memory=False)

# Reproduce the training split to get the correct global mean
merged["order_purchase_timestamp"] = pd.to_datetime(merged["order_purchase_timestamp"])
merged_sorted = merged.sort_values("order_purchase_timestamp").reset_index(drop=True)
train_cutoff = merged_sorted["order_purchase_timestamp"].quantile(0.70)
df_train = merged_sorted[merged_sorted["order_purchase_timestamp"] <= train_cutoff].copy()

global_mean = float(df_train["is_late_delivery"].mean())
print(f"Global mean late delivery rate (training): {global_mean:.6f}")

# ══════════════════════════════════════════════════════════════════════════════
# 3. Training defaults (medians, thresholds)
# ══════════════════════════════════════════════════════════════════════════════

# Compute shipping_limit_lead_days for training set
if "min_shipping_limit_date" in df_train.columns:
    df_train["shipping_limit_lead_days"] = (
        pd.to_datetime(df_train["min_shipping_limit_date"])
        - df_train["order_purchase_timestamp"]
    ).dt.total_seconds() / 86400

# Distance medians
dist_cols = ["minimum_distance_km", "average_distance_km", "maximum_distance_km"]
dist_medians = {c: round(float(df_train[c].median()), 4) for c in dist_cols if c in df_train.columns}

# Payment IQR thresholds (for outlier_payment_count)
# The notebook uses: payments_clean['is_payment_value_outlier'] = iqr_outlier_flag(payments_clean['payment_value'])
# For serving, we need the Q1/Q3 from the training-era payments
# Since we don't have raw payments at serving time, we use total_payment_value
q1_pay = float(df_train["total_payment_value"].quantile(0.25))
q3_pay = float(df_train["total_payment_value"].quantile(0.75))
iqr_pay = q3_pay - q1_pay
pay_upper = q3_pay + 1.5 * iqr_pay

# Price IQR thresholds (for items)
q1_price = float(df_train["total_price"].quantile(0.25))
q3_price = float(df_train["total_price"].quantile(0.75))
iqr_price = q3_price - q1_price
price_upper = q3_price + 1.5 * iqr_price

# Freight IQR thresholds
q1_freight = float(df_train["total_freight_value"].quantile(0.25))
q3_freight = float(df_train["total_freight_value"].quantile(0.75))
iqr_freight = q3_freight - q1_freight
freight_upper = q3_freight + 1.5 * iqr_freight

# is_high_value_order threshold (75th percentile of total_payment_value)
high_value_threshold = float(df_train["total_payment_value"].quantile(0.75))

defaults = {
    "global_mean_late_rate": round(global_mean, 8),
    "approval_lag_hours_median": round(float(df_train["approval_lag_hours"].median()), 4),
    "shipping_limit_lead_days_median": round(float(df_train["shipping_limit_lead_days"].median()), 4),
    "distance_medians": dist_medians,
    "payment_outlier_upper": round(pay_upper, 2),
    "price_outlier_upper": round(price_upper, 2),
    "freight_outlier_upper": round(freight_upper, 2),
    "high_value_threshold": round(high_value_threshold, 2),
    "categories_list": sorted(cat_enc.keys()),
}

with open(os.path.join(OUT_DIR, "training_defaults.json"), "w") as f:
    json.dump(defaults, f, indent=2)
print(f"training_defaults.json saved")
print(f"  approval_lag_hours_median: {defaults['approval_lag_hours_median']}")
print(f"  shipping_limit_lead_days_median: {defaults['shipping_limit_lead_days_median']}")
print(f"  payment_outlier_upper: {defaults['payment_outlier_upper']}")
print(f"  high_value_threshold: {defaults['high_value_threshold']}")
print(f"  categories: {defaults['categories_list']}")

print("\nAll lookup files generated successfully!")
