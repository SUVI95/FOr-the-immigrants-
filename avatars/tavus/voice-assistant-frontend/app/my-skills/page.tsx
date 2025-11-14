"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useUserProfile } from "@/context/UserProfileContext";
import { SkillsDiscoveryPanel } from "@/components/SkillsDiscoveryPanel";

export default function MySkillsPage() {
  const { state } = useUserProfile();
  const [activeTab, setActiveTab] = useState("my-skills");
  const [skills, setSkills] = useState<string[]>([]);
  const [qualifications, setQualifications] = useState<string[]>([]);
  const [workExperience, setWorkExperience] = useState<string[]>([]);
  const [jobPreferences, setJobPreferences] = useState({
    fields: [] as string[],
    jobTypes: [] as string[],
    locations: [] as string[],
  });
  const [newSkill, setNewSkill] = useState("");
  const [newQualification, setNewQualification] = useState("");
  const [newExperience, setNewExperience] = useState("");
  
  // Calculate progress
  const calculateProgress = () => {
    let completed = 0;
    if (qualifications.length > 0) completed++;
    if (workExperience.length > 0) completed++;
    if (jobPreferences.fields.length > 0 || jobPreferences.jobTypes.length > 0) completed++;
    if (skills.length > 0) completed++;
    return Math.round((completed / 4) * 100);
  };

  // Load existing skills
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const userId = state.name || "anonymous";
        const response = await fetch(`/api/skills/get?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setSkills(data.skills || []);
        }
      } catch (error) {
        console.error("Failed to load skills:", error);
      }
    };
    loadSkills();
  }, [state.name]);

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleAddQualification = () => {
    if (newQualification.trim()) {
      setQualifications([...qualifications, newQualification.trim()]);
      setNewQualification("");
    }
  };

  const handleAddExperience = () => {
    if (newExperience.trim()) {
      setWorkExperience([...workExperience, newExperience.trim()]);
      setNewExperience("");
    }
  };

  const handleAnalyzeSkills = async () => {
    try {
      const userId = state.name || "anonymous";
      const response = await fetch("/api/skills/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          qualifications,
          workExperience,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSkills(data.skills || []);
        
        // Show friendly summary
        const skillNames = (data.skills || []).slice(0, 3).map((s: any) => typeof s === "string" ? s : s.skill || s.name || "skills").join(", ");
        const summary = skillNames 
          ? `Great! We found you are strong in ${skillNames}. Jobs like Retail Assistant, Customer Service, or Warehouse Worker might fit your skills.`
          : "Skills analyzed! Check your profile and job matches.";
        alert(summary);
      }
    } catch (error) {
      console.error("Failed to analyze skills:", error);
      alert("Failed to analyze skills. Please try again.");
    }
  };

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 24px",
          background: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <section
          style={{
            marginBottom: 32,
            padding: "32px 36px",
            borderRadius: 28,
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            color: "#ffffff",
            boxShadow: "0 20px 40px rgba(99,102,241,0.3)",
          }}
        >
          <h1 style={{ margin: "0 0 12px 0", fontSize: "2.5rem", fontWeight: 800 }}>
            My Skills Profile
          </h1>
          <p style={{ margin: 0, fontSize: "1.1rem", opacity: 0.95, lineHeight: 1.6 }}>
            Tell us about your education and work experience. We'll help you find jobs that match your skills.
          </p>
          
          {/* Progress Bar */}
          <div style={{ marginTop: 20, padding: "16px 20px", background: "rgba(255,255,255,0.2)", borderRadius: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Your Progress</span>
              <span style={{ fontSize: 16, fontWeight: 700 }}>{calculateProgress()}% Complete</span>
            </div>
            <div style={{ width: "100%", height: 8, background: "rgba(255,255,255,0.3)", borderRadius: 999, overflow: "hidden" }}>
              <div
                style={{
                  width: `${calculateProgress()}%`,
                  height: "100%",
                  background: "#fff",
                  borderRadius: 999,
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <div style={{ marginTop: 8, fontSize: 12, opacity: 0.9 }}>
              {calculateProgress() < 100 ? "Complete all 4 steps to find your perfect job match!" : "Great! You're ready to find jobs."}
            </div>
          </div>
        </section>

        {/* Step 1: Add Qualifications */}
        <section
          style={{
            marginBottom: 24,
            padding: "28px 32px",
            borderRadius: 24,
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              1
            </div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
              Add Your Qualifications
            </h2>
          </div>
          <p style={{ margin: "0 0 20px 0", fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
            Add your degrees, certificates, and professional qualifications. This helps us understand your skills.
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <input
              type="text"
              value={newQualification}
              onChange={(e) => setNewQualification(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddQualification()}
              placeholder="Example: High School Diploma, Bachelor's Degree, Driver's License"
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid #cbd5f5",
                fontSize: 14,
              }}
            />
            <button
              type="button"
              onClick={handleAddQualification}
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Add
            </button>
          </div>
          <div style={{ marginBottom: 16, fontSize: 12, color: "#64748b", fontStyle: "italic" }}>
            💡 Tip: Add any certificates or diplomas you have, even from your home country
          </div>

          {qualifications.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {qualifications.map((qual, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    color: "#1e40af",
                    fontSize: 13,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {qual}
                  <button
                    type="button"
                    onClick={() => setQualifications(qualifications.filter((_, i) => i !== idx))}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#1e40af",
                      cursor: "pointer",
                      fontSize: 16,
                      padding: 0,
                      width: 20,
                      height: 20,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Step 2: Add Work Experience */}
        <section
          style={{
            marginBottom: 24,
            padding: "28px 32px",
            borderRadius: 24,
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              2
            </div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
              Add Work Experience
            </h2>
          </div>
          <p style={{ margin: "0 0 20px 0", fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
            Describe your previous work experience. Include job titles, companies, and key responsibilities.
          </p>

          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <input
              type="text"
              value={newExperience}
              onChange={(e) => setNewExperience(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddExperience()}
              placeholder="Example: Waiter at Restaurant (2020-2022), or Part-time Babysitting (2021-2023)"
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid #cbd5f5",
                fontSize: 14,
              }}
            />
            <button
              type="button"
              onClick={handleAddExperience}
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Add
            </button>
          </div>
          <div style={{ marginBottom: 16, fontSize: 12, color: "#64748b", fontStyle: "italic" }}>
            💡 Tip: Include any work you did, even part-time or volunteer work
          </div>

          {workExperience.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {workExperience.map((exp, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    background: "#e0f2fe",
                    border: "1px solid #bae6fd",
                    color: "#0369a1",
                    fontSize: 13,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {exp}
                  <button
                    type="button"
                    onClick={() => setWorkExperience(workExperience.filter((_, i) => i !== idx))}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#0369a1",
                      cursor: "pointer",
                      fontSize: 16,
                      padding: 0,
                      width: 20,
                      height: 20,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Step 3: Job Preferences */}
        <section
          style={{
            marginBottom: 24,
            padding: "28px 32px",
            borderRadius: 24,
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg, #22c55e, #0ea5e9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              3
            </div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
              Job Preferences
            </h2>
          </div>
          <p style={{ margin: "0 0 20px 0", fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
            Tell us what kind of jobs you're looking for. This helps us show you the most relevant opportunities.
          </p>

          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                Fields of Interest
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Tech", "Healthcare", "Food Service", "Education", "Creative", "Business"].map((field) => (
                  <button
                    key={field}
                    type="button"
                    onClick={() => {
                      if (jobPreferences.fields.includes(field)) {
                        setJobPreferences({
                          ...jobPreferences,
                          fields: jobPreferences.fields.filter((f) => f !== field),
                        });
                      } else {
                        setJobPreferences({
                          ...jobPreferences,
                          fields: [...jobPreferences.fields, field],
                        });
                      }
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 999,
                      border: jobPreferences.fields.includes(field) ? "2px solid #6366f1" : "1px solid #cbd5f5",
                      background: jobPreferences.fields.includes(field) ? "#eff6ff" : "#fff",
                      color: jobPreferences.fields.includes(field) ? "#1e40af" : "#475569",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                Job Types
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Full-time", "Part-time", "Internship", "Training"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      if (jobPreferences.jobTypes.includes(type)) {
                        setJobPreferences({
                          ...jobPreferences,
                          jobTypes: jobPreferences.jobTypes.filter((t) => t !== type),
                        });
                      } else {
                        setJobPreferences({
                          ...jobPreferences,
                          jobTypes: [...jobPreferences.jobTypes, type],
                        });
                      }
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 999,
                      border: jobPreferences.jobTypes.includes(type) ? "2px solid #6366f1" : "1px solid #cbd5f5",
                      background: jobPreferences.jobTypes.includes(type) ? "#eff6ff" : "#fff",
                      color: jobPreferences.jobTypes.includes(type) ? "#1e40af" : "#475569",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Step 4: Analyze Skills */}
        <section
          style={{
            marginBottom: 24,
            padding: "28px 32px",
            borderRadius: 24,
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
            border: "2px solid #86efac",
            boxShadow: "0 12px 24px rgba(34,197,94,0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              4
            </div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
              Analyze Your Skills
            </h2>
          </div>
          <p style={{ margin: "0 0 20px 0", fontSize: 14, color: "#166534", lineHeight: 1.6 }}>
            <strong>How it works:</strong> We look at your education and work experience to find your skills. Then we show you jobs that match your skills.
          </p>
          <p style={{ margin: "0 0 20px 0", fontSize: 13, color: "#166534", lineHeight: 1.6 }}>
            <strong>Your choice:</strong> You always decide which jobs to apply for. We only help you find opportunities.
          </p>

          <button
            type="button"
            onClick={handleAnalyzeSkills}
            disabled={qualifications.length === 0 && workExperience.length === 0}
            style={{
              padding: "14px 28px",
              borderRadius: 12,
              border: "none",
              background:
                qualifications.length === 0 && workExperience.length === 0
                  ? "#cbd5f5"
                  : "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor:
                qualifications.length === 0 && workExperience.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            {qualifications.length === 0 && workExperience.length === 0
              ? "Add qualifications or experience first"
              : "Analyze My Skills with AI"}
          </button>
        </section>

        {/* Skills Discovery Panel */}
        {(qualifications.length > 0 || workExperience.length > 0) && (
          <div style={{ marginBottom: 24 }}>
            <SkillsDiscoveryPanel />
          </div>
        )}

        {/* Next Steps */}
        {skills.length > 0 && (
          <section
            style={{
              padding: "28px 32px",
              borderRadius: 24,
              background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
              border: "2px solid #93c5fd",
              boxShadow: "0 12px 24px rgba(59,130,246,0.2)",
            }}
          >
            <h2 style={{ margin: "0 0 16px 0", fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
              ✅ Skills Profile Complete!
            </h2>
            <p style={{ margin: "0 0 20px 0", fontSize: 14, color: "#1e40af", lineHeight: 1.6 }}>
              Your skills have been analyzed and mapped. Now you can discover matching job opportunities!
            </p>
            <a
              href="/work-opportunities"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#fff",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              View Matching Jobs →
            </a>
          </section>
        )}
      </main>
    </div>
  );
}

