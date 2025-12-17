"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";

type BusinessStep = {
  id: string;
  icon: string;
  title: string;
  description: string;
  items: string[];
  links?: Array<{ label: string; href: string }>;
};

const BUSINESS_STEPS: BusinessStep[] = [
  {
    id: "step1",
    icon: "💡",
    title: "Choose Business Type",
    description: "Decide what kind of business you want",
    items: [
      "Sole trader (toiminimi)",
      "Limited company (Oy)",
      "Partnership",
    ],
    links: [
      { label: "Yritystele Guide", href: "https://www.yritystele.fi/en/" },
    ],
  },
  {
    id: "step2",
    icon: "📋",
    title: "Register Your Business",
    description: "Register with Finnish authorities",
    items: [
      "Register with Trade Register",
      "Get business ID (Y-tunnus)",
      "Register for VAT if needed",
    ],
    links: [
      { label: "Trade Register", href: "https://www.ytj.fi/en/" },
    ],
  },
  {
    id: "step3",
    icon: "💰",
    title: "Open Business Bank Account",
    description: "Separate account for business",
    items: [
      "Choose a bank",
      "Bring business documents",
      "Set up online banking",
    ],
  },
  {
    id: "step4",
    icon: "📊",
    title: "Understand Taxes",
    description: "Know your tax obligations",
    items: [
      "Register with Tax Office",
      "Learn about VAT",
      "Keep receipts and records",
    ],
    links: [
      { label: "Tax Office Guide", href: "https://www.vero.fi/en/individuals/starting-a-business/" },
    ],
  },
  {
    id: "step5",
    icon: "📝",
    title: "Get Permits",
    description: "Check if you need special permits",
    items: [
      "Food business needs permit",
      "Some services need license",
      "Check your industry rules",
    ],
    links: [
      { label: "Permit Finder", href: "https://www.suomi.fi/permits" },
    ],
  },
  {
    id: "step6",
    icon: "🤝",
    title: "Get Support",
    description: "Help is available",
    items: [
      "Business Finland (grants)",
      "Local business advisors",
      "Networking events",
    ],
    links: [
      { label: "Business Finland", href: "https://www.businessfinland.fi/en" },
      { label: "Kajaani Business", href: "https://www.kajaani.fi/en/" },
    ],
  },
];

export default function StartBusinessPage() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [room] = useState(new Room());

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar activeTab="start-business" onTabChange={() => {}} />

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
                  Start a Business
                </h1>
                <p style={{ margin: "16px 0 0 0", fontSize: "1.2rem", opacity: 0.95, maxWidth: 600 }}>
                  Simple steps to start your business in Finland
                </p>
              </div>
            </section>

            {/* Steps Cards */}
            <section style={{ display: "grid", gap: 24 }}>
              <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#0f172a" }}>
                Steps to Start
              </h2>
              
              <div style={{ display: "grid", gap: 20 }}>
                {BUSINESS_STEPS.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    style={{
                      borderRadius: 24,
                      border: "2px solid #e2e8f0",
                      background: "#ffffff",
                      boxShadow: expandedCard === step.id 
                        ? "0 16px 32px rgba(15,23,42,0.12)" 
                        : "0 4px 12px rgba(15,23,42,0.08)",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => toggleCard(step.id)}
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
                        {step.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                          {step.title}
                        </h3>
                        <p style={{ margin: "8px 0 0 0", fontSize: 15, color: "#64748b" }}>
                          {step.description}
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
                          transform: expandedCard === step.id ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        <i className="fa-solid fa-chevron-down" style={{ color: "#64748b", fontSize: 14 }}></i>
                      </div>
                    </div>

                    {expandedCard === step.id && (
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
                        <div style={{ display: "grid", gap: 16 }}>
                          <div>
                            <h4 style={{ margin: "0 0 12px 0", fontSize: 16, fontWeight: 600, color: "#0f172a" }}>
                              What to do:
                            </h4>
                            <ul style={{ margin: 0, paddingLeft: 24, display: "grid", gap: 8 }}>
                              {step.items.map((item, i) => (
                                <li key={i} style={{ fontSize: 15, color: "#475569", lineHeight: 1.6 }}>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {step.links && step.links.length > 0 && (
                            <div>
                              <h4 style={{ margin: "0 0 12px 0", fontSize: 16, fontWeight: 600, color: "#0f172a" }}>
                                Helpful links:
                              </h4>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                                {step.links.map((link, i) => (
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
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 8,
                                      transition: "transform 0.2s ease",
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                  >
                                    {link.label}
                                    <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: 12 }}></i>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Quick Tips Section */}
            <section
              style={{
                borderRadius: 24,
                padding: "32px 28px",
                background: "linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)",
                border: "2px solid rgba(102,126,234,0.2)",
              }}
            >
              <h2 style={{ margin: "0 0 20px 0", fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
                💡 Quick Tips
              </h2>
              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20 }}>✓</span>
                  <p style={{ margin: 0, fontSize: 15, color: "#475569", lineHeight: 1.6 }}>
                    Start small. You can always grow later.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20 }}>✓</span>
                  <p style={{ margin: 0, fontSize: 15, color: "#475569", lineHeight: 1.6 }}>
                    Get help from advisors. It's free.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20 }}>✓</span>
                  <p style={{ margin: 0, fontSize: 15, color: "#475569", lineHeight: 1.6 }}>
                    Keep all receipts. You need them for taxes.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20 }}>✓</span>
                  <p style={{ margin: 0, fontSize: 15, color: "#475569", lineHeight: 1.6 }}>
                    Network with other business owners.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </RoomContext.Provider>
  );
}

