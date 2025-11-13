"use client";

import { useState, useEffect } from "react";
import { useUserProfile } from "@/context/UserProfileContext";

interface OPHRequest {
  id: string;
  qualificationTitle: string;
  qualificationType?: string;
  issuingCountry?: string;
  issuingInstitution?: string;
  documentUrl?: string;
  translatedDocumentUrl?: string;
  status: string;
  ophReferenceNumber?: string;
  submittedAt?: string;
  decisionAt?: string;
  decisionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export function OPHRecognitionTracker() {
  const { state } = useUserProfile();
  const [requests, setRequests] = useState<OPHRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    qualificationTitle: "",
    qualificationType: "",
    issuingCountry: "",
    issuingInstitution: "",
    documentUrl: "",
  });

  useEffect(() => {
    loadRequests();
  }, [state.name]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const userId = state.name || "anonymous";
      const response = await fetch(`/api/oph-recognition?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Failed to load OPH requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userId = state.name || "anonymous";
      const response = await fetch("/api/oph-recognition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...formData,
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({
          qualificationTitle: "",
          qualificationType: "",
          issuingCountry: "",
          issuingInstitution: "",
          documentUrl: "",
        });
        loadRequests();
      } else {
        alert("Failed to submit recognition request");
      }
    } catch (error) {
      console.error("Failed to submit request:", error);
      alert("Failed to submit recognition request");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return { bg: "#dcfce7", border: "#86efac", text: "#166534" };
      case "rejected":
        return { bg: "#fee2e2", border: "#fca5a5", text: "#991b1b" };
      case "in_review":
        return { bg: "#fef3c7", border: "#fcd34d", text: "#92400e" };
      case "submitted":
        return { bg: "#dbeafe", border: "#93c5fd", text: "#1e40af" };
      default:
        return { bg: "#f1f5f9", border: "#cbd5f5", text: "#475569" };
    }
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>
            OPH Recognition Fast-Track
          </h2>
          <p style={{ margin: "6px 0 0 0", fontSize: 14, color: "#475569" }}>
            Track your foreign qualification recognition status with OPH (Finnish National Agency for Education)
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 20px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {showForm ? "Cancel" : "+ New Request"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            padding: 20,
            background: "#f8fafc",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            marginBottom: 20,
            display: "grid",
            gap: 16,
          }}
        >
          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
              Qualification Title *
            </label>
            <input
              type="text"
              required
              value={formData.qualificationTitle}
              onChange={(e) => setFormData({ ...formData, qualificationTitle: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #cbd5f5",
                fontSize: 14,
              }}
              placeholder="e.g., Bachelor of Science in Computer Science"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                Qualification Type
              </label>
              <input
                type="text"
                value={formData.qualificationType}
                onChange={(e) => setFormData({ ...formData, qualificationType: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid #cbd5f5",
                  fontSize: 14,
                }}
                placeholder="e.g., Degree, Certificate"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                Issuing Country
              </label>
              <input
                type="text"
                value={formData.issuingCountry}
                onChange={(e) => setFormData({ ...formData, issuingCountry: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid #cbd5f5",
                  fontSize: 14,
                }}
                placeholder="e.g., India, Nigeria"
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
              Issuing Institution
            </label>
            <input
              type="text"
              value={formData.issuingInstitution}
              onChange={(e) => setFormData({ ...formData, issuingInstitution: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #cbd5f5",
                fontSize: 14,
              }}
              placeholder="e.g., University of Helsinki"
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
              Document URL (upload document first, then paste URL here)
            </label>
            <input
              type="url"
              value={formData.documentUrl}
              onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #cbd5f5",
                fontSize: 14,
              }}
              placeholder="https://..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 20px",
              borderRadius: 12,
              border: "none",
              background: loading ? "#cbd5f5" : "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "#fff",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Submitting..." : "Submit Recognition Request"}
          </button>
        </form>
      )}

      {loading && requests.length === 0 ? (
        <div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>Loading recognition requests...</div>
      ) : requests.length === 0 ? (
        <div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
          No recognition requests yet. Submit a request to get started.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {requests.map((request) => {
            const statusColors = getStatusColor(request.status);
            return (
              <article
                key={request.id}
                style={{
                  padding: 20,
                  borderRadius: 16,
                  background: "#f8fafc",
                  border: `2px solid ${statusColors.border}`,
                  display: "grid",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>
                      {request.qualificationTitle}
                    </h3>
                    {request.qualificationType && (
                      <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#475569" }}>
                        Type: {request.qualificationType}
                      </p>
                    )}
                    {request.issuingInstitution && (
                      <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "#475569" }}>
                        Institution: {request.issuingInstitution}
                        {request.issuingCountry && `, ${request.issuingCountry}`}
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
                    {request.status.replace("_", " ")}
                  </span>
                </div>

                {request.ophReferenceNumber && (
                  <div style={{ padding: 12, background: "#e0f2fe", borderRadius: 8, fontSize: 13, color: "#1e40af" }}>
                    <strong>OPH Reference:</strong> {request.ophReferenceNumber}
                  </div>
                )}

                {request.decisionNotes && (
                  <div style={{ padding: 12, background: "#f1f5f9", borderRadius: 8, fontSize: 13, color: "#475569" }}>
                    <strong>Decision Notes:</strong> {request.decisionNotes}
                  </div>
                )}

                <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#64748b" }}>
                  {request.submittedAt && (
                    <span>Submitted: {new Date(request.submittedAt).toLocaleDateString()}</span>
                  )}
                  {request.decisionAt && (
                    <span>Decision: {new Date(request.decisionAt).toLocaleDateString()}</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

