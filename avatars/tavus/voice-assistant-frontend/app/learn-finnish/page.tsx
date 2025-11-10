"use client";

import { useMemo, useRef, useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import FinnishLanguageBuddy from "@/components/FinnishLanguageBuddy";
import FinnishTextbookContent from "@/components/FinnishTextbookContent";
import { useUserProfile } from "@/context/UserProfileContext";

type SkillTrack = {
  id: string;
  title: string;
  description: string;
  progressPercent: number;
  lessons: number;
  completedLessons: number;
  statusLabel: string;
  cta: string;
  color: string;
  icon: string;
};

type QuickChallenge = {
  id: string;
  label: string;
  xp: number;
  icon: string;
  time: string;
};

const SKILL_TRACKS: SkillTrack[] = [
  {
    id: "track-a1",
    title: "A1 • Everyday Finnish",
    description: "Survival phrases, greetings, and daily routines. Master 120+ essential words and 8 core grammar rules.",
    progressPercent: 40,
    lessons: 12,
    completedLessons: 5,
    statusLabel: "In Progress",
    cta: "Continue Learning →",
    color: "#6366f1",
    icon: "👋",
  },
  {
    id: "track-a2",
    title: "A2 • Work & Study",
    description: "Finnish for job interviews, emails, and campus life. Build professional confidence with 200+ vocabulary.",
    progressPercent: 60,
    lessons: 15,
    completedLessons: 9,
    statusLabel: "In Progress",
    cta: "Continue Learning →",
    color: "#22c55e",
    icon: "💼",
  },
  {
    id: "track-b1",
    title: "B1 • Community Life",
    description: "Talk naturally about family, hobbies, and local news. Advanced conversations with 350+ words.",
    progressPercent: 15,
    lessons: 18,
    completedLessons: 3,
    statusLabel: "Ready to Start",
    cta: "Start Learning →",
    color: "#f59e0b",
    icon: "🗣️",
  },
  {
    id: "track-b2",
    title: "B2 • Workplaces",
    description: "Lead conversations and solve problems in Finnish. Professional fluency with 500+ vocabulary.",
    progressPercent: 5,
    lessons: 20,
    completedLessons: 1,
    statusLabel: "Preview Available",
    cta: "Preview Course →",
    color: "#ec4899",
    icon: "🏢",
  },
  {
    id: "track-c1",
    title: "C1 • Advanced Mastery",
    description: "Academic and professional excellence. Native-level nuance with 800+ vocabulary.",
    progressPercent: 0,
    lessons: 25,
    completedLessons: 0,
    statusLabel: "Coming Soon",
    cta: "View Curriculum →",
    color: "#8b5cf6",
    icon: "🎓",
  },
  {
    id: "track-c2",
    title: "C2 • Native Fluency",
    description: "Mentor others and teach Finnish. Complete mastery with 1000+ vocabulary and cultural depth.",
    progressPercent: 0,
    lessons: 30,
    completedLessons: 0,
    statusLabel: "Coming Soon",
    cta: "View Curriculum →",
    color: "#06b6d4",
    icon: "🌟",
  },
];

const QUICK_CHALLENGES: QuickChallenge[] = [
  { id: "qc-greetings", label: "Practice Finnish greetings", xp: 20, icon: "👋", time: "3 min" },
  { id: "qc-breakfast", label: "Describe your breakfast", xp: 15, icon: "🍞", time: "5 min" },
  { id: "qc-signs", label: "Translate 3 city signs", xp: 10, icon: "🚏", time: "4 min" },
  { id: "qc-numbers", label: "Master numbers 1-100", xp: 25, icon: "🔢", time: "6 min" },
];

function ProgressRing({ percent, size = 80, strokeWidth = 8, color }: { percent: number; size?: number; strokeWidth?: number; color: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{percent}%</div>
      </div>
    </div>
  );
}

export default function LearnFinnishPage() {
  const [activeTab, setActiveTab] = useState("explore");
  const [room] = useState(new Room());
  const practiceRef = useRef<HTMLDivElement | null>(null);
  const curriculumRef = useRef<HTMLDivElement | null>(null);
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
  const totalXP = userState.xp;
  const wordsLearned = 180;

  const handleScrollToPractice = () => {
    practiceRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToCurriculum = () => {
    curriculumRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} onLearnFinnishClick={handleLearnFinnishClick} />

        <main
          style={{ 
            flex: 1,
            padding: "32px 28px",
            background: "#f8fafc",
            minHeight: "100vh",
            overflowY: "auto",
          }}
        >
          <div style={{ display: "grid", gap: 24 }}>
          <section
            style={{
              position: "relative",
              borderRadius: 32,
              padding: "40px 36px",
              background: "linear-gradient(135deg, #4338ca 0%, #6366f1 45%, #ec4899 100%)",
              color: "#f8fafc",
              overflow: "hidden",
              boxShadow: "0 32px 64px rgba(67,56,202,0.28)",
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
                opacity: 0.15,
              }}
            />
            <div
              style={{
                position: "relative",
                display: "flex",
                flexWrap: "wrap",
                gap: 24,
                alignItems: "center",
              }}
            >
              <div style={{ display: "grid", gap: 16, flex: "1 1 400px", minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.2)",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 1.2,
                    }}
                  >
                    🎓 COMPLETE FINNISH CURRICULUM
                  </span>
                </div>
                <h1 style={{ margin: 0, fontSize: "2.2rem", lineHeight: 1.2, fontWeight: 800 }}>
                  Learn Finnish with Knuut AI
                </h1>
                <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: 1.6, opacity: 0.95, maxWidth: 560 }}>
                  From A1 survival basics to C2 native fluency. Interactive lessons, AI conversations, music, culture, and real-world practice.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  <button
                    type="button"
                    onClick={handleScrollToPractice}
                    style={{
                      padding: "12px 20px",
                      borderRadius: 16,
                      border: "none",
                      background: "rgba(15,23,42,0.35)",
                      color: "#f8fafc",
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "pointer",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                    }}
                  >
                    Start Practicing →
                  </button>
                  <button
                    type="button"
                    onClick={handleScrollToCurriculum}
                    style={{
                      padding: "12px 20px",
                      borderRadius: 16,
                      border: "2px solid rgba(248,250,252,0.6)",
                      background: "rgba(248,250,252,0.15)",
                      color: "#f8fafc",
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    Explore Curriculum →
                  </button>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 14,
                  flex: "0 0 auto",
                  minWidth: 200,
                }}
              >
                <div
                  style={{
                    borderRadius: 20,
                    padding: 18,
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    display: "grid",
                    gap: 6,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 28, fontWeight: 900 }}>{totalXP}</div>
                  <div style={{ fontSize: 12, opacity: 0.9 }}>Total XP</div>
                </div>
                <div
                  style={{
                    borderRadius: 20,
                    padding: 18,
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    display: "grid",
                    gap: 6,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 28, fontWeight: 900 }}>{wordsLearned}</div>
                  <div style={{ fontSize: 12, opacity: 0.9 }}>Words Learned</div>
                </div>
                <div
                  style={{
                    borderRadius: 20,
                    padding: 18,
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    display: "grid",
                    gap: 6,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 28, fontWeight: 900 }}>🔥 {streakDays}</div>
                  <div style={{ fontSize: 12, opacity: 0.9 }}>Day Streak</div>
                </div>
                <div
                  style={{
                    borderRadius: 20,
                    padding: 18,
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    display: "grid",
                    gap: 6,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 28, fontWeight: 900 }}>{certificatesEarned}</div>
                  <div style={{ fontSize: 12, opacity: 0.9 }}>Certificates</div>
                </div>
              </div>
            </div>
          </section>

          <section ref={practiceRef} style={{ display: "grid", gap: 28 }}>
            <FinnishLanguageBuddy />
          </section>

          <section style={{ display: "grid", gap: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: "#0f172a" }}>Complete Learning Path</h2>
                <p style={{ margin: "8px 0 0 0", fontSize: 15, color: "#64748b" }}>
                  Master Finnish from beginner to mentor level. 120+ structured lessons across 6 levels.
                </p>
              </div>
              <span
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #e0f2fe, #ede9fe)",
                  color: "#1d4ed8",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                A1 → C2 Curriculum
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 24,
              }}
            >
              {SKILL_TRACKS.map((track) => (
                <article
                  key={track.id}
                  style={{
                    borderRadius: 28,
                    padding: 28,
                    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                    border: "2px solid #e2e8f0",
                    boxShadow: "0 24px 48px rgba(148,163,184,0.18)",
                    display: "grid",
                    gap: 20,
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 32px 64px rgba(148,163,184,0.24)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 24px 48px rgba(148,163,184,0.18)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ display: "grid", gap: 8, flex: 1 }}>
                      <div style={{ fontSize: 32 }}>{track.icon}</div>
                      <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{track.title}</h3>
                      <p style={{ margin: 0, fontSize: 13.5, color: "#475569", lineHeight: 1.6 }}>{track.description}</p>
                    </div>
                    <ProgressRing percent={track.progressPercent} color={track.color} />
                  </div>
                  <div style={{ display: "grid", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: "#64748b" }}>Lessons</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                        {track.completedLessons} / {track.lessons}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 8,
                        borderRadius: 999,
                        background: "#e2e8f0",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${track.progressPercent}%`,
                          height: "100%",
                          background: `linear-gradient(135deg, ${track.color}, ${track.color}dd)`,
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          background: `${track.color}15`,
                          color: track.color,
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {track.statusLabel}
                      </span>
                      <span style={{ fontSize: 12, color: "#64748b" }}>{track.progressPercent}% complete</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (track.id.includes("c1") || track.id.includes("c2")) {
                        handleScrollToCurriculum();
                      } else {
                        alert("Opening lesson...");
                      }
                    }}
                    style={{
                      padding: "12px 20px",
                      borderRadius: 16,
                      border: "none",
                      background: `linear-gradient(135deg, ${track.color}, ${track.color}dd)`,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "pointer",
                      boxShadow: `0 12px 24px ${track.color}40`,
                    }}
                  >
                    {track.cta}
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section style={{ display: "grid", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#0f172a" }}>Quick Challenges</h2>
                <p style={{ margin: "6px 0 0 0", fontSize: 14, color: "#64748b" }}>Level up with bite-sized 5-minute wins</p>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
              }}
            >
              {QUICK_CHALLENGES.map((challenge) => (
                <button
                  key={challenge.id}
                  type="button"
                  onClick={() => alert("Challenge starting...")}
                  style={{
                    borderRadius: 20,
                    border: "2px solid #e2e8f0",
                    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                    boxShadow: "0 16px 32px rgba(148,163,184,0.14)",
                    padding: 20,
                    display: "grid",
                    gap: 12,
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ fontSize: 32 }}>{challenge.icon}</div>
                  <div style={{ display: "grid", gap: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{challenge.label}</span>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "#64748b" }}>{challenge.time}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#22c55e" }}>+{challenge.xp} XP</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section ref={curriculumRef} style={{ display: "grid", gap: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: "#0f172a" }}>Interactive Curriculum</h2>
                <p style={{ margin: "8px 0 0 0", fontSize: 15, color: "#64748b" }}>
                  Explore lessons, vocabulary, grammar, listening exercises, culture activities, and assignments
                </p>
              </div>
            </div>
            <div
              style={{
                borderRadius: 32,
                border: "2px solid #e2e8f0",
                background: "#fff",
                boxShadow: "0 32px 64px rgba(15,23,42,0.12)",
                overflow: "hidden",
              }}
            >
          <FinnishTextbookContent />
            </div>
          </section>

          <section id="finnish-progress-panel" style={{ display: "grid", gap: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: "#0f172a" }}>My Finnish Journey</h2>
                <p style={{ margin: "8px 0 0 0", fontSize: 15, color: "#64748b" }}>
                  Track your progress, achievements, and certificates. Everything syncs automatically.
                </p>
              </div>
            </div>
            <div
              style={{
                borderRadius: 32,
                border: "2px solid #e2e8f0",
                background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                boxShadow: "0 32px 64px rgba(15,23,42,0.16)",
                padding: 40,
                display: "grid",
                gap: 32,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 24,
                }}
              >
                <div
                  style={{
                    borderRadius: 24,
                    padding: 28,
                    background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))",
                    border: "2px solid rgba(59,130,246,0.2)",
                    display: "grid",
                    gap: 8,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 42, fontWeight: 900, color: "#1d4ed8" }}>{totalXP}</div>
                  <div style={{ fontSize: 13, color: "#475569", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}>
                    Total XP
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: 24,
                    padding: 28,
                    background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(34,197,94,0.05))",
                    border: "2px solid rgba(34,197,94,0.2)",
                    display: "grid",
                    gap: 8,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 42, fontWeight: 900, color: "#15803d" }}>{lessonsCompleted}</div>
                  <div style={{ fontSize: 13, color: "#475569", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}>
                    Lessons Completed
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: 24,
                    padding: 28,
                    background: "linear-gradient(135deg, rgba(236,72,153,0.1), rgba(236,72,153,0.05))",
                    border: "2px solid rgba(236,72,153,0.2)",
                    display: "grid",
                    gap: 8,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 42, fontWeight: 900, color: "#be185d" }}>{totalConversations}</div>
                  <div style={{ fontSize: 13, color: "#475569", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}>
                    Conversations Logged
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: 24,
                    padding: 28,
                    background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))",
                    border: "2px solid rgba(139,92,246,0.2)",
                    display: "grid",
                    gap: 8,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 42, fontWeight: 900, color: "#7c3aed" }}>{certificatesEarned}</div>
                  <div style={{ fontSize: 13, color: "#475569", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}>
                    Certificates Earned
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: 24,
                    padding: 28,
                    background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))",
                    border: "2px solid rgba(245,158,11,0.2)",
                    display: "grid",
                    gap: 8,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 42, fontWeight: 900, color: "#d97706" }}>🔥 {streakDays}</div>
                  <div style={{ fontSize: 13, color: "#475569", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 700 }}>
                    Day Streak
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => (window.location.href = "/my-journey")}
                  style={{
                    padding: "14px 24px",
                    borderRadius: 18,
                    border: "none",
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: "pointer",
                    boxShadow: "0 16px 32px rgba(34,197,94,0.3)",
                  }}
                >
                  View Full Skill Passport →
                </button>
                <button
                  type="button"
                  onClick={() => alert("Certificate download coming soon.")}
                  style={{
                    padding: "14px 24px",
                    borderRadius: 18,
                    border: "2px solid #cbd5f5",
                    background: "#f8fafc",
                    color: "#1d4ed8",
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  Download Certificates →
                </button>
              </div>
            </div>
          </section>

          <section style={{ display: "grid", gap: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: "#0f172a" }}>Skill Passport Highlights</h2>
                <p style={{ margin: "8px 0 0 0", fontSize: 15, color: "#64748b" }}>
                  Verified proof of learning ready for mentors, employers, and integration coaches
                </p>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {skillPassportEntries.map((entry) => (
                <article
                  key={entry.id}
                  style={{
                    borderRadius: 24,
                    padding: 24,
                    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                    border: "2px solid #e2e8f0",
                    boxShadow: "0 20px 40px rgba(148,163,184,0.16)",
                    display: "grid",
                    gap: 14,
                  }}
                >
                  <div style={{ display: "grid", gap: 6 }}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        background: "linear-gradient(135deg, #e0f2fe, #ede9fe)",
                        color: "#1d4ed8",
                        fontSize: 12,
                        fontWeight: 700,
                        width: "fit-content",
                      }}
                    >
                      {entry.category}
                    </span>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{entry.title}</h3>
                    <p style={{ margin: 0, fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
                      {entry.details ?? "Completed AI sessions and verified practice."}
                    </p>
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b" }}>
                    Updated {new Date(entry.earnedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                  <div
                    style={{
                      padding: "8px 14px",
                      borderRadius: 12,
                      border: "2px solid rgba(34,197,94,0.3)",
                      background: "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.06))",
                      color: "#166534",
                      fontSize: 13,
                      fontWeight: 700,
                      width: "fit-content",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    ✅ Verified by AI coach
                  </div>
                </article>
              ))}
            </div>
          </section>
          </div>
        </main>
      </div>
    </RoomContext.Provider>
  );
}
