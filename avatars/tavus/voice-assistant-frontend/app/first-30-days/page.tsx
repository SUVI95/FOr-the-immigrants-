"use client";

import { useState, useEffect } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { useUserProfile } from "@/context/UserProfileContext";
import { motion } from "framer-motion";

type ChecklistItem = {
  id: string;
  title: string;
  description: string;
  urgency: "critical" | "important" | "helpful";
  timeframe: string;
  completed: boolean;
  resources?: Array<{ label: string; href: string }>;
};

const FIRST_WEEK_CHECKLIST: ChecklistItem[] = [
  {
    id: "week1-1",
    title: "Register your address with DVV",
    description: "Essential for getting your personal identity code and accessing services",
    urgency: "critical",
    timeframe: "Within 7 days",
    completed: false,
    resources: [
      { label: "DVV Registration Guide", href: "https://dvv.fi/en/registration-of-foreign-residents" },
      { label: "Book appointment", href: "https://dvv.fi/en/book-an-appointment" },
    ],
  },
  {
    id: "week1-2",
    title: "Open a bank account",
    description: "Needed for receiving salary, benefits, and daily transactions",
    urgency: "critical",
    timeframe: "Within 7 days",
    completed: false,
    resources: [
      { label: "OP Bank Guide", href: "https://www.op.fi/en/private-customers/banking/accounts" },
      { label: "Nordea Guide", href: "https://www.nordea.fi/en/personal/our-services/account-and-cards" },
    ],
  },
  {
    id: "week1-3",
    title: "Apply for Kela card (social security)",
    description: "Gives you access to healthcare and social benefits",
    urgency: "critical",
    timeframe: "Within 7 days",
    completed: false,
    resources: [
      { label: "Kela Application", href: "https://www.kela.fi/web/en/moving-to-finland" },
      { label: "Required documents", href: "https://www.kela.fi/web/en/moving-to-finland#documents" },
    ],
  },
  {
    id: "week1-4",
    title: "Get a tax card from Vero",
    description: "Required before you can start working legally",
    urgency: "critical",
    timeframe: "Before first job",
    completed: false,
    resources: [
      { label: "Apply for tax card", href: "https://www.vero.fi/en/individuals/tax-cards-and-tax-returns/tax-card/" },
    ],
  },
  {
    id: "week1-5",
    title: "Find emergency contacts",
    description: "Know who to call if something goes wrong",
    urgency: "critical",
    timeframe: "Day 1",
    completed: false,
    resources: [
      { label: "Emergency: 112", href: "tel:112" },
      { label: "Kajaani Info Point", href: "https://www.kajaani.fi/en/" },
    ],
  },
  {
    id: "week1-6",
    title: "Join a community meetup",
    description: "Meet other newcomers and get support from people who understand",
    urgency: "important",
    timeframe: "Within 7 days",
    completed: false,
    resources: [
      { label: "View events", href: "/events" },
      { label: "Find groups", href: "/groups" },
    ],
  },
];

const FIRST_MONTH_CHECKLIST: ChecklistItem[] = [
  {
    id: "month1-1",
    title: "Get a Finnish ID card",
    description: "Makes daily life easier (opening accounts, proving identity)",
    urgency: "important",
    timeframe: "Within 30 days",
    completed: false,
    resources: [
      { label: "Police ID Card", href: "https://poliisi.fi/en/identity-card" },
    ],
  },
  {
    id: "month1-2",
    title: "Register with TE Services",
    description: "Get help finding work and access job training programs",
    urgency: "important",
    timeframe: "Within 30 days",
    completed: false,
    resources: [
      { label: "TE Services Registration", href: "https://www.te-palvelut.fi/te/en/" },
      { label: "Kajaani TE Office", href: "https://www.te-palvelut.fi/te/en/contact_information/offices/" },
    ],
  },
  {
    id: "month1-3",
    title: "Find a language practice partner",
    description: "Practice Finnish through conversation, not just classes",
    urgency: "important",
    timeframe: "Within 30 days",
    completed: false,
    resources: [
      { label: "Find a mentor", href: "/groups" },
      { label: "Language café events", href: "/events" },
    ],
  },
  {
    id: "month1-4",
    title: "Explore job opportunities",
    description: "Start looking for work, even if your Finnish isn't perfect yet",
    urgency: "important",
    timeframe: "Within 30 days",
    completed: false,
    resources: [
      { label: "Jobs for newcomers", href: "/work-opportunities?filter=work-now" },
      { label: "Job shadowing", href: "/work-opportunities?filter=shadowing" },
    ],
  },
  {
    id: "month1-5",
    title: "Learn essential Finnish phrases",
    description: "Start with practical phrases you'll use every day",
    urgency: "helpful",
    timeframe: "Ongoing",
    completed: false,
    resources: [
      { label: "Practice with Knuut AI", href: "/knuut-voice" },
      { label: "Learn Finnish", href: "/learn-finnish" },
    ],
  },
  {
    id: "month1-6",
    title: "Connect with a peer mentor",
    description: "Find someone who's been where you are and succeeded",
    urgency: "important",
    timeframe: "Within 30 days",
    completed: false,
    resources: [
      { label: "Find a mentor", href: "/groups?filter=mentors" },
    ],
  },
];

