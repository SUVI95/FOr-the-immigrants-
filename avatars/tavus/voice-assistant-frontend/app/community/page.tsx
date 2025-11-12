"use client";

import { useMemo, useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { useUserProfile } from "@/context/UserProfileContext";

interface ExtendedEventData {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location_name?: string;
  location_lat?: number;
  location_lng?: number;
  rsvp_count: number;
  category?: string;
  tags?: string[];
  featured?: boolean;
  organizer?: string;
  max_capacity?: number;
  photos?: string[];
  feedback_count?: number;
  avg_rating?: number;
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

// Mock data - combine groups and events
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
    tags: ["Mentor Available"],
  },
];

const mockEvents: ExtendedEventData[] = [
  {
    id: "1",
    title: "Finnish Language Café",
    description: "Practice Finnish with locals and other learners over coffee. Friendly hosts, relaxed atmosphere.",
    event_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    location_name: "Kajaani Public Library",
    location_lat: 64.2271,
    location_lng: 27.7285,
    rsvp_count: 12,
    category: "Language Learning",
    tags: ["Finnish", "Conversation", "Beginner Friendly"],
    featured: true,
    organizer: "Kajaani Integration Center",
    max_capacity: 30,
    feedback_count: 8,
    avg_rating: 4.7,
  },
  {
    id: "2",
    title: "Welcome to Kajaani Meetup",
    description: "Meet friendly locals, get tips on services, and connect with other newcomers.",
    event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location_name: "Kajaani Cultural Center",
    location_lat: 64.2271,
    location_lng: 27.7285,
    rsvp_count: 8,
    category: "Integration Support",
    tags: ["Newcomers", "Networking"],
    featured: true,
    organizer: "Kajaani Welcome Committee",
    max_capacity: 50,
    feedback_count: 12,
    avg_rating: 4.9,
  },
  {
    id: "3",
    title: "Nordic Walking Group",
    description: "Explore Kajaani trails with a friendly group. All fitness levels welcome.",
    event_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    location_name: "Kajaani Park",
    location_lat: 64.22,
    location_lng: 27.73,
    rsvp_count: 15,
    category: "Sports & Wellness",
    tags: ["Fitness", "Outdoor"],
    organizer: "Kajaani Sports Club",
    max_capacity: 25,
    avg_rating: 4.5,
  },
];

type FilterType = "all" | "groups" | "events";
type CategoryFilter = "all" | string;

