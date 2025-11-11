"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { useUserProfile, type LearningFlashCard, type LearningQuiz, type LearningLesson } from "@/context/UserProfileContext";
import { motion } from "framer-motion";
import FlashCard from "@/components/FlashCard";

export default function MyLearningPage() {
  const { state, updateFlashcard, deleteLearningItem } = useUserProfile();
  const [room] = useState(new Room());
  const [activeTab, setActiveTab] = useState<"flashcards" | "quizzes" | "lessons">("flashcards");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [reviewingCardId, setReviewingCardId] = useState<string | null>(null);

  const { flashcards, quizzes, lessons } = state.learningHistory;
  const totalItems = flashcards.length + quizzes.length + lessons.length;

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  const handleEditFlashcard = (card: LearningFlashCard) => {
    setEditingCardId(card.id);
    setEditQuestion(card.question);
    setEditAnswer(card.answer);
  };

  const handleSaveEdit = () => {
    if (editingCardId) {
      const card = flashcards.find((f) => f.id === editingCardId);
      updateFlashcard(editingCardId, {
        question: editQuestion,
        answer: editAnswer,
        lastReviewedAt: new Date().toISOString(),
        reviewedCount: (card?.reviewedCount || 0) + 1,
      });
      setEditingCardId(null);
      setEditQuestion("");
      setEditAnswer("");
    }
  };

  const handleReviewFlashcard = (card: LearningFlashCard) => {
    setReviewingCardId(card.id);
    updateFlashcard(card.id, {
      reviewedCount: card.reviewedCount + 1,
      lastReviewedAt: new Date().toISOString(),
    });
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar activeTab="explore" onTabChange={() => {}} onLearnFinnishClick={handleLearnFinnishClick} />

        <main
          style={{
            flex: 1,
            padding: "32px 28px",
            background: "#f8fafc",
            minHeight: "100vh",
            overflowY: "auto",
          }}
        >
          <div style={{ display: "grid", gap: 24 }}>
            {/* Hero */}
            <section
              style={{
                borderRadius: 24,
                padding: "40px",
                background: "linear-gradient(135deg, #667eea 0%, #7c3aed 50%, #ec4899 100%)",
                color: "#ffffff",
                boxShadow: "0 20px 40px rgba(102,126,234,0.3)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <span style={{ fontSize: 48 }}>📚</span>
                <div>
                  <h1 style={{ margin: 0, fontSize: "2.5rem", fontWeight: 900, lineHeight: 1.1 }}>
                    My Learning History
                  </h1>
                  <p style={{ margin: "8px 0 0 0", fontSize: 16, opacity: 0.95 }}>
                    Review, edit, and practice everything Knuut AI has created for you
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 20 }}>
                <div style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}>
                  <div style={{ fontSize: 28, fontWeight: 800 }}>{flashcards.length}</div>
                  <div style={{ fontSize: 12, opacity: 0.9 }}>Flashcards</div>
                </div>
                <div style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}>
                  <div style={{ fontSize: 28, fontWeight: 800 }}>{quizzes.length}</div>
                  <div style={{ fontSize: 12, opacity: 0.9 }}>Quizzes</div>
                </div>
                <div style={{ padding: "16px 20px", borderRadius: 12, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}>
                  <div style={{ fontSize: 28, fontWeight: 800 }}>{lessons.length}</div>
                  <div style={{ fontSize: 12, opacity: 0.9 }}>Lessons</div>
                </div>
              </div>
            </section>

            {/* Tabs */}
            <div style={{ display: "flex", gap: 12, borderBottom: "2px solid #e2e8f0" }}>
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
                    padding: "12px 20px",
                    border: "none",
                    borderBottom: activeTab === tab.id ? "3px solid #667eea" : "3px solid transparent",
                    background: "transparent",
                    color: activeTab === tab.id ? "#667eea" : "#64748b",
                    fontWeight: activeTab === tab.id ? 700 : 600,
                    fontSize: 15,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  <span style={{ fontSize: 12, opacity: 0.7 }}>({tab.count})</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div style={{ display: "grid", gap: 20 }}>
              {activeTab === "flashcards" && (
                <>
                  {flashcards.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        borderRadius: 20,
                        background: "#ffffff",
                        border: "2px dashed #cbd5e1",
                      }}
                    >
                      <div style={{ fontSize: 64, marginBottom: 16 }}>🃏</div>
                      <h3 style={{ margin: "0 0 8px 0", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                        No flashcards yet
                      </h3>
                      <p style={{ margin: 0, fontSize: 14, color: "#64748b", marginBottom: 20 }}>
                        Start talking to Knuut AI and it will create flashcards for you!
                      </p>
                      <button
                        type="button"
                        onClick={() => (window.location.href = "/knuut-voice")}
                        style={{
                          padding: "12px 24px",
                          borderRadius: 12,
                          border: "none",
                          background: "linear-gradient(135deg, #667eea, #7c3aed)",
                          color: "#ffffff",
                          fontWeight: 700,
                          fontSize: 14,
                          cursor: "pointer",
                        }}
                      >
                        Talk to Knuut AI →
                      </button>
                    </div>
                  ) : (
                    flashcards.map((card, idx) => (
                      <motion.article
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        style={{
                          borderRadius: 16,
                          border: reviewingCardId === card.id ? "2px solid #667eea" : "1px solid #e2e8f0",
                          padding: 24,
                          background: "#ffffff",
                          boxShadow: reviewingCardId === card.id ? "0 8px 24px rgba(102,126,234,0.2)" : "0 2px 8px rgba(0,0,0,0.04)",
                        }}
                      >
                        {reviewingCardId === card.id ? (
                          <div style={{ marginBottom: 20 }}>
                            <FlashCard
                              card={{
                                id: card.id,
                                question: card.question,
                                answer: card.answer,
                                isFlipped: false,
                              }}
                              onFlip={() => setReviewingCardId(null)}
                            />
                            <button
                              type="button"
                              onClick={() => setReviewingCardId(null)}
                              style={{
                                marginTop: 16,
                                padding: "8px 16px",
                                borderRadius: 8,
                                border: "1px solid #cbd5e1",
                                background: "#ffffff",
                                color: "#64748b",
                                fontWeight: 600,
                                fontSize: 13,
                                cursor: "pointer",
                              }}
                            >
                              Done Reviewing
                            </button>
                          </div>
                        ) : editingCardId === card.id ? (
                          <div style={{ display: "grid", gap: 16 }}>
                            <input
                              type="text"
                              value={editQuestion}
                              onChange={(e) => setEditQuestion(e.target.value)}
                              placeholder="Question"
                              style={{
                                padding: "12px 16px",
                                borderRadius: 12,
                                border: "1px solid #cbd5e1",
                                fontSize: 15,
                              }}
                            />
                            <textarea
                              value={editAnswer}
                              onChange={(e) => setEditAnswer(e.target.value)}
                              placeholder="Answer"
                              rows={4}
                              style={{
                                padding: "12px 16px",
                                borderRadius: 12,
                                border: "1px solid #cbd5e1",
                                fontSize: 15,
                                resize: "vertical",
                              }}
                            />
                            <div style={{ display: "flex", gap: 12 }}>
                              <button
                                type="button"
                                onClick={handleSaveEdit}
                                style={{
                                  flex: 1,
                                  padding: "12px 20px",
                                  borderRadius: 12,
                                  border: "none",
                                  background: "#22c55e",
                                  color: "#ffffff",
                                  fontWeight: 700,
                                  fontSize: 14,
                                  cursor: "pointer",
                                }}
                              >
                                Save Changes
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
                                  padding: "12px 20px",
                                  borderRadius: 12,
                                  border: "1px solid #cbd5e1",
                                  background: "#ffffff",
                                  color: "#64748b",
                                  fontWeight: 600,
                                  fontSize: 14,
                                  cursor: "pointer",
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div style={{ marginBottom: 16 }}>
                              <h3 style={{ margin: "0 0 8px 0", fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
                                {card.question}
                              </h3>
                              <p style={{ margin: 0, fontSize: 15, color: "#475569", lineHeight: 1.6 }}>
                                {card.answer}
                              </p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingTop: 16,
                                borderTop: "1px solid #e2e8f0",
                              }}
                            >
                              <div style={{ fontSize: 12, color: "#64748b" }}>
                                <span>Reviewed {card.reviewedCount} times</span>
                                {card.lastReviewedAt && (
                                  <>
                                    <span> · </span>
                                    <span>Last: {new Date(card.lastReviewedAt).toLocaleDateString()}</span>
                                  </>
                                )}
                                {card.topic && (
                                  <>
                                    <span> · </span>
                                    <span>{card.topic}</span>
                                  </>
                                )}
                              </div>
                              <div style={{ display: "flex", gap: 8 }}>
                                <button
                                  type="button"
                                  onClick={() => handleReviewFlashcard(card)}
                                  style={{
                                    padding: "8px 16px",
                                    borderRadius: 8,
                                    border: "1px solid #667eea",
                                    background: "#ffffff",
                                    color: "#667eea",
                                    fontWeight: 600,
                                    fontSize: 13,
                                    cursor: "pointer",
                                  }}
                                >
                                  Review
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEditFlashcard(card)}
                                  style={{
                                    padding: "8px 16px",
                                    borderRadius: 8,
                                    border: "1px solid #cbd5e1",
                                    background: "#ffffff",
                                    color: "#64748b",
                                    fontWeight: 600,
                                    fontSize: 13,
                                    cursor: "pointer",
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteLearningItem("flashcard", card.id)}
                                  style={{
                                    padding: "8px 16px",
                                    borderRadius: 8,
                                    border: "1px solid #ef4444",
                                    background: "#ffffff",
                                    color: "#ef4444",
                                    fontWeight: 600,
                                    fontSize: 13,
                                    cursor: "pointer",
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </motion.article>
                    ))
                  )}
                </>
              )}

              {activeTab === "quizzes" && (
                <>
                  {quizzes.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        borderRadius: 20,
                        background: "#ffffff",
                        border: "2px dashed #cbd5e1",
                      }}
                    >
                      <div style={{ fontSize: 64, marginBottom: 16 }}>📝</div>
                      <h3 style={{ margin: "0 0 8px 0", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                        No quizzes yet
                      </h3>
                      <p style={{ margin: 0, fontSize: 14, color: "#64748b", marginBottom: 20 }}>
                        Start talking to Knuut AI and it will create quizzes for you!
                      </p>
                      <button
                        type="button"
                        onClick={() => (window.location.href = "/knuut-voice")}
                        style={{
                          padding: "12px 24px",
                          borderRadius: 12,
                          border: "none",
                          background: "linear-gradient(135deg, #667eea, #7c3aed)",
                          color: "#ffffff",
                          fontWeight: 700,
                          fontSize: 14,
                          cursor: "pointer",
                        }}
                      >
                        Talk to Knuut AI →
                      </button>
                    </div>
                  ) : (
                    quizzes.map((quiz, idx) => (
                      <motion.article
                        key={quiz.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        style={{
                          borderRadius: 16,
                          border: "1px solid #e2e8f0",
                          padding: 24,
                          background: "#ffffff",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}
                      >
                        <div style={{ marginBottom: 16 }}>
                          <h3 style={{ margin: "0 0 8px 0", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                            {quiz.title}
                          </h3>
                          <p style={{ margin: "0 0 12px 0", fontSize: 14, color: "#64748b" }}>
                            {quiz.questions.length} questions
                            {quiz.score !== undefined && ` · Score: ${quiz.score}%`}
                            {quiz.completedAt && ` · Completed: ${new Date(quiz.completedAt).toLocaleDateString()}`}
                          </p>
                          {quiz.topic && (
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 10px",
                                borderRadius: 6,
                                background: "#e0f2fe",
                                color: "#0369a1",
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                            >
                              {quiz.topic}
                            </span>
                          )}
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 16, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
                          <button
                            type="button"
                            onClick={() => deleteLearningItem("quiz", quiz.id)}
                            style={{
                              marginLeft: "auto",
                              padding: "8px 16px",
                              borderRadius: 8,
                              border: "1px solid #ef4444",
                              background: "#ffffff",
                              color: "#ef4444",
                              fontWeight: 600,
                              fontSize: 13,
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </motion.article>
                    ))
                  )}
                </>
              )}

              {activeTab === "lessons" && (
                <>
                  {lessons.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        borderRadius: 20,
                        background: "#ffffff",
                        border: "2px dashed #cbd5e1",
                      }}
                    >
                      <div style={{ fontSize: 64, marginBottom: 16 }}>📖</div>
                      <h3 style={{ margin: "0 0 8px 0", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                        No lessons yet
                      </h3>
                      <p style={{ margin: 0, fontSize: 14, color: "#64748b", marginBottom: 20 }}>
                        Start talking to Knuut AI and it will create lessons for you!
                      </p>
                      <button
                        type="button"
                        onClick={() => (window.location.href = "/knuut-voice")}
                        style={{
                          padding: "12px 24px",
                          borderRadius: 12,
                          border: "none",
                          background: "linear-gradient(135deg, #667eea, #7c3aed)",
                          color: "#ffffff",
                          fontWeight: 700,
                          fontSize: 14,
                          cursor: "pointer",
                        }}
                      >
                        Talk to Knuut AI →
                      </button>
                    </div>
                  ) : (
                    lessons.map((lesson, idx) => (
                      <motion.article
                        key={lesson.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        style={{
                          borderRadius: 16,
                          border: "1px solid #e2e8f0",
                          padding: 24,
                          background: "#ffffff",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}
                      >
                        <div style={{ marginBottom: 16 }}>
                          <h3 style={{ margin: "0 0 8px 0", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                            {lesson.title}
                          </h3>
                          <p style={{ margin: "0 0 12px 0", fontSize: 15, color: "#475569", lineHeight: 1.7 }}>
                            {lesson.content}
                          </p>
                          <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 12, color: "#64748b" }}>
                            <span
                              style={{
                                padding: "4px 10px",
                                borderRadius: 6,
                                background: "#e0f2fe",
                                color: "#0369a1",
                                fontWeight: 600,
                              }}
                            >
                              {lesson.topic}
                            </span>
                            <span>{new Date(lesson.createdAt).toLocaleDateString()}</span>
                            {lesson.completedAt && (
                              <>
                                <span>·</span>
                                <span>Completed: {new Date(lesson.completedAt).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                        {lesson.notes && (
                          <div
                            style={{
                              marginTop: 16,
                              padding: 12,
                              borderRadius: 8,
                              background: "#f8fafc",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <p style={{ margin: 0, fontSize: 13, color: "#475569", fontStyle: "italic" }}>
                              Notes: {lesson.notes}
                            </p>
                          </div>
                        )}
                        <div style={{ display: "flex", gap: 8, marginTop: 16, paddingTop: 16, borderTop: "1px solid #e2e8f0" }}>
                          <button
                            type="button"
                            onClick={() => deleteLearningItem("lesson", lesson.id)}
                            style={{
                              marginLeft: "auto",
                              padding: "8px 16px",
                              borderRadius: 8,
                              border: "1px solid #ef4444",
                              background: "#ffffff",
                              color: "#ef4444",
                              fontWeight: 600,
                              fontSize: 13,
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </motion.article>
                    ))
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </RoomContext.Provider>
  );
}

