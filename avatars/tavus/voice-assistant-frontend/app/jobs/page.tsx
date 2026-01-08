"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import { useUserProfile } from "@/context/UserProfileContext";
import { JobCard } from "@/components/jobs/JobCard";
import { JobFilters } from "@/components/jobs/JobFilters";
import { JobSubmissionForm } from "@/components/jobs/JobSubmissionForm";
import { CVSubmissionForm } from "@/components/CVSubmissionForm";

interface JobListing {
  id: string;
  title: string;
  slug: string;
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
}

export default function JobsPage() {
  const { state } = useUserProfile();
  const [activeTab, setActiveTab] = useState("browse");
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showCVForm, setShowCVForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 100000]);
  const [languageLevel, setLanguageLevel] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Load jobs
  useEffect(() => {
    loadJobs();
  }, [selectedCategory, selectedType, selectedLocation, sortBy]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedType !== "all") params.append("type", selectedType);
      if (selectedLocation !== "all") params.append("location", selectedLocation);
      if (searchQuery) params.append("search", searchQuery);
      params.append("sort", sortBy);

      const response = await fetch(`/api/jobs?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs client-side for search
  const filteredJobs = useMemo(() => {
    let result = jobs;

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query)
      );
    }

    // Salary range
    result = result.filter((job) => {
      if (!job.salary_min && !job.salary_max) return true;
      const min = job.salary_min || 0;
      const max = job.salary_max || 1000000;
      return max >= salaryRange[0] && min <= salaryRange[1];
    });

    // Language level
    if (languageLevel !== "all") {
      result = result.filter((job) => {
        if (!job.language_requirement) return true;
        return job.language_requirement.toLowerCase().includes(languageLevel.toLowerCase());
      });
    }

    return result;
  }, [jobs, searchQuery, salaryRange, languageLevel]);

  const handleApply = (job: JobListing) => {
    setSelectedJob(job);
    setShowCVForm(true);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "post") {
      setShowJobForm(true);
    }
  };

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      <main
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "40px 24px",
          background: "linear-gradient(180deg, rgba(59, 130, 246, 0.02) 0%, rgba(16, 185, 129, 0.01) 50%, #f8fafc 100%)",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <section
          style={{
            marginBottom: 32,
            padding: "40px",
            borderRadius: 24,
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            color: "#ffffff",
            boxShadow: "0 20px 40px rgba(37,99,235,0.3)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "2.5rem", fontWeight: 800, marginBottom: 12 }}>
                Job Board
              </h1>
              <p style={{ margin: 0, fontSize: "1.1rem", opacity: 0.95 }}>
                Find your next opportunity or post a job opening
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setShowJobForm(true)}
                style={{
                  padding: "14px 28px",
                  borderRadius: 12,
                  border: "2px solid rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                + Post a Job
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 24, marginTop: 32, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center", padding: "16px 24px", background: "rgba(255,255,255,0.15)", borderRadius: 12 }}>
              <div style={{ fontSize: 32, fontWeight: 800 }}>{jobs.length}</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>Active Jobs</div>
            </div>
            <div style={{ textAlign: "center", padding: "16px 24px", background: "rgba(255,255,255,0.15)", borderRadius: 12 }}>
              <div style={{ fontSize: 32, fontWeight: 800 }}>
                {jobs.reduce((sum, job) => sum + job.applications_count, 0)}
              </div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>Total Applications</div>
            </div>
            <div style={{ textAlign: "center", padding: "16px 24px", background: "rgba(255,255,255,0.15)", borderRadius: 12 }}>
              <div style={{ fontSize: 32, fontWeight: 800 }}>
                {jobs.filter((j) => j.is_featured).length}
              </div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>Featured Jobs</div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <JobFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          salaryRange={salaryRange}
          onSalaryRangeChange={setSalaryRange}
          languageLevel={languageLevel}
          onLanguageLevelChange={setLanguageLevel}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Job Listings */}
        <section style={{ marginTop: 32 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
              <div>Loading jobs...</div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>No jobs found</div>
              <div>Try adjusting your filters or search query</div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 20 }}>
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} onApply={() => handleApply(job)} />
              ))}
            </div>
          )}
        </section>

        {/* Job Submission Form Modal */}
        {showJobForm && (
          <JobSubmissionForm
            onClose={() => setShowJobForm(false)}
            onSuccess={() => {
              setShowJobForm(false);
              loadJobs();
            }}
            userId={state.name || undefined}
          />
        )}

        {/* CV Submission Form Modal */}
        {showCVForm && selectedJob && (
          <CVSubmissionForm
            jobId={selectedJob.id}
            jobTitle={selectedJob.title}
            company={selectedJob.company}
            onClose={() => {
              setShowCVForm(false);
              setSelectedJob(null);
            }}
            onSuccess={() => {
              setShowCVForm(false);
              setSelectedJob(null);
              loadJobs(); // Refresh to update application count
            }}
            userId={state.name || undefined}
          />
        )}
      </main>
    </div>
  );
}

