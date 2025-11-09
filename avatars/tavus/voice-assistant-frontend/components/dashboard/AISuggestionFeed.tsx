"use client";

import { useMemo, useState } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

type SuggestionType = "people" | "company" | "job" | "course";

type Suggestion = {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  actionLabel: string;
  xpReward: number;
  meta: string;
};

const CATEGORY_META: Record<
  SuggestionType,
  {
    icon: string;
    heading: string;
    summary: string;
    ctaDefault: string;
  }
> = {
  people: {
    icon: "🤝",
    heading: "People to Meet",
    summary: "Swap tips, practice Finnish, or co-host meetups with people in your field.",
    ctaDefault: "Connect now",
  },
  company: {
    icon: "🏭",
    heading: "Companies Open for Visits",
    summary: "Drop in, shadow staff, and get a feel for local workplaces before you apply.",
    ctaDefault: "Book visit",
  },
  course: {
    icon: "📚",
    heading: "Courses & Tracks",
    summary: "Add skills fast with short tracks matched to your current goals.",
    ctaDefault: "Join track",
  },
  job: {
    icon: "💼",
    heading: "Jobs & Internships",
    summary: "Roles hand-picked for your language level, experience, and Smart CV.",
    ctaDefault: "View role",
  },
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
  const [autoConnect, setAutoConnect] = useState(true);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const groupedSuggestions = useMemo(() => {
    return MOCK_SUGGESTIONS.reduce<Record<SuggestionType, Suggestion[]>>(
      (acc, suggestion) => {
        acc[suggestion.type].push(suggestion);
        return acc;
      },
      { people: [], company: [], job: [], course: [] }
    );
  }, []);

  const topSections = useMemo(() => {
    return (Object.keys(CATEGORY_META) as SuggestionType[])
      .map((type) => {
        const suggestion = groupedSuggestions[type][0];
        return {
          type,
          suggestion,
          meta: CATEGORY_META[type],
        };
      })
      .filter((entry) => entry.suggestion);
  }, [groupedSuggestions]);

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

  const handleToggleAutoConnect = () => {
    setAutoConnect((prev) => !prev);
    recordAction({
      id: `auto-connect-${Date.now()}`,
      label: `AI auto-connect ${!autoConnect ? "enabled" : "disabled"}`,
      category: "ai-suggestions",
      xp: 8,
      impactPoints: 6,
    });
    setLastAction(`AI auto-connect ${autoConnect ? "paused" : "enabled"}. You can change this anytime.`);
  };

  const coachTip = `Good news, ${state.name}! Knuut found ${topSections.length} fresh opportunities this morning.`;

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
            style={{ margin: 0, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.7, fontWeight: 700 }}
          >
            Your Smart Matches
          </p>
          <h2 style={{ margin: "6px 0 8px 0", fontSize: 24, fontWeight: 800 }}>
            Knuut AI refreshes these picks for you every day.
          </h2>
          <p style={{ margin: 0, fontSize: 13.5, color: "#475569" }}>
            Updated a few minutes ago · {topSections.length} new opportunities ready to explore.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gap: 8,
            padding: "12px 14px",
            borderRadius: 16,
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(148,163,184,0.25)",
            minWidth: 200,
          }}
        >
          <span style={{ fontSize: 11, textTransform: "uppercase", fontWeight: 700, color: "#4338ca" }}>Knuut coach tip</span>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "#475569" }}>{coachTip}</p>
          <button
            type="button"
            onClick={handleToggleAutoConnect}
            style={{
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(79,70,229,0.28)",
              background: autoConnect ? "rgba(99,102,241,0.14)" : "rgba(255,255,255,0.6)",
              color: "#312e81",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {autoConnect ? "Auto-connect on" : "Auto-connect off"}
          </button>
        </div>
      </header>

      {lastAction && (
        <div
          role="status"
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            background: "rgba(34,197,94,0.18)",
            border: "1px solid rgba(134,239,172,0.45)",
            color: "#bbf7d0",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {lastAction}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        {topSections.map(({ suggestion, meta }) => (
          <article
            key={suggestion.id}
            style={{
              borderRadius: 18,
              padding: 18,
              background: "rgba(255,255,255,0.92)",
              border: "1px solid rgba(148,163,184,0.22)",
              display: "grid",
              gap: 14,
              boxShadow: "0 14px 28px rgba(15,23,42,0.12)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 22 }} aria-hidden>
                  {meta.icon}
                </span>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#0f172a" }}>{meta.heading}</h3>
                <p style={{ margin: 0, fontSize: 13.5, color: "#475569" }}>{meta.summary}</p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#1e40af" }}>+{suggestion.xpReward} XP</span>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <strong style={{ fontSize: 15, color: "#0f172a" }}>{suggestion.title}</strong>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "#475569" }}>{suggestion.description}</p>
              <span style={{ fontSize: 12.5, color: "#64748b" }}>{suggestion.meta}</span>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => handleAction(suggestion)}
                style={{
                  flex: "1 1 150px",
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  color: "#0f172a",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {suggestion.actionLabel || meta.ctaDefault}
              </button>
              <button
                type="button"
                onClick={() => setLastAction(`Saved ${suggestion.title} for later. Check your suggestion feed.`)}
                style={{
                  flex: "0 0 auto",
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(148,163,184,0.3)",
                  background: "rgba(255,255,255,0.8)",
                  color: "#1e293b",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Save for later
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
