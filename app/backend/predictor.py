import joblib
import pandas as pd
from pathlib import Path
from .feature_builder import build_features

# ── Paths ─────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / "models" / "champion_model.pkl"
SCALER_PATH = BASE_DIR / "data" / "final" / "scaler.pkl"

# Load model and scaler
model_artifact = joblib.load(MODEL_PATH)
if isinstance(model_artifact, dict) and "model" in model_artifact:
    model = model_artifact["model"]
    optimal_threshold = float(model_artifact.get("threshold", 0.5))
else:
    model = model_artifact
    optimal_threshold = 0.5

scaler = joblib.load(SCALER_PATH)

# Preserve the exact feature order the scaler was trained on
SCALER_FEATURES = list(scaler.feature_names_in_)  # 44 feature names

# ── Risk thresholds ─────────────────────────────────────
LOW_THRESHOLD = 0.30
HIGH_THRESHOLD = 0.55

def classify_risk(probability: float) -> str:
    if probability < LOW_THRESHOLD:
        return "Low"
    if probability < HIGH_THRESHOLD:
        return "Medium"
    return "High"

def predict(raw_input: dict) -> dict:
    """
    Compute features using feature_builder and return prediction results.
    """
    df = build_features(raw_input)
    prob = float(model.predict_proba(df)[0][1])
    return {
        "probability": round(prob, 4),
        "risk_label": classify_risk(prob),
        "predicted_class": int(prob >= optimal_threshold),
        "thresholds_used": {
            "low_threshold": LOW_THRESHOLD,
            "high_threshold": HIGH_THRESHOLD,
            "decision_threshold": optimal_threshold,
        },
        "features_computed": len(df.columns),
    }
