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

const cityResources: Resource[] = [
  {
    id: "kajaani-home",
    icon: "🏙️",
    title: "City of Kajaani (EN)",
    category: "City",
    iconClass: "fa-city",
    description: "Official city website with services, news, and contacts.",
    link: "https://www.kajaani.fi/en/",
  },
  {
    id: "moving-to-kajaani",
    icon: "🧭",
    title: "Moving to Kajaani",
    category: "City",
    iconClass: "fa-location-dot",
    description: "Guidance for newcomers: settling, services, and local life.",
    link: "https://www.kajaani.fi/en/moving-to-kajaani/",
  },
  {
    id: "kajaani-info",
    icon: "ℹ️",
    title: "Kajaani Info",
    category: "City",
    iconClass: "fa-circle-info",
    description: "City service point: addresses, contacts, and advice.",
    link: "https://www.kajaani.fi/en/city-and-administration/contact-information-and-services/kajaani-info/",
  },
];

const beforeArrival: Resource[] = [
  {
    id: "migri-moving",
    icon: "🛂",
    title: "Migri – Moving to Finland",
    category: "Immigration",
    iconClass: "fa-passport",
    description: "Official guidance on permits and steps before you move.",
    link: "https://migri.fi/en/moving-to-finland",
  },
  {
    id: "enter-finland",
    icon: "🌐",
    title: "Enter Finland (e‑service)",
    category: "Immigration",
    iconClass: "fa-globe",
    description: "Apply for residence permits and follow your application online.",
    link: "https://enterfinland.fi/eServices",
  },
];

const afterArrival: Resource[] = [
  {
    id: "dvv-registration",
    icon: "🪪",
    title: "DVV – Register as a resident",
    category: "Population Register",
    iconClass: "fa-id-card",
    description: "Register your address and personal data (population register).",
    link: "https://dvv.fi/en/registration-of-foreign-residents",
  },
  {
    id: "kela-moving",
    icon: "🇫🇮",
    title: "Kela – Moving to Finland",
    category: "Social Security",
    iconClass: "fa-landmark",
    description: "Social security, benefits, health reimbursements, students.",
    link: "https://www.kela.fi/web/en/moving-to-finland",
  },
  {
    id: "vero-coming-to-work",
    icon: "🧾",
    title: "Vero – Coming to work in Finland",
    category: "Tax",
    iconClass: "fa-file-invoice",
    description: "Tax number, tax card, and obligations for workers.",
    link: "https://www.vero.fi/en/individuals/tax-cards-and-tax-returns/international-situations/coming-to-work-in-finland/",
  },
  {
    id: "jobmarket",
    icon: "💼",
    title: "Job Market Finland (EN)",
    category: "Employment",
    iconClass: "fa-briefcase",
    description: "Official employment and career services portal.",
    link: "https://www.jobmarket.fi/en",
  },
  {
    id: "police-id",
    icon: "🪪",
    title: "Police – Identity Card",
    category: "ID",
    iconClass: "fa-id-badge",
    description: "Apply for a Finnish ID card after you are registered.",
    link: "https://www.police.fi/en/services/identity-cards",
  },
  {
    id: "open-bank",
    icon: "🏦",
    title: "Open a bank account (OP example)",
    category: "Banking",
    iconClass: "fa-piggy-bank",
    description: "Example bank info in English; bring ID and address details.",
    link: "https://www.op.fi/en/",
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

          {/* Kajaani City */}
          <section style={{ background: "white", borderRadius: 12, boxShadow: "0 2px 4px rgba(0,0,0,0.08)", padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "#111", marginBottom: 16 }}>Kajaani City</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {cityResources.map((r) => (
                <a key={r.id} href={r.link} target="_blank" rel="noreferrer" style={{ display: "block", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, color: "#111", textDecoration: "none" }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{r.icon}</div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>{r.category}</div>
                  <div style={{ color: "#374151", lineHeight: 1.6 }}>{r.description}</div>
                </a>
              ))}
            </div>
          </section>

          {/* Before You Move */}
          <section style={{ background: "white", borderRadius: 12, boxShadow: "0 2px 4px rgba(0,0,0,0.08)", padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "#111", marginBottom: 16 }}>Before You Move</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {beforeArrival.map((r) => (
                <a key={r.id} href={r.link} target="_blank" rel="noreferrer" style={{ display: "block", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, color: "#111", textDecoration: "none" }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{r.icon}</div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>{r.category}</div>
                  <div style={{ color: "#374151", lineHeight: 1.6 }}>{r.description}</div>
                </a>
              ))}
            </div>
          </section>

          {/* After You Arrive */}
          <section style={{ background: "white", borderRadius: 12, boxShadow: "0 2px 4px rgba(0,0,0,0.08)", padding: 24 }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "#111", marginBottom: 16 }}>After You Arrive</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {afterArrival.map((r) => (
                <a key={r.id} href={r.link} target="_blank" rel="noreferrer" style={{ display: "block", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, color: "#111", textDecoration: "none" }}>
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


