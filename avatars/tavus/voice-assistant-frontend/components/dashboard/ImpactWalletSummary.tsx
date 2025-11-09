"use client";

import { useMemo } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

export function ImpactWalletSummary() {
  const {
    state: {
      impactWallet: { points, volunteeringHours, badges, tasks, transactions },
    },
    recordAction,
  } = useUserProfile();

  const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);

  return (
    <section
      id="my-journey-anchor"
      aria-labelledby="impact-wallet"
      style={{
        borderRadius: 20,
        padding: 24,
        background: "linear-gradient(135deg, #eef2ff 0%, #e0f2fe 60%, #fdf2f8 100%)",
        color: "#0f172a",
        border: "1px solid rgba(148,163,184,0.25)",
        boxShadow: "0 20px 44px rgba(99,102,241,0.18)",
        display: "grid",
        gridTemplateColumns: "minmax(220px, 1fr) minmax(280px, 1.1fr)",
        gap: 28,
        alignItems: "start",
      }}
    >
      <div>
        <p style={{ margin: 0, fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase", opacity: 0.6 }}>Your Story in Action</p>
        <h2 id="impact-wallet" style={{ margin: "6px 0 8px 0", fontSize: 24, fontWeight: 800 }}>XP, badges, and hours that show your impact.</h2>
        <p style={{ lineHeight: 1.6, opacity: 0.75 }}>
          Help someone, learn a skill, or join an event — every action updates this board instantly so mentors and employers can see
          your momentum.
        </p>
        <p style={{ lineHeight: 1.6, opacity: 0.75 }}>
          You’re {points >= 300 ? "already a Connector" : `${Math.max(0, 300 - points)} XP away from Connector level`}. Keep the
          streak going!
        </p>

        <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
          <div
            style={{
              borderRadius: 16,
              padding: 16,
              background: "linear-gradient(135deg, rgba(59,130,246,0.22) 0%, rgba(129,140,248,0.14) 100%)",
              border: "1px solid rgba(59,130,246,0.25)",
            }}
          >
            <div style={{ fontSize: 12, letterSpacing: 0.4, textTransform: "uppercase", opacity: 0.7 }}>Total XP & Impact</div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 4 }}>{points}</div>
          </div>
          <div
            style={{
              borderRadius: 16,
              padding: 16,
              background: "linear-gradient(135deg, rgba(34,197,94,0.18) 0%, rgba(134,239,172,0.14) 100%)",
              border: "1px solid rgba(34,197,94,0.28)",
            }}
          >
            <div style={{ fontSize: 12, letterSpacing: 0.4, textTransform: "uppercase", opacity: 0.7 }}>Volunteering Hours</div>
            <div style={{ fontSize: 30, fontWeight: 800, marginTop: 4 }}>{volunteeringHours.toFixed(1)}h</div>
          </div>
          <div
            style={{
              borderRadius: 16,
              padding: 16,
              background: "linear-gradient(135deg, rgba(236,72,153,0.18) 0%, rgba(244,114,182,0.12) 100%)",
              border: "1px solid rgba(236,72,153,0.28)",
            }}
          >
            <div style={{ fontSize: 12, letterSpacing: 0.4, textTransform: "uppercase", opacity: 0.7 }}>Unlocked Badges</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {badges.length === 0 ? "No badges yet — keep going!" : badges.map((badge) => <span key={badge}>🏅 {badge}</span>)}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            recordAction({
              id: `export-impact-${Date.now()}`,
              label: "Exported anonymized impact data",
              category: "tools",
              xp: 10,
              impactPoints: 0,
              metadata: { exported: true },
            })
          }
          style={{
            marginTop: 18,
            padding: "12px 18px",
            borderRadius: 999,
            border: "1px solid rgba(59,130,246,0.35)",
            background: "rgba(255,255,255,0.85)",
            color: "#1e3a8a",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Export anonymized activity data
        </button>
      </div>

      <div style={{ display: "grid", gap: 20 }}>
        <div
          style={{
            borderRadius: 18,
            padding: 20,
            background: "rgba(15,23,42,0.06)",
            border: "1px solid rgba(148,163,184,0.2)",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, opacity: 0.8 }}>Quick wins to boost your level</h3>
          <p style={{ margin: "6px 0 14px 0", fontSize: 13, opacity: 0.7 }}>
            Quick wins you can complete in under 30 minutes. Each task syncs to Skill Passport and adds Impact Points.
          </p>
          <div style={{ display: "grid", gap: 12 }}>
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  borderRadius: 14,
                  padding: 14,
                  background: task.completed ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.9)",
                  border: task.completed ? "1px solid rgba(34,197,94,0.35)" : "1px solid rgba(148,163,184,0.18)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>{task.title}</h4>
                    <p style={{ margin: "6px 0 0 0", fontSize: 13, opacity: 0.75 }}>{task.description}</p>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: "rgba(59,130,246,0.18)",
                      border: "1px solid rgba(59,130,246,0.45)",
                    }}
                  >
                    +{task.points} pts
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                  <span style={{ fontSize: 12, opacity: 0.65 }}>Cadence: {task.cadence}</span>
                  <button
                    type="button"
                    disabled={task.completed}
                    onClick={() =>
                      recordAction({
                        id: `task-${task.id}-${Date.now()}`,
                        label: `Completed micro-volunteering: ${task.title}`,
                        category: "volunteer",
                        xp: task.points,
                        impactPoints: task.points,
                        impactHours: task.hours ?? 0.25,
                        taskId: task.id,
                        skill: {
                          id: `skill-task-${task.id}`,
                          title: task.title,
                          category: "Volunteering",
                          details: "Logged via Impact Wallet Task",
                          source: "volunteer",
                        },
                      })
                    }
                    style={{
                      padding: "8px 14px",
                      borderRadius: 12,
                      border: "none",
                      background: task.completed ? "rgba(148,163,184,0.3)" : "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
                      color: task.completed ? "#475569" : "#0f172a",
                      fontWeight: 700,
                      cursor: task.completed ? "default" : "pointer",
                    }}
                  >
                    {task.completed ? "Logged" : "I did this!"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            borderRadius: 18,
            padding: 20,
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(148,163,184,0.22)",
          }}
        >
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, opacity: 0.8 }}>Latest Journey updates</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: "14px 0 0 0", display: "grid", gap: 10 }}>
            {recentTransactions.length === 0 ? (
              <li style={{ fontSize: 13, opacity: 0.7 }}>No activity yet. Complete a pathway step or volunteer task.</li>
            ) : (
              recentTransactions.map((txn) => (
                <li
                  key={txn.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 13,
                    background: "rgba(15,23,42,0.35)",
                    borderRadius: 12,
                    padding: "10px 14px",
                  }}
                >
                  <span>
                    {txn.description === "Joined Kajaani Integration Circle"
                      ? "You joined the Kajaani Integration Circle — welcome to the movement! Every step builds your story."
                      : txn.description}
                  </span>
                  <span style={{ fontWeight: 700, color: txn.pointsChange && txn.pointsChange > 0 ? "#4ade80" : "#e2e8f0" }}>
                    {txn.pointsChange ? `+${txn.pointsChange} pts` : "Logged"}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ImpactWalletSummary;


