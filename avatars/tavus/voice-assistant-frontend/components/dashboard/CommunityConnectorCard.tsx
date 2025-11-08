"use client";

import { useMemo } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

function getNextLevel(level: "Explorer" | "Connector" | "Mentor") {
  if (level === "Explorer") return "Connector";
  if (level === "Connector") return "Mentor";
  return "Mentor";
}

export function CommunityConnectorCard() {
  const {
    state: {
      level,
      xp,
      nextLevelXp,
      progressPercent,
      motivationalMessage,
      peopleHelpedThisWeek,
      contributionsThisMonth,
    },
  } = useUserProfile();

  const nextLevelLabel = useMemo(() => getNextLevel(level), [level]);
  const xpToNext = useMemo(() => (nextLevelXp ? Math.max(nextLevelXp - xp, 0) : 0), [nextLevelXp, xp]);

  return (
    <section
      aria-labelledby="community-connector-card"
      style={{
        borderRadius: 20,
        padding: "24px 28px",
        background: "linear-gradient(140deg, #0f172a 0%, #1e3a8a 45%, #4338ca 100%)",
        color: "#fff",
        boxShadow: "0 18px 40px rgba(30, 64, 175, 0.32)",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.7 }}>
            Community Connector Progress
          </p>
          <h2 id="community-connector-card" style={{ margin: "4px 0 0 0", fontSize: 26, fontWeight: 800 }}>
            {level} → {nextLevelLabel}
          </h2>
        </div>
        <div
          style={{
            padding: "8px 14px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.12)",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          XP {xp}
        </div>
      </header>

      <div>
        <div
          style={{
            height: 12,
            borderRadius: 999,
            background: "rgba(255,255,255,0.18)",
            position: "relative",
            overflow: "hidden",
          }}
          aria-hidden="true"
        >
          <div
            style={{
              width: `${progressPercent}%`,
              maxWidth: "100%",
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, #22d3ee 0%, #a855f7 100%)",
            }}
          />
        </div>
        <div style={{ marginTop: 8, fontSize: 13, opacity: 0.85 }}>
          {nextLevelXp
            ? `${xpToNext} XP until ${nextLevelLabel}`
            : "You are at the top level – Mentor status unlocked!"}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: "1 1 140px",
            minWidth: 140,
            borderRadius: 14,
            padding: "14px",
            background: "rgba(15,23,42,0.35)",
            border: "1px solid rgba(148,163,184,0.2)",
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: 0.4, textTransform: "uppercase", opacity: 0.65 }}>People Helped</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{peopleHelpedThisWeek}</div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>this week</div>
        </div>
        <div
          style={{
            flex: "1 1 140px",
            minWidth: 140,
            borderRadius: 14,
            padding: "14px",
            background: "rgba(15,23,42,0.35)",
            border: "1px solid rgba(148,163,184,0.2)",
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: 0.4, textTransform: "uppercase", opacity: 0.65 }}>Contributions</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 6 }}>{contributionsThisMonth}</div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>this month</div>
        </div>
      </div>

      <blockquote
        style={{
          margin: 0,
          padding: "16px 18px",
          background: "rgba(15,23,42,0.55)",
          borderRadius: 14,
          border: "1px solid rgba(148,163,184,0.25)",
          fontSize: 15,
          lineHeight: 1.5,
          fontStyle: "italic",
        }}
      >
        {motivationalMessage}
      </blockquote>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a
          href="#my-pathway"
          style={{
            textDecoration: "none",
            fontWeight: 700,
            letterSpacing: 0.4,
            fontSize: 13,
            textTransform: "uppercase",
            padding: "12px 18px",
            background: "#22d3ee",
            color: "#0f172a",
            borderRadius: 999,
            flex: "0 0 auto",
            boxShadow: "0 10px 28px rgba(34, 211, 238, 0.35)",
          }}
        >
          View My Pathway
        </a>
        <a
          href="/learn-finnish"
          style={{
            textDecoration: "none",
            fontWeight: 700,
            letterSpacing: 0.4,
            fontSize: 13,
            textTransform: "uppercase",
            padding: "12px 18px",
            background: "rgba(255,255,255,0.14)",
            color: "#f8fafc",
            borderRadius: 999,
            flex: "0 0 auto",
            border: "1px solid rgba(248,250,252,0.2)",
          }}
        >
          Boost with Mentor
        </a>
      </div>
    </section>
  );
}

export default CommunityConnectorCard;


