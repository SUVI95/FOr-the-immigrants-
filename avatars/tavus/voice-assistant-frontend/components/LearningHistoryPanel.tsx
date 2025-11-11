"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProfile, type LearningFlashCard, type LearningQuiz, type LearningLesson } from "@/context/UserProfileContext";
import FlashCard from "./FlashCard";

export default function LearningHistoryPanel() {
  const { state, updateFlashcard, deleteLearningItem } = useUserProfile();
  const [activeTab, setActiveTab] = useState<"flashcards" | "quizzes" | "lessons">("flashcards");
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  const { flashcards, quizzes, lessons } = state.learningHistory;
  const totalItems = flashcards.length + quizzes.length + lessons.length;

  const handleEditFlashcard = (card: LearningFlashCard) => {
    setEditingCardId(card.id);
    setEditQuestion(card.question);
    setEditAnswer(card.answer);
  };

  const handleSaveEdit = () => {
    if (editingCardId) {
      updateFlashcard(editingCardId, {
        question: editQuestion,
        answer: editAnswer,
        lastReviewedAt: new Date().toISOString(),
        reviewedCount: flashcards.find((f) => f.id === editingCardId)?.reviewedCount || 0 + 1,
      });
      setEditingCardId(null);
      setEditQuestion("");
      setEditAnswer("");
    }
  };

  const handleReviewFlashcard = (cardId: string) => {
    const card = flashcards.find((f) => f.id === cardId);
    if (card) {
      updateFlashcard(cardId, {
        reviewedCount: card.reviewedCount + 1,
        lastReviewedAt: new Date().toISOString(),
      });
    }
  };

  if (totalItems === 0 && !isExpanded) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          style={{
            padding: "12px 20px",
            borderRadius: 16,
            border: "none",
            background: "linear-gradient(135deg, #667eea 0%, #7c3aed 100%)",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 8px 24px rgba(102,126,234,0.4)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>📚</span>
          <span>My Learning</span>
        </button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            bottom: 0,
            width: "min(420px, 90vw)",
            background: "#ffffff",
            boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "2px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "linear-gradient(135deg, #667eea 0%, #7c3aed 100%)",
              color: "#ffffff",
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>My Learning History</h3>
              <p style={{ margin: "4px 0 0 0", fontSize: 12, opacity: 0.9 }}>
                {totalItems} saved items
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "none",
                background: "rgba(255,255,255,0.2)",
                color: "#ffffff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid #e2e8f0",
              background: "#f8fafc",
            }}
          >
            {[
              { id: "flashcards" as const, label: "Flashcards", count: flashcards.length, icon: "🃏" },
              { id: "quizzes" as const, label: "Quizzes", count: quizzes.length, icon: "📝" },
              { id: "lessons" as const, label: "Lessons", count: lessons.length, icon: "📖" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: "12px 8px",
                  border: "none",
                  background: activeTab === tab.id ? "#ffffff" : "transparent",
                  borderBottom: activeTab === tab.id ? "2px solid #667eea" : "2px solid transparent",
                  color: activeTab === tab.id ? "#667eea" : "#64748b",
                  fontWeight: activeTab === tab.id ? 700 : 600,
                  fontSize: 13,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span style={{ fontSize: 11, opacity: 0.7 }}>({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              display: "grid",
              gap: 16,
            }}
          >
            {activeTab === "flashcards" && (
              <>
                {flashcards.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🃏</div>
                    <p style={{ margin: 0, fontSize: 14 }}>No flashcards yet. Start talking to Knuut AI!</p>
                  </div>
                ) : (
                  flashcards.map((card) => (
                    <div
                      key={card.id}
                      style={{
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        padding: 16,
                        background: "#ffffff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      }}
                    >
                      {editingCardId === card.id ? (
                        <div style={{ display: "grid", gap: 12 }}>
                          <input
                            type="text"
                            value={editQuestion}
                            onChange={(e) => setEditQuestion(e.target.value)}
                            placeholder="Question"
                            style={{
                              padding: "8px 12px",
                              borderRadius: 8,
                              border: "1px solid #cbd5e1",
                              fontSize: 14,
                            }}
                          />
                          <textarea
                            value={editAnswer}
                            onChange={(e) => setEditAnswer(e.target.value)}
                            placeholder="Answer"
                            rows={3}
                            style={{
                              padding: "8px 12px",
                              borderRadius: 8,
                              border: "1px solid #cbd5e1",
                              fontSize: 14,
                              resize: "vertical",
                            }}
                          />
                          <div style={{ display: "flex", gap: 8 }}>
                            <button
                              type="button"
                              onClick={handleSaveEdit}
                              style={{
                                flex: 1,
                                padding: "8px 12px",
                                borderRadius: 8,
                                border: "none",
                                background: "#22c55e",
                                color: "#ffffff",
                                fontWeight: 600,
                                fontSize: 13,
                                cursor: "pointer",
                              }}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCardId(null);
                                setEditQuestion("");
                                setEditAnswer("");
                              }}
                              style={{
                                flex: 1,
                                padding: "8px 12px",
                                borderRadius: 8,
                                border: "1px solid #cbd5e1",
                                background: "#ffffff",
                                color: "#64748b",
                                fontWeight: 600,
                                fontSize: 13,
                                cursor: "pointer",
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{ marginBottom: 12 }}>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                              {card.question}
                            </p>
                            <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>{card.answer}</p>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "#64748b" }}>
                            <span>Reviewed {card.reviewedCount} times</span>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button
                                type="button"
                                onClick={() => handleReviewFlashcard(card.id)}
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: 6,
                                  border: "1px solid #cbd5e1",
                                  background: "#ffffff",
                                  color: "#64748b",
                                  fontSize: 11,
                                  cursor: "pointer",
                                }}
                              >
                                Review
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEditFlashcard(card)}
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: 6,
                                  border: "1px solid #cbd5e1",
                                  background: "#ffffff",
                                  color: "#64748b",
                                  fontSize: 11,
                                  cursor: "pointer",
                                }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteLearningItem("flashcard", card.id)}
                                style={{
                                  padding: "4px 8px",
                                  borderRadius: 6,
                                  border: "1px solid #ef4444",
                                  background: "#ffffff",
                                  color: "#ef4444",
                                  fontSize: 11,
                                  cursor: "pointer",
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === "quizzes" && (
              <>
                {quizzes.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
                    <p style={{ margin: 0, fontSize: 14 }}>No quizzes yet. Start talking to Knuut AI!</p>
                  </div>
                ) : (
                  quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      style={{
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        padding: 16,
                        background: "#ffffff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      }}
                    >
                      <h4 style={{ margin: "0 0 8px 0", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                        {quiz.title}
                      </h4>
                      <p style={{ margin: "0 0 12px 0", fontSize: 12, color: "#64748b" }}>
                        {quiz.questions.length} questions
                        {quiz.score !== undefined && ` · Score: ${quiz.score}%`}
                      </p>
                      <div style={{ display: "flex", gap: 8, fontSize: 11, color: "#64748b" }}>
                        <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
                        <button
                          type="button"
                          onClick={() => deleteLearningItem("quiz", quiz.id)}
                          style={{
                            marginLeft: "auto",
                            padding: "4px 8px",
                            borderRadius: 6,
                            border: "1px solid #ef4444",
                            background: "#ffffff",
                            color: "#ef4444",
                            fontSize: 11,
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {activeTab === "lessons" && (
              <>
                {lessons.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📖</div>
                    <p style={{ margin: 0, fontSize: 14 }}>No lessons yet. Start talking to Knuut AI!</p>
                  </div>
                ) : (
                  lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      style={{
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        padding: 16,
                        background: "#ffffff",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      }}
                    >
                      <h4 style={{ margin: "0 0 8px 0", fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                        {lesson.title}
                      </h4>
                      <p style={{ margin: "0 0 12px 0", fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
                        {lesson.content.substring(0, 150)}...
                      </p>
                      <div style={{ display: "flex", gap: 8, fontSize: 11, color: "#64748b" }}>
                        <span>{lesson.topic}</span>
                        <span>·</span>
                        <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
                        <button
                          type="button"
                          onClick={() => deleteLearningItem("lesson", lesson.id)}
                          style={{
                            marginLeft: "auto",
                            padding: "4px 8px",
                            borderRadius: 6,
                            border: "1px solid #ef4444",
                            background: "#ffffff",
                            color: "#ef4444",
                            fontSize: 11,
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

