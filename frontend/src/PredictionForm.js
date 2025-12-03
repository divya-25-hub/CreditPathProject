import React, { useState } from "react";
import { predictRisk } from "./api";

function PredictionForm() {
  const [form, setForm] = useState({
    income: "",
    loan_amount: "",
    credit_score: "",
    ltv: "",
    dtir1: "",
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      income: Number(form.income),
      loan_amount: Number(form.loan_amount),
      credit_score: Number(form.credit_score),
      ltv: Number(form.ltv),
      dtir1: Number(form.dtir1),
    };

    const response = await predictRisk(payload);
    if (response) setResult(response);
  };

  return (
    <div>
      <h2>Loan Risk Prediction</h2>

      <form onSubmit={handleSubmit}>
        <input name="income" type="number" placeholder="Income"
          value={form.income} onChange={handleChange} />

        <input name="loan_amount" type="number" placeholder="Loan Amount"
          value={form.loan_amount} onChange={handleChange} />

        <input name="credit_score" type="number" placeholder="Credit Score"
          value={form.credit_score} onChange={handleChange} />

        <input name="ltv" type="number" placeholder="LTV"
          value={form.ltv} onChange={handleChange} />

        <input name="dtir1" type="number" placeholder="DTI"
          value={form.dtir1} onChange={handleChange} />

        <button type="submit">Predict</button>
      </form>

      {result && (
        <div>
          <h3>{result.risk_category}</h3>
          <p>Probability: {result.probability}</p>
          <p>Recommended Action: {result.recommendation}</p>
        </div>
      )}
    </div>
  );
}

export default PredictionForm;
