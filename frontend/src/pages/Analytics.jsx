import React from "react";
import { useOutletContext } from "react-router-dom";
import EDASection from "../components/EDASection";

export default function Analytics() {
  const { fund, eda } = useOutletContext();

  return (
    <div>
      <h1 className="page-title">Statistical Analysis</h1>
      <p className="page-subtitle">
        {fund ? `Fund: ${fund}` : "Select a fund on the Dashboard first."}
      </p>

      {eda ? (
        <EDASection eda={eda} />
      ) : (
        <div className="empty-prompt">
          Load a fund's EDA on the Dashboard to see its analytics here.
        </div>
      )}
    </div>
  );
}
