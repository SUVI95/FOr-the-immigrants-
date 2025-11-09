"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useUserProfile } from "@/context/UserProfileContext";

type OpportunityType = "Training" | "Internship" | "Full-time" | "Part-time";

type JobOpportunity = {
  id: string;
  title: string;
  company: string;
  field: string;
  city: string;
  language: string;
  type: OpportunityType;
  description: string;
  requirements: string[];
  xpReward: number;
  deadline: string;
  link: string;
  tags?: string[];
};

type RecommendedOpportunity = {
  id: string;
  title: string;
  blurb: string;
  reason: string;
  actionLabel: string;
  xpReward: number;
};

type VisitOpportunity = {
  id: string;
  name: string;
  quote: string;
  description: string;
  location: string;
  status: "Open for Visits" | "Training" | "Shadow";
  xpReward: number;
  languages: string;
};

const JOB_OPPORTUNITIES: JobOpportunity[] = [
  {
    id: "job-1",
    title: "Kitchen Internship",
    company: "Kainuu Hospitality",
    field: "Food Service",
    city: "Kajaani",
    language: "Finnish A2",
    type: "Internship",
    description: "Paid 6-week internship covering prep work, service Finnish, and customer flow.",
    requirements: ["Food Service track completed", "Motivation letter", "Basic Finnish"],
    xpReward: 70,
    deadline: "Apply by 20 Nov",
    link: "https://example.com/kitchen-internship",
    tags: ["Inclusive Employer", "Internship"],
  },
  {
    id: "job-2",
    title: "Community Care Assistant",
    company: "NorthCare Cooperative",
    field: "Health & Care",
    city: "Sotkamo",
    language: "English",
    type: "Part-time",
    description: "Part-time care support role with mentoring and Finnish practice built-in.",
    requirements: ["Friendly attitude", "Background check", "Willing to learn"],
    xpReward: 55,
    deadline: "Rolling applications",
    link: "https://example.com/community-care",
    tags: ["First Job in Finland", "Mentored"],
  },
  {
    id: "job-3",
    title: "Junior Web Developer",
    company: "Arctic Bytes",
    field: "Tech",
    city: "Kajaani",
    language: "English",
    type: "Full-time",
    description: "Entry-level developer position with mentor pairing and Finnish tech slang sessions.",
    requirements: ["Portfolio or GitHub", "Team spirit", "Basic React"],
    xpReward: 90,
    deadline: "Interviews ongoing",
    link: "https://example.com/junior-web-dev",
    tags: ["Inclusive Employer", "Tech"],
  },
  {
    id: "job-4",
    title: "Barista Training Programme",
    company: "Lumo Bakery",
    field: "Food Service",
    city: "Kajaani",
    language: "English",
    type: "Training",
    description: "4-week training sprint covering espresso skills, customer phrases, and service confidence.",
    requirements: ["Customer-friendly", "Able to attend mornings", "Interest in coffee"],
    xpReward: 45,
    deadline: "Starts 25 Nov",
    link: "https://example.com/barista-program",
    tags: ["Training", "Customer Service"],
  },
  {
    id: "job-5",
    title: "Youth Mentor Assistant",
    company: "Kajaani Youth House",
    field: "Education",
    city: "Kajaani",
    language: "Finnish B1",
    type: "Part-time",
    description: "Support youth evenings, help with CV clinics, and co-run activity nights.",
    requirements: ["Prior youth work helpful", "Evening availability", "Positive role model"],
    xpReward: 50,
    deadline: "Apply by 1 Dec",
    link: "https://example.com/youth-mentor",
    tags: ["Inclusive Employer", "Evening role"],
  },
  {
    id: "job-6",
    title: "Assistant Graphic Designer",
    company: "Design Kajaani",
    field: "Creative",
    city: "Kajaani",
    language: "English",
    type: "Internship",
    description: "3-month paid internship crafting visuals for local campaigns and events.",
    requirements: ["Portfolio", "Adobe or Canva", "Collaborative mindset"],
    xpReward: 60,
    deadline: "Interviews from 18 Nov",
    link: "https://example.com/design-intern",
    tags: ["Internship", "Creative"],
  },
];

