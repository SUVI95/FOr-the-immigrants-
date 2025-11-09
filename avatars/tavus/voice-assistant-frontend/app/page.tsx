/* eslint-disable jsx-a11y/anchor-is-valid */
"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { useTranslation } from "@/components/i18n/TranslationProvider";
import { CommunityConnectorCard } from "@/components/dashboard/CommunityConnectorCard";
import { IntegrationHubMap } from "@/components/dashboard/IntegrationHubMap";
import { StoryCreator } from "@/components/dashboard/StoryCreator";
import { ImpactWalletSummary } from "@/components/dashboard/ImpactWalletSummary";
import { SkillPassportSummary } from "@/components/dashboard/SkillPassportSummary";
import DataProtectionPanel from "@/components/DataProtectionPanel";
import { useUserProfile } from "@/context/UserProfileContext";
import { AISuggestionFeed } from "@/components/dashboard/AISuggestionFeed";

type TabKey = "explore" | "create";

const quickPrompts = [
  { id: "prompt-events", label: "Show events this week", icon: "📅" },
  { id: "prompt-resources", label: "Find resources near me", icon: "📍" },
  { id: "prompt-admin", label: "How do I register my address?", icon: "🏠" },
  { id: "prompt-buddy", label: "Connect me to a peer circle", icon: "🤝" },
];

export default function Page() {
  const { t } = useTranslation();
  const { recordAction } = useUserProfile();
  const [room] = useState(() => new Room());
  const [activeTab, setActiveTab] = useState<TabKey>("explore");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabKey);
  };

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  const handlePromptClick = (promptId: string, label: string) => {
    recordAction({
      id: `${promptId}-${Date.now()}`,
      label: `Quick prompt: ${label}`,
      category: "voice",
      xp: 8,
      impactPoints: 6,
    });
    window.location.href = `/knuut-voice?prompt=${encodeURIComponent(label)}`;
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} onLearnFinnishClick={handleLearnFinnishClick} />

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
            {/* Top banner */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(340px, 1.3fr) minmax(220px, 0.7fr)",
                gap: 24,
                alignItems: "stretch",
              }}
            >
              <CommunityConnectorCard />
              <aside
                 style={{
                   borderRadius: 28,
                   padding: 26,
                   background: "radial-gradient(circle at top left, rgba(124,58,237,0.18), rgba(59,130,246,0.12) 45%, rgba(14,165,233,0.1) 100%)",
                   border: "1px solid rgba(148,163,184,0.25)",
                   boxShadow: "0 28px 48px rgba(59,130,246,0.24)",
                   display: "grid",
                   gap: 18,
                 }}
               >
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ display: "grid", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        aria-hidden
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #4f46e5, #ec4899)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: 18,
                          fontWeight: 700,
                          boxShadow: "0 12px 24px rgba(79,70,229,0.28)",
                        }}
                      >
                        AI
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", color: "#4c1d95" }}>
                        Ask Knuut Anything
                      </span>
                    </div>
                    <h2 style={{ margin: 0, fontSize: 21, fontWeight: 800, color: "#0f172a" }}>Your personal coach for life admin & ideas</h2>
                    <p style={{ margin: 0, color: "#334155", fontSize: 13.5, lineHeight: 1.55 }}>
                       Knuut reads your goals, skills, and city data. Ask for jobs, events, or help with documents and we update your Journey,
                       XP, and matches automatically.
                     </p>
                   </div>
                 </div>
                 <div
                   style={{
                     display: "grid",
                     marginTop: 4,
                     gap: 10,
                     gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                   }}
                 >
                   {quickPrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => handlePromptClick(prompt.id, prompt.label)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 16px",
                        borderRadius: 16,
                        border: "1px solid rgba(79,70,229,0.2)",
                        background: "rgba(255,255,255,0.92)",
                        fontWeight: 600,
                        color: "#1e293b",
                        cursor: "pointer",
                        boxShadow: "0 10px 20px rgba(124,58,237,0.12)",
                        minHeight: 72,
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{prompt.icon}</span>
                      <span style={{ textAlign: "left", lineHeight: 1.4 }}>{prompt.label}</span>
                    </button>
                  ))}
                </div>
                <a
                  href="/knuut-voice"
                  style={{
                    textDecoration: "none",
                    padding: "14px 18px",
                    borderRadius: 16,
                    background: "linear-gradient(135deg, #4338ca 0%, #7c3aed 45%, #ec4899 100%)",
                    color: "#fff",
                    fontWeight: 700,
                    textAlign: "center",
                    boxShadow: "0 22px 36px rgba(124,58,237,0.32)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                  }}
                >
                  <span aria-hidden>⚡</span>
                  Open live assistant
                </a>
              </aside>
                </div>

            {/* Tabs */}
            <nav
              aria-label="Dashboard sections"
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {(["explore", "create"] as TabKey[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleTabChange(tab)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 999,
                    border: "1px solid #cbd5f5",
                    background: activeTab === tab ? "linear-gradient(135deg, #2563eb, #7c3aed)" : "#fff",
                    color: activeTab === tab ? "#fff" : "#1e293b",
                    fontWeight: 700,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  {tab === "explore" ? `${t("explore")} roadmap` : "Create & share"}
                </button>
              ))}
            </nav>

            {/* Tab content */}
            {activeTab === "explore" ? (
              <div style={{ display: "grid", gap: 24 }}>
                <AISuggestionFeed />
                <IntegrationHubMap />
                <ImpactWalletSummary />
                <SkillPassportSummary />
                <DataProtectionPanel />
              </div>
            ) : (
              <div style={{ display: "grid", gap: 24 }}>
                <StoryCreator />
                <ImpactWalletSummary />
                <SkillPassportSummary />
                <DataProtectionPanel />
              </div>
            )}
            </div>
        </main>
            </div>
    </RoomContext.Provider>
  );
}

