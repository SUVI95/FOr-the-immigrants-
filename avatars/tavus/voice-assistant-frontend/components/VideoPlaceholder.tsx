"use client";

import { useState } from "react";

type VideoPlaceholderProps = {
  title: string;
  description: string;
  duration?: string;
  thumbnail?: string;
};

export default function VideoPlaceholder({ title, description, duration = "5:00", thumbnail }: VideoPlaceholderProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        borderRadius: 16,
        overflow: "hidden",
        background: "#f8fafc",
        border: "2px solid #e2e8f0",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: isHovered ? "0 8px 24px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        // In production, this would open the actual video
        alert(`Video: ${title}\n\nThis is a placeholder. In production, this would play the video guide.`);
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          background: thumbnail
            ? `url(${thumbnail}) center/cover`
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Play Button */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            color: "#667eea",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            transform: isHovered ? "scale(1.1)" : "scale(1)",
            transition: "transform 0.2s ease",
          }}
        >
          ▶
        </div>
        {/* Duration Badge */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            padding: "4px 8px",
            borderRadius: 6,
            background: "rgba(0,0,0,0.7)",
            color: "#ffffff",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {duration}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "16px" }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
          {title}
        </h3>
        <p style={{ margin: 0, fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>
          {description}
        </p>
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#94a3b8" }}>
          <span>📹</span>
          <span>Video Guide</span>
        </div>
      </div>
    </div>
  );
}

