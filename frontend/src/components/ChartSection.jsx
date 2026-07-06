import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ChartSection({ actual = [], predicted = [], dates = [], modelData = [] }) {

  const chartData = dates.length > 0
    ? dates.map((d, i) => ({
        date: d,
        actual: actual[i] || 0,
        predicted: predicted[i] || 0,
      }))
    : [
        { date: "Jan", actual: 100, predicted: 102 },
        { date: "Feb", actual: 105, predicted: 107 },
        { date: "Mar", actual: 110, predicted: 112 },
      ];

  const safeModelData = modelData.length > 0
    ? modelData
    : [
        { date: "Jan", ARIMA: 102, LINEAR: 101, RF: 103 },
        { date: "Feb", ARIMA: 107, LINEAR: 106, RF: 108 },
        { date: "Mar", ARIMA: 112, LINEAR: 110, RF: 113 },
      ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

      <div className="premium-card">
        <h2>NAV Trend — Actual vs Predicted</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="actual" stroke="#4aa3ff" strokeWidth={3} />
            <Line type="monotone" dataKey="predicted" stroke="#00eaff" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="premium-card">
        <h2>Model Prediction Comparison</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={safeModelData}>
            <CartesianGrid stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="ARIMA" stroke="#00eaff" strokeWidth={3} />
            <Line type="monotone" dataKey="LINEAR" stroke="#ffc846" strokeWidth={3} />
            <Line type="monotone" dataKey="RF" stroke="#48ff5a" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}