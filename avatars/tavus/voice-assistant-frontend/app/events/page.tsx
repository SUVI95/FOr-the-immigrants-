"use client";

import { useState, useMemo } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import EventCard, { EventData } from "@/components/EventCard";

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

// Integration Pathway Data
interface IntegrationPathway {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  link: string;
  color: string;
}

// Volunteer Opportunity Data
interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  organization: string;
  time_commitment: string;
  location: string;
  skills_needed: string[];
  date: string;
}

// Skills Exchange Data
interface SkillsExchange {
  id: string;
  title: string;
  description: string;
  skills_offered: string[];
  skills_wanted: string[];
  location: string;
  contact: string;
}

// Mockup event data for Kajaani with enhanced fields
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

// Integration Pathways
const integrationPathways: IntegrationPathway[] = [
  {
    id: "1",
    title: "Find Your Local Neighborhood Group",
    description: "Connect with WhatsApp or Telegram communities in your area. Meet neighbors, share local tips, and build connections.",
    icon: "🏠",
    action: "Join Neighborhood Group",
    link: "#",
    color: "#3b82f6",
  },
  {
    id: "2",
    title: "Meet a Local Buddy",
    description: "Get paired with a volunteer local for language practice, cultural exchange, and friendship. One-click matching available!",
    icon: "💬",
    action: "Find My Buddy",
    link: "#",
    color: "#10b981",
  },
  {
    id: "3",
    title: "Career & Job Workshops",
    description: "Access training sessions, job fairs, and career development events. Build your professional network in Kajaani.",
    icon: "💼",
    action: "View Workshops",
    link: "#",
    color: "#f59e0b",
  },
];

