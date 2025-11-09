"use client";

const UPDATES = [
  {
    id: "update-1",
    text: "12 new members joined the Women’s Network this week",
  },
  {
    id: "update-2",
    text: "3 peer circles started mentorship sessions",
  },
  {
    id: "update-3",
    text: "Finnish Practice Café added a Saturday meet-up",
  },
];

export function CommunityPulse() {
  return (
    <section
      aria-labelledby="community-pulse"
      style={{
        borderRadius: 20,
        padding: 22,
        background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(148,163,184,0.08))",
        border: "1px solid rgba(59,130,246,0.2)",
        display: "grid",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", color: "#1d4ed8", fontWeight: 700 }}>
            In the community
          </p>
          <h2 id="community-pulse" style={{ margin: "6px 0 0 0", fontSize: 20, fontWeight: 800, color: "#0f172a" }}>
            See what’s happening around you.
          </h2>
        </div>
        <a
          href="/groups"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#1d4ed8",
            textDecoration: "none",
          }}
        >
          View all updates →
        </a>
      </div>

      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
        {UPDATES.map((update) => (
          <li
            key={update.id}
            style={{
              borderRadius: 14,
              padding: "12px 14px",
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(148,163,184,0.22)",
              color: "#1f2937",
              fontSize: 13.5,
              fontWeight: 600,
            }}
          >
            {update.text}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default CommunityPulse;
