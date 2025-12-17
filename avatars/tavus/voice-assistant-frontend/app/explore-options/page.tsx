"use client";

import { useState, useEffect } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { useUserProfile } from "@/context/UserProfileContext";
import { motion } from "framer-motion";

type ExplorationCard = {
  id: string;
  icon: string;
  title: string;
  description: string;
  link: string;
  color: string;
};

const EXPLORATION_OPTIONS: ExplorationCard[] = [
  {
    id: "skills-reflection",
    icon: "🎯",
    title: "Reflect on Your Skills",
    description: "What can you do? What do you want to learn?",
    link: "/journey",
    color: "#667eea",
  },
  {
    id: "new-paths",
    icon: "🛤️",
    title: "Explore New Paths",
    description: "Reskilling, training, or different career directions",
    link: "/work-opportunities?filter=training",
    color: "#764ba2",
  },
  {
    id: "mentors",
    icon: "🤝",
    title: "Talk to Mentors",
    description: "Connect with people who've been where you are",
    link: "/events?category=Mentoring",
    color: "#2563eb",
  },
  {
    id: "business-explore",
    icon: "💡",
    title: "Explore Business Ideas",
    description: "Learn about options, not registration",
    link: "/start-business?mode=explore",
    color: "#f59e0b",
  },
];

export default function ExploreOptionsPage() {
  const { recordAction, state } = useUserProfile();
  const [room] = useState(new Room());

  useEffect(() => {
    // Track page visit
    recordAction({
      id: `explore-options-visit-${Date.now()}`,
      label: "Visited Explore Options page",
      category: "navigation",
      xp: 3,
      impactPoints: 2,
      metadata: {
        source: "getting-unstuck-page",
      },
    });
  }, [recordAction]);

  const handleOptionClick = (option: ExplorationCard) => {
    recordAction({
      id: `explore-option-${option.id}-${Date.now()}`,
      label: `Explored: ${option.title}`,
      category: "navigation",
      xp: 5,
      impactPoints: 3,
    });
    window.location.href = option.link;
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar activeTab="start-here" onTabChange={() => {}} />

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
            {/* Hero Section */}
            <section
              style={{
                position: "relative",
                borderRadius: 32,
                padding: "48px 40px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "#ffffff",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(102,126,234,0.3)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.15,
                }}
              />
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{ position: "relative", zIndex: 1, display: "grid", gap: 20 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 48 }}>🔍</span>
                  <h1 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.1 }}>
                    Explore Your Options
                  </h1>
                </div>
                <p style={{ margin: 0, fontSize: "1.2rem", lineHeight: 1.7, maxWidth: "800px", opacity: 0.95 }}>
                  Not sure what's next? Explore different paths without pressure.
                </p>
              </motion.div>
            </section>

            {/* Exploration Options */}
            <section style={{ display: "grid", gap: 24 }}>
              <div style={{ textAlign: "center", marginBottom: 8 }}>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#0f172a" }}>
                  Where to Start?
                </h2>
                <p style={{ margin: "12px 0 0 0", fontSize: 16, color: "#64748b" }}>
                  Choose what feels right for you
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                {EXPLORATION_OPTIONS.map((option, index) => (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => handleOptionClick(option)}
                    style={{
                      padding: "40px 32px",
                      borderRadius: 24,
                      border: "2px solid #e2e8f0",
                      background: "#ffffff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = option.color;
                      e.currentTarget.style.boxShadow = `0 12px 32px ${option.color}40`;
                      e.currentTarget.style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div style={{ fontSize: 56, marginBottom: 20 }}>{option.icon}</div>
                    <h3 style={{ margin: "0 0 12px 0", fontSize: 24, fontWeight: 700, color: "#0f172a" }}>
                      {option.title}
                    </h3>
                    <p style={{ margin: "0 0 20px 0", fontSize: 15, color: "#64748b", lineHeight: 1.6 }}>
                      {option.description}
                    </p>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 20px",
                        borderRadius: 12,
                        background: `${option.color}15`,
                        color: option.color,
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      Explore →
                    </div>
                  </motion.button>
                ))}
              </div>
            </section>

            {/* Support Message */}
            <section
              style={{
                borderRadius: 24,
                padding: "32px",
                background: "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)",
                border: "2px solid #c7d2fe",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>💭</div>
              <h3 style={{ margin: "0 0 12px 0", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                Take Your Time
              </h3>
              <p style={{ margin: 0, fontSize: 15, color: "#475569", lineHeight: 1.6, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
                Exploring options doesn't mean committing. See what feels right.
              </p>
            </section>

            {/* Back to Getting Unstuck */}
            <section style={{ textAlign: "center" }}>
              <button
                onClick={() => window.location.href = "/getting-unstuck"}
                style={{
                  padding: "12px 24px",
                  borderRadius: 12,
                  border: "2px solid #e2e8f0",
                  background: "#ffffff",
                  color: "#64748b",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                ← Back to Getting Unstuck
              </button>
            </section>
          </div>
        </main>
      </div>
    </RoomContext.Provider>
  );
}

