"use client";

import { useState } from "react";
import { WorkplaceLanguageCoach } from "./WorkplaceLanguageCoach";

interface JobCardWithLanguageCoachProps {
  job: {
    id: string;
    title: string;
    company: string;
    field: string;
    city: string;
    language: string;
    type: string;
    description: string;
    requirements: string[];
    xpReward: number;
    deadline: string;
    link: string;
    tags: string[];
  };
  matchScore?: number;
  onApply: () => void;
}

export function JobCardWithLanguageCoach({ job, matchScore, onApply }: JobCardWithLanguageCoachProps) {
  const [showLanguageCoach, setShowLanguageCoach] = useState(false);

  return (
    <article
      style={{
        padding: 24,
        borderRadius: 20,
        background: "#ffffff",
        border: `2px solid ${matchScore && matchScore >= 80 ? "#86efac" : matchScore && matchScore >= 60 ? "#fcd34d" : "#e2e8f0"}`,
        boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
        display: "grid",
        gap: 16,
      }}
    >
      {/* Job Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{job.title}</h3>
          <p style={{ margin: "6px 0 0 0", fontSize: 14, color: "#475569" }}>
            {job.company} · {job.city}
          </p>
          {matchScore !== undefined && (
            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: matchScore >= 80 ? "#dcfce7" : matchScore >= 60 ? "#fef3c7" : "#fee2e2",
                  border: `1px solid ${matchScore >= 80 ? "#86efac" : matchScore >= 60 ? "#fcd34d" : "#fca5a5"}`,
                  color: matchScore >= 80 ? "#166534" : matchScore >= 60 ? "#92400e" : "#991b1b",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {matchScore}% Match
              </span>
            </div>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <span
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              background: "#e0f2fe",
              border: "1px solid #bae6fd",
              color: "#0369a1",
              fontSize: 12.5,
              fontWeight: 700,
            }}
          >
            {job.type}
          </span>
        </div>
      </div>

      {/* Job Description */}
      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: "#1e293b" }}>{job.description}</p>

      {/* Workplace Language Coach - Integrated */}
      <div
        style={{
          padding: 16,
          background: "linear-gradient(135deg, #e0f2fe 0%, #eef2ff 100%)",
          borderRadius: 12,
          border: "1px solid #bfdbfe",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1e40af" }}>
              🗣️ Workplace Language Coach
            </h4>
            <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#475569" }}>
              Learn Finnish phrases for this job while you work
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowLanguageCoach(!showLanguageCoach)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #3b82f6",
              background: showLanguageCoach ? "#3b82f6" : "#eff6ff",
              color: showLanguageCoach ? "#fff" : "#2563eb",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            {showLanguageCoach ? "Hide" : "Open Coach"}
          </button>
        </div>

        {showLanguageCoach && (
          <div style={{ marginTop: 12, padding: 12, background: "#fff", borderRadius: 8 }}>
            <WorkplaceLanguageCoach />
          </div>
        )}

        <div style={{ marginTop: 12, padding: 8, background: "#fef3c7", borderRadius: 6, fontSize: 11, color: "#92400e" }}>
          <strong>💡 Tip:</strong> Research shows learning language while working is more effective than classroom-only training.
        </div>
      </div>

      {/* Requirements */}
      <div>
        <strong style={{ fontSize: 13, color: "#334155" }}>Requirements:</strong>
        <ul style={{ margin: "8px 0 0 0", paddingLeft: 18, color: "#475569", fontSize: 13.5, lineHeight: 1.6 }}>
          {job.requirements.map((req, idx) => (
            <li key={idx}>{req}</li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={onApply}
          style={{
            padding: "12px 24px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            flex: "1 1 200px",
          }}
        >
          Apply Now
        </button>
        <button
          type="button"
          onClick={() => setShowLanguageCoach(!showLanguageCoach)}
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            border: "1px solid #3b82f6",
            background: "#eff6ff",
            color: "#2563eb",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {showLanguageCoach ? "Hide" : "Practice"} Language
        </button>
      </div>
    </article>
  );
}

