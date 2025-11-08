"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { useTranslation } from "@/components/i18n/TranslationProvider";
import { useUserProfile } from "@/context/UserProfileContext";

export default function BuddySystemPage() {
  const { t } = useTranslation();
  const { state: userState, recordAction } = useUserProfile();
  const [activeTab, setActiveTab] = useState("explore");
  const [room] = useState(new Room());
  const [match, setMatch] = useState<{
    name: string;
    languages: string[];
    focus: string;
    xp: number;
    availability: string;
  } | null>(null);
  const [sharedXp, setSharedXp] = useState(160);
  const [goal, setGoal] = useState("Learn Finnish (A1-A2)");
  const [meetingTime, setMeetingTime] = useState("Weekday evenings");
  const [level, setLevel] = useState("A1");

  const buddyMatches = [
    {
      name: "Sanna | Local mentor",
      languages: ["Finnish", "English"],
      focus: "Finnish A1 phrases, job search tips",
      availability: "Wednesdays 18:00 · Kajaani Library",
      xp: 45,
      goal: "Learn Finnish (A1-A2)",
    },
    {
      name: "Ahmed | Integration guide",
      languages: ["Arabic", "Finnish", "English"],
      focus: "DVV, Kela, everyday paperwork",
      availability: "Saturdays 11:00 · City Service Center",
      xp: 40,
      goal: "Integration help (Kela/DVV)",
    },
    {
      name: "Laura | Community connector",
      languages: ["Finnish", "English"],
      focus: "Weekend social events, youth groups",
      availability: "Fridays 17:30 · City Hub",
      xp: 30,
      goal: "Find friends & social",
    },
    {
      name: "Mika | Career coach",
      languages: ["Finnish", "English"],
      focus: "CV review, interview practice",
      availability: "Remote · Weekdays 19:00",
      xp: 35,
      goal: "Career & jobs",
    },
  ];

  const chatPrompts = [
    "Let's plan a 15-minute Finnish practice this week.",
    "What is one goal you want to reach this month?",
    "Share a local tip that helped you settle in Kajaani.",
    "Let's review official forms together (Kela/DVV).",
  ];

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  const handleBuddyRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const suggested = buddyMatches.find((buddy) => buddy.goal === goal) ?? buddyMatches[0];
    setMatch(suggested);
    recordAction({
      id: `buddy-request-${Date.now()}`,
      label: `Requested buddy pairing (${goal})`,
      category: "buddy",
      xp: 28,
      impactPoints: 24,
      reminder: {
        title: "Prepare a message for your buddy",
        dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        channel: "in-app",
      },
    });
  };

  const handleAcceptMatch = () => {
    if (!match) return;
    setSharedXp((prev) => prev + match.xp);
    recordAction({
      id: `buddy-accept-${Date.now()}`,
      label: `Accepted buddy match ${match.name}`,
      category: "buddy",
      xp: match.xp,
      impactPoints: Math.round(match.xp * 0.8),
      impactHours: 1,
      skill: {
        id: `skill-buddy-${match.name}`,
        title: `Buddy session with ${match.name}`,
        category: "Community",
        details: match.focus,
        source: "volunteer",
      },
    });
  };

  const handleLogSharedSession = () => {
    setSharedXp((prev) => prev + 20);
    recordAction({
      id: `buddy-shared-session-${Date.now()}`,
      label: "Logged buddy practice session",
      category: "buddy",
      xp: 20,
      impactPoints: 18,
      impactHours: 0.5,
      reminder: {
        title: "Schedule next buddy check-in",
        dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        channel: "in-app",
      },
    });
  };

  const handlePromptCopy = (prompt: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(prompt);
    }
    recordAction({
      id: `buddy-prompt-${Date.now()}`,
      label: "Copied buddy chat prompt",
      category: "buddy",
      xp: 6,
      impactPoints: 5,
    });
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            if (tab === "explore") {
              window.location.href = "/";
              return;
            }
            setActiveTab(tab);
          }} 
          onLearnFinnishClick={handleLearnFinnishClick} 
        />

        <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px", background: "#fafafa", minHeight: "100vh" }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{
              fontSize: "3rem",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 10,
            }}>
              {t("buddy")}
            </h1>
            <p style={{ color: "#666", fontSize: "1.1rem", maxWidth: 700 }}>
              Get paired with a local mentor or advanced immigrant. Weekly check‑ins, language practice, and practical support.
            </p>
          </div>

          <section style={{ background: "white", borderRadius: 12, boxShadow: "0 2px 4px rgba(0,0,0,0.08)", padding: 24 }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: "#111", marginBottom: 16 }}>Join the Buddy System</h2>
            <form
              onSubmit={handleBuddyRequest}
              style={{ display: "grid", gap: 12 }}
            >
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#374151", fontWeight: 600 }}>Your goal</span>
                <select
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                  style={{ padding: 10, border: "1px solid #e5e7eb", borderRadius: 8 }}
                >
                  <option value="Learn Finnish (A1-A2)">Learn Finnish (A1-A2)</option>
                  <option value="Integration help (Kela/DVV)">Integration help (Kela/DVV)</option>
                  <option value="Find friends & social">Find friends & social</option>
                  <option value="Career & jobs">Career & jobs</option>
                </select>
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#374151", fontWeight: 600 }}>Preferred meeting time</span>
                <select
                  value={meetingTime}
                  onChange={(event) => setMeetingTime(event.target.value)}
                  style={{ padding: 10, border: "1px solid #e5e7eb", borderRadius: 8 }}
                >
                  <option value="Weekday evenings">Weekday evenings</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Weekday daytime">Weekday daytime</option>
                </select>
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#374151", fontWeight: 600 }}>Finnish level</span>
                <select
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                  style={{ padding: 10, border: "1px solid #e5e7eb", borderRadius: 8 }}
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                </select>
              </label>
              <button type="submit" style={{
                background: "#22c55e",
                color: "white",
                padding: "12px 16px",
                borderRadius: 10,
                border: "none",
                fontWeight: 700,
                cursor: "pointer"
              }}>
                Request a Buddy →
              </button>
            </form>
            {match && (
              <div
                style={{
                  marginTop: 24,
                  borderRadius: 12,
                  border: "1px solid #bbf7d0",
                  background: "#ecfdf5",
                  padding: 16,
                  display: "grid",
                  gap: 10,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#166534" }}>{match.name}</h3>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>+{match.xp} XP</span>
                </div>
                <div style={{ fontSize: 13, color: "#0f172a" }}>{match.focus}</div>
                <div style={{ fontSize: 12, color: "#166534" }}>Availability: {match.availability}</div>
                <div style={{ fontSize: 12, color: "#14532d" }}>Languages: {match.languages.join(", ")}</div>
                <button
                  type="button"
                  onClick={handleAcceptMatch}
                  style={{
                    justifySelf: "flex-start",
                    padding: "8px 14px",
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Accept match
                </button>
              </div>
            )}
          </section>

          <section style={{ background: "white", borderRadius: 12, boxShadow: "0 2px 4px rgba(0,0,0,0.08)", padding: 24, marginTop: 32 }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: "#111", marginBottom: 16 }}>Meet your buddy · Chat starter kit</h2>
            <div style={{ display: "grid", gap: 12 }}>
              {chatPrompts.map((prompt, index) => (
                <div
                  key={index}
                  style={{
                    borderRadius: 10,
                    border: "1px solid #e2e8f0",
                    background: "#f8fafc",
                    padding: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ color: "#475569", fontSize: 14 }}>{prompt}</span>
                  <button
                    type="button"
                    onClick={() => handlePromptCopy(prompt)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 10,
                      border: "1px solid #cbd5f5",
                      background: "#fff",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section style={{ background: "white", borderRadius: 12, boxShadow: "0 2px 4px rgba(0,0,0,0.08)", padding: 24, marginTop: 32 }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: "#111", marginBottom: 16 }}>Shared XP</h2>
            <p style={{ color: "#475569", marginBottom: 12 }}>
              Every buddy session adds XP to both profiles. Reach 300 XP together to unlock the Connector Mentor badge.
            </p>
            <div style={{ height: 16, borderRadius: 999, background: "#e2e8f0", position: "relative", overflow: "hidden" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: `${Math.min(100, (sharedXp / 300) * 100)}%`,
                  background: "linear-gradient(135deg, #22d3ee, #6366f1)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, color: "#475569" }}>
              <span>{sharedXp} / 300 XP</span>
              <span>Target: Connector Mentor badge</span>
            </div>
            <button
              type="button"
              onClick={handleLogSharedSession}
              style={{
                marginTop: 16,
                padding: "10px 16px",
                borderRadius: 12,
                border: "1px solid #4338ca",
                background: "linear-gradient(135deg, #4338ca, #6366f1)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Log shared session (+20 XP)
            </button>
          </section>

        </main>
      </div>
    </RoomContext.Provider>
  );
}