// Volunteer Opportunities
const volunteerOpportunities: VolunteerOpportunity[] = [
  {
    id: "1",
    title: "Community Garden Maintenance",
    description: "Help maintain our community garden. Learn about Finnish gardening while giving back to the community.",
    organization: "Kajaani Green Initiative",
    time_commitment: "2 hours",
    location: "Kajaani Community Garden",
    skills_needed: ["Gardening", "General"],
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Language Exchange Volunteer",
    description: "Help newcomers practice Finnish while they teach you their language. Great for cultural exchange!",
    organization: "Kajaani Integration Center",
    time_commitment: "1-2 hours/week",
    location: "Various Locations",
    skills_needed: ["Finnish", "Teaching", "Patience"],
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "Children's Activity Helper",
    description: "Assist with children's playgroups and activities. Perfect for those who enjoy working with kids.",
    organization: "Kajaani Family Services",
    time_commitment: "2-3 hours/week",
    location: "Kajaani Family Center",
    skills_needed: ["Childcare", "Activities", "Patience"],
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Skills Exchange
const skillsExchange: SkillsExchange[] = [
  {
    id: "1",
    title: "Arabic ↔ Finnish Exchange",
    description: "Native Arabic speaker offers Arabic lessons in exchange for Finnish conversation practice.",
    skills_offered: ["Arabic Language", "Cooking (Middle Eastern)"],
    skills_wanted: ["Finnish Conversation", "Local Culture"],
    location: "Kajaani",
    contact: "Contact via Knuut AI",
  },
  {
    id: "2",
    title: "IT Skills ↔ Integration Help",
    description: "Software developer offers IT tutoring and web development help in exchange for integration guidance.",
    skills_offered: ["Web Development", "Programming", "IT Support"],
    skills_wanted: ["Integration Advice", "Finnish Bureaucracy Help"],
    location: "Kajaani",
    contact: "Contact via Knuut AI",
  },
  {
    id: "3",
    title: "Cooking ↔ Language Practice",
    description: "Share your traditional cooking skills while practicing Finnish conversation.",
    skills_offered: ["Traditional Cooking", "Recipe Sharing"],
    skills_wanted: ["Finnish Practice", "Cultural Exchange"],
    location: "Kajaani",
    contact: "Contact via Knuut AI",
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

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("explore");
  const [events] = useState<ExtendedEventData[]>(mockEvents);
  const [room] = useState(new Room());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedEvents, setSavedEvents] = useState<Set<string>>(new Set());
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showCityDashboard, setShowCityDashboard] = useState(false);

  // Filter and search logic
  const filteredEvents = useMemo(() => {
    let filtered = events.filter((event) => {
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

  const featuredEvents = filteredEvents.filter((e) => e.featured);
  const regularEvents = filteredEvents.filter((e) => !e.featured);
  const recommendedEvents = aiRecommendations
    .map((rec) => events.find((e) => e.id === rec.eventId))
    .filter((e): e is ExtendedEventData => e !== undefined && filteredEvents.includes(e));

  const handleRSVP = async (eventId: string) => {
    console.log("RSVP to event:", eventId);
    alert("RSVP functionality will be connected to the backend soon!");
  };

  const handleViewMap = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const handleSaveEvent = (eventId: string) => {
    setSavedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
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
  };

  const handleVoiceAssistant = () => {
    window.location.href = "/knuut-voice";
  };

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
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

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onLearnFinnishClick={handleLearnFinnishClick} 
        />

        <main style={{ 
          maxWidth: "1400px", 
          margin: "0 auto", 
          padding: "40px 20px",
          background: "#fafafa",
          minHeight: "100vh"
        }}>
          {/* Header Section */}
          <div style={{ marginBottom: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "20px" }}>
              <div style={{ flex: 1 }}>
                <h1 style={{ 
                  fontSize: "3rem", 
                  fontWeight: "bold", 
                  color: "#1a1a1a",
                  marginBottom: "10px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  Your Kajaani Life
                </h1>
                <p style={{ 
                  fontSize: "1.2rem", 
                  color: "#666",
                  maxWidth: "600px"
                }}>
                  Discover events, connect with your community, and build your life in Kajaani. Live, Work, Belong.
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {/* Language Translation Button */}
                <button
                  onClick={() => setSelectedLanguage(selectedLanguage === "en" ? "fi" : "en")}
                  style={{
                    padding: "10px 16px",
                    background: "white",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  title="Toggle Translation"
                >
                  🌐 {selectedLanguage === "en" ? "EN" : "FI"}
                </button>
                {/* Voice Assistant Button */}
                <button
                  onClick={handleVoiceAssistant}
                  style={{
                    padding: "10px 16px",
                    background: "white",
                    border: "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  title="Ask Knuut AI"
                >
                  🎤 Ask Knuut
                </button>
                <button
                  onClick={() => window.location.href = "/knuut-voice"}
                  style={{
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  + Create Event
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
              marginBottom: "30px"
            }}>
              <div style={{ 
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                color: "white"
              }}>
                <div style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "5px" }}>
                  {totalUpcoming}
                </div>
                <div style={{ opacity: 0.9 }}>Upcoming Events</div>
              </div>
              <div style={{ 
                background: "white",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                borderLeft: "4px solid #10b981"
              }}>
                <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#10b981", marginBottom: "5px" }}>
                  {totalRSVPs}
                </div>
                <div style={{ color: "#666" }}>Total RSVPs</div>
              </div>
              <div style={{ 
                background: "white",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                borderLeft: "4px solid #3b82f6"
              }}>
                <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#3b82f6", marginBottom: "5px" }}>
                  {thisWeekEvents}
                </div>
                <div style={{ color: "#666" }}>This Week</div>
              </div>
              <div style={{ 
                background: "white",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                borderLeft: "4px solid #f59e0b",
                cursor: "pointer",
              }}
              onClick={() => setShowCityDashboard(!showCityDashboard)}
              >
                <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#f59e0b", marginBottom: "5px" }}>
                  {cityMetrics.retentionRate}%
                </div>
                <div style={{ color: "#666" }}>Retention Rate</div>
                <div style={{ fontSize: "0.8rem", color: "#999", marginTop: "5px" }}>
                  Click for city insights →
                </div>
              </div>
            </div>

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
                    <div key={event.id} style={{ marginBottom: "15px", position: "relative" }}>
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
                        💡 {recommendation?.reason}
                      </div>
                      <EventCard
                        event={event}
                        onRSVP={handleRSVP}
                        onViewMap={handleViewMap}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Integration Pathways Section */}
          <div style={{ marginBottom: "50px" }}>
            <h2 style={{ 
              fontSize: "1.8rem", 
              fontWeight: "600", 
              color: "#1a1a1a",
              marginBottom: "20px",
            }}>
              🔗 Integration Pathways
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              marginBottom: "30px"
            }}>
              {integrationPathways.map((pathway) => (
                <div
                  key={pathway.id}
                  onClick={() => {
                    // In future, this would open Knuut AI chat
                    window.location.href = `/knuut-voice?action=${pathway.id}`;
                  }}
                  style={{
                    background: "white",
                    padding: "24px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    border: `2px solid ${pathway.color}`,
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                  }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: "15px" }}>
                    {pathway.icon}
                  </div>
                  <h3 style={{ 
                    fontSize: "1.3rem", 
                    fontWeight: "600", 
                    color: "#1a1a1a",
                    marginBottom: "10px"
                  }}>
                    {pathway.title}
                  </h3>
                  <p style={{ 
                    color: "#666",
                    marginBottom: "20px",
                    lineHeight: "1.6"
                  }}>
                    {pathway.description}
                  </p>
                  <button
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: pathway.color,
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {pathway.action} →
                  </button>
                </div>
              ))}
            </div>
          </div>

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
                  <div key={event.id} style={{ position: "relative", marginBottom: "15px" }}>
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
                  <div key={event.id} style={{ position: "relative", marginBottom: "15px" }}>
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
    </RoomContext.Provider>
  );
}
