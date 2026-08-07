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

/* Dark, theme-matched tooltip (replaces Recharts' default white box) */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={tooltipStyles.box}>
      <div style={tooltipStyles.label}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={tooltipStyles.row}>
          <span style={{ ...tooltipStyles.dot, background: p.color }} />
          <span style={tooltipStyles.name}>{p.name}</span>
          <span style={tooltipStyles.value}>
            {typeof p.value === "number" ? p.value.toFixed(2) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ChartSection({ actual = [], predicted = [], dates = [], modelData = [] }) {
  const chartData =
    dates.length > 0
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

  const safeModelData =
    modelData.length > 0
      ? modelData
      : [
          { date: "Jan", DRIFT: 102, LINEAR: 101, RF: 103 },
          { date: "Feb", DRIFT: 107, LINEAR: 106, RF: 108 },
          { date: "Mar", DRIFT: 112, LINEAR: 110, RF: 113 },
        ];

  return (
    <div style={styles.grid}>
      <div className="premium-card" style={styles.card}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>NAV Trend</h2>
          <span style={styles.subtitle}>Actual vs. predicted NAV over the forecast horizon</span>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--muted)" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
            <YAxis stroke="var(--muted)" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
            <Legend wrapperStyle={styles.legend} iconType="circle" iconSize={9} />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual NAV"
              stroke="#4aa3ff"
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              name="Predicted NAV"
              stroke="#00eaff"
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="premium-card" style={styles.card}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>Model Prediction Comparison</h2>
          <span style={styles.subtitle}>Forecasted NAV by model across the horizon</span>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={safeModelData} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--muted)" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
            <YAxis stroke="var(--muted)" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
            <Legend wrapperStyle={styles.legend} iconType="circle" iconSize={9} />
            <Line type="monotone" dataKey="DRIFT" stroke="#00eaff" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="LINEAR" stroke="#ffc846" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="RF" stroke="#48ff5a" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: 20,
  },
  card: {
    padding: "22px 22px 18px",
  },
  headerRow: {
    marginBottom: 6,
  },
  title: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: "var(--accent-2)",
    letterSpacing: 0.2,
  },
  subtitle: {
    display: "block",
    marginTop: 4,
    fontSize: 12.5,
    color: "var(--muted)",
    opacity: 0.8,
    fontWeight: 500,
  },
  legend: {
    fontSize: 12.5,
    color: "var(--text)",
    paddingTop: 8,
  },
};

const tooltipStyles = {
  box: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "10px 14px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.45)",
  },
  label: {
    color: "var(--muted)",
    fontSize: 11.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "var(--text)",
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
  },
  name: {
    fontWeight: 600,
  },
  value: {
    marginLeft: "auto",
    fontWeight: 700,
    color: "#fff",
  },
};
