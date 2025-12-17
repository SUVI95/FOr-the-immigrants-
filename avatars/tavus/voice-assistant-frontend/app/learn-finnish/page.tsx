"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";

type GuideCard = {
  id: string;
  icon: string;
  title: string;
  description: string;
  items?: string[];
  links?: Array<{ label: string; href: string }>;
};

const WHY_FINNISH: GuideCard[] = [
  {
    id: "more-jobs",
    icon: "💼",
    title: "More Job Options",
    description: "Many jobs need Finnish. Learning opens doors.",
  },
  {
    id: "daily-life",
    icon: "🏠",
    title: "Daily Life Easier",
    description: "Shopping, services, making friends - all easier with Finnish.",
  },
  {
    id: "feel-home",
    icon: "❤️",
    title: "Feel at Home",
    description: "Understanding Finnish helps you feel part of Finland.",
  },
];

const LEVELS: GuideCard[] = [
  {
    id: "beginner",
    icon: "🌱",
    title: "Beginner",
    description: "Just starting? Start here.",
    items: [
      "Learn basic words",
      "Say hello and thank you",
      "Count numbers",
    ],
    links: [
      { label: "Start learning", href: "https://www.finnishcourses.fi/en" },
    ],
  },
  {
    id: "basic",
    icon: "📖",
    title: "Basic",
    description: "Can talk daily? You're here.",
    items: [
      "Talk about daily things",
      "Ask questions",
      "Understand simple conversations",
    ],
    links: [
      { label: "Practice more", href: "https://yle.fi/aihe/oppiminen/kielet/suomen-kieli" },
    ],
  },
  {
    id: "work",
    icon: "💼",
    title: "Work Finnish",
    description: "Ready for work? This is your level.",
    items: [
      "Understand work instructions",
      "Talk with colleagues",
      "Write work emails",
    ],
    links: [
      { label: "Work phrases", href: "/work-opportunities" },
    ],
  },
];

const HOW_TO_LEARN: GuideCard[] = [
  {
    id: "courses",
    icon: "🏫",
    title: "Courses",
    description: "Learn in a classroom",
    items: [
      "Connect with Duunijobs team",
      "City courses (Kajaani)",
      "Private schools",
    ],
    links: [
      { label: "Find courses", href: "https://www.finnishcourses.fi/en" },
    ],
  },
  {
    id: "online",
    icon: "💻",
    title: "Online",
    description: "Learn from home",
    items: [
      "Apps (Duolingo, Babbel)",
      "YouTube videos",
      "Online courses",
    ],
    links: [
      { label: "Yle Learn Finnish", href: "https://yle.fi/aihe/oppiminen/kielet/suomen-kieli" },
    ],
  },
  {
    id: "practice",
    icon: "🗣️",
    title: "Practice",
    description: "Speak and listen",
    items: [
      "Talk with Finns",
      "Watch Finnish TV",
      "Listen to radio",
    ],
    links: [
      { label: "Voice Coach", href: "/knuut-voice" },
    ],
  },
  {
    id: "tips",
    icon: "💡",
    title: "Tips",
    description: "How to learn better",
    items: [
      "Practice every day (even 10 minutes)",
      "Don't worry about mistakes",
      "Start with what you need",
    ],
  },
];

const WORK_PHRASES = [
  { finnish: "Hei", english: "Hello", context: "Greeting" },
  { finnish: "Kiitos", english: "Thank you", context: "Politeness" },
  { finnish: "Anteeksi", english: "Sorry / Excuse me", context: "Apologizing" },
  { finnish: "Ymmärrän", english: "I understand", context: "Understanding" },
  { finnish: "En ymmärrä", english: "I don't understand", context: "Not understanding" },
  { finnish: "Voitko auttaa?", english: "Can you help?", context: "Asking help" },
  { finnish: "Mitä tämä tarkoittaa?", english: "What does this mean?", context: "Asking meaning" },
  { finnish: "Selvä", english: "Clear / OK", context: "Confirming" },
];

