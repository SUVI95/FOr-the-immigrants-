"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import EventCard, { EventData } from "@/components/EventCard";
import { useUserProfile } from "@/context/UserProfileContext";

// Extended EventData with categories
interface ExtendedEventData extends EventData {
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
    description: "Join us for a casual conversation practice session. Practice your Finnish with native speakers and other learners. Coffee and snacks provided!",
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
    photos: ["event1_photo1.jpg", "event1_photo2.jpg"],
    feedback_count: 8,
    avg_rating: 4.7,
  },
  {
    id: "2",
    title: "Welcome to Kajaani - Newcomers Meetup",
    description: "A meetup for newcomers to Kajaani. Learn about local services, make friends, and get tips on living in Kajaani. All welcome!",
    event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location_name: "Kajaani Cultural Center",
    location_lat: 64.2271,
    location_lng: 27.7285,
    rsvp_count: 8,
    category: "Integration Support",
    tags: ["Newcomers", "Networking", "Welcome"],
    featured: true,
    organizer: "Kajaani Welcome Committee",
    max_capacity: 50,
    photos: ["event2_photo1.jpg"],
    feedback_count: 12,
    avg_rating: 4.9,
  },
  {
    id: "3",
    title: "Nordic Walking Group",
    description: "Join our weekly Nordic walking group! All fitness levels welcome. We'll explore beautiful trails around Kajaani.",
    event_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    location_name: "Kajaani Park",
    location_lat: 64.2200,
    location_lng: 27.7300,
    rsvp_count: 15,
    category: "Sports & Wellness",
    tags: ["Fitness", "Outdoor", "Weekly"],
    organizer: "Kajaani Sports Club",
    max_capacity: 25,
    avg_rating: 4.5,
  },
  {
    id: "4",
    title: "Integration Workshop: Kela & DVV",
    description: "Learn how to register with Kela and DVV, understand your rights and benefits. Representatives from both organizations will be present.",
    event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    location_name: "Kajaani City Hall",
    location_lat: 64.2271,
    location_lng: 27.7285,
    rsvp_count: 25,
    category: "Workshop",
    tags: ["Kela", "DVV", "Administrative", "Official"],
    featured: true,
    organizer: "Kajaani City Services",
    max_capacity: 40,
    feedback_count: 20,
    avg_rating: 4.8,
  },
  {
    id: "5",
    title: "International Food Night",
    description: "Share your favorite dishes and learn about different cultures! Bring a dish from your home country or just come to enjoy. Everyone welcome!",
    event_date: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString(),
    location_name: "Kajaani Community Center",
    location_lat: 64.2250,
    location_lng: 27.7250,
    rsvp_count: 20,
    category: "Cultural",
    tags: ["Food", "Cultural Exchange", "Social"],
    organizer: "Kajaani Cultural Exchange",
    max_capacity: 60,
    photos: ["event5_photo1.jpg", "event5_photo2.jpg", "event5_photo3.jpg"],
    feedback_count: 15,
    avg_rating: 4.9,
  },
  {
    id: "6",
    title: "Job Search Support Group",
    description: "Get help with your job search in Finland. CV tips, interview preparation, networking opportunities. Bring your CV for feedback!",
    event_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    location_name: "TE Services Kajaani",
    location_lat: 64.2271,
    location_lng: 27.7285,
    rsvp_count: 18,
    category: "Professional Development",
    tags: ["Job Search", "CV", "Career", "Networking"],
    organizer: "TE Services",
    max_capacity: 35,
    avg_rating: 4.6,
  },
  {
    id: "7",
    title: "Sauna Evening",
    description: "Experience Finnish sauna culture! Traditional sauna experience followed by refreshments. Respectful and inclusive atmosphere.",
    event_date: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString(),
    location_name: "Kajaani Sauna Center",
    location_lat: 64.2300,
    location_lng: 27.7350,
    rsvp_count: 10,
    category: "Cultural",
    tags: ["Sauna", "Finnish Culture", "Relaxation"],
    organizer: "Kajaani Cultural Center",
    max_capacity: 20,
    avg_rating: 4.4,
  },
  {
    id: "8",
    title: "Children's Playgroup",
    description: "A playgroup for families with young children. Meet other parents, let kids play together. Activities and snacks for children.",
    event_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    location_name: "Kajaani Family Center",
    location_lat: 64.2250,
    location_lng: 27.7285,
    rsvp_count: 14,
    category: "Family",
    tags: ["Children", "Family", "Playgroup"],
    organizer: "Kajaani Family Services",
    max_capacity: 30,
    avg_rating: 4.7,
  },
];

