"use client";

import { useState, useEffect } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

interface ImpactMetrics {
  jobPlacements: number;
  languageProgress: number;
  skillsGained: number;
  retentionRate: number;
  averageTimeToEmployment: number;
  recognitionRequests: number;
}

export function ImpactDashboard() {
  const { state } = useUserProfile();
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"user" | "municipality">("user");

  useEffect(() => {
    loadMetrics();
  }, [state.name, viewMode]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const userId = state.name || "anonymous";
      const endpoint = viewMode === "user" 
        ? `/api/impact?userId=${userId}`
        : `/api/impact?municipality=true`;
      
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error("Failed to load impact metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !metrics) {
    return (
      <div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>Loading impact metrics...</div>
    );
  }

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
            Impact Dashboard
          </h2>
          <p style={{ margin: "6px 0 0 0", fontSize: 14, color: "#475569" }}>
            {viewMode === "user" 
              ? "Track your personal integration progress and achievements"
              : "Aggregate metrics for program effectiveness and ROI"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => setViewMode("user")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              background: viewMode === "user" ? "#2563eb" : "#f1f5f9",
              color: viewMode === "user" ? "#fff" : "#475569",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            My Progress
          </button>
          <button
            type="button"
            onClick={() => setViewMode("municipality")}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              background: viewMode === "municipality" ? "#2563eb" : "#f1f5f9",
              color: viewMode === "municipality" ? "#fff" : "#475569",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Municipality View
          </button>
        </div>
      </div>

      {metrics ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <MetricCard
            title="Job Placements"
            value={metrics.jobPlacements}
            unit={viewMode === "user" ? "jobs" : "total"}
            color="#22c55e"
            icon="💼"
          />
          <MetricCard
            title="Language Progress"
            value={metrics.languageProgress}
            unit="%"
            color="#0ea5e9"
            icon="🗣️"
          />
          <MetricCard
            title="Skills Gained"
            value={metrics.skillsGained}
            unit="skills"
            color="#6366f1"
            icon="⭐"
          />
          <MetricCard
            title="Retention Rate"
            value={metrics.retentionRate}
            unit="%"
            color="#f59e0b"
            icon="📈"
          />
          {viewMode === "municipality" && (
            <>
              <MetricCard
                title="Avg. Time to Employment"
                value={metrics.averageTimeToEmployment}
                unit="days"
                color="#8b5cf6"
                icon="⏱️"
              />
              <MetricCard
                title="Recognition Requests"
                value={metrics.recognitionRequests}
                unit="requests"
                color="#ec4899"
                icon="📜"
              />
            </>
          )}
        </div>
      ) : (
        <div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
          No metrics available yet. Complete actions to start tracking your progress.
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, unit, color, icon }: {
  title: string;
  value: number;
  unit: string;
  color: string;
  icon: string;
}) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 16,
        background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(248,250,252,0.9))",
        border: `2px solid ${color}40`,
        display: "grid",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 24 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>{title}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: color }}>
        {value.toLocaleString()}
        <span style={{ fontSize: 16, fontWeight: 600, color: "#64748b", marginLeft: 4 }}>{unit}</span>
      </div>
    </div>
  );
}

