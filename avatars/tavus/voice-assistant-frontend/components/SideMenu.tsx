"use client";

import { useState, useEffect } from "react";
import { useRoomContext, useVoiceAssistant } from "@livekit/components-react";
import EventCard, { EventData } from "./EventCard";
import GroupCard, { GroupData } from "./GroupCard";

interface SideMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function SideMenu({ isOpen, onToggle }: SideMenuProps) {
  const [activeTab, setActiveTab] = useState<"events" | "groups" | "resources" | "create">("resources");
  const [events, setEvents] = useState<EventData[]>([]);
  const [groups, setGroups] = useState<GroupData[]>([]);
  
  // Get room context and agent - hooks must be called unconditionally
  // These will be null/undefined if not in provider, which is fine
  const room = useRoomContext();
  const voiceAssistant = useVoiceAssistant();
  const agent = voiceAssistant?.agent || null;

  // Kajaani Resources
  const kajaaniResources = [
    {
      title: "Kela (Social Security)",
      description: "Finnish Social Insurance Institution",
      link: "https://www.kela.fi/web/en",
      category: "Government"
    },
    {
      title: "Bank Registration",
      description: "Open a bank account in Finland",
      link: "https://www.op.fi/en/",
      category: "Banking"
    },
    {
      title: "DVV Registration",
      description: "Register as resident in Finland",
      link: "https://dvv.fi/en/registration-of-foreign-residents",
      category: "Government"
    },
    {
      title: "TE Services (Employment)",
      description: "Job search and unemployment services",
      link: "https://www.te-palvelut.fi/te/en/",
      category: "Employment"
    },
    {
      title: "Kajaani City Info",
      description: "Official city information and services",
      link: "https://www.kajaani.fi/en/",
      category: "City"
    },
    {
      title: "Finnish Tax Office",
      description: "Vero - Tax administration",
      link: "https://www.vero.fi/en/",
      category: "Government"
    },
    {
      title: "Immigration Services",
      description: "Migri - Residence permits",
      link: "https://migri.fi/en/home",
      category: "Government"
    },
    {
      title: "Healthcare Registration",
      description: "Register for healthcare services",
      link: "https://www.kela.fi/web/en/health-insurance",
      category: "Healthcare"
    }
  ];

  // Listen for events from agent (only when room is connected)
  useEffect(() => {
    if (!room || !room.localParticipant) return;

    const handleEventRPC = async (data: { payload?: string | object }): Promise<string> => {
      try {
        const payload = typeof data.payload === "string" 
          ? JSON.parse(data.payload) 
          : data.payload;

        if (payload.action === "show") {
          const newEvent: EventData = {
            id: payload.id,
            title: payload.title,
            description: payload.description,
            event_date: payload.event_date,
            location_name: payload.location_name,
            location_lat: payload.location_lat,
            location_lng: payload.location_lng,
            group_id: payload.group_id,
            rsvp_count: payload.rsvp_count || 0,
          };
          setEvents((prev) => {
            const exists = prev.some((e) => e.id === newEvent.id);
            if (exists) {
              return prev.map((e) => (e.id === newEvent.id ? newEvent : e));
            }
            return [...prev, newEvent];
          });
        } else if (payload.action === "show_list") {
          setEvents(payload.events || []);
        }
        return "Success";
      } catch (error) {
        console.error("Error processing event:", error);
        return "Error";
      }
    };

    const handleGroupRPC = async (data: { payload?: string | object }): Promise<string> => {
      try {
        const payload = typeof data.payload === "string" 
          ? JSON.parse(data.payload) 
          : data.payload;

        if (payload.action === "show") {
          const newGroup: GroupData = {
            id: payload.id,
            name: payload.name,
            description: payload.description,
            group_type: payload.group_type,
            location_name: payload.location_name,
            location_lat: payload.location_lat,
            location_lng: payload.location_lng,
            member_count: payload.member_count || 0,
          };
          setGroups((prev) => {
            const exists = prev.some((g) => g.id === newGroup.id);
            if (exists) {
              return prev.map((g) => (g.id === newGroup.id ? newGroup : g));
            }
            return [...prev, newGroup];
          });
        } else if (payload.action === "show_list") {
          setGroups(payload.groups || []);
        }
        return "Success";
      } catch (error) {
        console.error("Error processing group:", error);
        return "Error";
      }
    };

    room.localParticipant.registerRpcMethod("client.event", handleEventRPC);
    room.localParticipant.registerRpcMethod("client.group", handleGroupRPC);

    return () => {
      room.localParticipant.unregisterRpcMethod("client.event");
      room.localParticipant.unregisterRpcMethod("client.group");
    };
  }, [room]);

