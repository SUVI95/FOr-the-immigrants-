"use client";

import { useMemo, useState, useEffect } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { useUserProfile } from "@/context/UserProfileContext";
import { MyPathwayMap } from "@/components/dashboard/MyPathwayMap";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { SkillPassportSummary } from "@/components/dashboard/SkillPassportSummary";
import { IntegrationHubMap } from "@/components/dashboard/IntegrationHubMap";

type ActivityItem = {
  id: string;
  type: "achievement" | "event" | "learning" | "work" | "community";
  title: string;
  description: string;
  timestamp: string;
  icon: string;
  xp?: number;
};

type SuccessStory = {
  id: string;
  name: string;
  role: string;
  quote: string;
  achievement: string;
  avatar?: string;
};

const LIVE_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    type: "achievement",
    title: "🎉 Reached Connector Level!",
    description: "You've helped 12 people this month and earned 450 XP",
    timestamp: "2 hours ago",
    icon: "🌟",
    xp: 50,
  },
  {
    id: "act-2",
    type: "learning",
    title: "📚 Completed A1 Lesson 8",
    description: "Mastered Finnish greetings and basic introductions",
    timestamp: "5 hours ago",
    icon: "📖",
    xp: 25,
  },
  {
    id: "act-3",
    type: "event",
    title: "✅ RSVPed to Finnish Language Café",
    description: "Event on Nov 16 at Kajaani Library - 12 people going",
    timestamp: "Yesterday",
    icon: "📅",
    xp: 15,
  },
  {
    id: "act-4",
    type: "work",
    title: "💼 Applied to Kitchen Internship",
    description: "Kainuu Hospitality - Application sent with Smart CV",
    timestamp: "2 days ago",
    icon: "💼",
    xp: 30,
  },
  {
    id: "act-5",
    type: "community",
    title: "🤝 Joined Professional Network Kajaani",
    description: "28 members - Workshops and CV reviews available",
    timestamp: "3 days ago",
    icon: "👥",
    xp: 18,
  },
];

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

  const recentWins = useMemo(() => {
    return state.pathway.nodes
      .filter((node) => node.status === "done")
      .slice(0, 3)
      .map((node) => ({
        id: node.id,
        title: node.title,
        completedAt: node.completedAt || new Date().toISOString(),
      }));
  }, [state.pathway.nodes]);

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
      <div className="app">
        <Sidebar activeTab="journey" onTabChange={() => {}} onLearnFinnishClick={handleLearnFinnishClick} />

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
            {/* Hero: Next Action */}
            <section
              style={{
                position: "relative",
                borderRadius: 32,
                padding: "48px 40px",
                background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
                color: "#ffffff",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(59,130,246,0.3)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "url('https://images.unsplash.com/photo-1509062522224-3755977927d7?auto=format&fit=crop&w=1600&q=80')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.15,
                  mixBlendMode: "overlay",
                }}
              />
              <div style={{ position: "relative", zIndex: 1, display: "grid", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 48 }}>🎯</span>
                  <h1 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.1 }}>
                    Your Journey
                  </h1>
                </div>
                {nextAction ? (
                  <div style={{ display: "grid", gap: 16 }}>
                    <p style={{ margin: 0, fontSize: "1.2rem", lineHeight: 1.7, maxWidth: "800px", opacity: 0.95 }}>
                      <strong>Next Action:</strong> {nextAction.title}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (nextAction.link) {
                          window.location.href = nextAction.link;
                        }
                      }}
                      style={{
                        alignSelf: "flex-start",
                        padding: "14px 24px",
                        borderRadius: 16,
                        border: "none",
                        background: "rgba(255,255,255,0.95)",
                        color: "#3b82f6",
                        fontWeight: 700,
                        fontSize: 15,
                        cursor: "pointer",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                      }}
                    >
                      Start Now →
                    </button>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: "1.2rem", lineHeight: 1.7, maxWidth: "800px", opacity: 0.95 }}>
                    Keep building your pathway. Every action moves you forward.
                  </p>
                )}
              </div>
            </section>

            {/* Live Community Activity */}
            <section
              style={{
                borderRadius: 20,
                padding: 24,
                background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(16,185,129,0.05))",
                border: "2px solid rgba(34,197,94,0.2)",
                boxShadow: "0 16px 32px rgba(34,197,94,0.1)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h2 style={{ margin: "0 0 8px 0", fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
                    🟢 Community is Active Right Now
                  </h2>
                  <p style={{ margin: 0, fontSize: 14, color: "#475569" }}>
                    See what's happening in Kajaani right now
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#16a34a" }}>{liveStats.peopleOnline}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Online</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#16a34a" }}>{liveStats.eventsToday}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Events Today</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#16a34a" }}>{liveStats.newMembersThisWeek}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>New This Week</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Stats */}
            <ProgressOverview />

            {/* Recent Activity Feed */}
            <section
              style={{
                borderRadius: 20,
                padding: 24,
                background: "#fff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 16px 32px rgba(15,23,42,0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
                  Your Recent Activity
                </h2>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Live updates</span>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {LIVE_ACTIVITIES.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{activity.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                        {activity.title}
                      </div>
                      <div style={{ fontSize: 13, color: "#475569", marginBottom: 6 }}>{activity.description}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "#64748b" }}>{activity.timestamp}</span>
                        {activity.xp && (
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: "#16a34a",
                              padding: "4px 10px",
                              borderRadius: 6,
                              background: "rgba(34,197,94,0.1)",
                            }}
                          >
                            +{activity.xp} XP
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Recently Verified Wins */}
            {recentWins.length > 0 && (
              <section
                style={{
                  borderRadius: 20,
                  padding: 24,
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 16px 32px rgba(15,23,42,0.08)",
                }}
              >
                <h2 style={{ margin: "0 0 20px 0", fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
                  Recently Verified Wins
                </h2>
                <div style={{ display: "grid", gap: 12 }}>
                  {recentWins.map((win) => (
                    <div
                      key={win.id}
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{win.title}</div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                          {new Date(win.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span style={{ fontSize: 20 }}>✅</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Suggestions Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
              {/* Learn Finnish - Prominent */}
              <section
                style={{
                  borderRadius: 20,
                  padding: 24,
                  background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))",
                  border: "2px solid rgba(99,102,241,0.3)",
                  boxShadow: "0 16px 32px rgba(99,102,241,0.15)",
                  display: "grid",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 32 }}>📚</span>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Learn Finnish</h3>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                    Start your Finnish journey
                  </div>
                  <div style={{ fontSize: 13, color: "#475569" }}>
                    Complete curriculum from A1 to C2. Practice with AI, track progress, and speak like a local.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/learn-finnish";
                  }}
                  style={{
                    padding: "12px 20px",
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    boxShadow: "0 8px 16px rgba(99,102,241,0.3)",
                  }}
                >
                  Start Learning →
                </button>
              </section>

              {/* Suggested Work */}
              <section
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
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 32 }}>💼</span>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Work Suggestion</h3>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                    {suggestedWork.title}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{suggestedWork.company}</div>
                  <div style={{ fontSize: 13, color: "#475569" }}>{suggestedWork.reason}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/work-opportunities";
                  }}
                  style={{
                    padding: "12px 20px",
                    borderRadius: 12,
                    border: "1px solid #3b82f6",
                    background: "rgba(59,130,246,0.1)",
                    color: "#3b82f6",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Explore Work →
                </button>
              </section>

              {/* Suggested Community */}
              <section
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
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 32 }}>🤝</span>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Community Suggestion</h3>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                    {suggestedCommunity.title}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{suggestedCommunity.date}</div>
                  <div style={{ fontSize: 13, color: "#475569" }}>{suggestedCommunity.reason}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "/community";
                  }}
                  style={{
                    padding: "12px 20px",
                    borderRadius: 12,
                    border: "1px solid #8b5cf6",
                    background: "rgba(139,92,246,0.1)",
                    color: "#8b5cf6",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Explore Community →
                </button>
              </section>
            </div>

            {/* Integration Hub Map */}
            <IntegrationHubMap />

            {/* Pathway Map */}
            <MyPathwayMap />

            {/* Skill Passport Summary */}
            <SkillPassportSummary />

            {/* Success Stories */}
            <section
              style={{
                borderRadius: 20,
                padding: 32,
                background: "linear-gradient(135deg, rgba(59,130,246,0.05), rgba(139,92,246,0.05))",
                border: "1px solid rgba(99,102,241,0.2)",
                boxShadow: "0 16px 32px rgba(99,102,241,0.1)",
              }}
            >
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ margin: "0 0 8px 0", fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
                  💫 Success Stories from Kajaani
                </h2>
                <p style={{ margin: 0, fontSize: 15, color: "#475569" }}>
                  Real people building their lives in Finland with Knuut
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                {SUCCESS_STORIES.map((story) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      padding: 24,
                      borderRadius: 16,
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                      display: "grid",
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 40 }}>{story.avatar}</span>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{story.name}</div>
                        <div style={{ fontSize: 13, color: "#64748b" }}>{story.role}</div>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: 14, color: "#475569", lineHeight: 1.6, fontStyle: "italic" }}>
                      "{story.quote}"
                    </p>
                    <div
                      style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        background: "rgba(34,197,94,0.1)",
                        border: "1px solid rgba(34,197,94,0.2)",
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", marginBottom: 4 }}>
                        Achievement
                      </div>
                      <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 600 }}>{story.achievement}</div>
                    </div>
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

