"use client";

import { useState, useEffect } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { useUserProfile } from "@/context/UserProfileContext";
import { motion } from "framer-motion";
import { FIRST_WEEK_CHECKLIST, FIRST_MONTH_CHECKLIST, type ChecklistItem } from "../first-30-days/page";
import VideoPlaceholder from "@/components/VideoPlaceholder";

export default function NewInFinlandPage() {
  const { recordAction, state } = useUserProfile();
  const [room] = useState(new Room());
  const [activeTab, setActiveTab] = useState("week1");
  const [checklist, setChecklist] = useState<ChecklistItem[]>(FIRST_WEEK_CHECKLIST);
  
  const userCity = state.city || "Kajaani";
  
  useEffect(() => {
    setChecklist(activeTab === "week1" ? FIRST_WEEK_CHECKLIST : FIRST_MONTH_CHECKLIST);
  }, [activeTab]);

  const toggleItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
    recordAction({
      id: `checklist-${id}-${Date.now()}`,
      label: `Completed: ${checklist.find((i) => i.id === id)?.title}`,
      category: "integration",
      xp: 10,
      impactPoints: 8,
    });
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "#ef4444";
      case "important":
        return "#f59e0b";
      case "helpful":
        return "#3b82f6";
      default:
        return "#64748b";
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "Do this first";
      case "important":
        return "Important";
      case "helpful":
        return "Helpful";
      default:
        return "";
    }
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
                background: "linear-gradient(135deg, #dc2626 0%, #ea580c 50%, #f59e0b 100%)",
                color: "#ffffff",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(220,38,38,0.3)",
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
                  <span style={{ fontSize: 48 }}>🆕</span>
                  <h1 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.1 }}>
                    Your First 30 Days in {userCity}
                  </h1>
                </div>
                <p style={{ margin: 0, fontSize: "1.2rem", lineHeight: 1.7, maxWidth: "800px", opacity: 0.95 }}>
                  <strong>Welcome to {userCity}!</strong> We know this can feel overwhelming. This guide will help you 
                  take the most important steps first. You're not alone — many people have been where you are and succeeded. 
                  Let's take it one step at a time.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => window.location.href = "/work-opportunities?focus=cv-mentors-meetups"}
                    style={{
                      padding: "14px 24px",
                      borderRadius: 16,
                      border: "2px solid rgba(255,255,255,0.5)",
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: 15,
                      cursor: "pointer",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    }}
                  >
                    💬 Talk to a Coach
                  </button>
                  <button
                    type="button"
                    onClick={() => window.location.href = "/work-opportunities?filter=work-now"}
                    style={{
                      padding: "14px 24px",
                      borderRadius: 16,
                      border: "none",
                      background: "rgba(255,255,255,0.95)",
                      color: "#dc2626",
                      fontWeight: 700,
                      fontSize: 15,
                      cursor: "pointer",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    }}
                  >
                    💼 Explore Work Opportunities
                  </button>
                </div>
              </motion.div>
            </section>

            {/* Progress Overview */}
            <section
              style={{
                borderRadius: 24,
                padding: "32px",
                background: "#ffffff",
                border: "2px solid #e2e8f0",
                boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>Your Progress</h2>
                <div style={{ display: "flex", gap: 16 }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab("week1")}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 12,
                      border: activeTab === "week1" ? "2px solid #dc2626" : "1px solid #e2e8f0",
                      background: activeTab === "week1" ? "rgba(220,38,38,0.1)" : "#ffffff",
                      color: activeTab === "week1" ? "#dc2626" : "#64748b",
                      fontWeight: activeTab === "week1" ? 700 : 600,
                      cursor: "pointer",
                    }}
                  >
                    First Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("month1")}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 12,
                      border: activeTab === "month1" ? "2px solid #dc2626" : "1px solid #e2e8f0",
                      background: activeTab === "month1" ? "rgba(220,38,38,0.1)" : "#ffffff",
                      color: activeTab === "month1" ? "#dc2626" : "#64748b",
                      fontWeight: activeTab === "month1" ? 700 : 600,
                      cursor: "pointer",
                    }}
                  >
                    First Month
                  </button>
                </div>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, color: "#64748b", fontWeight: 600 }}>
                    {completedCount} of {totalCount} completed
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#dc2626" }}>{Math.round(progressPercent)}%</span>
                </div>
                <div
                  style={{
                    height: 12,
                    borderRadius: 999,
                    background: "#e5e7eb",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                    style={{
                      height: "100%",
                      background: "linear-gradient(90deg, #dc2626, #ea580c)",
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Video Guides Section */}
            <section
              style={{
                borderRadius: 24,
                padding: "32px",
                background: "#ffffff",
                border: "2px solid #e2e8f0",
                boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <span style={{ fontSize: 32 }}>📹</span>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
                  Step-by-Step Video Guides
                </h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                <VideoPlaceholder
                  title="How to Register with DVV"
                  description="Watch this guide to learn how to register your address and get your personal identity code"
                  duration="4:30"
                />
                <VideoPlaceholder
                  title="Opening a Bank Account in Finland"
                  description="Step-by-step process for opening your first Finnish bank account"
                  duration="5:15"
                />
                <VideoPlaceholder
                  title="Applying for Kela Card"
                  description="Learn how to apply for social security and healthcare benefits"
                  duration="6:00"
                />
                <VideoPlaceholder
                  title="Getting Your Tax Card"
                  description="Everything you need to know about getting a tax card from Vero"
                  duration="4:45"
                />
              </div>
            </section>

            {/* Checklist */}
            <section style={{ display: "grid", gap: 16 }}>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 900, color: "#0f172a" }}>
                {activeTab === "week1" ? "First Week Checklist" : "First Month Checklist"}
              </h2>
              <div style={{ display: "grid", gap: 16 }}>
                {checklist.map((item, idx) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    style={{
                      borderRadius: 20,
                      padding: 24,
                      background: item.completed ? "#f0fdf4" : "#ffffff",
                      border: item.completed
                        ? "2px solid #22c55e"
                        : `2px solid ${getUrgencyColor(item.urgency)}40`,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      display: "grid",
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: item.completed ? "none" : `2px solid ${getUrgencyColor(item.urgency)}`,
                          background: item.completed ? "#22c55e" : "transparent",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        {item.completed && (
                          <span style={{ color: "#ffffff", fontSize: 16, fontWeight: 700 }}>✓</span>
                        )}
                      </button>
                      <div style={{ flex: 1, display: "grid", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                          <h3
                            style={{
                              margin: 0,
                              fontSize: 18,
                              fontWeight: 700,
                              color: item.completed ? "#166534" : "#0f172a",
                              textDecoration: item.completed ? "line-through" : "none",
                            }}
                          >
                            {item.title}
                          </h3>
                          <span
                            style={{
                              padding: "4px 10px",
                              borderRadius: 6,
                              background: `${getUrgencyColor(item.urgency)}20`,
                              color: getUrgencyColor(item.urgency),
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: "uppercase",
                            }}
                          >
                            {getUrgencyLabel(item.urgency)}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              color: "#64748b",
                              fontWeight: 600,
                            }}
                          >
                            {item.timeframe}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
                          {item.description}
                        </p>
                        {item.resources && item.resources.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                            {item.resources.map((resource, ridx) => (
                              <a
                                key={ridx}
                                href={resource.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  padding: "6px 12px",
                                  borderRadius: 8,
                                  border: "1px solid #cbd5e1",
                                  background: "#f8fafc",
                                  color: "#1d4ed8",
                                  fontSize: 12,
                                  fontWeight: 600,
                                  textDecoration: "none",
                                  cursor: "pointer",
                                }}
                              >
                                {resource.label} →
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>

            {/* Back to Start Here */}
            <section style={{ textAlign: "center" }}>
              <button
                onClick={() => window.location.href = "/first-30-days"}
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
                ← Back to Start Here
              </button>
            </section>
          </div>
        </main>
      </div>
    </RoomContext.Provider>
  );
}

