"use client";

import { useState, useCallback, useEffect } from "react";
import { Room, RoomEvent } from "livekit-client";
import {
  RoomContext,
  RoomAudioRenderer,
  useVoiceAssistant,
  VideoTrack,
  BarVisualizer,
  DisconnectButton,
  VoiceAssistantControlBar,
} from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import TranscriptionView from "@/components/TranscriptionView";
import FlashCardContainer from "@/components/FlashCardContainer";
import QuizContainer from "@/components/QuizContainer";
import GroupContainer from "@/components/GroupContainer";
import EventContainer from "@/components/EventContainer";
import { CloseIcon } from "@/components/CloseIcon";
import { NoAgentNotification } from "@/components/NoAgentNotification";
import FlashcardPanel from "@/components/FlashcardPanel";
import useReduceConsoleNoise from "@/hooks/useReduceConsoleNoise";
import type { ConnectionDetails } from "./api/connection-details/route";
import { useTranslation } from "@/components/i18n/TranslationProvider";

export default function Page() {
  const { t } = useTranslation();
  const [room] = useState(new Room());
  const [activeTab, setActiveTab] = useState("explore");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ type: "user" | "bot"; text: string }>
  >([]);

  // Reduce console noise from LiveKit
  useReduceConsoleNoise();

  const onConnectButtonClicked = useCallback(async () => {
    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details",
      window.location.origin
    );
    const response = await fetch(url.toString());
    const connectionDetailsData: ConnectionDetails = await response.json();

    await room.connect(connectionDetailsData.serverUrl, connectionDetailsData.participantToken);
    await room.localParticipant.setMicrophoneEnabled(true);

    try {
      const dispatchResponse = await fetch("/api/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName: connectionDetailsData.roomName }),
      });
      if (!dispatchResponse.ok) {
        const errorText = await dispatchResponse.text();
        console.error("Failed to dispatch agent:", errorText);
      }
    } catch (error) {
      console.error("Error dispatching agent:", error);
    }
  }, [room]);

  useEffect(() => {
    const onDeviceFailure = (error: Error) => {
      console.error("Media device error:", error);
      alert(
        "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
      );
    };
    room.on(RoomEvent.MediaDevicesError, onDeviceFailure);
    return () => {
      room.off(RoomEvent.MediaDevicesError, onDeviceFailure);
    };
  }, [room]);

  const handleVoiceToggle = () => {
    if (!voiceEnabled) {
      setVoiceEnabled(true);
      onConnectButtonClicked();
      setChatMessages([
        {
          type: "bot",
          text: "👋 Hello! What would you like to do? I can search for city resources, explain processes, or connect you to local groups.",
        },
      ]);
    } else {
      setIsListening(!isListening);
    }
  };

  const handleChipClick = (prompt: string) => {
    setChatMessages((prev) => [
      ...prev,
      { type: "user", text: prompt },
      { type: "bot", text: "Here's what I found. (Demo content)" },
    ]);
  };

  const handleLearnFinnishClick = () => {
    // Navigate to the Finnish learning page
    window.location.href = "/learn-finnish";
  };


  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLearnFinnishClick={handleLearnFinnishClick} />

        <main>
          <div className="hero">
            <section className="welcome">
              <h1>{t("explore")} • Knuut AI</h1>
              
              {/* Quick Links Section */}
              <div style={{ marginBottom: "24px", padding: "20px", background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "var(--shadow)" }}>
                <h3 style={{ marginTop: 0, marginBottom: "16px", fontSize: "18px", fontWeight: 600, color: "var(--brand)" }}>
                  {t("actions")}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                  <a 
                    href="/knuut-voice"
                    style={{ 
                      padding: "14px", 
                      background: "#eff6ff", 
                      border: "1px solid #bfdbfe", 
                      borderRadius: "12px",
                      textDecoration: "none",
                      color: "#1e293b",
                      display: "block"
                    }}
                  >
                    <strong style={{ color: "var(--brand)" }}>🎤 {t("voice")}</strong>
                    <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                      Practice Finnish conversation and get help
                    </p>
                  </a>
                  <a 
                    href="/learn-finnish"
                    style={{ 
                      padding: "14px", 
                      background: "#f0fdf4", 
                      border: "1px solid #86efac", 
                      borderRadius: "12px",
                      textDecoration: "none",
                      color: "#1e293b",
                      display: "block"
                    }}
                  >
                    <strong style={{ color: "#16a34a" }}>🇫🇮 {t("learn_finnish")}</strong>
                    <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#64748b" }}>
                      Structured Finnish learning from textbook
                    </p>
                  </a>
                </div>
              </div>

              <p>
                {t("resources")} • {t("events")}
              </p>

              <div
                className={`voice ${isListening ? "listening" : ""}`}
                onClick={handleVoiceToggle}
                role="button"
                tabIndex={0}
                aria-pressed={isListening}
              >
                <div className="mic">
                  <div className="pulse"></div>
                  <i className="fa-solid fa-microphone"></i>
                </div>
                <div className="cta">
                  <span>
                    {voiceEnabled
                      ? isListening
                        ? "Listening…"
                        : t("voice")
                      : "Enable Voice"}
                  </span>
                  <i className="fa-solid fa-chevron-right"></i>
                </div>
              </div>

              <div className="chips">
                <div
                  className="chip"
                  onClick={() => handleChipClick("Show events this week")}
                >
                  📅 {t("events")}
                </div>
                <div
                  className="chip"
                  onClick={() => handleChipClick("Find resources near me")}
                >
                  📍 {t("resources")}
                </div>
                <div
                  className="chip"
                  onClick={() => handleChipClick("How do I register my address?")}
                >
                  🏠 DVV / Kela
                </div>
              </div>

              {voiceEnabled && (
                <div className="chat visible">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`bubble ${msg.type}`}>
                      {msg.text}
                    </div>
                  ))}
                  <VoiceAssistantContent />
                </div>
              )}
            </section>

            <section className="panel">
              <h3 style={{ marginTop: 0 }}>{t("programs")}</h3>
              <div className="grid">
                <div className="tile">
                  <strong>12</strong>
                  <br />
                  {t("events")}
                </div>
                <div className="tile">
                  <strong>38</strong>
                  <br />
                  {t("groups")}
                </div>
                <div className="tile">
                  <strong>124</strong>
                  <br />
                  {t("resources")}
                </div>
                <div className="tile">
                  <strong>5</strong>
                  <br />
                  New this week
                </div>
                <div className="tile">
                  <strong>3</strong>
                  <br />
                  Appointments booked
                </div>
                <div className="tile">
                  <strong>24h</strong>
                  <br />
                  Avg. response time
                </div>
              </div>
              
              {/* Flashcard Display */}
              <FlashcardPanel />
            </section>
            </div>
        </main>
            </div>

            <RoomAudioRenderer />
    </RoomContext.Provider>
  );
}

