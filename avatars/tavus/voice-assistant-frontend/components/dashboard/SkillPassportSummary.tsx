"use client";

import { useMemo } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

export function SkillPassportSummary() {
  const {
    state: {
      skillPassport: { entries, lastUpdatedAt },
    },
  } = useUserProfile();

  const latestEntries = useMemo(() => entries.slice(0, 6), [entries]);
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      }),
    [],
  );

  return (
    <section
      aria-labelledby="skill-passport"
      style={{
        borderRadius: 20,
        padding: 24,
        background: "#fff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
        display: "grid",
        gap: 18,
      }}
    >
      <header>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.3, color: "#475569" }}>
          Skill Passport
        </p>
        <h2 id="skill-passport" style={{ margin: "6px 0 12px 0", fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
          Verified experience timeline
        </h2>
        <p style={{ margin: 0, color: "#475569" }}>
          Updated {dateFormatter.format(new Date(lastUpdatedAt))} · Shows skills earned from language buddy chats, volunteer actions, and integration tracks.
        </p>
      </header>

      <div style={{ display: "grid", gap: 12 }}>
        {latestEntries.length === 0 ? (
          <p style={{ margin: 0, color: "#64748b" }}>No entries yet — complete actions to build your Skill Passport.</p>
        ) : (
          latestEntries.map((entry) => (
            <article
              key={entry.id}
              style={{
                borderRadius: 16,
                padding: 16,
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                display: "flex",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: 0.6 }}>
                  {entry.category}
                </div>
                <h3 style={{ margin: "6px 0 8px 0", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{entry.title}</h3>
                {entry.details && <p style={{ margin: 0, color: "#475569", maxWidth: 480 }}>{entry.details}</p>}
              </div>
              <div style={{ textAlign: "right", minWidth: 120 }}>
                <div style={{ fontSize: 12, color: "#475569" }}>{dateFormatter.format(new Date(entry.earnedAt))}</div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    marginTop: 8,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "rgba(79,70,229,0.12)",
                    color: "#4338ca",
                    display: "inline-block",
                  }}
                >
                  Source: {entry.source}
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <a
        href="/smart-cv-builder"
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 0.4,
          textTransform: "uppercase",
          padding: "12px 16px",
          borderRadius: 12,
          background: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
          color: "#fff",
          textDecoration: "none",
          textAlign: "center",
        }}
      >
        Build Smart CV
      </a>
    </section>
  );
}

export default SkillPassportSummary;


