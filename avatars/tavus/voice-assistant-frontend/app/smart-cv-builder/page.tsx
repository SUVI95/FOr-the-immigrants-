"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import CVTemplate from "@/components/CVTemplate";
import { useTranslation } from "@/components/i18n/TranslationProvider";
import { useUserProfile } from "@/context/UserProfileContext";

export default function SmartCVBuilderPage() {
  const { t } = useTranslation();
  const { state: userState } = useUserProfile();
  const [activeTab, setActiveTab] = useState("smart-cv-builder");
  const [room] = useState(new Room());
  const [language, setLanguage] = useState<"en" | "fi">("en");

  const communityExperience = userState.impactWallet.transactions
    .filter((txn) => txn.category === "volunteer" || txn.type === "task")
    .slice(0, 3)
    .map((txn) => ({
      role: txn.description,
      organization: "Knuut AI Community",
      period: new Date(txn.createdAt).getFullYear().toString(),
      impact: `Contributed via ${txn.category ?? "community"} · ${txn.pointsChange ?? 0} impact points earned.`,
      hours: txn.hoursChange ?? 0,
      badges: txn.type === "badge" ? ["Connector Badge"] : undefined,
    }));

  const skillList =
    userState.skillPassport.entries.length > 0
      ? Array.from(new Set(userState.skillPassport.entries.map((entry) => entry.title))).slice(0, 10)
      : ["Cross-cultural facilitation", "Finnish A1 phrases", "Peer mentoring"];

  const languageEntries =
    userState.skillPassport.entries
      .filter((entry) => entry.category.toLowerCase().includes("language"))
      .map((entry) => ({
        language: entry.title.replace(/Finnish|Language|Level/gi, "").trim() || "Finnish",
        level: entry.details?.match(/A1|A2|B1|B2|C1|C2/)?.[0] ?? "B1",
      })) || [];

  const initialCvData = {
    name: userState.name || "Your Name",
    email: userState.email || "your.email@example.com",
    phone: userState.phone || "+358 50 123 4567",
    address: userState.address || "Helsinki, Finland",
    summary: `Community Connector (${userState.level}) with ${userState.impactWallet.volunteeringHours.toFixed(
      1,
    )} volunteering hours and ${userState.impactWallet.points} impact points on Knuut AI. Builds welcoming spaces, translates bureaucracy, and mentors newcomers.`,
    experience: [
      {
        title: "Community Connector (Volunteer)",
        company: "Knuut AI Civic Platform",
        period: "2024 - Present",
        description: `Supports ${userState.peopleHelpedThisWeek + userState.contributionsThisMonth} newcomers each month through events, buddy sessions, and integration coaching.`,
      },
    ],
    skills: skillList,
    languages:
      languageEntries.length > 0
        ? languageEntries
        : [
            { language: "Finnish", level: "A2" },
            { language: "English", level: "C1" },
          ],
    community: communityExperience.length > 0 ? communityExperience : [],
  };

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLearnFinnishClick={handleLearnFinnishClick} />

        <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px", background: "#fafafa", minHeight: "100vh" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: 800,
                background: "linear-gradient(135deg, #64748b 0%, #111827 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0,
              }}
            >
              Smart CV Builder
            </h1>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label style={{ color: "#374151", fontSize: 14 }}>{t("language") ?? "Language"}</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "fi")}
                style={{ padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8 }}
              >
                <option value="en">English</option>
                <option value="fi">Suomi</option>
              </select>
              <button
                onClick={() => {
                  // Trigger the PDF download from CVTemplate
                  const downloadBtn = document.querySelector('.btn.primary') as HTMLButtonElement;
                  if (downloadBtn) {
                    downloadBtn.click();
                  }
                }}
                style={{
                  padding: "10px 14px",
                  background: "#111827",
                  color: "white",
                  borderRadius: 8,
                  border: "none",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Download PDF
              </button>
            </div>
          </div>

          <CVTemplate language={language} initialData={initialCvData} />
        </main>
      </div>
    </RoomContext.Provider>
  );
}
