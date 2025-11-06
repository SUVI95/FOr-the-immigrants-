import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export interface GroupData {
  id: string;
  name: string;
  description: string;
  group_type: string;
  location_name?: string;
  location_lat?: number;
  location_lng?: number;
  member_count: number;
  created_at?: string;
}

interface GroupCardProps {
  group: GroupData;
  onJoin?: (groupId: string) => void;
  onViewMap?: (lat: number, lng: number) => void;
}

export default function GroupCard({ group, onJoin, onViewMap }: GroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getGroupTypeIcon = (type: string) => {
    switch (type) {
      case "mothers_with_kids":
        return "👶";
      case "language_exchange":
        return "🗣️";
      case "sports":
        return "⚽";
      case "cultural":
        return "🎭";
      default:
        return "👥";
    }
  };

  const formatGroupType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-4 mb-4 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getGroupTypeIcon(group.group_type)}</span>
            <h3 className="text-lg font-semibold text-gray-800">{group.name}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">{formatGroupType(group.group_type)}</p>
          <p className="text-gray-700 text-sm">{group.description}</p>
          
          {group.location_name && (
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
              <span>📍</span>
              <span>{group.location_name}</span>
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-3">
            <span className="text-sm text-gray-600">
              👥 {group.member_count} members
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
              {onJoin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onJoin(group.id);
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Join Group
                </button>
              )}
              {onViewMap && group.location_lat && group.location_lng && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewMap(group.location_lat!, group.location_lng!);
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

