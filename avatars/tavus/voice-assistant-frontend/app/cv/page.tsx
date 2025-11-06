"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import CVTemplate from "@/components/CVTemplate";

export default function CVPage() {
  const [activeTab, setActiveTab] = useState("explore");
  const [room] = useState(new Room());
  const [language, setLanguage] = useState<"en" | "fi">("en");

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onLearnFinnishClick={handleLearnFinnishClick} 
        />

        <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px", background: "#fafafa", minHeight: "100vh" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <h1 style={{
              fontSize: "2rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #64748b 0%, #111827 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: 0,
            }}>
              Nordic CV Builder
            </h1>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label style={{ color: "#374151", fontSize: 14 }}>Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "en" | "fi")}
                style={{ padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8 }}
              >
                <option value="en">English</option>
                <option value="fi">Suomi</option>
              </select>
              <button
                onClick={() => window.print()}
                style={{ padding: "10px 14px", background: "#111827", color: "white", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer" }}
              >
                Download PDF
              </button>
            </div>
          </div>

          <CVTemplate language={language} />
        </main>
      </div>
    </RoomContext.Provider>
  );
}


