"use client";

import { useMemo, useState } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

type HubCategory = "Language" | "Jobs" | "Volunteering" | "Community" | "Mentoring";

type Hub = {
  id: string;
  name: string;
  description: string;
  summary: string;
  categories: HubCategory[];
  coordinates: { xPercent: number; yPercent: number };
  xpReward: number;
};

const HUBS: Hub[] = [
  {
    id: "kajaani-corner",
    name: "Integration Corner",
    description: "Help with forms, services, and daily questions.",
    summary: "Help with paperwork and services",
    categories: ["Community", "Language"],
    coordinates: { xPercent: 58, yPercent: 42 },
    xpReward: 20,
  },
  {
    id: "community-kitchen",
    name: "Community Kitchen",
    description: "Learn Finnish by cooking together.",
    summary: "Learn Finnish while cooking",
    categories: ["Language", "Community"],
    coordinates: { xPercent: 30, yPercent: 60 },
    xpReward: 30,
  },
  {
    id: "tech-hub",
    name: "Tech Hub",
    description: "Basic coding practice and job mentoring.",
    summary: "Basic coding & job mentoring",
    categories: ["Jobs", "Mentoring"],
    coordinates: { xPercent: 70, yPercent: 35 },
    xpReward: 32,
  },
];

type MapEvent = {
  id: string;
  title: string;
  time: string;
  location: string;
  description: string;
  coordinates: { xPercent: number; yPercent: number };
};

const MAP_EVENTS: MapEvent[] = [
  {
    id: "event-language-cafe",
    title: "Finnish Language Café",
    time: "Tonight · 18:00",
    location: "Community Kitchen",
    description: "Friendly conversation practice with Mika and local mentors.",
    coordinates: { xPercent: 32, yPercent: 62 },
  },
  {
    id: "event-tech-meet",
    title: "Newcomer Tech Meet",
    time: "Thu · 16:00",
    location: "Tech Hub",
    description: "Hybrid shadow day with coding demos and mentor pairing.",
    coordinates: { xPercent: 68, yPercent: 36 },
  },
];

const MAP_BACKGROUND_IMAGE = (() => {
  const svg = `
    <svg width="800" height="420" viewBox="0 0 800 420" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#eef2ff" />
          <stop offset="100%" stop-color="#dbeafe" />
        </linearGradient>
      </defs>
      <rect width="800" height="420" fill="url(#bg)" rx="24" />
      <path d="M60 340 C180 280, 280 320, 420 250 C560 180, 620 160, 740 120" stroke="#bfdbfe" stroke-width="22" fill="none" stroke-linecap="round" opacity="0.6"/>
      <circle cx="620" cy="150" r="70" fill="#c7d2fe" opacity="0.5"/>
      <circle cx="240" cy="220" r="45" fill="#c4b5fd" opacity="0.45"/>
      <path d="M140 120 C180 200, 220 240, 180 320" stroke="#fde68a" stroke-width="14" fill="none" opacity="0.6"/>
    </svg>
  `;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
})();

