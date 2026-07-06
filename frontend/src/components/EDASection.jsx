import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
  LabelList
} from "recharts";

export default function EDASection({ eda }) {
  if (!eda) return null;

  const history = eda.navValues || [];
  const dates = eda.dates || [];
  const algorithms = eda.algorithms || [];

  if (!history.length) return null;

  const mean = eda.meanNav || 0;
  const stddev = eda.stdDeviation || 0;
  const volatility = eda.volatility || 0;
  const riskLevel = eda.riskLevel || "N/A";

  const [showDataset, setShowDataset] = useState(false);
  const [showCalc, setShowCalc] = useState(true);

  const chartData = history.map((v, i) => ({
    index: i + 1,
    nav: v
  }));

  const sumSquared = history.reduce(
    (acc, val) => acc + Math.pow(val - mean, 2),
    0
  );

  const getBarColor = (model) => {
    if (model === "LINEAR") return "#2ecc71";
    if (model === "RF") return "#e74c3c";
    return "#3498db";
  };

  return (
    <div style={container}>

      <h2 style={title}>Exploratory Data Analysis (EDA)</h2>

      {/* SUMMARY CARDS */}
      <div style={cardGrid}>
        <Card label="Mean NAV" value={mean.toFixed(2)} />
        <Card label="Std. Deviation" value={stddev.toFixed(2)} />
        <Card label="Volatility" value={volatility.toFixed(2) + "%"} />
        <Card label="Risk Level" value={riskLevel} />
      </div>

      {/* AREA CHART (FIXED SIZE) */}
      <div style={{ marginTop: 25, overflowX: "auto" }}>
        <AreaChart
          width={900}
          height={300}
          data={chartData}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2c3e50" />
          <XAxis dataKey="index" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="nav"
            stroke="#00eaff"
            fill="#00eaff"
            fillOpacity={0.2}
          />
          <ReferenceLine
            y={mean}
            stroke="#ffb86b"
            strokeDasharray="4 4"
          />
        </AreaChart>
      </div>

      {/* DATASET PREVIEW */}
      <div style={sectionHeader} onClick={() => setShowDataset(!showDataset)}>
        <span>Fund Dataset Preview</span>
        <span>{showDataset ? "▼" : "▶"}</span>
      </div>

      {showDataset && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>NAV</th>
            </tr>
          </thead>
          <tbody>
            {history.map((value, i) => (
              <tr key={i}>
                <td style={tdStyle}>{dates[i] || "-"}</td>
                <td style={tdStyle}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* CALCULATIONS */}
      <div style={sectionHeader} onClick={() => setShowCalc(!showCalc)}>
        <span>How Mean & Std. Deviation Are Calculated</span>
        <span>{showCalc ? "▼" : "▶"}</span>
      </div>

      {showCalc && (
        <div style={calcContainer}>
          <p><strong>Mean = {mean.toFixed(4)}</strong></p>
          <p>StdDev = √( Σ (NAV - Mean)² / n )</p>

          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>NAV</th>
                <th style={thStyle}>NAV - Mean</th>
                <th style={thStyle}>(NAV - Mean)²</th>
              </tr>
            </thead>
            <tbody>
              {history.map((value, i) => {
                const diff = value - mean;
                const sq = diff * diff;
                return (
                  <tr key={i}>
                    <td style={tdStyle}>{value.toFixed(2)}</td>
                    <td
                      style={{
                        ...tdStyle,
                        color: diff < 0 ? "#ff6b6b" : "#2ecc71"
                      }}
                    >
                      {diff.toFixed(4)}
                    </td>
                    <td style={tdStyle}>{sq.toFixed(4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <p>
            Σ (NAV - Mean)² = <strong>{sumSquared.toFixed(4)}</strong>
          </p>

          <p>
            StdDev = √({sumSquared.toFixed(4)} / {history.length}) =
            <strong> {stddev.toFixed(4)}</strong>
          </p>

          <p>
            Volatility = <strong>{volatility.toFixed(2)}%</strong>
          </p>
        </div>
      )}

      {/* ALGORITHM SECTION */}
      {algorithms.length > 0 && (
        <div style={algoCard}>
          <h2 style={{ color: "#00eaff", marginBottom: 20 }}>
            ⚡ Algorithm Comparison & Ratings
          </h2>

          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Model</th>
                <th style={thStyle}>Predicted</th>
                <th style={thStyle}>Mean</th>
                <th style={thStyle}>Accuracy</th>
                <th style={thStyle}>Rating</th>
                <th style={thStyle}>Rank</th>
                <th style={thStyle}>Performance</th>
              </tr>
            </thead>
            <tbody>
              {algorithms.map((algo, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{algo.model}</td>
                  <td style={tdStyle}>{algo.predicted}</td>
                  <td style={tdStyle}>{algo.mean}</td>
                  <td style={tdStyle}>{algo.accuracy}%</td>
                  <td style={tdStyle}>{algo.rating}</td>
                  <td style={tdStyle}>{algo.rank}</td>
                  <td style={tdStyle}>
                    {algo.rank === 1 ? "Best Model" : "Good"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* BAR CHART (FIXED SIZE) */}
          <div style={{ marginTop: 25, overflowX: "auto" }}>
            <BarChart
              width={900}
              height={300}
              data={algorithms}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2c3e50" />
              <XAxis dataKey="model" stroke="#aaa" />
              <YAxis domain={[0, 100]} stroke="#aaa" />
              <Tooltip />
              <Bar dataKey="accuracy">
                {algorithms.map((entry, index) => (
                  <Cell key={index} fill={getBarColor(entry.model)} />
                ))}
                <LabelList dataKey="accuracy" position="top" fill="#fff" />
              </Bar>
            </BarChart>
          </div>
        </div>
      )}

    </div>
  );
}

/* STYLES */

const container = {
  background: "rgba(255,255,255,0.03)",
  padding: 25,
  borderRadius: 16,
  marginTop: 30,
};

const title = { color: "#00eaff" };

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2,1fr)",
  gap: 20,
  marginTop: 20,
};

function Card({ label, value }) {
  return (
    <div style={{
      background: "rgba(0,0,0,0.2)",
      padding: 15,
      borderRadius: 12,
    }}>
      <div style={{ color: "#9fe8ff" }}>{label}</div>
      <div style={{ fontSize: 22 }}>{value}</div>
    </div>
  );
}

const sectionHeader = {
  marginTop: 25,
  padding: 12,
  cursor: "pointer",
  background: "rgba(255,255,255,0.05)",
  borderRadius: 10,
  display: "flex",
  justifyContent: "space-between",
};

const tableStyle = {
  width: "100%",
  marginTop: 10,
  borderCollapse: "collapse",
};

const thStyle = {
  padding: 10,
  textAlign: "left",
  borderBottom: "1px solid rgba(255,255,255,0.1)",
};

const tdStyle = {
  padding: 10,
  borderBottom: "1px solid rgba(255,255,255,0.05)",
};

const calcContainer = {
  marginTop: 15,
  padding: 20,
  background: "rgba(255,255,255,0.03)",
  borderRadius: 12,
};

const algoCard = {
  marginTop: 40,
  background: "rgba(15,23,42,0.8)",
  padding: 35,
  borderRadius: 18,
  boxShadow: "0 0 40px rgba(0, 234, 255, 0.08)"
};