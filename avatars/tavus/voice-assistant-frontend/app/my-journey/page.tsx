"use client";

import { useMemo, useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import ImpactWalletSummary from "@/components/dashboard/ImpactWalletSummary";
import DataProtectionPanel from "@/components/DataProtectionPanel";
import { useUserProfile } from "@/context/UserProfileContext";
import { MyPathwayMap } from "@/components/dashboard/MyPathwayMap";
import { SkillPassportSummary } from "@/components/dashboard/SkillPassportSummary";
import { RetentionTracker } from "@/components/RetentionTracker";
import { ImpactDashboard } from "@/components/ImpactDashboard";

type CoachSuggestion = {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium";
  xp: number;
  points: number;
};

const SUGGESTIONS: CoachSuggestion[] = [
  {
    id: "coach-events",
    title: "Attend an Integration Café this week",
    description: "Meet two newcomers, share your experience, and log it to your Skill Passport.",
    impact: "high",
    xp: 35,
    points: 28,
  },
  {
    id: "coach-buddy",
    title: "Check in with your buddy",
    description: "Send a message or schedule a quick video call to keep motivation high.",
    impact: "medium",
    xp: 20,
    points: 18,
  },
  {
    id: "coach-story",
    title: "Share a quick My Finnish Story update",
    description: "Write a 3-sentence reflection. Helps mentors spot who needs support.",
    impact: "medium",
    xp: 18,
    points: 15,
  },
];

export default function MyJourneyPage() {
  const [room] = useState(new Room());
  const { state: userState, recordAction } = useUserProfile();
  const [activeTab, setActiveTab] = useState("my-journey");
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set());

  const pendingSuggestions = useMemo(
    () => SUGGESTIONS.filter((suggestion) => !acknowledged.has(suggestion.id)),
    [acknowledged],
  );

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  const handleCoachComplete = (suggestion: CoachSuggestion) => {
    setAcknowledged((prev) => new Set(prev).add(suggestion.id));
    recordAction({
      id: `coach-${suggestion.id}-${Date.now()}`,
      label: `Completed Journey coaching suggestion: ${suggestion.title}`,
      category: "journey",
      xp: suggestion.xp,
      impactPoints: suggestion.points,
      impactHours: 0.5,
      reminder: {
        title: `Check back on: ${suggestion.title}`,
        dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        channel: "in-app",
      },
    });
  };

  const handleAdminExport = () => {
    recordAction({
      id: `journey-admin-export-${Date.now()}`,
      label: "Generated anonymized journey analytics export",
      category: "journey",
      xp: 12,
      impactPoints: 0,
    });
    alert("An anonymized CSV has been queued for the Analytics Dashboard.");
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLearnFinnishClick={handleLearnFinnishClick} />

        <main
          style={{
            flex: 1,
            padding: "40px 28px",
            background: "#f8fafc",
            minHeight: "100vh",
            overflowY: "auto",
            display: "grid",
            gap: 28,
          }}
        >
          <header
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              background: "#fff",
              borderRadius: 20,
              padding: 24,
              border: "1px solid #e2e8f0",
              boxShadow: "0 16px 32px rgba(15,23,42,0.08)",
            }}
          >
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.3, color: "#475569" }}>
              Profile & Progress
            </p>
            <h1 style={{ margin: 0, fontSize: "2.5rem", fontWeight: 800, color: "#0f172a" }}>My Journey dashboard</h1>
            <p style={{ margin: 0, fontSize: 15, color: "#475569", lineHeight: 1.6 }}>
              Track every action you’ve taken. XP, badges, volunteering hours, and AI nudges update here instantly — feeding your Skill
              Passport and Community Connector progress.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5f5",
                  background: "rgba(59,130,246,0.12)",
                  fontWeight: 700,
                  color: "#1d4ed8",
                }}
              >
                Badges: {userState.impactWallet.badges.length}
              </div>
              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: 12,
                  border: "1px solid #bbf7d0",
                  background: "rgba(34,197,94,0.12)",
                  fontWeight: 700,
                  color: "#166534",
                }}
              >
                Hours logged: {userState.impactWallet.volunteeringHours.toFixed(1)}
              </div>
            </div>
          </header>

          <MyPathwayMap />
          <ImpactWalletSummary />
          <SkillPassportSummary />
          <ImpactDashboard />
          <RetentionTracker />
          <section
            style={{
              borderRadius: 20,
              padding: 24,
              background: "#fff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 14px 28px rgba(15,23,42,0.08)",
              display: "grid",
              gap: 18,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.3, color: "#475569" }}>
                  AI Journey Coach
                </p>
                <h2 style={{ margin: "6px 0 0 0", fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
                  Personalized nudges to grow your impact
                </h2>
              </div>
              <div
                style={{
                  borderRadius: 12,
                  border: "1px solid #fde68a",
                  background: "#fef9c3",
                  padding: "10px 16px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#92400e",
                }}
              >
                {pendingSuggestions.length} tasks pending
              </div>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {pendingSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  style={{
                    borderRadius: 16,
                    padding: 18,
                    border: "1px solid #e2e8f0",
                    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                    display: "grid",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{suggestion.title}</h3>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        border: "1px solid #cbd5f5",
                        background: suggestion.impact === "high" ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.05)",
                        color: "#1d4ed8",
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {suggestion.impact === "high" ? "High impact" : "Medium impact"}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: "#475569" }}>{suggestion.description}</p>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#22c55e" }}>+{suggestion.points} pts</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#4338ca" }}>+{suggestion.xp} XP</span>
                    <button
                      type="button"
                      onClick={() => handleCoachComplete(suggestion)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 12,
                        border: "1px solid #22c55e",
                        background: "rgba(34,197,94,0.12)",
                        color: "#166534",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Mark done
                    </button>
                  </div>
                </div>
              ))}
              {pendingSuggestions.length === 0 && (
                <div
                  style={{
                    padding: 16,
                    borderRadius: 16,
                    border: "1px dashed #cbd5f5",
                    background: "#f8fafc",
                    textAlign: "center",
                    color: "#475569",
                    fontWeight: 600,
                  }}
                >
                  You&apos;re up to date! New journey nudges will appear after your next activity.
                </div>
              )}
            </div>
          </section>

          <section
            style={{
              borderRadius: 20,
              padding: 24,
              background: "#fff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
            }}
          >
            <h2 style={{ margin: "0 0 12px 0", fontSize: 20, fontWeight: 800, color: "#0f172a" }}>Partner reporting</h2>
            <p style={{ margin: "0 0 16px 0", color: "#475569", lineHeight: 1.6 }}>
              Need to report anonymized metrics to a municipality or NGO partner? Generate a secure export with volunteer hours,
              participation rate, and badge distribution. Personally identifiable information is stripped out automatically.
            </p>
            <button
              type="button"
              onClick={handleAdminExport}
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                border: "1px solid #4338ca",
                background: "linear-gradient(135deg, #4338ca, #6366f1)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Generate anonymized export
            </button>
          </section>

          <DataProtectionPanel />
        </main>
      </div>
    </RoomContext.Provider>
  );
}
