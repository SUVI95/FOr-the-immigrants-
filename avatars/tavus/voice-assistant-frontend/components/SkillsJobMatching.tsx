"use client";

import { useState, useEffect, useMemo } from "react";
import { useUserProfile } from "@/context/UserProfileContext";
import { JobCardWithLanguageCoach } from "./JobCardWithLanguageCoach";

interface MatchResult {
  jobId: string;
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
  match: {
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    missingLanguageLevel?: boolean;
    breakdown: {
      skillsMatch: number;
      languageMatch: number;
      qualificationMatch: number;
      explanation: string;
    };
  };
}

interface AISuggestion {
  jobId: string;
  suggestion?: string;
  type: string;
  disclaimer?: string;
}

export function SkillsJobMatching() {
  const { state, recordAction } = useUserProfile();
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, AISuggestion>>({});
  const [loading, setLoading] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  useEffect(() => {
    loadMatches();
  }, [state.name]);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const userId = state.name || "anonymous";
      
      // Load rule-based matches (non-AI)
      const matchResponse = await fetch("/api/jobs/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (matchResponse.ok) {
        const matchData = await matchResponse.json();
        setMatches(matchData.matches || []);
        
        // Optionally load AI suggestions (separate, LOW-RISK)
        if (matchData.matches && matchData.matches.length > 0) {
          loadAISuggestions(userId, matchData.matches.slice(0, 10).map((m: MatchResult) => m.jobId));
        }
      }
    } catch (error) {
      console.error("Failed to load matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAISuggestions = async (userId: string, jobIds: string[]) => {
    try {
      // Get user skills for AI suggestions
      const skillsResponse = await fetch(`/api/skills/get?userId=${userId}`);
      const skillsData = skillsResponse.ok ? await skillsResponse.json() : { skills: [] };

      const suggestionsResponse = await fetch("/api/jobs/ai-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          jobIds,
          userSkills: skillsData.skills || [],
          userLanguageLevel: state.languageLevel || "A0",
        }),
      });

      if (suggestionsResponse.ok) {
        const suggestionsData = await suggestionsResponse.json();
        const suggestionsMap: Record<string, AISuggestion> = {};
        (suggestionsData.suggestions || []).forEach((s: AISuggestion) => {
          suggestionsMap[s.jobId] = s;
        });
        setAiSuggestions(suggestionsMap);
      }
    } catch (error) {
      console.error("Failed to load AI suggestions:", error);
    }
  };

  const topMatches = useMemo(() => matches.slice(0, 10), [matches]);

  if (loading && matches.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
        Loading job matches...
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div
        style={{
          padding: 24,
          borderRadius: 20,
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, color: "#64748b" }}>
          No job matches found. Complete your skills analysis first to see matching opportunities.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* Header with AI toggle */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
            Jobs Matching Your Skills
          </h2>
          <p style={{ margin: "6px 0 0 0", fontSize: 14, color: "#475569" }}>
            <strong>How matching works:</strong> Jobs are matched using a <strong>rule-based algorithm (non-AI)</strong> that compares your skills to job requirements. 
            AI suggestions are optional and for informational purposes only. {matches.length} opportunities found.
          </p>
          <div
            style={{
              marginTop: 12,
              padding: 12,
              background: "#f0fdf4",
              borderRadius: 8,
              border: "1px solid #86efac",
              fontSize: 12,
              color: "#166534",
            }}
          >
            <strong>🔍 Matching Process:</strong> Skills Match (60%) + Language Level (30%) + Qualifications (10%) = Overall Score
          </div>
        </div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            fontSize: 14,
            color: "#475569",
          }}
        >
          <input
            type="checkbox"
            checked={showAiSuggestions}
            onChange={(e) => setShowAiSuggestions(e.target.checked)}
            style={{ cursor: "pointer" }}
          />
          Show AI suggestions (optional)
        </label>
      </div>

      {/* Matches list */}
      <div style={{ display: "grid", gap: 16 }}>
        {topMatches.map((matchResult) => {
          const aiSuggestion = aiSuggestions[matchResult.jobId];
          const match = matchResult.match;
          const job = matchResult.job;

          return (
            <div key={matchResult.jobId}>
              <JobCardWithLanguageCoach
                job={job}
                matchScore={match.matchScore}
                onApply={() => {
                  window.open(job.link, "_blank");
                  recordAction({
                    id: `job-apply-${job.id}-${Date.now()}`,
                    label: `Applied for ${job.title}`,
                    category: "jobs",
                    xp: job.xpReward,
                    impactPoints: Math.round(job.xpReward * 0.75),
                  });
                }}
              />
              
              {/* Match breakdown and AI suggestion below the card */}
              <div
                style={{
                  marginTop: 12,
                  padding: 16,
                  background: "#f8fafc",
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                }}
              >
                <p style={{ margin: "0 0 12px 0", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                  Match Breakdown:
                </p>
                <div style={{ display: "grid", gap: 8, fontSize: 12, color: "#475569" }}>
                  <div>
                    Skills: {match.breakdown.skillsMatch}% · Language: {match.breakdown.languageMatch}% · Qualifications: {match.breakdown.qualificationMatch}%
                  </div>
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #e2e8f0" }}>
                    {match.breakdown.explanation}
                  </div>
                </div>

                {/* Matched skills */}
                {match.matchedSkills.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <p style={{ margin: "0 0 6px 0", fontSize: 12, fontWeight: 600, color: "#0f172a" }}>
                      Your Matching Skills:
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {match.matchedSkills.slice(0, 5).map((skill, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: "#dcfce7",
                            border: "1px solid #86efac",
                            color: "#166534",
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing skills */}
                {match.missingSkills.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <p style={{ margin: "0 0 6px 0", fontSize: 12, fontWeight: 600, color: "#0f172a" }}>
                      Skills to Develop:
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {match.missingSkills.slice(0, 5).map((skill, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: "#fef3c7",
                            border: "1px solid #fcd34d",
                            color: "#92400e",
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Language note */}
                {match.missingLanguageLevel && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: 8,
                      background: "#fef3c7",
                      borderRadius: 8,
                      fontSize: 11,
                      color: "#92400e",
                    }}
                  >
                    ⚠️ Language requirement: This job requires a higher Finnish level than your current level.
                  </div>
                )}
              </div>

              {/* AI Suggestion (optional, LOW-RISK) */}
              {showAiSuggestions && aiSuggestion && (
                <div
                  style={{
                    marginTop: 12,
                    padding: 16,
                    background: "linear-gradient(135deg, #e0f2fe 0%, #eef2ff 100%)",
                    borderRadius: 12,
                    border: "1px solid #bfdbfe",
                  }}
                >
                  <p style={{ margin: "0 0 8px 0", fontSize: 12, fontWeight: 700, color: "#1e40af" }}>
                    AI Suggestion (Informational Only):
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: "#1e293b", lineHeight: 1.6 }}>
                    {aiSuggestion.suggestion || "AI suggestion available"}
                  </p>
                  {aiSuggestion.disclaimer && (
                    <p style={{ margin: "8px 0 0 0", fontSize: 11, color: "#64748b", fontStyle: "italic" }}>
                      {aiSuggestion.disclaimer}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* EU AI Act Compliance Notice */}
      <div
        style={{
          padding: 16,
          background: "#f8fafc",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          fontSize: 12,
          color: "#64748b",
        }}
      >
        <p style={{ margin: 0, fontWeight: 600, marginBottom: 4 }}>
          EU AI Act Compliance:
        </p>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          Job matching uses a <strong>non-AI rule-based algorithm</strong> (No Risk classification).
          AI suggestions are optional and for informational purposes only (Limited Risk, Article 50).
          You always decide which jobs to apply for. No AI is used in hiring decisions.
        </p>
      </div>
    </div>
  );
}

