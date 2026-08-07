import React from "react";
import { useOutletContext } from "react-router-dom";
import ChartSection from "../components/ChartSection";
import PieCharts from "../components/PieCharts";

export default function Prediction() {
  const {
    fund,
    eda,
    predictionData,
    loading,
    handlePredict,
    handleDownloadPDF,
    nextNAV,
    dates,
    predicted,
    actual,
    modelData,
  } = useOutletContext();

  const algorithms = eda?.algorithms || [];
  const bestAlgo = [...algorithms].sort((a, b) => a.rank - b.rank)[0];

  const lastActual = actual.length ? actual[actual.length - 1] : null;
  const trendUp = lastActual != null && nextNAV != null ? nextNAV >= lastActual : null;
  const predictionDate = dates.length ? dates[dates.length - 1] : "—";

  return (
    <div>
      <h1 className="page-title">NAV Forecast</h1>
      <p className="page-subtitle">
        {fund ? `Fund: ${fund}` : "Select a fund on the Dashboard first."}
      </p>

      {!eda && (
        <div className="empty-prompt">
          Load a fund's EDA on the Dashboard before running a prediction.
        </div>
      )}

      {eda && !predictionData && (
        <div className="card" style={{ textAlign: "center" }}>
          <button className="btn primary" onClick={handlePredict} style={{ marginTop: 10 }}>
            Predict Performance
          </button>
          {loading && <p style={{ marginTop: 10 }}>Loading...</p>}
        </div>
      )}

      {predictionData && (
        <div id="reportContent">
          <div className="summary-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div className="summary-card">
              <div className="stat-key">Predicted NAV</div>
              <div className="stat-value">{nextNAV ? nextNAV.toFixed(2) : "—"}</div>
            </div>
            <div className="summary-card">
              <div className="stat-key">Prediction Date</div>
              <div className="stat-value">{predictionDate}</div>
            </div>
            <div className="summary-card">
              <div className="stat-key">Model Used</div>
              <div className="stat-value" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {bestAlgo?.model || "—"}
                {trendUp !== null && (
                  <span className={trendUp ? "risk-badge risk-low" : "risk-badge risk-high"}>
                    {trendUp ? "▲ Up" : "▼ Down"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <ChartSection actual={actual} predicted={predicted} dates={dates} modelData={modelData} />
          </div>

          <PieCharts actual={actual} predicted={predicted} modelData={modelData} />

          <div className="premium-card" style={{ marginTop: 30 }}>
            <h2>📄 Download Report</h2>
            <button
              className="btn primary"
              onClick={handleDownloadPDF}
              style={{ marginTop: 20, padding: "12px 20px", fontSize: 16, borderRadius: 8 }}
            >
              Download Full Professional PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
