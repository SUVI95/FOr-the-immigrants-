"use client";

import { useState } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

interface SupportModule {
  id: string;
  title: string;
  description: string;
  category: "culture" | "rights" | "communication" | "career";
  duration: string;
  xpReward: number;
  completed: boolean;
}

export function RetentionSupport() {
  const { state, recordAction } = useUserProfile();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const supportModules: SupportModule[] = [
    {
      id: "module-1",
      title: "Finnish Work Culture Basics",
      description: "Learn about work culture, communication styles, and expectations in Finnish workplaces. Understand hierarchy, decision-making, and team dynamics.",
      category: "culture",
      duration: "15 min",
      xpReward: 30,
      completed: false,
    },
    {
      id: "module-2",
      title: "Your Rights at Work",
      description: "Understand your employment rights, contracts, working hours, holidays, and what to do if you face discrimination or unfair treatment.",
      category: "rights",
      duration: "20 min",
      xpReward: 35,
      completed: false,
    },
    {
      id: "module-3",
      title: "Effective Communication Strategies",
      description: "Learn how to communicate effectively with Finnish colleagues and managers. Practice giving feedback, asking questions, and handling conflicts.",
      category: "communication",
      duration: "25 min",
      xpReward: 40,
      completed: false,
    },
    {
      id: "module-4",
      title: "Career Planning in Finland",
      description: "Plan your career growth in Finland. Learn about professional development opportunities, training, and advancement paths.",
      category: "career",
      duration: "30 min",
      xpReward: 45,
      completed: false,
    },
    {
      id: "module-5",
      title: "Conflict Resolution",
      description: "Learn strategies for resolving workplace conflicts professionally. Understand Finnish approaches to problem-solving and mediation.",
      category: "communication",
      duration: "20 min",
      xpReward: 35,
      completed: false,
    },
    {
      id: "module-6",
      title: "Work-Life Balance",
      description: "Understand Finnish work-life balance culture, flexible working arrangements, and how to maintain boundaries.",
      category: "culture",
      duration: "15 min",
      xpReward: 30,
      completed: false,
    },
  ];

  const categories = ["All", "culture", "rights", "communication", "career"];

  const filteredModules =
    selectedCategory === "All"
      ? supportModules
      : supportModules.filter((m) => m.category === selectedCategory);

  const handleCompleteModule = (module: SupportModule) => {
    recordAction({
      id: `retention-module-${module.id}-${Date.now()}`,
      label: `Completed: ${module.title}`,
      category: "retention",
      xp: module.xpReward,
      impactPoints: Math.round(module.xpReward * 0.7),
    });
    alert(`Module completed! You earned ${module.xpReward} XP.`);
  };

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 20,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
        marginBottom: 24,
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
          On-the-Job Support & Retention
        </h2>
        <p style={{ margin: "6px 0 0 0", fontSize: 14, color: "#475569" }}>
          Access support modules to help you succeed in your job and stay in Finland long-term. Research shows that retention support reduces the 17% exit rate.
        </p>
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
          Filter by Category:
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                border: selectedCategory === cat ? "2px solid #6366f1" : "1px solid #cbd5f5",
                background: selectedCategory === cat ? "#eff6ff" : "#fff",
                color: selectedCategory === cat ? "#1e40af" : "#475569",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 13,
                textTransform: "capitalize",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Modules List */}
      <div style={{ display: "grid", gap: 16 }}>
        {filteredModules.map((module) => (
          <article
            key={module.id}
            style={{
              padding: 20,
              borderRadius: 16,
              background: module.completed ? "#f0fdf4" : "#f8fafc",
              border: `2px solid ${module.completed ? "#86efac" : "#e2e8f0"}`,
              display: "grid",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{module.title}</h3>
                  {module.completed && (
                    <span style={{ fontSize: 16, color: "#22c55e" }}>✓</span>
                  )}
                </div>
                <p style={{ margin: "0 0 12px 0", fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
                  {module.description}
                </p>
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#64748b" }}>
                  <span>📚 {module.category}</span>
                  <span>⏱️ {module.duration}</span>
                  <span>⭐ +{module.xpReward} XP</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCompleteModule(module)}
              disabled={module.completed}
              style={{
                padding: "10px 20px",
                borderRadius: 12,
                border: "none",
                background: module.completed
                  ? "#cbd5f5"
                  : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontWeight: 700,
                cursor: module.completed ? "not-allowed" : "pointer",
                fontSize: 14,
              }}
            >
              {module.completed ? "Completed" : "Start Module"}
            </button>
          </article>
        ))}
      </div>

      {/* Info Box */}
      <div
        style={{
          marginTop: 20,
          padding: 16,
          background: "#fef3c7",
          borderRadius: 12,
          border: "1px solid #fcd34d",
          fontSize: 12,
          color: "#92400e",
        }}
      >
        <strong>Research Impact:</strong> Studies show that ~17% of immigrants leave Finland within 10 years. 
        On-the-job support and retention tracking help reduce this rate by addressing integration challenges early.
      </div>
    </div>
  );
}

