import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import ModelAccuracyChart from "../components/ModelComparison";

export default function ModelComparisonPage() {
  const { fund, predictionData, modelData } = useOutletContext();

  return (
    <div>
      <h1 className="page-title">Model Prediction Comparison</h1>
      <p className="page-subtitle">
        {fund ? `Fund: ${fund}` : "Select a fund on the Dashboard first."}
      </p>

      {predictionData ? (
        <>
          <ModelAccuracyChart modelData={modelData} />

          <div className="sip-cta-card">
            <div className="sip-cta-icon">💰</div>
            <div className="sip-cta-body">
              <div className="sip-cta-title">See what this fund could earn you</div>
              <div className="sip-cta-desc">
                Project SIP returns for this fund and download the full PDF
                report on the SIP Calculator page.
              </div>
            </div>
            <Link to="/sip-calculator" className="sip-cta-btn">
              Continue to SIP Calculator →
            </Link>
          </div>
        </>
      ) : (
        <div className="empty-prompt">
          Run a prediction on the Prediction page first to see the model
          comparison here.
        </div>
      )}
    </div>
  );
}
