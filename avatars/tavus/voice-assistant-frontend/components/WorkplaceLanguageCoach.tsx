"use client";

import { useState, useEffect, useRef } from "react";
import { PilotDisclosure } from "./PilotDisclosure";

export function WorkplaceLanguageCoach() {
  const [enabled, setEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [translation, setTranslation] = useState<string | null>(null);
  const [phrase, setPhrase] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Initialize speech recognition if available
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "fi-FI";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        
        // Simulate translation (in production, use real translation API)
        if (transcript.length > 0) {
          setTranslation(transcript);
          // Get workplace phrase suggestion
          getWorkplacePhrase(transcript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }
  }, []);

  const getWorkplacePhrase = async (text: string) => {
    try {
      const response = await fetch("/api/language/workplace-phrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, context: "workplace" }),
      });

      if (response.ok) {
        const data = await response.json();
        setPhrase(data.phrase);
      }
    } catch (error) {
      console.error("Failed to get phrase:", error);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && enabled) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 20,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 12px rgba(15,23,42,0.08)",
        marginBottom: 24,
      }}
    >
      <PilotDisclosure
        pilotName="Workplace Language Coach"
        duration="3 months (Jan 2025 - Mar 2025)"
        purpose="Test real-time language support in workplace settings to measure if language-in-work accelerates learning"
        riskLevel="Limited Risk AI (Educational)"
      />

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            style={{ width: 20, height: 20, cursor: "pointer" }}
          />
          <span style={{ fontSize: "0.875rem", color: "#1e293b", fontWeight: 600 }}>
            Enable Workplace Language Coach
          </span>
        </label>
        <p style={{ margin: "8px 0 0 0", fontSize: "0.75rem", color: "#64748b" }}>
          Real-time translation and phrase suggestions for workplace conversations
        </p>
      </div>

      {enabled && (
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ padding: 16, background: "#f8fafc", borderRadius: 12 }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>
              Real-Time Translation
            </h4>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button
                onClick={isListening ? stopListening : startListening}
                style={{
                  padding: "12px 20px",
                  borderRadius: 12,
                  border: "none",
                  background: isListening ? "#ef4444" : "#22c55e",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {isListening ? (
                  <>
                    <span>⏹️</span> Stop Listening
                  </>
                ) : (
                  <>
                    <span>🎤</span> Start Listening
                  </>
                )}
              </button>
              {isListening && (
                <span style={{ fontSize: "0.75rem", color: "#22c55e", fontWeight: 600 }}>
                  Listening...
                </span>
              )}
            </div>
            {translation && (
              <div style={{ marginTop: 12, padding: 12, background: "#ffffff", borderRadius: 8 }}>
                <p style={{ margin: "0 0 8px 0", fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
                  Translation:
                </p>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "#1e293b" }}>{translation}</p>
              </div>
            )}
          </div>

          {phrase && (
            <div style={{ padding: 16, background: "#eff6ff", borderRadius: 12, border: "1px solid #bfdbfe" }}>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "0.875rem", fontWeight: 600, color: "#1e40af" }}>
                Suggested Workplace Phrase:
              </h4>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#1e293b", lineHeight: 1.7 }}>{phrase}</p>
            </div>
          )}

          <div style={{ padding: 12, background: "#fef3c7", borderRadius: 8, border: "1px solid #fcd34d" }}>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#92400e", lineHeight: 1.6 }}>
              <strong>Pilot Note:</strong> This feature is being tested to measure language learning acceleration.
              Your usage data will be anonymized for research purposes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

