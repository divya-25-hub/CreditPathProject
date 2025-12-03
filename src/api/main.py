from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

from src.utils.risk_logic import risk_category
from src.utils.recovery_recommendations import recovery_action

app = FastAPI()

origins = [
    "https://legendary-space-sniffle-r7g5pvq6j552p56q-3000.app.github.dev",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ALLOW EVERYTHING (temporary)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("src/models/xgboost_model.pkl")

class LoanData(BaseModel):
    income: float
    loan_amount: float
    credit_score: int
    ltv: float
    dtir1: float

@app.get("/")
def root():
    return {"message": "API running"}

@app.post("/predict/")
def predict(data: LoanData):
    df = pd.DataFrame([data.dict()])
    
    prob = model.predict_proba(df)[0][1]
    category = risk_category(prob)
    action = recovery_action(category)

    return {
        "risk_category": category,
        "probability": round(prob, 4),
        "recommendation": action
    }
