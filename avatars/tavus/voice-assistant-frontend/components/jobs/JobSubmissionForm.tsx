"use client";

import { useState } from "react";

interface JobSubmissionFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  userId?: string;
  jobId?: string; // For editing existing job
}

export function JobSubmissionForm({ onClose, onSuccess, userId, jobId }: JobSubmissionFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    company_logo_url: "",
    company_website: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    category: "",
    job_type: "",
    location: "",
    salary_min: "",
    salary_max: "",
    salary_currency: "EUR",
    language_requirement: "",
    language_level_required: "",
    application_method: "form",
    application_email: "",
    application_link: "",
    deadline: "",
    tags: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.company || !formData.description) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/jobs", {
        method: jobId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          requirements: formData.requirements.split("\n").filter((r) => r.trim()),
          responsibilities: formData.responsibilities.split("\n").filter((r) => r.trim()),
          benefits: formData.benefits.split("\n").filter((b) => b.trim()),
          tags: formData.tags.split(",").map((t) => t.trim()).filter((t) => t),
          salary_min: formData.salary_min ? Number(formData.salary_min) : null,
          salary_max: formData.salary_max ? Number(formData.salary_max) : null,
          created_by: userId,
          id: jobId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit job");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          maxWidth: 800,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
            {jobId ? "Edit Job" : "Post a Job"}
          </h2>
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
          {/* Basic Info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#334155" }}>
                Job Title <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  fontSize: 15,
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#334155" }}>
                Company <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  fontSize: 15,
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#334155" }}>
              Job Description <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={6}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: "1px solid #cbd5e1",
                fontSize: 15,
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />
          </div>

          {/* Requirements & Responsibilities */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#334155" }}>
                Requirements (one per line)
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  fontSize: 15,
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#334155" }}>
                Responsibilities (one per line)
              </label>
              <textarea
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleInputChange}
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  fontSize: 15,
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>

          {/* Category, Type, Location */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#334155" }}>
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  fontSize: 15,
                }}
              >
                <option value="">Select category</option>
                <option value="food-service">Food Service</option>
                <option value="tech">Tech</option>
                <option value="health-care">Health & Care</option>
                <option value="education">Education</option>
                <option value="creative">Creative</option>
                <option value="logistics">Logistics</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#334155" }}>
                Job Type
              </label>
              <select
                name="job_type"
                value={formData.job_type}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  fontSize: 15,
                }}
              >
                <option value="">Select type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="training">Training</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#334155" }}>
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  fontSize: 15,
                }}
              />
            </div>
          </div>

          {/* Salary */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#334155" }}>
                Min Salary
              </label>
              <input
                type="number"
                name="salary_min"
                value={formData.salary_min}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  fontSize: 15,
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#334155" }}>
                Max Salary
              </label>
              <input
                type="number"
                name="salary_max"
                value={formData.salary_max}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  fontSize: 15,
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#334155" }}>
                Currency
              </label>
              <select
                name="salary_currency"
                value={formData.salary_currency}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  fontSize: 15,
                }}
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          {/* Language & Application Method */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#334155" }}>
                Language Requirement
              </label>
              <input
                type="text"
                name="language_requirement"
                value={formData.language_requirement}
                onChange={handleInputChange}
                placeholder="e.g., Finnish A2, English"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  fontSize: 15,
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#334155" }}>
                Application Method
              </label>
              <select
                name="application_method"
                value={formData.application_method}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  fontSize: 15,
                }}
              >
                <option value="form">Application Form</option>
                <option value="email">Email</option>
                <option value="external_link">External Link</option>
              </select>
            </div>
          </div>

          {formData.application_method === "email" && (
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#334155" }}>
                Application Email
              </label>
              <input
                type="email"
                name="application_email"
                value={formData.application_email}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  fontSize: 15,
                }}
              />
            </div>
          )}

          {formData.application_method === "external_link" && (
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#334155" }}>
                Application Link
              </label>
              <input
                type="url"
                name="application_link"
                value={formData.application_link}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  fontSize: 15,
                }}
              />
            </div>
          )}

          {/* Deadline & Tags */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#334155" }}>
                Application Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  fontSize: 15,
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#334155" }}>
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., Remote, Flexible, Mentored"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "1px solid #cbd5e1",
                  fontSize: 15,
                }}
              />
            </div>
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
                background: isSubmitting ? "#94a3b8" : "linear-gradient(135deg, #2563eb, #7c3aed)",
                color: "#fff",
                fontWeight: 700,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                fontSize: 15,
              }}
            >
              {isSubmitting ? "Submitting..." : jobId ? "Update Job" : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

