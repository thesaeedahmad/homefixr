# HomeFixr — AI Service

A lightweight Python (FastAPI) microservice for HomeFixr's AI features. All AI
is lightweight and uses only free, open-source libraries.

## Features
- `GET /health` — liveness probe.
- `POST /predict-price` — **fair hourly-rate recommendation** (Iteration 6).
  A small scikit-learn linear-regression model (trained at startup on a seed
  dataset) predicts a fair hourly rate from the job's category + complexity.

  Request: `{ "category": "PLUMBING", "complexity": 3, "estimatedHours": 2 }`
  Response: `{ "category", "hourlyRate": {min,typical,max}, "total": {min,typical,max} | null }`

## Run locally

```bash
cd apps/ai
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Interactive API docs: http://localhost:8000/docs
