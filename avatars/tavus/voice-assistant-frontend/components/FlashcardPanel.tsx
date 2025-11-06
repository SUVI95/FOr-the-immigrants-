"use client";

import { useState, useEffect } from "react";
import { useRoomContext, useVoiceAssistant } from "@livekit/components-react";
import FlashCard from "./FlashCard";

interface FlashCardData {
  id: string;
  question: string;
  answer: string;
  is_flipped: boolean;
}

export default function FlashcardPanel() {
  const [flashcards, setFlashcards] = useState<FlashCardData[]>([]);
  
  // Hooks must be called unconditionally
  // These will be null/undefined if not in RoomContext provider
  const room = useRoomContext();
  const voiceAssistant = useVoiceAssistant();
  const agent = voiceAssistant?.agent || null;

  // Note: RPC method for flashcards is registered in FlashCardContainer
  // to avoid duplicate registrations. FlashcardPanel will receive updates
  // via shared state or the FlashCardContainer component.

  const handleFlip = async (cardId: string) => {
    if (!room || !agent) return;
    try {
      await room.localParticipant.performRpc({
        destinationIdentity: agent.identity,
        method: "agent.flipFlashCard",
        payload: JSON.stringify({ id: cardId }),
      });
      setFlashcards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, is_flipped: !c.is_flipped } : c))
      );
    } catch (error) {
      console.error("Error flipping flashcard:", error);
    }
  };

  if (flashcards.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px", color: "var(--brand)" }}>
        📚 Finnish Flashcards
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "400px", overflowY: "auto" }}>
        {flashcards.slice(0, 3).map((card) => (
          <div
            key={card.id}
            onClick={() => handleFlip(card.id)}
            style={{
              padding: "12px",
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "6px", color: "var(--brand)" }}>
              {card.is_flipped ? "Answer" : "Question"}
            </div>
            <div style={{ fontSize: "14px", color: "var(--text)" }}>
              {card.is_flipped ? card.answer : card.question}
            </div>
            <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "6px" }}>
              Click to {card.is_flipped ? "see question" : "see answer"}
            </div>
          </div>
        ))}
        {flashcards.length > 3 && (
          <div style={{ fontSize: "12px", color: "var(--muted)", textAlign: "center", padding: "8px" }}>
            +{flashcards.length - 3} more flashcards
          </div>
        )}
      </div>
    </div>
  );
}

