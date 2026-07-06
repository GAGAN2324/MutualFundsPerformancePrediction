import React from "react";

export default function AlgorithmTable({ algorithms }) {
  if (!algorithms) return null;

  return (
    <div className="card">
      <h3>Algorithm Comparison Table</h3>

      <table className="data-table">
        <thead>
          <tr>
            <th>Model</th>
            <th>Predicted NAV</th>
            <th>Accuracy (%)</th>
            <th>Rank</th>
          </tr>
        </thead>
        <tbody>
          {algorithms.map((algo, index) => (
            <tr key={index}>
              <td>{algo.model}</td>
              <td>{algo.predicted}</td>
              <td>{algo.accuracy}</td>
              <td>{algo.rank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}