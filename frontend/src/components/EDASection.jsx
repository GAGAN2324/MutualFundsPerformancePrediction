import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
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

  const modelColors = {
    LINEAR: { from: "#34e89e", to: "#0f8a4a" },
    RF: { from: "#ff7676", to: "#c0392b" },
    DRIFT: { from: "#4fc3ff", to: "#1465a6" },
  };

  const getModelColor = (model) =>
    modelColors[model] || { from: "#00eaff", to: "#0088a3" };

  const rankBadge = (rank) => {
    if (rank === 1) return { bg: "linear-gradient(135deg,#ffe27a,#c9a227)", fg: "#3a2a00" };
    if (rank === 2) return { bg: "linear-gradient(135deg,#eceff1,#a3a9ad)", fg: "#2a2a2a" };
    if (rank === 3) return { bg: "linear-gradient(135deg,#e3a978,#a0602f)", fg: "#2a1400" };
    return { bg: "rgba(255,255,255,0.08)", fg: "#c9d8e6" };
  };

  const sortedAlgorithms = [...algorithms].sort((a, b) => a.rank - b.rank);

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
            Algorithm Comparison & Ratings
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

          {/* ACCURACY LEADERBOARD */}
          <div style={{ marginTop: 34 }}>
            <div style={chartSubHeading}>Accuracy by Model</div>
            <div style={leaderboardWrap}>
              {sortedAlgorithms.map((algo, index) => {
                const c = getModelColor(algo.model);
                const badge = rankBadge(algo.rank);
                return (
                  <div key={index} style={leaderRow}>
                    <div
                      style={{
                        ...rankCircle,
                        background: badge.bg,
                        color: badge.fg
                      }}
                    >
                      {algo.rank}
                    </div>
                    <div style={leaderInfo}>
                      <div style={leaderTopLine}>
                        <span style={leaderModelName}>{algo.model}</span>
                        <span style={leaderAccuracyValue}>{algo.accuracy}%</span>
                      </div>
                      <div style={barTrack}>
                        <div
                          style={{
                            ...barFill,
                            width: `${Math.min(100, Math.max(0, algo.accuracy))}%`,
                            background: `linear-gradient(90deg, ${c.from}, ${c.to})`,
                            boxShadow:
                              algo.rank === 1 ? `0 0 14px ${c.from}99` : "none"
                          }}
                        />
                      </div>
                      <div style={leaderSubLine}>
                        {algo.rating} &nbsp;·&nbsp; {algo.rank === 1 ? "Best Model" : "Good"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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

const chartSubHeading = {
  color: "#9fe8ff",
  fontWeight: 600,
  fontSize: 15,
  marginBottom: 16,
};

const leaderboardWrap = {
  display: "flex",
  flexDirection: "column",
  gap: 18,
};

const leaderRow = {
  display: "flex",
  alignItems: "center",
  gap: 16,
};

const rankCircle = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: 15,
  flexShrink: 0,
};

const leaderInfo = {
  flex: 1,
  minWidth: 0,
};

const leaderTopLine = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 6,
};

const leaderModelName = {
  color: "#e8f4fb",
  fontWeight: 700,
  fontSize: 14,
  letterSpacing: 0.5,
};

const leaderAccuracyValue = {
  color: "#fff",
  fontWeight: 800,
  fontSize: 14,
};

const barTrack = {
  width: "100%",
  height: 10,
  borderRadius: 6,
  background: "rgba(255,255,255,0.06)",
  overflow: "hidden",
};

const barFill = {
  height: "100%",
  borderRadius: 6,
  transition: "width 0.6s ease",
};

const leaderSubLine = {
  marginTop: 6,
  color: "#8aa0b6",
  fontSize: 12,
  fontWeight: 500,
};
