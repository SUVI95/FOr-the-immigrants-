"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";

type CultureCard = {
  id: string;
  icon: string;
  title: string;
  description: string;
  bullets: string[];
};

const CULTURE_CARDS: CultureCard[] = [
  {
    id: "work-culture",
    icon: "⏰",
    title: "Work Culture",
    description: "How Finns work and what they expect",
    bullets: [
      "⏰ Be on time (5 minutes early is good)",
      "✅ Be honest (say what you think)",
      "🎯 Work alone (independence is important)",
      "🤫 Silence is OK (not rude, just thinking)",
      "📋 Take responsibility (do your job well)",
    ],
  },
  {
    id: "communication",
    icon: "💬",
    title: "Communication & Behavior",
    description: "How Finns talk and act",
    bullets: [
      "💬 Be direct (say what you mean, no small talk)",
      "🚶 Personal space (keep 1 meter distance)",
      "⚖️ Everyone equal (no hierarchy, call by first name)",
    ],
  },
  {
    id: "everyday-life",
    icon: "📱",
    title: "Everyday Life",
    description: "Daily things you need to know",
    bullets: [
      "📅 Book appointments (don't just show up)",
      "📱 Use digital services (apps, websites)",
      "🚶 Queues matter (wait your turn)",
      "📧 Email is normal (not phone calls)",
    ],
  },
  {
    id: "rights-responsibilities",
    icon: "⚖️",
    title: "Rights & Responsibilities",
    description: "What you can do and must do",
    bullets: [
      "📄 Read contracts (before signing)",
      "💰 Pay taxes (automatic, but check)",
      "📋 Follow rules (safety first)",
      "🆘 Ask for help (it's OK to ask)",
    ],
  },
  {
    id: "common-mistakes",
    icon: "⚠️",
    title: "Common Mistakes",
    description: "Things to avoid",
    bullets: [
      "⏰ Being late (big problem in Finland)",
      "⏳ Not waiting (in queues, appointments)",
      "💬 Poor communication (not clear enough)",
      "📞 Calling without appointment",
      "😊 Too friendly (keep professional distance)",
    ],
  },
];

export default function ResourcesPage() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [room] = useState(new Room());

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar activeTab="resources" onTabChange={() => {}} />

        <main
          style={{
            flex: 1,
            padding: "32px 28px",
            background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
            minHeight: "100vh",
            overflowY: "auto",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gap: 32 }}>
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
              <div style={{ position: "relative", zIndex: 1 }}>
                <h1 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900 }}>
                  Life in Finland
                </h1>
                <p style={{ margin: "16px 0 0 0", fontSize: "1.2rem", opacity: 0.95, maxWidth: 600 }}>
                  Understand Finnish culture and everyday life
                </p>
              </div>
            </section>

            {/* Culture Cards */}
            <section style={{ display: "grid", gap: 24 }}>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#0f172a" }}>
                Culture & Everyday Understanding
              </h2>
              
              <div style={{ display: "grid", gap: 20 }}>
                {CULTURE_CARDS.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    style={{
                      borderRadius: 24,
                      border: "2px solid #e2e8f0",
                      background: "#ffffff",
                      boxShadow: expandedCard === card.id 
                        ? "0 16px 32px rgba(15,23,42,0.12)" 
                        : "0 4px 12px rgba(15,23,42,0.08)",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => toggleCard(card.id)}
                  >
                    <div
                      style={{
                        padding: "24px 28px",
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                      }}
                    >
                      <div
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 16,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 32,
                          flexShrink: 0,
                        }}
                      >
                        {card.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                          {card.title}
                        </h3>
                        <p style={{ margin: "8px 0 0 0", fontSize: 15, color: "#64748b" }}>
                          {card.description}
                        </p>
                      </div>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "#f1f5f9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "transform 0.3s ease",
                          transform: expandedCard === card.id ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        <i className="fa-solid fa-chevron-down" style={{ color: "#64748b", fontSize: 14 }}></i>
                      </div>
                    </div>

                    {expandedCard === card.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          padding: "0 28px 24px 28px",
                          borderTop: "1px solid #e2e8f0",
                          marginTop: 16,
                          paddingTop: 24,
                        }}
                      >
                        <ul style={{ margin: 0, paddingLeft: 0, display: "grid", gap: 12, listStyle: "none" }}>
                          {card.bullets.map((bullet, i) => (
                            <li 
                              key={i} 
                              style={{ 
                                fontSize: 15, 
                                color: "#475569", 
                                lineHeight: 1.6,
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 12,
                              }}
                            >
                              <span style={{ fontSize: 18, flexShrink: 0 }}>{bullet.split(" ")[0]}</span>
                              <span>{bullet.substring(bullet.indexOf(" ") + 1)}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Helpful Links Section */}
            <section
              style={{
                borderRadius: 24,
                padding: "32px 28px",
                background: "linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)",
                border: "2px solid rgba(102,126,234,0.2)",
              }}
            >
              <h2 style={{ margin: "0 0 20px 0", fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
                📚 Need More Help?
              </h2>
              <div style={{ display: "grid", gap: 16 }}>
                <a
                  href="/first-30-days"
                  style={{
                    padding: "16px 20px",
                    borderRadius: 16,
                    background: "#ffffff",
                    border: "2px solid #e2e8f0",
                    textDecoration: "none",
                    color: "#0f172a",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#667eea";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span style={{ fontSize: 24 }}>🚀</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>Start Here</div>
                    <div style={{ fontSize: 14, color: "#64748b" }}>First steps in Finland</div>
                  </div>
                </a>
                <a
                  href="/learn-finnish"
                  style={{
                    padding: "16px 20px",
                    borderRadius: 16,
                    background: "#ffffff",
                    border: "2px solid #e2e8f0",
                    textDecoration: "none",
                    color: "#0f172a",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#667eea";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span style={{ fontSize: 24 }}>🇫🇮</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>Learn Finnish</div>
                    <div style={{ fontSize: 14, color: "#64748b" }}>Guide to learning Finnish</div>
                  </div>
                </a>
                <a
                  href="/work-opportunities"
                  style={{
                    padding: "16px 20px",
                    borderRadius: 16,
                    background: "#ffffff",
                    border: "2px solid #e2e8f0",
                    textDecoration: "none",
                    color: "#0f172a",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#667eea";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <span style={{ fontSize: 24 }}>💼</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>Find Work</div>
                    <div style={{ fontSize: 14, color: "#64748b" }}>Job opportunities</div>
                  </div>
                </a>
              </div>
            </section>
          </div>
        </main>
      </div>
    </RoomContext.Provider>
  );
}
