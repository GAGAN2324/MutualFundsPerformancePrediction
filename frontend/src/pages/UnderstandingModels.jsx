import React from "react";

const MODELS = [
  {
    icon: "📈",
    name: "Drift Method",
    desc: "Uses the overall trend between the first and last historical NAV values and extends that trend to predict future values. A simple statistical forecasting method used as a baseline model.",
    useCases: ["Quick baseline forecast", "Funds with a steady, consistent trend"],
    advantages: ["No training required", "Fast and fully interpretable", "Reference point for evaluating the ML models"],
  },
  {
    icon: "📊",
    name: "Linear Regression",
    desc: "A supervised machine learning algorithm that learns a linear relationship between historical NAV values and time, then predicts future NAV using the fitted linear model.",
    useCases: ["Funds with a linear growth pattern", "Fast, explainable predictions"],
    advantages: ["Fast to train and predict", "Highly interpretable", "Well suited to linear trends"],
  },
  {
    icon: "🌲",
    name: "Random Forest",
    desc: "An ensemble machine learning algorithm that combines multiple decision trees. It captures nonlinear relationships in NAV movement and usually provides the highest prediction accuracy.",
    useCases: ["Volatile or nonlinear NAV movement", "When accuracy matters most"],
    advantages: ["Captures nonlinear patterns", "Robust to noise/outliers", "Typically the most accurate of the three"],
  },
];

export default function UnderstandingModels() {
  return (
    <div>
      <h1 className="page-title">How the Forecasting Models Work</h1>
      <p className="page-subtitle">Three approaches — from a simple baseline to ensemble learning.</p>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>What is an AMC?</h3>
        <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>
          An AMC (Asset Management Company) is the firm that pools money from
          investors and manages it in the form of mutual funds — for example
          HDFC, SBI, or ICICI Prudential. Each AMC runs several funds, and
          each fund tracks its own Net Asset Value (NAV), the per-unit price
          used throughout this app. Selecting an AMC on the Dashboard narrows
          the fund list down to that AMC's own funds.
        </p>
      </div>

      <h3 className="section-heading">Forecasting Models</h3>
      <div className="model-info-grid">
        {MODELS.map((m) => (
          <div key={m.name} className="model-info-card">
            <div className="model-info-icon">{m.icon}</div>
            <div className="model-info-title">{m.name}</div>
            <div className="model-info-desc">{m.desc}</div>

            <div className="model-info-subheading">Best Use Cases</div>
            <ul className="model-info-list">
              {m.useCases.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>

            <div className="model-info-subheading">Advantages</div>
            <ul className="model-info-list">
              {m.advantages.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
