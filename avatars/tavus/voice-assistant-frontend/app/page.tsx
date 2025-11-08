/* eslint-disable jsx-a11y/anchor-is-valid */
"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { useTranslation } from "@/components/i18n/TranslationProvider";
import { CommunityConnectorCard } from "@/components/dashboard/CommunityConnectorCard";
import { MyPathwayMap } from "@/components/dashboard/MyPathwayMap";
import { IntegrationHubMap } from "@/components/dashboard/IntegrationHubMap";
import { StoryCreator } from "@/components/dashboard/StoryCreator";
import { ImpactWalletSummary } from "@/components/dashboard/ImpactWalletSummary";
import { SkillPassportSummary } from "@/components/dashboard/SkillPassportSummary";
import DataProtectionPanel from "@/components/DataProtectionPanel";
import { useUserProfile } from "@/context/UserProfileContext";

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
                gridTemplateColumns: "minmax(320px, 1.2fr) minmax(220px, 0.8fr)",
                gap: 24,
                alignItems: "stretch",
                flexWrap: "wrap",
              }}
            >
              <CommunityConnectorCard />
              <aside
                style={{
                  borderRadius: 20,
                  padding: 24,
                  background: "linear-gradient(135deg, #eef2ff, #e0f2fe)",
                  border: "1px solid #cbd5f5",
                  boxShadow: "0 18px 28px rgba(59,130,246,0.18)",
                  display: "grid",
                  gap: 16,
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: 1.3, textTransform: "uppercase", color: "#4338ca" }}>
                    Knuut AI Voice
                  </p>
                  <h2 style={{ margin: "6px 0 8px 0", fontSize: 22, fontWeight: 800, color: "#1e293b" }}>24/7 Life Admin helper</h2>
                  <p style={{ margin: 0, color: "#475569" }}>
                    Ask anything about registration, jobs, events or Finnish phrases. Your prompts feed the Connector Progress bar.
                  </p>
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => handlePromptClick(prompt.id, prompt.label)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 14px",
                        borderRadius: 12,
                        border: "1px solid #cbd5f5",
                        background: "#fff",
                        fontWeight: 600,
                        color: "#1e293b",
                        cursor: "pointer",
                      }}
                    >
                      <span>{prompt.icon}</span>
                      <span>{prompt.label}</span>
                    </button>
                  ))}
                </div>
                <a
                  href="/knuut-voice"
                  style={{
                    textDecoration: "none",
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #4338ca, #7c3aed)",
                    color: "#fff",
                    fontWeight: 700,
                    textAlign: "center",
                    boxShadow: "0 14px 24px rgba(124,58,237,0.28)",
                  }}
                >
                  Open live assistant →
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
                <MyPathwayMap />
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

