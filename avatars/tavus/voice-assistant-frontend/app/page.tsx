"use client";

import Sidebar from "@/components/Sidebar";
import { useState, useMemo, useEffect } from "react";
import { IntegrationHubMap } from "@/components/dashboard/IntegrationHubMap";
import { useUserProfile } from "@/context/UserProfileContext";

const COMMUNITY_LIVE_STATS = {
  peopleOnline: 47,
  eventsToday: 3,
  newMembersThisWeek: 23,
  activeLearners: 89,
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("home");
  const { state } = useUserProfile();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== "home") {
      window.location.href = `/${tab === "start-here" ? "first-30-days" : tab === "find-work" ? "work-opportunities" : tab === "learn-finnish" ? "learn-finnish" : tab === "start-a-business" ? "start-business" : tab === "life-in-finland" ? "resources" : tab === "events" ? "events" : tab === "my-progress" ? "journey" : tab}`;
    }
  };

  // Get suggested work and community (simplified)
  const suggestedWork = useMemo(() => ({
    id: "suggested-work-1",
    title: "Kitchen Internship",
    company: "Kainuu Hospitality",
    reason: "Matches your Food Service track and A2 Finnish level",
    xpReward: 70,
  }), []);

  const suggestedCommunity = useMemo(() => ({
    id: "suggested-community-1",
    title: "Finnish Language Café",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    }),
    reason: "Practice Finnish in a relaxed setting",
    xpReward: 25,
  }), []);

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      
      <main style={{ 
        background: "linear-gradient(180deg, rgba(59, 130, 246, 0.03) 0%, rgba(16, 185, 129, 0.02) 50%, #ffffff 100%)",
        minHeight: "100vh",
        padding: 0,
        position: "relative",
      }}>
        {/* Content Section with Padding */}
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px", display: "grid", gap: 32 }}>

          {/* Community Stats */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
              marginBottom: 8,
              marginTop: -24,
            }}
          >
            <div style={{
              padding: "24px",
              borderRadius: 20,
              background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: "#ffffff",
              textAlign: "center",
              boxShadow: "0 8px 24px rgba(59, 130, 246, 0.25)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
            }}>
              <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>
                {COMMUNITY_LIVE_STATS.peopleOnline}
              </div>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Online Now</div>
            </div>
            <div style={{
              padding: "24px",
              borderRadius: 20,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#ffffff",
              textAlign: "center",
              boxShadow: "0 8px 24px rgba(16, 185, 129, 0.25)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            }}>
              <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>
                {COMMUNITY_LIVE_STATS.eventsToday}
              </div>
              <div style={{ fontSize: 14, opacity: 0.9 }}>Events Today</div>
            </div>
            <div style={{
              padding: "24px",
              borderRadius: 20,
              background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)",
              color: "#ffffff",
              textAlign: "center",
              boxShadow: "0 8px 24px rgba(59, 130, 246, 0.2)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}>
              <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 8 }}>
                {COMMUNITY_LIVE_STATS.newMembersThisWeek}
              </div>
              <div style={{ fontSize: 14, opacity: 0.9 }}>New This Week</div>
            </div>
          </section>

          {/* Find Local Help - Featured Section */}
          <section
            style={{
              borderRadius: 28,
              padding: "48px",
              background: "linear-gradient(135deg, #ffffff 0%, rgba(59, 130, 246, 0.02) 50%, rgba(16, 185, 129, 0.02) 100%)",
              border: "2px solid rgba(59, 130, 246, 0.15)",
              boxShadow: "0 20px 60px rgba(15, 23, 42, 0.12)",
              marginBottom: 32,
              position: "relative",
            }}
          >
            {/* Subtle brand color accent */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #3b82f6 0%, #10b981 100%)",
              borderRadius: "28px 28px 0 0",
            }} />
            <div style={{ marginBottom: 32, textAlign: "center" }}>
              <div style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                gap: 12, 
                padding: "12px 24px", 
                borderRadius: 999, 
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                marginBottom: 20,
                border: "1px solid rgba(59, 130, 246, 0.2)",
              }}>
                <span style={{ fontSize: 28 }}>📍</span>
                <span style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, background: "linear-gradient(135deg, #3b82f6 0%, #10b981 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Find Local Help
                </span>
              </div>
              <h2 style={{ 
                margin: "0 0 12px 0", 
                fontSize: "clamp(2rem, 4vw, 2.75rem)", 
                fontWeight: 800, 
                color: "#0f172a",
                lineHeight: 1.2,
              }}>
                Connect with Your Community
              </h2>
              <p style={{ 
                margin: 0, 
                fontSize: "clamp(1.1rem, 2vw, 1.35rem)", 
                color: "#475569", 
                maxWidth: "800px",
                marginLeft: "auto",
                marginRight: "auto",
                lineHeight: 1.6,
              }}>
                Tap to meet mentors, learn skills, or get practical support. Knuut highlights hubs where you can sort paperwork, build Finnish skills, or meet employers face-to-face.
              </p>
            </div>
            <IntegrationHubMap />
          </section>

          {/* Main Content Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 32 }}>

            {/* Right Column: Suggestions */}
            <div style={{ display: "grid", gap: 24 }}>
              {/* Learn Finnish */}
              <section
                style={{
                  borderRadius: 20,
                  padding: 28,
                  background: "linear-gradient(135deg, #ffffff 0%, rgba(16, 185, 129, 0.02) 100%)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05), 0 8px 24px rgba(15, 23, 42, 0.04)",
                  display: "grid",
                  gap: 20,
                  position: "relative",
                }}
              >
                {/* Subtle green accent */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "4px",
                  height: "100%",
                  background: "linear-gradient(180deg, #10b981 0%, #059669 100%)",
                  borderRadius: "20px 0 0 20px",
                }} />
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#0f172a" }}>Learn Finnish</h3>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 8, lineHeight: 1.4 }}>
                    Start your Finnish journey
                  </div>
                  <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
                    Complete curriculum from A1 to C2. Practice with AI, track progress, and speak like a local.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => window.location.href = "/learn-finnish"}
                  style={{
                    padding: "14px 24px",
                    borderRadius: 12,
                    border: "1px solid #10b981",
                    background: "rgba(16, 185, 129, 0.05)",
                    color: "#10b981",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(16, 185, 129, 0.1)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(16, 185, 129, 0.05)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Start Learning →
                </button>
              </section>

              {/* Work Suggestion */}
              <section
                style={{
                  borderRadius: 20,
                  padding: 28,
                  background: "linear-gradient(135deg, #ffffff 0%, rgba(59, 130, 246, 0.02) 100%)",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05), 0 8px 24px rgba(15, 23, 42, 0.04)",
                  display: "grid",
                  gap: 20,
                  position: "relative",
                }}
              >
                {/* Subtle blue accent */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "4px",
                  height: "100%",
                  background: "linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)",
                  borderRadius: "20px 0 0 20px",
                }} />
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#0f172a" }}>Work Suggestion</h3>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 6, lineHeight: 1.4 }}>
                    {suggestedWork.title}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8, fontWeight: 500 }}>{suggestedWork.company}</div>
                  <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{suggestedWork.reason}</div>
                </div>
                <button
                  type="button"
                  onClick={() => window.location.href = "/work-opportunities"}
                  style={{
                    padding: "14px 24px",
                    borderRadius: 12,
                    border: "1px solid #3b82f6",
                    background: "rgba(59, 130, 246, 0.05)",
                    color: "#3b82f6",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.1)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(59, 130, 246, 0.05)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Explore Work →
                </button>
              </section>

              {/* Community Suggestion */}
              <section
                style={{
                  borderRadius: 20,
                  padding: 28,
                  background: "linear-gradient(135deg, #ffffff 0%, rgba(16, 185, 129, 0.02) 100%)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  boxShadow: "0 1px 3px rgba(15, 23, 42, 0.05), 0 8px 24px rgba(15, 23, 42, 0.04)",
                  display: "grid",
                  gap: 20,
                  position: "relative",
                }}
              >
                {/* Subtle green accent */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "4px",
                  height: "100%",
                  background: "linear-gradient(180deg, #10b981 0%, #059669 100%)",
                  borderRadius: "20px 0 0 20px",
                }} />
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "#0f172a" }}>Community Suggestion</h3>
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 6, lineHeight: 1.4 }}>
                    {suggestedCommunity.title}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8, fontWeight: 500 }}>{suggestedCommunity.date}</div>
                  <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{suggestedCommunity.reason}</div>
                </div>
                <button
                  type="button"
                  onClick={() => window.location.href = "/events"}
                  style={{
                    padding: "14px 24px",
                    borderRadius: 12,
                    border: "1px solid #10b981",
                    background: "rgba(16, 185, 129, 0.05)",
                    color: "#10b981",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(16, 185, 129, 0.1)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(16, 185, 129, 0.05)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  Explore Community →
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
