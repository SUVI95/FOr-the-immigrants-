"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useUserProfile } from "@/context/UserProfileContext";

interface CommunityMember {
  id: string;
  name: string;
  profession: string;
  city: string;
  languages: string[];
  skills: string[];
  availability: string[];
  bio: string;
  goals: string[];
  xpReward: number;
}

const COMMUNITY_MEMBERS: CommunityMember[] = [
  {
    id: "member-1",
    name: "Hanna Korhonen",
    profession: "Food Service",
    city: "Kajaani",
    languages: ["Finnish", "English"],
    skills: ["Cooking", "Customer service", "Pastry"],
    availability: ["Chat", "Meet"],
    bio: "Former restaurant cook now mentoring newcomers in Kajaani.",
    goals: ["Host skill swaps", "Support apprenticeship seekers"],
    xpReward: 40,
  },
  {
    id: "member-2",
    name: "Ahmed Farah",
    profession: "Design",
    city: "Kajaani",
    languages: ["English", "Finnish"],
    skills: ["Graphic design", "Branding", "Canva"],
    availability: ["Chat", "Collaborate"],
    bio: "Visual storyteller designing materials for community projects.",
    goals: ["Find collaborators", "Support NGOs"],
    xpReward: 32,
  },
  {
    id: "member-3",
    name: "Maria Alves",
    profession: "Caregiver",
    city: "Sotkamo",
    languages: ["Portuguese", "English", "Finnish"],
    skills: ["Childcare", "Elderly support", "Language buddy"],
    availability: ["Chat", "Meet"],
    bio: "Early-childhood educator exploring part-time care roles.",
    goals: ["Practice Finnish", "Find peer mentors"],
    xpReward: 36,
  },
  {
    id: "member-4",
    name: "Liisa Mäkelä",
    profession: "Tech",
    city: "Kajaani",
    languages: ["Finnish", "English", "Swedish"],
    skills: ["Frontend development", "UX research", "Workshops"],
    availability: ["Chat", "Collaborate", "Mentor"],
    bio: "UX designer running monthly newcomer-friendly meetups.",
    goals: ["Co-create apps", "Support job seekers"],
    xpReward: 45,
  },
  {
    id: "member-5",
    name: "Ravi Kumar",
    profession: "Food Service",
    city: "Kajaani",
    languages: ["English", "Hindi", "Finnish"],
    skills: ["Catering", "Menu planning", "Logistics"],
    availability: ["Chat", "Collaborate"],
    bio: "Catering student finishing the Cooking Basics Fast Track.",
    goals: ["Shadow experienced chefs", "Join pop-up events"],
    xpReward: 38,
  },
  {
    id: "member-6",
    name: "Anu Saarinen",
    profession: "Education",
    city: "Kajaani",
    languages: ["Finnish", "English"],
    skills: ["Finnish tutoring", "Curriculum design", "Google Classroom"],
    availability: ["Chat", "Mentor"],
    bio: "Integration teacher pairing newcomers for language practice.",
    goals: ["Match with families", "Share teaching resources"],
    xpReward: 28,
  },
];

