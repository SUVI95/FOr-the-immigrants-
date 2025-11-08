"use client";

import { useMemo, useState } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

type TopicKey = "job_interview" | "doctor_visit" | "everyday" | "housing";

type ChatMessage = {
  id: string;
  author: "you" | "buddy";
  text: string;
};

const TOPICS: Array<{ id: TopicKey; label: string; systemPrompt: string }> = [
  {
    id: "job_interview",
    label: "Job interview",
    systemPrompt:
      "Let's practice a job interview in Finnish. I will answer as a hiring manager using Finnish sentences and provide short English hints.",
  },
  {
    id: "doctor_visit",
    label: "Doctor visit",
    systemPrompt:
      "You are at a doctor's appointment in Kajaani. I will respond as a nurse/doctor in simple Finnish with key vocabulary.",
  },
  {
    id: "everyday",
    label: "Everyday conversation",
    systemPrompt:
      "Casual small talk for the supermarket, bus stop or school pick-up. I will keep sentences short and friendly with Finnish + hint.",
  },
  {
    id: "housing",
    label: "Housing & bureaucracy",
    systemPrompt:
      "Practice a conversation with a landlord or DVV official. I will give Finnish phrases and simple explanations.",
  },
];

function generateBuddyResponse(topic: TopicKey, userText: string) {
  const lower = userText.toLowerCase();
  switch (topic) {
    case "job_interview":
      if (lower.includes("experience")) {
        return "Suosittelen korostamaan käytännön kokemusta. Voit sanoa: 'Minulla on kolme vuotta kokemusta asiakaspalvelusta.' (I have three years of experience in customer service.)";
      }
      return "Kiitos vastauksestasi! Kysyisin vielä: 'Miksi haluat työskennellä juuri täällä?' (Why do you want to work here?)";
    case "doctor_visit":
      if (lower.includes("appointment")) {
        return "Voit sanoa: 'Tarvitsen lääkäriajan ensi viikolle.' (I need a doctor's appointment for next week.)";
      }
      return "Muista käyttää sanaa 'ajanvaraus' kun soitat. 'Hei, haluaisin varata ajan lääkärille.' (Hi, I would like to book a doctor's appointment.)";
    case "housing":
      if (lower.includes("rent") || lower.includes("vuokra")) {
        return "Kysy vuokrasta näin: 'Paljonko vuokra on kuukaudessa ja sisältyykö vesi?' (How much is the monthly rent and is water included?)";
      }
      return "Hyvä kysymys! Voit myös kysyä: 'Voinko nähdä asunnon paikan päällä?' (Can I see the apartment in person?)";
    default:
      return "Hyvin menee! Kokeile sanoa: 'Voinko auttaa jotenkin?' (Can I help somehow?) • 'Kiitos, oikein hyvää.' (Thank you, very well.)";
  }
}

export function FinnishLanguageBuddy() {
  const { state: userState, recordAction } = useUserProfile();
  const [topic, setTopic] = useState<TopicKey>("everyday");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      author: "buddy",
      text: "Hei! Valitse ylävalikosta aihe ja aloitetaan harjoitus. 👋",
    },
  ]);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const progressPercent = useMemo(() => Math.min(100, (messages.length - 1) * 10), [messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      author: "you",
      text: input.trim(),
    };

    const botResponse: ChatMessage = {
      id: `buddy-${Date.now()}`,
      author: "buddy",
      text: generateBuddyResponse(topic, input.trim()),
    };

    setMessages((prev) => [...prev, userMessage, botResponse]);
    setInput("");

    recordAction({
      id: `language-buddy-turn-${Date.now()}`,
      label: `Practiced Finnish (${topic})`,
      category: "learning",
      xp: 12,
      impactPoints: 9,
      skill: {
        id: `skill-language-${topic}`,
        title: `Language practice: ${TOPICS.find((t) => t.id === topic)?.label ?? topic}`,
        category: "Language",
        details: "AI Language Buddy session logged",
        source: "course",
      },
    });
  };

  const handleCompleteSession = () => {
    setSessionsCompleted((prev) => prev + 1);
    recordAction({
      id: `language-buddy-session-${Date.now()}`,
      label: `Completed Language Buddy session (${topic})`,
      category: "learning",
      xp: 45,
      impactPoints: 30,
      impactHours: 0.5,
      badgeLabel: sessionsCompleted === 0 ? "Language Buddy" : sessionsCompleted + 1 === 5 ? "Finnish Explorer" : undefined,
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
        padding: 24,
        background: "#fff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 16px 32px rgba(15, 23, 42, 0.08)",
        marginBottom: 28,
        display: "grid",
        gap: 16,
      }}
    >
      <header style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.4, color: "#475569" }}>
              AI Language Buddy
            </p>
            <h2 style={{ margin: "6px 0 0 0", fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
              Practice Finnish with real-life scenarios
            </h2>
          </div>
          <div
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              border: "1px solid #cbd5f5",
              background: "rgba(59,130,246,0.1)",
              color: "#1d4ed8",
              fontWeight: 700,
            }}
          >
            Skill Passport entries {userState.skillPassport.entries.length}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {TOPICS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTopic(item.id);
                setMessages([
                  {
                    id: `intro-${item.id}`,
                    author: "buddy",
                    text: item.systemPrompt,
                  },
                ]);
              }}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: "1px solid #cbd5f5",
                background: topic === item.id ? "linear-gradient(135deg, #2563eb, #7c3aed)" : "#fff",
                color: topic === item.id ? "#fff" : "#1e293b",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div
        style={{
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          background: "#f8fafc",
          padding: 16,
          maxHeight: 320,
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
              background: message.author === "you" ? "#2563eb" : "#fff",
              color: message.author === "you" ? "#fff" : "#1e293b",
              padding: "10px 14px",
              borderRadius: 12,
              maxWidth: "85%",
              boxShadow: "0 8px 16px rgba(15,23,42,0.08)",
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
              {message.author === "you" ? "You" : "Buddy"}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>{message.text}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Kirjoita viesti / Write your message"
          style={{
            flex: "1 1 240px",
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #cbd5f5",
            fontSize: 14,
          }}
        />
        <button
          type="button"
          onClick={handleSend}
          style={{
            padding: "12px 16px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>

      <footer style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "1 1 200px" }}>
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


