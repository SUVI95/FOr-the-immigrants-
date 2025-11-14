"use client";

import { useState } from "react";

interface SimpleTooltipProps {
  text: string;
  explanation: string;
  children: React.ReactNode;
}

export function SimpleTooltip({ text, explanation, children }: SimpleTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 4 }}>
      {children}
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        style={{
          background: "none",
          border: "none",
          color: "#2563eb",
          cursor: "help",
          fontSize: 14,
          padding: 0,
          width: 18,
          height: 18,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: "#e0f2fe",
        }}
        aria-label={`What is ${text}?`}
      >
        ?
      </button>
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            marginBottom: 8,
            padding: "12px 16px",
            background: "#1e293b",
            color: "#fff",
            borderRadius: 8,
            fontSize: 12,
            lineHeight: 1.5,
            maxWidth: 250,
            zIndex: 1000,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          <strong>{text}:</strong> {explanation}
        </div>
      )}
    </span>
  );
}

