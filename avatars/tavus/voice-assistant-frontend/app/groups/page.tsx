"use client";

import { useCallback, useMemo, useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import GroupCard, { GroupData } from "@/components/GroupCard";
import { useTranslation } from "@/components/i18n/TranslationProvider";
import { useUserProfile } from "@/context/UserProfileContext";

interface IntegrationPathway {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
  link: string;
  color: string;
}

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
    description: "Warm, welcoming space for mums, dads, and little ones. Playdates, stroller walks, coffee chats, and real help with Finnish family services. Come as you are—make friends, swap tips, and let the kids have fun!",
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
    description: "Meet ambitious students and early‑career pros (18–35). Study jams, coffee meetups, career nights, and weekend adventures. Build your network—and your Finnish—while having fun.",
    group_type: "students_young_adults",
    category: "Students & Young Adults",
    member_count: 27,
    location_name: "Kajaani University Campus",
    location_lat: 64.2271,
    location_lng: 27.7285,
    created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "13",
    name: "Kajaani Youth Connect (13–19)",
    description: "Safe, friendly hangouts for teens. Games, music, creative projects, and language practice. Make new friends, plan fun activities, and discover Kajaani together.",
    group_type: "youth",
    category: "Youth",
    member_count: 36,
    location_name: "Kajaani Youth House",
    location_lat: 64.2262,
    location_lng: 27.7291,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
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
  const { t } = useTranslation();
  const { state: userState, recordAction } = useUserProfile();
  const [activeTab, setActiveTab] = useState("explore");
  const [groups] = useState<(GroupData & { category?: string })[]>(mockGroups);
  // Filters & toggles
  const [showBeginnerFriendly, setShowBeginnerFriendly] = useState(false);
  const [showChildcareFriendly, setShowChildcareFriendly] = useState(false);
  const [showMentorAvailable, setShowMentorAvailable] = useState(false);
  const [includeLocalsAndCompanies, setIncludeLocalsAndCompanies] = useState(true);
  const [room] = useState(new Room()); // Create a Room instance for context (not connected)
  const [joinedGroupsIds, setJoinedGroupsIds] = useState<Set<string>>(new Set());
  const peerCircles = [
    {
      id: "peer-women",
      title: "Women’s Network",
      description: "Connect. Learn. Grow together. Join mentoring circles, career workshops, and childcare-friendly meetups designed to support women in work and life.",
      schedule: "📅 Tuesdays 18:00 · Kajaani Innovation Hub",
      hosts: "🤝 Hosted by City of Kajaani & volunteer mentors",
      icon: "🌸",
    },
    {
      id: "peer-tech",
      title: "Tech Launchpad",
      description: "Learn, build, and get noticed. Hands-on coding, Finnish tech slang, and chill AMAs with real employers.",
      schedule: "📅 Thursdays 19:00 · Hybrid (City Hub + Zoom)",
      hosts: "🤝 Hosted by Kajaani Tech Collective",
      icon: "💻",
    },
    {
      id: "peer-youth",
      title: "Step Up! – Youth Jobs Network",
      description: "Find your path, fix your CV, or just talk about work and life. Career nights, language tandems, and chill workshops — all for ages 16–24.",
      schedule: "📅 Saturdays 14:00 · Youth House",
      hosts: "🤝 Led by peer mentors & youth workers",
      icon: "🎧",
    },
  ];

  const integrationPathways: IntegrationPathway[] = [
    {
      id: "pathway-1",
      title: "Explorer → Connector",
      description: "Pick one peer group, attend two events, and share one newcomer tip.",
      icon: "🧭",
      action: "Start Explorer Sprint",
      link: "/groups",
      color: "#6366f1",
    },
    {
      id: "pathway-2",
      title: "Connector → Mentor",
      description: "Host a coffee chat, log a volunteering hour, and invite a new buddy.",
      icon: "🤝",
      action: "Build Mentor Toolkit",
      link: "/buddy-system",
      color: "#14b8a6",
    },
    {
      id: "pathway-3",
      title: "Career Boost Track",
      description: "Join the professional network, attend a workshop, and update your CV using Smart CV Builder.",
      icon: "💼",
      action: "Open Career Toolkit",
      link: "/smart-cv-builder",
      color: "#f97316",
    },
    {
      id: "pathway-4",
      title: "Family & Community",
      description: "Join the family network, book a peer support slot, and share one resource in Impact Wallet.",
      icon: "👨‍👩‍👧",
      action: "Explore Community Path",
      link: "/groups",
      color: "#f59e0b",
    },
  ];

  const handleJoinGroup = async (groupId: string) => {
    const group = groups.find((item) => item.id === groupId);
    if (group && !joinedGroupsIds.has(groupId)) {
      setJoinedGroupsIds((prev) => new Set(prev).add(groupId));
      recordAction({
        id: `group-join-${groupId}-${Date.now()}`,
        label: `Joined group: ${group.name}`,
        category: "groups",
        xp: 18,
        impactPoints: 16,
        reminder: {
          title: `Attend next meetup for ${group.name}`,
          dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          channel: "in-app",
        },
      });
    }
    // In the future, this will call the API
    console.log("Join group:", groupId);
    alert("Join functionality will be connected to the backend soon!");
  };

  const handleOpenPeerChat = (circleId: string, title: string) => {
    recordAction({
      id: `peer-circle-${circleId}-${Date.now()}`,
      label: `Opened peer circle chat: ${title}`,
      category: "groups",
      xp: 10,
      impactPoints: 8,
    });
    alert("Peer circle chat launching soon. Stay tuned!");
  };

  const handleViewMap = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  const handlePathwayAction = (pathway: IntegrationPathway) => {
    recordAction({
      id: `integration-pathway-${pathway.id}-${Date.now()}`,
      label: `Opened integration pathway: ${pathway.title}`,
      category: "groups",
      xp: 20,
      impactPoints: 18,
    });
    window.location.href = pathway.link;
  };

  // Lightweight heuristics for badges
  const getBadges = useCallback((g: GroupData & { category?: string }) => {
    const badges: string[] = [];
    if (g.category === "Language Learning" || g.group_type === "language_exchange") {
      badges.push("Beginner‑friendly Finnish");
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
  }, [includeLocalsAndCompanies]);

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
      if (showBeginnerFriendly && !badges.includes("Beginner‑friendly Finnish")) return false;
      if (showChildcareFriendly && !badges.includes("Childcare-friendly")) return false;
      if (showMentorAvailable && !badges.includes("Mentor available")) return false;
      return true;
    });
  }, [getBadges, groups, showBeginnerFriendly, showChildcareFriendly, showMentorAvailable]);

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
  const showConnectorBanner = joinedGroupsIds.size >= 2 && userState.level === "Explorer";

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
              fontSize: "3rem", 
              fontWeight: "bold", 
              color: "#1a1a1a",
              marginBottom: "10px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              {t("groups")}
            </h1>
            <p style={{ 
              fontSize: "1.2rem", 
              color: "#666",
              maxWidth: "700px"
            }}>
              Connect with others, get support, and build your community in Kajaani. These groups help with integration, retention, and building lasting connections.
            </p>
          </div>

          <section
            style={{
              background: "#fff",
              borderRadius: 20,
              border: "1px solid #e2e8f0",
              boxShadow: "0 16px 32px rgba(15, 23, 42, 0.08)",
              padding: 24,
              marginBottom: 32,
              display: "grid",
              gap: 18,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#475569" }}>
                  Peer Circles
                </p>
                <h2 style={{ margin: "6px 0 0 0", fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Curated circles with mentors & chat</h2>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb" }}>Unlock Connector XP each time you host</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {peerCircles.map((circle) => (
                <div
                  key={circle.id}
                  style={{
                    borderRadius: 16,
                    border: "1px solid #cbd5f5",
                    background: "#eef2ff",
                    padding: 18,
                    display: "grid",
                    gap: 10,
                  }}
                >
                  <div style={{ fontSize: 28 }}>{circle.icon}</div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1e3a8a" }}>{circle.title}</h3>
                  <p style={{ margin: 0, color: "#1f2937", fontSize: 14 }}>{circle.description}</p>
                  <div style={{ fontSize: 13, color: "#4338ca" }}>{circle.schedule}</div>
                  <div style={{ fontSize: 12, color: "#334155" }}>{circle.hosts}</div>
                  <button
                    type="button"
                    onClick={() => handleOpenPeerChat(circle.id, circle.title)}
                    style={{
                      justifySelf: "flex-start",
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "none",
                      background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                      color: "#fff",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                    }}
                  >
                    💬 Chat live · Add to calendar
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section
            style={{
              background: "#fff",
              borderRadius: 20,
              border: "1px solid #e2e8f0",
              boxShadow: "0 16px 32px rgba(15, 23, 42, 0.08)",
              padding: 24,
              marginBottom: 32,
              display: "grid",
              gap: 18,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#475569" }}>
                  Integration Pathways
                </p>
                <h2 style={{ margin: "6px 0 0 0", fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
                  Build momentum with guided steps
                </h2>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb" }}>Your progress and community impact update automatically.</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
              {integrationPathways.map((pathway) => (
                <div
                  key={pathway.id}
                  onClick={() => handlePathwayAction(pathway)}
                  style={{
                    cursor: "pointer",
                    background: "#ffffff",
                    border: `2px solid ${pathway.color}`,
                    borderRadius: 16,
                    padding: 20,
                    boxShadow: "0 6px 14px rgba(15,23,42,0.08)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    display: "grid",
                    gap: 12,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 10px 20px rgba(15,23,42,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 6px 14px rgba(15,23,42,0.08)";
                  }}
                >
                  <div style={{ fontSize: 32 }}>{pathway.icon}</div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1f2937" }}>{pathway.title}</h3>
                  <p style={{ margin: 0, fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{pathway.description}</p>
                  <button
                    type="button"
                    style={{
                      justifySelf: "flex-start",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "none",
                      background: pathway.color,
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    {pathway.action} →
                  </button>
                </div>
              ))}
            </div>
          </section>

          {showConnectorBanner && (
            <div
              style={{
                marginBottom: 32,
                borderRadius: 16,
                border: "1px solid #bbf7d0",
                background: "#ecfdf5",
                padding: 18,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <strong style={{ color: "#166534" }}>Connector upgrade unlocked!</strong>
                <p style={{ margin: 0, color: "#166534" }}>
                  You are active in multiple circles — claim your Community Connector level to mentor others.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  recordAction({
                    id: `connector-upgrade-${Date.now()}`,
                    label: "Requested Connector level upgrade",
                    category: "groups",
                    xp: 30,
                    impactPoints: 26,
                  })
                }
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, #22c55e, #16a34a)",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Claim Connector status
              </button>
            </div>
          )}

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
              <div style={{ color: "#666", marginTop: "5px" }}>{t("groups")}</div>
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
              <div style={{ color: "#666", marginTop: "5px" }}>Members</div>
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
            }}>Beginner‑friendly Finnish</button>
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
        {/* CTAs moved to side menu as dedicated pages */}
      </div>
    </RoomContext.Provider>
  );
}

