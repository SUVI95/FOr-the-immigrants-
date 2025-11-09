"use client";

import { useMemo, useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { useUserProfile } from "@/context/UserProfileContext";

type ResourceLink = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon?: string;
};

type ResourceSection = {
  id: string;
  title: string;
  icon: string;
  intro: string;
  items: ResourceLink[];
  tryNext?: {
    label: string;
    href: string;
  };
};

const RESOURCE_SECTIONS: ResourceSection[] = [
  {
    id: "city-life",
    icon: "🏙️",
    title: "City & Everyday Life",
    intro: "Find the services, events, and info that make living in Kajaani easier.",
    items: [
      {
        id: "city-kajaani",
        icon: "🌍",
        title: "City of Kajaani",
        description: "News, municipal services, and contacts in English.",
        href: "https://www.kajaani.fi/en/",
      },
      {
        id: "moving-guide",
        icon: "🧭",
        title: "Moving to Kajaani Guide",
        description: "Step-by-step support on where to register, live, and get help.",
        href: "https://www.kajaani.fi/en/moving-to-kajaani/",
      },
      {
        id: "info-point",
        icon: "🏢",
        title: "Kajaani Info Point",
        description: "Addresses, helpdesk, and local advice for newcomers.",
        href: "https://www.kajaani.fi/en/city-and-administration/contact-information-and-services/kajaani-info/",
      },
      {
        id: "infofinland",
        icon: "🇫🇮",
        title: "InfoFinland",
        description: "Official national guide covering housing, work, studies, and family life.",
        href: "https://www.infofinland.fi/en",
      },
    ],
    tryNext: {
      label: "Events near me",
      href: "/events",
    },
  },
  {
    id: "after-arrival",
    icon: "🪪",
    title: "After Arrival",
    intro: "Get registered, insured, and ready to work — all official steps here.",
    items: [
      {
        id: "dvv",
        icon: "🪪",
        title: "DVV Registration",
        description: "Register your Finnish address and personal data.",
        href: "https://dvv.fi/en/registration-of-foreign-residents",
      },
      {
        id: "kela",
        icon: "🇫🇮",
        title: "Kela Benefits",
        description: "Check eligibility for health insurance and social security.",
        href: "https://www.kela.fi/web/en/moving-to-finland",
      },
      {
        id: "vero",
        icon: "🧾",
        title: "Vero Tax Card",
        description: "Get your tax card and learn the rules for working in Finland.",
        href: "https://www.vero.fi/en/individuals/tax-cards-and-tax-returns/international-situations/coming-to-work-in-finland/",
      },
      {
        id: "police-id",
        icon: "🪪",
        title: "Police ID Card",
        description: "Apply for a Finnish ID card once you are registered.",
        href: "https://www.police.fi/en/services/identity-cards",
      },
      {
        id: "bank-account",
        icon: "🏦",
        title: "Open a Bank Account",
        description: "Checklist of documents and banks available in English.",
        href: "https://www.op.fi/en/",
      },
    ],
    tryNext: {
      label: "Book your first integration workshop",
      href: "/programs",
    },
  },
  {
    id: "work-employment",
    icon: "💼",
    title: "Work & Employment",
    intro: "Find jobs, register as a jobseeker, and grow your Finnish work skills.",
    items: [
      {
        id: "tyomarkkinatori",
        icon: "💼",
        title: "Työmarkkinatori",
        description: "Finland’s official job market with listings, career planning, and guidance in English.",
        href: "https://www.tyomarkkinatori.fi/en/jobseekers",
      },
      {
        id: "te-services",
        icon: "🧭",
        title: "TE Services",
        description: "Register as a jobseeker and access coaching, training, and benefits.",
        href: "https://www.tyomarkkinatori.fi/en/jobseekers",
      },
      {
        id: "duunijobs",
        icon: "💻",
        title: "Duunijobs",
        description: "Curated roles, mentoring opportunities, and employer insights for newcomers.",
        href: "https://duunitori.fi/en",
      },
    ],
    tryNext: {
      label: "Explore Career Boost Track",
      href: "/programs",
    },
  },
  {
    id: "health-wellbeing",
    icon: "🩺",
    title: "Health & Wellbeing",
    intro: "Stay healthy and access Finland’s digital health system easily.",
    items: [
      {
        id: "omakanta",
        icon: "🩺",
        title: "My Kanta (Omakanta)",
        description: "Check prescriptions, doctor visits, and vaccination records online.",
        href: "https://www.kanta.fi/en/omakanta",
      },
      {
        id: "kainuu-health",
        icon: "🏥",
        title: "Kainuu Health Services",
        description: "Find local clinics, emergency info, and how to book appointments.",
        href: "https://sote.kainuu.fi/fi/palvelut/palveluhakemisto",
      },
      {
        id: "mental-support",
        icon: "🧠",
        title: "Mental Wellbeing Finland",
        description: "Free helplines, chat support, and resources in English.",
        href: "https://mieli.fi/en/support-and-help/mental-health-services-in-english/",
      },
    ],
    tryNext: {
      label: "Join a wellbeing group",
      href: "/groups",
    },
  },
  {
    id: "learn-grow",
    icon: "📚",
    title: "Learn & Grow",
    intro: "Find free courses, apps, and ways to practice Finnish.",
    items: [
      {
        id: "finnishcourses",
        icon: "📚",
        title: "Finnishcourses.fi",
        description: "Search classroom and online Finnish courses across Finland.",
        href: "https://www.finnishcourses.fi/en",
      },
      {
        id: "yle-learn",
        icon: "🎧",
        title: "Yle Learn Finnish",
        description: "Free audio, video, and exercises from Finland’s national broadcaster.",
        href: "https://yle.fi/aihe/oppiminen/kielet/suomen-kieli",
      },
      {
        id: "knuut-coach",
        icon: "🤖",
        title: "Knuut AI Finnish Coach",
        description: "Chat with Knuut AI to practice everyday Finnish whenever you like.",
        href: "/learn-finnish",
      },
    ],
    tryNext: {
      label: "Learn Finnish → Start lesson",
      href: "/learn-finnish",
    },
  },
  {
    id: "before-arrival",
    icon: "🛂",
    title: "Before You Arrive",
    intro: "Plan your move and prepare the right documents before landing in Finland.",
    items: [
      {
        id: "migri",
        icon: "🛂",
        title: "Migri Residence Permits",
        description: "Find the permit you need and the documents required before you move.",
        href: "https://migri.fi/en/moving-to-finland",
      },
      {
        id: "enter-finland",
        icon: "🌐",
        title: "Enter Finland e-service",
        description: "Submit your permit application and follow progress online.",
        href: "https://enterfinland.fi/eServices",
      },
      {
        id: "migri-appointments",
        icon: "📅",
        title: "Book Migri Appointment",
        description: "Reserve an identification slot for your residence permit visit.",
        href: "https://migri.fi/en/our-services/book-an-appointment",
      },
    ],
    tryNext: {
      label: "Checklist for newcomers",
      href: "/programs",
    },
  },
];

