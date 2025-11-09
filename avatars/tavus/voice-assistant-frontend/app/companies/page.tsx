"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useUserProfile } from "@/context/UserProfileContext";

type CompanyCategory = "Open for Visits" | "Offers Training" | "Hiring Now";

type CompanyOpportunity = {
  id: string;
  name: string;
  category: CompanyCategory;
  description: string;
  location: string;
  badges: string[];
  xpReward: number;
  contactPerson: string;
  nextWindow: string;
};

const COMPANY_OPPORTUNITIES: CompanyOpportunity[] = [
  {
    id: "company-1",
    name: "Kajaani Bistro",
    category: "Open for Visits",
    description: "Family-owned restaurant welcoming newcomers for kitchen walk-throughs and tasters.",
    location: "Kajaani city centre",
    badges: ["Food", "Hands-on", "English-friendly"],
    xpReward: 50,
    contactPerson: "Salla (Head Chef)",
    nextWindow: "Visits open: Thu & Fri 14:00",
  },
  {
    id: "company-2",
    name: "Kainuu Hospitality",
    category: "Offers Training",
    description: "6-week paid internship covering Finnish service phrases and kitchen teamwork.",
    location: "Kajaani Industrial Park",
    badges: ["Training stipend", "Internship", "A2 Finnish"],
    xpReward: 65,
    contactPerson: "Joel (Training Lead)",
    nextWindow: "Next cohort: 2 Dec",
  },
  {
    id: "company-3",
    name: "NorthCare Cooperative",
    category: "Hiring Now",
    description: "Community care provider hiring part-time support workers with mentoring included.",
    location: "Sotkamo",
    badges: ["Health", "Part-time", "Mentored start"],
    xpReward: 55,
    contactPerson: "Anita (Service Manager)",
    nextWindow: "Apply by 18 Nov",
  },
  {
    id: "company-4",
    name: "Kajaani Innovation Hub",
    category: "Offers Training",
    description: "Tech discovery day with VR labs, product demos, and mentorship sign-ups.",
    location: "Kajaani Smart Campus",
    badges: ["Tech", "Hybrid", "Mentors"],
    xpReward: 42,
    contactPerson: "Ville (Community Lead)",
    nextWindow: "Hybrid event: Thu 16:00",
  },
  {
    id: "company-5",
    name: "Lumo Bakery",
    category: "Open for Visits",
    description: "Morning shadow shift learning barista basics and customer flow.",
    location: "Kajaani main square",
    badges: ["Coffee", "Customer service", "Beginner-friendly"],
    xpReward: 30,
    contactPerson: "Iida (Owner)",
    nextWindow: "Visit slots: Mon + Wed 09:00",
  },
  {
    id: "company-6",
    name: "Arctic Bytes",
    category: "Hiring Now",
    description: "Junior web developer track with on-the-job mentoring and Finnish tech vocabulary support.",
    location: "Remote + Kajaani",
    badges: ["Tech", "Remote", "Mentor included"],
    xpReward: 70,
    contactPerson: "Petteri (CTO)",
    nextWindow: "Interviews ongoing",
  },
];

