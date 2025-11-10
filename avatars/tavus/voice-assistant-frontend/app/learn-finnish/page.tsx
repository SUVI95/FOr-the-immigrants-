"use client";

import { useMemo, useRef, useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import FinnishLanguageBuddy from "@/components/FinnishLanguageBuddy";
import { useUserProfile } from "@/context/UserProfileContext";

type SkillTrack = {
  id: string;
  title: string;
  description: string;
  progressPercent: number;
  statusLabel: string;
  cta: string;
};

type QuickChallenge = {
  id: string;
  label: string;
  xp: number;
};

const SKILL_TRACKS: SkillTrack[] = [
  {
    id: "track-a1",
    title: "A1 • Everyday Finnish",
    description: "Survival phrases, greetings, and daily routines.",
    progressPercent: 40,
    statusLabel: "Continue",
    cta: "Continue →",
  },
  {
    id: "track-a2",
    title: "A2 • Work & Study",
    description: "Finnish for job interviews, emails, and campus life.",
    progressPercent: 60,
    statusLabel: "In progress",
    cta: "Continue →",
  },
  {
    id: "track-b1",
    title: "B1 • Community Life",
    description: "Talk naturally about family, hobbies, and local news.",
    progressPercent: 15,
    statusLabel: "Ready to start",
    cta: "Start →",
  },
  {
    id: "track-b2",
    title: "B2 • Workplaces",
    description: "Lead conversations and solve problems in Finnish.",
    progressPercent: 5,
    statusLabel: "Locked",
    cta: "Preview",
  },
];

const QUICK_CHALLENGES: QuickChallenge[] = [
  { id: "qc-greetings", label: "Practice Finnish greetings", xp: 20 },
  { id: "qc-breakfast", label: "Describe your breakfast", xp: 15 },
  { id: "qc-signs", label: "Translate 3 city signs", xp: 10 },
];

export default function LearnFinnishPage() {
  const [activeTab, setActiveTab] = useState("explore");
  const [room] = useState(new Room());
  const practiceRef = useRef<HTMLDivElement | null>(null);
  const { state: userState } = useUserProfile();

  const handleLearnFinnishClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleTabChange = (tab: string) => {
    if (tab === "explore") {
      window.location.href = "/";
      return;
    }
    setActiveTab(tab);
  };

  const skillPassportEntries = userState.skillPassport.entries.slice(0, 3);
  const languageActions = useMemo(
    () =>
      Object.values(userState.actionHistory).filter(
        (entry) => entry.category === "learning" && entry.label.toLowerCase().includes("language"),
      ),
    [userState.actionHistory],
  );
  const totalConversations = languageActions.length;
  const lessonsCompleted = userState.pathway.nodes.filter((node) => node.area === "language" && node.status === "done").length;
  const certificatesEarned = Math.max(2, Math.floor(userState.skillPassport.entries.length / 2));
  const streakDays = 6;

  const handleScrollToPractice = () => {
    practiceRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToProgress = () => {
    document.getElementById("finnish-progress-panel")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} onLearnFinnishClick={handleLearnFinnishClick} />

        <main
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "40px 24px 80px",
            background: "#f8fafc",
            minHeight: "100vh",
            display: "grid",
            gap: 36,
          }}
        >
          <section
            style={{
              position: "relative",
              borderRadius: 36,
              padding: "56px 48px",
              background: "linear-gradient(135deg, #4338ca 0%, #6366f1 45%, #ec4899 100%)",
              color: "#f8fafc",
              overflow: "hidden",
              boxShadow: "0 40px 70px rgba(67,56,202,0.28)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1530023367847-a683933f4177?auto=format&fit=crop&w=1600&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.18,
              }}
            />
            <div
              style={{
                position: "relative",
                display: "grid",
                gap: 20,
                maxWidth: 700,
              }}
            >
              <h1 style={{ margin: 0, fontSize: "3.2rem", lineHeight: 1.05, fontWeight: 800 }}>
                Learn Finnish with Knuut AI
              </h1>
              <p style={{ margin: 0, fontSize: "1.15rem", lineHeight: 1.6, opacity: 0.92 }}>
                Speak confidently. Learn daily. See your progress grow. Your AI Buddy helps you practice real-life Finnish through short, focused chats and challenges.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
                <button
                  type="button"
                  onClick={handleScrollToPractice}
                  style={{
                    padding: "14px 24px",
                    borderRadius: 18,
                    border: "none",
                    background: "rgba(15,23,42,0.28)",
                    color: "#f8fafc",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Start Practicing
                </button>
                <button
                  type="button"
                  onClick={handleScrollToProgress}
                  style={{
                    padding: "14px 24px",
                    borderRadius: 18,
                    border: "1px solid rgba(248,250,252,0.5)",
                    background: "rgba(248,250,252,0.12)",
                    color: "#f8fafc",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  See My Progress
                </button>
              </div>
            </div>
          </section>

          <section ref={practiceRef} style={{ display: "grid", gap: 28 }}>
            <FinnishLanguageBuddy />
          </section>

          <section style={{ display: "grid", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#0f172a" }}>Skill tracks</h2>
              <span style={{ fontSize: 13, color: "#64748b" }}>Pick a level to unlock curated lessons</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 18,
              }}
            >
              {SKILL_TRACKS.map((track) => (
                <article
                  key={track.id}
                  style={{
                    borderRadius: 22,
                    padding: 22,
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 18px 34px rgba(148,163,184,0.14)",
                    display: "grid",
                    gap: 14,
                  }}
                >
                  <div style={{ display: "grid", gap: 6 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{track.title}</h3>
                    <p style={{ margin: 0, fontSize: 13.5, color: "#475569", lineHeight: 1.6 }}>{track.description}</p>
                  </div>
                  <div style={{ display: "grid", gap: 6 }}>
                    <div
                      style={{
                        height: 10,
                        borderRadius: 999,
                        background: "#e2e8f0",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${track.progressPercent}%`,
                          height: "100%",
                          background: "linear-gradient(135deg, #22d3ee, #6366f1)",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 12.5, color: "#475569" }}>Progress: {track.progressPercent}%</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("Lesson navigation coming soon.")}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 14,
                      border: "none",
                      background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {track.cta}
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section style={{ display: "grid", gap: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>Quick challenges</h2>
              <span style={{ fontSize: 13, color: "#64748b" }}>Level up with 5-minute wins</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              {QUICK_CHALLENGES.map((challenge) => (
                <button
                  key={challenge.id}
                  type="button"
                  onClick={() => alert("Challenge start coming soon.")}
                  style={{
                    borderRadius: 18,
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    boxShadow: "0 12px 24px rgba(148,163,184,0.12)",
                    padding: 18,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 14,
                    color: "#0f172a",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <span>{challenge.label}</span>
                  <span style={{ color: "#22c55e", fontWeight: 700 }}>+{challenge.xp} XP</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => alert("Quick drills coming soon.")}
              style={{
                justifySelf: "flex-start",
                padding: "10px 16px",
                borderRadius: 14,
                border: "1px solid #cbd5f5",
                background: "#f8fafc",
                color: "#1d4ed8",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Start quick drill
            </button>
          </section>

          <section id="finnish-progress-panel" style={{ display: "grid", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>My Finnish journey</h2>
              <span style={{ fontSize: 13, color: "#64748b" }}>Everything syncs to Skill Passport automatically</span>
            </div>
            <div
              style={{
                borderRadius: 26,
                border: "1px solid #e2e8f0",
                background: "#fff",
                boxShadow: "0 24px 40px rgba(15,23,42,0.12)",
                padding: 28,
                display: "grid",
                gap: 18,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 18,
                }}
              >
                <div style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "#475569", textTransform: "uppercase", letterSpacing: 0.6 }}>Total XP</span>
                  <strong style={{ fontSize: 26, color: "#0f172a" }}>{userState.xp}</strong>
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "#475569", textTransform: "uppercase", letterSpacing: 0.6 }}>Lessons Completed</span>
                  <strong style={{ fontSize: 26, color: "#0f172a" }}>{lessonsCompleted}</strong>
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "#475569", textTransform: "uppercase", letterSpacing: 0.6 }}>Conversations Logged</span>
                  <strong style={{ fontSize: 26, color: "#0f172a" }}>{totalConversations}</strong>
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "#475569", textTransform: "uppercase", letterSpacing: 0.6 }}>Certificates Earned</span>
                  <strong style={{ fontSize: 26, color: "#0f172a" }}>{certificatesEarned}</strong>
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "#475569", textTransform: "uppercase", letterSpacing: 0.6 }}>Streak</span>
                  <strong style={{ fontSize: 26, color: "#0f172a" }}>🔥 {streakDays} days</strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => (window.location.href = "/my-journey")}
                style={{
                  justifySelf: "flex-start",
                  padding: "12px 18px",
                  borderRadius: 14,
                  border: "none",
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                View Skill Passport
              </button>
            </div>
          </section>

          <section style={{ display: "grid", gap: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>Skill Passport highlights</h2>
              <span style={{ fontSize: 13, color: "#64748b" }}>Proof of learning ready for mentors and employers</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 16,
              }}
            >
              {skillPassportEntries.map((entry) => (
                <article
                  key={entry.id}
                  style={{
                    borderRadius: 20,
                    padding: 20,
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 18px 32px rgba(148,163,184,0.12)",
                    display: "grid",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "grid", gap: 4 }}>
                    <span style={{ fontSize: 13, color: "#6366f1", fontWeight: 700 }}>{entry.category}</span>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{entry.title}</h3>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{entry.details ?? "Completed AI sessions and verified practice."}</p>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    Updated {new Date(entry.earnedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                  <div
                    style={{
                      padding: "6px 10px",
                      borderRadius: 12,
                      border: "1px solid rgba(34,197,94,0.25)",
                      background: "rgba(34,197,94,0.08)",
                      color: "#166534",
                      fontSize: 12,
                      fontWeight: 600,
                      width: "fit-content",
                    }}
                  >
                    ✅ Verified by AI coach
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </RoomContext.Provider>
  );
}
