"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import { motion } from "framer-motion";
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
    description: "Learn hello, thanks, and daily words. Start here!",
    progressPercent: 40,
    lessons: 12,
    completedLessons: 5,
    statusLabel: "In Progress",
    cta: "Continue",
    color: "#6366f1",
    icon: "👋",
  },
  {
    id: "track-a2",
    title: "A2 • Work & Study",
    description: "Job interviews and emails. Get ready for work!",
    progressPercent: 60,
    lessons: 15,
    completedLessons: 9,
    statusLabel: "In Progress",
    cta: "Continue",
    color: "#22c55e",
    icon: "💼",
  },
  {
    id: "track-b1",
    title: "B1 • Community Life",
    description: "Talk about family and hobbies. Make friends!",
    progressPercent: 15,
    lessons: 18,
    completedLessons: 3,
    statusLabel: "Ready",
    cta: "Start",
    color: "#f59e0b",
    icon: "🗣️",
  },
  {
    id: "track-b2",
    title: "B2 • Workplaces",
    description: "Lead meetings and solve problems. Be confident!",
    progressPercent: 5,
    lessons: 20,
    completedLessons: 1,
    statusLabel: "Preview",
    cta: "Preview",
    color: "#ec4899",
    icon: "🏢",
  },
  {
    id: "track-c1",
    title: "C1 • Advanced",
    description: "Speak like a native. Almost there!",
    progressPercent: 0,
    lessons: 25,
    completedLessons: 0,
    statusLabel: "Soon",
    cta: "View",
    color: "#8b5cf6",
    icon: "🎓",
  },
  {
    id: "track-c2",
    title: "C2 • Master",
    description: "Teach others Finnish. You're a pro!",
    progressPercent: 0,
    lessons: 30,
    completedLessons: 0,
    statusLabel: "Soon",
    cta: "View",
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

function DateDisplay({ dateString }: { dateString: string }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Format only on client to avoid hydration mismatch
  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      return `${month} ${day}`;
    } catch {
      return "";
    }
  };
  
  // Return formatted date only after mount to avoid hydration mismatch
  // Use suppressHydrationWarning as a safety net
  return <span suppressHydrationWarning>{mounted ? formatDate(dateString) : ""}</span>;
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
              padding: "48px 40px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
              color: "#ffffff",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(102,126,234,0.3)",
            }}
          >
            {/* Animated background image */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.15,
                mixBlendMode: "overlay",
              }}
            />
            
            {/* Animated gradient overlay */}
            <motion.div
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle at 30% 40%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.08) 0%, transparent 50%)",
                backgroundSize: "200% 200%",
              }}
            />

            {/* Floating decorative elements */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                top: 40,
                right: 60,
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
              }}
            >
              📚
            </motion.div>

            <motion.div
              animate={{
                y: [0, 15, 0],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              style={{
                position: "absolute",
                bottom: 50,
                right: 100,
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              ✏️
            </motion.div>

            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              style={{
                position: "absolute",
                top: 120,
                right: 200,
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              🌟
            </motion.div>

            <div
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexWrap: "wrap",
                gap: 24,
                alignItems: "center",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ display: "grid", gap: 16, flex: "1 1 400px", minWidth: 0 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.25)",
                      backdropFilter: "blur(10px)",
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 1.2,
                      color: "#ffffff",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    🎓 COMPLETE FINNISH CURRICULUM
                  </motion.span>
                </div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  style={{
                    margin: 0,
                    fontSize: "clamp(2rem, 5vw, 3rem)",
                    lineHeight: 1.2,
                    fontWeight: 800,
                    color: "#ffffff",
                    textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  Learn Finnish with Knuut AI
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  style={{
                    margin: 0,
                    fontSize: "1.1rem",
                    lineHeight: 1.6,
                    opacity: 0.95,
                    maxWidth: 560,
                    color: "#ffffff",
                    textShadow: "0 1px 4px rgba(0,0,0,0.15)",
                  }}
                >
                  Start from zero. Learn step by step. Speak Finnish like a local.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  style={{ display: "flex", flexWrap: "wrap", gap: 12 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleScrollToPractice}
                    style={{
                      padding: "14px 24px",
                      borderRadius: 16,
                      border: "none",
                      background: "rgba(255,255,255,0.95)",
                      color: "#667eea",
                      fontWeight: 700,
                      fontSize: 15,
                      cursor: "pointer",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    }}
                  >
                    Start Practicing →
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleScrollToCurriculum}
                    style={{
                      padding: "14px 24px",
                      borderRadius: 16,
                      border: "2px solid rgba(255,255,255,0.5)",
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                  >
                    Explore Curriculum →
                  </motion.button>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 16,
                  flex: "0 0 auto",
                  minWidth: 200,
                }}
              >
                {[
                  { value: totalXP, label: "Total XP", delay: 0.7 },
                  { value: wordsLearned, label: "Words Learned", delay: 0.8 },
                  { value: streakDays, label: "Day Streak", icon: "🔥", delay: 0.9 },
                  { value: certificatesEarned, label: "Certificates", delay: 1.0 },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: stat.delay }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    style={{
                      borderRadius: 20,
                      padding: 20,
                      background: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      display: "grid",
                      gap: 8,
                      textAlign: "center",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#667eea" }}>
                      {stat.icon && `${stat.icon} `}
                      {stat.value}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          <section ref={practiceRef} style={{ display: "grid", gap: 28 }}>
            <FinnishLanguageBuddy />
          </section>

          <section style={{ display: "grid", gap: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: "#0f172a" }}>Your Learning Path</h2>
                <p style={{ margin: "8px 0 0 0", fontSize: 15, color: "#64748b" }}>
                  Go from beginner to expert. 6 levels. 120+ lessons.
                </p>
              </div>
              <span
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  background: "#eef2f7",
                  color: "#0f172a",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                A1 → C2
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
                    borderRadius: 20,
                    padding: 24,
                    background: "#ffffff",
                    border: `2px solid ${track.color}20`,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    display: "grid",
                    gap: 16,
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.borderColor = `${track.color}40`;
                    e.currentTarget.style.boxShadow = `0 8px 20px ${track.color}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = `${track.color}20`;
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
                  }}
                  onClick={() => {
                    if (track.id.includes("c1") || track.id.includes("c2")) {
                      handleScrollToCurriculum();
                    } else {
                      alert("Opening lesson...");
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 16,
                        background: `${track.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 32,
                        flexShrink: 0,
                      }}
                    >
                      {track.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                        {track.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.4 }}>{track.description}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: "grid", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>Progress</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: track.color }}>
                        {track.completedLessons}/{track.lessons}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        borderRadius: 999,
                        background: "#e5e7eb",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${track.progressPercent}%`,
                          height: "100%",
                          background: track.color,
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: `${track.color}15`,
                        color: track.color,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {track.statusLabel}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (track.id.includes("c1") || track.id.includes("c2")) {
                          handleScrollToCurriculum();
                        } else {
                          alert("Opening lesson...");
                        }
                      }}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "none",
                        background: track.progressPercent > 0 ? track.color : "#e5e7eb",
                        color: track.progressPercent > 0 ? "#ffffff" : "#64748b",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      {track.cta}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section style={{ display: "grid", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 10 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#0f172a" }}>Quick Challenges</h2>
                <p style={{ margin: "6px 0 0 0", fontSize: 14, color: "#64748b" }}>5 minutes. Big wins.</p>
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
                    borderRadius: 16,
                    border: "1px solid #e5e7eb",
                    background: "#ffffff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    gap: 12,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)";
                    e.currentTarget.style.borderColor = "#cbd5e1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                    e.currentTarget.style.borderColor = "#e5e7eb";
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 4 }}>{challenge.icon}</div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>
                    {challenge.label}
                  </span>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 12, color: "#64748b" }}>
                    <span>{challenge.time}</span>
                    <span style={{ color: "#22c55e", fontWeight: 700 }}>+{challenge.xp} XP</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section ref={curriculumRef} style={{ display: "grid", gap: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: "#0f172a" }}>Full Curriculum</h2>
                <p style={{ margin: "8px 0 0 0", fontSize: 15, color: "#64748b" }}>
                  All lessons, words, and exercises in one place.
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
                <h2 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: "#0f172a" }}>Your Progress</h2>
                <p style={{ margin: "8px 0 0 0", fontSize: 15, color: "#64748b" }}>
                  See how much you've learned. Get certificates.
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
                    borderRadius: 16,
                    padding: 24,
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    display: "grid",
                    gap: 8,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 36, fontWeight: 800, color: "#0f172a" }}>{totalXP}</div>
                  <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Total XP</div>
                </div>
                <div
                  style={{
                    borderRadius: 16,
                    padding: 24,
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    display: "grid",
                    gap: 8,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 36, fontWeight: 800, color: "#0f172a" }}>{lessonsCompleted}</div>
                  <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Lessons Done</div>
                </div>
                <div
                  style={{
                    borderRadius: 16,
                    padding: 24,
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    display: "grid",
                    gap: 8,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 36, fontWeight: 800, color: "#0f172a" }}>{totalConversations}</div>
                  <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Conversations</div>
                </div>
                <div
                  style={{
                    borderRadius: 16,
                    padding: 24,
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    display: "grid",
                    gap: 8,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 36, fontWeight: 800, color: "#0f172a" }}>{certificatesEarned}</div>
                  <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Certificates</div>
                </div>
                <div
                  style={{
                    borderRadius: 16,
                    padding: 24,
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    display: "grid",
                    gap: 8,
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: 36, fontWeight: 800, color: "#0f172a" }}>🔥 {streakDays}</div>
                  <div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Day Streak</div>
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
                <h2 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: "#0f172a" }}>Your Achievements</h2>
                <p style={{ margin: "8px 0 0 0", fontSize: 15, color: "#64748b" }}>
                  Show what you learned. Share with employers.
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
                    borderRadius: 16,
                    padding: 20,
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    display: "grid",
                    gap: 12,
                  }}
                >
                  <div>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: "#eef2f7",
                        color: "#0f172a",
                        fontSize: 11,
                        fontWeight: 700,
                        display: "inline-block",
                        marginBottom: 8,
                      }}
                    >
                      {entry.category}
                    </span>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                      {entry.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
                      {entry.details ?? "You finished AI practice sessions."}
                    </p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#64748b" }} suppressHydrationWarning>
                      <DateDisplay dateString={entry.earnedAt} />
                    </span>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: "#f0fdf4",
                        color: "#166534",
                        fontSize: 11,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      ✓ Verified
                    </span>
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

