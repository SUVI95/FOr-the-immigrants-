import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export interface EventData {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location_name: string;
  location_lat?: number;
  location_lng?: number;
  group_id?: string;
  rsvp_count: number;
  created_at?: string;
}

interface EventCardProps {
  event: EventData;
  onRSVP?: (eventId: string) => void;
  onViewMap?: (lat: number, lng: number) => void;
}

export default function EventCard({ event, onRSVP, onViewMap }: EventCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      });
    } catch {
      return dateString;
    }
  };

  const isUpcoming = (dateString: string) => {
    try {
      return new Date(dateString) > new Date();
    } catch {
      return true;
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-4 mb-4 cursor-pointer border-l-4 border-blue-500"
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📅</span>
            <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
            {!isUpcoming(event.event_date) && (
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Past</span>
            )}
          </div>
          
          <p suppressHydrationWarning className="text-sm text-gray-600 mb-2 font-medium">
            {formatDate(event.event_date)}
          </p>
          
          <p className="text-gray-700 text-sm mb-2">{event.description}</p>
          
          <div className="flex items-center gap-4 mt-3">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <span>📍</span>
              <span>{event.location_name}</span>
            </p>
            <span className="text-sm text-gray-600">
              👥 {event.rsvp_count} going
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="flex gap-2">
              {onRSVP && isUpcoming(event.event_date) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRSVP(event.id);
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  RSVP
                </button>
              )}
              {onViewMap && event.location_lat && event.location_lng && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewMap(event.location_lat!, event.location_lng!);
                  }}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  View on Map
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

