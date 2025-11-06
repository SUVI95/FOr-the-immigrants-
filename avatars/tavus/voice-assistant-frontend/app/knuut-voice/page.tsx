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
import type { ConnectionDetails } from "../api/connection-details/route";

export default function KnuutVoicePage() {
  const [room] = useState(new Room());
  const [activeTab, setActiveTab] = useState("explore");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ type: "user" | "bot"; text: string }>
  >([]);

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
          text: "👋 Hello! I'm Knuut AI. I can help you with city services, integration, finding jobs, discovering events, and teaching Finnish. What would you like to do?",
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
    ]);

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

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLearnFinnishClick={handleLearnFinnishClick} />

        <main>
          <div className="hero">
            <section className="welcome">
              <h1>🎤 Knuut AI Voice Assistant</h1>
              <p style={{ fontSize: "16px", color: "var(--muted)", marginBottom: "24px" }}>
                Talk to Knuut AI in real-time! Ask questions about city services, integration help, 
                job opportunities, events, or practice Finnish conversation.
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
                        ? "Listening… Speak now"
                        : "Voice Assistant Active"
                      : "Enable Voice Assistant"}
                  </span>
                  <i className="fa-solid fa-chevron-right"></i>
                </div>
              </div>

              <div className="chips">
                <div
                  className="chip"
                  onClick={() => handleChipClick("Show events this week")}
                >
                  📅 Show events this week
                </div>
                <div
                  className="chip"
                  onClick={() => handleChipClick("Find resources near me")}
                >
                  📍 Find resources near me
                </div>
                <div
                  className="chip"
                  onClick={() => handleChipClick("How do I register my address?")}
                >
                  🏠 How do I register my address?
                </div>
                <div
                  className="chip"
                  onClick={() => handleChipClick("Teach me Finnish greetings")}
                >
                  🇫🇮 Teach me Finnish greetings
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
              <h3 style={{ marginTop: 0 }}>Voice Assistant</h3>
              <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "16px" }}>
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

