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
  useRoomContext,
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
import LearningHistoryPanel from "@/components/LearningHistoryPanel";
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
    try {
      console.log("🔄 Starting connection process...");
    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details",
      window.location.origin
    );
    const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Failed to get connection details: ${response.status}`);
      }
    const connectionDetailsData: ConnectionDetails = await response.json();
      console.log("✅ Got connection details, connecting to room...");

      // Add timeout for connection
      const connectPromise = room.connect(connectionDetailsData.serverUrl, connectionDetailsData.participantToken);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Connection timeout after 10 seconds")), 10000)
      );
      
      await Promise.race([connectPromise, timeoutPromise]);
      console.log("✅ Connected to room");

      // Enable microphone with timeout
      try {
        await Promise.race([
          room.localParticipant.setMicrophoneEnabled(true),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Microphone enable timeout")), 5000))
        ]);
        console.log("✅ Microphone enabled");
    } catch (e) {
        console.warn("⚠️ Microphone enable failed or timed out:", e);
    }

      // Dispatch agent with timeout
    try {
        console.log("🔄 Dispatching agent...");
        const dispatchResponse = await Promise.race([
          fetch("/api/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomName: connectionDetailsData.roomName }),
          }),
          new Promise<Response>((_, reject) => 
            setTimeout(() => reject(new Error("Dispatch timeout")), 10000)
          )
        ]);
        
      if (!dispatchResponse.ok) {
        const errorText = await dispatchResponse.text();
          console.error("❌ Failed to dispatch agent:", errorText);
        } else {
          console.log("✅ Agent dispatched successfully");
        }
      } catch (error) {
        console.error("❌ Error dispatching agent:", error);
        // Don't throw - continue even if dispatch fails
      }
    } catch (error) {
      console.error("❌ Connection error:", error);
      alert(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
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

        <main style={{ 
          background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
          minHeight: "100vh",
          padding: "32px 40px"
        }}>
          <div className="hero">
            <section className="welcome" style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)",
              border: "1px solid rgba(148,163,184,0.2)",
              borderRadius: "32px",
              padding: "40px 36px",
              boxShadow: "0 32px 64px rgba(15,23,42,0.08), 0 0 0 1px rgba(255,255,255,0.5) inset",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Animated background gradient */}
              <div style={{
                position: "absolute",
                top: "-50%",
                right: "-20%",
                width: "600px",
                height: "600px",
                background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
                borderRadius: "50%",
                animation: "pulse 8s ease-in-out infinite",
                pointerEvents: "none"
              }}></div>
              <div style={{
                position: "absolute",
                bottom: "-30%",
                left: "-10%",
                width: "500px",
                height: "500px",
                background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)",
                borderRadius: "50%",
                animation: "pulse 10s ease-in-out infinite",
                pointerEvents: "none"
              }}></div>

              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 16, 
                marginBottom: 12,
                position: "relative",
                zIndex: 1
              }}>
                <div style={{
                  width: 64,
                  height: 64,
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, #667eea 0%, #7c3aed 50%, #ec4899 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 16px 32px rgba(124,58,237,0.3), 0 0 0 4px rgba(124,58,237,0.1)",
                  animation: "float 3s ease-in-out infinite"
                }}>
                <span className="fa-solid fa-hands-helping" style={{
                    fontSize: 28,
                    color: "#ffffff",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                }} aria-hidden="true"></span>
                </div>
                <div>
                <h1 style={{
                  margin: 0,
                    fontSize: "2.8rem",
                    fontWeight: 900,
                    background: "linear-gradient(135deg, #667eea 0%, #7c3aed 30%, #ec4899 60%, #22d3ee 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    position: "relative"
                  }}>Knuut AI Voice</h1>
                  <div style={{
                    marginTop: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 8
                  }}>
                    <span style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #22c55e, #16a34a)",
                      boxShadow: "0 0 12px rgba(34,197,94,0.6)",
                      animation: "pulse 2s ease-in-out infinite"
                    }}></span>
                    <span style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#64748b",
                      letterSpacing: "0.5px"
                    }}>AI-Powered Language Learning</span>
                  </div>
                </div>
              </div>
              <p style={{
                fontSize: 16,
                color: "#475569",
                marginBottom: 32,
                lineHeight: 1.6,
                position: "relative",
                zIndex: 1,
                fontWeight: 500
              }}>
                Experience the future of language learning. Talk naturally with Knuut AI — your personal Finnish teacher that listens, understands, and responds in real-time with engaging conversations.
              </p>

              <div
                className={`voice ${isListening ? "listening" : ""}`}
                onClick={handleVoiceToggle}
                role="button"
                tabIndex={0}
                aria-pressed={isListening}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "20px 28px",
                  borderRadius: "20px",
                  border: voiceEnabled 
                    ? "2px solid rgba(34,197,94,0.4)" 
                    : "2px solid rgba(124,58,237,0.3)",
                  background: voiceEnabled
                    ? "linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(16,185,129,0.08) 100%)"
                    : "linear-gradient(135deg, rgba(102,126,234,0.12) 0%, rgba(124,58,237,0.1) 100%)",
                  cursor: "pointer",
                  width: "max-content",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: voiceEnabled
                    ? "0 20px 40px rgba(34,197,94,0.2), 0 0 0 4px rgba(34,197,94,0.1)"
                    : "0 16px 32px rgba(124,58,237,0.15), 0 0 0 2px rgba(124,58,237,0.05)",
                  position: "relative",
                  zIndex: 1,
                  transform: "translateY(0)",
                }}
                onMouseEnter={(e) => {
                  if (!voiceEnabled) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(124,58,237,0.25), 0 0 0 4px rgba(124,58,237,0.1)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!voiceEnabled) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 16px 32px rgba(124,58,237,0.15), 0 0 0 2px rgba(124,58,237,0.05)";
                  }
                }}
              >
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  background: voiceEnabled
                    ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                    : "linear-gradient(135deg, #667eea 0%, #7c3aed 100%)",
                  boxShadow: voiceEnabled
                    ? "0 12px 24px rgba(34,197,94,0.4), inset 0 2px 4px rgba(255,255,255,0.3)"
                    : "0 12px 24px rgba(124,58,237,0.3), inset 0 2px 4px rgba(255,255,255,0.3)",
                  position: "relative",
                  animation: isListening ? "pulse 1.5s ease-in-out infinite" : "none"
                }}>
                  <i className="fa-solid fa-microphone" style={{ 
                    color: "#ffffff",
                    fontSize: 22,
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                  }}></i>
                  {isListening && (
                    <div style={{
                      position: "absolute",
                      inset: "-8px",
                      borderRadius: "50%",
                      border: "3px solid rgba(34,197,94,0.4)",
                      animation: "ripple 1.5s ease-out infinite"
                    }}></div>
                  )}
                </div>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4
                }}>
                  <span style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: voiceEnabled ? "#166534" : "#4338ca",
                    letterSpacing: "0.3px"
                  }}>
                    {voiceEnabled
                      ? isListening
                        ? "🎤 Listening..."
                        : "✅ Voice Ready"
                      : "🚀 Enable Voice"}
                  </span>
                  <span style={{
                    fontSize: "13px",
                    color: "#64748b",
                    fontWeight: 500
                  }}>
                    {voiceEnabled 
                      ? "Knuut is ready to help you learn" 
                      : "Click to start your learning journey"}
                  </span>
                </div>
                <div style={{
                  marginLeft: "auto",
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}>
                  <i className="fa-solid fa-chevron-right" style={{ 
                    color: "#4338ca",
                    fontSize: 16
                  }}></i>
                </div>
              </div>

              <div style={{ 
                display: "flex", 
                flexWrap: "wrap", 
                gap: 14,
                marginTop: 32,
                position: "relative",
                zIndex: 1
              }}>
                {[
                  { icon: "📅", label: "Show events near me", color: "#7c3aed", bg: "rgba(124,58,237,0.1)" },
                  { icon: "📍", label: "Find Finnish lessons", color: "#0ea5e9", bg: "rgba(14,165,233,0.1)" },
                  { icon: "🏠", label: "Register my address", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
                  { icon: "🇫🇮", label: "Teach me Finnish", color: "#6366f1", bg: "rgba(99,102,241,0.1)" }
                ].map((chip, idx) => (
                <button
                    key={idx}
                    onClick={() => handleChipClick(chip.label)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                      gap: 10,
                      padding: "14px 20px",
                      borderRadius: "16px",
                      border: `2px solid ${chip.color}40`,
                      background: `linear-gradient(135deg, ${chip.bg}, rgba(255,255,255,0.8))`,
                      color: chip.color,
                      fontWeight: 700,
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                      position: "relative",
                      overflow: "hidden"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                      e.currentTarget.style.boxShadow = `0 12px 24px ${chip.color}30`;
                      e.currentTarget.style.borderColor = chip.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0) scale(1)";
                      e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)";
                      e.currentTarget.style.borderColor = `${chip.color}40`;
                  }}
                >
                    <span style={{ fontSize: "18px" }}>{chip.icon}</span>
                    <span>{chip.label}</span>
                </button>
                ))}
              </div>

              {voiceEnabled && (
                <div style={{ 
                  marginTop: 32,
                  borderRadius: "24px",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)",
                  border: "2px solid rgba(124,58,237,0.15)",
                  padding: "28px",
                  boxShadow: "0 24px 48px rgba(15,23,42,0.12), 0 0 0 1px rgba(255,255,255,0.5) inset",
                  position: "relative",
                  zIndex: 1,
                  minHeight: "400px"
                }}>
                  <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20,
                  paddingBottom: 16,
                  borderBottom: "2px solid rgba(148,163,184,0.1)"
                }}>
                    <div style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #22c55e, #16a34a)",
                      boxShadow: "0 0 12px rgba(34,197,94,0.6)",
                      animation: "pulse 2s ease-in-out infinite"
                    }}></div>
                    <h3 style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "#0f172a",
                      letterSpacing: "0.3px"
                    }}>Live Conversation</h3>
                  </div>
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} style={{
                      maxWidth: "75%",
                      padding: "14px 18px",
                      borderRadius: "18px",
                      marginBottom: 12,
                      background: msg.type === "bot" 
                        ? "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(124,58,237,0.08) 100%)"
                        : "linear-gradient(135deg, rgba(148,163,184,0.1) 0%, rgba(148,163,184,0.05) 100%)",
                      border: msg.type === "bot"
                        ? "1px solid rgba(124,58,237,0.2)"
                        : "1px solid rgba(148,163,184,0.2)",
                      marginLeft: msg.type === "user" ? "auto" : 0,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                      fontSize: "15px",
                      lineHeight: 1.6,
                      color: "#1e293b",
                      fontWeight: 500
                    }}>
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

            <section style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)",
              border: "2px solid rgba(124,58,237,0.15)",
              borderRadius: "32px",
              padding: "36px 32px",
              boxShadow: "0 32px 64px rgba(15,23,42,0.08), 0 0 0 1px rgba(255,255,255,0.5) inset",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Decorative gradient */}
              <div style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "300px",
                height: "300px",
                background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
                borderRadius: "50%",
                transform: "translate(30%, -30%)",
                pointerEvents: "none"
              }}></div>
              
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
                position: "relative",
                zIndex: 1
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #667eea 0%, #7c3aed 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 12px 24px rgba(124,58,237,0.25)"
            }}>
                  <span className="fa-solid fa-brain" style={{
                    fontSize: 22,
                    color: "#ffffff"
                  }}></span>
                </div>
                <div>
                  <h3 style={{ 
                    margin: 0, 
                    fontWeight: 900, 
                    letterSpacing: "-0.02em", 
                    color: "#0f172a",
                    fontSize: "24px"
                  }}>Interactive Learning</h3>
                  <p style={{ 
                    margin: "4px 0 0 0",
                    fontSize: "14px", 
                    color: "#64748b",
                    fontWeight: 500
                  }}>
                    Flashcards and quizzes appear automatically
                  </p>
                </div>
              </div>
              
              <div style={{ position: "relative", zIndex: 1 }}>
              <FlashcardPanel />
              </div>
            </section>
          </div>
        </main>

        <RoomAudioRenderer />
        <LearningHistoryPanel />
      </div>
    </RoomContext.Provider>
  );
}

function VoiceAssistantContent() {
  const { state: agentState, videoTrack, audioTrack, agent } = useVoiceAssistant();
  const room = useRoomContext();

  // Debug: Log audio track status and room participants
  useEffect(() => {
    if (audioTrack) {
      console.log("✅ Audio track detected:", audioTrack);
      // audioTrack is a TrackReference, access the actual track via publication or track
      const track = audioTrack.publication?.track || audioTrack.track;
      if (track) {
        console.log("Audio track details:", {
          state: track.state,
          kind: track.kind,
          muted: track.isMuted,
          enabled: !track.isMuted,
        });
      }
    } else {
      console.log("❌ No audio track detected. Agent state:", agentState);
      // Debug: Log all remote participants to see if agent is connected
      if (room) {
        const remoteParticipants = Array.from(room.remoteParticipants.values());
        console.log("🔍 Remote participants in room:", remoteParticipants.map(p => ({
          identity: p.identity,
          name: p.name || '(no name)',
          audioTracks: p.audioTracks ? Array.from(p.audioTracks.keys()) : [],
          videoTracks: p.videoTracks ? Array.from(p.videoTracks.keys()) : [],
          audioTrackPublications: p.audioTrackPublications ? Array.from(p.audioTrackPublications.keys()) : [],
          videoTrackPublications: p.videoTrackPublications ? Array.from(p.videoTrackPublications.keys()) : [],
        })));
        console.log("🔍 Agent from useVoiceAssistant:", agent ? {
          identity: agent.identity,
          name: agent.name,
        } : 'null');
      }
    }
  }, [audioTrack, agentState, agent, room]);

  return (
    <div style={{ marginTop: "20px" }}>
      {videoTrack ? (
        <div style={{ 
          borderRadius: "24px", 
          overflow: "hidden", 
          marginBottom: "20px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          border: "2px solid rgba(124,58,237,0.2)"
        }}>
          <VideoTrack trackRef={videoTrack} />
        </div>
      ) : (
        audioTrack ? (
          <div style={{ 
            height: "120px", 
            marginBottom: "20px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(124,58,237,0.05) 100%)",
            border: "2px solid rgba(124,58,237,0.15)",
            padding: "20px",
            boxShadow: "0 12px 24px rgba(124,58,237,0.1)"
          }}>
            <BarVisualizer
              state={agentState}
              barCount={7}
              trackRef={audioTrack}
              className="agent-visualizer"
              options={{ minHeight: 32 }}
            />
          </div>
        ) : (
          <div style={{ 
            padding: "24px", 
            background: "linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(251,191,36,0.05) 100%)", 
            border: "2px solid rgba(251,191,36,0.3)", 
            borderRadius: "20px",
            marginBottom: "20px",
            boxShadow: "0 8px 16px rgba(251,191,36,0.15)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 16px rgba(251,191,36,0.3)"
          }}>
                <span className="fa-solid fa-hourglass-half" style={{
                  color: "#ffffff",
                  fontSize: 18,
                  animation: "spin 2s linear infinite"
                }}></span>
              </div>
              <div>
                <p style={{ 
                  margin: 0, 
                  fontSize: "16px", 
                  color: "#92400e",
                  fontWeight: 700
                }}>
                  Connecting to Knuut AI...
                </p>
                <p style={{ 
                  margin: "4px 0 0 0", 
                  fontSize: "13px", 
                  color: "#a16207",
                  fontWeight: 500
                }}>
                  Agent state: {agentState}
            </p>
              </div>
            </div>
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

