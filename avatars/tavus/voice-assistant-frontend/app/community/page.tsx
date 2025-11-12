"use client";

import { useMemo, useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import { motion, AnimatePresence } from "framer-motion";
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
    member_count: 67,
    location_name: "Kajaani Community Center",
    tags: ["Mentor Available", "Beginner Friendly"],
  },
  {
    id: "2",
    name: "Finnish Language Practice",
    description: "Practice Finnish every week with locals and friendly volunteers.",
    category: "Language",
    member_count: 89,
    location_name: "Kajaani Library",
    tags: ["Beginner Friendly"],
  },
  {
    id: "3",
    name: "Mothers & Families Network",
    description: "Coffee chats, stroller walks, and support for Finnish family paperwork.",
    category: "Family & Community",
    member_count: 74,
    location_name: "Family Center",
    tags: ["Child-Friendly"],
  },
  {
    id: "4",
    name: "Professional Network Kajaani",
    description: "Workshops, CV reviews, and intros to inclusive employers.",
    category: "Career",
    member_count: 56,
    location_name: "Kajaani Business Hub",
    tags: ["Mentor Available"],
  },
  {
    id: "5",
    name: "Kajaani Cultural Exchange",
    description: "Share food, music, and stories from across the globe.",
    category: "Culture",
    member_count: 48,
    location_name: "Cultural Center",
    tags: ["Social"],
  },
  {
    id: "6",
    name: "Tech & Entrepreneurs Kajaani",
    description: "Build projects, learn Finnish tech slang, and meet employers.",
    category: "Tech",
    member_count: 34,
    location_name: "Innovation Hub",
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
    rsvp_count: 28,
    category: "Language Learning",
    tags: ["Finnish", "Conversation", "Beginner Friendly"],
    featured: true,
    organizer: "Kajaani Integration Center",
    max_capacity: 30,
    feedback_count: 24,
    avg_rating: 4.8,
  },
  {
    id: "2",
    title: "Welcome to Kajaani Meetup",
    description: "Meet friendly locals, get tips on services, and connect with other newcomers.",
    event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location_name: "Kajaani Cultural Center",
    location_lat: 64.2271,
    location_lng: 27.7285,
    rsvp_count: 34,
    category: "Integration Support",
    tags: ["Newcomers", "Networking"],
    featured: true,
    organizer: "Kajaani Welcome Committee",
    max_capacity: 50,
    feedback_count: 18,
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
    rsvp_count: 22,
    category: "Sports & Wellness",
    tags: ["Fitness", "Outdoor"],
    organizer: "Kajaani Sports Club",
    max_capacity: 25,
    avg_rating: 4.7,
  },
  {
    id: "4",
    title: "Integration Workshop: Kela & DVV",
    description: "Learn how to register with Kela and DVV, understand benefits, and ask questions to official advisors.",
    event_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    location_name: "Kajaani City Hall",
    location_lat: 64.2271,
    location_lng: 27.7285,
    rsvp_count: 41,
    category: "Workshop",
    tags: ["Kela", "DVV", "Official"],
    featured: true,
    organizer: "Kajaani City Services",
    max_capacity: 50,
    feedback_count: 32,
    avg_rating: 4.9,
  },
  {
    id: "5",
    title: "International Food Night",
    description: "Share dishes from home, try new flavors, and celebrate cultures from across Kajaani.",
    event_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    location_name: "Kajaani Community Center",
    location_lat: 64.225,
    location_lng: 27.725,
    rsvp_count: 19,
    category: "Cultural",
    tags: ["Food", "Community"],
    organizer: "Kajaani Cultural Exchange",
    max_capacity: 60,
    feedback_count: 15,
    avg_rating: 4.9,
  },
  {
    id: "6",
    title: "Job Search Support Group",
    description: "Get help with CVs, interviews, and job search strategies tailored for newcomers.",
    event_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    location_name: "TE Services Kajaani",
    location_lat: 64.2271,
    location_lng: 27.7285,
    rsvp_count: 31,
    category: "Professional Development",
    tags: ["Jobs", "CV", "Career"],
    organizer: "TE Services",
    max_capacity: 40,
    avg_rating: 4.8,
  },
];