// AI Recommendations (mockup - would come from backend)
const aiRecommendations = [
  {
    eventId: "1",
    reason: "Matches your Finnish level (A1) and interest in language learning",
  },
  {
    eventId: "4",
    reason: "You haven't attended a Kela session yet - essential for integration",
  },
  {
    eventId: "2",
    reason: "Perfect for newcomers - helps you meet people and learn about Kajaani",
  },
];

// City Dashboard Data
const cityMetrics = {
  totalAttendeesThisMonth: 342,
  topActivities: [
    { name: "Language Café", count: 89 },
    { name: "Integration Workshops", count: 67 },
    { name: "Cultural Events", count: 54 },
    { name: "Job Support", count: 43 },
    { name: "Family Activities", count: 31 },
  ],
  retentionRate: 78, // % who joined 2+ events stayed 6+ months
  satisfactionScore: 4.7, // Average feedback rating
  eventsThisMonth: 24,
  volunteersActive: 45,
};

const eventCategories = [
  "All",
  "Language Learning",
  "Integration Support",
  "Sports & Wellness",
  "Workshop",
  "Cultural",
  "Professional Development",
  "Family",
];

const EVENT_MAP_BACKGROUND = (() => {
  const svg = `
    <svg width="800" height="520" viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg">
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
      <rect width="800" height="520" fill="url(#bg)" rx="28"/>
      <g stroke="#c9d8f8" stroke-width="14" stroke-linecap="round" fill="none" opacity="0.75">
        <path d="M60 120 L200 150 L340 140 L480 160 L660 140"/>
        <path d="M80 280 C140 260, 220 270, 320 230 C420 190, 540 220, 680 200"/>
        <path d="M110 420 L220 370 L320 390 L430 350 L560 360 L710 320"/>
      </g>
      <g stroke="#fdd6a3" stroke-width="12" stroke-linecap="round" fill="none" opacity="0.75">
        <path d="M100 80 L220 110 L300 100 L420 120"/>
        <path d="M520 300 L640 260 L720 240"/>
      </g>
      <circle cx="620" cy="150" r="120" fill="url(#pulse)"/>
      <circle cx="220" cy="360" r="80" fill="url(#pulse)" opacity="0.75"/>
      <circle cx="420" cy="210" r="48" fill="#c7d7fb" opacity="0.55"/>
      <circle cx="540" cy="400" r="34" fill="#c7d7fb" opacity="0.5"/>
    </svg>
  `;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
})();

