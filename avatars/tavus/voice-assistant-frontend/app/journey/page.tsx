"use client";

import { useMemo, useState, useEffect } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { useUserProfile } from "@/context/UserProfileContext";
import { IntegrationHubMap } from "@/components/dashboard/IntegrationHubMap";

type SuccessStory = {
  id: string;
  name: string;
  role: string;
  quote: string;
  achievement: string;
  avatar?: string;
};

const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: "story-1",
    name: "Amina",
    role: "From Syria, arrived 6 months ago",
    quote: "Knuut helped me find a job in 3 months. The voice practice made my Finnish good enough for interviews.",
    achievement: "Now working at Kajaani Café",
    avatar: "👩‍💼",
  },
  {
    id: "story-2",
    name: "Mohammed",
    role: "From Iraq, arrived 4 months ago",
    quote: "I was lost. Knuut connected me to mentors and I got my first job shadowing opportunity.",
    achievement: "Started internship at Tech Hub",
    avatar: "👨‍💻",
  },
  {
    id: "story-3",
    name: "Fatima",
    role: "From Afghanistan, arrived 8 months ago",
    quote: "The community groups helped me feel at home. Now I help other mothers navigate Finnish services.",
    achievement: "Mentor at Mothers & Families Network",
    avatar: "👩‍👧",
  },
];

const COMMUNITY_LIVE_STATS = {
  peopleOnline: 47,
  eventsToday: 3,
  newMembersThisWeek: 23,
  activeLearners: 89,
};

