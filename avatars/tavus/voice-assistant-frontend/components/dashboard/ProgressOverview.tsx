"use client";

import { useUserProfile } from "@/context/UserProfileContext";

export function ProgressOverview() {
  const {
    state: { level, xp, nextLevelXp, peopleHelpedThisWeek, contributionsThisMonth },
  } = useUserProfile();

  const xpToNext = nextLevelXp ? Math.max(nextLevelXp - xp, 0) : 0;

  return (
    <section
      aria-labelledby="progress-overview"
      style={{
        borderRadius: 20,
        padding: 24,
        background: "#fff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 16px 32px rgba(15,23,42,0.08)",
        display: "grid",
        gap: 16,
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", color: "#475569", fontWeight: 700 }}>
            Your progress
          </p>
          <h2 id="progress-overview" style={{ margin: "6px 0 0 0", fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
            Keep the momentum going.
          </h2>
        </div>
        <button
          type="button"
          onClick={() => (window.location.href = "/my-journey")}
          style={{
            padding: "10px 16px",
            borderRadius: 12,
            border: "1px solid #cbd5f5",
            background: "#f8fafc",
            color: "#1d4ed8",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Open full progress view
        </button>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 14,
        }}
      >
        <div
          style={{
            borderRadius: 16,
            padding: 16,
            background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(129,140,248,0.08))",
            border: "1px solid rgba(99,102,241,0.24)",
          }}
        >
          <span style={{ fontSize: 12, textTransform: "uppercase", color: "#4338ca", fontWeight: 600 }}>Current level</span>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{level}</div>
          {nextLevelXp && <p style={{ margin: "4px 0 0 0", fontSize: 12.5, color: "#4338ca" }}>{xpToNext} XP to Connector</p>}
        </div>

        <div
          style={{
            borderRadius: 16,
            padding: 16,
            background: "linear-gradient(135deg, rgba(45,212,191,0.12), rgba(16,185,129,0.08))",
            border: "1px solid rgba(16,185,129,0.24)",
          }}
        >
          <span style={{ fontSize: 12, textTransform: "uppercase", color: "#047857", fontWeight: 600 }}>This week</span>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{contributionsThisMonth >= 1 ? contributionsThisMonth : "–"}</div>
          <p style={{ margin: "4px 0 0 0", fontSize: 12.5, color: "#047857" }}>Actions logged</p>
        </div>

        <div
          style={{
            borderRadius: 16,
            padding: 16,
            background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(96,165,250,0.08))",
            border: "1px solid rgba(59,130,246,0.24)",
          }}
        >
          <span style={{ fontSize: 12, textTransform: "uppercase", color: "#1d4ed8", fontWeight: 600 }}>People helped</span>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>{peopleHelpedThisWeek}</div>
          <p style={{ margin: "4px 0 0 0", fontSize: 12.5, color: "#1d4ed8" }}>This week</p>
        </div>
      </div>
    </section>
  );
}

export default ProgressOverview;