function formatEventDateTime(dateString: string) {
  const date = new Date(dateString);
  const weekday = date.toLocaleDateString("en-GB", { weekday: "short" });
  const day = date.toLocaleDateString("en-GB", { day: "numeric" });
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${weekday} ${day} ${month}, ${time}`;
}

function EventsOverviewMap({
  events,
  selectedEventId,
  onSelect,
}: {
  events: ExtendedEventData[];
  selectedEventId: string | null;
  onSelect: (event: ExtendedEventData) => void;
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

  const getPosition = (event: ExtendedEventData) => {
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
        borderRadius: 20,
        padding: 24,
        background: "#fff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 16px 32px rgba(15, 23, 42, 0.08)",
        display: "grid",
        gridTemplateColumns: "minmax(220px, 1fr) minmax(280px, 1.2fr)",
        gap: 24,
        alignItems: "start",
      }}
    >
      <div>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.3, color: "#475569" }}>
          City radar
        </p>
        <h2 id="events-map" style={{ margin: "6px 0 10px 0", fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
          Map out what’s happening tonight
        </h2>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
          Tap a pin to add the event to your Journey. Each save updates your progress and sends smart reminders.
        </p>
      </div>
      <div
        style={{
          position: "relative",
          minHeight: 280,
          borderRadius: 20,
          overflow: "hidden",
          backgroundImage: EVENT_MAP_BACKGROUND,
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "1px solid #cbd5f5",
          boxShadow: "0 24px 40px rgba(148,163,184,0.25), inset 0 0 24px rgba(15,23,42,0.18)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            padding: "8px 14px",
            borderRadius: 12,
            background: "rgba(15,23,42,0.7)",
            color: "#f8fafc",
            fontSize: 11,
            letterSpacing: 0.3,
            zIndex: 4,
          }}
        >
          Tap a pin to follow an event
        </div>
        {mappedEvents.map((event) => {
          const position = getPosition(event);
          const isSelected = selectedEventId === event.id;
          return (
            <button
              key={event.id}
              type="button"
              onClick={() => onSelect(event)}
              style={{
                position: "absolute",
                left: `${position.xPercent}%`,
                top: `${position.yPercent}%`,
                transform: isSelected ? "translate(-50%, -50%) scale(1.08)" : "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                transition: "transform 0.2s ease",
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: isSelected ? "#22c55e" : "#2563eb",
                  border: isSelected ? "4px solid rgba(34, 197, 94, 0.45)" : "3px solid rgba(59, 130, 246, 0.35)",
                  boxShadow: isSelected ? "0 0 0 10px rgba(34, 197, 94, 0.24)" : "0 0 0 10px rgba(59, 130, 246, 0.18)",
                }}
              />
              <div
                style={{
                  minWidth: 180,
                  maxWidth: 220,
                  background: "rgba(255,255,255,0.95)",
                  borderRadius: 16,
                  padding: "10px 14px",
                  border: "1px solid rgba(15, 23, 42, 0.12)",
                  boxShadow: "0 12px 24px rgba(15, 23, 42, 0.1)",
                  textAlign: "left",
                }}
              >
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{event.title}</h3>
                <p style={{ margin: "6px 0 4px 0", fontSize: 12, color: "#475569" }}>{event.location_name}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#2563eb", fontWeight: 600 }}>
                  +{event.rsvp_count} attending
                </p>
              </div>
            </button>
          );
        })}
        {selectedEvent && (
          <div
            style={{
              position: "absolute",
              top: 18,
              right: 18,
              background: "rgba(15,23,42,0.92)",
              color: "#f8fafc",
              borderRadius: 12,
              padding: "12px 14px",
              width: 210,
              boxShadow: "0 14px 24px rgba(15,23,42,0.28)",
              border: "1px solid rgba(148,163,184,0.25)",
              zIndex: 5,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{selectedEvent.title}</h3>
                <div style={{ fontSize: 10, opacity: 0.85 }}>{formatEventDateTime(selectedEvent.event_date)}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#38bdf8" }}>+{selectedEvent.rsvp_count}</span>
            </div>
            <p style={{ margin: "0 0 6px 0", fontSize: 10.5, lineHeight: 1.45 }}>
              {selectedEvent.description.slice(0, 90)}
              {selectedEvent.description.length > 90 ? "…" : ""}
            </p>
            <div style={{ fontSize: 10.5, opacity: 0.8, marginBottom: 6 }}>{selectedEvent.location_name}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => onSelect(selectedEvent)}
                style={{
                  padding: "7px 12px",
                  borderRadius: 9,
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
                onClick={() => window.open(`https://www.google.com/maps?q=${selectedEvent.location_lat},${selectedEvent.location_lng}`, "_blank")}
                style={{
                  padding: "7px 12px",
                  borderRadius: 9,
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
        )}
      </div>
    </section>
  );
}
export default function EventsPage() {
  const { state: userState, recordAction } = useUserProfile();
  const [activeTab, setActiveTab] = useState("explore");
  const [events] = useState<ExtendedEventData[]>(mockEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedEvents, setSavedEvents] = useState<Set<string>>(new Set());
  const [showCityDashboard, setShowCityDashboard] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [autoReminders, setAutoReminders] = useState(true);

  // Filter and search logic
  const filteredEvents = useMemo(() => {
    const filtered = events.filter((event) => {
      const isUpcoming = new Date(event.event_date) > new Date();
      const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return isUpcoming && matchesCategory && matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      const dateA = new Date(a.event_date).getTime();
      const dateB = new Date(b.event_date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      return b.rsvp_count - a.rsvp_count;
    });
  }, [events, searchQuery, selectedCategory]);

  const upcomingReminders = useMemo(() => {
    return userState.reminders
      .filter((reminder) => new Date(reminder.dueAt) > new Date())
      .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
      .slice(0, 4);
  }, [userState.reminders]);

  const featuredEvents = filteredEvents.filter((e) => e.featured);
  const regularEvents = filteredEvents.filter((e) => !e.featured);
  const recommendedEvents = aiRecommendations
    .map((rec) => events.find((e) => e.id === rec.eventId))
    .filter((e): e is ExtendedEventData => e !== undefined && filteredEvents.includes(e));

  const handleRSVP = async (eventId: string) => {
    const event = events.find((item) => item.id === eventId);
    if (event) {
      const reminderDate = new Date(new Date(event.event_date).getTime() - 24 * 60 * 60 * 1000);
      recordAction({
        id: `event-rsvp-${eventId}-${Date.now()}`,
        label: `RSVPed to ${event.title}`,
        category: "events",
        xp: 24,
        impactPoints: 20,
        impactHours: 0.5,
        reminder:
          reminderDate > new Date()
            ? {
                title: `Reminder: ${event.title}`,
                dueAt: reminderDate.toISOString(),
                channel: "in-app",
              }
            : undefined,
      });
    }
    alert("RSVP noted — we will sync this with organizers as the backend comes online.");
  };

  const handleViewMap = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const handleSaveEvent = (eventId: string) => {
    const alreadySaved = savedEvents.has(eventId);
    setSavedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
    if (!alreadySaved) {
      const event = events.find((item) => item.id === eventId);
      if (event) {
        recordAction({
          id: `event-save-${eventId}-${Date.now()}`,
          label: `Saved event ${event.title}`,
          category: "events",
          xp: 12,
          impactPoints: 10,
          reminder: {
            title: `Check saved event: ${event.title}`,
            dueAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
            channel: "in-app",
          },
        });
      }
    }
  };

  const handleShareEvent = (event: ExtendedEventData) => {
    const url = `${window.location.origin}/events/${event.id}`;
    const text = `Check out this event: ${event.title} on ${new Date(event.event_date).toLocaleDateString()}`;
    
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: text,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Event link copied to clipboard!");
    }
    recordAction({
      id: `event-share-${event.id}-${Date.now()}`,
      label: `Shared event ${event.title}`,
      category: "events",
      xp: 10,
      impactPoints: 8,
    });
  };

  const handleExportToCalendar = (event: ExtendedEventData) => {
    const startDate = new Date(event.event_date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Knuut AI//Events//EN
BEGIN:VEVENT
UID:${event.id}@knuut.ai
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location_name}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, "-")}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    
    // Set reminder notification
    alert(`Event added to calendar! Knuut will remind you 1 day before the event.`);
    recordAction({
      id: `event-calendar-${event.id}-${Date.now()}`,
      label: `Exported ${event.title} to calendar`,
      category: "events",
      xp: 15,
      impactPoints: 12,
      reminder: {
        title: `Calendar reminder: ${event.title}`,
        dueAt: new Date(startDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        channel: "email",
      },
    });
  };

  const handleMapSelect = (event: ExtendedEventData) => {
    setSelectedEventId(event.id);
    recordAction({
      id: `event-map-${event.id}-${Date.now()}`,
      label: `Viewed ${event.title} on map`,
      category: "events",
      xp: 8,
      impactPoints: 6,
    });
  };

  const handleAddToPathway = (event: ExtendedEventData) => {
    setSelectedEventId(event.id);
    recordAction({
      id: `event-pathway-${event.id}-${Date.now()}`,
      label: `Added event to pathway: ${event.title}`,
      category: "events",
      xp: 28,
      impactPoints: 24,
      impactHours: 0.25,
      reminder: {
        title: `Prepare for ${event.title}`,
        dueAt: new Date(new Date(event.event_date).getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        channel: "in-app",
      },
    });
    alert(`${event.title} is now in your My Pathway plan!`);
  };

  const handleRequestReminder = (event: ExtendedEventData) => {
    setSelectedEventId(event.id);
    recordAction({
      id: `event-ai-reminder-${event.id}-${Date.now()}`,
      label: `Requested AI reminder for ${event.title}`,
      category: "events",
      xp: 10,
      impactPoints: 9,
      reminder: {
        title: `Reminder AI: ${event.title}`,
        dueAt: new Date(new Date(event.event_date).getTime() - 12 * 60 * 60 * 1000).toISOString(),
        channel: "sms",
      },
    });
    alert("We will nudge you 12 hours before the event.");
  };

  const handleReportEvent = (event: ExtendedEventData) => {
    recordAction({
      id: `event-report-${event.id}-${Date.now()}`,
      label: `Reported event ${event.title}`,
      category: "safety",
      xp: 0,
      impactPoints: 5,
      metadata: { reason: "user_flagged_event" },
    });
    alert("Thanks for flagging this. Moderators will review the event.");
  };

  const toggleAutoReminders = () => {
    setAutoReminders((prev) => !prev);
    recordAction({
      id: `event-auto-reminders-${Date.now()}`,
      label: autoReminders ? "Disabled AI event reminders" : "Enabled AI event reminders",
      category: "events",
      xp: 5,
      impactPoints: 4,
    });
  };

  const handleVoiceAssistant = () => {
    window.location.href = "/knuut-voice";
  };

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };
  const handleTabChange = (tab: string) => {
    if (tab === "explore") {
      window.location.href = "/";
      return;
    }
    setActiveTab(tab);
  };

  // Statistics
  const totalUpcoming = events.filter((e) => new Date(e.event_date) > new Date()).length;
  const totalRSVPs = events.reduce((sum, e) => sum + e.rsvp_count, 0);
  const totalCategories = new Set(events.map((e) => e.category).filter(Boolean)).size;
  const thisWeekEvents = events.filter((e) => {
    const eventDate = new Date(e.event_date);
    const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return eventDate > new Date() && eventDate <= weekFromNow;
  }).length;

  const spotlightEvent = recommendedEvents[0] ?? featuredEvents[0] ?? regularEvents[0] ?? null;

  return (
    <div className="app">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onLearnFinnishClick={handleLearnFinnishClick} 
      />

      <main style={{ 
        maxWidth: "1400px", 
        margin: "0 auto", 
        padding: "40px 20px",
        background: "#fafafa",
        minHeight: "100vh"
      }}>
        {/* Hero Section */}
        <section
          style={{
            position: "relative",
            marginBottom: "36px",
            padding: "44px 40px",
            borderRadius: 28,
            background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 40%, #ec4899 100%)",
            color: "#f8fafc",
            boxShadow: "0 32px 60px rgba(30,64,175,0.28)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80')",
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
              gap: 36,
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div style={{ maxWidth: 520, display: "grid", gap: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.6, textTransform: "uppercase", opacity: 0.85 }}>
                Kajaani events pulse
              </span>
              <h1 style={{ margin: 0, fontSize: "2.9rem", lineHeight: 1.05, fontWeight: 800 }}>
                Where will you show up next?
              </h1>
              <p style={{ margin: 0, fontSize: "1.1rem", lineHeight: 1.6, opacity: 0.88 }}>
                Track new meetups, language cafés, and integration nights curated by Knuut AI. Every RSVP grows your Journey and
                unlocks badges faster.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <div
                  style={{
                    padding: "12px 18px",
                    borderRadius: 14,
                    background: "rgba(15,23,42,0.25)",
                    border: "1px solid rgba(148,163,184,0.42)",
                    minWidth: 180,
                  }}
                >
                  <div style={{ fontSize: 12, opacity: 0.9 }}>On the calendar</div>
                  <div style={{ fontSize: 26, fontWeight: 700 }}>{totalUpcoming}</div>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>upcoming events</div>
                </div>
                <div
                  style={{
                    padding: "12px 18px",
                    borderRadius: 14,
                    background: "rgba(15,23,42,0.25)",
                    border: "1px solid rgba(148,163,184,0.42)",
                    minWidth: 180,
                  }}
                >
                  <div style={{ fontSize: 12, opacity: 0.9 }}>This week</div>
                  <div style={{ fontSize: 26, fontWeight: 700 }}>{thisWeekEvents}</div>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>events to explore</div>
                </div>
                <div
                  style={{
                    padding: "12px 18px",
                    borderRadius: 14,
                    background: "rgba(15,23,42,0.25)",
                    border: "1px solid rgba(148,163,184,0.42)",
                    minWidth: 200,
                  }}
                >
                  <div style={{ fontSize: 12, opacity: 0.9 }}>Community RSVP</div>
                  <div style={{ fontSize: 26, fontWeight: 700 }}>{totalRSVPs}</div>
                  <div style={{ fontSize: 12, opacity: 0.75 }}>across {totalCategories} categories</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={handleVoiceAssistant}
                  style={{
                    flex: "1 1 140px",
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "1px solid rgba(248,250,252,0.45)",
                    background: "rgba(248,250,252,0.14)",
                    color: "#f8fafc",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <span aria-hidden>🎤</span>
                  Ask Knuut for ideas
                </button>
                <button
                  type="button"
                  onClick={() => setShowCityDashboard((prev) => !prev)}
                  style={{
                    flex: "1 1 140px",
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "none",
                    background: "rgba(248,250,252,0.92)",
                    color: "#1d4ed8",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {showCityDashboard ? "Hide city insights" : "Show city insights"}
                </button>
              </div>
            </div>

            {spotlightEvent && (
              <div
                style={{
                  flex: "1 1 280px",
                  maxWidth: 320,
                  background: "rgba(15,23,42,0.32)",
                  borderRadius: 20,
                  padding: "24px",
                  border: "1px solid rgba(148,163,184,0.45)",
                  boxShadow: "0 18px 32px rgba(15,23,42,0.28)",
                  display: "grid",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 12, opacity: 0.85, letterSpacing: 0.4, textTransform: "uppercase" }}>Spotlight event</div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{spotlightEvent.title}</h2>
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>{formatEventDateTime(spotlightEvent.event_date)}</div>
                <p style={{ fontSize: 12, lineHeight: 1.6, opacity: 0.85, margin: 0 }}>
                  {spotlightEvent.description.slice(0, 160)}{spotlightEvent.description.length > 160 ? "…" : ""}
                </p>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{spotlightEvent.location_name}</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedEventId(spotlightEvent.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    style={{
                      flex: "1 1 120px",
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: "none",
                      background: "linear-gradient(135deg, #22c55e, #16a34a)",
                      color: "#fff",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    View on map
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddToPathway(spotlightEvent)}
                    style={{
                      flex: "1 1 120px",
                      padding: "10px 14px",
                      borderRadius: 12,
                      border: "1px solid rgba(248,250,252,0.45)",
                      background: "rgba(248,250,252,0.12)",
                      color: "#f8fafc",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Add to Journey
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <EventsOverviewMap
          events={filteredEvents}
          selectedEventId={selectedEventId}
          onSelect={handleMapSelect}
        />

        <section
           style={{
            borderRadius: 18,
            padding: "16px 18px",
            background: "rgba(250, 204, 21, 0.12)",
            border: "1px solid rgba(250, 204, 21, 0.45)",
            boxShadow: "0 12px 24px rgba(250, 204, 21, 0.18)",
            marginBottom: 28,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            maxWidth: 320,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>🔔</span>
              <div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#92400e" }}>
                  AI Reminders
                </p>
                <h3 style={{ margin: "4px 0 0 0", fontSize: 16, fontWeight: 700, color: "#78350f" }}>
                  Knuut keeps you one step ahead!
                </h3>
              </div>
            </div>
            <p style={{ margin: "8px 0 0 0", color: "#9a3412", lineHeight: 1.45, fontSize: 12 }}>
              Get gentle alerts before events and stay active on your journey.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleAutoReminders}
            style={{
              padding: "9px 14px",
              borderRadius: 999,
              border: "none",
              background: autoReminders ? "#facc15" : "rgba(250, 204, 21, 0.25)",
              color: "#78350f",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            {autoReminders ? "Disable AI reminders" : "Enable AI reminders"}
          </button>
          {upcomingReminders.length > 0 && (
            <div
              style={{
                borderRadius: 12,
                background: "rgba(255,255,255,0.85)",
                padding: 10,
                border: "1px solid rgba(250, 204, 21, 0.35)",
                display: "grid",
                gap: 6,
                fontSize: 11.5,
                color: "#92400e",
              }}
            >
              {upcomingReminders.slice(0, 2).map((reminder) => (
                <div key={reminder.id}>
                  <div style={{ fontWeight: 700 }}>{reminder.title}</div>
                  <div style={{ opacity: 0.75 }}>
                    {new Date(reminder.dueAt).toLocaleString()} · {reminder.channel}
                  </div>
                </div>
              ))}
              {upcomingReminders.length > 2 && (
                <div style={{ opacity: 0.65 }}>+{upcomingReminders.length - 2} more reminders scheduled</div>
              )}
            </div>
          )}
        </section>

        {/* City Dashboard */}
        {showCityDashboard && (
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            marginBottom: "30px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#1a1a1a" }}>
                📊 Kajaani Community Insights
              </h3>
              <button
                onClick={() => setShowCityDashboard(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                ×
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
              <div>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#667eea", marginBottom: "5px" }}>
                  {cityMetrics.totalAttendeesThisMonth}
                </div>
                <div style={{ color: "#666" }}>Attendees This Month</div>
              </div>
              <div>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981", marginBottom: "5px" }}>
                  {cityMetrics.retentionRate}%
                </div>
                <div style={{ color: "#666" }}>Retention (2+ events → 6+ months)</div>
              </div>
              <div>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#f59e0b", marginBottom: "5px" }}>
                  {cityMetrics.satisfactionScore.toFixed(1)}/5
                </div>
                <div style={{ color: "#666" }}>Average Satisfaction</div>
              </div>
              <div>
                <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#3b82f6", marginBottom: "5px" }}>
                  {cityMetrics.volunteersActive}
                </div>
                <div style={{ color: "#666" }}>Active Volunteers</div>
              </div>
            </div>
            <div style={{ marginTop: "25px", paddingTop: "25px", borderTop: "1px solid #e5e7eb" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "15px", color: "#1a1a1a" }}>
                Top 5 Community Activities
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {cityMetrics.topActivities.map((activity, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#374151" }}>{idx + 1}. {activity.name}</span>
                    <span style={{ fontWeight: "600", color: "#667eea" }}>{activity.count} participants</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div style={{ 
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "30px"
        }}>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: "1", minWidth: "250px" }}>
              <input
                type="text"
                placeholder="Search events, locations, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#667eea"}
                onBlur={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
              />
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {eventCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: "10px 20px",
                    background: selectedCategory === category 
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                      : "#f3f4f6",
                    color: selectedCategory === category ? "white" : "#374151",
                    border: "none",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    fontWeight: selectedCategory === category ? "600" : "500",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* AI Recommendations Section */}
      {recommendedEvents.length > 0 && (
        <div style={{ marginBottom: "50px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: "600", 
              color: "#1a1a1a",
            }}>
              Recommended for You
            </h2>
            <span style={{ 
              fontSize: "0.9rem", 
              color: "#666", 
              background: "#f3f4f6",
              padding: "4px 12px",
              borderRadius: "12px",
              marginLeft: "10px"
            }}>
              Powered by Knuut AI
            </span>
          </div>
          <div>
            {recommendedEvents.map((event, idx) => {
              const recommendation = aiRecommendations.find(r => r.eventId === event.id);
              return (
                <div
                  key={event.id}
                  style={{
                    marginBottom: "15px",
                    position: "relative",
                    border: event.id === selectedEventId ? "2px solid #2563eb" : "1px solid rgba(37, 99, 235, 0.15)",
                    borderRadius: 18,
                  }}
                >
                  <div style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: 10,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    maxWidth: "calc(100% - 20px)",
                    textAlign: "right",
                  }}>
                    <span style={{ marginRight: 8, opacity: 0.8 }}>#{idx + 1}</span>
                    💡 {recommendation?.reason}
                  </div>
                  <EventCard
                    event={event}
                    onRSVP={handleRSVP}
                    onViewMap={handleViewMap}
                    onAddToPathway={handleAddToPathway}
                    onRequestReminder={handleRequestReminder}
                    onReport={handleReportEvent}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Featured Events Section */}
      {featuredEvents.length > 0 && (
        <div style={{ marginBottom: "50px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <span style={{ fontSize: "1.5rem" }}>⭐</span>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: "600", 
              color: "#1a1a1a",
            }}>
              Featured Events
            </h2>
          </div>
          <div>
            {featuredEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  position: "relative",
                  marginBottom: "15px",
                  border: event.id === selectedEventId ? "2px solid #2563eb" : "1px solid rgba(37, 99, 235, 0.15)",
                  borderRadius: 18,
                }}
              >
                <div style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  zIndex: 10,
                  display: "flex",
                  gap: "5px",
                }}>
                  <button
                    onClick={() => handleSaveEvent(event.id)}
                    style={{
                      background: savedEvents.has(event.id) ? "#f59e0b" : "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                    title={savedEvents.has(event.id) ? "Saved" : "Save event"}
                  >
                    {savedEvents.has(event.id) ? "✓" : "☆"}
                  </button>
                  <button
                    onClick={() => handleShareEvent(event)}
                    style={{
                      background: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                    title="Share event"
                  >
                    🔗
                  </button>
                  <button
                    onClick={() => handleExportToCalendar(event)}
                    style={{
                      background: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    }}
                    title="Add to calendar & set reminder"
                  >
                    📅
                  </button>
                </div>
                <div style={{
                  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                  border: "2px solid #667eea",
                  borderRadius: "12px",
                  padding: "20px",
                }}>
                  <EventCard
                    event={event}
                    onRSVP={handleRSVP}
                    onViewMap={handleViewMap}
                    onAddToPathway={handleAddToPathway}
                    onRequestReminder={handleRequestReminder}
                    onReport={handleReportEvent}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Events Section */}
      {regularEvents.length > 0 && (
        <div style={{ marginBottom: "50px" }}>
          <h2 style={{ 
            fontSize: "1.8rem", 
            fontWeight: "600", 
            color: "#1a1a1a",
            marginBottom: "20px",
            paddingBottom: "10px",
            borderBottom: "2px solid #e5e5e5"
          }}>
            All Upcoming Events ({filteredEvents.length})
          </h2>
          <div>
            {regularEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  position: "relative",
                  marginBottom: "15px",
                  border: event.id === selectedEventId ? "2px solid #2563eb" : "1px solid rgba(203, 213, 225, 0.8)",
                  borderRadius: 16,
                }}
              >
                <div style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  zIndex: 10,
                  display: "flex",
                  gap: "5px",
                }}>
                  <button
                    onClick={() => handleSaveEvent(event.id)}
                    style={{
                      background: savedEvents.has(event.id) ? "#f59e0b" : "rgba(255,255,255,0.9)",
                      border: "none",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                    title={savedEvents.has(event.id) ? "Saved" : "Save event"}
                  >
                    {savedEvents.has(event.id) ? "✓" : "☆"}
                  </button>
                </div>
                <EventCard
                  event={event}
                  onRSVP={handleRSVP}
                  onViewMap={handleViewMap}
                  onAddToPathway={handleAddToPathway}
                  onRequestReminder={handleRequestReminder}
                  onReport={handleReportEvent}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Volunteer & Skills Exchange moved to its own page */}

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div style={{ 
          textAlign: "center", 
          padding: "80px 20px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🔍</div>
          <p style={{ fontSize: "1.5rem", color: "#374151", marginBottom: "10px", fontWeight: "600" }}>
            No events found
          </p>
          <p style={{ color: "#6b7280", marginBottom: "30px", maxWidth: "500px", margin: "0 auto 30px" }}>
            {searchQuery || selectedCategory !== "All"
              ? "Try adjusting your search or filters"
              : "Check back later for upcoming events in Kajaani!"}
          </p>
          {(searchQuery || selectedCategory !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              style={{
                padding: "12px 24px",
                background: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </main>
    </div>
  );
}
