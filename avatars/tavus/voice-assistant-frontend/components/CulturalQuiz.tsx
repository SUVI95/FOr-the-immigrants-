"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProfile } from "@/context/UserProfileContext";

type QuizScenario = {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }>;
  category: string;
  xpReward: number;
};

const MOCK_SCENARIOS: QuizScenario[] = [
  {
    id: "scenario-1",
    question: "You're 5 minutes late to a meeting. What should you do?",
    options: [
      {
        id: "a",
        text: "Call ahead to say you're running late",
        isCorrect: true,
        explanation: "✅ Good! In Finland, punctuality is very important. Always call or message if you'll be late.",
      },
      {
        id: "b",
        text: "Just show up quietly and hope no one notices",
        isCorrect: false,
        explanation: "❌ Not ideal. Being late without notice is seen as disrespectful in Finnish culture.",
      },
      {
        id: "c",
        text: "Skip the meeting entirely",
        isCorrect: false,
        explanation: "❌ Never skip without canceling. This damages trust and relationships.",
      },
    ],
    category: "Work Culture",
    xpReward: 15,
  },
  {
    id: "scenario-2",
    question: "A Finnish colleague is quiet during lunch. What should you do?",
    options: [
      {
        id: "a",
        text: "Keep trying to make conversation",
        isCorrect: false,
        explanation: "❌ Silence is normal in Finland. Don't force conversation - it can feel intrusive.",
      },
      {
        id: "b",
        text: "Enjoy the silence together",
        isCorrect: true,
        explanation: "✅ Perfect! Silence is comfortable in Finland. It's not rude - it's just how Finns are.",
      },
      {
        id: "c",
        text: "Ask if something is wrong",
        isCorrect: false,
        explanation: "❌ They're probably fine. Finns value quiet time and don't need constant talking.",
      },
    ],
    category: "Communication",
    xpReward: 15,
  },
  {
    id: "scenario-3",
    question: "You need to see a doctor. What should you do?",
    options: [
      {
        id: "a",
        text: "Just show up at the clinic",
        isCorrect: false,
        explanation: "❌ No! Always book appointments in advance. Walk-ins are rarely accepted.",
      },
      {
        id: "b",
        text: "Book an appointment online or by phone",
        isCorrect: true,
        explanation: "✅ Correct! In Finland, you must book appointments in advance. Use online services or call.",
      },
      {
        id: "c",
        text: "Call the doctor's personal phone",
        isCorrect: false,
        explanation: "❌ Use official booking systems. Personal calls are not appropriate.",
      },
    ],
    category: "Everyday Life",
    xpReward: 15,
  },
  {
    id: "scenario-4",
    question: "Your boss asks for your opinion. How should you respond?",
    options: [
      {
        id: "a",
        text: "Be direct and honest",
        isCorrect: true,
        explanation: "✅ Yes! Finns value directness. Say what you think clearly and honestly.",
      },
      {
        id: "b",
        text: "Say what you think they want to hear",
        isCorrect: false,
        explanation: "❌ No. Finns prefer honesty over politeness. Be genuine.",
      },
      {
        id: "c",
        text: "Avoid giving your opinion",
        isCorrect: false,
        explanation: "❌ If asked, share your view. Finns appreciate honest input.",
      },
    ],
    category: "Communication",
    xpReward: 15,
  },
  {
    id: "scenario-5",
    question: "You're waiting in a queue. Someone cuts in front. What should you do?",
    options: [
      {
        id: "a",
        text: "Say nothing and let it go",
        isCorrect: false,
        explanation: "❌ Queues are important in Finland. Politely point out the queue order.",
      },
      {
        id: "b",
        text: "Politely point out the queue",
        isCorrect: true,
        explanation: "✅ Good! Queues matter in Finland. Finns respect order - politely mention it.",
      },
      {
        id: "c",
        text: "Get angry and confront them",
        isCorrect: false,
        explanation: "❌ Stay calm. A polite reminder is enough - Finns value calm communication.",
      },
    ],
    category: "Everyday Life",
    xpReward: 15,
  },
  {
    id: "scenario-6",
    question: "You receive a work contract. What should you do first?",
    options: [
      {
        id: "a",
        text: "Sign it immediately",
        isCorrect: false,
        explanation: "❌ Never sign without reading! Always read contracts carefully in Finland.",
      },
      {
        id: "b",
        text: "Read it carefully, ask questions if needed",
        isCorrect: true,
        explanation: "✅ Perfect! Always read contracts thoroughly. Ask questions before signing.",
      },
      {
        id: "c",
        text: "Ask a friend to sign for you",
        isCorrect: false,
        explanation: "❌ You must sign yourself. Read it first, then sign if you understand.",
      },
    ],
    category: "Rights & Responsibilities",
    xpReward: 20,
  },
];

