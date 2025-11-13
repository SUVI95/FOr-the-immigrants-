"use client";

import { useState, useEffect } from "react";
import { useUserProfile } from "@/context/UserProfileContext";
import { PilotDisclosure } from "./PilotDisclosure";

interface Mentor {
  id: string;
  name: string;
  industry: string;
  experience: string;
  languages: string[];
  matchScore?: number;
}

export function ProfessionalNetworkPanel() {
  const { state } = useUserProfile();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    setLoading(true);
    try {
      // Simulate mentor matching (in production, use real API)
      const mockMentors: Mentor[] = [
        {
          id: "mentor-1",
          name: "Maria K.",
          industry: "Tech",
          experience: "10+ years in software development",
          languages: ["Finnish", "English"],
          matchScore: 85,
        },
        {
          id: "mentor-2",
          name: "Jukka L.",
          industry: "Healthcare",
          experience: "Nurse, helps newcomers in care sector",
          languages: ["Finnish", "English", "Arabic"],
          matchScore: 78,
        },
        {
          id: "mentor-3",
          name: "Anna M.",
          industry: "Business",
          experience: "Entrepreneur, business coach",
          languages: ["Finnish", "English", "Russian"],
          matchScore: 72,
        },
      ];
      setMentors(mockMentors);
    } catch (error) {
      console.error("Failed to load mentors:", error);
    } finally {
      setLoading(false);
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
      <PilotDisclosure
        pilotName="Professional Network Builder"
        duration="6 months (Jan 2025 - Jun 2025)"
        purpose="Test AI-assisted mentor matching and professional network building to measure impact on job search success"
        riskLevel="Limited Risk AI (Recommendations only)"
      />

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 12px 0", fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" }}>
          Mentor Matching (Pilot)
        </h3>
        <p style={{ margin: "0 0 16px 0", fontSize: "0.875rem", color: "#475569", lineHeight: 1.7 }}>
          Connect with mentors in your industry. AI suggests matches based on your skills and goals.
          You decide which mentors to connect with.
        </p>
      </div>

      {loading ? (
        <p style={{ color: "#64748b", fontSize: "0.875rem" }}>Loading mentors...</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              style={{
                padding: 20,
                borderRadius: 16,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "1rem", fontWeight: 600, color: "#0f172a" }}>
                    {mentor.name}
                  </h4>
                  <p style={{ margin: "0 0 4px 0", fontSize: "0.875rem", color: "#475569" }}>
                    {mentor.industry} · {mentor.experience}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>
                    Languages: {mentor.languages.join(", ")}
                  </p>
                </div>
                {mentor.matchScore && (
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: "#dcfce7",
                      border: "1px solid #86efac",
                      color: "#166534",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {mentor.matchScore}% Match
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => {
                    alert(`Connecting you with ${mentor.name}. This is a pilot feature - your connection will be tracked for research.`);
                  }}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    flex: 1,
                  }}
                >
                  Connect
                </button>
                <button
                  onClick={() => {
                    alert(`Viewing ${mentor.name}'s profile. This is a pilot feature.`);
                  }}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: "1px solid #cbd5f5",
                    background: "#ffffff",
                    color: "#1e293b",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                  }}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 24, padding: 16, background: "#fef3c7", borderRadius: 12, border: "1px solid #fcd34d" }}>
        <p style={{ margin: 0, fontSize: "0.75rem", color: "#92400e", lineHeight: 1.6 }}>
          <strong>Pilot Note:</strong> Mentor matching is being tested to measure impact on job search success.
          Your connections and outcomes will be anonymized for research.
        </p>
      </div>
    </div>
  );
}

