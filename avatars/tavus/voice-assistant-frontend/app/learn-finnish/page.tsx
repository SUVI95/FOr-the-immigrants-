"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import FinnishTextbookContent from "@/components/FinnishTextbookContent";

export default function LearnFinnishPage() {
  const [activeTab, setActiveTab] = useState("explore");
  const [room] = useState(new Room()); // Create a Room instance for context (not connected)

  const handleLearnFinnishClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLearnFinnishClick={handleLearnFinnishClick} />

        <main style={{ 
          maxWidth: "900px", 
          margin: "0 auto", 
          padding: "40px 20px",
          background: "#fafafa",
          minHeight: "100vh"
        }}>
          <FinnishTextbookContent />
        </main>
      </div>
    </RoomContext.Provider>
  );
}
