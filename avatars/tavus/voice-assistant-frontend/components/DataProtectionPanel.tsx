"use client";

import { useState } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

export function DataProtectionPanel() {
  const {
    state: { safety },
    recordAction,
    markVerified,
  } = useUserProfile();
  const [deleteRequested, setDeleteRequested] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleVerifyEmail = () => {
    if (safety.verifiedEmail) return;
    markVerified({ verifiedEmail: true });
    recordAction({
      id: `safety-verify-email-${Date.now()}`,
      label: "Verified email contact",
      category: "safety",
      xp: 5,
      impactPoints: 5,
    });
  };

  const handleVerifyPhone = () => {
    if (safety.verifiedPhone) return;
    markVerified({ verifiedPhone: true });
    recordAction({
      id: `safety-verify-phone-${Date.now()}`,
      label: "Verified phone contact",
      category: "safety",
      xp: 5,
      impactPoints: 5,
    });
  };

  const handleDeleteData = () => {
    if (deleteRequested) {
      alert("Your deletion request is already logged. A moderator will follow up within 48 hours.");
      return;
    }
    setDeleteRequested(true);
    recordAction({
      id: `safety-delete-${Date.now()}`,
      label: "Requested data deletion (GDPR)",
      category: "safety",
      xp: 0,
      impactPoints: 0,
      metadata: { request: "delete_my_data" },
    });
    alert("We logged your GDPR data deletion request. You will receive confirmation by email.");
  };

  const handleToggleModeration = () => {
    markVerified({ moderationEnabled: !safety.moderationEnabled });
    recordAction({
      id: `safety-moderation-${Date.now()}`,
      label: safety.moderationEnabled ? "Disabled AI moderation filter" : "Enabled AI moderation filter",
      category: "safety",
      xp: 0,
      impactPoints: 0,
    });
  };

  return (
    <section
      aria-labelledby="data-protection"
      style={{
        borderRadius: 20,
        padding: 24,
        background: "#f1f5f9",
        border: "1px solid #e2e8f0",
        boxShadow: "0 16px 32px rgba(15,23,42,0.08)",
        display: "grid",
        gap: 18,
      }}
    >
      <header>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: 1.3, color: "#475569", textTransform: "uppercase" }}>
          Trust & Safety
        </p>
        <h2 id="data-protection" style={{ margin: "6px 0 10px 0", fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
          Your data stays private, your community stays safe.
        </h2>
        <p style={{ margin: 0, color: "#475569" }}>
          Verified signup · GDPR compliant · AI moderation shields you and your peers. Visit the safety center anytime to manage your
          settings.
        </p>
      </header>

      <button
        type="button"
        onClick={() => setShowDetails((prev) => !prev)}
        style={{
          padding: "10px 16px",
          borderRadius: 12,
          border: "1px solid #cbd5f5",
          background: "#fff",
          color: "#1d4ed8",
          fontWeight: 700,
          cursor: "pointer",
          justifySelf: "flex-start",
        }}
      >
        {showDetails ? "Hide safety controls" : "View safety center"}
      </button>

      {showDetails && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          <div
            style={{
              borderRadius: 16,
              padding: 16,
              background: "#fff",
              border: "1px solid #fed7aa",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: "#c2410c", textTransform: "uppercase" }}>Email</div>
            <p style={{ margin: "8px 0 12px 0", color: "#9a3412", lineHeight: 1.5 }}>
              {safety.verifiedEmail ? "Email verified — you receive safety alerts." : "Verify email to receive safety alerts and badge receipts."}
            </p>
            <button
              type="button"
              onClick={handleVerifyEmail}
              disabled={safety.verifiedEmail}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "none",
                background: safety.verifiedEmail ? "#bbf7d0" : "#f97316",
                color: safety.verifiedEmail ? "#166534" : "#fff",
                fontWeight: 700,
                cursor: safety.verifiedEmail ? "default" : "pointer",
              }}
            >
              {safety.verifiedEmail ? "Verified" : "Verify email"}
            </button>
          </div>

          <div
            style={{
              borderRadius: 16,
              padding: 16,
              background: "#fff",
              border: "1px solid #fed7aa",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: "#c2410c", textTransform: "uppercase" }}>SMS</div>
            <p style={{ margin: "8px 0 12px 0", color: "#9a3412", lineHeight: 1.5 }}>
              {safety.verifiedPhone ? "Phone verified — SMS notifications active." : "Verify SMS to get event reminders and buddy safety pings."}
            </p>
            <button
              type="button"
              onClick={handleVerifyPhone}
              disabled={safety.verifiedPhone}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "none",
                background: safety.verifiedPhone ? "#bbf7d0" : "#f97316",
                color: safety.verifiedPhone ? "#166534" : "#fff",
                fontWeight: 700,
                cursor: safety.verifiedPhone ? "default" : "pointer",
              }}
            >
              {safety.verifiedPhone ? "Verified" : "Verify SMS"}
            </button>
          </div>

          <div
            style={{
              borderRadius: 16,
              padding: 16,
              background: "#fff",
              border: "1px solid #fed7aa",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: "#c2410c", textTransform: "uppercase" }}>AI Moderation</div>
            <p style={{ margin: "8px 0 12px 0", color: "#9a3412", lineHeight: 1.5 }}>
              {safety.moderationEnabled
                ? "AI filter is on. Scam and hostile content is blocked automatically."
                : "Turn on the AI filter to block scams, hate speech and suspicious links."}
            </p>
            <button
              type="button"
              onClick={handleToggleModeration}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "1px solid #fb923c",
                background: safety.moderationEnabled ? "#bbf7d0" : "#fff7ed",
                color: safety.moderationEnabled ? "#166534" : "#c2410c",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {safety.moderationEnabled ? "Disable filter" : "Enable filter"}
            </button>
          </div>

          <div
            style={{
              borderRadius: 16,
              padding: 16,
              background: "#fff",
              border: "1px solid #fed7aa",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: "#c2410c", textTransform: "uppercase" }}>GDPR</div>
            <p style={{ margin: "8px 0 12px 0", color: "#9a3412", lineHeight: 1.5 }}>
              You gave GDPR consent when joining. You can request deletion anytime and download your data history.
            </p>
            <button
              type="button"
              onClick={handleDeleteData}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: "1px solid #facc15",
                background: deleteRequested ? "#fef9c3" : "#facc15",
                color: deleteRequested ? "#854d0e" : "#78350f",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {deleteRequested ? "Request logged" : "Delete my data"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default DataProtectionPanel;


