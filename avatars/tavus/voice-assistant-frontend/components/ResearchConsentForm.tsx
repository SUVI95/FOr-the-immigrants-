"use client";

import { useState } from "react";

interface ResearchConsentFormProps {
  researchName: string;
  researchPurpose: string;
  duration: string;
  onConsent: (consented: boolean) => void;
}

export function ResearchConsentForm({
  researchName,
  researchPurpose,
  duration,
  onConsent,
}: ResearchConsentFormProps) {
  const [consented, setConsented] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleConsent = (value: boolean) => {
    setConsented(value);
    onConsent(value);
    
    // Log consent to database
    if (value) {
      fetch("/api/research/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          researchModule: researchName,
          consented: true,
        }),
      }).catch(console.error);
    }
  };

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 16,
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 24 }}>🔬</span>
        <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" }}>
          Research Participation: {researchName}
        </h3>
      </div>

      <div style={{ marginBottom: 16 }}>
        <p style={{ margin: "0 0 12px 0", fontSize: "0.875rem", color: "#475569", lineHeight: 1.7 }}>
          <strong>Research Purpose:</strong> {researchPurpose}
        </p>
        <p style={{ margin: "0 0 12px 0", fontSize: "0.875rem", color: "#475569", lineHeight: 1.7 }}>
          <strong>Duration:</strong> {duration}
        </p>
        <p style={{ margin: "0 0 12px 0", fontSize: "0.875rem", color: "#475569", lineHeight: 1.7 }}>
          <strong>EU AI Act:</strong> Research Exemption (Article 2(5)) - Limited Risk AI
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowDetails(!showDetails)}
        style={{
          padding: "8px 14px",
          borderRadius: 8,
          border: "1px solid #cbd5f5",
          background: "#ffffff",
          color: "#2563eb",
          fontWeight: 600,
          fontSize: "0.875rem",
          cursor: "pointer",
          marginBottom: 16,
        }}
      >
        {showDetails ? "Hide Details" : "View Full Details"}
      </button>

      {showDetails && (
        <div style={{ marginBottom: 16, padding: 16, background: "#ffffff", borderRadius: 12 }}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 600, color: "#0f172a" }}>
            What You'll Do
          </h4>
          <ul style={{ margin: "0 0 16px 0", paddingLeft: 20, fontSize: "0.875rem", color: "#475569", lineHeight: 1.8 }}>
            <li>Use AI-assisted features (skills discovery, language coach, etc.)</li>
            <li>Allow anonymized data collection for research</li>
            <li>Participate in optional surveys</li>
          </ul>

          <h4 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 600, color: "#0f172a" }}>
            Your Rights
          </h4>
          <ul style={{ margin: "0 0 16px 0", paddingLeft: 20, fontSize: "0.875rem", color: "#475569", lineHeight: 1.8 }}>
            <li>You can opt-out anytime</li>
            <li>Your data will be anonymized</li>
            <li>You can request your data be deleted</li>
            <li>Participation is voluntary</li>
          </ul>

          <h4 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 600, color: "#0f172a" }}>
            Research Benefits
          </h4>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: "0.875rem", color: "#475569", lineHeight: 1.8 }}>
            <li>Help improve integration services</li>
            <li>Support government policy decisions</li>
            <li>Contribute to solving national problem</li>
          </ul>
        </div>
      )}

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={consented}
            onChange={(e) => handleConsent(e.target.checked)}
            style={{ width: 18, height: 18, cursor: "pointer" }}
          />
          <span style={{ fontSize: "0.875rem", color: "#1e293b", fontWeight: 600 }}>
            I consent to participate in this research project
          </span>
        </label>
      </div>

      {consented && (
        <p style={{ margin: "12px 0 0 0", fontSize: "0.75rem", color: "#22c55e", fontWeight: 600 }}>
          ✅ Consent recorded. Thank you for participating in this research!
        </p>
      )}
    </div>
  );
}

