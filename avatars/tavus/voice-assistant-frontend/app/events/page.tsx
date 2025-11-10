"use client";

import { useMemo, useState } from "react";
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

const mockEvents: ExtendedEventData[] = [
  {
    id: "1",
    title: "Finnish Language Café",
    description:
      "Practice Finnish with locals and other learners over coffee. Friendly hosts, relaxed atmosphere, and easy conversation prompts.",
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
    description:
      "Meet friendly locals, get tips on services, and connect with other newcomers. A relaxed way to settle in.",
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
    description: "Explore Kajaani trails with a friendly group. All fitness levels welcome, poles provided.",
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
  {
    id: "4",
    title: "Integration Workshop: Kela & DVV",
    description: "Learn how to register with Kela and DVV, understand benefits, and ask questions to official advisors.",
    event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    location_name: "Kajaani City Hall",
    location_lat: 64.2271,
    location_lng: 27.7285,
    rsvp_count: 25,
    category: "Workshop",
    tags: ["Kela", "DVV", "Official"],
    featured: true,
    organizer: "Kajaani City Services",
    max_capacity: 40,
    feedback_count: 20,
    avg_rating: 4.8,
  },
  {
    id: "5",
    title: "International Food Night",
    description: "Share dishes from home, try new flavors, and celebrate cultures from across Kajaani.",
    event_date: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString(),
    location_name: "Kajaani Community Center",
    location_lat: 64.225,
    location_lng: 27.725,
    rsvp_count: 20,
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
    event_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    location_name: "TE Services Kajaani",
    location_lat: 64.2271,
    location_lng: 27.7285,
    rsvp_count: 18,
    category: "Professional Development",
    tags: ["Jobs", "CV", "Career"],
    organizer: "TE Services",
    max_capacity: 35,
    avg_rating: 4.6,
  },
  {
    id: "7",
    title: "Sauna Evening",
    description: "Experience Finnish sauna culture with mentors who explain traditions and etiquette.",
    event_date: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString(),
    location_name: "Kajaani Sauna Center",
    location_lat: 64.23,
    location_lng: 27.735,
    rsvp_count: 10,
    category: "Cultural",
    tags: ["Sauna", "Finnish Culture"],
    organizer: "Kajaani Cultural Center",
    max_capacity: 20,
    avg_rating: 4.4,
  },
  {
    id: "8",
    title: "Children's Playgroup",
    description: "A relaxed playgroup for young families. Activities, snacks, and support from family workers.",
    event_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    location_name: "Kajaani Family Center",
    location_lat: 64.225,
    location_lng: 27.7285,
    rsvp_count: 14,
    category: "Family",
    tags: ["Children", "Parents"],
    organizer: "Kajaani Family Services",
    max_capacity: 30,
    avg_rating: 4.7,
  },
];

const aiRecommendations = [
  {
    eventId: "1",
    message: "You’re practicing Finnish — this café keeps you on track.",
    xp: 25,
  },
  {
    eventId: "4",
    message: "Haven’t visited Kela or DVV yet? Get it done with friends.",
    xp: 30,
  },
  {
    eventId: "2",
    message: "Meet other newcomers and grow your local network.",
    xp: 22,
  },
];

const CATEGORY_METADATA: Array<{ id: string; label: string; icon: string }> = [
  { id: "All", label: "All", icon: "⭐" },
  { id: "Language Learning", label: "Language", icon: "🗣️" },
  { id: "Family", label: "Family", icon: "👨‍👩‍👧" },
  { id: "Professional Development", label: "Jobs", icon: "💼" },
  { id: "Integration Support", label: "Integration", icon: "🧭" },
  { id: "Cultural", label: "Culture", icon: "🎭" },
  { id: "Workshop", label: "Skills", icon: "💻" },
  { id: "Sports & Wellness", label: "Sports", icon: "🏃" },
];

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

function EventsOverviewMap({
  events,
  selectedEventId,
  onSelect,
  onAddToJourney,
}: {
  events: ExtendedEventData[];
  selectedEventId: string | null;
  onSelect: (event: ExtendedEventData) => void;
  onAddToJourney: (event: ExtendedEventData) => void;
}) {
  const mappedEvents = events.filter((event) => event.location_lat && event.location_lng);
  if (mappedEvents.length === 0) return null;

  const latitudes = mappedEvents.map((event) => event.location_lat ?? 0);
  const longitudes = mappedEvents.map((event) => event.location_lng ?? 0);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  const latRange = Math.max(maxLat - minLat, 0.01);
  const lngRange = Math.max(maxLng - minLng, 0.01);

  const positionFor = (event: ExtendedEventData) => {
    const lat = event.location_lat ?? minLat;
    const lng = event.location_lng ?? minLng;
    const x = ((lng - minLng) / lngRange) * 80 + 10;
    const y = (1 - (lat - minLat) / latRange) * 70 + 15;
    return { xPercent: x, yPercent: y };
  };

  const selectedEvent = mappedEvents.find((event) => event.id === selectedEventId) ?? mappedEvents[0];

  return (
    <section
      aria-labelledby="events-map"
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
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: 1.3, textTransform: "uppercase", color: "#2563eb" }}>
          Map view
        </p>
        <h2 id="events-map" style={{ margin: "8px 0", fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
          See what&apos;s happening around Kajaani
        </h2>
        <p style={{ margin: 0, fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
          Tap a pin to add it to your Journey. Knuut keeps reminders and XP ready for you automatically.
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
          const pos = positionFor(event);
          const isSelected = selectedEventId === event.id;
          return (
            <button
              key={event.id}
              type="button"
              onClick={() => onSelect(event)}
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
                  background: isSelected ? "#22c55e" : "#2563eb",
                  border: isSelected ? "4px solid rgba(34,197,94,0.45)" : "3px solid rgba(37,99,235,0.32)",
                  boxShadow: isSelected ? "0 0 0 10px rgba(34,197,94,0.24)" : "0 0 0 10px rgba(37,99,235,0.18)",
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
                <p style={{ margin: 0, fontSize: 11.5, color: "#2563eb", fontWeight: 600 }}>👥 {event.rsvp_count} attending</p>
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
                  <div style={{ fontSize: 11, opacity: 0.85 }}>{formatEventDateTime(selectedEvent.event_date)}</div>
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
                  onClick={() => onAddToJourney(selectedEvent)}
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
                  Add to Journey
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
  );
}

export default function EventsPage() {
  const { recordAction } = useUserProfile();
  const [activeTab, setActiveTab] = useState("events");
  const [events] = useState<ExtendedEventData[]>(mockEvents);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(mockEvents[0]?.id ?? null);

  const upcomingEvents = useMemo(() => {
    return events
      .filter((event) => new Date(event.event_date) >= new Date())
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
  }, [events]);

  const spotlightEvent = upcomingEvents.find((event) => event.featured) ?? upcomingEvents[0] ?? null;

  const trendingEvents = useMemo(() => {
    return upcomingEvents
      .filter((event) => event.id !== spotlightEvent?.id)
      .sort((a, b) => b.rsvp_count - a.rsvp_count)
      .slice(0, 4);
  }, [upcomingEvents, spotlightEvent?.id]);

  const recommendedEvents = useMemo(() => {
    return aiRecommendations
      .map((rec) => {
        const event = upcomingEvents.find((item) => item.id === rec.eventId);
        if (!event) return null;
        return { event, message: rec.message, xp: rec.xp };
      })
      .filter((item): item is { event: ExtendedEventData; message: string; xp: number } => item !== null);
  }, [upcomingEvents]);

  const filteredEvents = useMemo(() => {
    if (selectedCategory === "All") return upcomingEvents;
    return upcomingEvents.filter((event) => event.category === selectedCategory);
  }, [upcomingEvents, selectedCategory]);

  const remainingEvents = filteredEvents.filter((event) => {
    const idsToHide = new Set([
      spotlightEvent?.id,
      ...trendingEvents.map((item) => item.id),
      ...recommendedEvents.map((item) => item.event.id),
    ]);
    return !idsToHide.has(event.id);
  });

  const totalThisWeek = upcomingEvents.filter((event) => {
    const eventDate = new Date(event.event_date);
    const weekAway = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return eventDate <= weekAway;
  }).length;

  const totalRSVPs = upcomingEvents.reduce((sum, event) => sum + event.rsvp_count, 0);

  const topCategories = useMemo(() => {
    const counts = upcomingEvents.reduce<Record<string, number>>((acc, event) => {
      if (!event.category) return acc;
      acc[event.category] = (acc[event.category] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);
  }, [upcomingEvents]);

  const handleAddToJourney = (event: ExtendedEventData) => {
    recordAction({
      id: `event-journey-${event.id}-${Date.now()}`,
      label: `Added ${event.title} to Journey`,
      category: "events",
      xp: 24,
      impactPoints: 20,
      impactHours: 0.5,
      reminder: {
        title: `Reminder: ${event.title}`,
        dueAt: new Date(new Date(event.event_date).getTime() - 24 * 60 * 60 * 1000).toISOString(),
        channel: "in-app",
      },
    });
    setSelectedEventId(event.id);
  };

  const handleAskKnuut = () => {
    window.location.href = "/knuut-voice";
  };

  const handleShowTrending = () => {
    document.getElementById("trending-events")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTabChange = (tab: string) => {
    if (tab === "explore") {
      window.location.href = "/";
      return;
    }
    setActiveTab(tab);
  };

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} onLearnFinnishClick={handleLearnFinnishClick} />

      <main
        style={{
          flex: 1,
          padding: "40px 28px",
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
            padding: "42px 36px",
            background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 50%, #ec4899 100%)",
            color: "#f8fafc",
            overflow: "hidden",
            boxShadow: "0 30px 60px rgba(30,64,175,0.25)",
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
              opacity: 0.18,
            }}
          />
          <div
            style={{
              position: "relative",
              display: "flex",
              flexWrap: "wrap",
              gap: 32,
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ maxWidth: 540, display: "grid", gap: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", opacity: 0.85 }}>
                Kajaani Events Pulse
              </span>
              <h1 style={{ margin: 0, fontSize: "2.8rem", lineHeight: 1.05, fontWeight: 800 }}>
                Discover what’s happening near you
              </h1>
              <p style={{ margin: 0, fontSize: "1.05rem", lineHeight: 1.6, opacity: 0.9 }}>
                Your next step could be a coffee chat, a workshop, or a walk in the park. Pick one to keep your Journey growing.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <button
                  type="button"
                  onClick={handleShowTrending}
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
                  Show events near me
                </button>
                <button
                  type="button"
                  onClick={handleAskKnuut}
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
                  Ask Knuut for ideas
                </button>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gap: 12,
                padding: 18,
                borderRadius: 20,
                background: "rgba(15,23,42,0.25)",
                border: "1px solid rgba(148,163,184,0.35)",
                minWidth: 210,
              }}
            >
              <div>
                <span style={{ fontSize: 12, opacity: 0.85 }}>This week</span>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{totalThisWeek}</div>
                <p style={{ margin: 0, fontSize: 12, opacity: 0.75 }}>events with space left</p>
              </div>
              <div>
                <span style={{ fontSize: 12, opacity: 0.85 }}>Community RSVP</span>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{totalRSVPs}</div>
                <p style={{ margin: 0, fontSize: 12, opacity: 0.75 }}>people already attending</p>
              </div>
            </div>
          </div>
        </section>

        {spotlightEvent && (
          <section
            style={{
              borderRadius: 28,
              padding: 28,
              background: "#fff",
              border: "1px solid #e2e8f0",
              boxShadow: "0 20px 40px rgba(15,23,42,0.08)",
              display: "grid",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.3, color: "#2563eb" }}>
                  Spotlight event
                </p>
                <h2 style={{ margin: "6px 0", fontSize: 26, fontWeight: 800, color: "#0f172a" }}>{spotlightEvent.title}</h2>
                <p style={{ margin: 0, fontSize: 14.5, color: "#475569", maxWidth: 600 }}>{spotlightEvent.description}</p>
              </div>
              <div
                style={{
                  display: "grid",
                  gap: 8,
                  textAlign: "right",
                  fontSize: 13,
                  color: "#475569",
                }}
              >
                <span>
                  {formatEventDateTime(spotlightEvent.event_date)} · {formatEventTime(spotlightEvent.event_date)}
                </span>
                <span>{spotlightEvent.location_name}</span>
                <span style={{ fontWeight: 700, color: "#22c55e" }}>🟢 {spotlightEvent.rsvp_count} attending</span>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <button
                type="button"
                onClick={() => handleAddToJourney(spotlightEvent)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 14,
                  border: "none",
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Add to Journey
              </button>
              <button
                type="button"
                onClick={() => setSelectedEventId(spotlightEvent.id)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 14,
                  border: "1px solid #cbd5f5",
                  background: "#f8fafc",
                  color: "#1d4ed8",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                View on map
              </button>
            </div>
          </section>
        )}

        <section id="trending-events" style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>Trending this week</h2>
            <span style={{ fontSize: 13, color: "#64748b" }}>These are filling up fast</span>
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
            {trendingEvents.map((event) => (
              <article
                key={event.id}
                style={{
                  minWidth: 240,
                  maxWidth: 260,
                  borderRadius: 22,
                  padding: 18,
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 16px 32px rgba(148,163,184,0.12)",
                  display: "grid",
                  gap: 12,
                }}
              >
                <div style={{ display: "grid", gap: 4 }}>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a" }}>{event.title}</h3>
                  <span style={{ fontSize: 12.5, color: "#475569" }}>
                    {formatEventDateTime(event.event_date)} · {formatEventTime(event.event_date)}
                  </span>
                  <span style={{ fontSize: 12, color: "#1d4ed8", fontWeight: 600 }}>{event.location_name}</span>
                  <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>👥 {event.rsvp_count} attending</span>
                </div>
                <p style={{ margin: 0, fontSize: 12.5, color: "#475569" }}>{event.description.slice(0, 80)}…</p>
                <button
                  type="button"
                  onClick={() => handleAddToJourney(event)}
                  style={{
                    padding: "9px 14px",
                    borderRadius: 12,
                    border: "1px solid #dbeafe",
                    background: "#f8fafc",
                    color: "#1d4ed8",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Join
                </button>
              </article>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: 18 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>Explore by category</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: 12,
            }}
          >
            {CATEGORY_METADATA.map((category) => {
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    borderRadius: 16,
                    border: isActive ? "2px solid rgba(37,99,235,0.65)" : "1px solid #e2e8f0",
                    background: isActive ? "linear-gradient(135deg, #dbeafe, #ede9fe)" : "#fff",
                    padding: "14px 16px",
                    display: "grid",
                    gap: 6,
                    justifyItems: "center",
                    cursor: "pointer",
                    fontWeight: 600,
                    color: isActive ? "#1d4ed8" : "#475569",
                  }}
                >
                  <span style={{ fontSize: 24 }}>{category.icon}</span>
                  <span style={{ fontSize: 13 }}>{category.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {recommendedEvents.length > 0 && (
          <section
            style={{
              borderRadius: 26,
              padding: 28,
              background: "linear-gradient(135deg, #e0f2fe 0%, #eef2ff 100%)",
              border: "1px solid #bfdbfe",
              boxShadow: "0 24px 40px rgba(59,130,246,0.15)",
              display: "grid",
              gap: 18,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>Upcoming for you</h2>
                <p style={{ margin: "6px 0 0 0", fontSize: 14.5, color: "#475569" }}>
                  Knuut spotted these based on your goals — choose one and keep your Journey growing.
                </p>
              </div>
              <span style={{ fontSize: 13, color: "#1d4ed8", fontWeight: 600 }}>Updated a few minutes ago</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 16,
              }}
            >
              {recommendedEvents.map(({ event, message, xp }) => (
                <article
                  key={event.id}
                  style={{
                    borderRadius: 20,
                    padding: 20,
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 14px 28px rgba(148,163,184,0.14)",
                    display: "grid",
                    gap: 12,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{event.title}</h3>
                      <span style={{ fontSize: 12.5, color: "#475569" }}>{message}</span>
                    </div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: 999,
                        background: "rgba(34,197,94,0.16)",
                        color: "#15803d",
                      }}
                    >
                      +{xp} XP
                    </span>
                  </div>
                  <div style={{ fontSize: 12.5, color: "#475569" }}>
                    {formatEventDateTime(event.event_date)} · {formatEventTime(event.event_date)} · {event.location_name}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddToJourney(event)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 14,
                      border: "none",
                      background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Join and earn XP
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        <EventsOverviewMap
          events={filteredEvents.slice(0, 6)}
          selectedEventId={selectedEventId}
          onSelect={(event) => {
            setSelectedEventId(event.id);
          }}
          onAddToJourney={handleAddToJourney}
        />

        <section
          style={{
            borderRadius: 24,
            padding: 24,
            background: "#fff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 18px 32px rgba(71,85,105,0.12)",
            display: "grid",
            gap: 18,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>Quick insights</h2>
            <button
              type="button"
              onClick={() => document.getElementById("all-events")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                padding: "10px 16px",
                borderRadius: 14,
                border: "1px solid #cbd5f5",
                background: "#f8fafc",
                color: "#1d4ed8",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              See all events →
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
            }}
          >
            <div
              style={{
                borderRadius: 16,
                padding: 18,
                background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))",
                border: "1px solid rgba(59,130,246,0.18)",
                display: "grid",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 12, letterSpacing: 0.5, textTransform: "uppercase", color: "#1d4ed8", fontWeight: 700 }}>
                This week
              </span>
              <strong style={{ fontSize: 24, color: "#0f172a" }}>{totalThisWeek}</strong>
              <span style={{ fontSize: 12.5, color: "#475569" }}>events you can still join</span>
            </div>
            <div
              style={{
                borderRadius: 16,
                padding: 18,
                background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(134,239,172,0.06))",
                border: "1px solid rgba(34,197,94,0.18)",
                display: "grid",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 12, letterSpacing: 0.5, textTransform: "uppercase", color: "#15803d", fontWeight: 700 }}>
                RSVP pulse
              </span>
              <strong style={{ fontSize: 24, color: "#0f172a" }}>{totalRSVPs}</strong>
              <span style={{ fontSize: 12.5, color: "#475569" }}>Kajaani neighbours already attending</span>
            </div>
            <div
              style={{
                borderRadius: 16,
                padding: 18,
                background: "linear-gradient(135deg, rgba(236,72,153,0.1), rgba(244,114,182,0.06))",
                border: "1px solid rgba(236,72,153,0.2)",
                display: "grid",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 12, letterSpacing: 0.5, textTransform: "uppercase", color: "#be185d", fontWeight: 700 }}>
                Top categories
              </span>
              <strong style={{ fontSize: 16, color: "#0f172a" }}>{topCategories.join(" · ") || "TBA"}</strong>
              <span style={{ fontSize: 12.5, color: "#475569" }}>Most requested by the community</span>
            </div>
          </div>
        </section>

        <section id="all-events" style={{ display: "grid", gap: 18 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>All upcoming</h2>
          <p style={{ margin: 0, fontSize: 13.5, color: "#64748b" }}>
            Filtered by: {selectedCategory === "All" ? "All categories" : selectedCategory}. Add one to your Journey to earn XP.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {remainingEvents.map((event) => (
              <article
                key={event.id}
                style={{
                  borderRadius: 20,
                  padding: 18,
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 12px 24px rgba(148,163,184,0.1)",
                  display: "grid",
                  gap: 10,
                }}
              >
                <div style={{ display: "grid", gap: 4 }}>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a" }}>{event.title}</h3>
                  <span style={{ fontSize: 12.5, color: "#475569" }}>
                    {formatEventDateTime(event.event_date)} · {formatEventTime(event.event_date)}
                  </span>
                  <span style={{ fontSize: 12, color: "#1d4ed8", fontWeight: 600 }}>{event.location_name}</span>
                </div>
                <p style={{ margin: 0, fontSize: 12.5, color: "#475569" }}>{event.description.slice(0, 90)}…</p>
                <button
                  type="button"
                  onClick={() => handleAddToJourney(event)}
                  style={{
                    padding: "9px 14px",
                    borderRadius: 12,
                    border: "1px solid #dbeafe",
                    background: "#f8fafc",
                    color: "#1d4ed8",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Add to Journey
                </button>
              </article>
            ))}
            {remainingEvents.length === 0 && (
              <div
                style={{
                  borderRadius: 18,
                  padding: 24,
                  background: "#fff",
                  border: "1px dashed #cbd5f5",
                  textAlign: "center",
                  color: "#475569",
                  fontWeight: 600,
                }}
              >
                No events in this category yet — try another tag or ask Knuut for ideas.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
