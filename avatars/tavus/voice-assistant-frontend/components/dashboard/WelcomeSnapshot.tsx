"use client";

import { useMemo } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

function getNextLevel(level: "Explorer" | "Connector" | "Mentor") {
  if (level === "Explorer") return "Connector";
  if (level === "Connector") return "Mentor";
  return "Mentor";
}

export function WelcomeSnapshot() {
  const {
    state: { name, level, xp, nextLevelXp, progressPercent, peopleHelpedThisWeek },
    recordAction,
  } = useUserProfile();

  const xpToNext = useMemo(() => (nextLevelXp ? Math.max(nextLevelXp - xp, 0) : 0), [nextLevelXp, xp]);
  const nextLabel = useMemo(() => getNextLevel(level), [level]);

  const handleNextSteps = () => {
    recordAction({
      id: `welcome-next-steps-${Date.now()}`,
      label: "Viewed next steps from welcome snapshot",
      category: "resources",
      xp: 8,
      impactPoints: 5,
    });
    window.location.href = "/my-journey";
  };

  const handleAskAI = () => {
    recordAction({
      id: `welcome-ask-ai-${Date.Now()}`,
      label: "Opened Knuut AI from welcome snapshot",
      category: "voice",
      xp: 10,
      impactPoints: 7,
    });
    window.location.href = "/knuut-voice";
  };

  return (
    <section
      aria-labelledby="welcome-snapshot"
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 30,
        padding: "34px",
        background: "linear-gradient(135deg, #f8fbff 0%, #eef2ff 50%, #f7f7ff 100%)",
        border: "1px solid rgba(148,163,184,0.25)",
        boxShadow: "0 26px 48px rgba(79,70,229,0.18)",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -120,
          right: -140,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, rgba(69,51,229,0.05) 70%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -140,
          left: -120,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236,72,153,0.25) 0%, rgba(236,72,153,0.05) 70%, transparent 100%)",
        }}
      />

      <div
        style={{
          display: "grid",
          gap: 28,
          gridTemplateColumns: "minmax(260px, 1.3fr) minmax(220px, 1fr)",
          alignItems: "center",
        }}
      >
        <div style={{ display: "grid", gap: 12, color: "#1e1b4b" }}>
          <span
            id="welcome-snapshot"
            style={{ fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase", fontWeight: 700, color: "#4338ca" }}
          >
            Your journey so far
          </span>
          <h1 style={{ margin: 0, fontSize: "1.9rem", fontWeight: 800 }}>
            Welcome back, {name}. You’re on your way to becoming a Connector.
          </h1>
          <p style={{ margin: 0, fontSize: 14.5, color: "#334155" }}>
            Keep learning, helping, and connecting — every win helps you grow faster.
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.65)",
            borderRadius: 20,
            padding: "18px 20px",
            display: "grid",
            gap: 14,
            border: "1px solid rgba(148,163,184,0.3)",
            boxShadow: "0 16px 32px rgba(148,163,184,0.12)",
          }}
        >
          <div
            style={{
              height: 10,
              borderRadius: 999,
              background: "rgba(148,163,184,0.3)",
              overflow: "hidden",
            }}
            aria-hidden="true"
          >
            <div
              style={{
                width: `${Math.min(Math.max(progressPercent, 0), 100)}%`,
                background: "linear-gradient(90deg, #6366f1, #ec4899)",
                height: "100%",
              }}
            />
          </div>

          <div style={{ display: "grid", gap: 6, fontSize: 13.2, fontWeight: 600, color: "#1f2937" }}>
            <span>{level} level now → {nextLabel} next</span>
            {nextLevelXp && <span>{xpToNext} XP to reach {nextLabel}</span>}
            <span>Progress: {Math.min(Math.max(progressPercent, 0), 100)}%</span>
            <span>People helped this week: {peopleHelpedThisWeek}</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: 10,
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 14,
                background: "linear-gradient(135deg, rgba(248,250,252,0.25), rgba(148,163,184,0.08))",
                border: "1px solid rgba(148,163,184,0.2)",
                display: "grid",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 11, textTransform: "uppercase", opacity: 0.65, fontWeight: 600 }}>Current level</span>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{level}</div>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 14,
                background: "linear-gradient(135deg, rgba(148,163,184,0.2), rgba(148,163,184,0.08))",
                border: "1px solid rgba(148,163,184,0.2)",
                display: "grid",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 11, textTransform: "uppercase", opacity: 0.65, fontWeight: 600 }}>XP remaining</span>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{nextLevelXp ? xpToNext : "Max"}</div>
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 14,
                background: "linear-gradient(135deg, rgba(236,72,153,0.18), rgba(236,72,153,0.06))",
                border: "1px solid rgba(236,72,153,0.18)",
                display: "grid",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 11, textTransform: "uppercase", opacity: 0.65, fontWeight: 600 }}>People helped</span>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{peopleHelpedThisWeek}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={handleNextSteps}
          style={{
            padding: "11px 22px",
            borderRadius: 16,
            border: "none",
            background: "linear-gradient(135deg, #4338ca 0%, #7c3aed 45%, #ec4899 100%)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            boxShadow: "0 18px 34px rgba(124,58,237,0.3)",
            cursor: "pointer",
          }}
        >
          See my next steps
        </button>
        <button
          type="button"
          onClick={handleAskAI}
          style={{
            padding: "11px 22px",
            borderRadius: 16,
            border: "1px solid rgba(99,102,241,0.35)",
            background: "rgba(255,255,255,0.2)",
            color: "#312e81",
            fontWeight: 500,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Let AI guide me
        </button>
      </div>
    </section>
  );
}

export default WelcomeSnapshot;
