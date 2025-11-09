"use client";

import { useMemo } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

const CATEGORY_MAP = {
  jobs: "tools",
  study: "learning",
  volunteering: "volunteer",
  community: "groups",
  language: "learning",
  admin: "resources",
} as const;

type AreaKey = keyof typeof CATEGORY_MAP;

export function MyPathwayMap() {
  const {
    state: { pathway, level },
    recordAction,
  } = useUserProfile();

  const completionPercentage = useMemo(() => {
    if (!pathway.nodes.length) return 0;
    const completed = pathway.nodes.filter((node) => node.status === "done").length;
    return Math.round((completed / pathway.nodes.length) * 100);
  }, [pathway.nodes]);

  const nextFocus = useMemo(() => pathway.nodes.find((node) => node.status === "in-progress" || node.status === "up-next"), [pathway.nodes]);
  const lastWin = useMemo(() => pathway.nodes.find((node) => node.status === "done"), [pathway.nodes]);

  return (
    <section
      id="journey-map"
      aria-labelledby="my-pathway-title"
      style={{
        borderRadius: 20,
        padding: 24,
        background: "#fff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 16px 32px rgba(15, 23, 42, 0.08)",
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, color: "#475569", textTransform: "uppercase" }}>
            My Journey Map
          </p>
          <h2 id="my-pathway-title" style={{ margin: "6px 0 0 0", fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
            Every small step moves you forward · {level} level
          </h2>
          <p style={{ margin: "8px 0 0 0", color: "#475569", maxWidth: 520 }}>
            Today’s goal: attend one event or help one person. Knuut updates this map every time you log an action.
          </p>
          {lastWin && (
            <p style={{ margin: "6px 0 0 0", color: "#334155", maxWidth: 520 }}>
              ✅ Last win: {lastWin.title} — amazing progress!
            </p>
          )}
          {nextFocus && (
            <p style={{ margin: "4px 0 0 0", color: "#334155", maxWidth: 520 }}>
              🔸 Up next: {nextFocus.title} (+{nextFocus.xpReward} XP)
            </p>
          )}
        </div>
        <div
          style={{
            padding: "16px 18px",
            borderRadius: 16,
            border: "1px solid #cbd5f5",
            background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(59,130,246,0.08) 100%)",
            color: "#312e81",
            minWidth: 180,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 12, letterSpacing: 0.4, textTransform: "uppercase", fontWeight: 700 }}>Overall Progress</div>
          <div style={{ fontSize: 30, fontWeight: 800, marginTop: 4 }}>{completionPercentage}%</div>
          <div style={{ fontSize: 12 }}>completed</div>
        </div>
      </header>

      <button
        type="button"
        onClick={() => {
          const target = document.getElementById("my-journey-anchor");
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          } else {
            window.location.href = "/my-journey";
          }
        }}
        style={{
          alignSelf: "flex-start",
          padding: "10px 16px",
          borderRadius: 12,
          border: "1px solid #cbd5f5",
          background: "#eff6ff",
          color: "#1d4ed8",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Open my full journey
      </button>

      <div
        style={{
          position: "relative",
          padding: "12px 0 12px 28px",
          borderLeft: "4px solid #cbd5f5",
          display: "grid",
          gap: 16,
        }}
      >
        {pathway.nodes.map((node, index) => {
          const isComplete = node.status === "done";
          const isActive = node.status === "in-progress";
          const palette = isComplete
            ? { background: "#ecfdf5", border: "#bbf7d0", accent: "#16a34a", text: "#14532d" }
            : isActive
            ? { background: "#eef2ff", border: "#c7d2fe", accent: "#4338ca", text: "#312e81" }
            : { background: "#f8fafc", border: "#e2e8f0", accent: "#64748b", text: "#0f172a" };

          const actionCategory = CATEGORY_MAP[node.area as AreaKey] ?? "resources";

          return (
            <article
              key={node.id}
              style={{
                position: "relative",
                marginLeft: -28,
                paddingLeft: 40,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 26,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: palette.background,
                  border: `4px solid ${palette.accent}`,
                  boxShadow: isActive ? "0 0 0 6px rgba(99,102,241,0.18)" : "none",
                  transform: "translate(-50%, -50%)",
                }}
              />
              <div
                style={{
                  borderRadius: 18,
                  padding: 20,
                  background: palette.background,
                  border: `1px solid ${palette.border}`,
                  boxShadow: isActive ? "0 14px 28px rgba(95,109,255,0.18)" : "0 6px 16px rgba(15, 23, 42, 0.06)",
                  transition: "transform 0.2s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "4px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                        background: "rgba(15, 23, 42, 0.05)",
                        color: palette.text,
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                      }}
                    >
                      <span>#{index + 1}</span>
                      <span style={{ color: palette.accent }}>{node.area}</span>
                    </div>
                    <h3 style={{ margin: "10px 0 8px 0", fontSize: 19, fontWeight: 700, color: palette.text }}>{node.title}</h3>
                    <p style={{ margin: 0, color: palette.text, opacity: 0.82, maxWidth: 540 }}>{node.description}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, minWidth: 140 }}>
                    <div
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        border: `1px dashed ${palette.accent}`,
                        color: palette.accent,
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                      }}
                    >
                      +{node.xpReward} XP
                    </div>
                    {isComplete ? (
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: palette.accent,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span aria-hidden="true">✅</span> Completed
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          recordAction({
                            id: `path-${node.id}-${Date.now()}`,
                            label: `Completed pathway step: ${node.title}`,
                            category: actionCategory,
                            xp: node.xpReward,
                            impactPoints: Math.round(node.xpReward * 0.8),
                            impactHours: node.area === "volunteering" ? 0.5 : 0,
                            pathwayNodeId: node.id,
                            skill:
                              node.area === "language"
                                ? {
                                    id: `skill-${node.id}`,
                                    title: node.title,
                                    category: "Language",
                                    details: "Logged via My Pathway AI map",
                                    source: "course",
                                  }
                                : undefined,
                            reminder:
                              node.status === "up-next"
                                ? {
                                    title: `Follow up: ${node.title}`,
                                    dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                                    channel: "in-app",
                                  }
                                : undefined,
                          })
                        }
                        style={{
                          padding: "10px 16px",
                          borderRadius: 12,
                          border: "none",
                          fontWeight: 700,
                          fontSize: 13,
                          cursor: "pointer",
                          background: palette.accent,
                          color: "#fff",
                          boxShadow: "0 10px 24px rgba(79, 70, 229, 0.25)",
                        }}
                      >
                        {isActive ? "Finish now" : "Mark done"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default MyPathwayMap;