export default function JourneyPage() {
  const { state, recordAction } = useUserProfile();
  const [room] = useMemo(() => [new Room()], []);

  const nextAction = useMemo(() => {
    return state.pathway.nodes.find((node) => node.status === "in-progress" || node.status === "up-next");
  }, [state.pathway.nodes]);

  // Calculate real progress metrics
  const progressMetrics = useMemo(() => {
    const totalNodes = state.pathway.nodes.length;
    const completedNodes = state.pathway.nodes.filter((node) => node.status === "done").length;
    const inProgressNodes = state.pathway.nodes.filter((node) => node.status === "in-progress").length;
    const progressPercentage = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;
    
    // Get recent completed milestones (last 3)
    const recentMilestones = state.pathway.nodes
      .filter((node) => node.status === "done" && node.completedAt)
      .sort((a, b) => {
        const dateA = new Date(a.completedAt || 0).getTime();
        const dateB = new Date(b.completedAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 3);

    // Get upcoming milestones (next 2-3)
    const upcomingMilestones = state.pathway.nodes
      .filter((node) => node.status === "up-next" || node.status === "in-progress")
      .slice(0, 3);

    // Calculate XP to next level
    const xpToNextLevel = state.nextLevelXp ? state.nextLevelXp - state.xp : null;
    const xpProgress = state.nextLevelXp ? state.progressPercent : 100;

    return {
      progressPercentage,
      completedNodes,
      totalNodes,
      inProgressNodes,
      recentMilestones,
      upcomingMilestones,
      currentLevel: state.level,
      xp: state.xp,
      xpToNextLevel,
      xpProgress,
      nextLevel: state.nextLevelXp ? (state.level === "Explorer" ? "Connector" : state.level === "Connector" ? "Mentor" : null) : null,
      peopleHelped: state.peopleHelpedThisWeek,
      contributions: state.contributionsThisMonth,
    };
  }, [state]);

  // Level benefits information
  const levelBenefits = {
    Explorer: {
      xpRange: "0-299 XP",
      benefits: [
        "Access to all learning resources",
        "Join community events and groups",
        "Build your skill passport",
        "Connect with peers and mentors",
      ],
      color: "#2563eb",
    },
    Connector: {
      xpRange: "300-699 XP",
      benefits: [
        "Everything from Explorer, plus:",
        "Unlock exclusive mentorship opportunities",
        "Priority access to workshops",
        "Create and host peer circles",
        "Earn recognition badges",
      ],
      color: "#059669",
    },
    Mentor: {
      xpRange: "700+ XP",
      benefits: [
        "Everything from Connector, plus:",
        "Become a verified mentor",
        "Access advanced community tools",
        "Lead integration programs",
        "Earn impact rewards",
      ],
      color: "#d97706",
    },
  };

  // Get one suggested work opportunity (simplified - in real app, this would be AI-matched)
  const suggestedWork = useMemo(() => {
    // Mock suggestion - replace with actual matching logic
    return {
      id: "suggested-work-1",
      title: "Kitchen Internship",
      company: "Kainuu Hospitality",
      reason: "Matches your Food Service track and A2 Finnish level",
      xpReward: 70,
    };
  }, []);

  // Get one suggested community activity
  const suggestedCommunity = useMemo(() => {
    return {
      id: "suggested-community-1",
      title: "Finnish Language Café",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      reason: "Practice Finnish in a relaxed setting",
      xpReward: 25,
    };
  }, []);

  const [liveStats, setLiveStats] = useState(COMMUNITY_LIVE_STATS);

  useEffect(() => {
    // Simulate live updates
    const interval = setInterval(() => {
      setLiveStats((prev) => ({
        ...prev,
        peopleOnline: prev.peopleOnline + Math.floor(Math.random() * 3) - 1,
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app" style={{ display: "grid", gridTemplateColumns: "280px 1fr", minHeight: "100vh" }}>
        <Sidebar activeTab="journey" onTabChange={() => {}} onLearnFinnishClick={handleLearnFinnishClick} />

        <main
          style={{
            padding: "40px 36px",
            background: "linear-gradient(to bottom, #fafbfc 0%, #f8fafc 100%)",
            minHeight: "100vh",
            overflowY: "auto",
          }}
        >
          <div style={{ display: "grid", gap: 32, maxWidth: "1400px", margin: "0 auto" }}>
            {/* Hero: Welcome & Value Proposition */}
            <section
              style={{
                position: "relative",
                borderRadius: 24,
                padding: "80px 48px",
                minHeight: "600px",
                background: "linear-gradient(120deg, #dff6ff 0%, #ffffff 50%, #fff0d9 100%)",
                border: "1px solid rgba(226, 232, 240, 0.5)",
                boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05), 0 20px 40px rgba(15, 23, 42, 0.06)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Wave pattern overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0.3,
                  backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 50 Q25 30, 50 50 T100 50 L100 100 L0 100 Z\" fill=\"%23a2d9ff\" opacity=\"0.3\"/%3E%3C/svg%3E')",
                  backgroundSize: "200px 200px",
                  backgroundRepeat: "repeat",
                }}
              />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{ position: "relative", zIndex: 1, maxWidth: "800px" }}
              >
                {/* Main Headline */}
                <h1
                  style={{
                    margin: "0 0 24px 0",
                    fontSize: "clamp(2.5rem, 6vw, 4rem)",
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                    color: "#1e293b",
                  }}
                >
                  Welcome to your{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #3b82f6 0%, #14b8a6 50%, #f59e0b 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Finnish story
                  </span>
                  !
                  </h1>

                {/* Value Proposition */}
                <p
                  style={{
                    margin: "0 auto 24px auto",
                    fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
                    lineHeight: 1.7,
                    color: "#475569",
                    fontWeight: 400,
                    maxWidth: "700px",
                  }}
                >
                  Knuut is where language becomes connection, effort becomes confidence, and small steps become a new life.
                </p>
                <p
                  style={{
                    margin: "0 auto 32px auto",
                    fontSize: "clamp(1rem, 1.8vw, 1.2rem)",
                    lineHeight: 1.7,
                    color: "#64748b",
                    fontWeight: 400,
                    maxWidth: "700px",
                  }}
                >
                  Let's continue your journey — one beautiful action at a time.
                </p>

                {/* CTA Buttons */}
                <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                  {nextAction ? (
                    <>
                    <button
                      type="button"
                      onClick={() => {
                        if (nextAction.link) {
                          window.location.href = nextAction.link;
                        }
                      }}
                      style={{
                          padding: "14px 32px",
                          borderRadius: 999,
                        border: "none",
                          background: "#2563eb",
                          color: "#ffffff",
                          fontWeight: 600,
                        fontSize: 15,
                        cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#1d4ed8";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 6px 16px rgba(37, 99, 235, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#2563eb";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)";
                        }}
                      >
                        Start My Journey
                    </button>
                      <button
                        type="button"
                        onClick={() => {
                          window.location.href = "/community";
                        }}
              style={{
                          padding: "14px 32px",
                          borderRadius: 999,
                          border: "1px solid #2563eb",
                          background: "transparent",
                          color: "#2563eb",
                          fontWeight: 600,
                          fontSize: 15,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#eff6ff";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        Explore Community
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          window.location.href = "/learn-finnish";
                        }}
                  style={{
                          padding: "14px 32px",
                          borderRadius: 999,
                          border: "none",
                          background: "#2563eb",
                          color: "#ffffff",
                          fontWeight: 600,
                          fontSize: 15,
                          cursor: "pointer",
                          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#1d4ed8";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = "0 6px 16px rgba(37, 99, 235, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#2563eb";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.3)";
                        }}
                      >
                        Start My Journey
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          window.location.href = "/community";
                        }}
              style={{
                          padding: "14px 32px",
                          borderRadius: 999,
                          border: "1px solid #2563eb",
                          background: "transparent",
                          color: "#2563eb",
                          fontWeight: 600,
                          fontSize: 15,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#eff6ff";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        Explore Community
                      </button>
                    </>
                  )}
              </div>
              </motion.div>

              {/* Floating illustration */}
                  <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 0.8, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                    style={{
                  position: "absolute",
                  bottom: 20,
                  right: 40,
                  width: 200,
                  height: 200,
                      display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 120,
                  animation: "float 6s ease-in-out infinite",
                }}
              >
                📚
                  </motion.div>
            </section>

            {/* Integration Hub Map - Find Local Help */}
            <IntegrationHubMap />

            {/* Community at a Glance - Compact */}
              <section
                style={{
                padding: "24px 32px",
                background: "rgba(162, 217, 255, 0.15)",
                borderRadius: 16,
                border: "1px solid rgba(162, 217, 255, 0.3)",
              }}
            >
              <div
                      style={{
                        display: "flex",
                  justifyContent: "center",
                        alignItems: "center",
                  gap: 48,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#1e40af", margin: "0 0 4px 0" }}>
                    {liveStats.peopleOnline}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0 }}>Online Now</p>
                        </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#059669", margin: "0 0 4px 0" }}>
                    {liveStats.eventsToday}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0 }}>Events Today</p>
                      </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#d97706", margin: "0 0 4px 0" }}>
                    {liveStats.newMembersThisWeek}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0 }}>New This Week</p>
                    </div>
                </div>
              </section>

            {/* Suggestions Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
              {/* Learn Finnish - Prominent */}
              <section
                style={{
                  borderRadius: 20,
                  padding: 28,
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05), 0 8px 24px rgba(15, 23, 42, 0.04)",
                  display: "grid",
                  gap: 20,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(99, 102, 241, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(15, 23, 42, 0.05), 0 8px 24px rgba(15, 23, 42, 0.04)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.01em" }}>Learn Finnish</h3>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 8, lineHeight: 1.4 }}>
                    Start your Finnish journey
                  </div>
                  <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
                    Complete curriculum from A1 to C2. Practice with AI, track progress, and speak like a local.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/learn-finnish";
                  }}
                  style={{
                    padding: "14px 24px",
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(99, 102, 241, 0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.25)";
                  }}
                >
                  Start Learning →
                </button>
              </section>

              {/* Suggested Work */}
              <section
                style={{
                  borderRadius: 20,
                  padding: 28,
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05), 0 8px 24px rgba(15, 23, 42, 0.04)",
                  display: "grid",
                  gap: 20,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(15, 23, 42, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(15, 23, 42, 0.05), 0 8px 24px rgba(15, 23, 42, 0.04)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.01em" }}>Work Suggestion</h3>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 6, lineHeight: 1.4 }}>
                    {suggestedWork.title}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8, fontWeight: 500 }}>{suggestedWork.company}</div>
                  <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{suggestedWork.reason}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/work-opportunities";
                  }}
                  style={{
                    padding: "14px 24px",
                    borderRadius: 12,
                    border: "1px solid #3b82f6",
                    background: "rgba(59, 130, 246, 0.05)",
                    color: "#3b82f6",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)";
                    e.currentTarget.style.borderColor = "#2563eb";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.05)";
                    e.currentTarget.style.borderColor = "#3b82f6";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Explore Work →
                </button>
              </section>

              {/* Suggested Community */}
              <section
                style={{
                  borderRadius: 20,
                  padding: 28,
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05), 0 8px 24px rgba(15, 23, 42, 0.04)",
                  display: "grid",
                  gap: 20,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(15, 23, 42, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(15, 23, 42, 0.05), 0 8px 24px rgba(15, 23, 42, 0.04)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#0f172a", letterSpacing: "-0.01em" }}>Community Suggestion</h3>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 6, lineHeight: 1.4 }}>
                    {suggestedCommunity.title}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8, fontWeight: 500 }}>{suggestedCommunity.date}</div>
                  <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{suggestedCommunity.reason}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/community";
                  }}
                  style={{
                    padding: "14px 24px",
                    borderRadius: 12,
                    border: "1px solid #8b5cf6",
                    background: "rgba(139, 92, 246, 0.05)",
                    color: "#8b5cf6",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
                    e.currentTarget.style.borderColor = "#7c3aed";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(139, 92, 246, 0.05)";
                    e.currentTarget.style.borderColor = "#8b5cf6";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Explore Community →
                </button>
              </section>
            </div>

            {/* Your Progress - Dynamic & Valuable */}
            <section
              style={{
                padding: "64px 32px",
                background: "linear-gradient(to bottom, #f0f9ff 0%, #ffffff 100%)",
                borderRadius: 24,
              }}
            >
              <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {/* Header with Stats */}
                <div style={{ textAlign: "center", marginBottom: 48 }}>
                  <h2
                    style={{
                      fontSize: "clamp(2rem, 4vw, 2.5rem)",
                      fontWeight: 700,
                      marginBottom: 16,
                      color: "#1e293b",
                    }}
                  >
                    Your Progress
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 48,
                      flexWrap: "wrap",
                      marginBottom: 32,
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "2rem", fontWeight: 700, color: "#2563eb", marginBottom: 4 }}>
                        {progressMetrics.progressPercentage}%
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
                        Journey Complete
                      </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "2rem", fontWeight: 700, color: "#059669", marginBottom: 4 }}>
                        {progressMetrics.xp}
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#64748b" }}>Total XP</div>
                      {progressMetrics.xpToNextLevel !== null && (
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 4 }}>
                          {progressMetrics.xpToNextLevel} XP to {progressMetrics.nextLevel}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "2rem", fontWeight: 700, color: "#d97706", marginBottom: 4 }}>
                        {progressMetrics.currentLevel}
                      </div>
                      <div style={{ fontSize: "0.875rem", color: "#64748b" }}>Current Level</div>
                    </div>
                  </div>

                  {/* Journey Progress Bar */}
                  <div style={{ maxWidth: "600px", margin: "24px auto 0 auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: 500 }}>
                        Journey Progress
                      </span>
                      <span style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: 500 }}>
                        {progressMetrics.progressPercentage}%
                      </span>
                    </div>
                    <div
                      style={{
                        background: "#e2e8f0",
                        borderRadius: 12,
                        height: 12,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: `${progressMetrics.progressPercentage}%`,
                          height: "100%",
                          background: "linear-gradient(90deg, #2563eb 0%, #14b8a6 100%)",
                          borderRadius: 12,
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "#64748b", marginTop: 12 }}>
                      {progressMetrics.completedNodes} of {progressMetrics.totalNodes} milestones completed
                    </p>
                  </div>

                  {/* XP Progress to Next Level */}
                  {progressMetrics.xpToNextLevel !== null && (
                    <div style={{ maxWidth: "600px", margin: "24px auto 0 auto" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: 500 }}>
                          Progress to {progressMetrics.nextLevel}
                        </span>
                        <span style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: 500 }}>
                          {progressMetrics.xpProgress}%
                        </span>
                      </div>
                      <div
                        style={{
                          background: "#e2e8f0",
                          borderRadius: 12,
                          height: 8,
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            width: `${progressMetrics.xpProgress}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #059669 0%, #10b981 100%)",
                            borderRadius: 12,
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Two Column Layout: Recent Wins & Next Steps */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                    gap: 32,
                  }}
                >
                  {/* Recent Achievements */}
                  <div>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: "#1e293b",
                        marginBottom: 24,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      Recent Achievements
                    </h3>
                    {progressMetrics.recentMilestones.length > 0 ? (
                      <div style={{ display: "grid", gap: 16 }}>
                        {progressMetrics.recentMilestones.map((milestone, idx) => (
                          <motion.div
                            key={milestone.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            style={{
                              background: "#ffffff",
                              border: "1px solid #e2e8f0",
                              borderRadius: 16,
                              padding: "20px",
                              display: "flex",
                              gap: 16,
                              alignItems: "flex-start",
                              boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
                            }}
                          >
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1e293b", marginBottom: 4 }}>
                                {milestone.title}
                              </div>
                              {milestone.description && (
                                <div style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: 8 }}>
                                  {milestone.description}
                                </div>
                              )}
                              {milestone.completedAt && (
                                <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                                  {new Date(milestone.completedAt).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                  })}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          background: "#f8fafc",
                          border: "1px dashed #cbd5e1",
                          borderRadius: 16,
                          padding: "32px",
                          textAlign: "center",
                          color: "#64748b",
                        }}
                      >
                        <p style={{ margin: 0 }}>Complete your first milestone to see it here!</p>
                      </div>
                    )}
                  </div>

                  {/* Next Steps */}
                  <div>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: "#1e293b",
                        marginBottom: 24,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </div>
                      Next Steps
                    </h3>
                    {progressMetrics.upcomingMilestones.length > 0 ? (
                      <div style={{ display: "grid", gap: 16 }}>
                        {progressMetrics.upcomingMilestones.map((milestone, idx) => (
                          <motion.div
                            key={milestone.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            style={{
                              background: "#ffffff",
                              border: milestone.status === "in-progress" ? "2px solid #2563eb" : "1px solid #e2e8f0",
                              borderRadius: 16,
                              padding: "20px",
                              display: "flex",
                              gap: 16,
                              alignItems: "flex-start",
                              boxShadow: milestone.status === "in-progress" ? "0 4px 12px rgba(37, 99, 235, 0.15)" : "0 2px 8px rgba(15, 23, 42, 0.04)",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-2px)";
                              e.currentTarget.style.boxShadow = "0 6px 16px rgba(15, 23, 42, 0.08)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow =
                                milestone.status === "in-progress"
                                  ? "0 4px 12px rgba(37, 99, 235, 0.15)"
                                  : "0 2px 8px rgba(15, 23, 42, 0.04)";
                            }}
                            onClick={() => {
                              if (milestone.link) {
                                window.location.href = milestone.link;
                              }
                            }}
                          >
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                background:
                                  milestone.status === "in-progress"
                                    ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
                                    : "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                color: milestone.status === "in-progress" ? "#ffffff" : "#64748b",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                              }}
                            >
                              {milestone.status === "in-progress" ? "→" : idx + 1}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  fontSize: "0.875rem",
                                  fontWeight: 600,
                                  color: milestone.status === "in-progress" ? "#2563eb" : "#64748b",
                                  marginBottom: 4,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.05em",
                                }}
                              >
                                {milestone.status === "in-progress" ? "In Progress" : "Up Next"}
                              </div>
                              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1e293b", marginBottom: 4 }}>
                                {milestone.title}
                              </div>
                              {milestone.description && (
                                <div style={{ fontSize: "0.875rem", color: "#64748b" }}>{milestone.description}</div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          background: "#f8fafc",
                          border: "1px dashed #cbd5e1",
                          borderRadius: 16,
                          padding: "32px",
                          textAlign: "center",
                          color: "#64748b",
                        }}
                      >
                        <p style={{ margin: 0 }}>Great job! You're all caught up.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* XP & Leveling System Explanation */}
                <div
                  style={{
                    marginTop: 48,
                    padding: "32px",
                    background: "linear-gradient(135deg, rgba(37, 99, 235, 0.03) 0%, rgba(20, 184, 166, 0.03) 100%)",
                    borderRadius: 20,
                    border: "1px solid rgba(37, 99, 235, 0.1)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          background: "linear-gradient(135deg, #2563eb 0%, #14b8a6 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </div>
                    <div>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1e293b", margin: 0 }}>
                        How XP & Leveling Works
                      </h3>
                      <p style={{ fontSize: "0.875rem", color: "#64748b", margin: "4px 0 0 0" }}>
                        Earn XP by taking actions, unlock new levels, and get exclusive benefits
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                    {/* How to Earn XP */}
                    <div
                      style={{
                        background: "#ffffff",
                        borderRadius: 16,
                        padding: "20px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 12,
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </div>
                      <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
                        Earn XP By:
                      </h4>
                      <ul style={{ margin: 0, paddingLeft: 20, fontSize: "0.875rem", color: "#475569", lineHeight: 1.8 }}>
                        <li>Completing lessons</li>
                        <li>Attending events</li>
                        <li>Helping others</li>
                        <li>Volunteering</li>
                        <li>Joining groups</li>
                      </ul>
                    </div>

                    {/* Current Level Benefits */}
                    <div
                      style={{
                        background: "#ffffff",
                        borderRadius: 16,
                        padding: "20px",
                        border: `2px solid ${levelBenefits[progressMetrics.currentLevel as keyof typeof levelBenefits].color}`,
                        boxShadow: `0 4px 12px ${levelBenefits[progressMetrics.currentLevel as keyof typeof levelBenefits].color}20`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: levelBenefits[progressMetrics.currentLevel as keyof typeof levelBenefits].color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "0.875rem",
                          }}
                        >
                          {progressMetrics.currentLevel === "Explorer" ? "E" : progressMetrics.currentLevel === "Connector" ? "C" : "M"}
                        </div>
                        <div>
                          <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "#1e293b", margin: 0 }}>
                            {progressMetrics.currentLevel} Level
                          </h4>
                          <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>
                            {levelBenefits[progressMetrics.currentLevel as keyof typeof levelBenefits].xpRange}
                          </p>
                        </div>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 20, fontSize: "0.875rem", color: "#475569", lineHeight: 1.8 }}>
                        {levelBenefits[progressMetrics.currentLevel as keyof typeof levelBenefits].benefits.map(
                          (benefit, idx) => (
                            <li key={idx}>{benefit}</li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Next Level Preview */}
                    {progressMetrics.nextLevel && (
                      <div
                        style={{
                          background: "#ffffff",
                          borderRadius: 16,
                          padding: "20px",
                          border: "1px solid #e2e8f0",
                          position: "relative",
                          opacity: 0.8,
                        }}
                      >
                        <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                          Next Level
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              background: levelBenefits[progressMetrics.nextLevel as keyof typeof levelBenefits].color,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#ffffff",
                              fontWeight: 700,
                              fontSize: "0.875rem",
                            }}
                          >
                            {progressMetrics.nextLevel === "Explorer" ? "E" : progressMetrics.nextLevel === "Connector" ? "C" : "M"}
                          </div>
                          <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "#1e293b", margin: 0 }}>
                            {progressMetrics.nextLevel}
                          </h4>
                        </div>
                        <p style={{ fontSize: "0.875rem", color: "#64748b", margin: "0 0 12px 0" }}>
                          Unlock at {state.nextLevelXp} XP
                        </p>
                        <div style={{ fontSize: "0.875rem", color: "#475569" }}>
                          <strong style={{ color: "#1e293b" }}>You'll get:</strong>
                          <ul style={{ margin: "8px 0 0 0", paddingLeft: 20, lineHeight: 1.6 }}>
                            {levelBenefits[progressMetrics.nextLevel as keyof typeof levelBenefits].benefits
                              .slice(0, 2)
                              .map((benefit, idx) => (
                                <li key={idx}>{benefit}</li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Impact Stats */}
                {(progressMetrics.peopleHelped > 0 || progressMetrics.contributions > 0) && (
                  <div
                    style={{
                      marginTop: 32,
                      padding: "24px",
                      background: "linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(20, 184, 166, 0.05) 100%)",
                      borderRadius: 16,
                      display: "flex",
                      justifyContent: "center",
                      gap: 48,
                      flexWrap: "wrap",
                    }}
                  >
                    {progressMetrics.peopleHelped > 0 && (
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2563eb", marginBottom: 4 }}>
                          {progressMetrics.peopleHelped}
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "#64748b" }}>People Helped This Week</div>
                      </div>
                    )}
                    {progressMetrics.contributions > 0 && (
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#059669", marginBottom: 4 }}>
                          {progressMetrics.contributions}
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "#64748b" }}>Contributions This Month</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* Success Stories */}
            <section
              style={{
                padding: "48px 32px",
                background: "linear-gradient(to right, #eff6ff 0%, #ffffff 50%, #fffbeb 100%)",
                borderRadius: 24,
                textAlign: "center",
              }}
            >
              <h2
                style={{
                  fontSize: "clamp(1.75rem, 3vw, 2rem)",
                  fontWeight: 700,
                  marginBottom: 32,
                  color: "#1e293b",
                }}
              >
                Success Stories
                </h2>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 32,
                  maxWidth: "1200px",
                  margin: "0 auto",
                }}
              >
                {SUCCESS_STORIES.map((story, idx) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    style={{
                      width: 280,
                      background: "#ffffff",
                      borderRadius: 24,
                      padding: "24px",
                      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.08)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(15, 23, 42, 0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(15, 23, 42, 0.08)";
                    }}
                  >
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px auto",
                        fontSize: 40,
                        border: "2px solid #e2e8f0",
                      }}
                    >
                      {story.avatar}
                      </div>
                    <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>
                      {story.name}, {story.role.split(" ")[2]}
                    </p>
                    <p style={{ fontSize: "0.875rem", color: "#64748b", fontStyle: "italic", marginBottom: 16, lineHeight: 1.6 }}>
                      "{story.quote}"
                    </p>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: idx === 0 ? "#2563eb" : idx === 1 ? "#059669" : "#d97706",
                        margin: 0,
                      }}
                    >
                      {story.achievement}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

          </div>
        </main>
      </div>
    </RoomContext.Provider>
  );
}

