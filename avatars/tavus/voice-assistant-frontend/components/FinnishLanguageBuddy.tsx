"use client";

import { useMemo, useState } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

type TopicKey = "job_interview" | "doctor_visit" | "everyday" | "housing";

type ChatMessage = {
  id: string;
  author: "you" | "buddy";
  text: string;
};

type TopicDetail = {
  label: string;
  tagline: string;
  tips: string[];
  starterPhrases: string[];
};

const TOPIC_DETAILS: Record<TopicKey, TopicDetail> = {
  job_interview: {
    label: "Job interview",
    tagline: "Build confidence for Finnish interviews and career chats.",
    tips: ["Pitch your experience", "Ask follow-up questions", "Stay polite but direct"],
    starterPhrases: ["Kerro vahvuuksistasi", "Miksi haluat työskennellä täällä?", "Milloin voisit aloittaa?"],
  },
  doctor_visit: {
    label: "Doctor visit",
    tagline: "Explain symptoms, book appointments, and understand instructions.",
    tips: ["Describe pain clearly", "Confirm medicine dosage", "Ask about next steps"],
    starterPhrases: ["Minulla on ollut flunssa", "Tarvitsen lääkäriajan", "Voinko saada reseptin?"],
  },
  everyday: {
    label: "Everyday conversation",
    tagline: "Supermarket, bus stop, school gates — keep it friendly and light.",
    tips: ["Manage small talk", "Ask for help politely", "Share quick updates"],
    starterPhrases: ["Hei, miten päiväsi on sujunut?", "Tarvitsen apua", "Onko tämä oikea reitti?"],
  },
  housing: {
    label: "Housing & bureaucracy",
    tagline: "Talk to landlords, DVV, and city services like a pro.",
    tips: ["State your needs clearly", "Ask about costs", "Confirm paperwork"],
    starterPhrases: ["Voinko nähdä asunnon?", "Mitä asiakirjoja tarvitsen?", "Milloin vuokra erääntyy?"],
  },
};

