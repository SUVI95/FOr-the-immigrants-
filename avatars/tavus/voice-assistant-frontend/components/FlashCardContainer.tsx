import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FlashCard, { FlashCardData } from "./FlashCard";
import { useRoomContext, useVoiceAssistant } from "@livekit/components-react";
import { useUserProfile } from "@/context/UserProfileContext";

export default function FlashCardContainer() {
  const [flashCards, setFlashCards] = useState<FlashCardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const room = useRoomContext();
  const { agent } = useVoiceAssistant();
  const { saveFlashcard } = useUserProfile();

  useEffect(() => {
    if (!room) return;

    // Register RPC method to receive flash cards
    const handleShowFlashCard = async (data: any): Promise<string> => {
      try {
        console.log("Received flashcard RPC data:", data);
        
        // Check for the correct property in the RPC data
        if (!data || data.payload === undefined) {
          console.error("Invalid RPC data received:", data);
          return "Error: Invalid RPC data format";
        }
        
        console.log("Parsing payload:", data.payload);
        
        // Parse the payload string into a JSON object
        const payload = typeof data.payload === 'string' 
          ? JSON.parse(data.payload) 
          : data.payload;
        
        if (payload.action === "show") {
          const newCard: FlashCardData = {
            id: payload.id,
            question: payload.question,
            answer: payload.answer,
            isFlipped: false
          };
          
          setFlashCards(prev => {
            // Check if card with same ID already exists
            const exists = prev.some(card => card.id === newCard.id);
            if (exists) {
              return prev.map(card => 
                card.id === newCard.id ? newCard : card
              );
            } else {
              return [...prev, newCard];
            }
          });
          
          // Save to learning history
          saveFlashcard({
            id: payload.id,
            question: payload.question,
            answer: payload.answer,
            createdAt: new Date().toISOString(),
            topic: payload.topic || "Finnish Learning",
            reviewedCount: 0,
          });
          
          setCurrentCardIndex(payload.index !== undefined ? payload.index : flashCards.length);
          setIsVisible(true);
        } else if (payload.action === "flip") {
          setFlashCards(prev => 
            prev.map(card => 
              card.id === payload.id 
                ? { ...card, isFlipped: !card.isFlipped } 
                : card
            )
          );
        } else if (payload.action === "hide") {
          setIsVisible(false);
        }
        
        return "Success";
      } catch (error) {
        console.error("Error processing flash card data:", error);
        return "Error: " + (error instanceof Error ? error.message : String(error));
      }
    };

    room.localParticipant.registerRpcMethod(
      "client.flashcard",
      handleShowFlashCard
    );

    return () => {
      // Clean up RPC method when component unmounts
      room.localParticipant.unregisterRpcMethod("client.flashcard");
    };
  }, [room, saveFlashcard, flashCards.length]);

  const handleFlip = async (id: string) => {
    try {
      // Use the agent from the voice assistant hook
      if (agent) {
        console.log(`Sending flip request to agent ${agent.identity} for card ID: ${id}`);
        
        // Use the correct RPC pattern and ensure proper payload formatting
        const result = await room.localParticipant.performRpc({
          destinationIdentity: agent.identity,
          method: "agent.flipFlashCard",
          payload: JSON.stringify({ id })
        });
        
        console.log(`RPC call result: ${result}`);
        
        // Also update the local state for immediate feedback
        setFlashCards(prev => 
          prev.map(card => 
            card.id === id 
              ? { ...card, isFlipped: !card.isFlipped } 
              : card
          )
        );
      } else {
        console.error("Agent not found in the room");
      }
    } catch (error: unknown) {
      console.error("Error flipping card:", error);
      if (error instanceof Error) {
        console.error(error.stack);
      }
    }
  };

  const currentCard = currentCardIndex !== null && flashCards[currentCardIndex] 
    ? flashCards[currentCardIndex] 
    : null;

  return (
    <AnimatePresence>
      {isVisible && currentCard && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          style={{
            position: "fixed",
            right: "32px",
            top: "120px",
            width: "420px",
            maxWidth: "90vw",
            background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
            color: "#1e293b",
            padding: "28px",
            borderRadius: "24px",
            boxShadow: "0 24px 48px rgba(15,23,42,0.2), 0 0 0 1px rgba(124,58,237,0.1)",
            zIndex: 9999,
            border: "2px solid rgba(124,58,237,0.2)",
            backdropFilter: "blur(20px)"
          }}
        >
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            paddingBottom: "16px",
            borderBottom: "2px solid rgba(124,58,237,0.1)"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #667eea 0%, #7c3aed 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 16px rgba(124,58,237,0.3)"
              }}>
                <span className="fa-solid fa-lightbulb" style={{
                  color: "#ffffff",
                  fontSize: "18px"
                }}></span>
              </div>
              <h2 style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#0f172a",
                margin: 0
              }}>Flash Card</h2>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              style={{
                background: "rgba(148,163,184,0.1)",
                border: "none",
                borderRadius: "8px",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                color: "#64748b",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(148,163,184,0.2)";
                e.currentTarget.style.color = "#1e293b";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(148,163,184,0.1)";
                e.currentTarget.style.color = "#64748b";
              }}
            >
              ×
            </button>
          </div>
          
          <FlashCard card={currentCard} onFlip={handleFlip} />
          
          {flashCards.length > 1 && (
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "24px",
              paddingTop: "20px",
              borderTop: "2px solid rgba(124,58,237,0.1)"
            }}>
              <button
                onClick={() => setCurrentCardIndex(prev => 
                  prev !== null ? Math.max(0, prev - 1) : 0
                )}
                disabled={currentCardIndex === 0}
                style={{
                  padding: "10px 18px",
                  background: currentCardIndex === 0 
                    ? "rgba(148,163,184,0.2)" 
                    : "linear-gradient(135deg, #667eea 0%, #7c3aed 100%)",
                  color: currentCardIndex === 0 ? "#94a3b8" : "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: 600,
                  cursor: currentCardIndex === 0 ? "not-allowed" : "pointer",
                  opacity: currentCardIndex === 0 ? 0.5 : 1,
                  boxShadow: currentCardIndex === 0 ? "none" : "0 8px 16px rgba(124,58,237,0.3)",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  if (currentCardIndex !== 0) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(124,58,237,0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentCardIndex !== 0) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(124,58,237,0.3)";
                  }
                }}
              >
                ← Previous
              </button>
              <span style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#64748b",
                background: "rgba(124,58,237,0.1)",
                padding: "8px 16px",
                borderRadius: "12px"
              }}>{(currentCardIndex ?? 0) + 1} / {flashCards.length}</span>
              <button
                onClick={() => setCurrentCardIndex(prev => 
                  prev !== null ? Math.min(flashCards.length - 1, prev + 1) : 0
                )}
                disabled={currentCardIndex === flashCards.length - 1}
                style={{
                  padding: "10px 18px",
                  background: currentCardIndex === flashCards.length - 1
                    ? "rgba(148,163,184,0.2)"
                    : "linear-gradient(135deg, #667eea 0%, #7c3aed 100%)",
                  color: currentCardIndex === flashCards.length - 1 ? "#94a3b8" : "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: 600,
                  cursor: currentCardIndex === flashCards.length - 1 ? "not-allowed" : "pointer",
                  opacity: currentCardIndex === flashCards.length - 1 ? 0.5 : 1,
                  boxShadow: currentCardIndex === flashCards.length - 1 ? "none" : "0 8px 16px rgba(124,58,237,0.3)",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  if (currentCardIndex !== flashCards.length - 1) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(124,58,237,0.4)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentCardIndex !== flashCards.length - 1) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(124,58,237,0.3)";
                  }
                }}
              >
                Next →
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
