"""Fair-price model for HomeFixr.

A deliberately simple, lightweight machine-learning model (linear regression)
that predicts a fair hourly rate from the job's category and a complexity score
(1-5). It is trained at startup on a small, reproducible SEED dataset generated
from sensible per-category base rates plus noise — an approach that keeps the
model free, fast, and easy to explain in the viva, while still demonstrating a
real train/predict pipeline (scikit-learn).
"""
from __future__ import annotations

import numpy as np
from sklearn.linear_model import LinearRegression

# The fixed service categories (must match the API's JobCategory enum).
CATEGORIES = ["PLUMBING", "ELECTRICAL", "APPLIANCES", "HANDYMAN", "CLEANING"]

# Typical base hourly rate per category (PKR), at average complexity (3).
BASE_RATES = {
    "PLUMBING": 800,
    "ELECTRICAL": 900,
    "APPLIANCES": 850,
    "HANDYMAN": 600,
    "CLEANING": 500,
}

# How much each complexity point above/below average shifts the rate (PKR).
COMPLEXITY_SLOPE = 120
MIN_RATE = 200.0


class PriceModel:
    """Trains once and predicts a fair hourly rate."""

    def __init__(self) -> None:
        self.model = LinearRegression()
        self._train()

    def _features(self, category: str, complexity: int) -> list[float]:
        """One-hot encode the category and append the complexity score."""
        one_hot = [1.0 if category == c else 0.0 for c in CATEGORIES]
        return one_hot + [float(complexity)]

    def _train(self) -> None:
        rng = np.random.default_rng(42)  # fixed seed -> reproducible model
        features: list[list[float]] = []
        targets: list[float] = []
        for _ in range(1000):
            category = str(rng.choice(CATEGORIES))
            complexity = int(rng.integers(1, 6))  # 1..5
            base = BASE_RATES[category] + COMPLEXITY_SLOPE * (complexity - 3)
            rate = max(MIN_RATE, base + float(rng.normal(0, 40)))
            features.append(self._features(category, complexity))
            targets.append(rate)
        self.model.fit(np.array(features), np.array(targets))

    def predict_rate(self, category: str, complexity: int) -> float:
        if category not in CATEGORIES:
            raise ValueError("Unknown category")
        complexity = min(5, max(1, complexity))
        rate = float(self.model.predict([self._features(category, complexity)])[0])
        return max(MIN_RATE, rate)
