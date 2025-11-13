"use client";

interface PilotDisclosureProps {
  pilotName: string;
  duration: string;
  purpose: string;
  riskLevel?: string;
}

export function PilotDisclosure({
  pilotName,
  duration,
  purpose,
  riskLevel = "Limited Risk AI",
}: PilotDisclosureProps) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 16,
        background: "linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)",
        border: "2px solid #3b82f6",
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 24 }}>🚀</span>
        <div
          style={{
            padding: "4px 12px",
            borderRadius: 999,
            background: "#3b82f6",
            color: "#ffffff",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          PILOT PROJECT
        </div>
      </div>

      <h3 style={{ margin: "0 0 12px 0", fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" }}>
        {pilotName}
      </h3>

      <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "#1e293b" }}>
          <strong>Status:</strong> Pilot Project
        </p>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "#1e293b" }}>
          <strong>Duration:</strong> {duration}
        </p>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "#1e293b" }}>
          <strong>Purpose:</strong> {purpose}
        </p>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "#1e293b" }}>
          <strong>EU AI Act:</strong> Pilot Exemption (Article 2(5))
        </p>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "#1e293b" }}>
          <strong>Risk Level:</strong> {riskLevel}
        </p>
      </div>

      <div style={{ padding: 12, background: "#ffffff", borderRadius: 8, marginBottom: 12 }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>
          Pilot Benefits:
        </h4>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: "0.875rem", color: "#475569", lineHeight: 1.8 }}>
          <li>Early access to new features</li>
          <li>Help improve the platform</li>
          <li>Contribute to solving integration problem</li>
          <li>Your feedback shapes the product</li>
        </ul>
      </div>

      <div style={{ padding: 12, background: "#ffffff", borderRadius: 8 }}>
        <h4 style={{ margin: "0 0 8px 0", fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>
          Your Rights:
        </h4>
        <ul style={{ margin: 0, paddingLeft: 20, fontSize: "0.875rem", color: "#475569", lineHeight: 1.8 }}>
          <li>Opt-out anytime</li>
          <li>Data anonymized for research</li>
          <li>Voluntary participation</li>
        </ul>
      </div>
    </div>
  );
}

