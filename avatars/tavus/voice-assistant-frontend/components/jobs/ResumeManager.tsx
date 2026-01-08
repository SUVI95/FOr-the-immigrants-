"use client";

import { useState, useEffect } from "react";

interface Resume {
  id: string;
  resume_name: string;
  resume_file_url: string;
  resume_file_name: string;
  resume_file_size: number;
  resume_type: string;
  is_primary: boolean;
  is_public: boolean;
  created_at: string;
}

interface ResumeManagerProps {
  userId: string;
}

export function ResumeManager({ userId }: ResumeManagerProps) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResumes();
  }, [userId]);

  const loadResumes = async () => {
    try {
      const response = await fetch(`/api/resumes?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setResumes(data.resumes || []);
      }
    } catch (err) {
      console.error("Failed to load resumes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);
      formData.append("resumeName", file.name.replace(/\.[^/.]+$/, ""));
      formData.append("resumeType", "cv");

      const response = await fetch("/api/resumes", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload resume");
      }

      await loadResumes();
      e.target.value = ""; // Reset file input
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload resume");
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimary = async (resumeId: string) => {
    try {
      const response = await fetch(`/api/resumes/${resumeId}/primary`, {
        method: "PUT",
      });

      if (response.ok) {
        await loadResumes();
      }
    } catch (err) {
      console.error("Failed to set primary resume:", err);
    }
  };

  const handleDelete = async (resumeId: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadResumes();
      }
    } catch (err) {
      console.error("Failed to delete resume:", err);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <section
      style={{
        padding: "32px",
        borderRadius: 24,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>Resume Manager</h2>
          <p style={{ margin: "8px 0 0 0", fontSize: 14, color: "#64748b" }}>
            Upload and manage your CVs and resumes
          </p>
        </div>
        <label
          style={{
            padding: "12px 24px",
            borderRadius: 12,
            border: "2px dashed #cbd5e1",
            background: "#f8fafc",
            color: "#475569",
            fontWeight: 600,
            cursor: uploading ? "not-allowed" : "pointer",
            fontSize: 14,
            display: "inline-block",
          }}
        >
          {uploading ? "Uploading..." : "+ Upload Resume"}
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>
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
            marginBottom: 20,
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading resumes...</div>
      ) : resumes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No resumes uploaded</div>
          <div>Upload your first resume to get started</div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {resumes.map((resume) => (
            <div
              key={resume.id}
              style={{
                padding: "20px",
                borderRadius: 16,
                background: resume.is_primary ? "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))" : "#f8fafc",
                border: resume.is_primary ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>
                    {resume.resume_name}
                  </h3>
                  {resume.is_primary && (
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: "#3b82f6",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      Primary
                    </span>
                  )}
                  {resume.is_public && (
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 6,
                        background: "#10b981",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      Public
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#64748b" }}>
                  <span>{resume.resume_file_name}</span>
                  <span>•</span>
                  <span>{formatFileSize(resume.resume_file_size)}</span>
                  <span>•</span>
                  <span>{resume.resume_type.toUpperCase()}</span>
                  <span>•</span>
                  <span>Uploaded {new Date(resume.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                {!resume.is_primary && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(resume.id)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "1px solid #3b82f6",
                      background: "#fff",
                      color: "#3b82f6",
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    Set Primary
                  </button>
                )}
                <a
                  href={resume.resume_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                    color: "#475569",
                    fontWeight: 600,
                    fontSize: 13,
                    textDecoration: "none",
                  }}
                >
                  View
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(resume.id)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid #ef4444",
                    background: "#fff",
                    color: "#ef4444",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

