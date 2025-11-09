"use client";

import { useMemo, useState } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

type Suggestion = {
  id: string;
  type: "people" | "company" | "job" | "course";
  title: string;
  description: string;
  actionLabel: string;
  xpReward: number;
  meta: string;
};

const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: "cook-network",
    type: "people",
    title: "3 community cooks near you",
    description: "Swap recipes, talk kitchen shifts, and hear how they landed local jobs this month.",
    actionLabel: "Connect now (+25 XP)",
    xpReward: 25,
    meta: "Kajaani · Finnish + English",
  },
  {
    id: "language-buddy",
    type: "people",
    title: "Finnish practice partner",
    description: "Mika hosts an evening café session focused on service phrases you’ll need at work.",
    actionLabel: "Schedule a chat",
    xpReward: 20,
    meta: "Online · Tonight 18:30",
  },
  {
    id: "restaurant-visit",
    type: "company",
    title: "Kajaani Bistro is open for visits",
    description: "Kitchen tour + practice shift on Friday. Perfect next move after your Food Service track.",
    actionLabel: "Book visit (+45 XP)",
    xpReward: 45,
    meta: "Visit window: Fri 14:00–17:00",
  },
  {
    id: "tech-cohort",
    type: "company",
    title: "City Innovation Hub shadow day",
    description: "Hybrid open day to watch real product teams and meet volunteer mentors.",
    actionLabel: "Reserve my spot",
    xpReward: 35,
    meta: "Hybrid · Thu 16:00",
  },
  {
    id: "hospitality-track",
    type: "course",
    title: "Finnish for Hospitality (4 weeks)",
    description: "Learn customer phrases, role play real shifts, and log XP toward Connector level.",
    actionLabel: "Join fast track (+35 XP)",
    xpReward: 35,
    meta: "Starts Monday · Kajaani Adult Education",
  },
  {
    id: "digital-basics",
    type: "course",
    title: "Digital skills booster",
    description: "Evening sessions covering Suomi.fi, banking apps, and CV tools with mentors.",
    actionLabel: "Save my seat",
    xpReward: 28,
    meta: "Hybrid · 3 sessions",
  },
  {
    id: "internship-opportunity",
    type: "job",
    title: "Paid kitchen internship (6 weeks)",
    description: "Mentored position at Kainuu Hospitality. A2 Finnish and Food Service track required.",
    actionLabel: "Apply with Smart CV",
    xpReward: 60,
    meta: "Start date: 2 Dec · Kajaani",
  },
  {
    id: "care-support-role",
    type: "job",
    title: "Community care assistant",
    description: "Part-time support role with on-boarding in English and Finnish practice sessions.",
    actionLabel: "Review details",
    xpReward: 40,
    meta: "20h/week · Immediate start",
  },
];

export function AISuggestionFeed() {
  const { state, recordAction } = useUserProfile();
  const [lastAction, setLastAction] = useState<string | null>(null);

  const topMatches = useMemo(() => MOCK_SUGGESTIONS.slice(0, 3), []);

  const handleAction = (suggestion: Suggestion) => {
    recordAction({
      id: `${suggestion.id}-${Date.now()}`,
      label: `Followed AI suggestion: ${suggestion.title}`,
      category: "ai-suggestions",
      xp: suggestion.xpReward,
      impactPoints: Math.max(12, Math.round(suggestion.xpReward * 0.6)),
    });
    setLastAction(`${suggestion.title} added to your Journey. +${suggestion.xpReward} XP!`);
  };

  const coachTip = `Good news, ${state.name}! You’ve got ${topMatches.length} new opportunities waiting.`;

  return (
    <section
      aria-labelledby="ai-smart-matches"
      style={{
        display: "grid",
        gap: 18,
        padding: 24,
        borderRadius: 22,
        background: "linear-gradient(135deg, #eef2ff 0%, #e0f2fe 55%, #fdf2f8 100%)",
        color: "#0f172a",
        boxShadow: "0 24px 48px rgba(99,102,241,0.18)",
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 18, flexWrap: "wrap" }}>
        <div>
          <p
            id="ai-smart-matches"
            style={{ margin: 0, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 700, opacity: 0.7 }}
          >
            Your Smart Matches
          </p>
          <h2 style={{ margin: "6px 0 8px 0", fontSize: 24, fontWeight: 800 }}>
            Fresh picks from Knuut AI — updated just for you.
          </h2>
          <p style={{ margin: 0, fontSize: 13.5, color: "#475569" }}>Choose one to keep your Journey growing.</p>
        </div>
        <span style={{ fontSize: 13, color: "#4338ca", fontWeight: 600 }}>{coachTip}</span>
      </header>

      {lastAction && (
        <div
          role="status"
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            background: "rgba(34,197,94,0.18)",
            border: "1px solid rgba(134,239,172,0.45)",
            color: "#166534",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {lastAction}
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {topMatches.map((suggestion) => (
          <article
            key={suggestion.id}
            style={{
              borderRadius: 16,
              padding: 16,
              background: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(148,163,184,0.22)",
              boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div style={{ display: "grid", gap: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{suggestion.title}</span>
              <span style={{ fontSize: 13.5, color: "#475569" }}>{suggestion.description}</span>
              <span style={{ fontSize: 12, color: "#64748b" }}>{suggestion.meta}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#1e40af" }}>+{suggestion.xpReward} XP</span>
              <button
                type="button"
                onClick={() => handleAction(suggestion)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  color: "#0f172a",
                  fontWeight: 700,
                  cursor: "pointer",
                  minWidth: 140,
                }}
              >
                {suggestion.actionLabel}
              </button>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={() => (window.location.href = "/connect-by-skills")}
        style={{
          justifySelf: "flex-start",
          padding: "10px 16px",
          borderRadius: 12,
          border: "1px solid rgba(99,102,241,0.28)",
          background: "#fff",
          color: "#4338ca",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        See all matches
      </button>
    </section>
  );
}