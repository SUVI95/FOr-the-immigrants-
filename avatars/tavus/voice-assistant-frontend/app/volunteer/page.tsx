"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext, useRoomContext, useVoiceAssistant } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import VolunteerApplicationModal, { VolunteerApplicationData } from "@/components/VolunteerApplicationModal";
import SkillsExchangeContactModal, { SkillsExchangeContactData } from "@/components/SkillsExchangeContactModal";

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
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedOpportunity, setSelectedOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<SkillsExchangeItem | null>(null);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  
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
    } catch (error) {
      console.error("Error submitting volunteer application:", error);
      throw error;
    }
  };

  const handleExchangeContact = (exchange: SkillsExchangeItem) => {
    setSelectedExchange(exchange);
    setIsExchangeModalOpen(true);
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
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLearnFinnishClick={handleLearnFinnishClick} />

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
            <h1 style={headerStyle}>Volunteer & Skills Exchange</h1>
            <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "30px" }}>
              Contribute to Kajaani's community and build your roots. Volunteer for local projects or
              exchange your skills with others.
            </p>
          </div>

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
              Volunteer Opportunities
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