export default function LearnFinnishPage() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [room] = useState(new Room());

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar activeTab="learn-finnish" onTabChange={() => {}} />

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
                  Learn Finnish
                </h1>
                <p style={{ margin: "16px 0 0 0", fontSize: "1.2rem", opacity: 0.95, maxWidth: 600 }}>
                  A guide to learning Finnish - find your path
                </p>
              </div>
            </section>

            {/* Why Finnish Matters */}
            <section style={{ display: "grid", gap: 24 }}>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#0f172a" }}>
                Why Finnish Matters
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                {WHY_FINNISH.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    style={{
                      borderRadius: 20,
                      padding: "28px 24px",
                      background: "#ffffff",
                      border: "2px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(15,23,42,0.08)",
                    }}
                  >
                    <div style={{ fontSize: 48, marginBottom: 12 }}>{card.icon}</div>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                      {card.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: 15, color: "#64748b", lineHeight: 1.6 }}>
                      {card.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Your Level */}
            <section style={{ display: "grid", gap: 24 }}>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#0f172a" }}>
                Your Level
              </h2>
              <div style={{ display: "grid", gap: 20 }}>
                {LEVELS.map((card, index) => (
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
                    <div style={{ padding: "24px 28px", display: "flex", alignItems: "center", gap: 20 }}>
                      <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
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
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.3s ease", transform: expandedCard === card.id ? "rotate(180deg)" : "rotate(0deg)" }}>
                        <i className="fa-solid fa-chevron-down" style={{ color: "#64748b", fontSize: 14 }}></i>
                      </div>
                    </div>
                    {expandedCard === card.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ padding: "0 28px 24px 28px", borderTop: "1px solid #e2e8f0", marginTop: 16, paddingTop: 24 }}
                      >
                        {card.items && (
                          <ul style={{ margin: "0 0 16px 0", paddingLeft: 24, display: "grid", gap: 8 }}>
                            {card.items.map((item, i) => (
                              <li key={i} style={{ fontSize: 15, color: "#475569", lineHeight: 1.6 }}>{item}</li>
                            ))}
                          </ul>
                        )}
                        {card.links && card.links.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                            {card.links.map((link, i) => (
                              <a
                                key={i}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  padding: "10px 16px",
                                  borderRadius: 12,
                                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  color: "#ffffff",
                                  textDecoration: "none",
                                  fontSize: 14,
                                  fontWeight: 600,
                                }}
                              >
                                {link.label}
                              </a>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>

            {/* How to Learn */}
            <section style={{ display: "grid", gap: 24 }}>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#0f172a" }}>
                How to Learn
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                {HOW_TO_LEARN.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    style={{
                      borderRadius: 20,
                      padding: "28px 24px",
                      background: "#ffffff",
                      border: "2px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(15,23,42,0.08)",
                    }}
                  >
                    <div style={{ fontSize: 48, marginBottom: 12 }}>{card.icon}</div>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                      {card.title}
                    </h3>
                    <p style={{ margin: "0 0 16px 0", fontSize: 15, color: "#64748b", lineHeight: 1.6 }}>
                      {card.description}
                    </p>
                    {card.items && (
                      <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
                        {card.items.map((item, i) => (
                          <li key={i} style={{ fontSize: 14, color: "#475569" }}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {card.links && card.links.length > 0 && (
                      <div style={{ marginTop: 16 }}>
                        {card.links.map((link, i) => (
                          <a
                            key={i}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: "8px 14px",
                              borderRadius: 10,
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              color: "#ffffff",
                              textDecoration: "none",
                              fontSize: 13,
                              fontWeight: 600,
                              display: "inline-block",
                            }}
                          >
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Finnish at Work */}
            <section style={{ display: "grid", gap: 24 }}>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#0f172a" }}>
                Finnish at Work
              </h2>
              <div style={{ display: "grid", gap: 16 }}>
                <p style={{ margin: 0, fontSize: 16, color: "#64748b" }}>
                  Key phrases to understand work instructions
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                  {WORK_PHRASES.map((phrase, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      style={{
                        borderRadius: 16,
                        padding: "20px",
                        background: "#ffffff",
                        border: "2px solid #e2e8f0",
                        boxShadow: "0 2px 8px rgba(15,23,42,0.06)",
                      }}
                    >
                      <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
                        {phrase.finnish}
                      </div>
                      <div style={{ fontSize: 15, color: "#475569", marginBottom: 6 }}>
                        {phrase.english}
                      </div>
                      <div style={{ fontSize: 13, color: "#94a3b8" }}>
                        {phrase.context}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </RoomContext.Provider>
  );
}
