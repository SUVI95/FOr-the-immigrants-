"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext, useRoomContext, useVoiceAssistant } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import VolunteerApplicationModal, { VolunteerApplicationData } from "@/components/VolunteerApplicationModal";
import SkillsExchangeContactModal, { SkillsExchangeContactData } from "@/components/SkillsExchangeContactModal";
import { useTranslation } from "@/components/i18n/TranslationProvider";
import { useUserProfile } from "@/context/UserProfileContext";

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

interface SkillsExchangeItem {
  id: string;
  title: string;
  description: string;
  skills_offered: string[];
  skills_wanted: string[];
  location: string;
  contact: string;
}

const volunteerOpportunities: VolunteerOpportunity[] = [
  {
    id: "1",
    title: "Community Garden Maintenance",
    description:
      "Help maintain our community garden. Learn about Finnish gardening while giving back to the community.",
    organization: "Kajaani Green Initiative",
    time_commitment: "2 hours",
    location: "Kajaani Community Garden",
    skills_needed: ["Gardening", "General"],
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Language Exchange Volunteer",
    description:
      "Help newcomers practice Finnish while they teach you their language. Great for cultural exchange!",
    organization: "Kajaani Integration Center",
    time_commitment: "1-2 hours/week",
    location: "Various Locations",
    skills_needed: ["Finnish", "Teaching", "Patience"],
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "Children's Activity Helper",
    description:
      "Assist with children's playgroups and activities. Perfect for those who enjoy working with kids.",
    organization: "Kajaani Family Services",
    time_commitment: "2-3 hours/week",
    location: "Kajaani Family Center",
    skills_needed: ["Childcare", "Activities", "Patience"],
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const skillsExchangeItems: SkillsExchangeItem[] = [
  {
    id: "1",
    title: "Arabic ↔ Finnish Exchange",
    description:
      "Native Arabic speaker offers Arabic lessons in exchange for Finnish conversation practice.",
    skills_offered: ["Arabic Language", "Cooking (Middle Eastern)"],
    skills_wanted: ["Finnish Conversation", "Local Culture"],
    location: "Kajaani",
    contact: "Contact via Knuut AI",
  },
  {
    id: "2",
    title: "IT Skills ↔ Integration Help",
    description:
      "Software developer offers IT tutoring and web development help in exchange for integration guidance.",
    skills_offered: ["Web Development", "Programming", "IT Support"],
    skills_wanted: ["Integration Advice", "Finnish Bureaucracy Help"],
    location: "Kajaani",
    contact: "Contact via Knuut AI",
  },
  {
    id: "3",
    title: "Cooking ↔ Language Practice",
    description:
      "Share your traditional cooking skills while practicing Finnish conversation.",
    skills_offered: ["Traditional Cooking", "Recipe Sharing"],
    skills_wanted: ["Finnish Practice", "Cultural Exchange"],
    location: "Kajaani",
    contact: "Contact via Knuut AI",
  },
];

// Inner component that can use hooks safely
function VolunteerPageContent() {
  const { t } = useTranslation();
  const { state: userState, recordAction } = useUserProfile();
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedOpportunity, setSelectedOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<SkillsExchangeItem | null>(null);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const tasks = userState.impactWallet.tasks;
  
  // Get room context for RPC calls (if available) - hooks must be called unconditionally
  // These will be null/undefined if not in RoomContext provider
  // Safe to call - they handle errors internally
  const roomContext = useRoomContext();
  const voiceAssistant = useVoiceAssistant();

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  const handleVolunteerClick = (opportunity: VolunteerOpportunity) => {
    setSelectedOpportunity(opportunity);
    setIsModalOpen(true);
    recordAction({
      id: `volunteer-open-${opportunity.id}-${Date.now()}`,
      label: `Opened volunteer opportunity: ${opportunity.title}`,
      category: "volunteer",
      xp: 12,
      impactPoints: 10,
    });
  };

  const handleSubmitApplication = async (data: VolunteerApplicationData) => {
    try {
      // If we have room context and agent, use RPC
      if (roomContext && voiceAssistant?.agent) {
        const result = await roomContext.localParticipant.performRpc({
          destinationIdentity: voiceAssistant.agent.identity,
          method: "agent.submitVolunteerApplication",
          payload: JSON.stringify(data),
        });
        console.log("Volunteer application submitted via RPC:", result);
      } else {
        // Otherwise, use direct API call
        const response = await fetch("/api/volunteer-application", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to submit application");
        }

        const result = await response.json();
        console.log("Volunteer application submitted:", result);
      }

      // Show success message
      alert(
        `✅ Application submitted successfully!\n\n` +
        `The organizer (${selectedOpportunity?.organization}) will be notified and will contact you soon.\n\n` +
        `You'll receive a confirmation email at ${data.email}`
      );
      if (selectedOpportunity) {
        recordAction({
          id: `volunteer-application-${selectedOpportunity.id}-${Date.now()}`,
          label: `Applied to volunteer: ${selectedOpportunity.title}`,
          category: "volunteer",
          xp: 32,
          impactPoints: 28,
          impactHours: 1.5,
          skill: {
            id: `skill-volunteer-${selectedOpportunity.id}`,
            title: selectedOpportunity.title,
            category: "Volunteering",
            details: `Application sent to ${selectedOpportunity.organization}`,
            source: "volunteer",
          },
        });
      }
    } catch (error) {
      console.error("Error submitting volunteer application:", error);
      throw error;
    }
  };

  const handleExchangeContact = (exchange: SkillsExchangeItem) => {
    setSelectedExchange(exchange);
    setIsExchangeModalOpen(true);
  };

  const handleCompleteTask = (task: { id: string; title: string; points: number; hours?: number; completed: boolean }) => {
    if (task.completed) return;
    recordAction({
      id: `micro-task-${task.id}-${Date.now()}`,
      label: `Completed micro-volunteering task: ${task.title}`,
      category: "volunteer",
      xp: task.points,
      impactPoints: task.points,
      impactHours: task.hours ?? 0.25,
      taskId: task.id,
      skill: {
        id: `skill-micro-${task.id}`,
        title: task.title,
        category: "Volunteering",
        details: "Logged through Micro-Volunteering Board",
        source: "volunteer",
      },
    });
  };

  const handleSubmitExchangeContact = async (data: SkillsExchangeContactData) => {
    try {
      // If we have room context and agent, use RPC
      if (roomContext && voiceAssistant?.agent) {
        const result = await roomContext.localParticipant.performRpc({
          destinationIdentity: voiceAssistant.agent.identity,
          method: "agent.submitSkillsExchangeContact",
          payload: JSON.stringify(data),
        });
        console.log("Skills exchange contact submitted via RPC:", result);
      } else {
        // Otherwise, use direct API call
        const response = await fetch("/api/skills-exchange-contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const result = await response.json();
        console.log("Skills exchange contact submitted:", result);
      }

      // Show success message
      alert(
        `✅ Message sent successfully!\n\n` +
        `Your message has been sent to the exchange poster. They will receive a notification and can choose to accept or decline the exchange.\n\n` +
        `If they accept, your contact information will be shared with them. You'll receive an email notification when they respond.`
      );
      if (selectedExchange) {
        recordAction({
          id: `skills-exchange-${selectedExchange.id}-${Date.now()}`,
          label: `Contacted skills exchange: ${selectedExchange.title}`,
          category: "volunteer",
          xp: 18,
          impactPoints: 16,
          reminder: {
            title: "Follow up on skills exchange",
            dueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            channel: "in-app",
          },
        });
      }
    } catch (error) {
      console.error("Error sending skills exchange contact:", error);
      throw error;
    }
  };

  const headerStyle: React.CSSProperties = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: "10px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  return (
    <div className="app">
        <Sidebar activeTab={activeTab} onTabChange={(tab) => {
          if (tab === "explore") {
            window.location.href = "/";
            return;
          }
          setActiveTab(tab);
        }} onLearnFinnishClick={handleLearnFinnishClick} />

        <main
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "40px 20px",
            background: "#fafafa",
            minHeight: "100vh",
          }}
        >
          <div style={{ marginBottom: "40px" }}>
            <h1 style={headerStyle}>{t("volunteer")}</h1>
            <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "30px" }}>
              Contribute to Kajaani's community and build your roots. Volunteer for local projects or
              exchange your skills with others.
            </p>
          </div>

          <section style={{ marginBottom: "50px" }}>
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: "20px",
              }}
            >
              Micro-Volunteering Board
            </h2>
            <p style={{ color: "#475569", marginBottom: "16px" }}>
              Quick acts of support that take less than 30 minutes. Tap 'I did this!' to log to your Impact Wallet and Skill Passport.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "16px",
              }}
            >
              {tasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    background: task.completed ? "#ecfdf5" : "#ffffff",
                    padding: "18px",
                    borderRadius: "14px",
                    border: task.completed ? "1px solid #bbf7d0" : "1px solid #e2e8f0",
                    boxShadow: "0 6px 16px rgba(15, 23, 42, 0.08)",
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>{task.title}</h3>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#22c55e" }}>+{task.points} pts</span>
                  </div>
                  <p style={{ margin: 0, color: "#475569", fontSize: "0.95rem" }}>{task.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#64748b" }}>Cadence: {task.cadence}</span>
                    <button
                      type="button"
                      onClick={() => handleCompleteTask(task)}
                      disabled={task.completed}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 12,
                        border: "none",
                        background: task.completed ? "#bbf7d0" : "linear-gradient(135deg, #22c55e, #16a34a)",
                        color: task.completed ? "#166534" : "#fff",
                        fontWeight: 700,
                        cursor: task.completed ? "default" : "pointer",
                      }}
                    >
                      {task.completed ? "Logged" : "I did this!"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Volunteer Opportunities */}
          <section style={{ marginBottom: "50px" }}>
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: "20px",
              }}
            >
              {t("volunteer")}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {volunteerOpportunities.map((opp) => (
                <div
                  key={opp.id}
                  style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    borderLeft: "4px solid #10b981",
                  }}
                >
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "10px", color: "#1a1a1a" }}>
                    {opp.title}
                  </h3>
                  <p style={{ color: "#666", marginBottom: "15px", fontSize: "0.95rem", lineHeight: 1.5 }}>{opp.description}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px", color: "#666", fontSize: "0.9rem" }}>
                    <div>
                      <strong>Organization:</strong> {opp.organization}
                    </div>
                    <div>
                      <strong>Time:</strong> {opp.time_commitment}
                    </div>
                    <div>
                      <strong>Location:</strong> {opp.location}
                    </div>
                    <div>
                      <strong>Skills:</strong> {opp.skills_needed.join(", ")}
                    </div>
                  </div>
                  <button
                    onClick={() => handleVolunteerClick(opp)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
                  >
                    Volunteer Now →
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Exchange */}
          <section>
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: 600,
                color: "#1a1a1a",
                marginBottom: "20px",
              }}
            >
              Skills Exchange
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {skillsExchangeItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    borderLeft: "4px solid #f59e0b",
                  }}
                >
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "10px", color: "#1a1a1a" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "#666", marginBottom: "15px", fontSize: "0.95rem", lineHeight: 1.5 }}>{item.description}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px", color: "#666", fontSize: "0.9rem" }}>
                    <div>
                      <strong>Offers:</strong> {item.skills_offered.join(", ")}
                    </div>
                    <div>
                      <strong>Wants:</strong> {item.skills_wanted.join(", ")}
                    </div>
                    <div>
                      <strong>Location:</strong> {item.location}
                    </div>
                  </div>
                  <button
                    onClick={() => handleExchangeContact(item)}
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "#f59e0b",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#d97706")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#f59e0b")}
                  >
                    Contact via Knuut AI →
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Volunteer Application Modal */}
        {selectedOpportunity && (
          <VolunteerApplicationModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedOpportunity(null);
            }}
            opportunity={{
              id: selectedOpportunity.id,
              title: selectedOpportunity.title,
              organization: selectedOpportunity.organization,
            }}
            onSubmit={handleSubmitApplication}
          />
        )}

        {/* Skills Exchange Contact Modal */}
        {selectedExchange && (
          <SkillsExchangeContactModal
            isOpen={isExchangeModalOpen}
            onClose={() => {
              setIsExchangeModalOpen(false);
              setSelectedExchange(null);
            }}
            exchange={{
              id: selectedExchange.id,
              title: selectedExchange.title,
              skills_offered: selectedExchange.skills_offered,
              skills_wanted: selectedExchange.skills_wanted,
              location: selectedExchange.location,
            }}
            onSubmit={handleSubmitExchangeContact}
          />
        )}
      </div>
  );
}

// Outer component that provides RoomContext
export default function VolunteerPage() {
  const [room] = useState(new Room());

  return (
    <RoomContext.Provider value={room}>
      <VolunteerPageContent />
    </RoomContext.Provider>
  );
}
