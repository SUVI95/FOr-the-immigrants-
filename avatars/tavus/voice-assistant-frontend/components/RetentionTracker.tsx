"use client";

import { useState, useEffect } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

interface RetentionRecord {
  id: string;
  jobId?: string;
  companyName: string;
  startDate: string;
  checkIn1Month?: { completed: boolean; date?: string; satisfactionScore?: number; notes?: string };
  checkIn3Month?: { completed: boolean; date?: string; satisfactionScore?: number; notes?: string };
  checkIn12Month?: { completed: boolean; date?: string; satisfactionScore?: number; notes?: string };
  retentionStatus: string;
  leftDate?: string;
  leftReason?: string;
}

export function RetentionTracker() {
  const { state } = useUserProfile();
  const [records, setRecords] = useState<RetentionRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecords();
  }, [state.name]);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const userId = state.name || "anonymous";
      const response = await fetch(`/api/retention?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setRecords(data.records || []);
      }
    } catch (error) {
      console.error("Failed to load retention records:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return { bg: "#dcfce7", border: "#86efac", text: "#166534" };
      case "left":
        return { bg: "#fee2e2", border: "#fca5a5", text: "#991b1b" };
      default:
        return { bg: "#f1f5f9", border: "#cbd5f5", text: "#475569" };
    }
  };

  const getCheckInStatus = (checkIn?: { completed: boolean; date?: string }) => {
    if (!checkIn) return { status: "pending", color: "#f1f5f9" };
    if (checkIn.completed) return { status: "completed", color: "#dcfce7" };
    return { status: "due", color: "#fef3c7" };
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
          Job Retention Tracking
        </h2>
        <p style={{ margin: "6px 0 0 0", fontSize: 14, color: "#475569" }}>
          Track your job retention and integration progress. Check-ins help us support you and measure program impact.
        </p>
      </div>

      {loading && records.length === 0 ? (
        <div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>Loading retention records...</div>
      ) : records.length === 0 ? (
        <div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
          No retention records yet. When you start a job, it will appear here for tracking.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {records.map((record) => {
            const statusColors = getStatusColor(record.retentionStatus);
            const checkIn1 = getCheckInStatus(record.checkIn1Month);
            const checkIn3 = getCheckInStatus(record.checkIn3Month);
            const checkIn12 = getCheckInStatus(record.checkIn12Month);

            return (
              <article
                key={record.id}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  background: "#f8fafc",
                  border: `2px solid ${statusColors.border}`,
                  display: "grid",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                      {record.companyName}
                    </h3>
                    <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#475569" }}>
                      Started: {new Date(record.startDate).toLocaleDateString()}
                    </p>
                    {record.leftDate && (
                      <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#991b1b" }}>
                        Left: {new Date(record.leftDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      background: statusColors.bg,
                      border: `1px solid ${statusColors.border}`,
                      color: statusColors.text,
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "capitalize",
                    }}
                  >
                    {record.retentionStatus}
                  </span>
                </div>

                {/* Check-in timeline */}
                <div style={{ display: "grid", gap: 12 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Check-in Timeline:</p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <div
                      style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        background: checkIn1.color,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      1 Month: {checkIn1.status === "completed" ? "✓" : checkIn1.status === "due" ? "Due" : "Pending"}
                    </div>
                    <div
                      style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        background: checkIn3.color,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      3 Months: {checkIn3.status === "completed" ? "✓" : checkIn3.status === "due" ? "Due" : "Pending"}
                    </div>
                    <div
                      style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        background: checkIn12.color,
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      12 Months: {checkIn12.status === "completed" ? "✓" : checkIn12.status === "due" ? "Due" : "Pending"}
                    </div>
                  </div>
                </div>

                {record.leftReason && (
                  <div style={{ padding: 12, background: "#fee2e2", borderRadius: 8, fontSize: 13, color: "#991b1b" }}>
                    <strong>Reason for leaving:</strong> {record.leftReason}
                  </div>
                )}

                {record.checkIn1Month?.satisfactionScore && (
                  <div style={{ fontSize: 12, color: "#475569" }}>
                    Satisfaction (1 month): {record.checkIn1Month.satisfactionScore}/10
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

