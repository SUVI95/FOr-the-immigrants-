"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProfile } from "@/context/UserProfileContext";

type UserStage = "newcomer" | "seeking-work" | "long-term";

const STAGES: Array<{
  id: UserStage;
  icon: string;
  title: string;
  description: string;
  timeframe: string;
}> = [
  {
    id: "newcomer",
    icon: "🆕",
    title: "Just Arrived",
    description: "I'm new to Finland (0-6 months)",
    timeframe: "First 6 months",
  },
  {
    id: "seeking-work",
    icon: "💼",
    title: "Seeking Work",
    description: "Been here but looking for work",
    timeframe: "6+ months",
  },
  {
    id: "long-term",
    icon: "🏠",
    title: "Long-term Resident",
    description: "Living here 2+ years",
    timeframe: "2+ years",
  },
];

const CITIES = ["Kajaani", "Helsinki", "Tampere", "Oulu", "Turku", "Other"];

const ONBOARDING_STORAGE_KEY = "knuut_onboarding_completed";

export default function OnboardingModal() {
  const { state, setUserStage, setCity, recordAction } = useUserProfile();
  const [selectedStage, setSelectedStage] = useState<UserStage | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>("Kajaani");
  const [step, setStep] = useState<"stage" | "city">("stage");
  const [showModal, setShowModal] = useState(false);

  // Check if user has already completed onboarding
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    
    // If already completed in localStorage, load it into state
    if (hasCompletedOnboarding) {
      try {
        const saved = JSON.parse(hasCompletedOnboarding);
        if (saved.userStage && saved.city) {
          setUserStage(saved.userStage);
          setCity(saved.city);
        }
      } catch (e) {
        // Invalid data, clear it
        localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      }
    }
    
    // Only show modal if not completed AND state doesn't have it
    if (!hasCompletedOnboarding && state.userStage === null) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [state.userStage, setUserStage, setCity]);

  // Don't show if already onboarded
  if (!showModal || state.userStage !== null) {
    return null;
  }

  const handleStageSelect = (stage: UserStage) => {
    setSelectedStage(stage);
    setStep("city");
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  const handleComplete = () => {
    if (selectedStage) {
      // Save to localStorage permanently
      if (typeof window !== "undefined") {
        localStorage.setItem(
          ONBOARDING_STORAGE_KEY,
          JSON.stringify({
            userStage: selectedStage,
            city: selectedCity,
            completedAt: new Date().toISOString(),
          })
        );
      }
      
      // Update state
      setUserStage(selectedStage);
      setCity(selectedCity);
      
      // Record action
      recordAction({
        id: `onboarding-complete-${Date.now()}`,
        label: `Completed onboarding: ${selectedStage} in ${selectedCity}`,
        category: "admin",
        xp: 20,
        impactPoints: 10,
      });
      
      // Hide modal
      setShowModal(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.7)",
          backdropFilter: "blur(8px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: "40px",
            maxWidth: 600,
            width: "100%",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            border: "2px solid #e2e8f0",
          }}
        >
          {step === "stage" && (
            <>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
                  Welcome to Knuut!
                </h2>
                <p style={{ margin: 0, fontSize: 16, color: "#64748b" }}>
                  Help us personalize your experience
                </p>
              </div>

              <div style={{ display: "grid", gap: 16, marginBottom: 24 }}>
                {STAGES.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => handleStageSelect(stage.id)}
                    style={{
                      padding: "20px 24px",
                      borderRadius: 16,
                      border: selectedStage === stage.id ? "3px solid #667eea" : "2px solid #e2e8f0",
                      background: selectedStage === stage.id ? "#f0f4ff" : "#ffffff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedStage !== stage.id) {
                        e.currentTarget.style.borderColor = "#cbd5e1";
                        e.currentTarget.style.background = "#f8fafc";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedStage !== stage.id) {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.background = "#ffffff";
                      }
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ fontSize: 32 }}>{stage.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                          {stage.title}
                        </div>
                        <div style={{ fontSize: 14, color: "#64748b" }}>{stage.description}</div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{stage.timeframe}</div>
                      </div>
                      {selectedStage === stage.id && (
                        <div style={{ fontSize: 24, color: "#667eea" }}>✓</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === "city" && (
            <>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📍</div>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
                  Where are you?
                </h2>
                <p style={{ margin: 0, fontSize: 16, color: "#64748b" }}>
                  We'll customize information for your city
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 24 }}>
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    style={{
                      padding: "16px",
                      borderRadius: 12,
                      border: selectedCity === city ? "3px solid #667eea" : "2px solid #e2e8f0",
                      background: selectedCity === city ? "#f0f4ff" : "#ffffff",
                      cursor: "pointer",
                      fontSize: 15,
                      fontWeight: selectedCity === city ? 700 : 600,
                      color: selectedCity === city ? "#667eea" : "#475569",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setStep("stage")}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: 12,
                    border: "2px solid #e2e8f0",
                    background: "#ffffff",
                    color: "#64748b",
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!selectedStage}
                  style={{
                    flex: 1,
                    padding: "14px",
                    borderRadius: 12,
                    border: "none",
                    background: selectedStage ? "linear-gradient(135deg, #667eea, #764ba2)" : "#cbd5e1",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: selectedStage ? "pointer" : "not-allowed",
                  }}
                >
                  Get Started →
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