export function FinnishLanguageBuddy() {
  const { state: userState, recordAction } = useUserProfile();
  const [topic, setTopic] = useState<TopicKey>("everyday");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      author: "buddy",
      text: "Hei! Valitse harjoituksen aihe ja kirjoita viestisi — vastaan heti suomeksi ja pienellä englanninkielisellä vihjeellä.",
    },
  ]);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progressPercent = useMemo(() => Math.min(100, Math.max(10, (messages.length - 1) * 8)), [messages.length]);

  const handleTopicChange = (nextTopic: TopicKey) => {
    setTopic(nextTopic);
    setMessages([{
      id: `intro-${nextTopic}`,
      author: "buddy",
      text: `Harjoitellaan aihetta: ${TOPIC_DETAILS[nextTopic].label}. Aloita kertomalla tilanteesta tai käytä nopeaa aloitusta alta.`,
    }]);
    setInput("");
    setError(null);
  };

  const handleSend = async (prompt?: string) => {
    const messageToSend = (prompt ?? input).trim();
    if (!messageToSend) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      author: "you",
      text: messageToSend,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/language-buddy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, message: messageToSend }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      const replyText: string = data.reply ?? "Anteeksi, yhteys katkesi. Kokeile uudelleen.";

      const botMessage: ChatMessage = {
        id: `buddy-${Date.now()}`,
        author: "buddy",
        text: replyText,
      };

      setMessages((prev) => [...prev, botMessage]);

      recordAction({
        id: `language-buddy-turn-${Date.now()}`,
        label: `AI buddy practice (${topic})`,
        category: "learning",
        xp: 18,
        impactPoints: 14,
        skill: {
          id: `skill-language-${topic}`,
          title: `Language practice: ${TOPIC_DETAILS[topic].label}`,
          category: "Language",
          details: "AI Language Buddy session",
          source: "course",
        },
      });
    } catch (err) {
      console.error(err);
      setError("Yhteys OpenAI-palveluun epäonnistui. Yritä uudelleen.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSession = () => {
    setSessionsCompleted((prev) => prev + 1);
    recordAction({
      id: `language-buddy-session-${Date.now()}`,
      label: `Logged Finnish session (${topic})`,
      category: "learning",
      xp: 45,
      impactPoints: 32,
      impactHours: 0.5,
      reminder: {
        title: "Practice Finnish again",
        dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        channel: "in-app",
      },
    });
  };

  return (
    <section
      style={{
        borderRadius: 20,
        border: "1px solid #e2e8f0",
        background: "#fff",
        boxShadow: "0 16px 32px rgba(15,23,42,0.08)",
        padding: 24,
        display: "grid",
        gap: 20,
      }}
    >
      <header style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, letterSpacing: 1.3, textTransform: "uppercase", color: "#475569" }}>
              AI Language Buddy
            </p>
            <h2 style={{ margin: "6px 0 0 0", fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
              Practice Finnish with real-life scenarios
            </h2>
            <p style={{ margin: "8px 0 0 0", fontSize: 14, color: "#475569", maxWidth: 520 }}>
              Select a scenario, type in Finnish or English, and the buddy replies instantly in Finnish with helpful hints.
            </p>
          </div>
          <div
            style={{
              borderRadius: 14,
              border: "1px solid rgba(59,130,246,0.2)",
              background: "rgba(59,130,246,0.08)",
              padding: "12px 18px",
              fontWeight: 700,
              color: "#1d4ed8",
            }}
          >
            Skill Passport entries {userState.skillPassport.entries.length}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {(Object.keys(TOPIC_DETAILS) as TopicKey[]).map((key) => {
            const detail = TOPIC_DETAILS[key];
            const active = key === topic;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleTopicChange(key)}
                style={{
                  textAlign: "left",
                  borderRadius: 16,
                  border: active ? "1px solid rgba(37,99,235,0.45)" : "1px solid rgba(148,163,184,0.35)",
                  background: active ? "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.12))" : "#f8fafc",
                  padding: 16,
                  cursor: "pointer",
                  display: "grid",
                  gap: 6,
                }}
              >
                <div style={{ fontWeight: 700, color: "#0f172a" }}>{detail.label}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{detail.tagline}</div>
              </button>
            );
          })}
        </div>
      </header>

      <div style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TOPIC_DETAILS[topic].starterPhrases.map((phrase) => (
            <button
              key={phrase}
              type="button"
              onClick={() => handleSend(phrase)}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.4)",
                background: "#fff",
                fontSize: 12,
                fontWeight: 600,
                color: "#1e293b",
                cursor: "pointer",
              }}
            >
              {phrase}
            </button>
          ))}
        </div>
        <div
          style={{
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            background: "#f8fafc",
            padding: 16,
            maxHeight: 300,
            overflowY: "auto",
            display: "grid",
            gap: 12,
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                alignSelf: message.author === "you" ? "end" : "start",
                background: message.author === "you" ? "linear-gradient(135deg, #2563eb, #7c3aed)" : "#fff",
                color: message.author === "you" ? "#fff" : "#1e293b",
                padding: "10px 14px",
                borderRadius: 12,
                maxWidth: "85%",
                boxShadow: "0 8px 16px rgba(15,23,42,0.08)",
              }}
            >
              <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>{message.author === "you" ? "You" : "Buddy"}</div>
              <div style={{ fontSize: 14, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{message.text}</div>
            </div>
          ))}
          {loading && (
            <div
              style={{
                alignSelf: "start",
                background: "#fff",
                color: "#1e293b",
                padding: "10px 14px",
                borderRadius: 12,
                boxShadow: "0 8px 16px rgba(15,23,42,0.08)",
              }}
            >
              Kirjoitetaan vastausta...
            </div>
          )}
        </div>
        {error && (
          <div
            style={{
              borderRadius: 12,
              border: "1px solid rgba(239,68,68,0.4)",
              background: "rgba(254,226,226,0.7)",
              color: "#991b1b",
              padding: "10px 14px",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Kirjoita viesti / Write your message"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            style={{
              flex: "1 1 260px",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #cbd5f5",
              fontSize: 14,
            }}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={loading}
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              color: "#fff",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            Send
          </button>
        </div>
      </div>

      <footer style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 220px" }}>
          <div style={{ marginBottom: 6, fontSize: 12, fontWeight: 700, color: "#475569" }}>Progress</div>
          <div
            style={{
              height: 12,
              borderRadius: 999,
              background: "rgba(59,130,246,0.15)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                width: `${progressPercent}%`,
                background: "linear-gradient(135deg, #22d3ee, #6366f1)",
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleCompleteSession}
          style={{
            padding: "10px 16px",
            borderRadius: 12,
            border: "1px solid #22c55e",
            background: "rgba(34,197,94,0.12)",
            color: "#166534",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Log session ({sessionsCompleted} completed)
        </button>
      </footer>
    </section>
  );
}

export default FinnishLanguageBuddy;


