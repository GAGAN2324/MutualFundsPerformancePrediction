import React from "react";
import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Dashboard", icon: "🏠", end: true },
  { to: "/analytics", label: "Analytics", icon: "📊" },
  { to: "/prediction", label: "Prediction", icon: "📈" },
  { to: "/model-comparison", label: "Model Comparison", icon: "📋" },
  { to: "/sip-calculator", label: "SIP Calculator", icon: "💰" },
  { to: "/understanding-models", label: "Understanding Models", icon: "📚" },
  { to: "/about", label: "About Project", icon: "ℹ️" },
];

export default function Nav() {
  return (
    <nav className="topnav">
      <div className="topnav-inner">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => "topnav-link" + (isActive ? " active" : "")}
          >
            <span className="topnav-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
