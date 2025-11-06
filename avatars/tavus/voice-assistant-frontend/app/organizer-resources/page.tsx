"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";

export default function OrganizerResourcesPage() {
  const [activeTab, setActiveTab] = useState("explore");
  const [room] = useState(new Room());

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  const downloads = [
    { name: "Host Starter Guide (PDF)", href: "#" },
    { name: "Meeting Agenda Templates (DOCX)", href: "#" },
    { name: "A1 Conversation Sheets (PDF)", href: "#" },
    { name: "Photo Consent Form (PDF)", href: "#" },
    { name: "Safeguarding & Code of Conduct (PDF)", href: "#" },
    { name: "Event Poster Template (Canva)", href: "#" },
  ];

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          onLearnFinnishClick={handleLearnFinnishClick} 
        />

        <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px", background: "#fafafa", minHeight: "100vh" }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{
              fontSize: "3rem",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 10,
            }}>
              Organizer Resources
            </h1>
            <p style={{ color: "#666", fontSize: "1.1rem", maxWidth: 700 }}>
              Run great community sessions with ready‑made templates, safety guidelines, and language support packs.
            </p>
          </div>

          <section style={{ background: "white", borderRadius: 12, boxShadow: "0 2px 4px rgba(0,0,0,0.08)", padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "#111", marginBottom: 16 }}>Downloads</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 12 }}>
              {downloads.map((d) => (
                <li key={d.name}>
                  <a href={d.href} style={{ display: "block", background: "#f9fafb", padding: 14, borderRadius: 10, border: "1px solid #e5e7eb", color: "#111", textDecoration: "none", fontWeight: 600 }}>
                    📥 {d.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section style={{ background: "white", borderRadius: 12, boxShadow: "0 2px 4px rgba(0,0,0,0.08)", padding: 24 }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "#111", marginBottom: 12 }}>Tips for Great Sessions</h2>
            <ul style={{ color: "#374151", lineHeight: 1.8 }}>
              <li>Use the A1 conversation sheet for first‑timers; keep intros short and inclusive.</li>
              <li>Mark venues that are child‑friendly and public‑transport accessible.</li>
              <li>Set photo consent at the start; share gallery privately afterward.</li>
              <li>Pair newcomers with mentors; follow up with a 1‑week check‑in.</li>
            </ul>
          </section>
        </main>
      </div>
    </RoomContext.Provider>
  );
}


