import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoomContext, useVoiceAssistant } from "@livekit/components-react";
import EventCard, { EventData } from "./EventCard";

export default function EventContainer() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const room = useRoomContext();
  const { agent } = useVoiceAssistant();

  useEffect(() => {
    if (!room) return;

    const handleEventRPC = async (data: any): Promise<string> => {
      try {
        console.log("Received event RPC data:", data);

        if (!data || data.payload === undefined) {
          console.error("Invalid RPC data received:", data);
          return "Error: Invalid RPC data format";
        }

        const payload = typeof data.payload === "string" 
          ? JSON.parse(data.payload) 
          : data.payload;

        if (payload.action === "show") {
          // Single event
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
            created_at: payload.created_at,
          };

          setEvents((prev) => {
            const exists = prev.some((e) => e.id === newEvent.id);
            if (exists) {
              return prev.map((e) => (e.id === newEvent.id ? newEvent : e));
            } else {
              return [...prev, newEvent];
            }
          });
          setIsVisible(true);
        } else if (payload.action === "show_list") {
          // Multiple events
          const eventsList: EventData[] = payload.events.map((e: any) => ({
            id: e.id,
            title: e.title,
            description: e.description,
            event_date: e.event_date,
            location_name: e.location_name,
            location_lat: e.location_lat,
            location_lng: e.location_lng,
            group_id: e.group_id,
            rsvp_count: e.rsvp_count || 0,
          }));
          setEvents(eventsList);
          setIsVisible(true);
        } else if (payload.action === "hide") {
          setIsVisible(false);
        }

        return "Success";
      } catch (error) {
        console.error("Error processing event data:", error);
        return "Error: " + (error instanceof Error ? error.message : String(error));
      }
    };

    room.localParticipant.registerRpcMethod("client.event", handleEventRPC);

    return () => {
      room.localParticipant.unregisterRpcMethod("client.event");
    };
  }, [room]);

  const handleRSVP = async (eventId: string) => {
    if (!agent) {
      console.error("Agent not found");
      return;
    }
    try {
      // Call agent RPC to RSVP
      const response = await room.localParticipant.performRpc({
        destinationIdentity: agent.identity,
        method: "agent.rsvpEvent",
        payload: JSON.stringify({ event_id: eventId }),
      });
      console.log(`RSVPed to event: ${eventId}`, response);
      
      // Update local state
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId ? { ...e, rsvp_count: e.rsvp_count + 1 } : e
        )
      );
    } catch (error) {
      console.error("Error RSVPing to event:", error);
    }
  };

  const handleViewMap = (lat: number, lng: number) => {
    // Open Google Maps
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  if (!isVisible || events.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRSVP={handleRSVP}
                    onViewMap={(lat, lng) => handleViewMap(lat, lng)}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

