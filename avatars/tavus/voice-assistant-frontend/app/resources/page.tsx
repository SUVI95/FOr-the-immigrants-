"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import CulturalQuiz from "@/components/CulturalQuiz";

type CultureCard = {
  id: string;
  icon: string;
  title: string;
  description: string;
  bullets: string[];
  links?: Array<{ label: string; href: string }>;
};

const CULTURE_CARDS: CultureCard[] = [
  {
    id: "wellbeing",
    icon: "💚",
    title: "Well-being & Mental Health",
    description: "Take care of yourself - help is available",
    bullets: [
      "💚 It's OK to ask for help - many people struggle",
      "📞 Free helplines: Mental Health Helpline 09 2525 0111",
      "🤝 Peer support groups available in Kajaani",
      "🏥 Public healthcare: Book appointment via Kela",
      "🧘 Join activities: Nordic Walking, Sauna evenings",
      "💬 Talk to someone: Connect with mentors on Knuut",
    ],
    links: [
      { label: "Mental Health Helpline", href: "tel:+358925250111" },
      { label: "Kela Healthcare", href: "https://www.kela.fi/web/en/health-insurance" },
      { label: "Find Support Groups", href: "/events?category=Integration+Support" },
    ],
  },
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
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [room] = useState(new Room());

  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
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
            {/* Visual Answer: "Do I understand how things work here?" */}
            {(() => {
              const cardsRead = expandedCards.size; // Count how many cards have been expanded
              const totalCards = CULTURE_CARDS.length;
              const understandingPercent = Math.round((cardsRead / totalCards) * 100);
              
              return (
          <section
            style={{
                    borderRadius: 24,
                    padding: "32px",
                    background: "#ffffff",
                    border: "2px solid #e2e8f0",
                    boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                    <div style={{ fontSize: 48 }}>💡</div>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
                        Do I understand how things work here?
                      </h2>
                      <p style={{ margin: "8px 0 0 0", fontSize: 16, color: "#64748b" }}>
                        {cardsRead === 0 ? "Click cards below to learn" : `${cardsRead} of ${totalCards} topics explored`}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ flex: 1, height: 12, borderRadius: 6, background: "#e2e8f0", overflow: "hidden", position: "relative" }}>
                      <div style={{
                        height: "100%",
                        width: `${Math.max(understandingPercent, 10)}%`,
                        background: "linear-gradient(90deg, #667eea, #764ba2)",
                        transition: "width 0.5s ease",
                        borderRadius: 6,
                      }} />
                      <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        color: understandingPercent > 50 ? "#ffffff" : "#64748b",
                      }}>
                        {understandingPercent}%
                      </div>
                    </div>
                  </div>
                  {cardsRead === 0 && (
                    <div style={{ marginTop: 20, padding: "16px", borderRadius: 12, background: "#fef3c7", border: "1px solid #fbbf24" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 24 }}>👉</span>
                        <span style={{ fontSize: 15, color: "#92400e", fontWeight: 600 }}>
                          Click any card below to start learning about Finnish culture
                        </span>
                      </div>
                    </div>
                  )}
                </section>
              );
            })()}

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
                      boxShadow: expandedCards.has(card.id)
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
                          transform: expandedCards.has(card.id) ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        <i className="fa-solid fa-chevron-down" style={{ color: "#64748b", fontSize: 14 }}></i>
                      </div>
                    </div>

                    {expandedCards.has(card.id) && (
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
                        {card.links && card.links.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
                            {card.links.map((link, idx) => (
                              <a
                                key={idx}
                                href={link.href}
                                target={link.href.startsWith("tel:") || link.href.startsWith("mailto:") ? undefined : "_blank"}
                                rel="noopener noreferrer"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                  padding: "10px 16px",
                                  borderRadius: 12,
                                  background: "#e0f2fe",
                                  color: "#0284c7",
                                  fontWeight: 600,
                                  fontSize: 14,
                                  textDecoration: "none",
                                  boxShadow: "0 2px 8px rgba(2,132,199,0.1)",
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {link.label} <span style={{ fontSize: 12 }}>↗</span>
                              </a>
                            ))}
                          </div>
                        )}
                        {/* Add Cultural Quiz after content */}
                        {expandedCards.has(card.id) && (
                          <div style={{ padding: "0 28px 24px" }}>
                            <CulturalQuiz cardId={card.id} />
                          </div>
                        )}
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
