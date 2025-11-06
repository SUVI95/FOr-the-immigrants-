"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";

type Resource = {
  id: string;
  icon: string;
  title: string;
  category: string;
  iconClass: string;
  description: string;
  link: string;
};

const resources: Resource[] = [
  {
    id: "kela",
    icon: "🇫🇮",
    title: "Kela (Social Security)",
    category: "Government",
    iconClass: "fa-landmark",
    description:
      "Apply for allowances, health reimbursements, and student benefits.",
    link: "https://www.kela.fi/web/en",
  },
  {
    id: "bank",
    icon: "🏦",
    title: "Bank Registration",
    category: "Banking",
    iconClass: "fa-piggy-bank",
    description:
      "Steps and documents to open a bank account in Finland.",
    link: "https://www.op.fi/en/",
  },
  {
    id: "dvv",
    icon: "🪪",
    title: "DVV Registration",
    category: "Government",
    iconClass: "fa-id-card",
    description:
      "Register your address and personal data with DVV.",
    link: "https://dvv.fi/en/registration-of-foreign-residents",
  },
  {
    id: "te",
    icon: "💼",
    title: "TE Services (Employment)",
    category: "Employment",
    iconClass: "fa-briefcase",
    description:
      "Job search assistance, employment services, and support for job seekers.",
    link: "https://www.te-palvelut.fi/te/en/",
  },
  {
    id: "tax",
    icon: "🧾",
    title: "Finnish Tax Office",
    category: "Government",
    iconClass: "fa-file-invoice",
    description:
      "Register for taxation, request tax cards, and manage tax matters.",
    link: "https://www.vero.fi/en/",
  },
];

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("explore");
  const [room] = useState(new Room());

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onLearnFinnishClick={handleLearnFinnishClick} 
        />

        <main style={{ 
          maxWidth: "1100px", 
          margin: "0 auto", 
          padding: "40px 20px",
          background: "#fafafa",
          minHeight: "100vh"
        }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{
              fontSize: "3rem",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 10,
            }}>
              City & Integration Resources
            </h1>
            <p style={{ color: "#666", fontSize: "1.1rem", maxWidth: 720 }}>
              Quick access to official services and guides for living in Kajaani.
            </p>
          </div>

          <section style={{
            background: "white",
            borderRadius: 12,
            boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
            padding: 24
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16
            }}>
              {resources.map((r) => (
                <a
                  key={r.id}
                  href={r.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "block",
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    padding: 16,
                    color: "#111",
                    textDecoration: "none",
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{r.icon}</div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>{r.category}</div>
                  <div style={{ color: "#374151", lineHeight: 1.6 }}>{r.description}</div>
                </a>
              ))}
            </div>
          </section>
        </main>
      </div>
    </RoomContext.Provider>
  );
}