export default function ConnectBySkillsPage() {
  const { recordAction } = useUserProfile();
  const [activeTab, setActiveTab] = useState("explore");
  const [cityFilter, setCityFilter] = useState("All");
  const [professionFilter, setProfessionFilter] = useState("All");
  const [languageFilter, setLanguageFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const cities = useMemo(() => ["All", ...Array.from(new Set(COMMUNITY_MEMBERS.map((member) => member.city)))], []);
  const professions = useMemo(() => ["All", ...Array.from(new Set(COMMUNITY_MEMBERS.map((member) => member.profession)))], []);
  const languages = useMemo(
    () => ["All", ...Array.from(new Set(COMMUNITY_MEMBERS.flatMap((member) => member.languages)))],
    []
  );
  const availabilityOptions = useMemo(
    () => ["All", ...Array.from(new Set(COMMUNITY_MEMBERS.flatMap((member) => member.availability)))],
    []
  );

  const filteredMembers = useMemo(() => {
    return COMMUNITY_MEMBERS.filter((member) => {
      if (cityFilter !== "All" && member.city !== cityFilter) return false;
      if (professionFilter !== "All" && member.profession !== professionFilter) return false;
      if (languageFilter !== "All" && !member.languages.includes(languageFilter)) return false;
      if (availabilityFilter !== "All" && !member.availability.includes(availabilityFilter)) return false;
      return true;
    });
  }, [cityFilter, professionFilter, languageFilter, availabilityFilter]);

  const handleTabChange = (tab: string) => {
    if (tab === "explore" || tab === "create") {
      setActiveTab(tab);
      window.location.href = tab === "explore" ? "/" : "/";
    }
  };

  const handleAskAI = (member: CommunityMember) => {
    recordAction({
      id: `ai-intro-${member.id}-${Date.now()}`,
      label: `Requested AI intro with ${member.name}`,
      category: "connections",
      xp: member.xpReward,
      impactPoints: Math.round(member.xpReward * 0.7),
      metadata: {
        type: "ai_intro",
        target: member.id,
      },
    });
    setHighlightedId(member.id);
    window.setTimeout(() => setHighlightedId(null), 4000);
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
            marginBottom: 32,
            padding: "32px 36px",
            borderRadius: 28,
            background: "linear-gradient(135deg, #0ea5e9, #14b8a6)",
            color: "#f8fafc",
            boxShadow: "0 32px 60px rgba(13,148,136,0.22)",
            display: "grid",
            gap: 16,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1.4, textTransform: "uppercase", opacity: 0.85 }}>
            People & Professions
          </span>
          <h1 style={{ margin: 0, fontSize: "2.6rem", lineHeight: 1.1, fontWeight: 800 }}>Connect by skills and goals.</h1>
          <p style={{ margin: 0, fontSize: "1.05rem", maxWidth: 640, lineHeight: 1.7, opacity: 0.9 }}>
            Meet people who share your profession, language, or ambition. Ask Knuut to introduce you and start collaborating within
            minutes.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 12, opacity: 0.85 }}>AI filter active · prioritising Kajaani + food service right now</span>
            <button
              type="button"
              onClick={() => {
                setCityFilter("Kajaani");
                setProfessionFilter("Food Service");
                setLanguageFilter("All");
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
              See cooks near me
            </button>
            <button
              type="button"
              onClick={() => {
                setCityFilter("Kajaani");
                setProfessionFilter("Tech");
                setLanguageFilter("English");
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
              Switch to tech mentors
            </button>
          </div>
        </section>

        <section
          aria-label="Filter community members"
          style={{
            marginBottom: 28,
            padding: "20px 24px",
            borderRadius: 22,
            background: "#ffffff",
            border: "1px solid #dbeafe",
            boxShadow: "0 18px 26px rgba(148,163,184,0.16)",
            display: "grid",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <FilterSelect label="City" value={cityFilter} onChange={setCityFilter} options={cities} />
            <FilterSelect label="Profession" value={professionFilter} onChange={setProfessionFilter} options={professions} />
            <FilterSelect label="Language" value={languageFilter} onChange={setLanguageFilter} options={languages} />
            <FilterSelect
              label="Availability"
              value={availabilityFilter}
              onChange={setAvailabilityFilter}
              options={availabilityOptions}
            />
          </div>
          <div style={{ fontSize: 13, color: "#475569" }}>
            {filteredMembers.length} match{filteredMembers.length === 1 ? "" : "es"}. Ask Knuut AI to write the introduction and log the
            action in your Journey.
          </div>
        </section>

        <section style={{ display: "grid", gap: 20 }}>
          {filteredMembers.map((member) => (
            <article
              key={member.id}
              style={{
                position: "relative",
                padding: "24px",
                borderRadius: 22,
                background: "#ffffff",
                border: highlightedId === member.id ? "2px solid #38bdf8" : "1px solid #e2e8f0",
                boxShadow:
                  highlightedId === member.id
                    ? "0 24px 48px rgba(56,189,248,0.25)"
                    : "0 18px 32px rgba(148,163,184,0.16)",
                transition: "all 0.3s ease",
                display: "grid",
                gap: 14,
              }}
            >
              <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{member.name}</h2>
                  <p style={{ margin: "4px 0 0 0", fontSize: 14.5, color: "#475569" }}>
                    {member.profession} · {member.city}
                  </p>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#38bdf8" }}>+{member.xpReward} XP</span>
              </header>
              <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: "#1e293b" }}>{member.bio}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: "#eff6ff",
                      border: "1px solid #dbeafe",
                      color: "#1d4ed8",
                      fontSize: 12.5,
                      fontWeight: 600,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 13, color: "#475569" }}>
                <div>
                  <strong>Languages:</strong> {member.languages.join(", ")}
                </div>
                <div>
                  <strong>Availability:</strong> {member.availability.join(" · ")}
                </div>
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                <strong style={{ fontSize: 13, color: "#334155" }}>Goals:</strong>
                <ul style={{ margin: 0, paddingLeft: 18, color: "#475569", fontSize: 13.5, lineHeight: 1.6 }}>
                  {member.goals.map((goal) => (
                    <li key={goal}>{goal}</li>
                  ))}
                </ul>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <button
                  type="button"
                  onClick={() => handleAskAI(member)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #38bdf8, #6366f1)",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                    flex: "1 1 180px",
                  }}
                >
                  Ask AI to introduce me
                </button>
                <button
                  type="button"
                  onClick={() => {
                    recordAction({
                      id: `save-profile-${member.id}-${Date.now()}`,
                      label: `Saved profile ${member.name}`,
                      category: "connections",
                      xp: 10,
                      impactPoints: 8,
                    });
                    setHighlightedId(member.id);
                    window.setTimeout(() => setHighlightedId(null), 4000);
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
              </div>
            </article>
          ))}
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
          minWidth: 160,
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
