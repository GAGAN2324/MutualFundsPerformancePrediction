import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import AMCSelector from "../components/AMCSelector";

const QUICK_LINKS = [
  { to: "/prediction", icon: "📈", label: "Prediction", desc: "Run a NAV forecast" },
  { to: "/analytics", icon: "📊", label: "Analytics", desc: "EDA, risk & volatility" },
  { to: "/model-comparison", icon: "📋", label: "Model Comparison", desc: "Ranked accuracy table" },
  { to: "/understanding-models", icon: "📚", label: "Understanding Models", desc: "How each model works" },
];

function riskClass(risk) {
  const key = (risk || "").toString().toLowerCase().replace(/\s+/g, "-");
  return `risk-badge risk-${key || "medium"}`;
}

export default function Dashboard() {
  const {
    amcList,
    selectedAMC,
    setSelectedAMC,
    fundList,
    fund,
    setFund,
    eda,
    predictionData,
    loading,
    loadEDA,
  } = useOutletContext();

  const algorithms = eda?.algorithms || [];
  const bestAlgo = [...algorithms].sort((a, b) => a.rank - b.rank)[0];

  const currentNav = eda?.navValues?.length
    ? eda.navValues[eda.navValues.length - 1]
    : null;

  const predicted = predictionData?.prediction || [];
  const latestPredictedNav = predicted.length ? predicted[predicted.length - 1] : null;

  return (
    <div>
      <h1 className="page-title">Fund Performance Overview</h1>
      <p className="page-subtitle">
        Select an AMC and fund to view its live NAV, forecast, and risk profile.
      </p>

      <div className="card" style={{ marginTop: 20 }}>
        <h3 style={{ marginTop: 0 }}>Select AMC</h3>
        <AMCSelector selectedAMC={selectedAMC} onSelect={setSelectedAMC} amcList={amcList} />

        {selectedAMC && (
          <>
            <h3 style={{ marginTop: 20 }}>Select Fund</h3>
            <select className="select" value={fund} onChange={(e) => setFund(e.target.value)}>
              <option value="">Choose Fund</option>
              {fundList.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>

            <button className="btn primary" onClick={loadEDA} style={{ marginTop: 10 }}>
              Load EDA
            </button>
          </>
        )}

        {loading && <p>Loading...</p>}
      </div>

      {eda ? (
        <>
          <div className="summary-grid">
            <div className="summary-card">
              <div className="stat-key">Current NAV</div>
              <div className="stat-value">{currentNav != null ? currentNav.toFixed(2) : "—"}</div>
            </div>
            <div className="summary-card">
              <div className="stat-key">Latest Predicted NAV</div>
              <div className="stat-value">
                {latestPredictedNav != null ? latestPredictedNav.toFixed(2) : "—"}
              </div>
            </div>
            <div className="summary-card">
              <div className="stat-key">Best Performing Model</div>
              <div className="stat-value">{bestAlgo?.model || "—"}</div>
            </div>
            <div className="summary-card">
              <div className="stat-key">Prediction Accuracy</div>
              <div className="stat-value">
                {bestAlgo?.accuracy != null ? `${bestAlgo.accuracy}%` : "—"}
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div className="stat-key">Risk Level</div>
              <div style={{ marginTop: 8 }}>
                <span className={riskClass(eda?.riskLevel)}>{eda?.riskLevel || "—"}</span>
              </div>
            </div>
            {!predictionData && (
              <p style={{ margin: 0, maxWidth: 340, fontSize: 13 }}>
                Head to the Prediction page and run a forecast to fill in the predicted NAV above.
              </p>
            )}
          </div>
        </>
      ) : (
        !loading && (
          <div className="empty-prompt">Select an AMC and fund above, then click "Load EDA" to begin.</div>
        )
      )}

      <h3 style={{ marginTop: 30 }}>Quick Navigation</h3>
      <div className="quicknav-grid">
        {QUICK_LINKS.map((l) => (
          <Link key={l.to} to={l.to} className="quicknav-card">
            <div className="qn-icon">{l.icon}</div>
            <div className="qn-label">{l.label}</div>
            <div className="qn-desc">{l.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
