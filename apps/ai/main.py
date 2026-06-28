"""HomeFixr AI service (FastAPI).

Iteration 0 provides the service skeleton only: a single health endpoint so the
service can run, deploy, and be monitored. The actual AI features are added in
later iterations and are deliberately lightweight and free:

  - Fair-price recommendation (Iteration 6): rule-based + small scikit-learn model
  - Fraud detection (Iteration 11): rule-based signals + lightweight classifier

No machine-learning code exists yet.
"""
from fastapi import FastAPI

app = FastAPI(title="HomeFixr AI Service", version="0.1.0")


@app.get("/health")
def health():
    """Liveness probe used by the host platform and uptime checks."""
    return {"status": "ok", "service": "homefixr-ai"}
