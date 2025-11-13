"use client";

import { useState, useEffect } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  sector: string;
  languages: string[];
  expertise: string[];
  availability: string;
  location: string;
  xpReward: number;
}

interface SpeedMeeting {
  id: string;
  title: string;
  sector: string;
  date: string;
  time: string;
  location: string;
  spots: number;
  registered: number;
  xpReward: number;
}

export function ProfessionalNetworking() {
  const { state, recordAction } = useUserProfile();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"mentors" | "speed-meetings">("mentors");
  const [selectedSector, setSelectedSector] = useState<string>("All");

  // Mockup data for demo
  const mentors: Mentor[] = [
    {
      id: "mentor-1",
      name: "Mika Virtanen",
      role: "Senior Software Engineer",
      company: "Arctic Bytes",
      sector: "Tech",
      languages: ["Finnish", "English"],
      expertise: ["Software Development", "Career Growth", "Tech Interviews"],
      availability: "Weekdays 18:00-20:00",
      location: "Kajaani / Remote",
      xpReward: 50,
    },
    {
      id: "mentor-2",
      name: "Liisa Kärkkäinen",
      role: "HR Manager",
      company: "Kainuu Hospitality",
      sector: "Hospitality",
      languages: ["Finnish", "English", "Swedish"],
      expertise: ["Job Applications", "Finnish Work Culture", "Networking"],
      availability: "Tuesdays & Thursdays 17:00-19:00",
      location: "Kajaani",
      xpReward: 45,
    },
    {
      id: "mentor-3",
      name: "Dr. Ahmed Hassan",
      role: "Medical Doctor",
      company: "Kainuu Central Hospital",
      sector: "Healthcare",
      languages: ["Finnish", "English", "Arabic"],
      expertise: ["Healthcare Careers", "Qualification Recognition", "Professional Licensing"],
      availability: "Saturdays 10:00-12:00",
      location: "Kajaani",
      xpReward: 60,
    },
    {
      id: "mentor-4",
      name: "Sari Nieminen",
      role: "Business Owner",
      company: "Design Kajaani",
      sector: "Creative",
      languages: ["Finnish", "English"],
      expertise: ["Entrepreneurship", "Creative Industries", "Business Networking"],
      availability: "Flexible",
      location: "Kajaani / Remote",
      xpReward: 40,
    },
  ];

  const speedMeetings: SpeedMeeting[] = [
    {
      id: "meeting-1",
      title: "Tech Sector Speed Networking",
      sector: "Tech",
      date: "2025-02-15",
      time: "17:00-19:00",
      location: "City Tech Hub, Kajaani",
      spots: 20,
      registered: 12,
      xpReward: 70,
    },
    {
      id: "meeting-2",
      title: "Healthcare Professionals Meetup",
      sector: "Healthcare",
      date: "2025-02-20",
      time: "18:00-20:00",
      location: "Kainuu Central Hospital",
      spots: 15,
      registered: 8,
      xpReward: 65,
    },
    {
      id: "meeting-3",
      title: "Hospitality & Service Industry",
      sector: "Hospitality",
      date: "2025-02-25",
      time: "16:00-18:00",
      location: "Kajaani City Centre",
      spots: 25,
      registered: 18,
      xpReward: 55,
    },
  ];

  const sectors = ["All", ...Array.from(new Set(mentors.map((m) => m.sector)))];

  const filteredMentors = selectedSector === "All" 
    ? mentors 
    : mentors.filter((m) => m.sector === selectedSector);

  const handleConnectMentor = (mentor: Mentor) => {
    recordAction({
      id: `mentor-connect-${mentor.id}-${Date.now()}`,
      label: `Connected with mentor: ${mentor.name}`,
      category: "networking",
      xp: mentor.xpReward,
      impactPoints: Math.round(mentor.xpReward * 0.8),
    });
    alert(`Connection request sent to ${mentor.name}. They will contact you soon!`);
  };

  const handleRegisterMeeting = (meeting: SpeedMeeting) => {
    recordAction({
      id: `speed-meeting-${meeting.id}-${Date.now()}`,
      label: `Registered for: ${meeting.title}`,
      category: "networking",
      xp: meeting.xpReward,
      impactPoints: Math.round(meeting.xpReward * 0.9),
    });
    alert(`Registered for ${meeting.title}! You'll receive a confirmation email.`);
  };

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 20,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
        marginBottom: 24,
      }}
    >
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
            Professional Networking & Mentoring
          </h2>
          <p style={{ margin: "6px 0 0 0", fontSize: 14, color: "#475569" }}>
            Connect with mentors and employers in your field. Build professional relationships to overcome discrimination and break into Finnish labor markets.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid #cbd5f5",
            background: "#fff",
            color: "#2563eb",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 13,
            whiteSpace: "nowrap",
          }}
        >
          {isExpanded ? "▼ Collapse" : "▶ Expand"}
        </button>
      </div>

      {!isExpanded && (
        <div style={{ padding: 16, background: "#f8fafc", borderRadius: 12, textAlign: "center", color: "#64748b", fontSize: 14 }}>
          Click "Expand" to view mentors and speed meetings
        </div>
      )}

      {isExpanded && (
        <>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => setActiveTab("mentors")}
          style={{
            padding: "10px 20px",
            borderRadius: 12,
            border: "none",
            background: activeTab === "mentors" ? "#2563eb" : "#f1f5f9",
            color: activeTab === "mentors" ? "#fff" : "#475569",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Find Mentors
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("speed-meetings")}
          style={{
            padding: "10px 20px",
            borderRadius: 12,
            border: "none",
            background: activeTab === "speed-meetings" ? "#2563eb" : "#f1f5f9",
            color: activeTab === "speed-meetings" ? "#fff" : "#475569",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Speed Meetings
        </button>
      </div>

      {/* Mentors Tab */}
      {activeTab === "mentors" && (
        <div>
          {/* Sector Filter */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
              Filter by Sector:
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {sectors.map((sector) => (
                <button
                  key={sector}
                  type="button"
                  onClick={() => setSelectedSector(sector)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    border: selectedSector === sector ? "2px solid #6366f1" : "1px solid #cbd5f5",
                    background: selectedSector === sector ? "#eff6ff" : "#fff",
                    color: selectedSector === sector ? "#1e40af" : "#475569",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  {sector}
                </button>
              ))}
            </div>
          </div>

          {/* Mentors List */}
          <div style={{ display: "grid", gap: 16 }}>
            {filteredMentors.map((mentor) => (
              <article
                key={mentor.id}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  display: "grid",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{mentor.name}</h3>
                    <p style={{ margin: "4px 0 0 0", fontSize: 14, color: "#475569" }}>
                      {mentor.role} at {mentor.company}
                    </p>
                    <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          background: "#e0f2fe",
                          border: "1px solid #bae6fd",
                          color: "#0369a1",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {mentor.sector}
                      </span>
                      {mentor.languages.map((lang, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: "#f1f5f9",
                            border: "1px solid #cbd5f5",
                            color: "#475569",
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#22c55e" }}>+{mentor.xpReward} XP</span>
                  </div>
                </div>

                <div>
                  <p style={{ margin: "0 0 8px 0", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Expertise:</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {mentor.expertise.map((exp, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 999,
                          background: "#fef3c7",
                          border: "1px solid #fcd34d",
                          color: "#92400e",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ fontSize: 12, color: "#64748b" }}>
                  <div>📍 {mentor.location}</div>
                  <div>⏰ {mentor.availability}</div>
                </div>

                <button
                  type="button"
                  onClick={() => handleConnectMentor(mentor)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  Connect with {mentor.name.split(" ")[0]}
                </button>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Speed Meetings Tab */}
      {activeTab === "speed-meetings" && (
        <div style={{ display: "grid", gap: 16 }}>
          {speedMeetings.map((meeting) => (
            <article
              key={meeting.id}
              style={{
                padding: 20,
                borderRadius: 16,
                background: "linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%)",
                border: "2px solid #bfdbfe",
                display: "grid",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{meeting.title}</h3>
                  <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8, fontSize: 13, color: "#475569" }}>
                    <span>📅 {new Date(meeting.date).toLocaleDateString()}</span>
                    <span>⏰ {meeting.time}</span>
                    <span>📍 {meeting.location}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#22c55e" }}>+{meeting.xpReward} XP</span>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                    {meeting.registered}/{meeting.spots} spots
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: 12,
                  background: "#fff",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "#475569",
                  lineHeight: 1.6,
                }}
              >
                <strong>What to expect:</strong> Meet 5-7 employers and professionals in your sector. Bring your Smart CV and be ready to discuss your skills and career goals.
              </div>

              <button
                type="button"
                onClick={() => handleRegisterMeeting(meeting)}
                disabled={meeting.registered >= meeting.spots}
                style={{
                  padding: "10px 20px",
                  borderRadius: 12,
                  border: "none",
                  background:
                    meeting.registered >= meeting.spots
                      ? "#cbd5f5"
                      : "linear-gradient(135deg, #22c55e, #16a34a)",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: meeting.registered >= meeting.spots ? "not-allowed" : "pointer",
                  fontSize: 14,
                }}
              >
                {meeting.registered >= meeting.spots ? "Fully Booked" : "Register Now"}
              </button>
            </article>
          ))}
        </div>
      )}
        </>
      )}
    </div>
  );
}

