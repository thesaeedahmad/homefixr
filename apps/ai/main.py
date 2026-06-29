"""HomeFixr AI service (FastAPI).

Endpoints:
  GET  /health         — liveness probe
  POST /predict-price  — fair hourly-rate recommendation (Iteration 6)

The model is lightweight and free (see model.py). The Express API calls this
service over HTTP; the recommendation is advisory only.
"""
from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from model import CATEGORIES, PriceModel

app = FastAPI(title="HomeFixr AI Service", version="0.2.0")

# Train once at startup and reuse for every request.
price_model = PriceModel()


class PriceRequest(BaseModel):
    category: str
    complexity: int = 3
    estimatedHours: Optional[float] = None


def band(value: float, spread: float = 0.15) -> dict:
    """A min / typical / max range around a predicted value."""
    return {
        "min": round(value * (1 - spread)),
        "typical": round(value),
        "max": round(value * (1 + spread)),
    }


@app.get("/health")
def health():
    return {"status": "ok", "service": "homefixr-ai"}


@app.post("/predict-price")
def predict_price(req: PriceRequest):
    if req.category not in CATEGORIES:
        raise HTTPException(status_code=400, detail="Unknown category")

    rate = price_model.predict_rate(req.category, req.complexity)
    result = {"category": req.category, "hourlyRate": band(rate), "total": None}

    if req.estimatedHours and req.estimatedHours > 0:
        result["total"] = band(rate * req.estimatedHours)

    return result
