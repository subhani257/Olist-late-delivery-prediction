import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .schema import OrderInput, PredictionResponse
from .predictor import predict

# ── Logging ────────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Olist Late Delivery Risk API",
    description=(
        "Predicts whether a newly placed order is at risk of late delivery "
        "using only information available before dispatch."
    ),
    version="1.0.0",
)

# CORS — allow the frontend (any origin during development) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ── Routes ─────────────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Olist Late Delivery Risk API is running."}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}


@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict_route(order: OrderInput):
    try:
        result = predict(order.model_dump())
        logger.info(f"Prediction result: {result}")
        return result
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

# Reload trigger

