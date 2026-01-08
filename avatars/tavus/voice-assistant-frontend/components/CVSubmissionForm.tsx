"use client";

import { useState } from "react";

interface CVSubmissionFormProps {
  jobId: string;
  jobTitle: string;
  company: string;
  onClose: () => void;
  onSuccess?: () => void;
  userId?: string;
}

export function CVSubmissionForm({
  jobId,
  jobTitle,
  company,
  onClose,
  onSuccess,
  userId,
}: CVSubmissionFormProps) {
  const [formData, setFormData] = useState({
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    coverLetter: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a PDF, DOC, DOCX, or TXT file");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setCvFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cvFile) {
      setError("Please select a CV file to upload");
      return;
    }

    if (!formData.applicantName || !formData.applicantEmail) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();
      submitFormData.append("jobId", jobId);
      submitFormData.append("applicantName", formData.applicantName);
      submitFormData.append("applicantEmail", formData.applicantEmail);
      submitFormData.append("applicantPhone", formData.applicantPhone);
      submitFormData.append("coverLetter", formData.coverLetter);
      submitFormData.append("cvFile", cvFile);
      if (userId) {
        submitFormData.append("userId", userId);
      }

      const response = await fetch("/api/cv-submission", {
        method: "POST",
        body: submitFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit CV");
      }

      setSuccess(true);
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit CV. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: "40px",
            maxWidth: 500,
            width: "100%",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
          <h2 style={{ margin: "0 0 12px 0", fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
            CV Submitted Successfully!
          </h2>
          <p style={{ margin: 0, fontSize: 16, color: "#64748b" }}>
            Your CV has been sent to {company}. We'll review it and get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 20,
        overflowY: "auto",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "32px",
          maxWidth: 600,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
              Submit Your CV
            </h2>
            <p style={{ margin: "8px 0 0 0", fontSize: 14, color: "#64748b" }}>
              {jobTitle} at {company}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: "#64748b",
              padding: 8,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
          <div>
            <label
              htmlFor="applicantName"
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Full Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              id="applicantName"
              name="applicantName"
              value={formData.applicantName}
              onChange={handleInputChange}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                fontSize: 15,
                color: "#1e293b",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="applicantEmail"
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Email <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="email"
              id="applicantEmail"
              name="applicantEmail"
              value={formData.applicantEmail}
              onChange={handleInputChange}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                fontSize: 15,
                color: "#1e293b",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="applicantPhone"
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              id="applicantPhone"
              name="applicantPhone"
              value={formData.applicantPhone}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                fontSize: 15,
                color: "#1e293b",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="cvFile"
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "#334155",
              }}
            >
              CV/Resume <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="file"
              id="cvFile"
              name="cvFile"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                fontSize: 15,
                color: "#1e293b",
              }}
            />
            {cvFile && (
              <p style={{ margin: "8px 0 0 0", fontSize: 13, color: "#64748b" }}>
                Selected: {cvFile.name} ({(cvFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
            <p style={{ margin: "8px 0 0 0", fontSize: 12, color: "#94a3b8" }}>
              Accepted formats: PDF, DOC, DOCX, TXT (Max 5MB)
            </p>
          </div>

          <div>
            <label
              htmlFor="coverLetter"
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Cover Letter (Optional)
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              rows={6}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                fontSize: 15,
                color: "#1e293b",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                background: "#fee2e2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                background: "#fff",
                color: "#64748b",
                fontWeight: 600,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: 15,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "12px 24px",
                borderRadius: 12,
                border: "none",
                background: isSubmitting
                  ? "#94a3b8"
                  : "linear-gradient(135deg, #2563eb, #7c3aed)",
                color: "#fff",
                fontWeight: 700,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: 15,
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit CV"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

