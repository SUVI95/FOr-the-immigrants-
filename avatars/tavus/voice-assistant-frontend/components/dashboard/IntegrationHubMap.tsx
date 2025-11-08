"use client";

import { useMemo } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

type HubCategory = "Language" | "Jobs" | "Volunteering" | "Community" | "Mentoring";

type Hub = {
  id: string;
  name: string;
  description: string;
  address: string;
  categories: HubCategory[];
  coordinates: { xPercent: number; yPercent: number };
  xpReward: number;
};

const HUBS: Hub[] = [
  {
    id: "kajaani-library",
    name: "Kajaani Integration Corner",
    description: "Walk-in coaching for paperwork, language practice and student support.",
    address: "Pohjolankatu 13, 87100 Kajaani",
    categories: ["Language", "Community", "Mentoring"],
    coordinates: { xPercent: 58, yPercent: 42 },
    xpReward: 20,
  },
  {
    id: "dvv-pop-up",
    name: "DVV & Kela Pop-up",
    description: "Official advisors help with registration, benefits, and questions about forms.",
    address: "Pohjolankatu 14, City Hall Lobby",
    categories: ["Jobs", "Community"],
    coordinates: { xPercent: 62, yPercent: 48 },
    xpReward: 25,
  },
  {
    id: "kajaani-business-hub",
    name: "Business & Tech Hub",
    description: "Mentors for job search, networking events, startup clinics and CV reviews.",
    address: "Seminaarikatu 4, 2nd floor",
    categories: ["Jobs", "Mentoring"],
    coordinates: { xPercent: 50, yPercent: 30 },
    xpReward: 35,
  },
  {
    id: "community-kitchen",
    name: "Community Kitchen",
    description: "Cooking clubs, family support circles, and welcome dinners.",
    address: "Painekatu 2, Kajaani",
    categories: ["Volunteering", "Community"],
    coordinates: { xPercent: 30, yPercent: 60 },
    xpReward: 30,
  },
  {
    id: "youth-house",
    name: "Youth House Peer Circles",
    description: "Weekly youth-led meetups, coding club, and language tandem nights.",
    address: "Kalliokatu 3, Kajaani",
    categories: ["Community", "Mentoring"],
    coordinates: { xPercent: 70, yPercent: 35 },
    xpReward: 28,
  },
];

const CATEGORY_COLORS: Record<HubCategory, string> = {
  Language: "#38bdf8",
  Jobs: "#f97316",
  Volunteering: "#22c55e",
  Community: "#6366f1",
  Mentoring: "#ec4899",
};

export function IntegrationHubMap() {
  const {
    state: { actionHistory },
    recordAction,
  } = useUserProfile();

  const visitedHubIds = useMemo(
    () =>
      Object.values(actionHistory)
        .filter((entry) => entry.id.startsWith("hub-visit"))
        .map((entry) => entry.id.split("::")[1]),
    [actionHistory],
  );

  return (
    <section
      aria-labelledby="integration-hub-map"
      style={{
        borderRadius: 20,
        padding: 24,
        background: "#fff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
        display: "grid",
        gridTemplateColumns: "minmax(240px, 1fr) minmax(320px, 1.2fr)",
        gap: 24,
      }}
    >
      <div>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.4, color: "#475569" }}>
          Integration Hubs
        </p>
        <h2 id="integration-hub-map" style={{ margin: "6px 0 0 0", fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
          Find local supporters
        </h2>
        <p style={{ color: "#475569", marginTop: 12, lineHeight: 1.6 }}>
          Drop by any hub to log verified support, access services, and meet connectors. Tap a pin to add it to your Impact Wallet and route it into My Pathway.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
            <span
              key={category}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: 999,
                background: `${color}20`,
                color,
                border: `1px solid ${color}60`,
              }}
            >
              {category}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          background: "linear-gradient(160deg, #bae6fd 0%, #dbeafe 45%, #e0f2fe 100%)",
          border: "1px solid #c4d4f8",
          minHeight: 320,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(96,165,250,0.25), transparent 40%), radial-gradient(circle at 80% 70%, rgba(59,130,246,0.25), transparent 42%)",
            pointerEvents: "none",
          }}
        />
        {HUBS.map((hub) => {
          const visited = visitedHubIds.includes(hub.id);
          return (
            <button
              key={hub.id}
              type="button"
              onClick={() =>
                recordAction({
                  id: `hub-visit::${hub.id}`,
                  label: `Checked in at ${hub.name}`,
                  category: "tools",
                  xp: hub.xpReward,
                  impactPoints: Math.round(hub.xpReward * 1.1),
                  impactHours: 0.5,
                  skill: {
                    id: `hub-skill-${hub.id}`,
                    title: `${hub.categories[0]} engagement: ${hub.name}`,
                    category: "Community",
                    details: hub.description,
                    source: "system",
                  },
                  reminder: {
                    title: `Follow up with ${hub.name}`,
                    dueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                    channel: "email",
                  },
                })
              }
              style={{
                position: "absolute",
                left: `${hub.coordinates.xPercent}%`,
                top: `${hub.coordinates.yPercent}%`,
                transform: "translate(-50%, -50%)",
                padding: 0,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: visited ? "#16a34a" : "#2563eb",
                  border: visited ? "3px solid rgba(34,197,94,0.35)" : "3px solid rgba(37, 99, 235, 0.35)",
                  boxShadow: visited ? "0 0 0 8px rgba(34,197,94,0.18)" : "0 0 0 8px rgba(59,130,246,0.20)",
                }}
              />
              <div
                style={{
                  marginTop: 10,
                  minWidth: 200,
                  textAlign: "left",
                  background: "rgba(255,255,255,0.92)",
                  borderRadius: 16,
                  padding: "14px 16px",
                  border: "1px solid rgba(15, 23, 42, 0.1)",
                  boxShadow: "0 12px 22px rgba(15, 23, 42, 0.12)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{hub.name}</h3>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#2563eb",
                      textTransform: "uppercase",
                    }}
                  >
                    +{hub.xpReward} XP
                  </span>
                </div>
                <p style={{ margin: "8px 0 6px 0", fontSize: 13, color: "#475569" }}>{hub.description}</p>
                <p style={{ margin: "0 0 10px 0", fontSize: 12, color: "#334155", opacity: 0.85 }}>{hub.address}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {hub.categories.map((category) => (
                    <span
                      key={category}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: 999,
                        background: `${CATEGORY_COLORS[category]}20`,
                        color: CATEGORY_COLORS[category],
                        border: `1px solid ${CATEGORY_COLORS[category]}40`,
                      }}
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: visited ? "#16a34a" : "#2563eb", fontWeight: 600 }}>
                  {visited ? "Logged to Impact Wallet" : "Log visit & earn XP"}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default IntegrationHubMap;


