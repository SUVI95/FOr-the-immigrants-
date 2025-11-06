"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { useTranslation } from "@/components/i18n/TranslationProvider";

export default function BuddySystemPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("explore");
  const [room] = useState(new Room());

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

        <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px", background: "#fafafa", minHeight: "100vh" }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{
              fontSize: "3rem",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 10,
            }}>
              {t("buddy")}
            </h1>
            <p style={{ color: "#666", fontSize: "1.1rem", maxWidth: 700 }}>
              Get paired with a local mentor or advanced immigrant. Weekly check‑ins, language practice, and practical support.
            </p>
          </div>

          <section style={{ background: "white", borderRadius: 12, boxShadow: "0 2px 4px rgba(0,0,0,0.08)", padding: 24 }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: "#111", marginBottom: 16 }}>Join the Buddy System</h2>
            <form
              onSubmit={(e) => { e.preventDefault(); alert("Submitted! Matching coming soon."); }}
              style={{ display: "grid", gap: 12 }}
            >
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#374151", fontWeight: 600 }}>Your goal</span>
                <select style={{ padding: 10, border: "1px solid #e5e7eb", borderRadius: 8 }}>
                  <option>Learn Finnish (A1-A2)</option>
                  <option>Integration help (Kela/DVV)</option>
                  <option>Find friends & social</option>
                  <option>Career & jobs</option>
                </select>
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#374151", fontWeight: 600 }}>Preferred meeting time</span>
                <select style={{ padding: 10, border: "1px solid #e5e7eb", borderRadius: 8 }}>
                  <option>Weekday evenings</option>
                  <option>Weekends</option>
                  <option>Weekday daytime</option>
                </select>
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#374151", fontWeight: 600 }}>Finnish level</span>
                <select style={{ padding: 10, border: "1px solid #e5e7eb", borderRadius: 8 }}>
                  <option>A1</option>
                  <option>A2</option>
                  <option>B1</option>
                </select>
              </label>
              <button type="submit" style={{
                background: "#22c55e",
                color: "white",
                padding: "12px 16px",
                borderRadius: 10,
                border: "none",
                fontWeight: 700,
                cursor: "pointer"
              }}>
                Request a Buddy →
              </button>
            </form>
          </section>
        </main>
      </div>
    </RoomContext.Provider>
  );
}


