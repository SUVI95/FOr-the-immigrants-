"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { ResearchConsentForm } from "@/components/ResearchConsentForm";

type ConsentType = "skills-discovery" | "recognition-fast-track" | "workplace-language" | "retention-tracking";

interface ConsentStatus {
  type: ConsentType;
  consented: boolean;
  consentedAt?: string;
}

export default function ConsentHubPage() {
  const [activeTab, setActiveTab] = useState("consent-hub");
  const [consents, setConsents] = useState<Record<ConsentType, ConsentStatus>>({
    "skills-discovery": { type: "skills-discovery", consented: false },
    "recognition-fast-track": { type: "recognition-fast-track", consented: false },
    "workplace-language": { type: "workplace-language", consented: false },
    "retention-tracking": { type: "retention-tracking", consented: false },
  });

  const consentConfigs = {
    "skills-discovery": {
      title: "Skills Discovery Research",
      description: "Research how skills-based job discovery improves immigrant employment outcomes",
      duration: "6 months (Jan 2025 - Jun 2025)",
      purpose: "Measure if skills-based matching reduces time-to-employment and improves job fit",
    },
    "recognition-fast-track": {
      title: "Recognition Fast-Track Research",
      description: "Research faster qualification recognition pathways for immigrants",
      duration: "6 months (Jan 2025 - Jun 2025)",
      purpose: "Measure if streamlined recognition processes reduce time-to-employment",
    },
    "workplace-language": {
      title: "Workplace Language Coach Pilot",
      description: "Pilot program testing real-time language support in workplace settings",
      duration: "3 months (Jan 2025 - Mar 2025)",
      purpose: "Test if on-the-job language coaching accelerates language acquisition",
    },
    "retention-tracking": {
      title: "Job Retention Tracking",
      description: "Track job retention and integration progress to measure program impact",
      duration: "Ongoing",
      purpose: "Measure long-term integration success and identify support needs",
    },
  };

  const handleConsent = (type: ConsentType, value: boolean) => {
    setConsents({
      ...consents,
      [type]: {
        type,
        consented: value,
        consentedAt: value ? new Date().toISOString() : undefined,
      },
    });
  };

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 24px",
          background: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <section
          style={{
            marginBottom: 32,
            padding: "32px 36px",
            borderRadius: 28,
            background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
            color: "#ffffff",
            boxShadow: "0 20px 40px rgba(37,99,235,0.3)",
          }}
        >
          <h1 style={{ margin: "0 0 12px 0", fontSize: "2.5rem", fontWeight: 800 }}>
            Research & Consent Hub
          </h1>
          <p style={{ margin: 0, fontSize: "1.1rem", opacity: 0.95, lineHeight: 1.6 }}>
            Review and manage your consent for research participation and data tracking. All research follows GDPR and ethical guidelines.
          </p>
        </section>

        {/* Info Box */}
        <section
          style={{
            marginBottom: 24,
            padding: "20px 24px",
            borderRadius: 16,
            background: "#fef3c7",
            border: "1px solid #fcd34d",
          }}
        >
          <p style={{ margin: 0, fontSize: 14, color: "#92400e", lineHeight: 1.6 }}>
            <strong>Your Privacy Matters:</strong> All research participation is voluntary. You can withdraw consent at any time. 
            Data is anonymized and used only for research purposes. See our{" "}
            <a href="/privacy" style={{ color: "#92400e", textDecoration: "underline" }}>
              Privacy Policy
            </a>{" "}
            for details.
          </p>
        </section>

        {/* Consent Cards */}
        <div style={{ display: "grid", gap: 20 }}>
          {(Object.keys(consentConfigs) as ConsentType[]).map((type) => {
            const config = consentConfigs[type];
            const consent = consents[type];

            return (
              <section
                key={type}
                style={{
                  padding: "28px 32px",
                  borderRadius: 24,
                  background: "#ffffff",
                  border: consent.consented ? "2px solid #22c55e" : "1px solid #e2e8f0",
                  boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
                        {config.title}
                      </h2>
                      {consent.consented && (
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: 999,
                            background: "#dcfce7",
                            border: "1px solid #86efac",
                            color: "#166534",
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          ✓ Consented
                        </span>
                      )}
                    </div>
                    <p style={{ margin: "8px 0 0 0", fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
                      {config.description}
                    </p>
                    <div style={{ marginTop: 12, fontSize: 13, color: "#64748b" }}>
                      <strong>Duration:</strong> {config.duration}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 13, color: "#64748b" }}>
                      <strong>Purpose:</strong> {config.purpose}
                    </div>
                    {consent.consentedAt && (
                      <div style={{ marginTop: 8, fontSize: 12, color: "#22c55e", fontWeight: 600 }}>
                        Consented on: {new Date(consent.consentedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                {!consent.consented ? (
                  <ResearchConsentForm
                    researchName={config.title}
                    researchPurpose={config.purpose}
                    duration={config.duration}
                    onConsent={(value) => handleConsent(type, value)}
                  />
                ) : (
                  <div
                    style={{
                      padding: 16,
                      background: "#f0fdf4",
                      borderRadius: 12,
                      border: "1px solid #86efac",
                    }}
                  >
                    <p style={{ margin: "0 0 12px 0", fontSize: 14, color: "#166534", fontWeight: 600 }}>
                      ✓ You have consented to participate in this research
                    </p>
                    <button
                      type="button"
                      onClick={() => handleConsent(type, false)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "1px solid #fca5a5",
                        background: "#fee2e2",
                        color: "#991b1b",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: 13,
                      }}
                    >
                      Withdraw Consent
                    </button>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Summary */}
        <section
          style={{
            marginTop: 32,
            padding: "24px 28px",
            borderRadius: 20,
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
          }}
        >
          <h2 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
            Consent Summary
          </h2>
          <div style={{ display: "grid", gap: 8, fontSize: 14, color: "#475569" }}>
            <div>
              <strong>Active Consents:</strong>{" "}
              {Object.values(consents).filter((c) => c.consented).length} / {Object.keys(consents).length}
            </div>
            <div>
              <strong>Your Rights:</strong> You can withdraw consent at any time. Withdrawing consent does not affect data already collected.
            </div>
            <div>
              <strong>Data Usage:</strong> All data is anonymized and used only for research purposes to improve immigrant integration services.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

