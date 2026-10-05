"""
schema.py — Pydantic models for the Olist Late Delivery Risk API.

The input schema accepts ~12-15 raw, easy-to-know fields.
The backend computes all 44 model features from these inputs.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class OrderInput(BaseModel):
    """Raw order information that a user can easily provide."""

    # ── Required fields ───────────────────────────────────────────────────────
    purchase_datetime: str = Field(
        ...,
        description="Order purchase date and time (e.g. '2018-05-20 15:30:00')",
        json_schema_extra={"example": "2018-07-15 14:30:00"},
    )
    estimated_delivery_date: str = Field(
        ...,
        description="Estimated delivery date (e.g. '2018-06-05')",
        json_schema_extra={"example": "2018-08-10"},
    )
    customer_zip_prefix: int = Field(
        ...,
        ge=1,
        le=99999,
        description="Customer ZIP code prefix (1 to 5 digits)",
        json_schema_extra={"example": 1001},
    )
    seller_zip_prefix: int = Field(
        ...,
        ge=1,
        le=99999,
        description="Seller ZIP code prefix (1 to 5 digits)",
        json_schema_extra={"example": 4101},
    )
    product_category: str = Field(
        ...,
        description="Product category (e.g. 'bed_bath_table', 'electronics')",
        json_schema_extra={"example": "bed_bath_table"},
    )
    price: float = Field(
        ...,
        gt=0,
        description="Unit price of the product (R$)",
        json_schema_extra={"example": 120.0},
    )
    freight_value: float = Field(
        ...,
        ge=0,
        description="Freight / shipping cost per item (R$)",
        json_schema_extra={"example": 25.0},
    )
    weight_g: float = Field(
        ...,
        ge=0,
        description="Product weight in grams",
        json_schema_extra={"example": 1500.0},
    )
    length_cm: float = Field(
        ...,
        gt=0,
        description="Product package length in cm",
        json_schema_extra={"example": 30.0},
    )
    height_cm: float = Field(
        ...,
        gt=0,
        description="Product package height in cm",
        json_schema_extra={"example": 15.0},
    )
    width_cm: float = Field(
        ...,
        gt=0,
        description="Product package width in cm",
        json_schema_extra={"example": 20.0},
    )
    payment_type: str = Field(
        ...,
        description="Payment method: credit_card, boleto, debit_card, voucher",
        json_schema_extra={"example": "credit_card"},
    )
    installments: int = Field(
        ...,
        ge=0,
        le=24,
        description="Number of payment installments (0 for boleto)",
        json_schema_extra={"example": 3},
    )

    # ── Advanced / optional fields ────────────────────────────────────────────
    item_count: Optional[int] = Field(
        default=1,
        ge=1,
        description="Number of items in the order (default 1)",
        json_schema_extra={"example": 1},
    )
    seller_count: Optional[int] = Field(
        default=1,
        ge=1,
        description="Number of distinct sellers (default 1)",
        json_schema_extra={"example": 1},
    )
    approval_lag_hours: Optional[float] = Field(
        default=None,
        ge=0,
        description="Hours between purchase and payment approval (default = training median)",
        json_schema_extra={"example": 0.31},
    )


class PredictionResponse(BaseModel):
    """Prediction result returned by the API."""

    probability: float = Field(
        ..., description="Late-delivery probability (0-1)"
    )
    risk_label: str = Field(
        ..., description="Risk level: 'Low', 'Medium', or 'High'"
    )
    predicted_class: int = Field(
        ..., description="Binary prediction (0 = on-time, 1 = late)"
    )
    thresholds_used: dict = Field(
        ..., description="Risk thresholds used for classification"
    )
    features_computed: int = Field(
        ..., description="Number of model features computed"
    )
