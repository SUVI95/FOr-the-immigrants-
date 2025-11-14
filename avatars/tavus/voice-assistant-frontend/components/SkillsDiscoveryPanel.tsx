"use client";

import { useState, useEffect } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

interface SkillsAnalysis {
  skills: string[];
  analysis: string;
  explanation: string;
}

export function SkillsDiscoveryPanel() {
  const { state } = useUserProfile();
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SkillsAnalysis | null>(null);
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [workExperience, setWorkExperience] = useState<string[]>([]);

  // Load user qualifications and experience
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userId = state.name || "anonymous";
        const response = await fetch(`/api/skills/get?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          // Get qualifications from skill passport or API
          if (data.qualifications) {
            setQualifications(data.qualifications);
          } else if (state.skillPassport?.entries) {
            setQualifications(state.skillPassport.entries.map((e: any) => e.title));
          }
          if (data.workExperience) {
            setWorkExperience(data.workExperience);
          }
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };
    loadUserData();
  }, [state.name, state.skillPassport]);

  const analyzeSkills = async () => {
    setAnalyzing(true);
    try {
      const userId = state.name || "anonymous";
      
      // Use loaded qualifications or fallback to skill passport
      const quals = qualifications.length > 0 
        ? qualifications 
        : (state.skillPassport?.entries?.map((e: any) => e.title) || []);
      
      // If no qualifications, provide helpful message
      if (quals.length === 0 && workExperience.length === 0) {
        alert("Please add your qualifications and work experience in the 'My Skills' page first, then come back to analyze.");
        setAnalyzing(false);
        return;
      }

      const response = await fetch("/api/skills/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          qualifications: quals,
          workExperience: workExperience,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Analysis failed");
      }

      const data = await response.json();
      
      // Ensure we have the expected format
      if (data.skills && Array.isArray(data.skills)) {
        // Extract skill names if they're objects
        const skillNames = data.skills.map((s: any) => typeof s === "string" ? s : s.skill || s.name || "Unknown");
        setAnalysis({
          skills: skillNames,
          analysis: data.analysis || "Skills analysis completed.",
          explanation: data.explanation || "This analysis helps you understand your skills profile.",
        });
      } else {
        // Fallback if API returns unexpected format
        setAnalysis({
          skills: ["Analysis completed"],
          analysis: data.analysis || "Your skills have been analyzed.",
          explanation: "Use the 'My Skills' page to see detailed results.",
        });
      }
    } catch (error: any) {
      console.error("Skills analysis error:", error);
      alert(`Failed to analyze skills: ${error.message || "Please try again or add qualifications first."}`);
    } finally {
      setAnalyzing(false);
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
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" }}>
            Skills Discovery (Research)
          </h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "0.875rem", color: "#64748b" }}>
            AI analyzes your skills to help you discover job opportunities
          </p>
        </div>
      </div>

      {!analysis && (
        <div>
          <p style={{ margin: "0 0 16px 0", fontSize: "0.875rem", color: "#475569", lineHeight: 1.7 }}>
            Discover jobs that match your skills. AI will analyze your qualifications and experience
            to help you find relevant opportunities.
          </p>
          <button
            onClick={analyzeSkills}
            disabled={analyzing}
            style={{
              padding: "12px 20px",
              borderRadius: 12,
              border: "none",
              background: analyzing ? "#cbd5f5" : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: "0.875rem",
              cursor: analyzing ? "not-allowed" : "pointer",
            }}
          >
            {analyzing ? "Analyzing Your Skills..." : "Analyze My Skills"}
          </button>
        </div>
      )}

      {analysis && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "1rem", fontWeight: 600, color: "#0f172a" }}>
              Your Skills Profile
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {analysis.skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    color: "#1e40af",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div style={{ padding: 16, background: "#f8fafc", borderRadius: 12, marginBottom: 16 }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>
              AI Analysis (Informational)
            </h4>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#475569", lineHeight: 1.7 }}>
              {analysis.analysis}
            </p>
            <p style={{ margin: "12px 0 0 0", fontSize: "0.75rem", color: "#64748b", fontStyle: "italic" }}>
              {analysis.explanation}
            </p>
          </div>

          <div style={{ padding: 12, background: "#fef3c7", borderRadius: 8, border: "1px solid #fcd34d" }}>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#92400e", lineHeight: 1.6 }}>
              <strong>Next Step:</strong> Use these skills to discover matching job opportunities below.
              You decide which jobs to explore and apply for.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