export default function CulturalQuiz({ cardId }: { cardId: string }) {
  const { recordAction } = useUserProfile();
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set());

  // Filter scenarios by category if cardId matches
  const relevantScenarios = MOCK_SCENARIOS.filter((s) => {
    const categoryMap: Record<string, string> = {
      "work-culture": "Work Culture",
      "communication": "Communication",
      "everyday-life": "Everyday Life",
      "rights-responsibilities": "Rights & Responsibilities",
    };
    return s.category === categoryMap[cardId];
  });

  const currentScenario = relevantScenarios[currentScenarioIndex] || relevantScenarios[0];

  if (!currentScenario || relevantScenarios.length === 0) {
    return null; // No scenarios for this category
  }

  const handleOptionSelect = (optionId: string) => {
    if (selectedOption) return; // Already answered

    setSelectedOption(optionId);
    setShowExplanation(true);

    const option = currentScenario.options.find((o) => o.id === optionId);
    if (option?.isCorrect) {
      setCompletedScenarios((prev) => new Set([...prev, currentScenario.id]));
      recordAction({
        id: `cultural-quiz-${currentScenario.id}-${Date.now()}`,
        label: `Completed cultural quiz: ${currentScenario.question}`,
        category: "learning",
        xp: currentScenario.xpReward,
        impactPoints: 10,
      });
    }
  };

  const handleNext = () => {
    if (currentScenarioIndex < relevantScenarios.length - 1) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const handleClose = () => {
    setCurrentScenarioIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  return (
    <div
      style={{
        marginTop: 20,
        padding: "24px",
        borderRadius: 16,
        background: "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)",
        border: "2px solid #c7d2fe",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
            💡 Test Your Understanding
          </h3>
          <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#64748b" }}>
            Scenario {currentScenarioIndex + 1} of {relevantScenarios.length}
          </p>
        </div>
        <button
          onClick={handleClose}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid #c7d2fe",
            background: "#ffffff",
            color: "#64748b",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#0f172a", lineHeight: 1.5 }}>
          {currentScenario.question}
        </p>
      </div>

      <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
        {currentScenario.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const isCorrect = option.isCorrect;
          const showResult = showExplanation;

          let bgColor = "#ffffff";
          let borderColor = "#c7d2fe";
          let textColor = "#0f172a";

          if (showResult) {
            if (isSelected) {
              bgColor = isCorrect ? "#dcfce7" : "#fee2e2";
              borderColor = isCorrect ? "#22c55e" : "#ef4444";
              textColor = isCorrect ? "#166534" : "#991b1b";
            } else if (isCorrect) {
              bgColor = "#dcfce7";
              borderColor = "#22c55e";
              textColor = "#166534";
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              disabled={!!selectedOption}
              style={{
                padding: "16px",
                borderRadius: 12,
                border: `2px solid ${borderColor}`,
                background: bgColor,
                color: textColor,
                fontSize: 15,
                fontWeight: 600,
                textAlign: "left",
                cursor: selectedOption ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: `2px solid ${borderColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {option.id.toUpperCase()}
                </div>
                <span style={{ flex: 1 }}>{option.text}</span>
                {showResult && isSelected && (
                  <span style={{ fontSize: 20 }}>{isCorrect ? "✓" : "✗"}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showExplanation && selectedOption && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "16px",
              borderRadius: 12,
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              marginBottom: 16,
            }}
          >
            <p style={{ margin: 0, fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
              {currentScenario.options.find((o) => o.id === selectedOption)?.explanation}
            </p>
          </motion.div>
        </AnimatePresence>
      )}

      {showExplanation && (
        <div style={{ display: "flex", gap: 12 }}>
          {currentScenarioIndex < relevantScenarios.length - 1 ? (
            <button
              onClick={handleNext}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "#ffffff",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Next Scenario →
            </button>
          ) : (
            <div
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 12,
                background: "#dcfce7",
                color: "#166534",
                fontSize: 15,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              ✓ All scenarios completed! +{currentScenario.xpReward} XP
            </div>
          )}
        </div>
      )}
    </div>
  );
}

