"use client";

import { useState } from "react";

interface JobFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  salaryRange: [number, number];
  onSalaryRangeChange: (range: [number, number]) => void;
  languageLevel: string;
  onLanguageLevelChange: (level: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const CATEGORIES = [
  "All Categories",
  "Food Service",
  "Tech",
  "Health & Care",
  "Education",
  "Creative",
  "Logistics",
  "Retail",
  "Hospitality",
];

const JOB_TYPES = ["All Types", "Full-time", "Part-time", "Contract", "Internship", "Training", "Temporary"];

const LOCATIONS = ["All Locations", "Kajaani", "Helsinki", "Tampere", "Oulu", "Turku", "Remote"];

const LANGUAGE_LEVELS = ["All Levels", "A0", "A1", "A2", "B1", "B2", "C1", "C2", "English"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "salary_high", label: "Salary: High to Low" },
  { value: "salary_low", label: "Salary: Low to High" },
  { value: "applications", label: "Most Applications" },
  { value: "views", label: "Most Views" },
];

export function JobFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  selectedLocation,
  onLocationChange,
  salaryRange,
  onSalaryRangeChange,
  languageLevel,
  onLanguageLevelChange,
  sortBy,
  onSortChange,
}: JobFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <section
      style={{
        padding: "24px",
        borderRadius: 20,
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
        marginBottom: 24,
      }}
    >
      {/* Search Bar */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search jobs by title, company, or keywords..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 18px",
            borderRadius: 12,
            border: "1px solid #cbd5e1",
            fontSize: 15,
            color: "#1e293b",
          }}
        />
      </div>

      {/* Quick Filters */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 16 }}>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            border: "1px solid #cbd5e1",
            fontSize: 14,
            color: "#1e293b",
            background: "#fff",
          }}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat === "All Categories" ? "all" : cat.toLowerCase()}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            border: "1px solid #cbd5e1",
            fontSize: 14,
            color: "#1e293b",
            background: "#fff",
          }}
        >
          {JOB_TYPES.map((type) => (
            <option key={type} value={type === "All Types" ? "all" : type.toLowerCase()}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={selectedLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            border: "1px solid #cbd5e1",
            fontSize: 14,
            color: "#1e293b",
            background: "#fff",
          }}
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc === "All Locations" ? "all" : loc.toLowerCase()}>
              {loc}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            border: "1px solid #cbd5e1",
            fontSize: 14,
            color: "#1e293b",
            background: "#fff",
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Advanced Filters Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        style={{
          padding: "8px 16px",
          borderRadius: 8,
          border: "1px solid #cbd5e1",
          background: "#f8fafc",
          color: "#475569",
          fontWeight: 600,
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        {showAdvanced ? "▼ Hide" : "▶ Show"} Advanced Filters
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div style={{ marginTop: 20, padding: "20px", background: "#f8fafc", borderRadius: 12, display: "grid", gap: 16 }}>
          {/* Salary Range */}
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#334155" }}>
              Salary Range (EUR/month)
            </label>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <input
                type="number"
                value={salaryRange[0]}
                onChange={(e) => onSalaryRangeChange([Number(e.target.value), salaryRange[1]])}
                placeholder="Min"
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid #cbd5e1",
                  fontSize: 14,
                }}
              />
              <span style={{ color: "#64748b" }}>to</span>
              <input
                type="number"
                value={salaryRange[1]}
                onChange={(e) => onSalaryRangeChange([salaryRange[0], Number(e.target.value)])}
                placeholder="Max"
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "1px solid #cbd5e1",
                  fontSize: 14,
                }}
              />
            </div>
          </div>

          {/* Language Level */}
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#334155" }}>
              Language Level
            </label>
            <select
              value={languageLevel}
              onChange={(e) => onLanguageLevelChange(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #cbd5e1",
                fontSize: 14,
                background: "#fff",
              }}
            >
              {LANGUAGE_LEVELS.map((level) => (
                <option key={level} value={level === "All Levels" ? "all" : level.toLowerCase()}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </section>
  );
}

