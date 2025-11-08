"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { useTranslation } from "@/components/i18n/TranslationProvider";
import { useUserProfile } from "@/context/UserProfileContext";

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
  {
    id: "infofinland",
    icon: "🌍",
    title: "InfoFinland – Living in Finland",
    category: "Guides",
    iconClass: "fa-globe",
    description: "Official information for immigrants: housing, work, healthcare, education.",
    link: "https://www.infofinland.fi/en",
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
  {
    id: "migri-appointment",
    icon: "📅",
    title: "Migri – Book Appointment",
    category: "Immigration",
    iconClass: "fa-calendar",
    description: "Book an appointment for residence permit identification.",
    link: "https://migri.fi/en/our-services/book-an-appointment",
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
  {
    id: "te-services",
    icon: "🧭",
    title: "TE Services – Jobseeker Registration",
    category: "Employment",
    iconClass: "fa-briefcase",
    description: "Register as a jobseeker and access employment services.",
    link: "https://www.tyomarkkinatori.fi/en/jobseekers",
  },
  {
    id: "omakanta",
    icon: "🩺",
    title: "My Kanta (Omakanta)",
    category: "Healthcare",
    iconClass: "fa-heart-pulse",
    description: "View your prescriptions, lab results, and health data.",
    link: "https://www.kanta.fi/en/omakanta",
  },
  {
    id: "traficom-driving",
    icon: "🚗",
    title: "Traficom – Exchange Driving Licence",
    category: "Transport",
    iconClass: "fa-car",
    description: "Information on exchanging a foreign driving licence.",
    link: "https://www.traficom.fi/en/transport/driving-licences/exchanging-foreign-driving-licence",
  },
  {
    id: "finnishcourses",
    icon: "📚",
    title: "Finnishcourses.fi",
    category: "Language",
    iconClass: "fa-language",
    description: "Search for Finnish language courses across Finland.",
    link: "https://www.finnishcourses.fi/en",
  },
  {
    id: "yle-kieli",
    icon: "🎧",
    title: "Yle – Learn Finnish",
    category: "Language",
    iconClass: "fa-headphones",
    description: "Free audio, video and articles to learn Finnish.",
    link: "https://yle.fi/aihe/oppiminen/kielet/suomen-kieli",
  },
];

export default function ResourcesPage() {
  const { t } = useTranslation();
  const { state: userState, recordAction, togglePlainLanguage } = useUserProfile();
  const [activeTab, setActiveTab] = useState("explore");
  const [room] = useState(new Room());
  const plainLanguage = userState.settings.plainLanguage;
  const overviewNarration =
    "Essential links for settling in Kajaani and Finland. Immigration, registration, healthcare, employment, and language learning resources in one place.";

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };
  const handleTabChange = (tab: string) => {
    if (tab === "explore") {
      window.location.href = "/";
      return;
    }
    setActiveTab(tab);
  };

  const handlePlainLanguageToggle = () => {
    togglePlainLanguage();
    recordAction({
      id: `resources-plain-language-${Date.now()}`,
      label: plainLanguage ? "Disabled plain language mode" : "Enabled plain language mode",
      category: "resources",
      xp: 6,
      impactPoints: 5,
    });
  };

  const handleListen = (text: string, label: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Listening is not supported in this browser.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    recordAction({
      id: `resources-listen-${Date.now()}`,
      label: `Played listen mode: ${label}`,
      category: "resources",
      xp: 5,
      impactPoints: 4,
    });
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
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
              {t("resources")}
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
                Essential links for settling in Kajaani and Finland — immigration, registration, healthcare,
                employment and language. Curated and investor‑ready.
              </p>
            </div>
            <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 12 }}>
              <button
                type="button"
                onClick={handlePlainLanguageToggle}
                style={{
                  padding: "10px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5f5",
                  background: plainLanguage ? "#1d4ed8" : "#fff",
                  color: plainLanguage ? "#fff" : "#1e293b",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {plainLanguage ? "Plain Language (ON)" : "Plain Language (OFF)"}
              </button>
              <button
                type="button"
                onClick={() => handleListen(overviewNarration, "Resources overview")}
                style={{
                  padding: "10px 16px",
                  borderRadius: 12,
                  border: "1px solid #f97316",
                  background: "#fff7ed",
                  color: "#c2410c",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Listen
              </button>
            </div>
          </div>

          {/* Premium Resource Sections */}
          <Section
            title="City & Guides"
            items={cityResources}
            plainLanguage={plainLanguage}
            onResourceOpen={(resource) =>
              recordAction({
                id: `resource-open-${resource.id}-${Date.now()}`,
                label: `Opened resource ${resource.title}`,
                category: "resources",
                xp: 7,
                impactPoints: 6,
              })
            }
            onListen={handleListen}
          />
          <Section
            title="Immigration (Before Arrival)"
            items={beforeArrival}
            plainLanguage={plainLanguage}
            onResourceOpen={(resource) =>
              recordAction({
                id: `resource-open-${resource.id}-${Date.now()}`,
                label: `Opened resource ${resource.title}`,
                category: "resources",
                xp: 7,
                impactPoints: 6,
              })
            }
            onListen={handleListen}
          />
          <Section
            title="After Arrival (Registration, ID, Banking, Health)"
            items={afterArrival}
            plainLanguage={plainLanguage}
            onResourceOpen={(resource) =>
              recordAction({
                id: `resource-open-${resource.id}-${Date.now()}`,
                label: `Opened resource ${resource.title}`,
                category: "resources",
                xp: 7,
                impactPoints: 6,
              })
            }
            onListen={handleListen}
          />
        </main>
      </div>
    </RoomContext.Provider>
  );
}

function simplifyDescription(text: string) {
  return text
    .replace(/official/gi, "official")
    .replace(/guidance/gi, "guidance")
    .replace(/assistance/gi, "help")
    .replace(/reimbursements/gi, "refunds")
    .replace(/obligations/gi, "rules")
    .replace(/information/gi, "info");
}

function Section({
  title,
  items,
  plainLanguage,
  onResourceOpen,
  onListen,
}: {
  title: string;
  items: Resource[];
  plainLanguage: boolean;
  onResourceOpen: (resource: Resource) => void;
  onListen: (text: string, label: string) => void;
}) {
  return (
    <section style={{ background: "linear-gradient(180deg, #ffffff 0%, #fbfbfd 100%)", borderRadius: 16, boxShadow: "0 6px 24px rgba(0,0,0,0.06)", padding: 24, border: "1px solid #e5e7eb", marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "#0f172a" }}>{title}</h2>
        <span style={{ fontSize: 12, color: "#64748b" }}>{items.length} links</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        {items.map((r) => (
          <a
            key={r.id}
            href={r.link}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "block",
              background: "#ffffff",
              border: "1px solid #e6e8ee",
              borderRadius: 16,
              padding: 18,
              color: "#0f172a",
              textDecoration: "none",
              transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
              boxShadow: "0 4px 12px rgba(2,6,23,0.06)",
            }}
            onClick={() => onResourceOpen(r)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 10px 24px rgba(2,6,23,0.10)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#c7d2fe";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 12px rgba(2,6,23,0.06)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e6e8ee";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 24 }}>{r.icon}</div>
              <div style={{ fontWeight: 800, fontSize: "1.02rem", letterSpacing: 0.1 }}>{r.title}</div>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "#2563eb", background: "#eff6ff", border: "1px solid #bfdbfe", padding: "6px 8px", borderRadius: 999, marginBottom: 10 }}>
              <span className={`fa ${r.iconClass}`} aria-hidden></span>
              <span>{r.category}</span>
            </div>
            <div style={{ color: "#334155", lineHeight: 1.65 }}>
              {plainLanguage ? simplifyDescription(r.description) : r.description}
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onListen(plainLanguage ? simplifyDescription(r.description) : r.description, r.title);
                }}
                style={{
                  padding: "6px 10px",
                  borderRadius: 10,
                  border: "1px solid #cbd5f5",
                  background: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#1e3a8a",
                  cursor: "pointer",
                }}
              >
                Listen
              </button>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