const RECOMMENDED_OPPORTUNITIES: RecommendedOpportunity[] = [
  {
    id: "rec-1",
    title: "Kitchen Internship – paid & mentored",
    blurb: "Matches your Food Service Fast Track, A2 Finnish, and 2 logged volunteering shifts.",
    reason: "AI found 3 jobs matching your Finnish level and skills — ready to apply?",
    actionLabel: "Apply now with Smart CV",
    xpReward: 75,
  },
  {
    id: "rec-2",
    title: "Community care assistant (evenings)",
    blurb: "Flexible hours + English-friendly team. Great for your social impact goal.",
    reason: "Aligns with your Journey goal: Support families in Kajaani.",
    actionLabel: "Ask AI to prepare intro",
    xpReward: 55,
  },
  {
    id: "rec-3",
    title: "Tech Launchpad shadowing session",
    blurb: "City Tech Hub is open for newcomer shadow shifts this Thursday.",
    reason: "Perfect follow-up after finishing the ‘Build a landing page’ challenge.",
    actionLabel: "Book a visit",
    xpReward: 40,
  },
];

const VISIT_AND_TRAINING_OPPORTUNITIES: VisitOpportunity[] = [
  {
    id: "visit-1",
    name: "Kajaani Café",
    quote: "Visit Kajaani Café to learn barista skills",
    description: "Shadow the morning shift, practice Finnish service phrases, and log +45 XP when you check in.",
    location: "Kajaani city centre · Morning slots",
    status: "Open for Visits",
    xpReward: 45,
    languages: "Finnish & English",
  },
  {
    id: "visit-2",
    name: "City Tech Hub",
    quote: "Shadow a coder at the innovation lab",
    description: "Hybrid shadowing day with VR demos and mentor pairing. Great for Tech Launchpad members.",
    location: "Smart Campus · Thu 16:00",
    status: "Shadow",
    xpReward: 42,
    languages: "English",
  },
  {
    id: "visit-3",
    name: "NorthCare Cooperative",
    quote: "Community care intro & training",
    description: "Meet the care team, learn about mentoring, and sign up for the supported onboarding program.",
    location: "Sotkamo · Flexible times",
    status: "Training",
    xpReward: 50,
    languages: "Finnish & English",
  },
];

const EXTERNAL_PARTNERS = [
  {
    name: "Job Market Finland (TE-palvelut)",
    description: "Official national listings for public sector and regulated roles.",
    action: "Browse TE-palvelut",
    url: "https://www.tyomarkkinatori.fi",
  },
  {
    name: "LinkedIn",
    description: "Keep your professional network updated and share your Smart CV in one click.",
    action: "Export to LinkedIn",
    url: "https://www.linkedin.com",
  },
  {
    name: "Duunijobs.fi",
    description: "Inclusive employers curated for newcomers — syncs with Knuut automatically.",
    action: "Open Duunijobs",
    url: "https://www.duunijobs.fi",
  },
];

