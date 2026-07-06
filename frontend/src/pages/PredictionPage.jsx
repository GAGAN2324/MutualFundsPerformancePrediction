import React, { useState } from "react";
import api from "../services/api";

export default function PredictionPage() {

    const [fundName, setFundName] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = async () => {
        if (!fundName.trim()) {
            alert("Enter fund name");
            return;
        }

        try {
            setLoading(true);
            const response = await api.post("/predict", {
                fundName: fundName
            });

            setResult(response.data);
        } catch (err) {
            console.error(err);
            alert("Error fetching prediction");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
            <h2>Mutual Fund NAV Prediction</h2>

            <input
                value={fundName}
                onChange={(e) => setFundName(e.target.value)}
                placeholder="Enter Fund Name"
                style={{
                    padding: "10px",
                    width: "100%",
                    marginBottom: "10px",
                    fontSize: "16px"
                }}
            />

            <button
                onClick={handlePredict}
                style={{
                    width: "100%",
                    padding: "12px",
                    background: "black",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px"
                }}
            >
                {loading ? "Predicting..." : "Predict NAV"}
            </button>

            {result && (
                <div style={{ marginTop: "20px", padding: "15px", border: "1px solid gray" }}>
                    <h3>Prediction Result</h3>
                    <p><strong>Fund Name:</strong> {result.fundName}</p>
                    <p><strong>Predicted NAV:</strong> {result.predictedNextNav}</p>
                    <p><strong>RMSE:</strong> {result.rmse}</p>
                    <p><strong>Sharpe Ratio:</strong> {result.sharpe}</p>
                </div>
            )}
        </div>
    );
}
