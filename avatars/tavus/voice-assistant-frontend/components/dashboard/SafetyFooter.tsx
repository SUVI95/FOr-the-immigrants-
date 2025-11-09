"use client";

export function SafetyFooter() {
  return (
    <section
      aria-labelledby="safety-footer"
      style={{
        borderRadius: 20,
        padding: 20,
        background: "#f1f5f9",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div>
        <p style={{ margin: 0, fontSize: 11, letterSpacing: 1.2, textTransform: "uppercase", color: "#475569", fontWeight: 700 }}>
          Your safety & privacy
        </p>
        <h2 id="safety-footer" style={{ margin: "6px 0 0 0", fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
          Knuut verifies every member and follows GDPR standards.
        </h2>
        <p style={{ margin: "4px 0 0 0", fontSize: 13.5, color: "#475569" }}>
          Your data is protected and community actions are moderated 24/7.
        </p>
      </div>
      <button
        type="button"
        onClick={() => (window.location.href = "/resources#safety")}
        style={{
          alignSelf: "flex-start",
          padding: "10px 16px",
          borderRadius: 12,
          border: "1px solid #cbd5f5",
          background: "#fff",
          color: "#1d4ed8",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Open Safety Center
      </button>
    </section>
  );
}

export default SafetyFooter;
