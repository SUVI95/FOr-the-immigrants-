import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoomContext, useVoiceAssistant } from "@livekit/components-react";
import GroupCard, { GroupData } from "./GroupCard";

export default function GroupContainer() {
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const room = useRoomContext();
  const { agent } = useVoiceAssistant();

  useEffect(() => {
    if (!room) return;

    const handleGroupRPC = async (data: any): Promise<string> => {
      try {
        console.log("Received group RPC data:", data);

        if (!data || data.payload === undefined) {
          console.error("Invalid RPC data received:", data);
          return "Error: Invalid RPC data format";
        }

        const payload = typeof data.payload === "string" 
          ? JSON.parse(data.payload) 
          : data.payload;

        if (payload.action === "show") {
          // Single group
          const newGroup: GroupData = {
            id: payload.id,
            name: payload.name,
            description: payload.description,
            group_type: payload.group_type,
            location_name: payload.location_name,
            location_lat: payload.location_lat,
            location_lng: payload.location_lng,
            member_count: payload.member_count || 0,
            created_at: payload.created_at,
          };

          setGroups((prev) => {
            const exists = prev.some((g) => g.id === newGroup.id);
            if (exists) {
              return prev.map((g) => (g.id === newGroup.id ? newGroup : g));
            } else {
              return [...prev, newGroup];
            }
          });
          setIsVisible(true);
        } else if (payload.action === "show_list") {
          // Multiple groups
          const groupsList: GroupData[] = payload.groups.map((g: any) => ({
            id: g.id,
            name: g.name,
            description: g.description,
            group_type: g.group_type,
            location_name: g.location_name,
            location_lat: g.location_lat,
            location_lng: g.location_lng,
            member_count: g.member_count || 0,
          }));
          setGroups(groupsList);
          setIsVisible(true);
        } else if (payload.action === "hide") {
          setIsVisible(false);
        }

        return "Success";
      } catch (error) {
        console.error("Error processing group data:", error);
        return "Error: " + (error instanceof Error ? error.message : String(error));
      }
    };

    room.localParticipant.registerRpcMethod("client.group", handleGroupRPC);

    return () => {
      room.localParticipant.unregisterRpcMethod("client.group");
    };
  }, [room]);

  const handleJoinGroup = async (groupId: string) => {
    if (!agent) {
      console.error("Agent not found");
      return;
    }
    try {
      // Call agent RPC to join group
      const response = await room.localParticipant.performRpc({
        destinationIdentity: agent.identity,
        method: "agent.joinGroup",
        payload: JSON.stringify({ group_id: groupId }),
      });
      console.log(`Joined group: ${groupId}`, response);
      
      // Update local state
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
    // Open Google Maps
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

  if (!isVisible || groups.length === 0) {
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
          <h2 className="text-2xl font-bold text-gray-800">Community Groups</h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onJoin={handleJoinGroup}
                    onViewMap={(lat, lng) => handleViewMap(lat, lng)}
              />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

