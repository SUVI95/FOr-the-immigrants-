"use client";

import { useMemo, useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import GroupCard, { GroupData } from "@/components/GroupCard";

// Mockup group data for Kajaani - focused on retention and integration
const mockGroups: (GroupData & { category?: string })[] = [
  {
    id: "1",
    name: "Kajaani Integration Circle",
    description: "A supportive community for newcomers to Kajaani. Share experiences, get practical advice on living in Finland, and build lasting friendships. We meet weekly to discuss integration challenges, celebrate successes, and support each other through the journey.",
    group_type: "integration_support",
    category: "Integration Support",
    member_count: 45,
    location_name: "Kajaani Community Center",
    location_lat: 64.2250,
    location_lng: 27.7250,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    name: "Finnish Language Practice - Kajaani",
    description: "Regular meetups for practicing Finnish conversation. All levels welcome! Practice speaking, ask questions about grammar, and learn practical Finnish for daily life. Native speakers often join to help. Coffee and conversation in a friendly, relaxed atmosphere.",
    group_type: "language_exchange",
    category: "Language Learning",
    member_count: 38,
    location_name: "Kajaani Public Library",
    location_lat: 64.2271,
    location_lng: 27.7285,
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    name: "Mothers & Families Network Kajaani",
    description: "A group for mothers and families in Kajaani. Share parenting tips, organize playdates, support each other with childcare, and help newcomers navigate Finnish family services. Both Finnish and international families welcome!",
    group_type: "mothers_with_kids",
    category: "Family & Community",
    member_count: 52,
    location_name: "Kajaani Family Center",
    location_lat: 64.2250,
    location_lng: 27.7285,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    name: "Professional Network Kajaani",
    description: "Connect with professionals in Kajaani. Share job opportunities, CV tips, interview prep, and career advice. Regular networking events and workshops. Help each other succeed in the Finnish job market and build professional relationships.",
    group_type: "professional_network",
    category: "Professional Development",
    member_count: 28,
    location_name: "Kajaani Business Hub",
    location_lat: 64.2271,
    location_lng: 27.7285,
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    name: "Kajaani Cultural Exchange",
    description: "Celebrate diversity and learn about different cultures! Share food, traditions, music, and stories from our home countries. Open to everyone - both Finns and newcomers. Building bridges between cultures and creating understanding.",
    group_type: "cultural",
    category: "Cultural Exchange",
    member_count: 35,
    location_name: "Kajaani Cultural Center",
    location_lat: 64.2271,
    location_lng: 27.7285,
    created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    name: "Housing & Admin Support Kajaani",
    description: "Get help navigating housing, Kela, DVV, tax office, and other administrative tasks. Share experiences, tips, and resources. We help each other understand Finnish bureaucracy and avoid common pitfalls. Regular Q&A sessions with experienced members.",
    group_type: "admin_support",
    category: "Administrative Support",
    member_count: 42,
    location_name: "Kajaani City Services",
    location_lat: 64.2271,
    location_lng: 27.7285,
    created_at: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7",
    name: "Kajaani Sports & Wellness",
    description: "Stay active and healthy in Kajaani! Join us for outdoor activities, sports, Nordic walking, and wellness activities. Great way to meet people, stay healthy, and enjoy Finland's nature. All fitness levels welcome.",
    group_type: "sports",
    category: "Sports & Wellness",
    member_count: 31,
    location_name: "Kajaani Sports Center",
    location_lat: 64.2300,
    location_lng: 27.7350,
    created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "8",
    name: "Kajaani Tech & Entrepreneurs",
    description: "For tech professionals, entrepreneurs, and startup enthusiasts in Kajaani. Share ideas, collaborate on projects, get mentorship, and build a tech community. Regular meetups, workshops, and networking events.",
    group_type: "tech_business",
    category: "Tech & Business",
    member_count: 19,
    location_name: "Kajaani Innovation Hub",
    location_lat: 64.2271,
    location_lng: 27.7285,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "9",
    name: "Kajaani Students & Young Professionals",
    description: "A community for students and young professionals (18-35) in Kajaani. Social events, study groups, career planning, and friendships. Help each other navigate life as a student or young professional in Finland.",
    group_type: "students_young_adults",
    category: "Students & Young Adults",
    member_count: 27,
    location_name: "Kajaani University Campus",
    location_lat: 64.2271,
    location_lng: 27.7285,
    created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "10",
    name: "Kajaani Mental Health & Wellbeing",
    description: "A safe space to discuss mental health, stress, loneliness, and wellbeing. Support each other through challenges of integration and living abroad. Regular check-ins, resources, and peer support. Professional guidance available when needed.",
    group_type: "wellbeing_support",
    category: "Wellbeing & Support",
    member_count: 24,
    location_name: "Kajaani Wellness Center",
    location_lat: 64.2250,
    location_lng: 27.7300,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "11",
    name: "Kajaani Winter Survival Guide",
    description: "Learn how to thrive during Finnish winters! Tips on winter clothing, driving, activities, mental health during dark months, and making the most of winter. Help newcomers prepare and existing residents stay positive.",
    group_type: "seasonal_support",
    category: "Seasonal Support",
    member_count: 33,
    location_name: "Various Locations",
    location_lat: 64.2271,
    location_lng: 27.7285,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "12",
    name: "Kajaani Food & Cooking",
    description: "Learn Finnish recipes, share your traditional dishes, and discover local food culture. Cooking workshops, food swaps, restaurant reviews, and cultural food experiences. Everyone loves food!",
    group_type: "food_culture",
    category: "Food & Culture",
    member_count: 29,
    location_name: "Kajaani Community Kitchen",
    location_lat: 64.2250,
    location_lng: 27.7285,
    created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState("explore");
  const [groups] = useState<(GroupData & { category?: string })[]>(mockGroups);
  // Filters & toggles
  const [showBeginnerFriendly, setShowBeginnerFriendly] = useState(false);
  const [showChildcareFriendly, setShowChildcareFriendly] = useState(false);
  const [showMentorAvailable, setShowMentorAvailable] = useState(false);
  const [includeLocalsAndCompanies, setIncludeLocalsAndCompanies] = useState(true);
  const [room] = useState(new Room()); // Create a Room instance for context (not connected)

  const handleJoinGroup = async (groupId: string) => {
    // In the future, this will call the API
    console.log("Join group:", groupId);
    alert("Join functionality will be connected to the backend soon!");
  };

  const handleViewMap = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  // Lightweight heuristics for badges
  const getBadges = (g: GroupData & { category?: string }) => {
    const badges: string[] = [];
    if (g.category === "Language Learning" || g.group_type === "language_exchange") {
      badges.push("Beginner Finnish OK");
    }
    if (g.category === "Family & Community" || g.group_type === "mothers_with_kids") {
      badges.push("Childcare-friendly");
    }
    if (g.category === "Integration Support" || g.group_type === "integration_support") {
      badges.push("Mentor available");
    }
    if (includeLocalsAndCompanies && (g.category === "Professional Development" || g.group_type === "professional_network")) {
      badges.push("Company & Local partners");
    }
    return badges;
  };

  const aiReasonForYou = (g: (GroupData & { category?: string })) => {
    const reasons: string[] = [];
    if (g.category === "Language Learning") reasons.push("matches your Finnish practice goal");
    if (g.category === "Integration Support") reasons.push("helps with settling in Kajaani");
    if (g.category === "Professional Development") reasons.push("supports job and career growth");
    return reasons.length ? `Recommended: ${reasons.join(" · ")}` : undefined;
  };

  // Apply filters
  const filteredGroups = useMemo(() => {
    return groups.filter((g) => {
      const badges = getBadges(g);
      if (showBeginnerFriendly && !badges.includes("Beginner Finnish OK")) return false;
      if (showChildcareFriendly && !badges.includes("Childcare-friendly")) return false;
      if (showMentorAvailable && !badges.includes("Mentor available")) return false;
      return true;
    });
  }, [groups, showBeginnerFriendly, showChildcareFriendly, showMentorAvailable]);

  // Group by category for better organization (post-filter)
  const groupsByCategory = filteredGroups.reduce((acc, group) => {
    const category = group.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(group);
    return acc;
  }, {} as Record<string, (GroupData & { category?: string })[]>);

  const categories = Object.keys(groupsByCategory).sort();

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onLearnFinnishClick={handleLearnFinnishClick} 
        />

        <main style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          padding: "40px 20px",
          background: "#fafafa",
          minHeight: "100vh"
        }}>
          <div style={{ marginBottom: "40px" }}>
            <h1 style={{ 
              fontSize: "2.5rem", 
              fontWeight: "bold", 
              color: "#1a1a1a",
              marginBottom: "10px"
            }}>
              Community Groups in Kajaani
            </h1>
            <p style={{ 
              fontSize: "1.1rem", 
              color: "#666",
              marginBottom: "10px"
            }}>
              Connect with others, get support, and build your community in Kajaani. 
            </p>
            <p style={{ 
              fontSize: "1rem", 
              color: "#888",
              fontStyle: "italic"
            }}>
              These groups help with integration, retention, and building lasting connections in Kajaani.
            </p>
          </div>

          {/* Statistics */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
            marginBottom: "40px"
          }}>
            <div style={{ 
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#2563eb" }}>
                {filteredGroups.length}
              </div>
              <div style={{ color: "#666", marginTop: "5px" }}>Active Groups</div>
            </div>
            <div style={{ 
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#2563eb" }}>
                {filteredGroups.reduce((sum, g) => sum + g.member_count, 0)}
              </div>
              <div style={{ color: "#666", marginTop: "5px" }}>Total Members</div>
            </div>
            <div style={{ 
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#2563eb" }}>
                {categories.length}
              </div>
              <div style={{ color: "#666", marginTop: "5px" }}>Categories</div>
            </div>
          </div>

          {/* Filters & Toggles */}
          <div style={{
            background: "white",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
            marginBottom: "32px",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "center"
          }}>
            <span style={{ fontWeight: 600, color: "#111" }}>Filters:</span>
            <button onClick={() => setShowBeginnerFriendly(v => !v)} style={{
              padding: "8px 12px", borderRadius: 20, border: "1px solid #e5e7eb",
              background: showBeginnerFriendly ? "#e0f2fe" : "#f9fafb", color: "#0c4a6e"
            }}>Beginner Finnish OK</button>
            <button onClick={() => setShowChildcareFriendly(v => !v)} style={{
              padding: "8px 12px", borderRadius: 20, border: "1px solid #e5e7eb",
              background: showChildcareFriendly ? "#ecfccb" : "#f9fafb", color: "#365314"
            }}>Childcare-friendly</button>
            <button onClick={() => setShowMentorAvailable(v => !v)} style={{
              padding: "8px 12px", borderRadius: 20, border: "1px solid #e5e7eb",
              background: showMentorAvailable ? "#fef9c3" : "#f9fafb", color: "#854d0e"
            }}>Mentor available</button>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ color: "#555" }}>Include Locals & Companies</label>
              <input type="checkbox" checked={includeLocalsAndCompanies} onChange={(e) => setIncludeLocalsAndCompanies(e.target.checked)} />
            </div>
          </div>

          {/* Groups by Category */}
          {categories.map((category) => (
            <div key={category} style={{ marginBottom: "50px" }}>
              <h2 style={{ 
                fontSize: "1.8rem", 
                fontWeight: "600", 
                color: "#1a1a1a",
                marginBottom: "20px",
                paddingBottom: "10px",
                borderBottom: "2px solid #e5e5e5"
              }}>
                {category} ({groupsByCategory[category].length})
              </h2>
              <div>
                {groupsByCategory[category].map((group) => {
                  const badges = getBadges(group);
                  const reason = aiReasonForYou(group);
                  return (
                    <div key={group.id} style={{ position: "relative", marginBottom: 16 }}>
                      {/* Badges row */}
                      {badges.length > 0 && (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "0 4px 8px 4px" }}>
                          {badges.map((b) => (
                            <span key={b} style={{ fontSize: 12, background: "#eef2ff", color: "#3730a3", padding: "4px 8px", borderRadius: 999 }}>{b}</span>
                          ))}
                        </div>
                      )}
                      {/* AI reason */}
                      {reason && (
                        <div style={{ position: "absolute", top: 6, right: 6, background: "#f1f5f9", color: "#334155", padding: "6px 10px", borderRadius: 12, fontSize: 12, boxShadow: "0 1px 2px rgba(0,0,0,0.06)" }}>
                          {reason}
                        </div>
                      )}
                      <GroupCard
                        group={group}
                        onJoin={handleJoinGroup}
                        onViewMap={handleViewMap}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {groups.length === 0 && (
            <div style={{ 
              textAlign: "center", 
              padding: "60px 20px",
              background: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <p style={{ fontSize: "1.2rem", color: "#666", marginBottom: "10px" }}>
                No groups found
              </p>
              <p style={{ color: "#999" }}>
                Be the first to create a group in Kajaani!
              </p>
            </div>
          )}
        </main>
        {/* Buddy System & Host Toolkit CTA strip */}
        <div style={{ position: "fixed", bottom: 20, right: 20, display: "flex", gap: 12, flexDirection: "column" }}>
          <button
            onClick={() => alert("Buddy System: We’ll pair you with a local mentor and send weekly check-ins. (Coming soon)")}
            style={{ background: "#22c55e", color: "white", padding: "12px 16px", borderRadius: 12, border: "none", boxShadow: "0 4px 10px rgba(0,0,0,0.12)", cursor: "pointer" }}
          >
            🤝 Join Buddy System
          </button>
          <button
            onClick={() => window.open("/host-toolkit", "_blank")}
            style={{ background: "#0ea5e9", color: "white", padding: "12px 16px", borderRadius: 12, border: "none", boxShadow: "0 4px 10px rgba(0,0,0,0.12)", cursor: "pointer" }}
          >
            🧰 Host Toolkit
          </button>
        </div>
      </div>
    </RoomContext.Provider>
  );
}

