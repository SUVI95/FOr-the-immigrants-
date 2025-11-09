"use client";

import { useEffect, useMemo, useState } from "react";
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

const LAT_RANGE = {
  min: Math.min(...HUBS.map((hub) => hub.coordinates.yPercent)),
  max: Math.max(...HUBS.map((hub) => hub.coordinates.yPercent)),
};
const LNG_RANGE = {
  min: Math.min(...HUBS.map((hub) => hub.coordinates.xPercent)),
  max: Math.max(...HUBS.map((hub) => hub.coordinates.xPercent)),
};

const MAP_BACKGROUND_IMAGE = (() => {
  const svg = `
    <svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#edf4fb"/>
          <stop offset="100%" stop-color="#d9e8f8"/>
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#c7ddf6" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#a9c8ef" stop-opacity="0.9"/>
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="url(#bg)" rx="32"/>
      <path d="M50 80 L250 100 L350 140 L520 130 L700 150" stroke="#b8cbe4" stroke-width="20" stroke-linecap="round" fill="none" opacity="0.75"/>
      <path d="M140 420 C220 340, 330 360, 460 280 C590 200, 640 160, 700 100" stroke="#fddc9c" stroke-width="18" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M60 260 L180 230 L260 240 L360 200 L520 210 L680 180" stroke="#f9c77d" stroke-width="12" stroke-linecap="round" fill="none" opacity="0.85"/>
      <path d="M120 110 C180 160, 220 210, 200 280 C180 340, 120 380, 80 420" stroke="#b9d4fa" stroke-width="14" stroke-linecap="round" fill="none" opacity="0.65"/>
      <circle cx="620" cy="120" r="90" fill="url(#water)" opacity="0.9"/>
      <path d="M40 460 L120 360 L200 330 L320 340 L420 310 L540 320 L650 280 L760 260" stroke="#c4d7f1" stroke-width="9" stroke-linecap="round" fill="none" opacity="0.6"/>
      <circle cx="280" cy="150" r="36" fill="#c6daf5" opacity="0.7"/>
      <circle cx="480" cy="340" r="28" fill="#c6daf5" opacity="0.65"/>
      <circle cx="200" cy="380" r="24" fill="#c6daf5" opacity="0.55"/>
      <path d="M180 120 L220 200 L330 240 L420 220" stroke="#dfe6f2" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M540 380 L620 320 L700 340" stroke="#dfe6f2" stroke-width="6" stroke-linecap="round" fill="none"/>
    </svg>
  `;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
})();

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
  const [selectedHubId, setSelectedHubId] = useState<string | null>(HUBS[0]?.id ?? null);
  useEffect(() => {
    if (!selectedHubId && HUBS.length > 0) {
      setSelectedHubId(HUBS[0].id);
    }
  }, [selectedHubId]);
  const selectedHub = useMemo(
    () => HUBS.find((hub) => hub.id === selectedHubId) ?? HUBS[0] ?? null,
    [selectedHubId],
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
          Find Local Help
        </p>
        <h2 id="integration-hub-map" style={{ margin: "6px 0 0 0", fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
          Tap to meet mentors, learn skills, or get practical support.
        </h2>
        <p style={{ color: "#475569", marginTop: 12, lineHeight: 1.6 }}>
          Knuut highlights hubs where you can sort paperwork, build Finnish skills, or meet employers face-to-face.
        </p>
        <ul style={{ margin: "14px 0 0 18px", padding: 0, color: "#475569", display: "grid", gap: 8, fontSize: 14.5 }}>
          <li>🏠 Kajaani Integration Corner — help with forms & daily questions.</li>
          <li>🍳 Community Kitchen — practice Finnish while cooking together.</li>
          <li>💻 Tech Hub — learn coding basics and meet hiring teams.</li>
        </ul>
        <button
          type="button"
          onClick={() => setSelectedHubId(HUBS[0]?.id ?? null)}
          style={{
            marginTop: 16,
            padding: "10px 16px",
            borderRadius: 12,
            border: "1px solid #cbd5f5",
            background: "#eff6ff",
            color: "#1d4ed8",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Open map of hubs
        </button>
      </div>

      <div
        style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          backgroundColor: "#dbeafe",
          backgroundImage: MAP_BACKGROUND_IMAGE,
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "1px solid #c4d4f8",
          minHeight: 320,
          padding: 12,
          boxShadow: "0 20px 40px rgba(15,23,42,0.18), inset 0 0 24px rgba(15,23,42,0.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
            position: "absolute",
            top: 14,
            left: 14,
            right: 14,
            zIndex: 2,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 600,
              color: "#0f172a",
              background: "rgba(255,255,255,0.85)",
              padding: "6px 12px",
              borderRadius: 999,
            }}
          >
            Tap a pin to add it to your Journey
          </p>
        </div>

        {HUBS.map((hub) => {
          const visited = visitedHubIds.includes(hub.id);
          const isSelected = hub.id === selectedHubId;
          const left = ((hub.coordinates.xPercent - LNG_RANGE.min) / (LNG_RANGE.max - LNG_RANGE.min)) * 100;
          const top = ((hub.coordinates.yPercent - LAT_RANGE.min) / (LAT_RANGE.max - LAT_RANGE.min)) * 100;
          return (
            <button
              key={hub.id}
              type="button"
              onClick={() => {
                setSelectedHubId(hub.id);
                if (!visited) {
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
                  });
                }
              }}
              style={{
                position: "absolute",
                left: `${left}%`,
                top: `${top}%`,
                transform: isSelected ? "translate(-50%, -50%) scale(1.05)" : "translate(-50%, -50%)",
                padding: 0,
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                zIndex: isSelected ? 4 : 3,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: visited ? "#15803d" : "#2563eb",
                  border: isSelected ? "4px solid rgba(37, 99, 235, 0.65)" : visited ? "3px solid rgba(34,197,94,0.35)" : "3px solid rgba(59,130,246,0.35)",
                  boxShadow: isSelected
                    ? "0 0 0 10px rgba(59,130,246,0.22)"
                    : visited
                      ? "0 0 0 8px rgba(34,197,94,0.18)"
                      : "0 0 0 8px rgba(59,130,246,0.18)",
                }}
              />
              <span
                style={{
                  marginTop: 10,
                  display: "inline-flex",
                  padding: "4px 10px",
                  borderRadius: 8,
                  background: "rgba(15, 23, 42, 0.7)",
                  color: "#f8fafc",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: 0.3,
                  boxShadow: "0 8px 16px rgba(15,23,42,0.18)",
                }}
              >
                {hub.name}
              </span>
            </button>
          );
        })}

        {selectedHub && (
          <div
            style={{
              position: "absolute",
              bottom: 18,
              left: 18,
              background: "rgba(15,23,42,0.88)",
              color: "#f8fafc",
              borderRadius: 14,
              padding: "12px 14px",
              maxWidth: 220,
              boxShadow: "0 16px 28px rgba(15,23,42,0.36)",
              border: "1px solid rgba(148,163,184,0.35)",
              zIndex: 6,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{selectedHub.name}</h3>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#38bdf8" }}>+{selectedHub.xpReward} XP</span>
            </div>
            <p style={{ margin: "0 0 6px 0", fontSize: 11.5, lineHeight: 1.5 }}>{selectedHub.description}</p>
            <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 8 }}>{selectedHub.address}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {selectedHub.categories.map((category) => (
                <span
                  key={category}
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "3px 7px",
                    borderRadius: 999,
                    background: `${CATEGORY_COLORS[category]}25`,
                    color: CATEGORY_COLORS[category],
                    border: `1px solid ${CATEGORY_COLORS[category]}55`,
                  }}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default IntegrationHubMap;