export default function CommunityPage() {
  const { state } = useUserProfile();
  const [room] = useMemo(() => [new Room()], []);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  const allCategories = useMemo(() => {
    const groupCats = new Set(mockGroups.map((g) => g.category).filter(Boolean));
    const eventCats = new Set(mockEvents.map((e) => e.category).filter(Boolean));
    return Array.from(new Set([...groupCats, ...eventCats]));
  }, []);

  const filteredItems = useMemo(() => {
    let items: Array<{ type: "group" | "event"; data: GroupDataLite | ExtendedEventData }> = [];

    // Add groups
    if (activeFilter === "all" || activeFilter === "groups") {
      mockGroups.forEach((group) => {
        if (
          (categoryFilter === "all" || group.category === categoryFilter) &&
          (searchQuery === "" || group.name.toLowerCase().includes(searchQuery.toLowerCase()) || group.description.toLowerCase().includes(searchQuery.toLowerCase()))
        ) {
          items.push({ type: "group", data: group });
        }
      });
    }

    // Add events
    if (activeFilter === "all" || activeFilter === "events") {
      mockEvents.forEach((event) => {
        if (
          (categoryFilter === "all" || event.category === categoryFilter) &&
          (searchQuery === "" || event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.description.toLowerCase().includes(searchQuery.toLowerCase()))
        ) {
          items.push({ type: "event", data: event });
        }
      });
    }

    return items;
  }, [activeFilter, categoryFilter, searchQuery]);

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar activeTab="community" onTabChange={() => {}} onLearnFinnishClick={handleLearnFinnishClick} />

        <main
          style={{
            flex: 1,
            padding: "32px 28px",
            background: "#f8fafc",
            minHeight: "100vh",
            overflowY: "auto",
          }}
        >
          <div style={{ display: "grid", gap: 24 }}>
            {/* Hero */}
            <section
              style={{
                position: "relative",
                borderRadius: 32,
                padding: "48px 40px",
                background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)",
                color: "#ffffff",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(139,92,246,0.3)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.15,
                  mixBlendMode: "overlay",
                }}
              />
              <div style={{ position: "relative", zIndex: 1, display: "grid", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 48 }}>🤝</span>
                  <h1 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.1 }}>
                    Community
                  </h1>
                </div>
                <p style={{ margin: 0, fontSize: "1.2rem", lineHeight: 1.7, maxWidth: "800px", opacity: 0.95 }}>
                  Connect with groups, join events, and build your network in Kajaani. Find your people and grow together.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => window.location.href = "/knuut-voice"}
                    style={{
                      padding: "14px 24px",
                      borderRadius: 16,
                      border: "none",
                      background: "rgba(255,255,255,0.95)",
                      color: "#8b5cf6",
                      fontWeight: 700,
                      fontSize: 15,
                      cursor: "pointer",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    }}
                  >
                    Ask Knuut to find matches →
                  </button>
                </div>
              </div>
            </section>

            {/* Filters */}
            <section
              style={{
                borderRadius: 20,
                padding: 24,
                background: "#fff",
                border: "1px solid #e2e8f0",
                boxShadow: "0 16px 32px rgba(15,23,42,0.08)",
              }}
            >
              <div style={{ display: "grid", gap: 16 }}>
                {/* Type Filter */}
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => setActiveFilter("all")}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 12,
                      border: "1px solid #cbd5e1",
                      background: activeFilter === "all" ? "linear-gradient(135deg, #8b5cf6, #6366f1)" : "#f8fafc",
                      color: activeFilter === "all" ? "#fff" : "#475569",
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter("groups")}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 12,
                      border: "1px solid #cbd5e1",
                      background: activeFilter === "groups" ? "linear-gradient(135deg, #8b5cf6, #6366f1)" : "#f8fafc",
                      color: activeFilter === "groups" ? "#fff" : "#475569",
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    Groups
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveFilter("events")}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 12,
                      border: "1px solid #cbd5e1",
                      background: activeFilter === "events" ? "linear-gradient(135deg, #8b5cf6, #6366f1)" : "#f8fafc",
                      color: activeFilter === "events" ? "#fff" : "#475569",
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    Events
                  </button>
                </div>

                {/* Category Filter */}
                {allCategories.length > 0 && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => setCategoryFilter("all")}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "1px solid #cbd5e1",
                        background: categoryFilter === "all" ? "#8b5cf6" : "#f8fafc",
                        color: categoryFilter === "all" ? "#fff" : "#475569",
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      All Categories
                    </button>
                    {allCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategoryFilter(cat)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 8,
                          border: "1px solid #cbd5e1",
                          background: categoryFilter === cat ? "#8b5cf6" : "#f8fafc",
                          color: categoryFilter === cat ? "#fff" : "#475569",
                          fontWeight: 600,
                          fontSize: 13,
                          cursor: "pointer",
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}

                {/* Search */}
                <input
                  type="text"
                  placeholder="Search groups and events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "1px solid #cbd5e1",
                    fontSize: 15,
                    width: "100%",
                    maxWidth: "500px",
                  }}
                />
              </div>
            </section>

            {/* Results */}
            <section style={{ display: "grid", gap: 20 }}>
              {filteredItems.length === 0 ? (
                <div
                  style={{
                    padding: 48,
                    textAlign: "center",
                    borderRadius: 20,
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <p style={{ margin: 0, fontSize: 16, color: "#64748b" }}>
                    No {activeFilter === "all" ? "items" : activeFilter} found. Try adjusting your filters.
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
                  {filteredItems.map((item) => (
                    <div
                      key={`${item.type}-${item.data.id}`}
                      style={{
                        borderRadius: 20,
                        padding: 24,
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                        display: "grid",
                        gap: 12,
                      }}
                    >
                      {item.type === "group" ? (
                        <>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
                              {(item.data as GroupDataLite).name}
                            </h3>
                            <span style={{ fontSize: 24 }}>👥</span>
                          </div>
                          <p style={{ margin: 0, fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
                            {(item.data as GroupDataLite).description}
                          </p>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {(item.data as GroupDataLite).tags?.map((tag) => (
                              <span
                                key={tag}
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: 6,
                                  background: "#f1f5f9",
                                  color: "#475569",
                                  fontSize: 12,
                                  fontWeight: 600,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: "#64748b" }}>
                            <span>{(item.data as GroupDataLite).member_count} members</span>
                            <span>{(item.data as GroupDataLite).category}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => alert("Join group functionality - connect via Voice")}
                            style={{
                              padding: "10px 16px",
                              borderRadius: 10,
                              border: "1px solid #8b5cf6",
                              background: "rgba(139,92,246,0.1)",
                              color: "#8b5cf6",
                              fontWeight: 700,
                              fontSize: 14,
                              cursor: "pointer",
                            }}
                          >
                            Join Group
                          </button>
                        </>
                      ) : (
                        <>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
                              {(item.data as ExtendedEventData).title}
                            </h3>
                            <span style={{ fontSize: 24 }}>📅</span>
                          </div>
                          <p style={{ margin: 0, fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
                            {(item.data as ExtendedEventData).description}
                          </p>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {(item.data as ExtendedEventData).tags?.map((tag) => (
                              <span
                                key={tag}
                                style={{
                                  padding: "4px 10px",
                                  borderRadius: 6,
                                  background: "#f1f5f9",
                                  color: "#475569",
                                  fontSize: 12,
                                  fontWeight: 600,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: "#64748b" }}>
                            <span>
                              {new Date((item.data as ExtendedEventData).event_date).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                            <span>{(item.data as ExtendedEventData).rsvp_count} RSVPs</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => alert("RSVP functionality - connect via Voice")}
                            style={{
                              padding: "10px 16px",
                              borderRadius: 10,
                              border: "1px solid #8b5cf6",
                              background: "rgba(139,92,246,0.1)",
                              color: "#8b5cf6",
                              fontWeight: 700,
                              fontSize: 14,
                              cursor: "pointer",
                            }}
                          >
                            RSVP
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </RoomContext.Provider>
  );
}

