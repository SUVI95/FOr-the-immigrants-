"use client";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    company_logo_url?: string;
    description: string;
    category: string;
    job_type: string;
    location: string;
    salary_min?: number;
    salary_max?: number;
    salary_currency?: string;
    language_requirement?: string;
    posted_date: string;
    deadline?: string;
    is_featured: boolean;
    views_count: number;
    applications_count: number;
    tags?: string[];
  };
  onApply: () => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return null;
    const currency = job.salary_currency || "EUR";
    if (job.salary_min && job.salary_max) {
      return `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()} ${currency}/month`;
    }
    if (job.salary_min) return `From ${job.salary_min.toLocaleString()} ${currency}/month`;
    if (job.salary_max) return `Up to ${job.salary_max.toLocaleString()} ${currency}/month`;
    return null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <article
      style={{
        padding: "28px",
        borderRadius: 20,
        background: job.is_featured
          ? "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(251,191,36,0.05))"
          : "#ffffff",
        border: job.is_featured ? "2px solid #fbbf24" : "1px solid #e2e8f0",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        transition: "all 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* Company Logo */}
        {job.company_logo_url && (
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              background: "#f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <img src={job.company_logo_url} alt={job.company} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        {/* Job Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{job.title}</h3>
                {job.is_featured && (
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: 999,
                      background: "#fef3c7",
                      color: "#92400e",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    ⭐ Featured
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#2563eb" }}>{job.company}</span>
                <span style={{ fontSize: 14, color: "#64748b" }}>•</span>
                <span style={{ fontSize: 14, color: "#64748b" }}>{job.location}</span>
                <span style={{ fontSize: 14, color: "#64748b" }}>•</span>
                <span style={{ fontSize: 14, color: "#64748b" }}>{job.job_type}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p
            style={{
              margin: "0 0 16px 0",
              fontSize: 15,
              color: "#475569",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {job.description}
          </p>

          {/* Tags & Info */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
            {job.category && (
              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: "#eff6ff",
                  color: "#1e40af",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {job.category}
              </span>
            )}
            {job.language_requirement && (
              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: "#f0fdf4",
                  color: "#166534",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {job.language_requirement}
              </span>
            )}
            {job.tags?.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: "#f1f5f9",
                  color: "#475569",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Salary & Stats */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#64748b" }}>
              {formatSalary() && <span>💰 {formatSalary()}</span>}
              <span>👁️ {job.views_count} views</span>
              <span>📝 {job.applications_count} applications</span>
              <span>📅 Posted {formatDate(job.posted_date)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, marginTop: 20, paddingTop: 20, borderTop: "1px solid #e2e8f0" }}>
        <button
          type="button"
          onClick={onApply}
          style={{
            flex: 1,
            padding: "14px 24px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Apply Now
        </button>
        <button
          type="button"
          style={{
            padding: "14px 24px",
            borderRadius: 12,
            border: "1px solid #cbd5e1",
            background: "#fff",
            color: "#475569",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Save
        </button>
        <button
          type="button"
          style={{
            padding: "14px 24px",
            borderRadius: 12,
            border: "1px solid #cbd5e1",
            background: "#fff",
            color: "#475569",
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Share
        </button>
      </div>
    </article>
  );
}