function VoiceAssistantContent() {
  // This component is inside RoomContext, so hooks are safe
  const { state: agentState, videoTrack, audioTrack } = useVoiceAssistant();

    return (
    <div style={{ marginTop: "14px" }}>
      {/* Video or Audio Visualizer */}
      {videoTrack ? (
        <div style={{ borderRadius: "16px", overflow: "hidden", marginBottom: "14px" }}>
        <VideoTrack trackRef={videoTrack} />
      </div>
      ) : (
        audioTrack && (
          <div style={{ height: "100px", marginBottom: "14px" }}>
      <BarVisualizer
        state={agentState}
        barCount={5}
        trackRef={audioTrack}
        className="agent-visualizer"
        options={{ minHeight: 24 }}
      />
    </div>
        )
      )}

      {/* Transcription */}
      <div style={{ marginBottom: "14px" }}>
        <TranscriptionView />
      </div>

      {/* Interactive Components */}
      <FlashCardContainer />
      <QuizContainer />
      <GroupContainer />
      <EventContainer />

      {/* Control Bar */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "center",
          marginTop: "14px",
          padding: "8px",
        }}
      >
        {agentState !== "disconnected" && agentState !== "connecting" && (
          <>
            <VoiceAssistantControlBar controls={{ leave: false }} />
            <DisconnectButton>
              <CloseIcon />
            </DisconnectButton>
          </>
        )}
      </div>

      {/* Agent Status */}
      <NoAgentNotification state={agentState} />
    </div>
  );
}
