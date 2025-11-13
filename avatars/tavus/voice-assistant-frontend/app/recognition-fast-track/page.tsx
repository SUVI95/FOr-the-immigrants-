"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { useUserProfile } from "@/context/UserProfileContext";
import { ResearchConsentForm } from "@/components/ResearchConsentForm";
import { OPHRecognitionTracker } from "@/components/OPHRecognitionTracker";

export default function RecognitionFastTrackPage() {
  const { state } = useUserProfile();
  const [room] = useState(new Room());
  const [activeTab, setActiveTab] = useState("recognition");
  const [consented, setConsented] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"not_started" | "uploading" | "submitted" | "in_review" | "approved">("not_started");

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const fileArray = Array.from(files);
    setDocuments(fileArray);

    // Simulate upload and OPH submission
    setTimeout(() => {
      setUploading(false);
      setStatus("submitted");
    }, 2000);
  };

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app" style={{ display: "grid", gridTemplateColumns: "280px 1fr", minHeight: "100vh" }}>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

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
              Recognition Fast-Track (Research)
            </h1>
            <p style={{ fontSize: "1.1rem", color: "#64748b", marginBottom: 48 }}>
              Research project to test faster qualification recognition workflows. Help us measure if streamlined processes reduce time-to-employment.
            </p>

            {!consented && (
              <ResearchConsentForm
                researchName="Recognition Fast-Track"
                researchPurpose="Research faster qualification recognition pathways for immigrants. Measure if streamlined recognition processes reduce time-to-employment."
                duration="6 months (Jan 2025 - Jun 2025)"
                onConsent={(value) => setConsented(value)}
              />
            )}

            {consented && (
              <div style={{ display: "grid", gap: 24 }}>
                {/* Info Box */}
                <div
                  style={{
                    padding: 20,
                    borderRadius: 16,
                    background: "linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)",
                    border: "2px solid #bfdbfe",
                  }}
                >
                  <h3 style={{ margin: "0 0 12px 0", fontSize: 18, fontWeight: 800, color: "#1e40af" }}>
                    📜 Recognition Fast-Track Overview
                  </h3>
                  <p style={{ margin: "0 0 12px 0", fontSize: 14, color: "#1e293b", lineHeight: 1.6 }}>
                    <strong>Why this matters:</strong> Long delays in recognizing foreign qualifications block entry to regulated professions. 
                    The traditional process takes 6-12 months. Our fast-track aims to reduce this to 3-4 months.
                  </p>
                  <div style={{ fontSize: 13, color: "#475569" }}>
                    <div><strong>Expected processing time:</strong> 3-4 months (vs 6-12 months traditional)</div>
                    <div style={{ marginTop: 8 }}>
                      <strong>What you can do:</strong> Upload documents, track status, get guidance on regulated professions
                    </div>
                  </div>
                </div>

                {/* OPH Recognition Tracker */}
                <OPHRecognitionTracker />

                {/* Document Upload */}
                <section
                  style={{
                    background: "#ffffff",
                    borderRadius: 20,
                    padding: 32,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
                  }}
                >
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: 24 }}>
                    Upload Your Qualifications
                  </h2>

                  <div
                    style={{
                      border: "2px dashed #cbd5f5",
                      borderRadius: 16,
                      padding: 40,
                      textAlign: "center",
                      background: "#f8fafc",
                      marginBottom: 20,
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      style={{ display: "none" }}
                      id="document-upload"
                    />
                    <label
                      htmlFor="document-upload"
                      style={{
                        display: "inline-block",
                        padding: "12px 24px",
                        borderRadius: 12,
                        background: "#2563eb",
                        color: "#ffffff",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {uploading ? "Uploading..." : "Choose Documents"}
                    </label>
                    <p style={{ margin: "12px 0 0 0", fontSize: "0.875rem", color: "#64748b" }}>
                      Upload diplomas, certificates, transcripts (PDF, JPG, PNG)
                    </p>
                  </div>

                  {documents.length > 0 && (
                    <div style={{ display: "grid", gap: 12 }}>
                      <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#0f172a", margin: 0 }}>
                        Uploaded Documents:
                      </h3>
                      {documents.map((doc, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: 12,
                            background: "#f8fafc",
                            borderRadius: 8,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontSize: "0.875rem", color: "#1e293b" }}>{doc.name}</span>
                          <span style={{ fontSize: "0.75rem", color: "#22c55e", fontWeight: 600 }}>✓ Uploaded</span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Recognition Status */}
                <section
                  style={{
                    background: "#ffffff",
                    borderRadius: 20,
                    padding: 32,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
                  }}
                >
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: 24 }}>
                    Recognition Status
                  </h2>

                  <div style={{ display: "grid", gap: 16 }}>
                    <div
                      style={{
                        padding: 20,
                        borderRadius: 12,
                        background: status === "not_started" ? "#f8fafc" : status === "submitted" ? "#eff6ff" : "#f0fdf4",
                        border: `2px solid ${
                          status === "not_started" ? "#e2e8f0" : status === "submitted" ? "#3b82f6" : "#22c55e"
                        }`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                        <span style={{ fontSize: 24 }}>
                          {status === "not_started" ? "📄" : status === "submitted" ? "⏳" : "✅"}
                        </span>
                        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "#0f172a" }}>
                          {status === "not_started"
                            ? "Not Started"
                            : status === "submitted"
                            ? "Submitted to OPH"
                            : "In Review"}
                        </h3>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.875rem", color: "#475569", lineHeight: 1.7 }}>
                        {status === "not_started"
                          ? "Upload your documents to start the recognition process."
                          : status === "submitted"
                          ? "Your application has been submitted to Opetushallitus (OPH). Expected processing time: 2-4 weeks (vs 6-12 months traditional)."
                          : "Your recognition is being processed."}
                      </p>
                    </div>

                    {status === "submitted" && (
                      <div style={{ padding: 16, background: "#fef3c7", borderRadius: 8, border: "1px solid #fcd34d" }}>
                        <p style={{ margin: 0, fontSize: "0.875rem", color: "#92400e", lineHeight: 1.6 }}>
                          <strong>Research Note:</strong> This is a research project testing faster recognition workflows.
                          Your participation helps us measure if streamlined processes reduce time-to-employment.
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Employer Attestation */}
                <section
                  style={{
                    background: "#ffffff",
                    borderRadius: 20,
                    padding: 32,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
                  }}
                >
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0f172a", marginBottom: 24 }}>
                    Employer Attestation (For Non-Regulated Roles)
                  </h2>

                  <p style={{ margin: "0 0 20px 0", fontSize: "0.875rem", color: "#475569", lineHeight: 1.7 }}>
                    For non-regulated roles, you can get an employer attestation letter while OPH processes your recognition.
                  </p>

                  <button
                    onClick={() => {
                      alert("Employer attestation feature coming soon. This will generate a letter that employers can sign to verify your skills.");
                    }}
                    style={{
                      padding: "12px 20px",
                      borderRadius: 12,
                      border: "1px solid #3b82f6",
                      background: "#eff6ff",
                      color: "#2563eb",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      cursor: "pointer",
                    }}
                  >
                    Generate Attestation Letter
                  </button>
                </section>
              </div>
            )}
          </div>
        </main>
      </div>
    </RoomContext.Provider>
  );
}

