"use client";

import { useMemo, useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { useUserProfile } from "@/context/UserProfileContext";

type TrackWeek = {
  title: string;
  focus: string;
  tasks: Array<{ id: string; text: string; xp: number; points: number }>;
};

type IntegrationTrack = {
  id: string;
  title: string;
  description: string;
  badge: string;
  xp: number;
  weeks: TrackWeek[];
};

const TRACKS: IntegrationTrack[] = [
  {
    id: "finnish-job-search",
    title: "Basic Finnish & Job Search",
    description: "Upgrade language confidence while preparing your Finnish job toolkit.",
    badge: "Skill Badge · Job Ready",
    xp: 180,
    weeks: [
      {
        title: "Week 1 · Language Essentials",
        focus: "Build daily Finnish phrases and practice speaking",
        tasks: [
          { id: "fj-1", text: "Complete 2 AI Language Buddy sessions", xp: 20, points: 18 },
          { id: "fj-2", text: "Record 10 new Finnish words in Skill Passport", xp: 18, points: 15 },
          { id: "fj-3", text: "Attend a Language Café event", xp: 22, points: 20 },
        ],
      },
      {
        title: "Week 2 · CV & LinkedIn",
        focus: "Polish and localise application materials",
        tasks: [
          { id: "fj-4", text: "Generate Smart CV (Finnish and English)", xp: 28, points: 25 },
          { id: "fj-5", text: "Request a mentor review in Buddy System", xp: 20, points: 18 },
          { id: "fj-6", text: "Add community volunteering to CV", xp: 18, points: 16 },
        ],
      },
      {
        title: "Week 3 · Networking",
        focus: "Make professional contacts in Kajaani",
        tasks: [
          { id: "fj-7", text: "Join a peer group (Tech or Career)", xp: 22, points: 20 },
          { id: "fj-8", text: "Attend a job or integration event", xp: 24, points: 22 },
          { id: "fj-9", text: "Share an Event Review in Create", xp: 16, points: 14 },
        ],
      },
      {
        title: "Week 4 · Applications",
        focus: "Apply to roles with confidence",
        tasks: [
          { id: "fj-10", text: "Send two tailored job applications", xp: 30, points: 26 },
          { id: "fj-11", text: "Practice interview with Buddy for 20 min", xp: 22, points: 20 },
          { id: "fj-12", text: "Log reflection in Impact Wallet", xp: 18, points: 15 },
        ],
      },
    ],
  },
  {
    id: "digital-skills",
    title: "Digital Skills Sprint",
    description: "Master Finnish e-services, banking, and digital tools in four weeks.",
    badge: "Skill Badge · Digital Navigator",
    xp: 160,
    weeks: [
      {
        title: "Week 1 · Accounts & Security",
        focus: "Secure Suomi.fi, banking, and Kela access",
        tasks: [
          { id: "ds-1", text: "Set up Suomi.fi and Tunnistus credentials", xp: 24, points: 22 },
          { id: "ds-2", text: "Enable 2FA on key accounts", xp: 16, points: 14 },
          { id: "ds-3", text: "Host or attend a digital onboarding session", xp: 22, points: 20 },
        ],
      },
      {
        title: "Week 2 · Everyday Tasks",
        focus: "Handle DVV, Kela, and tax with confidence",
        tasks: [
          { id: "ds-4", text: "Complete DVV address registration with buddy support", xp: 26, points: 22 },
          { id: "ds-5", text: "Log a Life Admin question in Knuut Voice", xp: 16, points: 14 },
          { id: "ds-6", text: "Share a My Finnish Story about digital services", xp: 18, points: 15 },
        ],
      },
      {
        title: "Week 3 · Productivity",
        focus: "Master everyday productivity tools",
        tasks: [
          { id: "ds-7", text: "Complete 3 micro-volunteering tasks online", xp: 24, points: 20 },
          { id: "ds-8", text: "Attend a digital skills workshop", xp: 20, points: 18 },
          { id: "ds-9", text: "Create shared notes with your buddy", xp: 16, points: 14 },
        ],
      },
      {
        title: "Week 4 · Community Support",
        focus: "Teach and pay it forward",
        tasks: [
          { id: "ds-10", text: "Host a 30-min knowledge share with peers", xp: 26, points: 22 },
          { id: "ds-11", text: "Publish a resource in Create", xp: 18, points: 16 },
          { id: "ds-12", text: "Log impact in Impact Wallet", xp: 16, points: 14 },
        ],
      },
    ],
  },
  {
    id: "community-helper",
    title: "Community Helper Bootcamp",
    description: "Become a connector who welcomes newcomers and activates events.",
    badge: "Skill Badge · Community Helper",
    xp: 170,
    weeks: [
      {
        title: "Week 1 · Welcome Skills",
        focus: "Learn introductions and onboarding best practices",
        tasks: [
          { id: "ch-1", text: "Complete Buddy orientation module", xp: 20, points: 18 },
          { id: "ch-2", text: "Shadow a Peer Circle session", xp: 24, points: 22 },
          { id: "ch-3", text: "Write a welcome post in Create", xp: 16, points: 14 },
        ],
      },
      {
        title: "Week 2 · Event Activation",
        focus: "Plan and promote inclusive events",
        tasks: [
          { id: "ch-4", text: "Submit an activity via Organizer Resources", xp: 24, points: 22 },
          { id: "ch-5", text: "Co-host an event or facilitate check-ins", xp: 26, points: 24 },
          { id: "ch-6", text: "Log attendee feedback", xp: 18, points: 16 },
        ],
      },
      {
        title: "Week 3 · Mentoring",
        focus: "Support individuals through the integration maze",
        tasks: [
          { id: "ch-7", text: "Respond to two Life Admin prompts in Voice", xp: 20, points: 18 },
          { id: "ch-8", text: "Document a guidance checklist", xp: 18, points: 16 },
          { id: "ch-9", text: "Log 2 hours mentoring in Impact Wallet", xp: 24, points: 22 },
        ],
      },
      {
        title: "Week 4 · Showcase Impact",
        focus: "Share evidence and unlock the badge",
        tasks: [
          { id: "ch-10", text: "Compile photos/testimonials for Analytics export", xp: 20, points: 18 },
          { id: "ch-11", text: "Present outcomes to an NGO/CITY partner", xp: 28, points: 24 },
          { id: "ch-12", text: "Nominate another volunteer for recognition", xp: 18, points: 16 },
        ],
      },
    ],
  },
];

export default function ProgramsPage() {
  const { recordAction } = useUserProfile();
  const [room] = useState(new Room());
  const [activeTab, setActiveTab] = useState("programs");
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [enrolledTracks, setEnrolledTracks] = useState<Set<string>>(new Set());
  const [selectedTrack, setSelectedTrack] = useState<IntegrationTrack | null>(null);

  const progressByTrack = useMemo(() => {
    return TRACKS.reduce<Record<string, { completed: number; total: number }>>((acc, track) => {
      const total = track.weeks.reduce((sum, week) => sum + week.tasks.length, 0);
      const completed = track.weeks.reduce(
        (sum, week) => sum + week.tasks.filter((task) => completedTasks.has(task.id)).length,
        0,
      );
      acc[track.id] = { completed, total };
      return acc;
    }, {});
  }, [completedTasks]);

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  const handleEnroll = (track: IntegrationTrack) => {
    if (enrolledTracks.has(track.id)) {
      setSelectedTrack(track);
      return;
    }
    setEnrolledTracks((prev) => new Set(prev).add(track.id));
    recordAction({
      id: `track-enroll-${track.id}-${Date.now()}`,
      label: `Enrolled in ${track.title}`,
      category: "learning",
      xp: 30,
      impactPoints: 26,
      reminder: {
        title: `Week 1 checkpoint: ${track.title}`,
        dueAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        channel: "in-app",
      },
    });
    setSelectedTrack(track);
  };

  const handleCompleteTask = (track: IntegrationTrack, task: { id: string; text: string; xp: number; points: number }) => {
    if (completedTasks.has(task.id)) return;
    setCompletedTasks((prev) => new Set(prev).add(task.id));
    recordAction({
      id: `track-task-${task.id}-${Date.now()}`,
      label: `Completed track task: ${task.text}`,
      category: "learning",
      xp: task.xp,
      impactPoints: task.points,
      taskId: task.id,
      skill: {
        id: `skill-track-${track.id}`,
        title: track.badge,
        category: "Integration",
        details: task.text,
        source: "course",
      },
    });
  };

  const activeTrackId = Array.from(enrolledTracks)[0];
  const activeTrack = activeTrackId ? TRACKS.find((track) => track.id === activeTrackId) ?? null : null;
  const activeProgress = activeTrack ? progressByTrack[activeTrack.id] : null;

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

        <main
          style={{
            flex: 1,
            padding: "40px 28px",
            background: "#f3f4f6",
            minHeight: "100vh",
            overflowY: "auto",
            display: "grid",
            gap: 24,
          }}
        >
          <section
            style={{
              borderRadius: 26,
              padding: 28,
              background: "linear-gradient(135deg, #f8fbff 0%, #e0f2fe 45%, #eef2ff 100%)",
              border: "1px solid rgba(148,163,184,0.25)",
              boxShadow: "0 24px 44px rgba(99,102,241,0.15)",
              display: "grid",
              gap: 16,
            }}
          >
            <div style={{ display: "grid", gap: 10 }}>
              <span style={{ fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", fontWeight: 700, color: "#4338ca" }}>
                Programs
              </span>
              <h1 style={{ margin: 0, fontSize: "2.3rem", fontWeight: 800, color: "#111827" }}>Fast Integration Tracks</h1>
              <p style={{ margin: 0, fontSize: 14.5, color: "#334155", maxWidth: 620 }}>
                Learn, connect, and grow — one week at a time. Four-week tracks guided by Knuut AI to move you from Explorer to Connector.
              </p>
            </div>
            {activeTrack && activeProgress && (
              <div
                style={{
                  borderRadius: 18,
                  padding: 18,
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(148,163,184,0.3)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div>
                  <strong style={{ fontSize: 14, color: "#1f2937" }}>My active track</strong>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{activeTrack.title}</div>
                  <span style={{ fontSize: 12.5, color: "#1d4ed8", fontWeight: 600 }}>
                    {activeProgress.completed} of {activeProgress.total} tasks complete
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTrack(activeTrack)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: 14,
                    border: "none",
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Continue track
                </button>
              </div>
            )}
          </section>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {TRACKS.map((track) => {
              const progress = progressByTrack[track.id];
              const percent = progress ? Math.round((progress.completed / progress.total) * 100) : 0;
              const isEnrolled = enrolledTracks.has(track.id);

              return (
                <article
                  key={track.id}
                  style={{
                    borderRadius: 22,
                    padding: 22,
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 18px 32px rgba(148,163,184,0.12)",
                    display: "grid",
                    gap: 16,
                  }}
                >
                  <div style={{ display: "grid", gap: 8 }}>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>{track.title}</h2>
                    <p style={{ margin: 0, fontSize: 13.5, color: "#475569" }}>{track.description}</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: 999,
                          background: "rgba(67,56,202,0.12)",
                          color: "#4338ca",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        🕓 4 weeks
                      </span>
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: 999,
                          background: "rgba(59,130,246,0.12)",
                          color: "#1d4ed8",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {track.badge}
                      </span>
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: 999,
                          background: "rgba(34,197,94,0.12)",
                          color: "#15803d",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        +{track.xp} XP
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "grid", gap: 8 }}>
                    <div style={{ height: 8, borderRadius: 999, background: "#e2e8f0", overflow: "hidden" }}>
                      <div
                        style={{
                          width: `${percent}%`,
                          height: "100%",
                          background: "linear-gradient(135deg, #22d3ee, #6366f1)",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 12, color: "#475569" }}>Progress: {percent}%</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => (isEnrolled ? setSelectedTrack(track) : handleEnroll(track))}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 14,
                      border: "none",
                      background: isEnrolled ? "rgba(59,130,246,0.12)" : "linear-gradient(135deg, #22c55e, #16a34a)",
                      color: isEnrolled ? "#1d4ed8" : "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {isEnrolled ? "View track" : "Join track"}
                  </button>
                </article>
              );
            })}
          </section>

          {selectedTrack && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="track-detail-title"
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15,23,42,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                zIndex: 2000,
              }}
            >
              <div
                style={{
                  width: "min(90%, 720px)",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  background: "#fff",
                  borderRadius: 24,
                  padding: 28,
                  display: "grid",
                  gap: 20,
                  boxShadow: "0 30px 60px rgba(15,23,42,0.35)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div>
                    <h2 id="track-detail-title" style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
                      {selectedTrack.title}
                    </h2>
                    <p style={{ margin: "6px 0 0 0", color: "#475569" }}>{selectedTrack.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTrack(null)}
                    style={{
                      border: "none",
                      background: "transparent",
                      fontSize: 24,
                      color: "#94a3b8",
                      cursor: "pointer",
                    }}
                    aria-label="Close track details"
                  >
                    ×
                  </button>
                </div>

                {selectedTrack.weeks.map((week) => (
                  <div
                    key={week.title}
                    style={{
                      borderRadius: 18,
                      border: "1px solid #e2e8f0",
                      background: "#f8fafc",
                      padding: 20,
                      display: "grid",
                      gap: 12,
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a" }}>{week.title}</h3>
                      <p style={{ margin: "4px 0 0 0", fontSize: 13.5, color: "#475569" }}>{week.focus}</p>
                    </div>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
                      {week.tasks.map((task) => {
                        const done = completedTasks.has(task.id);
                        return (
                          <li
                            key={task.id}
                            style={{
                              padding: 14,
                              borderRadius: 14,
                              background: done ? "#ecfdf5" : "#fff",
                              border: done ? "1px solid #bbf7d0" : "1px solid #e2e8f0",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 12,
                              flexWrap: "wrap",
                            }}
                          >
                            <div style={{ display: "grid", gap: 4 }}>
                              <span style={{ fontSize: 13.5, color: "#0f172a", fontWeight: 600 }}>{task.text}</span>
                              <span style={{ fontSize: 12.5, color: "#15803d", fontWeight: 600 }}>
                                +{task.xp} XP · +{task.points} pts
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCompleteTask(selectedTrack, task)}
                              disabled={done}
                              style={{
                                padding: "8px 14px",
                                borderRadius: 12,
                                border: "none",
                                background: done ? "#bbf7d0" : "linear-gradient(135deg, #2563eb, #7c3aed)",
                                color: done ? "#166534" : "#fff",
                                fontWeight: 600,
                                cursor: done ? "default" : "pointer",
                              }}
                            >
                              {done ? "Done" : "Mark done"}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </RoomContext.Provider>
  );
}