export default function First30DaysPage() {
  const { recordAction } = useUserProfile();
  const [room] = useState(new Room());
  const [activeTab, setActiveTab] = useState("week1");
  const [checklist, setChecklist] = useState<ChecklistItem[]>(FIRST_WEEK_CHECKLIST);
  
  useEffect(() => {
    setChecklist(activeTab === "week1" ? FIRST_WEEK_CHECKLIST : FIRST_MONTH_CHECKLIST);
  }, [activeTab]);

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

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
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLearnFinnishClick={handleLearnFinnishClick} />

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
                  <span style={{ fontSize: 48 }}>🆘</span>
                  <h1 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.1 }}>
                    Your First 30 Days in Kajaani
                  </h1>
                </div>
                <p style={{ margin: 0, fontSize: "1.2rem", lineHeight: 1.7, maxWidth: "800px", opacity: 0.95 }}>
                  <strong>Welcome to Kajaani!</strong> We know this can feel overwhelming. This guide will help you 
                  take the most important steps first. You're not alone — many people have been where you are and succeeded. 
                  Let's take it one step at a time.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => window.location.href = "/knuut-voice?prompt=I need help right now"}
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
                    🆘 I Need Help Now
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
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#dc2626" }}>
                    {Math.round(progressPercent)}%
                  </span>
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
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          border: item.completed ? "none" : `2px solid ${getUrgencyColor(item.urgency)}`,
                          background: item.completed
                            ? "linear-gradient(135deg, #22c55e, #16a34a)"
                            : "transparent",
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

            {/* Hope & Support Section */}
            <section
              style={{
                borderRadius: 24,
                padding: "32px",
                background: "linear-gradient(135deg, #e0f2fe 0%, #eef2ff 100%)",
                border: "2px solid #bfdbfe",
                boxShadow: "0 12px 24px rgba(59,130,246,0.15)",
              }}
            >
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>
                💙 Remember: You're Not Alone
              </h2>
              <p style={{ margin: 0, fontSize: 16, color: "#475569", lineHeight: 1.7, marginBottom: 20 }}>
                Many people have been where you are right now. They felt lost, scared, and unsure. But they made it. 
                You can too. Every small step counts. Every connection matters. You're building a new life, and that takes 
                courage. We're here to help you every step of the way.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => window.location.href = "/groups?filter=mentors"}
                  style={{
                    padding: "12px 20px",
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Find a Mentor Who's Been Where You Are
                </button>
                <button
                  type="button"
                  onClick={() => window.location.href = "/events"}
                  style={{
                    padding: "12px 20px",
                    borderRadius: 12,
                    border: "2px solid #3b82f6",
                    background: "#ffffff",
                    color: "#2563eb",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Join a Community Event
                </button>
                <button
                  type="button"
                  onClick={() => window.location.href = "/knuut-voice?prompt=I need someone to talk to"}
                  style={{
                    padding: "12px 20px",
                    borderRadius: 12,
                    border: "2px solid #3b82f6",
                    background: "#ffffff",
                    color: "#2563eb",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Talk to Knuut AI
                </button>
              </div>
            </section>

            {/* Emergency Help */}
            <section
              style={{
                borderRadius: 24,
                padding: "32px",
                background: "#ffffff",
                border: "2px solid #ef4444",
                boxShadow: "0 12px 24px rgba(239,68,68,0.15)",
              }}
            >
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>
                🆘 Emergency Help
              </h2>
              <p style={{ margin: 0, fontSize: 16, color: "#475569", lineHeight: 1.7, marginBottom: 20 }}>
                If you're in immediate danger or need urgent help, don't wait. Contact these services right away.
              </p>
              <div style={{ display: "grid", gap: 12 }}>
                <a
                  href="tel:112"
                  style={{
                    padding: "16px 20px",
                    borderRadius: 12,
                    border: "2px solid #ef4444",
                    background: "rgba(239,68,68,0.1)",
                    color: "#dc2626",
                    fontWeight: 700,
                    fontSize: 16,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 24 }}>🚨</span>
                  <span>Emergency Services: 112</span>
                </a>
                <a
                  href="tel:+358205022211"
                  style={{
                    padding: "16px 20px",
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    color: "#1e293b",
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 20 }}>📞</span>
                  <span>Kajaani Info Point: +358 20 502 2211</span>
                </a>
                <a
                  href="/knuut-voice?prompt=I need help right now"
                  style={{
                    padding: "16px 20px",
                    borderRadius: 12,
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#1d4ed8",
                    fontWeight: 600,
                    fontSize: 14,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: 20 }}>🤖</span>
                  <span>Talk to Knuut AI for immediate support</span>
                </a>
              </div>
            </section>
          </div>
        </main>
      </div>
    </RoomContext.Provider>
  );
}

