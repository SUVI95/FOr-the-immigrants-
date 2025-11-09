"use client";

import { useMemo, useState } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

const levelInfos = [
  { level: "Explorer", description: "Learning the basics, trying first events, logging first helpers." },
  { level: "Connector", description: "Actively supporting others, co-hosting meetups, sharing resources." },
  { level: "Mentor", description: "Leading circles, guiding newcomers, co-designing programs." },
];

function getNextLevel(level: "Explorer" | "Connector" | "Mentor") {
  if (level === "Explorer") return "Connector";
  if (level === "Connector") return "Mentor";
  return "Mentor";
}

export function CommunityConnectorCard() {
  const {
    state: {
      name,
      level,
      xp,
      nextLevelXp,
      progressPercent,
      motivationalMessage,
      peopleHelpedThisWeek,
      contributionsThisMonth,
      goals,
    },
    recordAction,
    updateGoals,
  } = useUserProfile();

  const nextLevelLabel = useMemo(() => getNextLevel(level), [level]);
  const xpToNext = useMemo(() => (nextLevelXp ? Math.max(nextLevelXp - xp, 0) : 0), [nextLevelXp, xp]);
  const formattedProgress = Math.min(Math.max(progressPercent, 0), 100);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [draftGoals, setDraftGoals] = useState(goals.join("\n"));

  const handleSeeNextSteps = () => {
    recordAction({
      id: `cta-next-steps-${Date.now()}`,
      label: "Viewed next steps from welcome card",
      category: "resources",
      xp: 12,
      impactPoints: 8,
    });
    const target = document.getElementById("journey-map");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "#journey-map";
    }
  };

  const handleLetAIGuide = () => {
    recordAction({
      id: `cta-let-ai-guide-${Date.now()}`,
      label: "Opened Knuut AI from welcome card",
      category: "voice",
      xp: 15,
      impactPoints: 10,
    });
    window.location.href = "/knuut-voice";
  };

  const handleOpenGoalsModal = () => {
    setDraftGoals(goals.join("\n"));
    setShowGoalsModal(true);
  };

  const handleSaveGoals = () => {
    const parsed = draftGoals
      .split(/\n|,/)
      .map((goal) => goal.trim())
      .filter((goal) => goal.length > 0);
    updateGoals(parsed);
    recordAction({
      id: `update-goals-${Date.now()}`,
      label: "Updated personal goals",
      category: "resources",
      xp: 10,
      impactPoints: 6,
    });
    setShowGoalsModal(false);
  };

  return (
    <section
      aria-labelledby="community-connector-card"
      style={{
        borderRadius: 26,
        padding: "32px 30px",
        background: "linear-gradient(135deg, #e0f2fe 0%, #ede9fe 55%, #fdf2f8 100%)",
        color: "#0f172a",
        boxShadow: "0 28px 52px rgba(79,70,229,0.18)",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, letterSpacing: 1.6, textTransform: "uppercase", color: "#4338ca", fontWeight: 700 }}>
            Your Journey So Far
          </p>
          <h2 id="community-connector-card" style={{ margin: "8px 0 10px 0", fontSize: 30, fontWeight: 800 }}>
            👋 Hi, {name}! Ready for your next step in Kajaani?
          </h2>
          <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: "#334155", maxWidth: 560 }}>
            Knuut AI is matching you with people, events, and opportunities that fit your journey. Keep the momentum going and we’ll
            take you to {nextLevelLabel} in no time.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gap: 10,
            padding: "16px 18px",
            borderRadius: 18,
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(148,163,184,0.25)",
            minWidth: 220,
            textAlign: "right",
          }}
        >
          <span style={{ fontSize: 12, letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 700, color: "#6366f1" }}>
            Level
          </span>
          <strong style={{ fontSize: 20, color: "#312e81" }}>
            {level} → Next: {nextLevelLabel}
          </strong>
          <span style={{ fontSize: 12, color: "#475569" }}>Progress: {formattedProgress}% complete</span>
        </div>
      </header>

      <div style={{ display: "grid", gap: 14 }}>
        <div
          style={{
            position: "relative",
            height: 14,
            borderRadius: 999,
            background: "rgba(148,163,184,0.25)",
            overflow: "hidden",
          }}
          aria-hidden="true"
        >
          <div
            style={{
              width: `${formattedProgress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #38bdf8 0%, #6366f1 60%, #ec4899 100%)",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13.5, color: "#4338ca", fontWeight: 600 }}>
            {nextLevelXp ? `${xpToNext} XP until ${nextLevelLabel}` : "You’re already at the top level!"}
          </span>
          <span style={{ fontSize: 13.5, color: "#475569" }}>Points: {xp} total</span>
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
            flex: "1 1 150px",
            minWidth: 150,
            borderRadius: 16,
            padding: "16px",
            background: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(148,163,184,0.25)",
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: 0.4, textTransform: "uppercase", color: "#64748b" }}>People helped</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, color: "#0f172a" }}>{peopleHelpedThisWeek}</div>
          <div style={{ fontSize: 12.5, color: "#475569" }}>this week</div>
        </div>
        <div
          style={{
            flex: "1 1 150px",
            minWidth: 150,
            borderRadius: 16,
            padding: "16px",
            background: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(148,163,184,0.25)",
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: 0.4, textTransform: "uppercase", color: "#64748b" }}>Contributions</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6, color: "#0f172a" }}>{contributionsThisMonth}</div>
          <div style={{ fontSize: 12.5, color: "#475569" }}>this month</div>
        </div>
        <div
          style={{
            flex: "1 1 180px",
            minWidth: 180,
            borderRadius: 16,
            padding: "16px",
            background: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(148,163,184,0.25)",
            display: "grid",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: 0.4, textTransform: "uppercase", color: "#64748b" }}>Momentum</div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "#334155" }}>{motivationalMessage}</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={handleSeeNextSteps}
          style={{
            padding: "12px 20px",
            borderRadius: 999,
            border: "none",
            background: "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)",
            color: "#fff",
            fontWeight: 700,
            letterSpacing: 0.4,
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "0 18px 32px rgba(79,70,229,0.25)",
          }}
        >
          See My Next Steps
        </button>
        <button
          type="button"
          onClick={handleLetAIGuide}
          style={{
            padding: "12px 20px",
            borderRadius: 999,
            border: "1px solid rgba(79,70,229,0.35)",
            background: "rgba(255,255,255,0.85)",
            color: "#312e81",
            fontWeight: 700,
            letterSpacing: 0.4,
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Let AI Guide Me
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gap: 16,
          background: "#fff",
          borderRadius: 20,
          border: "1px solid rgba(148,163,184,0.3)",
          padding: 20,
          boxShadow: "0 16px 30px rgba(59,130,246,0.12)",
        }}
      >
        <div style={{ display: "grid", gap: 12 }}>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              padding: "10px 14px",
              borderRadius: 14,
              background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(129,140,248,0.1))",
              border: "1px solid rgba(59,130,246,0.25)",
            }}
          >
            <span aria-hidden style={{ fontSize: 22 }}>⚡</span>
            <div>
              <strong style={{ display: "block", color: "#1e3a8a", fontSize: 13 }}>{"XP makes things happen"}</strong>
              <p style={{ margin: 0, fontSize: 13.5, color: "#334155" }}>
                Help someone, join a class, or finish a task → XP lands in your wallet right away.
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              padding: "10px 14px",
              borderRadius: 14,
              background: "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(134,239,172,0.1))",
              border: "1px solid rgba(34,197,94,0.25)",
            }}
          >
            <span aria-hidden style={{ fontSize: 22 }}>🎯</span>
            <div>
              <strong style={{ display: "block", color: "#166534", fontSize: 13 }}>300 XP unlocks Connector</strong>
              <p style={{ margin: 0, fontSize: 13.5, color: "#1f2937" }}>
                Connectors get new mentors, city referrals, and early pilot job invites.
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              padding: "10px 14px",
              borderRadius: 14,
              background: "linear-gradient(135deg, rgba(236,72,153,0.12), rgba(244,114,182,0.1))",
              border: "1px solid rgba(236,72,153,0.25)",
            }}
          >
            <span aria-hidden style={{ fontSize: 22 }}>🤝</span>
            <div>
              <strong style={{ display: "block", color: "#9d174d", fontSize: 13 }}>Keep momentum daily</strong>
              <p style={{ margin: 0, fontSize: 13.5, color: "#334155" }}>
                Logging even small wins helps Knuut suggest better people, hubs, and jobs.
              </p>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#6366f1" }}>Your goals</span>
            <button
              type="button"
              onClick={handleOpenGoalsModal}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid rgba(79,70,229,0.35)",
                background: "rgba(99,102,241,0.08)",
                color: "#4338ca",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Update goals
            </button>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#334155", display: "grid", gap: 6 }}>
            {(goals.length ? goals : ["Add your goals so Knuut can tailor matches."]).map((goal) => (
              <li key={goal} style={{ fontSize: 14 }}>{goal}</li>
            ))}
          </ul>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <span style={{ fontSize: 12, letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 700, color: "#6366f1" }}>
            Level guide
          </span>
          <div style={{ display: "grid", gap: 10 }}>
            {levelInfos.map((info) => (
              <div
                key={info.level}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: "10px 12px",
                  borderRadius: 14,
                  background: info.level === level ? "rgba(99,102,241,0.12)" : "rgba(148,163,184,0.12)",
                  border: info.level === level ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(148,163,184,0.25)",
                }}
              >
                <strong style={{ fontSize: 13.5, color: "#312e81" }}>{info.level}</strong>
                <span style={{ fontSize: 13, color: "#475569" }}>{info.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showGoalsModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="goals-modal-title"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              width: "min(90%, 420px)",
              background: "#fff",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 28px 60px rgba(15,23,42,0.28)",
              display: "grid",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 id="goals-modal-title" style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
                Update your goals
              </h3>
              <button
                type="button"
                onClick={() => setShowGoalsModal(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 20,
                  cursor: "pointer",
                  color: "#64748b",
                }}
                aria-label="Close goals form"
              >
                ×
              </button>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "#475569" }}>
              Tell Knuut what you want to achieve. Add one goal per line (example: “Find a part-time job”, “Finish Finnish level A2”).
            </p>
            <textarea
              value={draftGoals}
              onChange={(event) => setDraftGoals(event.target.value)}
              rows={6}
              style={{
                width: "100%",
                borderRadius: 14,
                border: "1px solid #cbd5f5",
                padding: "12px 14px",
                fontSize: 14,
                resize: "vertical",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button
                type="button"
                onClick={() => setShowGoalsModal(false)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5f5",
                  background: "#fff",
                  color: "#1e293b",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveGoals}
                style={{
                  padding: "10px 16px",
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(135deg, #6366f1, #4338ca)",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Save goals
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CommunityConnectorCard;


