"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
import type { ConnectionDetails } from "../api/connection-details/route";
import { useTranslation } from "@/components/i18n/TranslationProvider";
import { useUserProfile } from "@/context/UserProfileContext";

export default function KnuutVoicePage() {
  const { t } = useTranslation();
  const { recordAction } = useUserProfile();
  const [room] = useState(() => new Room({
    audioCaptureDefaults: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  }));
  const [activeTab, setActiveTab] = useState("explore");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ type: "user" | "bot"; text: string }>
  >([]);
  const quickButtons = [
    { id: "qa-events", icon: "📅", label: "Show events this week" },
    { id: "qa-resources", icon: "🏠", label: "Find resources near me" },
    { id: "qa-groups", icon: "🤝", label: "Join Peer Group" },
  ];
  // Text input removed per request; voice is the primary modality

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
      const pubs = Array.from(room.localParticipant.tracks.values());
      if (!pubs.find(p => p.source === 'microphone')) {
        console.warn('Microphone track not published, retrying enable...');
        await room.localParticipant.setMicrophoneEnabled(true);
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      console.log('Audio input devices:', devices.filter(d => d.kind === 'audioinput'));
    } catch (e) {
      console.warn('Device check failed:', e);
    }

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

  // Ensure Connected (kept for voice flow)
  const ensureConnected = useCallback(async () => {
    if (room.state !== "connected") {
      await onConnectButtonClicked();
    }
  }, [room.state, onConnectButtonClicked]);

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
          text: "👋 Hello! I'm Knuut AI. I can help you with city services, integration, finding jobs, discovering events, and teaching Finnish. What would you like to do?",
        },
      ]);
      recordAction({
        id: `voice-enable-${Date.now()}`,
        label: "Enabled Knuut AI Voice session",
        category: "voice",
        xp: 18,
        impactPoints: 15,
      });
    } else {
      setIsListening(!isListening);
      recordAction({
        id: `voice-toggle-${Date.now()}`,
        label: isListening ? "Paused listening mode" : "Resumed listening mode",
        category: "voice",
        xp: 4,
        impactPoints: 3,
      });
    }
  };

  const handleChipClick = (prompt: string) => {
    setChatMessages((prev) => [
      ...prev,
      { type: "user", text: prompt },
    ]);
    recordAction({
      id: `voice-prompt-${Date.now()}`,
      label: `Voice quick intent: ${prompt}`,
      category: "voice",
      xp: 9,
      impactPoints: 7,
    });

    // If voice is enabled, send to agent
    if (voiceEnabled && room.state === "connected") {
      const remoteParticipants = Array.from(room.remoteParticipants.values());
      const agent = remoteParticipants.find(p => p.identity === "assistant");
      if (agent) {
        room.localParticipant.performRpc({
          destinationIdentity: agent.identity,
          method: "agent.processUserInput",
          payload: JSON.stringify({ text: prompt }),
        }).catch(console.error);
      }
    }
  };

  // Text submit removed

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };
  const handleTabChange = (tab: string) => {
    if (tab === "explore") {
      window.location.href = "/";
      return;
    }
    setActiveTab(tab as typeof activeTab);
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} onLearnFinnishClick={handleLearnFinnishClick} />

        <main>
          <div className="hero">
            <section className="welcome">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span className="fa-solid fa-waveform-lines" style={{
                  fontSize: 26,
                  color: "#7c3aed",
                  filter: "drop-shadow(0 2px 8px rgba(124,58,237,0.35))"
                }} aria-hidden="true"></span>
                <h1 style={{
                  margin: 0,
                  fontSize: "2.2rem",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #667eea 0%, #7c3aed 50%, #22d3ee 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: 0.2
                }}>{t("voice")}</h1>
              </div>
              <p style={{
                fontSize: 14,
                color: "#64748b",
                marginBottom: 18,
              }}>
                Talk naturally. Knuut will listen, think, and respond in real-time.
              </p>

              <div
                className={`voice ${isListening ? "listening" : ""}`}
                onClick={handleVoiceToggle}
                role="button"
                tabIndex={0}
                aria-pressed={isListening}
              >
                <div className="mic" style={{
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  display: "grid",
                  placeItems: "center",
                  background: "linear-gradient(135deg, rgba(102,126,234,.18), rgba(124,58,237,.14))",
                  border: "1px solid rgba(124,58,237,.35)"
                }}>
                  <i className="fa-solid fa-microphone" style={{ color: "#4338ca" }}></i>
                </div>
                <div className="cta">
                  <span>
                    {voiceEnabled
                      ? isListening
                        ? "Listening…"
                        : "Voice Ready"
                      : "Enable Voice"}
                  </span>
                  <i className="fa-solid fa-chevron-right"></i>
                </div>
              </div>

              <div className="chips" style={{ gap: 12 }}>
                <button
                  className="chip"
                  onClick={() => handleChipClick("Show events near me")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(124,58,237,0.06)",
                    borderColor: "#c4b5fd",
                    color: "#4c1d95",
                    fontWeight: 600
                  }}
                >
                  <i className="fa-regular fa-calendar" aria-hidden></i>
                  <span>Show events near me</span>
                </button>
                <button
                  className="chip"
                  onClick={() => handleChipClick("Where can I find Finnish lessons?")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(14,165,233,0.06)",
                    borderColor: "#93c5fd",
                    color: "#1e3a8a",
                    fontWeight: 600
                  }}
                >
                  <i className="fa-solid fa-location-dot" aria-hidden></i>
                  <span>Where can I find Finnish lessons?</span>
                </button>
                <button
                  className="chip"
                  onClick={() => handleChipClick("How do I register my address?")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(34,197,94,0.06)",
                    borderColor: "#86efac",
                    color: "#166534",
                    fontWeight: 600
                  }}
                >
                  <i className="fa-regular fa-id-card" aria-hidden></i>
                  <span>How do I register my address?</span>
                </button>
                <button
                  className="chip"
                  onClick={() => handleChipClick("Teach me Finnish greetings")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(99,102,241,0.06)",
                    borderColor: "#a5b4fc",
                    color: "#3730a3",
                    fontWeight: 600
                  }}
                >
                  <i className="fa-solid fa-language" aria-hidden></i>
                  <span>Teach me Finnish greetings</span>
                </button>
              </div>

              {voiceEnabled && (
                <div className="chat visible" style={{ background: "#ffffff" }}>
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`bubble ${msg.type}`}>
                      {msg.text}
                    </div>
                  ))}
                  <VoiceAssistantContent />
                </div>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: voiceEnabled ? 12 : 24 }}>
                {quickButtons.map((button) => (
                  <button
                    key={button.id}
                    type="button"
                    onClick={() => handleChipClick(button.label)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 16px",
                      borderRadius: 12,
                      border: "1px solid #cbd5f5",
                      background: "#ffffff",
                      fontWeight: 600,
                      color: "#1e293b",
                      cursor: "pointer",
                      boxShadow: "0 6px 16px rgba(15,23,42,0.08)",
                    }}
                  >
                    <span aria-hidden>{button.icon}</span>
                    <span>{button.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="panel" style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.6))",
              border: "1px solid rgba(148,163,184,0.25)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              backdropFilter: "saturate(1.2) blur(8px)"
            }}>
              <h3 style={{ marginTop: 0, fontWeight: 800, letterSpacing: 0.3, color: "#0f172a" }}>Voice Assistant</h3>
              <p style={{ fontSize: 13, color: "#475569", marginBottom: 14 }}>
                Interactive flashcards and quizzes will appear here as you learn with Knuut.
              </p>
              
              <FlashcardPanel />
            </section>
          </div>
        </main>

        <RoomAudioRenderer />
      </div>
    </RoomContext.Provider>
  );
}

