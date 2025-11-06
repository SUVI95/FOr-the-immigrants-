"use client";

import { useState, useEffect } from "react";
import { useRoomContext, useVoiceAssistant } from "@livekit/components-react";
import EventCard, { EventData } from "./EventCard";
import GroupCard, { GroupData } from "./GroupCard";
import ResourceModal from "./ResourceModal";
import CreateEventForm from "./CreateEventForm";
import CVTemplate from "./CVTemplate";
import { useTranslation } from "./i18n/TranslationProvider";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLearnFinnishClick?: () => void;
}

export default function Sidebar({ activeTab, onTabChange, onLearnFinnishClick }: SidebarProps) {
  const { t } = useTranslation();
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
            <i className="fa-solid fa-earth-americas globe-icon" aria-hidden="true"></i>
          </div>
          <div>
            <div className="wordmark">Knuut AI</div>
            <div className="tag">Connecting People, Services, and Opportunities.</div>
          </div>
        </div>

        <div className="nav">
          <div className="nav-section">
            <div className="nav-section-title">{t("actions")}</div>
            <button
              className={`nav-btn ${activeTab === "explore" ? "active" : ""}`}
              onClick={() => onTabChange("explore")}
            >
              <i className="fa-solid fa-compass"></i>
              <span>{t("explore")}</span>
            </button>
            <button
              className={`nav-btn ${activeTab === "create" ? "active" : ""}`}
              onClick={() => onTabChange("create")}
            >
              <i className="fa-solid fa-circle-plus"></i>
              <span>{t("create")}</span>
            </button>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">{t("programs")}</div>
            <button
              className={`nav-btn ${activeTab === "events" ? "active" : ""}`}
              onClick={() => { window.location.href = "/events"; }}
            >
              <i className="fa-solid fa-calendar-days"></i>
              <span>{t("events")}</span>
            </button>
            <button
              className={`nav-btn ${activeTab === "groups" ? "active" : ""}`}
              onClick={() => { window.location.href = "/groups"; }}
            >
              <i className="fa-solid fa-people-group"></i>
              <span>{t("groups")}</span>
            </button>
            <button
              className={`nav-btn ${activeTab === "resources" ? "active" : ""}`}
              onClick={() => { window.location.href = "/resources"; }}
            >
              <i className="fa-solid fa-book"></i>
              <span>{t("resources")}</span>
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
              <i className="fa-solid fa-language"></i>
              <span>{t("learn_finnish")}</span>
            </button>
            <button
              className="nav-btn"
              onClick={() => { window.location.href = "/knuut-voice"; }}
            >
              <i className="fa-solid fa-microphone-lines"></i>
              <span>{t("voice")}</span>
            </button>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">{t("tools")}</div>
            <button
              className="nav-btn"
              onClick={() => { window.location.href = "/volunteer"; }}
            >
              <i className="fa-solid fa-handshake-angle"></i>
              <span>{t("volunteer")}</span>
            </button>
            <button
              className="nav-btn"
              onClick={() => { window.location.href = "/buddy-system"; }}
            >
              <i className="fa-solid fa-user-group"></i>
              <span>{t("buddy")}</span>
            </button>
            <button
              className="nav-btn"
              onClick={() => { window.location.href = "/organizer-resources"; }}
            >
              <i className="fa-solid fa-compass-drafting"></i>
              <span>{t("organizer")}</span>
            </button>
            <button
              className="nav-btn"
              onClick={() => { window.location.href = "/cv"; }}
            >
              <i className="fa-solid fa-file-lines"></i>
              <span>CV</span>
            </button>
          </div>
        </div>

        {/* Content based on active tab (resources moved to dedicated page) */}
        <div style={{ marginTop: "24px", maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
          {activeTab === "events" && (
            <div>
              <div className="section-title">UPCOMING EVENTS</div>
              {events.length === 0 ? (
                <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px", marginTop: "12px", lineHeight: "1.6" }}>
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
                <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px", marginTop: "12px", lineHeight: "1.6" }}>
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

          {activeTab === "resources" && null}

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

      {/* CV moved to dedicated page */}
    </>
  );
}
