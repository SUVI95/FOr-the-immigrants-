"use client";

import { useState } from "react";
import { Room } from "livekit-client";
import { RoomContext } from "@livekit/components-react";
import Sidebar from "@/components/Sidebar";
import { useTranslation } from "@/components/i18n/TranslationProvider";
import { useUserProfile } from "@/context/UserProfileContext";

export default function OrganizerResourcesPage() {
  const { t } = useTranslation();
  const { recordAction } = useUserProfile();
  const [activeTab, setActiveTab] = useState("explore");
  const [room] = useState(new Room());
  const [formData, setFormData] = useState({
    organization: "",
    contact: "",
    activity: "",
    description: "",
    logoUrl: "",
  });
  const [submissions, setSubmissions] = useState<
    Array<{ id: string; organization: string; activity: string; status: "Pending" | "Approved" | "Needs update"; contact: string }>
  >([
    {
      id: "sub-1",
      organization: "Kajaani Welcome Committee",
      activity: "Newcomer meetup series",
      status: "Approved",
      contact: "anna@kajaani.fi",
    },
  ]);

  const handleLearnFinnishClick = () => {
    window.location.href = "/learn-finnish";
  };

  const downloads = [
    { name: "Host Starter Guide (PDF)", href: "#" },
    { name: "Meeting Agenda Templates (DOCX)", href: "#" },
    { name: "A1 Conversation Sheets (PDF)", href: "#" },
    { name: "Photo Consent Form (PDF)", href: "#" },
    { name: "Safeguarding & Code of Conduct (PDF)", href: "#" },
    { name: "Event Poster Template (Canva)", href: "#" },
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = `submission-${Date.now()}`;
    setSubmissions((prev) => [
      {
        id,
        organization: formData.organization,
        activity: formData.activity,
        status: "Pending",
        contact: formData.contact,
      },
      ...prev,
    ]);
    recordAction({
      id,
      label: `Submitted organizer activity: ${formData.activity}`,
      category: "admin",
      xp: 22,
      impactPoints: 18,
      reminder: {
        title: `Review organizer submission (${formData.activity})`,
        dueAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        channel: "email",
      },
    });
    setFormData({
      organization: "",
      contact: "",
      activity: "",
      description: "",
      logoUrl: "",
    });
    alert("Submission received! Admin team will review and approve soon.");
  };

  const handleStatusUpdate = (id: string, status: "Approved" | "Needs update") => {
    setSubmissions((prev) =>
      prev.map((submission) => (submission.id === id ? { ...submission, status } : submission)),
    );
    recordAction({
      id: `submission-status-${id}`,
      label: `Updated submission status to ${status}`,
      category: "admin",
      xp: status === "Approved" ? 15 : 8,
      impactPoints: status === "Approved" ? 12 : 6,
    });
  };

  return (
    <RoomContext.Provider value={room}>
      <div className="app">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            if (tab === "explore") {
              window.location.href = "/";
              return;
            }
            setActiveTab(tab);
          }} 
          onLearnFinnishClick={handleLearnFinnishClick} 
        />

        <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px", background: "#fafafa", minHeight: "100vh" }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{
              fontSize: "3rem",
              fontWeight: "bold",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 10,
            }}>
              {t("organizer")}
            </h1>
            <p style={{ color: "#666", fontSize: "1.1rem", maxWidth: 700 }}>
              Run great community sessions with ready‑made templates, safety guidelines, and language support packs.
            </p>
          </div>

          <section style={{ background: "white", borderRadius: 12, boxShadow: "0 2px 4px rgba(0,0,0,0.08)", padding: 24, marginBottom: 24 }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "#111", marginBottom: 16 }}>Downloads</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 12 }}>
              {downloads.map((d) => (
                <li key={d.name}>
                  <a href={d.href} style={{ display: "block", background: "#f9fafb", padding: 14, borderRadius: 10, border: "1px solid #e5e7eb", color: "#111", textDecoration: "none", fontWeight: 600 }}>
                    📥 {d.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section style={{ background: "white", borderRadius: 12, boxShadow: "0 2px 4px rgba(0,0,0,0.08)", padding: 24 }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "#111", marginBottom: 12 }}>Tips for Great Sessions</h2>
            <ul style={{ color: "#374151", lineHeight: 1.8 }}>
              <li>Use the A1 conversation sheet for first‑timers; keep intros short and inclusive.</li>
              <li>Mark venues that are child‑friendly and public‑transport accessible.</li>
              <li>Set photo consent at the start; share gallery privately afterward.</li>
              <li>Pair newcomers with mentors; follow up with a 1‑week check‑in.</li>
            </ul>
          </section>

          <section style={{ background: "white", borderRadius: 12, boxShadow: "0 2px 4px rgba(0,0,0,0.08)", padding: 24, marginTop: 24 }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, color: "#111", marginBottom: 16 }}>Submit your NGO / municipality activity</h2>
            <p style={{ color: "#475569", marginBottom: 18 }}>
              Share upcoming programs, workshops, or services. After approval, your activity appears in Explore, Events, and the Impact Wallet.
            </p>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginBottom: 24 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#374151", fontWeight: 600 }}>Organization</span>
                <input
                  required
                  value={formData.organization}
                  onChange={(event) => setFormData((prev) => ({ ...prev, organization: event.target.value }))}
                  placeholder="Kajaani Integration Center"
                  style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 10 }}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#374151", fontWeight: 600 }}>Contact email</span>
                <input
                  required
                  type="email"
                  value={formData.contact}
                  onChange={(event) => setFormData((prev) => ({ ...prev, contact: event.target.value }))}
                  placeholder="contact@organization.fi"
                  style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 10 }}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#374151", fontWeight: 600 }}>Activity name</span>
                <input
                  required
                  value={formData.activity}
                  onChange={(event) => setFormData((prev) => ({ ...prev, activity: event.target.value }))}
                  placeholder="Integration Café – April Edition"
                  style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 10 }}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#374151", fontWeight: 600 }}>Short description</span>
                <textarea
                  required
                  value={formData.description}
                  onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                  rows={3}
                  placeholder="Describe your activity, who it's for, and how many seats are available."
                  style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 10 }}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ color: "#374151", fontWeight: 600 }}>Logo or image URL (optional)</span>
                <input
                  value={formData.logoUrl}
                  onChange={(event) => setFormData((prev) => ({ ...prev, logoUrl: event.target.value }))}
                  placeholder="https://example.com/logo.png"
                  style={{ padding: 12, border: "1px solid #e5e7eb", borderRadius: 10 }}
                />
              </label>
              <button
                type="submit"
                style={{
                  background: "linear-gradient(135deg, #4338ca, #6366f1)",
                  color: "#fff",
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: "none",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Submit for approval
              </button>
            </form>

            <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "#111", marginBottom: 12 }}>Submission status</h3>
            <div style={{ display: "grid", gap: 12 }}>
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    padding: 14,
                    background: submission.status === "Approved" ? "#ecfdf5" : "#f8fafc",
                    display: "grid",
                    gap: 6,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong>{submission.activity}</strong>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 999,
                        border: submission.status === "Approved" ? "1px solid #bbf7d0" : "1px solid #fde68a",
                        background: submission.status === "Approved" ? "#dcfce7" : "#fef3c7",
                        color: submission.status === "Approved" ? "#166534" : "#92400e",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {submission.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: "#475569" }}>{submission.organization}</div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>Contact: {submission.contact}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(submission.id, "Approved")}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 8,
                        border: "1px solid #22c55e",
                        background: "rgba(34,197,94,0.12)",
                        color: "#166534",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(submission.id, "Needs update")}
                      style={{
                        padding: "6px 10px",
                        borderRadius: 8,
                        border: "1px solid #f97316",
                        background: "rgba(249,115,22,0.1)",
                        color: "#c2410c",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Needs update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </RoomContext.Provider>
  );
}


