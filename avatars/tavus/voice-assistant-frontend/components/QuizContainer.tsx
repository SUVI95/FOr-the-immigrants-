import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoomContext, useVoiceAssistant } from "@livekit/components-react";
import Quiz, { QuizQuestion } from "./Quiz";

export interface SubmittedQuiz {
  id: string;
  questions: QuizQuestion[];
  answers: Record<string, string>;
}

export default function QuizContainer() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const room = useRoomContext();
  const { agent } = useVoiceAssistant();
  const { saveQuiz } = useUserProfile();

  useEffect(() => {
    if (!room) return;

    // Register RPC method to receive quizzes
    const handleShowQuiz = async (data: { payload?: string | object }): Promise<string> => {
      try {
        console.log("Received quiz RPC data:", data);
        
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
          // Reset answers when showing a new quiz
          setSelectedAnswers({});
          setQuizId(payload.id);
          setQuestions(payload.questions);
          setCurrentQuestionIndex(0);
          setIsVisible(true);
          
          // Save to learning history
          saveQuiz({
            id: payload.id,
            title: payload.title || "Finnish Quiz",
            questions: payload.questions.map((q: any) => ({
              id: q.id,
              text: q.text,
              answers: q.answers.map((a: any) => ({
                id: a.id,
                text: a.text,
                isCorrect: a.is_correct || a.isCorrect,
              })),
            })),
            createdAt: new Date().toISOString(),
            topic: payload.topic || "Finnish Learning",
          });
        } else if (payload.action === "hide") {
          setIsVisible(false);
        }
        
        return "Success";
      } catch (error) {
        console.error("Error processing quiz data:", error);
        return "Error: " + (error instanceof Error ? error.message : String(error));
      }
    };

    room.localParticipant.registerRpcMethod(
      "client.quiz",
      handleShowQuiz
    );

    return () => {
      // Clean up RPC method when component unmounts
      room.localParticipant.unregisterRpcMethod("client.quiz");
    };
  }, [room, saveQuiz]);

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!agent || !quizId) return;
    
    try {
      console.log(`Submitting quiz ${quizId} to agent ${agent.identity}`);
      
      const payload = {
        id: quizId,
        answers: selectedAnswers
      };
      
      const result = await room.localParticipant.performRpc({
        destinationIdentity: agent.identity,
        method: "agent.submitQuiz",
        payload: JSON.stringify(payload)
      });
      
      console.log(`Quiz submission result: ${result}`);
      
      // Hide the quiz after submission
      setIsVisible(false);
    } catch (error: unknown) {
      console.error("Error submitting quiz:", error);
      if (error instanceof Error) {
        console.error(error.stack);
      }
    }
  };

  const currentQuestion = currentQuestionIndex !== null && questions[currentQuestionIndex] 
    ? questions[currentQuestionIndex] 
    : null;

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const allQuestionsAnswered = questions.length > 0 && 
    questions.every(q => selectedAnswers[q.id] !== undefined);

  return (
    <AnimatePresence>
      {isVisible && currentQuestion && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          style={{
            position: "fixed",
            left: "32px",
            top: "120px",
            width: "420px",
            maxWidth: "90vw",
            background: "linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.98) 100%)",
            color: "#f8fafc",
            padding: "28px",
            borderRadius: "24px",
            boxShadow: "0 24px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.2)",
            zIndex: 9999,
            border: "2px solid rgba(124,58,237,0.3)",
            backdropFilter: "blur(20px)"
          }}
        >
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            paddingBottom: "16px",
            borderBottom: "2px solid rgba(124,58,237,0.2)"
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
                background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 16px rgba(236,72,153,0.4)"
              }}>
                <span className="fa-solid fa-question-circle" style={{
                  color: "#ffffff",
                  fontSize: "18px"
                }}></span>
              </div>
              <h2 style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#f8fafc",
                margin: 0
              }}>Quiz</h2>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "8px",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                color: "#94a3b8",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                e.currentTarget.style.color = "#f8fafc";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "#94a3b8";
              }}
            >
              ×
            </button>
          </div>
          
          <Quiz 
            question={currentQuestion} 
            selectedAnswerId={selectedAnswers[currentQuestion.id]}
            onAnswerSelect={(answerId) => handleAnswerSelect(currentQuestion.id, answerId)}
          />
          
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "24px",
            paddingTop: "20px",
            borderTop: "2px solid rgba(124,58,237,0.2)"
          }}>
            <button
              onClick={() => setCurrentQuestionIndex(prev => 
                prev !== null ? Math.max(0, prev - 1) : 0
              )}
              disabled={currentQuestionIndex === 0}
              style={{
                padding: "10px 18px",
                background: currentQuestionIndex === 0
                  ? "rgba(148,163,184,0.2)"
                  : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: currentQuestionIndex === 0 ? "#94a3b8" : "#ffffff",
                border: "none",
                borderRadius: "12px",
                fontWeight: 600,
                cursor: currentQuestionIndex === 0 ? "not-allowed" : "pointer",
                opacity: currentQuestionIndex === 0 ? 0.5 : 1,
                boxShadow: currentQuestionIndex === 0 ? "none" : "0 8px 16px rgba(59,130,246,0.3)",
                transition: "all 0.2s"
              }}
            >
              ← Previous
            </button>
            <span style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#cbd5e1",
              background: "rgba(124,58,237,0.2)",
              padding: "8px 16px",
              borderRadius: "12px"
            }}>{(currentQuestionIndex ?? 0) + 1} / {questions.length}</span>
            {!isLastQuestion ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => 
                  prev !== null ? Math.min(questions.length - 1, prev + 1) : 0
                )}
                style={{
                  padding: "10px 18px",
                  background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 8px 16px rgba(59,130,246,0.3)",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(59,130,246,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 16px rgba(59,130,246,0.3)";
                }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={!allQuestionsAnswered}
                style={{
                  padding: "10px 18px",
                  background: !allQuestionsAnswered
                    ? "rgba(148,163,184,0.2)"
                    : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  color: !allQuestionsAnswered ? "#94a3b8" : "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: 700,
                  cursor: !allQuestionsAnswered ? "not-allowed" : "pointer",
                  opacity: !allQuestionsAnswered ? 0.5 : 1,
                  boxShadow: !allQuestionsAnswered ? "none" : "0 8px 16px rgba(34,197,94,0.4)",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  if (allQuestionsAnswered) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(34,197,94,0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (allQuestionsAnswered) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(34,197,94,0.4)";
                  }
                }}
              >
                ✓ Submit Quiz
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
