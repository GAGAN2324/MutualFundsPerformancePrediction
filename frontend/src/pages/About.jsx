import React from "react";

const TECH = [
  { name: "React", role: "Frontend framework" },
  { name: "Spring Boot", role: "Backend REST API" },
  { name: "Java", role: "Backend language" },
  { name: "Recharts", role: "Data visualization" },
  { name: "Axios", role: "API communication" },
  { name: "jsPDF + html2canvas", role: "PDF report export" },
];

const WORKFLOW = [
  { title: "Data Ingestion", desc: "Historical NAV data is loaded per fund/AMC." },
  { title: "Statistical Analysis", desc: "Mean, standard deviation, and volatility are computed to classify risk." },
  { title: "Model Training", desc: "Drift, Linear Regression, and Random Forest models run over the historical series." },
  { title: "Forecast Generation", desc: "Each model produces a forward NAV forecast, ranked and compared for accuracy." },
  { title: "Presentation", desc: "Results are surfaced through the dashboard, prediction charts, and downloadable report." },
];

export default function About() {
  return (
    <div>
      <h1 className="page-title">Mutual Fund Performance Prediction</h1>
      <p className="page-subtitle">
        A full-stack platform for NAV forecasting, SIP projection, and model comparison.
      </p>

      <div className="card" style={{ marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>Project Overview</h3>
        <p>
          This platform tracks mutual fund NAV performance, calculates SIP returns, and forecasts
          future NAV using three complementary forecasting approaches — giving investors a clear,
          data-driven view backed by transparent model comparison.
        </p>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Objective</h3>
        <p>
          To help investors understand how a mutual fund has performed historically and how it's
          likely to move going forward, without relying on a single black-box prediction.
        </p>
      </div>

      <h3 style={{ marginTop: 26 }}>Technologies Used</h3>
      <div className="about-grid">
        {TECH.map((t) => (
          <div key={t.name} className="tech-chip">
            <div className="tech-name">{t.name}</div>
            <div className="tech-role">{t.role}</div>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 26 }}>Prediction Workflow</h3>
      <div className="card workflow-list">
        {WORKFLOW.map((w, i) => (
          <div key={w.title} className="workflow-step">
            <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <div className="step-title">{w.title}</div>
              <div className="step-desc">{w.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 20 }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Algorithms Used</h3>
          <ul>
            <li>Drift-based forecasting (baseline)</li>
            <li>Linear Regression</li>
            <li>Random Forest</li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Dataset Description</h3>
          <p style={{ margin: 0 }}>
            Historical NAV values per fund, keyed by AMC and fund name, used to train and evaluate
            each forecasting model.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Future Enhancements</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>Persist and retrieve real historical NAV data from a live mutual fund API instead of static CSVs</li>
          <li>Add authentication for personalized SIP tracking</li>
          <li>Expand ML model comparison with more sophisticated time-series techniques</li>
        </ul>
      </div>
    </div>
  );
}
