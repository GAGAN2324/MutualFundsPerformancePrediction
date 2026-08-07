import React from "react";
import { useOutletContext } from "react-router-dom";
import AlgorithmTable from "../components/AlgorithmTable";
import ModelAccuracyChart from "../components/ModelComparison";

export default function ModelComparisonPage() {
  const { fund, eda, modelData } = useOutletContext();
  const algorithms = eda?.algorithms || [];

  return (
    <div>
      <h1 className="page-title">Prediction Model Comparison</h1>
      <p className="page-subtitle">
        {fund ? `Fund: ${fund}` : "Select a fund on the Dashboard first."}
      </p>

      {algorithms.length ? (
        <>
          <AlgorithmTable algorithms={algorithms} />
          <div style={{ marginTop: 20 }}>
            <ModelAccuracyChart modelData={modelData} />
          </div>
        </>
      ) : (
        <div className="empty-prompt">
          Load a fund's EDA on the Dashboard to see its model comparison here.
        </div>
      )}
    </div>
  );
}
