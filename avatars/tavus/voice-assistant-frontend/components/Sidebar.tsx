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
            <button
              className={`nav-btn ${currentPath === "/" ? "active" : ""}`}
              onClick={() => { window.location.href = "/"; }}
            >
              <i className="fa-solid fa-home"></i>
              <span>Home</span>
            </button>
            <button
              className={`nav-btn ${currentPath.startsWith("/first-30-days") || currentPath.startsWith("/start-here") ? "active" : ""}`}
              onClick={() => { window.location.href = "/first-30-days"; }}
            >
              <i className="fa-solid fa-rocket"></i>
              <span>Start Here</span>
            </button>
            <button
              className={`nav-btn ${currentPath.startsWith("/work-opportunities") ? "active" : ""}`}
              onClick={() => { window.location.href = "/work-opportunities"; }}
            >
              <i className="fa-solid fa-briefcase"></i>
              <span>Find Work</span>
            </button>
            <button
              className={`nav-btn ${currentPath.startsWith("/learn-finnish") ? "active" : ""}`}
              onClick={() => { window.location.href = "/learn-finnish"; }}
            >
              <i className="fa-solid fa-language"></i>
              <span>Learn Finnish</span>
            </button>
            <button
              className={`nav-btn ${currentPath.startsWith("/start-business") ? "active" : ""}`}
              onClick={() => { window.location.href = "/start-business"; }}
            >
              <i className="fa-solid fa-store"></i>
              <span>Start a Business</span>
            </button>
            <button
              className={`nav-btn ${currentPath.startsWith("/resources") ? "active" : ""}`}
              onClick={() => { window.location.href = "/resources"; }}
            >
              <i className="fa-solid fa-heart"></i>
              <span>Life in Finland</span>
            </button>
            <button
              className={`nav-btn ${currentPath.startsWith("/events") ? "active" : ""}`}
              onClick={() => { window.location.href = "/events"; }}
            >
              <i className="fa-solid fa-calendar"></i>
              <span>Events</span>
            </button>
            <button
              className={`nav-btn ${currentPath.startsWith("/journey") || currentPath.startsWith("/my-journey") ? "active" : ""}`}
              onClick={() => { window.location.href = "/journey"; }}
            >
              <i className="fa-solid fa-chart-line"></i>
              <span>My Progress</span>
            </button>
          </div>
        </div>

      </aside>

      {/* CV moved to dedicated page */}
    </>
  );
}
