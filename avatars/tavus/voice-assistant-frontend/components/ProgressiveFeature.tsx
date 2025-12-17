"use client";

import { ReactNode } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

type ProgressiveFeatureProps = {
  children: ReactNode;
  requiredMilestone: {
    type: "xp" | "level" | "completedTasks" | "userStage";
    value: number | string;
  };
  lockedMessage?: string;
  lockedIcon?: string;
};

export default function ProgressiveFeature({
  children,
  requiredMilestone,
  lockedMessage,
  lockedIcon = "🔒",
}: ProgressiveFeatureProps) {
  const { state } = useUserProfile();

  const isUnlocked = (() => {
    switch (requiredMilestone.type) {
      case "xp":
        return state.xp >= (requiredMilestone.value as number);
      case "level":
        return state.level === requiredMilestone.value;
      case "completedTasks":
        const completedCount = state.pathway.nodes.filter((n) => n.status === "done").length;
        return completedCount >= (requiredMilestone.value as number);
      case "userStage":
        return state.userStage === requiredMilestone.value;
      default:
        return false;
    }
  })();

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        padding: "32px",
        borderRadius: 16,
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        border: "2px dashed #cbd5e1",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>{lockedIcon}</div>
      <h3 style={{ margin: "0 0 8px 0", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
        Feature Locked
      </h3>
      <p style={{ margin: "0 0 16px 0", fontSize: 15, color: "#64748b", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
        {lockedMessage ||
          `Complete more tasks to unlock this feature. You need ${requiredMilestone.type === "xp" ? `${requiredMilestone.value} XP` : requiredMilestone.type === "level" ? `level ${requiredMilestone.value}` : requiredMilestone.type === "completedTasks" ? `${requiredMilestone.value} completed tasks` : `to be ${requiredMilestone.value}`}.`}
      </p>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 12, background: "#ffffff", border: "1px solid #e2e8f0", fontSize: 14, color: "#64748b" }}>
        <span>Current:</span>
        {requiredMilestone.type === "xp" && <strong style={{ color: "#667eea" }}>{state.xp} XP</strong>}
        {requiredMilestone.type === "level" && <strong style={{ color: "#667eea" }}>{state.level}</strong>}
        {requiredMilestone.type === "completedTasks" && (
          <strong style={{ color: "#667eea" }}>
            {state.pathway.nodes.filter((n) => n.status === "done").length} completed
          </strong>
        )}
        {requiredMilestone.type === "userStage" && (
          <strong style={{ color: "#667eea" }}>{state.userStage || "Not set"}</strong>
        )}
      </div>
    </div>
  );
}