  const handleCreateEvent = async (eventData: {
    title: string;
    description: string;
    event_date: string;
    location_name: string;
  }) => {
    try {
      // Format date for ISO
      const isoDate = new Date(eventData.event_date).toISOString();
      
      // Call agent via RPC to create event
      if (room && agent) {
        try {
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
            setActiveTab("events");
          } else {
            alert("Error creating event. Please try again.");
          }
        } catch (error) {
          console.error("Error creating event:", error);
          alert("Error creating event. Please try again.");
        }
      } else {
        alert("Please enable voice assistant first to create events.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event. Please try again.");
    }
  };

  const handleRSVP = async (eventId: string) => {
    if (!room || !agent) {
      alert("Please enable voice assistant first to RSVP to events.");
      return;
    }
    try {
      // Use perform_rpc or similar method
      await room.localParticipant.performRpc({
        destinationIdentity: agent.identity,
        method: "agent.rsvpEvent",
        payload: JSON.stringify({ event_id: eventId }),
      });
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId ? { ...e, rsvp_count: e.rsvp_count + 1 } : e
        )
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
        prev.map((g) =>
          g.id === groupId ? { ...g, member_count: g.member_count + 1 } : g
        )
      );
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  const handleViewMap = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full w-80 bg-white shadow-2xl z-50 rounded-br-lg overflow-y-auto max-h-[calc(100vh-4rem)] border border-gray-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Knuut AI</h2>
            <button
              onClick={onToggle}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Tabs - Dropdown Style */}
          <div className="mb-6">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as "events" | "groups" | "resources" | "create")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="events">📅 Events</option>
              <option value="groups">👥 Groups</option>
              <option value="resources">📚 Resources</option>
              <option value="create">➕ Create Event</option>
            </select>
          </div>

          {/* Events Tab */}
          {activeTab === "events" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
              {events.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No upcoming events. Create one or ask Knuut AI!
                </p>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRSVP={handleRSVP}
                onViewMap={(lat, lng) => handleViewMap(lat, lng)}
              />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Groups Tab */}
          {activeTab === "groups" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Community Groups</h3>
              {groups.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No groups found. Create one or ask Knuut AI!
                </p>
              ) : (
                <div className="space-y-4">
                  {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onJoin={handleJoinGroup}
                onViewMap={(lat, lng) => handleViewMap(lat, lng)}
              />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === "resources" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Kajaani Resources</h3>
              <div className="space-y-3">
                {kajaaniResources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {resource.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {resource.description}
                        </p>
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {resource.category}
                        </span>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Create Tab */}
          {activeTab === "create" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Create Event</h3>
              <CreateEventForm onSubmit={handleCreateEvent} />
            </div>
          )}
        </div>
        </div>
      )}
    </>
  );
}

function CreateEventForm({ onSubmit }: { onSubmit: (data: { title: string; description: string; event_date: string; location_name: string }) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      event_date: eventDate,
      location_name: location,
    });
    setTitle("");
    setDescription("");
    setEventDate("");
    setLocation("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date & Time
        </label>
        <input
          type="datetime-local"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Kahvila Kajaani"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Create Event
      </button>
    </form>
  );
}

