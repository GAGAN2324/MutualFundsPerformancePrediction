import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    ResponsiveContainer
} from "recharts";

export default function ModelComparison({ modelData }) {
    if (!modelData || modelData.length === 0) {
        return (
            <div className="card" style={{ height: 320, padding: 25 }}>
                <h2>Model Prediction Comparison</h2>
                <p>No model data available</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h2>Model Prediction Comparison</h2>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={modelData}>
                    <CartesianGrid stroke="rgba(255,255,255,0.10)" />
                    <XAxis dataKey="date" stroke="#9bb6ff" />
                    <YAxis stroke="#9bb6ff" />
                    <Tooltip />
                    <Legend />

                    <Line type="monotone" dataKey="ARIMA" stroke="#00eaff" strokeWidth={3} />
                    <Line type="monotone" dataKey="LINEAR" stroke="#ffc846" strokeWidth={3} />
                    <Line type="monotone" dataKey="RF" stroke="#48ff5a" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