type FilterType = "all" | "groups" | "events";
type CategoryFilter = "all" | string;

const EVENT_MAP_BACKGROUND = (() => {
  const svg = `
    <svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#eef5ff"/>
          <stop offset="100%" stop-color="#dfe9ff"/>
        </linearGradient>
        <radialGradient id="pulse" cx="0.7" cy="0.3" r="0.6">
          <stop offset="0%" stop-color="#c5d9ff" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#c5d9ff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="500" rx="28" fill="url(#bg)"/>
      <g stroke="#c9d8f8" stroke-width="12" stroke-linecap="round" fill="none" opacity="0.68">
        <path d="M80 110 L220 140 L360 130 L520 150 L700 130"/>
        <path d="M120 260 C200 240, 300 250, 420 210 C540 170, 620 200, 700 190"/>
        <path d="M140 400 L260 350 L380 370 L520 340 L660 320 L760 300"/>
      </g>
      <g stroke="#fdd6a3" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.75">
        <path d="M120 80 L260 110 L360 100 L480 120"/>
        <path d="M520 320 L640 280 L720 260"/>
      </g>
      <circle cx="600" cy="140" r="110" fill="url(#pulse)"/>
      <circle cx="260" cy="340" r="70" fill="url(#pulse)" opacity="0.7"/>
      <circle cx="420" cy="210" r="48" fill="#c7d7fb" opacity="0.55"/>
      <circle cx="540" cy="360" r="34" fill="#c7d7fb" opacity="0.45"/>
    </svg>
  `;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
})();

function formatEventDateTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatEventTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function CommunityPage() {
  const { state, recordAction } = useUserProfile();
  const [room] = useMemo(() => [new Room()], []);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

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

  const mappedEvents = useMemo(() => {
    return mockEvents.filter((event) => event.location_lat && event.location_lng);
  }, []);

  const positionForEvent = (event: ExtendedEventData) => {
    if (!event.location_lat || !event.location_lng) return { xPercent: 50, yPercent: 50 };
    // Kajaani approximate bounds
    const minLat = 64.20;
    const maxLat = 64.24;
    const minLng = 27.70;
    const maxLng = 27.75;
    const x = ((event.location_lng - minLng) / (maxLng - minLng)) * 80 + 10;
    const y = (1 - (event.location_lat - minLat) / (maxLat - minLat)) * 70 + 15;
    return { xPercent: x, yPercent: y };
  };

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return mockEvents.find((e) => e.id === selectedEventId) || null;
  }, [selectedEventId]);

  const selectedCard = useMemo(() => {
    if (!selectedCardId) return null;
    const [type, id] = selectedCardId.split("-");
    if (type === "event") {
      return mockEvents.find((e) => e.id === id) || null;
    } else {
      return mockGroups.find((g) => g.id === id) || null;
    }
  }, [selectedCardId]);

  const handleRSVP = (eventId: string) => {
    recordAction({
      id: `rsvp-${eventId}-${Date.now()}`,
      label: `RSVPed to event`,
      category: "groups",
      xp: 15,
      impactPoints: 12,
    });
    setSelectedCardId(null);
    alert("RSVP confirmed! Check your Journey for updates.");
  };

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
                  <div>
                    <h1 style={{ margin: 0, fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.1 }}>
                      Community
                    </h1>
                    <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 12, color: "#22c55e" }}>🟢</span>
                        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>47 people online</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 12 }}>📅</span>
                        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>6 events this week</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 12 }}>👥</span>
                        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>368 active members</span>
                      </div>
                    </div>
                  </div>
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

            {/* Live City Map */}
            {mappedEvents.length > 0 && (
              <section
                style={{
                  borderRadius: 26,
                  padding: 24,
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 20px 36px rgba(15,23,42,0.08)",
                  display: "grid",
                  gridTemplateColumns: "minmax(220px, 1fr) minmax(320px, 1.6fr)",
                  gap: 24,
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: 1.3, textTransform: "uppercase", color: "#8b5cf6" }}>
                    Live Map
                  </p>
                  <h2 style={{ margin: "8px 0", fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
                    What&apos;s happening in Kajaani right now
                  </h2>
                  <p style={{ margin: 0, fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
                    Tap a pin to see event details. Click to RSVP and add to your Journey.
                  </p>
                </div>
                <div
                  style={{
                    position: "relative",
                    minHeight: 320,
                    borderRadius: 22,
                    overflow: "hidden",
                    backgroundImage: EVENT_MAP_BACKGROUND,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "1px solid #cbd5f5",
                    boxShadow: "0 24px 42px rgba(148,163,184,0.22), inset 0 0 24px rgba(15,23,42,0.12)",
                  }}
                >
                  {mappedEvents.map((event) => {
                    const pos = positionForEvent(event);
                    const isSelected = selectedEventId === event.id;
                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => setSelectedEventId(event.id)}
                        style={{
                          position: "absolute",
                          left: `${pos.xPercent}%`,
                          top: `${pos.yPercent}%`,
                          transform: isSelected ? "translate(-50%, -50%) scale(1.05)" : "translate(-50%, -50%)",
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: isSelected ? "#22c55e" : "#8b5cf6",
                            border: isSelected ? "4px solid rgba(34,197,94,0.45)" : "3px solid rgba(139,92,246,0.32)",
                            boxShadow: isSelected ? "0 0 0 10px rgba(34,197,94,0.24)" : "0 0 0 10px rgba(139,92,246,0.18)",
                          }}
                        />
                        <div
                          style={{
                            minWidth: 160,
                            maxWidth: 220,
                            background: "rgba(255,255,255,0.96)",
                            borderRadius: 16,
                            padding: "10px 14px",
                            border: "1px solid rgba(15,23,42,0.1)",
                            boxShadow: "0 12px 24px rgba(15,23,42,0.1)",
                            textAlign: "left",
                          }}
                        >
                          <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: "#0f172a" }}>{event.title}</h3>
                          <p style={{ margin: "6px 0 4px 0", fontSize: 12, color: "#475569" }}>{event.location_name}</p>
                          <p style={{ margin: 0, fontSize: 11.5, color: "#8b5cf6", fontWeight: 600 }}>👥 {event.rsvp_count} attending</p>
                        </div>
                      </button>
                    );
                  })}

                  {selectedEvent && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 18,
                        right: 18,
                        background: "rgba(15,23,42,0.93)",
                        color: "#f8fafc",
                        borderRadius: 16,
                        padding: "14px 16px",
                        width: 220,
                        boxShadow: "0 18px 34px rgba(15,23,42,0.32)",
                        border: "1px solid rgba(148,163,184,0.28)",
                      }}
                    >
                      <div style={{ display: "grid", gap: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                          <div>
                            <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700 }}>{selectedEvent.title}</h3>
                            <div style={{ fontSize: 11, opacity: 0.85 }}>
                              {formatEventDateTime(selectedEvent.event_date)} at {formatEventTime(selectedEvent.event_date)}
                            </div>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#38bdf8" }}>+{selectedEvent.rsvp_count}</span>
                        </div>
                        <p style={{ margin: "0 0 6px 0", fontSize: 11.5, lineHeight: 1.45 }}>
                          {selectedEvent.description.slice(0, 90)}
                          {selectedEvent.description.length > 90 ? "…" : ""}
                        </p>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCardId(`event-${selectedEvent.id}`);
                            }}
                            style={{
                              padding: "7px 12px",
                              borderRadius: 10,
                              border: "none",
                              background: "linear-gradient(135deg, #22c55e, #16a34a)",
                              color: "#fff",
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              window.open(
                                `https://www.google.com/maps?q=${selectedEvent.location_lat},${selectedEvent.location_lng}`,
                                "_blank",
                              )
                            }
                            style={{
                              padding: "7px 12px",
                              borderRadius: 10,
                              border: "1px solid rgba(248,250,252,0.3)",
                              background: "rgba(248,250,252,0.12)",
                              color: "#f8fafc",
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            View on map
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

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
                      onClick={() => setSelectedCardId(`${item.type}-${item.data.id}`)}
                      style={{
                        borderRadius: 20,
                        padding: 24,
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                        display: "grid",
                        gap: 12,
                        cursor: "pointer",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
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

        {/* Event/Group Detail Modal */}
        <AnimatePresence>
          {selectedCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10000,
                padding: 20,
              }}
              onClick={() => setSelectedCardId(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  borderRadius: 24,
                  padding: 32,
                  maxWidth: 500,
                  width: "100%",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  boxShadow: "0 24px 48px rgba(0,0,0,0.3)",
                }}
              >
                {selectedCard && "event_date" in selectedCard ? (
                  // Event details
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
                        {(selectedCard as ExtendedEventData).title}
                      </h2>
                      <button
                        onClick={() => setSelectedCardId(null)}
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: 24,
                          cursor: "pointer",
                          color: "#64748b",
                          padding: 0,
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <div style={{ display: "grid", gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>
                          📅 Date & Time
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>
                          {formatEventDateTime((selectedCard as ExtendedEventData).event_date)} at{" "}
                          {formatEventTime((selectedCard as ExtendedEventData).event_date)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>
                          📍 Location
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>
                          {(selectedCard as ExtendedEventData).location_name}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>
                          Description
                        </div>
                        <p style={{ margin: 0, fontSize: 15, color: "#475569", lineHeight: 1.6 }}>
                          {(selectedCard as ExtendedEventData).description}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {(selectedCard as ExtendedEventData).tags?.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 8,
                              background: "#f1f5f9",
                              color: "#475569",
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                        <button
                          type="button"
                          onClick={() => handleRSVP((selectedCard as ExtendedEventData).id)}
                          style={{
                            flex: 1,
                            padding: "14px 20px",
                            borderRadius: 12,
                            border: "none",
                            background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                            color: "#fff",
                            fontWeight: 700,
                            fontSize: 15,
                            cursor: "pointer",
                          }}
                        >
                          RSVP ({((selectedCard as ExtendedEventData).rsvp_count || 0) + 1} going)
                        </button>
                        {(selectedCard as ExtendedEventData).location_lat && (selectedCard as ExtendedEventData).location_lng && (
                          <button
                            type="button"
                            onClick={() =>
                              window.open(
                                `https://www.google.com/maps?q=${(selectedCard as ExtendedEventData).location_lat},${(selectedCard as ExtendedEventData).location_lng}`,
                                "_blank",
                              )
                            }
                            style={{
                              padding: "14px 20px",
                              borderRadius: 12,
                              border: "1px solid #e2e8f0",
                              background: "#f8fafc",
                              color: "#475569",
                              fontWeight: 700,
                              fontSize: 15,
                              cursor: "pointer",
                            }}
                          >
                            Map
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  // Group details
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
                        {(selectedCard as GroupDataLite).name}
                      </h2>
                      <button
                        onClick={() => setSelectedCardId(null)}
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: 24,
                          cursor: "pointer",
                          color: "#64748b",
                          padding: 0,
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <div style={{ display: "grid", gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>
                          📍 Location
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>
                          {(selectedCard as GroupDataLite).location_name}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 8 }}>
                          Description
                        </div>
                        <p style={{ margin: 0, fontSize: 15, color: "#475569", lineHeight: 1.6 }}>
                          {(selectedCard as GroupDataLite).description}
                        </p>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {(selectedCard as GroupDataLite).tags?.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              padding: "6px 12px",
                              borderRadius: 8,
                              background: "#f1f5f9",
                              color: "#475569",
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div style={{ fontSize: 14, color: "#64748b" }}>
                        {(selectedCard as GroupDataLite).member_count} members · {(selectedCard as GroupDataLite).category}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          recordAction({
                            id: `join-group-${(selectedCard as GroupDataLite).id}-${Date.now()}`,
                            label: `Joined group: ${(selectedCard as GroupDataLite).name}`,
                            category: "groups",
                            xp: 18,
                            impactPoints: 16,
                          });
                          setSelectedCardId(null);
                          alert("Group join request sent! Check your Journey for updates.");
                        }}
                        style={{
                          width: "100%",
                          padding: "14px 20px",
                          borderRadius: 12,
                          border: "none",
                          background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 15,
                          cursor: "pointer",
                        }}
                      >
                        Join Group
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RoomContext.Provider>
  );
}

