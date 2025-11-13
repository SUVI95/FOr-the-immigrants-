"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { useUserProfile } from "@/context/UserProfileContext";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  const { state, markVerified } = useUserProfile();
  const [room] = useState(new Room());
  const [activeTab, setActiveTab] = useState("privacy");
  const [consentGiven, setConsentGiven] = useState(state.safety.gdprConsent);

  const handleConsentToggle = () => {
    const newConsent = !consentGiven;
    setConsentGiven(newConsent);
    markVerified({ gdprConsent: newConsent });
    // TODO: Save to database
  };

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app" style={{ display: "grid", gridTemplateColumns: "280px 1fr", minHeight: "100vh" }}>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLearnFinnishClick={handleLearnFinnishClick} />

        <main
          style={{
            padding: "40px 36px",
            background: "linear-gradient(to bottom, #fafbfc 0%, #f8fafc 100%)",
            minHeight: "100vh",
            overflowY: "auto",
          }}
        >
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: 16,
              }}
            >
              Privacy Policy & Data Protection
            </h1>
            <p style={{ fontSize: "1.1rem", color: "#64748b", marginBottom: 48 }}>
              Your privacy and data security are our top priorities. This page explains how we collect, use, and protect your data in compliance with GDPR and EU AI Act.
            </p>

            {/* Consent Management */}
            <section
              style={{
                background: "#ffffff",
                borderRadius: 20,
                padding: 32,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
                marginBottom: 32,
              }}
            >
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: 24 }}>
                Your Consent Settings
              </h2>

              <div style={{ display: "grid", gap: 20 }}>
                <div
                  style={{
                    padding: 20,
                    borderRadius: 12,
                    background: consentGiven ? "#f0fdf4" : "#fef2f2",
                    border: `2px solid ${consentGiven ? "#86efac" : "#fecaca"}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#0f172a", margin: "0 0 4px 0" }}>
                        GDPR Consent
                      </h3>
                      <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0 }}>
                        I consent to the processing of my personal data for the purposes described in this privacy policy.
                      </p>
                    </div>
                    <label
                      style={{
                        position: "relative",
                        display: "inline-block",
                        width: 52,
                        height: 28,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={consentGiven}
                        onChange={handleConsentToggle}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: consentGiven ? "#22c55e" : "#ef4444",
                          borderRadius: 28,
                          transition: "0.3s",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            content: '""',
                            height: 22,
                            width: 22,
                            left: 3,
                            bottom: 3,
                            background: "#ffffff",
                            borderRadius: "50%",
                            transition: "0.3s",
                            transform: consentGiven ? "translateX(24px)" : "translateX(0)",
                          }}
                        />
                      </span>
                    </label>
                  </div>
                </div>

                <div
                  style={{
                    padding: 20,
                    borderRadius: 12,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#0f172a", margin: "0 0 12px 0" }}>
                    AI Processing Consent
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "#64748b", margin: "0 0 16px 0" }}>
                    We use OpenAI's AI services to provide language learning assistance and personalized suggestions. Your data is processed securely and pseudonymized.
                  </p>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <input
                      type="checkbox"
                      id="ai-consent"
                      checked={state.safety.moderationEnabled}
                      onChange={() => markVerified({ moderationEnabled: !state.safety.moderationEnabled })}
                      style={{ width: 18, height: 18, cursor: "pointer" }}
                    />
                    <label htmlFor="ai-consent" style={{ fontSize: "0.875rem", color: "#475569", cursor: "pointer" }}>
                      I consent to AI processing of my data for language learning and recommendations
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Collection */}
            <section
              style={{
                background: "#ffffff",
                borderRadius: 20,
                padding: 32,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
                marginBottom: 32,
              }}
            >
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: 24 }}>
                What Data We Collect
              </h2>

              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
                    Personal Information
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: 20, color: "#475569", fontSize: "0.875rem", lineHeight: 1.8 }}>
                    <li>Name and email address (for account creation)</li>
                    <li>Phone number (optional, for SMS notifications)</li>
                    <li>Location (city/region, for local recommendations)</li>
                  </ul>
                </div>

                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
                    Learning Data
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: 20, color: "#475569", fontSize: "0.875rem", lineHeight: 1.8 }}>
                    <li>Finnish language practice sessions and progress</li>
                    <li>Completed lessons and quizzes</li>
                    <li>XP and achievement data</li>
                    <li>Learning preferences and goals</li>
                  </ul>
                </div>

                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
                    AI Interaction Data
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: 20, color: "#475569", fontSize: "0.875rem", lineHeight: 1.8 }}>
                    <li>Language practice conversations (pseudonymized before sending to OpenAI)</li>
                    <li>AI-generated suggestions and recommendations</li>
                    <li>Interaction logs (without personal information)</li>
                  </ul>
                </div>

                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
                    Community Activity
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: 20, color: "#475569", fontSize: "0.875rem", lineHeight: 1.8 }}>
                    <li>Event RSVPs and group memberships</li>
                    <li>Volunteering hours and contributions</li>
                    <li>Community interactions (posts, comments)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Data */}
            <section
              style={{
                background: "#ffffff",
                borderRadius: 20,
                padding: 32,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
                marginBottom: 32,
              }}
            >
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: 24 }}>
                How We Use Your Data
              </h2>

              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
                    🤖 AI-Powered Services
                  </h3>
                  <p style={{ margin: 0, color: "#475569", fontSize: "0.875rem", lineHeight: 1.7 }}>
                    We use <strong>OpenAI's GPT-4o-mini</strong> to provide language learning assistance. Your messages are <strong>sanitized</strong> (personal information removed) and <strong>pseudonymized</strong> (user ID hashed) before being sent to OpenAI. We have a Data Processing Agreement (DPA) with OpenAI that ensures GDPR compliance.
                  </p>
                </div>

                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
                    📊 Personalized Recommendations
                  </h3>
                  <p style={{ margin: 0, color: "#475569", fontSize: "0.875rem", lineHeight: 1.7 }}>
                    Based on your learning progress, interests, and location, we suggest relevant events, job opportunities, and community groups. This uses your anonymized profile data.
                  </p>
                </div>

                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
                    🔒 Data Security
                  </h3>
                  <p style={{ margin: 0, color: "#475569", fontSize: "0.875rem", lineHeight: 1.7 }}>
                    All data is encrypted in transit (TLS 1.3) and at rest. We use EU-based servers and comply with GDPR requirements. Your data is never sold to third parties.
                  </p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section
              style={{
                background: "#ffffff",
                borderRadius: 20,
                padding: 32,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
                marginBottom: 32,
              }}
            >
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: 24 }}>
                Your GDPR Rights
              </h2>

              <div style={{ display: "grid", gap: 16 }}>
                <div
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
                    Right to Access (Article 15)
                  </h3>
                  <p style={{ margin: "0 0 12px 0", color: "#475569", fontSize: "0.875rem", lineHeight: 1.7 }}>
                    You can request a copy of all your personal data stored in our system.
                  </p>
                  <button
                    onClick={() => window.location.href = "/api/user-data-export"}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 8,
                      border: "1px solid #3b82f6",
                      background: "#eff6ff",
                      color: "#3b82f6",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      cursor: "pointer",
                    }}
                  >
                    Download My Data →
                  </button>
                </div>

                <div
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
                    Right to Erasure (Article 17)
                  </h3>
                  <p style={{ margin: "0 0 12px 0", color: "#475569", fontSize: "0.875rem", lineHeight: 1.7 }}>
                    You can request deletion of your personal data. We will process this within 30 days.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to delete all your data? This action cannot be undone.")) {
                        window.location.href = "/api/user-data-deletion";
                      }
                    }}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 8,
                      border: "1px solid #ef4444",
                      background: "#fef2f2",
                      color: "#ef4444",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      cursor: "pointer",
                    }}
                  >
                    Request Data Deletion →
                  </button>
                </div>

                <div
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
                    Right to Rectification (Article 16)
                  </h3>
                  <p style={{ margin: "0 0 12px 0", color: "#475569", fontSize: "0.875rem", lineHeight: 1.7 }}>
                    You can update your personal information at any time in your profile settings.
                  </p>
                </div>

                <div
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
                    Right to Data Portability (Article 20)
                  </h3>
                  <p style={{ margin: "0 0 12px 0", color: "#475569", fontSize: "0.875rem", lineHeight: 1.7 }}>
                    You can export your data in a machine-readable format (JSON).
                  </p>
                </div>
              </div>
            </section>

            {/* Third-Party Services */}
            <section
              style={{
                background: "#ffffff",
                borderRadius: 20,
                padding: 32,
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
                marginBottom: 32,
              }}
            >
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: 24 }}>
                Third-Party Services
              </h2>

              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
                    OpenAI (AI Services)
                  </h3>
                  <p style={{ margin: "0 0 8px 0", color: "#475569", fontSize: "0.875rem", lineHeight: 1.7 }}>
                    We use OpenAI's GPT-4o-mini for language learning assistance. We have a Data Processing Agreement (DPA) with OpenAI that ensures:
                  </p>
                  <ul style={{ margin: "0 0 0 20px", padding: 0, color: "#475569", fontSize: "0.875rem", lineHeight: 1.8 }}>
                    <li>GDPR compliance</li>
                    <li>Data minimization (only necessary data is sent)</li>
                    <li>Pseudonymization (user IDs are hashed)</li>
                    <li>No training on your data (data is not used to train models)</li>
                  </ul>
                  <p style={{ margin: "12px 0 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>
                    OpenAI Privacy Policy: <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6" }}>https://openai.com/privacy</a>
                  </p>
                </div>

                <div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
                    LiveKit (Voice Communication)
                  </h3>
                  <p style={{ margin: 0, color: "#475569", fontSize: "0.875rem", lineHeight: 1.7 }}>
                    We use LiveKit for real-time voice communication. Audio data is processed in real-time and not stored.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section
              style={{
                background: "linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%)",
                borderRadius: 20,
                padding: 32,
                border: "1px solid #bfdbfe",
              }}
            >
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
                Questions or Concerns?
              </h2>
              <p style={{ margin: "0 0 16px 0", color: "#475569", fontSize: "0.875rem", lineHeight: 1.7 }}>
                If you have questions about your data or privacy, please contact us:
              </p>
              <div style={{ display: "grid", gap: 8 }}>
                <p style={{ margin: 0, color: "#1e293b", fontSize: "0.875rem" }}>
                  <strong>Data Protection Officer:</strong> dpo@knuut.ai
                </p>
                <p style={{ margin: 0, color: "#1e293b", fontSize: "0.875rem" }}>
                  <strong>General Inquiries:</strong> support@knuut.ai
                </p>
                <p style={{ margin: 0, color: "#1e293b", fontSize: "0.875rem" }}>
                  <strong>Company:</strong> HSBridge Oy, Finland
                </p>
              </div>
            </section>

            <p style={{ marginTop: 32, fontSize: "0.75rem", color: "#94a3b8", textAlign: "center" }}>
              Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </main>
      </div>
    </RoomContext.Provider>
  );
}