function VoiceAssistantContent() {
  const { state: agentState, videoTrack, audioTrack } = useVoiceAssistant();

  // Debug: Log audio track status
  useEffect(() => {
    if (audioTrack) {
      console.log("✅ Audio track detected:", audioTrack);
      console.log("Audio track state:", audioTrack?.state);
      console.log("Audio track kind:", audioTrack?.kind);
    } else {
      console.log("❌ No audio track detected");
    }
  }, [audioTrack]);

  return (
    <div style={{ marginTop: "14px" }}>
      {videoTrack ? (
        <div style={{ borderRadius: "16px", overflow: "hidden", marginBottom: "14px" }}>
          <VideoTrack trackRef={videoTrack} />
        </div>
      ) : (
        audioTrack ? (
          <div style={{ height: "100px", marginBottom: "14px" }}>
            <BarVisualizer
              state={agentState}
              barCount={5}
              trackRef={audioTrack}
              className="agent-visualizer"
              options={{ minHeight: 24 }}
            />
          </div>
        ) : (
          <div style={{ 
            padding: "16px", 
            background: "#fef3c7", 
            border: "1px solid #fde68a", 
            borderRadius: "8px",
            marginBottom: "14px"
          }}>
            <p style={{ margin: 0, fontSize: "14px", color: "#92400e" }}>
              ⚠️ Waiting for audio track... Agent state: {agentState}
            </p>
          </div>
        )
      )}

      <div style={{ marginBottom: "14px" }}>
        <TranscriptionView />
      </div>

      <FlashCardContainer />
      <QuizContainer />
      <GroupContainer />
      <EventContainer />

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

      <NoAgentNotification state={agentState} />
    </div>
  );
}