export default function WorkOpportunitiesPage() {
  const { recordAction } = useUserProfile();
  const [activeTab, setActiveTab] = useState("programs");
  const [searchQuery, setSearchQuery] = useState("");
  const [fieldFilter, setFieldFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState<OpportunityType | "All">("All");
  const [focusJobId, setFocusJobId] = useState<string | null>(null);

  const fields = useMemo(() => ["All", ...Array.from(new Set(JOB_OPPORTUNITIES.map((job) => job.field)))], []);
  const cities = useMemo(() => ["All", ...Array.from(new Set(JOB_OPPORTUNITIES.map((job) => job.city)))], []);
  const languages = useMemo(() => ["All", ...Array.from(new Set(JOB_OPPORTUNITIES.map((job) => job.language)))], []);
  const types = useMemo(() => ["All", ...Array.from(new Set(JOB_OPPORTUNITIES.map((job) => job.type)))], []);

  const filteredJobs = useMemo(() => {
    return JOB_OPPORTUNITIES.filter((job) => {
      if (fieldFilter !== "All" && job.field !== fieldFilter) return false;
      if (cityFilter !== "All" && job.city !== cityFilter) return false;
      if (languageFilter !== "All" && job.language !== languageFilter) return false;
      if (typeFilter !== "All" && job.type !== typeFilter) return false;
      if (searchQuery && !`${job.title} ${job.company} ${job.description}`.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [fieldFilter, cityFilter, languageFilter, typeFilter, searchQuery]);

  const handleTabChange = (tab: string) => {
    if (tab === "explore" || tab === "create") {
      setActiveTab(tab);
      window.location.href = tab === "explore" ? "/" : "/";
    }
  };

  const handleApply = (job: JobOpportunity) => {
    recordAction({
      id: `job-apply-${job.id}-${Date.now()}`,
      label: `Applied for ${job.title}`,
      category: "jobs",
      xp: job.xpReward,
      impactPoints: Math.round(job.xpReward * 0.75),
      metadata: {
        link: job.link,
        company: job.company,
        type: job.type,
      },
    });
    setFocusJobId(job.id);
    window.open(job.link, "_blank");
    window.setTimeout(() => setFocusJobId(null), 4000);
  };

  return (
    <div className="app">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      <main
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "40px 24px",
          background: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        <section
          style={{
            display: "grid",
            gap: 16,
            marginBottom: 32,
            padding: "34px 36px",
            borderRadius: 28,
            background: "linear-gradient(135deg, #22c55e, #0ea5e9)",
            color: "#f8fafc",
            boxShadow: "0 34px 62px rgba(14,165,233,0.26)",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", opacity: 0.85 }}>
            Work Opportunities
          </span>
          <h1 style={{ margin: 0, fontSize: "2.6rem", lineHeight: 1.1, fontWeight: 800 }}>Jobs, internships, and training in one place.</h1>
          <p style={{ margin: 0, fontSize: "1.05rem", maxWidth: 640, lineHeight: 1.7, opacity: 0.9 }}>
            This is your hub for every employer and job feature Knuut offers — powered by Duunijobs AI. Apply in seconds, log XP
            automatically, and keep your Smart CV in sync.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <button
              type="button"
              onClick={() => {
                setFieldFilter("Food Service");
                setCityFilter("Kajaani");
                setLanguageFilter("Finnish A2");
                setTypeFilter("Internship");
              }}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: "1px solid rgba(248,250,252,0.35)",
                background: "rgba(248,250,252,0.16)",
                color: "#f8fafc",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Show internships near me
            </button>
            <button
              type="button"
              onClick={() => {
                setFieldFilter("Tech");
                setCityFilter("Kajaani");
                setLanguageFilter("English");
                setTypeFilter("Full-time");
              }}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: "1px solid rgba(248,250,252,0.35)",
                background: "rgba(248,250,252,0.16)",
                color: "#f8fafc",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Switch to tech roles
            </button>
          </div>
        </section>

        <section
          aria-label="Recommended opportunities"
          style={{
            marginBottom: 28,
            padding: "24px 26px",
            borderRadius: 24,
            background: "#ffffff",
            border: "1px solid #dbeafe",
            boxShadow: "0 24px 38px rgba(59,130,246,0.16)",
            display: "grid",
            gap: 20,
          }}
        >
          <header style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Recommended for you</h2>
              <p style={{ margin: "6px 0 0 0", fontSize: 14.5, color: "#475569" }}>
                Jobs suggested by Knuut AI based on your Smart CV, Skill Passport, and Journey progress.
              </p>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#2563eb" }}>Updated a few minutes ago</span>
          </header>
          <div style={{ display: "grid", gap: 16 }}>
            {RECOMMENDED_OPPORTUNITIES.map((item) => (
              <article
                key={item.id}
                style={{
                  padding: "20px 22px",
                  borderRadius: 18,
                  background: "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(14,165,233,0.12))",
                  border: "1px solid rgba(37,99,235,0.25)",
                  display: "grid",
                  gap: 10,
                }}
              >
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{item.title}</h3>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#22c55e" }}>+{item.xpReward} XP</span>
                </header>
                <p style={{ margin: 0, fontSize: 14, color: "#1e293b", lineHeight: 1.6 }}>{item.blurb}</p>
                <p style={{ margin: 0, fontSize: 13, color: "#2563eb", fontWeight: 600 }}>{item.reason}</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => {
                      recordAction({
                        id: `recommended-${item.id}-${Date.now()}`,
                        label: `Followed recommended opportunity: ${item.title}`,
                        category: "jobs",
                        xp: item.xpReward,
                        impactPoints: Math.round(item.xpReward * 0.7),
                      });
                      setFocusJobId(item.id);
                      window.setTimeout(() => setFocusJobId(null), 4000);
                    }}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 12,
                      border: "none",
                      background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                      color: "#fff",
                      fontWeight: 700,
                      cursor: "pointer",
                      flex: "1 1 180px",
                    }}
                  >
                    {item.actionLabel}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      recordAction({
                        id: `recommended-save-${item.id}-${Date.now()}`,
                        label: `Saved recommended opportunity ${item.title}`,
                        category: "jobs",
                        xp: 14,
                        impactPoints: 10,
                      });
                      setFocusJobId(item.id);
                      window.setTimeout(() => setFocusJobId(null), 4000);
                    }}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 12,
                      border: "1px solid rgba(37,99,235,0.35)",
                      background: "rgba(37,99,235,0.08)",
                      color: "#1d4ed8",
                      fontWeight: 600,
                      cursor: "pointer",
                      flex: "0 0 auto",
                    }}
                  >
                    Save for later
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-label="Search and filter jobs"
          style={{
            marginBottom: 28,
            padding: "20px 24px",
            borderRadius: 22,
            background: "#ffffff",
            border: "1px solid #dbeafe",
            boxShadow: "0 18px 26px rgba(148,163,184,0.16)",
            display: "grid",
            gap: 18,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <input
              type="text"
              placeholder="Search by role, company, or keyword"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              style={{
                flex: "1 1 220px",
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid #cbd5f5",
                background: "#fff",
                fontSize: 13.5,
                color: "#1e293b",
              }}
            />
            <FilterSelect label="Field" value={fieldFilter} options={fields} onChange={setFieldFilter} />
            <FilterSelect label="City" value={cityFilter} options={cities} onChange={setCityFilter} />
            <FilterSelect label="Language" value={languageFilter} options={languages} onChange={setLanguageFilter} />
            <FilterSelect
              label="Type"
              value={typeFilter}
              options={types}
              onChange={(value) => setTypeFilter(value as OpportunityType | "All")}
            />
          </div>
          <div style={{ fontSize: 13, color: "#475569" }}>
            {filteredJobs.length} opportunity{filteredJobs.length === 1 ? "" : "ies"} found. AI will nudge you when similar roles
            appear.
          </div>
        </section>

        <section
          aria-label="Company visits and training"
          style={{
            marginBottom: 28,
            padding: "24px 26px",
            borderRadius: 24,
            background: "#ffffff",
            border: "1px solid #fcd34d",
            boxShadow: "0 22px 36px rgba(251,191,36,0.18)",
            display: "grid",
            gap: 18,
          }}
        >
          <header style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Company visits & training</h2>
              <p style={{ margin: "6px 0 0 0", fontSize: 14.5, color: "#475569" }}>
                Companies open for visits, internships, and micro-apprenticeships. Each action logs XP in your Journey.
              </p>
            </div>
            <a
              href="/companies"
              style={{ fontSize: 13, fontWeight: 600, color: "#b45309", textDecoration: "none" }}
            >
              View all partner companies →
            </a>
          </header>
          <div style={{ display: "grid", gap: 16 }}>
            {VISIT_AND_TRAINING_OPPORTUNITIES.map((visit) => (
              <article
                key={visit.id}
                style={{
                  padding: "20px",
                  borderRadius: 18,
                  background: "rgba(254,243,199,0.75)",
                  border: "1px solid rgba(251,191,36,0.4)",
                  display: "grid",
                  gap: 10,
                }}
              >
                <header style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#9a3412" }}>{visit.quote}</h3>
                    <p style={{ margin: "6px 0 0 0", fontSize: 13.5, color: "#b45309" }}>{visit.name} · {visit.location}</p>
                  </div>
                  <div style={{ textAlign: "right", display: "grid", gap: 6 }}>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        background: "rgba(250,204,21,0.25)",
                        border: "1px solid rgba(202,138,4,0.35)",
                        color: "#b45309",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {visit.status}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#d97706" }}>+{visit.xpReward} XP</span>
                  </div>
                </header>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#78350f" }}>{visit.description}</p>
                <div style={{ fontSize: 12.5, color: "#92400e" }}>Languages: {visit.languages}</div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => {
                      recordAction({
                        id: `visit-book-${visit.id}-${Date.now()}`,
                        label: `Booked visit/training: ${visit.name}`,
                        category: "companies",
                        xp: visit.xpReward,
                        impactPoints: Math.round(visit.xpReward * 0.7),
                      });
                      setFocusJobId(visit.id);
                      window.setTimeout(() => setFocusJobId(null), 4000);
                    }}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 12,
                      border: "none",
                      background: "linear-gradient(135deg, #fbbf24, #f97316)",
                      color: "#fff",
                      fontWeight: 700,
                      cursor: "pointer",
                      flex: "1 1 160px",
                    }}
                  >
                    Contact via Knuut AI
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      recordAction({
                        id: `visit-save-${visit.id}-${Date.now()}`,
                        label: `Saved visit opportunity ${visit.name}`,
                        category: "companies",
                        xp: 12,
                        impactPoints: 9,
                      });
                      setFocusJobId(visit.id);
                      window.setTimeout(() => setFocusJobId(null), 4000);
                    }}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 12,
                      border: "1px solid rgba(234,179,8,0.45)",
                      background: "rgba(234,179,8,0.15)",
                      color: "#92400e",
                      fontWeight: 600,
                      cursor: "pointer",
                      flex: "0 0 auto",
                    }}
                  >
                    Save for later
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: 20 }}>
          <header>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>Open job listings</h2>
            <p style={{ margin: "6px 0 0 0", fontSize: 14.5, color: "#475569" }}>
              Pulled directly from Duunijobs.fi. Look for badges like “Inclusive Employer” or “First Job in Finland”.
            </p>
          </header>
          {filteredJobs.map((job) => (
            <article
              key={job.id}
              style={{
                padding: "26px",
                borderRadius: 24,
                background: "#ffffff",
                border: focusJobId === job.id ? "2px solid #38bdf8" : "1px solid rgba(148,163,184,0.28)",
                boxShadow:
                  focusJobId === job.id
                    ? "0 28px 50px rgba(56,189,248,0.24)"
                    : "0 20px 36px rgba(148,163,184,0.16)",
                transition: "all 0.3s ease",
                display: "grid",
                gap: 14,
              }}
            >
              <header style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{job.title}</h2>
                  <p style={{ margin: "6px 0 0 0", fontSize: 14.5, color: "#475569" }}>
                    {job.company} · {job.city}
                  </p>
                </div>
                <div style={{ display: "grid", gap: 6, textAlign: "right" }}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      background: "#e0f2fe",
                      border: "1px solid #bae6fd",
                      color: "#0369a1",
                      fontSize: 12.5,
                      fontWeight: 700,
                    }}
                  >
                    {job.type}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#38bdf8" }}>+{job.xpReward} XP</span>
                </div>
              </header>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: "#1e293b" }}>{job.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: "#f1f5f9",
                    border: "1px solid #cbd5f5",
                    color: "#1d4ed8",
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  {job.field}
                </span>
                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: "#f1f5f9",
                    border: "1px solid #cbd5f5",
                    color: "#1d4ed8",
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  {job.language}
                </span>
                <span
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: "#f1f5f9",
                    border: "1px solid #cbd5f5",
                    color: "#1d4ed8",
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  {job.deadline}
                </span>
                {job.tags?.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: "#ecfccb",
                      border: "1px solid #bbf7d0",
                      color: "#166534",
                      fontSize: 12.5,
                      fontWeight: 600,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div style={{ display: "grid", gap: 6 }}>
                <strong style={{ fontSize: 13, color: "#334155" }}>Requirements:</strong>
                <ul style={{ margin: 0, paddingLeft: 18, color: "#475569", fontSize: 13.5, lineHeight: 1.6 }}>
                  {job.requirements.map((requirement) => (
                    <li key={requirement}>{requirement}</li>
                  ))}
                </ul>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => handleApply(job)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                    flex: "1 1 200px",
                  }}
                >
                  Apply with Smart CV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    recordAction({
                      id: `job-ask-ai-${job.id}-${Date.now()}`,
                      label: `Asked AI to prep intro for ${job.title}`,
                      category: "jobs",
                      xp: 28,
                      impactPoints: 20,
                    });
                    setFocusJobId(job.id);
                    window.setTimeout(() => setFocusJobId(null), 4000);
                  }}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: "1px solid #cbd5f5",
                    background: "#fff",
                    color: "#1e293b",
                    fontWeight: 600,
                    cursor: "pointer",
                    flex: "0 0 auto",
                  }}
                >
                  Ask AI to pitch me
                </button>
                <button
                  type="button"
                  onClick={() => {
                    recordAction({
                      id: `job-save-${job.id}-${Date.now()}`,
                      label: `Saved job ${job.title}`,
                      category: "jobs",
                      xp: 12,
                      impactPoints: 10,
                    });
                    setFocusJobId(job.id);
                    window.setTimeout(() => setFocusJobId(null), 4000);
                  }}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: "1px solid rgba(148,163,184,0.45)",
                    background: "rgba(148,163,184,0.08)",
                    color: "#334155",
                    fontWeight: 600,
                    cursor: "pointer",
                    flex: "0 0 auto",
                  }}
                >
                  Save for later
                </button>
              </div>
            </article>
          ))}
        </section>

        <section
          aria-label="External partner links"
          style={{
            marginTop: 28,
            padding: "22px 24px",
            borderRadius: 24,
            background: "#ffffff",
            border: "1px solid #cbd5f5",
            boxShadow: "0 22px 40px rgba(148,163,184,0.18)",
            display: "grid",
            gap: 16,
          }}
        >
          <header>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>External partners</h2>
            <p style={{ margin: "6px 0 0 0", fontSize: 14.5, color: "#475569" }}>
              Neutral integrations to keep your opportunities up to date.
            </p>
          </header>
          <div style={{ display: "grid", gap: 14 }}>
            {EXTERNAL_PARTNERS.map((partner) => (
              <article
                key={partner.name}
                style={{
                  padding: "18px 20px",
                  borderRadius: 18,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#1e293b" }}>{partner.name}</h3>
                  <p style={{ margin: "6px 0 0 0", fontSize: 13.5, color: "#475569" }}>{partner.description}</p>
                </div>
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    recordAction({
                      id: `external-${partner.name}-${Date.now()}`,
                      label: `Opened external partner ${partner.name}`,
                      category: "jobs",
                      xp: 10,
                      impactPoints: 8,
                    });
                  }}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: "1px solid #2563eb",
                    background: "rgba(37,99,235,0.08)",
                    color: "#2563eb",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  {partner.action}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-label="Smart CV builder"
          style={{
            marginTop: 28,
            padding: "26px 28px",
            borderRadius: 28,
            background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
            color: "#f8fafc",
            boxShadow: "0 32px 56px rgba(99,102,241,0.28)",
            display: "grid",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 12, letterSpacing: 1.4, fontWeight: 700, textTransform: "uppercase", opacity: 0.9 }}>
            Smart CV Builder
          </span>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Connect your story to every opportunity.</h2>
          <p style={{ margin: 0, fontSize: 14.5, maxWidth: 600, lineHeight: 1.7 }}>
            Auto-generate your CV from your profile, translate it to Finnish or English instantly, and export wherever you need.
          </p>
          <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8, fontSize: 14.5, lineHeight: 1.6 }}>
            <li>Apply directly to roles on Duunijobs.fi with a ready summary.</li>
            <li>Share your CV with LinkedIn or verified partner companies.</li>
            <li>Send your profile to municipalities via Organizer Tools in one click.</li>
          </ul>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="/smart-cv-builder"
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                border: "none",
                background: "rgba(248,250,252,0.92)",
                color: "#1d4ed8",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Open Smart CV Builder
            </a>
            <button
              type="button"
              onClick={() => {
                recordAction({
                  id: `cv-ai-summary-${Date.now()}`,
                  label: "Requested AI CV summary",
                  category: "jobs",
                  xp: 30,
                  impactPoints: 22,
                });
                alert("AI summary ready! Head to Smart CV builder to review and export.");
              }}
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                border: "1px solid rgba(248,250,252,0.65)",
                background: "rgba(248,250,252,0.18)",
                color: "#f8fafc",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Generate AI summary
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 600, color: "#334155" }}>
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          padding: "10px 14px",
          borderRadius: 12,
          border: "1px solid #cbd5f5",
          background: "#fff",
          fontSize: 13.5,
          fontWeight: 500,
          color: "#1e293b",
          minWidth: 180,
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
