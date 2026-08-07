import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import AMCSelector from "../components/AMCSelector";

const QUICK_LINKS = [
  { to: "/analytics", icon: "📊", label: "Analytics", desc: "EDA, risk & volatility" },
  { to: "/prediction", icon: "📈", label: "Prediction", desc: "Run a NAV forecast" },
  { to: "/model-comparison", icon: "📋", label: "Model Comparison", desc: "Compare model predictions" },
  { to: "/sip-calculator", icon: "💰", label: "SIP Calculator", desc: "Project SIP returns" },
  { to: "/understanding-models", icon: "📚", label: "Understanding Models", desc: "How each model works" },
];

export default function Dashboard() {
  const { amcList, selectedAMC, setSelectedAMC, fundList, fund, setFund } =
    useOutletContext();

  return (
    <div>
      <h1 className="page-title">Fund Performance Overview</h1>
      <p className="page-subtitle">
        Select an AMC and fund, then head into Analytics, Prediction, or Model
        Comparison for the details.
      </p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Select AMC</h3>
        <AMCSelector
          selectedAMC={selectedAMC}
          onSelect={setSelectedAMC}
          amcList={amcList}
        />

        {selectedAMC && (
          <>
            <h3 style={{ marginTop: 20 }}>Select Fund</h3>
            <select
              className="select"
              value={fund}
              onChange={(e) => setFund(e.target.value)}
            >
              <option value="">Choose Fund</option>
              {fundList.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </>
        )}

        {fund && (
          <div className="dash-selected-fund">
            <span className="risk-badge risk-low">Selected: {fund}</span>
            <Link to="/analytics" className="btn primary dash-continue-btn">
              Continue to Analytics →
            </Link>
          </div>
        )}
      </div>

      <h3 className="section-heading">Quick Navigation</h3>
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
