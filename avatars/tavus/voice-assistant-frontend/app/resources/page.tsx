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
            <div style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 18,
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              maxWidth: 820
            }}>
              <p style={{ color: "#374151", fontSize: "1.05rem", lineHeight: 1.7, margin: 0 }}>
                This page collects trusted, official links you’ll need when moving to and living in Kajaani.
                You can handle residence permits, population registration (DVV), social security (Kela), taxes (Vero),
                employment and job search, and city services in one place. Save this page and share it with newcomers.
              </p>
            </div>
          </div>

          {/* Unified Resource Grid (no section labels) */}
          <section style={{ background: "white", borderRadius: 12, boxShadow: "0 2px 6px rgba(0,0,0,0.06)", padding: 20 }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18
            }}>
              {[...cityResources, ...beforeArrival, ...afterArrival].map((r) => (
                <a
                  key={r.id}
                  href={r.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "block",
                    background: "linear-gradient(180deg, #f9fafb 0%, #ffffff 100%)",
                    border: "1px solid #e5e7eb",
                    borderRadius: 14,
                    padding: 18,
                    color: "#111",
                    textDecoration: "none",
                    transition: "transform .15s ease, box-shadow .15s ease, border-color .15s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 18px rgba(0,0,0,0.08)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "#c7d2fe";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e5e7eb";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ fontSize: 28 }}>{r.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: "1.05rem" }}>{r.title}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 10 }}>{r.category}</div>
                  <div style={{ color: "#374151", lineHeight: 1.65 }}>{r.description}</div>
                </a>
              ))}
            </div>
          </section>
        </main>
      </div>
    </RoomContext.Provider>
  );
}


