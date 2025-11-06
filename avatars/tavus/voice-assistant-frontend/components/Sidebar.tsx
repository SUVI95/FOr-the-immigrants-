"use client";

import { useState, useEffect } from "react";
import { useRoomContext, useVoiceAssistant } from "@livekit/components-react";
import EventCard, { EventData } from "./EventCard";
import GroupCard, { GroupData } from "./GroupCard";
import ResourceModal from "./ResourceModal";
import CreateEventForm from "./CreateEventForm";
import CVTemplate from "./CVTemplate";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLearnFinnishClick?: () => void;
}

export default function Sidebar({ activeTab, onTabChange, onLearnFinnishClick }: SidebarProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [showCVTemplate, setShowCVTemplate] = useState(false);

  // Get room context and agent - hooks must be called unconditionally
  // These will be null/undefined if not in RoomContext provider
  const room = useRoomContext();
  const voiceAssistant = useVoiceAssistant();
  const agent = voiceAssistant?.agent || null;

  // Kajaani Resources
  const resources = [
    {
      id: "kela",
      icon: "🇫🇮",
      title: "Kela (Social Security)",
      category: "Government",
      iconClass: "fa-landmark",
      description:
        "Kela provides social security benefits in Finland. You can apply for allowances, health reimbursements, and student benefits.",
      link: "https://www.kela.fi/web/en",
    },
    {
      id: "bank",
      icon: "🏦",
      title: "Bank Registration",
      category: "Banking",
      iconClass: "fa-piggy-bank",
      description:
        "Steps and required documents to open a bank account in Finland, including proof of identity and address.",
      link: "https://www.op.fi/en/",
    },
    {
      id: "dvv",
      icon: "🪪",
      title: "DVV Registration",
      category: "Government",
      iconClass: "fa-id-card",
      description:
        "Register your address and personal data with the Digital and Population Data Services Agency (DVV).",
      link: "https://dvv.fi/en/registration-of-foreign-residents",
    },
    {
      id: "te",
      icon: "💼",
      title: "TE Services (Employment)",
      category: "Employment",
      iconClass: "fa-briefcase",
      description:
        "Job search assistance, employment services, and support for job seekers and employers.",
      link: "https://www.te-palvelut.fi/te/en/",
    },
    {
      id: "tax",
      icon: "🧾",
      title: "Finnish Tax Office",
      category: "Government",
      iconClass: "fa-file-invoice",
      description:
        "Register for taxation, request tax cards, and manage your tax matters online.",
      link: "https://www.vero.fi/en/",
    },
  ];

  // Note: RPC methods for events and groups are registered in EventContainer and GroupContainer
  // to avoid duplicate registrations. Sidebar will display events/groups via those components.

  const handleResourceClick = (id: string) => {
    setSelectedResource(id);
    setModalOpen(true);
  };

  const handleRSVP = async (eventId: string) => {
    if (!room || !agent) {
      alert("Please enable voice assistant first to RSVP to events.");
      return;
    }
    try {
      await room.localParticipant.performRpc({
        destinationIdentity: agent.identity,
        method: "agent.rsvpEvent",
        payload: JSON.stringify({ event_id: eventId }),
      });
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, rsvp_count: e.rsvp_count + 1 } : e))
      );
    } catch (error) {
      console.error("Error RSVPing:", error);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!room || !agent) {
      alert("Please enable voice assistant first to join groups.");
      return;
    }
    try {
      await room.localParticipant.performRpc({
        destinationIdentity: agent.identity,
        method: "agent.joinGroup",
        payload: JSON.stringify({ group_id: groupId }),
      });
      setGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, member_count: g.member_count + 1 } : g))
      );
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  const handleViewMap = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const handleCreateEvent = async (eventData: {
    title: string;
    description: string;
    event_date: string;
    location_name: string;
  }) => {
    if (!room || !agent) {
      alert("Please enable voice assistant first to create events.");
      return;
    }
    try {
      const isoDate = new Date(eventData.event_date).toISOString();
      const response = await room.localParticipant.performRpc({
        destinationIdentity: agent.identity,
        method: "agent.createEvent",
        payload: JSON.stringify({
          title: eventData.title,
          description: eventData.description,
          event_date: isoDate,
          location_name: eventData.location_name,
        }),
      });

      if (response === "success" || !response) {
        alert("Event created! Check the Events tab.");
        onTabChange("events");
      } else {
        alert("Error creating event. Please try again.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event. Please try again.");
    }
  };

  return (
    <>
      <aside className="sidebar">
        <div className="topbar">
          <div className="logo">
            <i className="fa-solid fa-sparkles"></i>
          </div>
          <div>
            <div className="wordmark">Knuut AI</div>
            <div className="tag">Smart Assistant for City Services</div>
          </div>
        </div>

        <div className="nav">
          <button
            className={`nav-btn ${activeTab === "explore" ? "active" : ""}`}
            onClick={() => onTabChange("explore")}
          >
            <i className="fa-solid fa-compass"></i>
            <span>Explore</span>
          </button>
          <button
            className={`nav-btn ${activeTab === "events" ? "active" : ""}`}
            onClick={() => {
              window.location.href = "/events";
            }}
          >
            <i className="fa-solid fa-calendar"></i>
            <span>Events</span>
          </button>
          <button
            className={`nav-btn ${activeTab === "groups" ? "active" : ""}`}
            onClick={() => {
              window.location.href = "/groups";
            }}
          >
            <i className="fa-solid fa-people-group"></i>
            <span>Groups</span>
          </button>
          <button
            className={`nav-btn ${activeTab === "resources" ? "active" : ""}`}
            onClick={() => onTabChange("resources")}
          >
            <i className="fa-solid fa-book"></i>
            <span>Resources</span>
          </button>
          <button
            className="nav-btn"
            onClick={() => {
              window.location.href = "/volunteer";
            }}
          >
            <span>💡</span>
            <span>Volunteer & Skills</span>
          </button>
          <button
            className="nav-btn"
            onClick={() => {
              window.location.href = "/buddy-system";
            }}
          >
            <span>🤝</span>
            <span>Buddy System</span>
          </button>
          <button
            className="nav-btn"
            onClick={() => {
              window.location.href = "/organizer-resources";
            }}
          >
            <span>🧭</span>
            <span>Organizer Resources</span>
          </button>
          <button
            className="nav-btn"
            onClick={() => setShowCVTemplate(true)}
          >
            <i className="fa-solid fa-file-lines"></i>
            <span>Nordic CV Template</span>
          </button>
          <button
            className="nav-btn"
            onClick={() => {
              window.location.href = "/knuut-voice";
            }}
          >
            <i className="fa-solid fa-microphone"></i>
            <span>Knuut AI Voice</span>
          </button>
          <button
            className="nav-btn"
            onClick={() => {
              if (onLearnFinnishClick) {
                onLearnFinnishClick();
              } else {
                window.location.href = "/learn-finnish";
              }
            }}
          >
            <span>🇫🇮</span>
            <span>Learn Finnish</span>
          </button>
          <button
            className={`nav-btn ${activeTab === "create" ? "active" : ""}`}
            onClick={() => onTabChange("create")}
          >
            <i className="fa-solid fa-circle-plus"></i>
            <span>Create</span>
          </button>
        </div>

        {/* Content based on active tab */}
        <div style={{ marginTop: "18px", maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
          {activeTab === "events" && (
            <div>
              <div className="section-title">UPCOMING EVENTS</div>
              {events.length === 0 ? (
                <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "8px" }}>
                  No upcoming events found. Try creating one or asking Knuut AI!
                </p>
              ) : (
                <div className="res-list">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onRSVP={handleRSVP}
                      onViewMap={handleViewMap}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "groups" && (
            <div>
              <div className="section-title">COMMUNITY GROUPS</div>
              {groups.length === 0 ? (
                <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: "8px" }}>
                  No groups found. Be the first to create one!
                </p>
              ) : (
                <div className="res-list">
                  {groups.map((group) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      onJoin={handleJoinGroup}
                      onViewMap={handleViewMap}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "resources" && (
            <div>
              <div className="section-title">POPULAR RESOURCES</div>
              <div className="res-list">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="resource-card"
                    onClick={() => handleResourceClick(resource.id)}
                  >
                    <h4>
                      {resource.icon} {resource.title}
                    </h4>
                    <div className="pill">
                      <i className={`fa-solid ${resource.iconClass}`}></i>
                      <span>{resource.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "create" && (
            <div>
              <div className="section-title">CREATE EVENT</div>
              <CreateEventForm onSubmit={handleCreateEvent} />
            </div>
          )}
        </div>
      </aside>

      <ResourceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        resource={resources.find((r) => r.id === selectedResource) || null}
      />

      {/* CV Template Modal */}
      {showCVTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowCVTemplate(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Nordic CV Template</h2>
            <CVTemplate />
          </div>
        </div>
      )}
    </>
  );
}
