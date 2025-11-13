"use client";

import { useEffect, useRef, useState } from "react";
import { useRoomContext, useVoiceAssistant } from "@livekit/components-react";
import EventCard, { EventData } from "./EventCard";
import GroupCard, { GroupData } from "./GroupCard";
import CreateEventForm from "./CreateEventForm";
import { useTranslation } from "./i18n/TranslationProvider";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLearnFinnishClick?: () => void;
}

function useSafeRoomContext() {
  try {
    return useRoomContext();
  } catch {
    return null;
  }
}

function useSafeVoiceAssistant() {
  try {
    return useVoiceAssistant();
  } catch {
    return null;
  }
}

export default function Sidebar({ activeTab, onTabChange, onLearnFinnishClick }: SidebarProps) {
  const { t } = useTranslation();
  const [events, setEvents] = useState<EventData[]>([]);
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const navRef = useRef<HTMLDivElement | null>(null);

  // Get room context and agent - hooks must be called unconditionally
  // These will be null/undefined if not in RoomContext provider
  const room = useSafeRoomContext();
  const voiceAssistant = useSafeVoiceAssistant();
  const agent = voiceAssistant?.agent || null;

  // Note: RPC methods for events and groups are registered in EventContainer and GroupContainer
  // to avoid duplicate registrations. Sidebar will display events/groups via those components.

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const container = navRef.current;
    if (!container) return;
    const activeButton = container.querySelector<HTMLButtonElement>(".nav-btn.active");
    if (!activeButton) return;
    const containerRect = container.getBoundingClientRect();
    const activeRect = activeButton.getBoundingClientRect();
    const isAbove = activeRect.top < containerRect.top;
    const isBelow = activeRect.bottom > containerRect.bottom;
    if (isAbove || isBelow) {
      activeButton.scrollIntoView({
        block: "center",
        inline: "nearest",
        behavior: "smooth",
      });
    }
  }, [activeTab]);

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

        <div className="nav" ref={navRef}>
          <div className="nav-section">
            <div className="nav-section-title">Core</div>
            <button
              className={`nav-btn ${currentPath === "/" || currentPath.startsWith("/journey") ? "active" : ""}`}
              onClick={() => { window.location.href = "/journey"; }}
            >
              <i className="fa-solid fa-route"></i>
              <span>Journey</span>
            </button>
            <button
              className={`nav-btn ${currentPath.startsWith("/learn-finnish") ? "active" : ""}`}
              onClick={() => { window.location.href = "/learn-finnish"; }}
            >
              <i className="fa-solid fa-language"></i>
              <span>Learn Finnish</span>
            </button>
            <button
              className={`nav-btn ${currentPath.startsWith("/knuut-voice") ? "active" : ""}`}
              onClick={() => { window.location.href = "/knuut-voice"; }}
            >
              <i className="fa-solid fa-microphone-lines"></i>
              <span>Voice</span>
            </button>
            <button
              className={`nav-btn ${currentPath.startsWith("/work-opportunities") ? "active" : ""}`}
              onClick={() => { window.location.href = "/work-opportunities"; }}
            >
              <i className="fa-solid fa-briefcase"></i>
              <span>Work</span>
            </button>
            <button
              className={`nav-btn ${currentPath.startsWith("/my-skills") ? "active" : ""}`}
              onClick={() => { window.location.href = "/my-skills"; }}
            >
              <i className="fa-solid fa-user-graduate"></i>
              <span>My Skills</span>
            </button>
            <button
              className={`nav-btn ${currentPath.startsWith("/community") ? "active" : ""}`}
              onClick={() => { window.location.href = "/community"; }}
            >
              <i className="fa-solid fa-people-group"></i>
              <span>Community</span>
            </button>
            <button
              className={`nav-btn ${currentPath.startsWith("/smart-cv-builder") ? "active" : ""}`}
              onClick={() => { window.location.href = "/smart-cv-builder"; }}
            >
              <i className="fa-solid fa-file-lines"></i>
              <span>CV</span>
            </button>
          </div>
          <div className="nav-section">
            <div className="nav-section-title">Settings</div>
            <button
              className={`nav-btn ${currentPath.startsWith("/consent-hub") ? "active" : ""}`}
              onClick={() => { window.location.href = "/consent-hub"; }}
            >
              <i className="fa-solid fa-shield-halved"></i>
              <span>Consent Hub</span>
            </button>
          </div>
        </div>

      </aside>

      {/* CV moved to dedicated page */}
    </>
  );
}