export default function CompaniesPage() {
  const { recordAction } = useUserProfile();
  const [activeTab, setActiveTab] = useState("programs");
  const [categoryFilter, setCategoryFilter] = useState<CompanyCategory | "All">("All");
  const [savedCompany, setSavedCompany] = useState<string | null>(null);

  const categories = useMemo(
    () => ["All" as const, ...Array.from(new Set(COMPANY_OPPORTUNITIES.map((item) => item.category)))],
    []
  );

  const filteredCompanies = useMemo(() => {
    if (categoryFilter === "All") return COMPANY_OPPORTUNITIES;
    return COMPANY_OPPORTUNITIES.filter((company) => company.category === categoryFilter);
  }, [categoryFilter]);

  const handleTabChange = (tab: string) => {
    if (tab === "explore" || tab === "create") {
      setActiveTab(tab);
      window.location.href = tab === "explore" ? "/" : "/";
    }
  };

  const handleTrackAction = (company: CompanyOpportunity, action: string, xp: number) => {
    recordAction({
      id: `${action}-${company.id}-${Date.now()}`,
      label: `${action} with ${company.name}`,
      category: "companies",
      xp,
      impactPoints: Math.round(xp * 0.7),
      metadata: { companyId: company.id, action },
    });
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
            background: "linear-gradient(135deg, #1d4ed8, #6366f1)",
            color: "#f8fafc",
            boxShadow: "0 34px 62px rgba(79,70,229,0.26)",
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", opacity: 0.85 }}>
            Employers & Opportunities
          </span>
          <h1 style={{ margin: 0, fontSize: "2.6rem", lineHeight: 1.1, fontWeight: 800 }}>Partner companies ready to meet you.</h1>
          <p style={{ margin: 0, fontSize: "1.05rem", maxWidth: 640, lineHeight: 1.7, opacity: 0.9 }}>
            Verified employers and training hubs with inclusive cultures, languages, and pathways. Contact them via Knuut AI and log
            every interaction in your Journey instantly.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <button
              type="button"
              onClick={() => setCategoryFilter("Open for Visits")}
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
              Show visit-ready companies
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter("Offers Training")}
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
              Show training cohorts
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter("Hiring Now")}
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
              Show hiring now
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter("All")}
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
              Clear filter
            </button>
          </div>
        </section>

        <section
          aria-label="Filter company opportunities"
          style={{
            marginBottom: 28,
            padding: "20px 24px",
            borderRadius: 22,
            background: "#ffffff",
            border: "1px solid #dbeafe",
            boxShadow: "0 18px 26px rgba(148,163,184,0.16)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontSize: 14, color: "#475569" }}>
            {filteredCompanies.length} company match{filteredCompanies.length === 1 ? "" : "es"}. AI will auto-suggest the strongest
            options in your weekly recap.
          </div>
          <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 600, color: "#334155" }}>
            Category
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value as CompanyCategory | "All")}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid #cbd5f5",
                background: "#fff",
                fontSize: 13.5,
                fontWeight: 500,
                color: "#1e293b",
                minWidth: 200,
              }}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section style={{ display: "grid", gap: 20 }}>
          {filteredCompanies.map((company) => (
            <article
              key={company.id}
              style={{
                padding: "26px",
                borderRadius: 24,
                background: "#ffffff",
                border:
                  savedCompany === company.id ? "2px solid #22c55e" : "1px solid rgba(148,163,184,0.28)",
                boxShadow:
                  savedCompany === company.id
                    ? "0 26px 48px rgba(34,197,94,0.22)"
                    : "0 20px 36px rgba(148,163,184,0.16)",
                transition: "all 0.3s ease",
                display: "grid",
                gap: 14,
              }}
            >
              <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a" }}>{company.name}</h2>
                  <p style={{ margin: "6px 0 0 0", fontSize: 14.5, color: "#475569" }}>{company.location}</p>
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
                    {company.category}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#22c55e" }}>+{company.xpReward} XP</span>
                </div>
              </header>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: "#1e293b" }}>{company.description}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {company.badges.map((badge) => (
                  <span
                    key={badge}
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
                    {badge}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: 13, color: "#475569", display: "flex", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <strong>Contact:</strong> {company.contactPerson}
                </div>
                <div>
                  <strong>Next window:</strong> {company.nextWindow}
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => {
                    handleTrackAction(company, "book-visit", company.category === "Open for Visits" ? 45 : 35);
                    setSavedCompany(company.id);
                    window.setTimeout(() => setSavedCompany(null), 4000);
                  }}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #38bdf8, #6366f1)",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                    flex: "1 1 160px",
                  }}
                >
                  {company.category === "Open for Visits" ? "Book visit" : "Ask AI to introduce me"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleTrackAction(company, "save-company", 12);
                    setSavedCompany(company.id);
                    window.setTimeout(() => setSavedCompany(null), 4000);
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
                  Save for later
                </button>
                <button
                  type="button"
                  onClick={() => handleTrackAction(company, "meet-team", 30)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: "1px solid rgba(99,102,241,0.35)",
                    background: "rgba(99,102,241,0.08)",
                    color: "#4338ca",
                    fontWeight: 600,
                    cursor: "pointer",
                    flex: "0 0 auto",
                  }}
                >
                  Meet the team
                </button>
                {company.category !== "Open for Visits" && (
                  <button
                    type="button"
                    onClick={() => handleTrackAction(company, "submit-application", 55)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 12,
                      border: "1px solid #22c55e",
                      background: "rgba(34,197,94,0.08)",
                      color: "#047857",
                      fontWeight: 600,
                      cursor: "pointer",
                      flex: "0 0 auto",
                    }}
                  >
                    Apply now
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
