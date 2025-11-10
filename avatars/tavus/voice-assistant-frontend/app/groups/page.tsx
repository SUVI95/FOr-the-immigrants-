"use client";

import { useMemo, useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { useUserProfile } from "@/context/UserProfileContext";

interface IntegrationPathway {
  id: string;
  title: string;
  goal: string;
  action: string;
  link: string;
}

interface ThemeFilter {
  id: string;
  label: string;
  badge?: string;
}

interface GroupDataLite {
  id: string;
  name: string;
  description: string;
  category?: string;
  location_name?: string;
  member_count: number;
  tags?: string[];
}

// Mockup group data for Kajaani - focused on retention and integration
const mockGroups: GroupDataLite[] = [
  {
    id: "1",
    name: "Kajaani Integration Circle",
    description: "Weekly check-ins, city tips, and a safe space to ask anything about Finnish life.",
    category: "Integration Support",
    member_count: 45,
    location_name: "Kajaani Community Center",
    tags: ["Mentor Available", "Beginner Friendly"],
  },
  {
    id: "2",
    name: "Finnish Language Practice",
    description: "Practice Finnish every week with locals and friendly volunteers.",
    category: "Language",
    member_count: 38,
    location_name: "Kajaani Library",
    tags: ["Beginner Friendly"],
  },
  {
    id: "3",
    name: "Mothers & Families Network",
    description: "Coffee chats, stroller walks, and support for Finnish family paperwork.",
    category: "Family & Community",
    member_count: 52,
    location_name: "Family Center",
    tags: ["Child-Friendly"],
  },
  {
    id: "4",
    name: "Professional Network Kajaani",
    description: "Workshops, CV reviews, and intros to inclusive employers.",
    category: "Career",
    member_count: 28,
    location_name: "Kajaani Business Hub",
    tags: ["Mentor Available"]
  },
  {
    id: "5",
    name: "Kajaani Cultural Exchange",
    description: "Share food, music, and stories from across the globe.",
    category: "Culture",
    member_count: 35,
    location_name: "Cultural Center",
  },
  {
    id: "6",
    name: "Housing & Admin Support",
    description: "Step-by-step help with Kela, DVV, taxes, and housing forms.",
    category: "Life Admin",
    member_count: 42,
    location_name: "City Services",
    tags: ["Mentor Available"],
  },
  {
    id: "7",
    name: "Sports & Wellness Kajaani",
    description: "Join hikes, Nordic walking, and wellness meetups for every fitness level.",
    category: "Wellbeing",
    member_count: 31,
    location_name: "Sports Center",
  },
  {
    id: "8",
    name: "Kajaani Tech & Entrepreneurs",
    description: "Build projects, learn Finnish tech slang, and meet employers.",
    category: "Tech",
    member_count: 19,
    location_name: "Innovation Hub",
    tags: ["Mentor Available"],
  },
  {
    id: "9",
    name: "Students & Young Professionals",
    description: "Study jams, weekend trips, and career nights for 18–35 year olds.",
    category: "Youth",
    member_count: 27,
    location_name: "University Campus",
  },
  {
    id: "10",
    name: "Mental Health & Wellbeing",
    description: "Gentle peer support and tools to stay balanced during your integration journey.",
    category: "Wellbeing",
    member_count: 24,
    location_name: "Wellness Center",
    tags: ["Mentor Available"],
  },
  {
    id: "11",
    name: "Winter Survival Crew",
    description: "Get ready for winter with clothing tips, mood boosters, and indoor hangouts.",
    category: "Seasonal",
    member_count: 33,
    location_name: "Various Locations",
  },
  {
    id: "12",
    name: "Kajaani Food & Cooking",
    description: "Swap recipes, cook together, and explore Finnish flavors.",
    category: "Culture",
    member_count: 29,
    location_name: "Community Kitchen",
  },
];

const featuredCircles = [
  {
    id: "featured-women",
    title: "Women’s Network",
    description: "Mentoring circles, confidence workshops, and childcare-friendly meetups.",
    schedule: "📅 Tuesdays · Kajaani Innovation Hub",
    hosts: "🤝 City of Kajaani + Mentors",
    theme: "Career & Belonging",
  },
  {
    id: "featured-tech",
    title: "Tech Launchpad",
    description: "Code, learn, and connect with real employers in Kajaani’s tech scene.",
    schedule: "📅 Thursdays · Hybrid",
    hosts: "🤝 Kajaani Tech Collective",
    theme: "Skills & Growth",
  },
  {
    id: "featured-youth",
    title: "Youth Connect (16–24)",
    description: "CV clinics, language tandems, and creative sessions for young jobseekers.",
    schedule: "📅 Saturdays · Youth House",
    hosts: "🤝 Peer mentors + Youth Workers",
    theme: "Future Ready",
  },
];

const integrationPathways: IntegrationPathway[] = [
  {
    id: "path-explorer",
    title: "Explorer → Connector",
    goal: "Join a circle, attend 2 events",
    action: "Start Path",
    link: "/my-journey",
  },
  {
    id: "path-mentor",
    title: "Connector → Mentor",
    goal: "Host a chat, log 1h volunteering",
    action: "Open Toolkit",
    link: "/my-journey",
  },
  {
    id: "path-career",
    title: "Career Boost",
    goal: "Attend a workshop, update CV",
    action: "View Track",
    link: "/work-opportunities",
  },
  {
    id: "path-family",
    title: "Family & Community",
    goal: "Share a resource, book peer support",
    action: "Explore",
    link: "/resources",
  },
];

const themeFilters: ThemeFilter[] = [
  { id: "Beginner Friendly", label: "Beginner Finnish" },
  { id: "Mentor Available", label: "Mentor Available" },
  { id: "Child-Friendly", label: "Child-Friendly" },
  { id: "Include Locals", label: "Include Locals" },
];

const aiSuggestions = [
  {
    id: "ai-language",
    groupName: "Kajaani Integration Circle",
    message: "You’ve joined 2 Finnish cafés — this circle helps you keep momentum.",
  },
  {
    id: "ai-career",
    groupName: "Professional Network Kajaani",
    message: "Ready for the next career step? Meet mentors and inclusive employers.",
  },
];

function truncateDescription(text: string, limit = 110) {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}…`;
}

export default function GroupsPage() {
  const { recordAction } = useUserProfile();
  const [activeTab, setActiveTab] = useState("groups");
  const [room] = useState(new Room());
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
  const [showRecommended, setShowRecommended] = useState(false);

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filterId)) {
        next.delete(filterId);
      } else {
        next.add(filterId);
      }
      return next;
    });
  };

  const filteredGroups = useMemo(() => {
    return mockGroups.filter((group) => {
      if (selectedFilters.size === 0) return true;
      const tags = group.tags ?? [];
      if (selectedFilters.has("Include Locals")) {
        return true;
      }
      return Array.from(selectedFilters).every((filter) => tags.includes(filter));
    });
  }, [selectedFilters]);

  const groupedByTheme = useMemo(() => {
    return filteredGroups.reduce<Record<string, GroupDataLite[]>>((acc, group) => {
      const key = group.category ?? "Community";
      if (!acc[key]) acc[key] = [];
      acc[key].push(group);
      return acc;
    }, {});
  }, [filteredGroups]);

  const handleJoin = (group: GroupDataLite) => {
    recordAction({
      id: `group-join-${group.id}-${Date.now()}`,
      label: `Joined group: ${group.name}`,
      category: "groups",
      xp: 18,
      impactPoints: 16,
      reminder: {
        title: `Check upcoming meetup for ${group.name}`,
        dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        channel: "in-app",
      },
    });
    alert("We’ll sync this group join once the backend is live.");
  };

  const handleCreateCircle = () => {
    recordAction({
      id: `group-create-${Date.now()}`,
      label: "Opened Create My Circle",
      category: "groups",
      xp: 22,
      impactPoints: 20,
    });
    window.location.href = "/create";
  };

  const handleRecommended = () => {
    setShowRecommended((prev) => !prev);
    recordAction({
      id: `groups-recommended-${Date.now()}`,
      label: "Viewed recommended groups",
      category: "groups",
      xp: 12,
      impactPoints: 10,
    });
  };

  const handleAISuggestion = (groupName: string) => {
    const target = mockGroups.find((group) => group.name === groupName);
    if (target) {
      handleJoin(target);
    }
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLearnFinnishClick={handleLearnFinnishClick} />

        <main
          style={{
            flex: 1,
            padding: "36px 28px",
            background: "#f8fafc",
            minHeight: "100vh",
            overflowY: "auto",
            display: "grid",
            gap: 32,
          }}
        >
          <section
            style={{
              position: "relative",
              borderRadius: 32,
              padding: "44px 38px",
              background: "linear-gradient(135deg, #4338ca 0%, #6366f1 45%, #ec4899 100%)",
              color: "#f8fafc",
              boxShadow: "0 30px 58px rgba(67,56,202,0.28)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.16,
              }}
            />
            <div
              style={{
                position: "relative",
                display: "grid",
                gap: 18,
                maxWidth: 640,
              }}
            >
              <h1 style={{ margin: 0, fontSize: "2.9rem", fontWeight: 800 }}>Find Your Circle</h1>
              <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: 1.6 }}>
                Join a group, meet locals, and grow together. From language cafés to tech meetups — everyone belongs somewhere in Kajaani.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <button
                  type="button"
                  onClick={handleRecommended}
                  style={{
                    padding: "12px 20px",
                    borderRadius: 16,
                    border: "none",
                    background: "rgba(15,23,42,0.22)",
                    color: "#f8fafc",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Show Recommended Groups
                </button>
                <button
                  type="button"
                  onClick={handleCreateCircle}
                  style={{
                    padding: "12px 20px",
                    borderRadius: 16,
                    border: "1px solid rgba(248,250,252,0.4)",
                    background: "rgba(248,250,252,0.12)",
                    color: "#f8fafc",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Create My Circle
                </button>
              </div>
            </div>
          </section>

          <section style={{ display: "grid", gap: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>Featured circles</h2>
              <span style={{ fontSize: 13, color: "#64748b" }}>Scroll sideways to explore</span>
            </div>
            <div
              style={{
                display: "flex",
                gap: 18,
                overflowX: "auto",
                paddingBottom: 6,
                scrollbarWidth: "thin",
              }}
            >
              {featuredCircles.map((circle) => (
                <article
                  key={circle.id}
                  style={{
                    minWidth: 280,
                    maxWidth: 300,
                    borderRadius: 24,
                    padding: 22,
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 18px 36px rgba(148,163,184,0.14)",
                    display: "grid",
                    gap: 12,
                  }}
                >
                  <div style={{ fontSize: 12.5, color: "#6366f1", fontWeight: 700 }}>{circle.theme}</div>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>{circle.title}</h3>
                  <p style={{ margin: 0, fontSize: 13.5, color: "#475569", lineHeight: 1.6 }}>{circle.description}</p>
                  <div style={{ fontSize: 12.5, color: "#1d4ed8", fontWeight: 600 }}>{circle.schedule}</div>
                  <div style={{ fontSize: 12, color: "#475569" }}>{circle.hosts}</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => {
                        const matching = mockGroups.find((group) => circle.title.includes(group.name.split(" ")[0]));
                        if (matching) handleJoin(matching);
                      }}
                      style={{
                        padding: "9px 14px",
                        borderRadius: 12,
                        border: "none",
                        background: "linear-gradient(135deg, #22c55e, #16a34a)",
                        color: "#fff",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Join Group
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: "9px 14px",
                        borderRadius: 12,
                        border: "1px solid #cbd5f5",
                        background: "#f8fafc",
                        color: "#1d4ed8",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                      onClick={() => alert("Live chat coming soon.")}
                    >
                      Chat Live
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section style={{ display: "grid", gap: 16 }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>My integration pathways</h2>
            <div
              style={{
                display: "flex",
                gap: 16,
                overflowX: "auto",
                paddingBottom: 6,
              }}
            >
              {integrationPathways.map((path) => (
                <button
                  key={path.id}
                  type="button"
                  onClick={() => {
                    recordAction({
                      id: `pathway-${path.id}-${Date.now()}`,
                      label: `Opened pathway: ${path.title}`,
                      category: "groups",
                      xp: 14,
                      impactPoints: 12,
                    });
                    window.location.href = path.link;
                  }}
                  style={{
                    minWidth: 220,
                    borderRadius: 18,
                    border: "1px solid #e2e8f0",
                    background: "#fff",
                    boxShadow: "0 12px 24px rgba(148,163,184,0.12)",
                    padding: 18,
                    display: "grid",
                    gap: 6,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8" }}>{path.title}</span>
                  <span style={{ fontSize: 12.5, color: "#475569" }}>{path.goal}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#22c55e" }}>{path.action} →</span>
                </button>
              ))}
            </div>
          </section>

          <section
            style={{
              position: "sticky",
              top: 24,
              zIndex: 20,
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              background: "rgba(248,250,252,0.95)",
              padding: 12,
              borderRadius: 16,
              border: "1px solid #e2e8f0",
              boxShadow: "0 12px 24px rgba(148,163,184,0.08)",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Filters</span>
            {themeFilters.map((filter) => {
              const isActive = selectedFilters.has(filter.id);
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => toggleFilter(filter.id)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 999,
                    border: isActive ? "1px solid rgba(37,99,235,0.5)" : "1px solid #e2e8f0",
                    background: isActive ? "linear-gradient(135deg, #dbeafe, #ede9fe)" : "#fff",
                    color: isActive ? "#1d4ed8" : "#475569",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {filter.label}
                </button>
              );
            })}
          </section>

          {showRecommended && (
            <section
              style={{
                borderRadius: 26,
                padding: 24,
                background: "linear-gradient(135deg, #e0f2fe 0%, #eef2ff 100%)",
                border: "1px solid #bfdbfe",
                boxShadow: "0 20px 38px rgba(59,130,246,0.12)",
                display: "grid",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>Smart AI picks</h2>
                <span style={{ fontSize: 13, color: "#1d4ed8", fontWeight: 600 }}>Knuut matches update daily</span>
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                {aiSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    style={{
                      borderRadius: 18,
                      padding: 18,
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "grid", gap: 6 }}>
                      <strong style={{ fontSize: 15, color: "#0f172a" }}>{suggestion.groupName}</strong>
                      <span style={{ fontSize: 13, color: "#475569" }}>{suggestion.message}</span>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => handleAISuggestion(suggestion.groupName)}
                        style={{
                          padding: "9px 14px",
                          borderRadius: 12,
                          border: "none",
                          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                          color: "#fff",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Join now
                      </button>
                      <button
                        type="button"
                        onClick={() => alert("More circles coming soon.")}
                        style={{
                          padding: "9px 14px",
                          borderRadius: 12,
                          border: "1px solid #cbd5f5",
                          background: "#f8fafc",
                          color: "#1d4ed8",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        See similar circles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section style={{ display: "grid", gap: 28 }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>All groups by theme</h2>
            <div style={{ display: "grid", gap: 28 }}>
              {Object.entries(groupedByTheme).map(([theme, groups]) => (
                <div key={theme} style={{ display: "grid", gap: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" }}>{theme}</h3>
                    <span style={{ fontSize: 12.5, color: "#64748b" }}>{groups.length} circles</span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                      gap: 16,
                    }}
                  >
                    {groups.map((group) => (
                      <article
                        key={group.id}
                        style={{
                          borderRadius: 22,
                          padding: 20,
                          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 16px 30px rgba(148,163,184,0.16)",
                          display: "grid",
                          gap: 12,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                          <div style={{ display: "grid", gap: 4 }}>
                            <h4 style={{ margin: 0, fontSize: 16.5, fontWeight: 700, color: "#0f172a" }}>{group.name}</h4>
                            <span style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.55 }}>
                              {truncateDescription(group.description)}
                            </span>
                          </div>
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: 999,
                              background: "#eff6ff",
                              color: "#1d4ed8",
                              fontSize: 11,
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {group.member_count} members
                          </span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 12.5, color: "#1d4ed8", fontWeight: 600 }}>{group.location_name}</span>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                            {group.tags?.map((tag) => (
                              <span
                                key={tag}
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: 999,
                                  background: "rgba(99,102,241,0.12)",
                                  color: "#4338ca",
                                  fontSize: 11,
                                  fontWeight: 600,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <button
                            type="button"
                            onClick={() => handleJoin(group)}
                            style={{
                              padding: "9px 16px",
                              borderRadius: 12,
                              border: "none",
                              background: "linear-gradient(135deg, #22c55e, #16a34a)",
                              color: "#fff",
                              fontWeight: 600,
                              cursor: "pointer",
                              boxShadow: "0 10px 20px rgba(34,197,94,0.22)",
                            }}
                          >
                            Join
                          </button>
                          <button
                            type="button"
                            style={{
                              padding: "9px 16px",
                              borderRadius: 12,
                              border: "1px solid #cbd5f5",
                              background: "#f8fafc",
                              color: "#1d4ed8",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                            onClick={() => alert("Group details coming soon.")}
                          >
                            Details
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </RoomContext.Provider>
  );
}