export function LocalHelpPreview() {
  const { recordAction } = useUserProfile();
  const [selectedId, setSelectedId] = useState<string>(HUBS[0].id);

  const selectedHub = useMemo(() => HUBS.find((hub) => hub.id === selectedId) ?? HUBS[0], [selectedId]);

  const handleViewMap = () => {
    recordAction({
      id: `view-hub-map-${Date.now()}`,
      label: "Opened map from local help preview",
      category: "resources",
      xp: 6,
      impactPoints: 4,
    });
    window.location.href = "/resources";
  };

  return (
    <section
      aria-labelledby="local-help-preview"
      style={{
        borderRadius: 22,
        padding: 24,
        background: "#fff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 16px 32px rgba(15,23,42,0.08)",
        display: "grid",
        gap: 20,
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", color: "#475569", fontWeight: 700 }}>
            Find local help
          </p>
          <h2 id="local-help-preview" style={{ margin: "6px 0 0 0", fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
            Explore nearby hubs where you can learn, meet, or get support.
          </h2>
        </div>
        <button
          type="button"
          onClick={handleViewMap}
          style={{
            padding: "10px 16px",
            borderRadius: 12,
            border: "1px solid #cbd5f5",
            background: "#f8fafc",
            color: "#1d4ed8",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Open map
        </button>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(220px, 1fr) minmax(280px, 1.2fr)",
          gap: 20,
        }}
      >
        <div style={{ display: "grid", gap: 12 }}>
          {HUBS.map((hub) => (
            <button
              key={hub.id}
              type="button"
              onClick={() => setSelectedId(hub.id)}
              style={{
                textAlign: "left",
                padding: "14px",
                borderRadius: 16,
                border: hub.id === selectedId ? "1px solid rgba(59,130,246,0.45)" : "1px solid rgba(148,163,184,0.25)",
                background: hub.id === selectedId ? "rgba(59,130,246,0.12)" : "rgba(248,250,252,0.8)",
                color: "#1f2937",
                cursor: "pointer",
                display: "grid",
                gap: 6,
                boxShadow: hub.id === selectedId ? "0 12px 24px rgba(59,130,246,0.18)" : "none",
              }}
            >
              <strong style={{ fontSize: 15 }}>{hub.name}</strong>
              <span style={{ fontSize: 13.5, color: "#475569" }}>{hub.summary}</span>
              <span style={{ fontSize: 12, color: "#6366f1", fontWeight: 600 }}>+{hub.xpReward} XP</span>
            </button>
          ))}
        </div>

        <div
          style={{
            position: "relative",
            borderRadius: 20,
            overflow: "hidden",
            backgroundImage: MAP_BACKGROUND_IMAGE,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: 260,
            border: "1px solid #dbeafe",
          }}
        >
          {HUBS.map((hub) => (
            <button
              key={`${hub.id}-pin`}
              type="button"
              onClick={() => setSelectedId(hub.id)}
              style={{
                position: "absolute",
                top: `${hub.coordinates.yPercent}%`,
                left: `${hub.coordinates.xPercent}%`,
                transform: "translate(-50%, -50%)",
                width: 18,
                height: 18,
                borderRadius: "50%",
                border: hub.id === selectedId ? "3px solid #4338ca" : "3px solid #38bdf8",
                background: "#fff",
                cursor: "pointer",
                boxShadow: "0 8px 16px rgba(15,23,42,0.2)",
              }}
              aria-label={hub.name}
            />
          ))}

          {MAP_EVENTS.map((event) => (
            <div
              key={event.id}
              style={{
                position: "absolute",
                top: `${event.coordinates.yPercent}%`,
                left: `${event.coordinates.xPercent}%`,
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  background: "#ec4899",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 8px",
                  borderRadius: 999,
                  boxShadow: "0 8px 16px rgba(236,72,153,0.3)",
                }}
              >
                {event.title}
              </div>
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#ec4899",
                  boxShadow: "0 8px 16px rgba(236,72,153,0.25)",
                }}
              />
            </div>
          ))}

          {selectedHub && (
             <div
               style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                width: 220,
                borderRadius: 18,
                background: "rgba(15,23,42,0.9)",
                color: "#f8fafc",
                padding: "16px",
                display: "grid",
                gap: 8,
                boxShadow: "0 16px 36px rgba(15,23,42,0.25)",
               }}
             >
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: 15 }}>{selectedHub.name}</strong>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#38bdf8" }}>+{selectedHub.xpReward} XP</span>
               </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>{selectedHub.description}</p>
            </div>
          )}

          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              borderRadius: 18,
              background: "rgba(15,23,42,0.9)",
              color: "#f8fafc",
              padding: 16,
              width: 220,
              display: "grid",
              gap: 6,
              boxShadow: "0 16px 36px rgba(15,23,42,0.25)",
            }}
          >
            <span style={{ fontSize: 12, letterSpacing: 0.4, textTransform: "uppercase", fontWeight: 700, color: "#38bdf8" }}>
              Happening nearby
            </span>
            <strong style={{ fontSize: 15 }}>{MAP_EVENTS[0].title}</strong>
            <span style={{ fontSize: 12, opacity: 0.85 }}>{MAP_EVENTS[0].time} · {MAP_EVENTS[0].location}</span>
            <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5 }}>{MAP_EVENTS[0].description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LocalHelpPreview;
