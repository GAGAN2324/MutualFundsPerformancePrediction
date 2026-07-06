import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#00eaff", "#48ff5a", "#ffc846"];

export default function PieCharts({ actual = [], predicted = [], modelData = [] }) {

  const summaryData = [
    { name: "Actual NAV", value: actual[actual.length - 1] || 118 },
    { name: "Predicted NAV", value: predicted[predicted.length - 1] || 122 },
  ];

  const comparisonData = modelData.length > 0
    ? [
        { name: "ARIMA", value: modelData[modelData.length - 1].ARIMA },
        { name: "LINEAR", value: modelData[modelData.length - 1].LINEAR },
        { name: "RF", value: modelData[modelData.length - 1].RF },
      ]
    : [
        { name: "ARIMA", value: 120 },
        { name: "LINEAR", value: 115 },
        { name: "RF", value: 118 },
      ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>

      <div className="premium-card">
        <h2>Prediction Summary</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={summaryData}
              dataKey="value"
              innerRadius={70}
              outerRadius={110}
            >
              {summaryData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="premium-card">
        <h2>Model Distribution</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={comparisonData}
              dataKey="value"
              innerRadius={70}
              outerRadius={110}
            >
              {comparisonData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}