export default function ResourcesPage() {
  const { state: userState, recordAction, togglePlainLanguage } = useUserProfile();
  const [activeTab, setActiveTab] = useState("explore");
  const [room] = useState(new Room());
  const plainLanguage = userState.settings.plainLanguage;
  const [searchTerm, setSearchTerm] = useState("");
  const overviewNarration =
    "Trusted links and next steps to start, settle, and thrive in Kajaani and across Finland. Immigration, services, work, and wellbeing — curated with the City of Kajaani and InfoFinland.";

  const filteredSections = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return RESOURCE_SECTIONS;
    return RESOURCE_SECTIONS.filter((section) => {
      const inTitle = section.title.toLowerCase().includes(term);
      const inIntro = section.intro.toLowerCase().includes(term);
      const inItems = section.items.some(
        (item) => item.title.toLowerCase().includes(term) || item.description.toLowerCase().includes(term),
      );
      return inTitle || inIntro || inItems;
    });
  }, [searchTerm]);

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
          <section
            style={{
              position: "relative",
              borderRadius: 28,
              overflow: "hidden",
              padding: "44px 38px",
              marginBottom: 32,
              color: "#0f172a",
              background: "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(129,140,248,0.18))",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1523875194681-bedd468c58bf?auto=format&fit=crop&w=1400&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.22,
              }}
            />
            <div style={{ position: "relative", display: "grid", gap: 18 }}>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", color: "#1d4ed8" }}>
                  Resources & Life Tools
                </p>
                <h1 style={{ margin: "6px 0 0 0", fontSize: "3rem", fontWeight: 800, color: "#0f172a" }}>
                  Life in Finland — Start, Settle, Thrive
                </h1>
                <p style={{ margin: "12px 0 0 0", fontSize: "1.2rem", color: "#1f2937", maxWidth: 720 }}>
                  Your trusted links, guides, and next steps — all in one place.
                </p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => handleListen(overviewNarration, "Resources overview")}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 999,
                    border: "1px solid rgba(37,99,235,0.25)",
                    background: "rgba(255,255,255,0.85)",
                    color: "#1d4ed8",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  🗣️ Listen to this page
                </button>
                <button
                  type="button"
                  onClick={handlePlainLanguageToggle}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 999,
                    border: "1px solid rgba(37,99,235,0.25)",
                    background: plainLanguage ? "linear-gradient(135deg, #2563eb, #7c3aed)" : "rgba(255,255,255,0.85)",
                    color: plainLanguage ? "#fff" : "#1e293b",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {plainLanguage ? "Plain language on" : "Plain language off"}
                </button>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 16px",
                    borderRadius: 999,
                    border: "1px solid rgba(22,101,52,0.25)",
                    background: "rgba(240,253,244,0.85)",
                    color: "#166534",
                    fontWeight: 600,
                  }}
                >
                  ✅ Verified by City of Kajaani & InfoFinland
                </div>
              </div>
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1f2937" }}>Search resources by topic or city</span>
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="E.g. jobs, healthcare, DVV, bank..."
                    style={{
                      padding: "12px 14px",
                      borderRadius: 14,
                      border: "1px solid rgba(148,163,184,0.6)",
                      fontSize: 14,
                      background: "rgba(255,255,255,0.9)",
                    }}
                  />
                </label>
              </div>
            </div>
          </section>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {filteredSections.length === 0 ? (
              <div
                style={{
                  borderRadius: 16,
                  border: "1px dashed #cbd5f5",
                  padding: 24,
                  background: "rgba(248,250,252,0.9)",
                  textAlign: "center",
                  color: "#475569",
                  fontWeight: 600,
                }}
              >
                No matches yet. Try a different keyword or browse the categories below.
              </div>
            ) : (
              filteredSections.map((section) => (
                <Section
                  key={section.id}
                  section={section}
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
              ))
            )}
          </div>
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
  section,
  plainLanguage,
  onResourceOpen,
  onListen,
}: {
  section: ResourceSection;
  plainLanguage: boolean;
  onResourceOpen: (resource: ResourceLink) => void;
  onListen: (text: string, label: string) => void;
}) {
  return (
    <section
      style={{
        borderRadius: 20,
        border: "1px solid #e2e8f0",
        background: "#ffffff",
        boxShadow: "0 16px 28px rgba(15,23,42,0.08)",
        padding: 24,
      }}
    >
      <header style={{ display: "grid", gap: 8, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>{section.icon}</span>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{section.title}</h2>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: "#475569", maxWidth: 720 }}>{section.intro}</p>
      </header>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
        {section.items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            onClick={() => onResourceOpen(item)}
            style={{
              position: "relative",
              display: "grid",
              gap: 10,
              padding: 18,
              borderRadius: 16,
              border: "1px solid rgba(148,163,184,0.3)",
              background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
              textDecoration: "none",
              color: "#0f172a",
              transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
              boxShadow: "0 10px 20px rgba(15,23,42,0.06)",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.transform = "translateY(-3px)";
              event.currentTarget.style.borderColor = "#c7d2fe";
              event.currentTarget.style.boxShadow = "0 16px 28px rgba(59,130,246,0.18)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform = "translateY(0)";
              event.currentTarget.style.borderColor = "rgba(148,163,184,0.3)";
              event.currentTarget.style.boxShadow = "0 10px 20px rgba(15,23,42,0.06)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {item.icon && <span style={{ fontSize: 24 }}>{item.icon}</span>}
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{item.title}</h3>
            </div>
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: "#475569" }}>
              {plainLanguage ? simplifyDescription(item.description) : item.description}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onListen(plainLanguage ? simplifyDescription(item.description) : item.description, item.title);
                }}
                style={{
                  padding: "6px 10px",
                  borderRadius: 10,
                  border: "1px solid #cbd5f5",
                  background: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#1d4ed8",
                  cursor: "pointer",
                }}
              >
                Listen
              </button>
            </div>
          </a>
        ))}
      </div>
      {section.tryNext && (
        <div style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600, color: "#2563eb" }}>
          Try this next →
          <a href={section.tryNext.href} style={{ color: "#2563eb", textDecoration: "underline" }}>
            {section.tryNext.label}
          </a>
        </div>
      )}
    </section>
  );
}
