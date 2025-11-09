"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import FinnishTextbookContent from "@/components/FinnishTextbookContent";
import FinnishLanguageBuddy from "@/components/FinnishLanguageBuddy";

export default function LearnFinnishPage() {
  const [activeTab, setActiveTab] = useState("explore");
  const [room] = useState(new Room()); // Create a Room instance for context (not connected)

  const handleLearnFinnishClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleTabChange = (tab: string) => {
    if (tab === "explore") {
      window.location.href = "/";
      return;
    }
    setActiveTab(tab);
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} onLearnFinnishClick={handleLearnFinnishClick} />

        <main
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "40px 20px",
            background: "#f8fafc",
            minHeight: "100vh",
            display: "grid",
            gap: 32,
          }}
        >
          <section
            style={{
              position: "relative",
              borderRadius: 28,
              overflow: "hidden",
              padding: "48px 40px",
              color: "#0f172a",
              background: "linear-gradient(135deg, rgba(59,130,246,0.18), rgba(129,140,248,0.18))",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1400&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.22,
              }}
            />
            <div style={{ position: "relative", display: "grid", gap: 18 }}>
              <div>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: 1.3, textTransform: "uppercase", color: "#1d4ed8" }}>
                  Learn Finnish with Knuut AI
                </p>
                <h1 style={{ margin: "6px 0 0 0", fontSize: "3rem", fontWeight: 800 }}>Practice. Chat. Track your progress.</h1>
                <p style={{ margin: "12px 0 0 0", fontSize: "1.15rem", color: "#1f2937", maxWidth: 720 }}>
                  Switch between real-time AI conversation drills and a structured Finnish roadmap. Vocabulary, dialogues, and practice cards stay side-by-side so you never lose your place.
                </p>
              </div>
            </div>
          </section>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
              gap: 24,
              alignItems: "start",
            }}
          >
            <div style={{ display: "grid", gap: 24 }}>
              <FinnishLanguageBuddy />
            </div>
            <div
              style={{
                position: "sticky",
                top: 40,
                alignSelf: "start",
                maxHeight: "calc(100vh - 120px)",
                overflow: "hidden",
                display: "grid",
                gap: 20,
              }}
            >
              <FinnishTextbookContent />
            </div>
          </div>
        </main>
      </div>
    </RoomContext.Provider>
  );
}
