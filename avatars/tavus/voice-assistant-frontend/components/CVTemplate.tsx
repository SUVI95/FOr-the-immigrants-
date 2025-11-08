"use client";

import { useEffect, useMemo, useState } from "react";

type CommunityEntry = {
  role: string;
  organization: string;
  period: string;
  impact: string;
  hours?: number;
  badges?: string[];
};

type CVData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  experience: Array<{ title: string; company: string; period: string; description: string }>;
  education: Array<{ degree: string; institution: string; period: string }>;
  skills: string[];
  languages: Array<{ language: string; level: string }>;
  community: CommunityEntry[];
};

export default function CVTemplate({
  language = "en",
  initialData,
}: {
  language?: "en" | "fi";
  initialData?: Partial<CVData>;
}) {
  const t = (key: string) => {
    const fi: Record<string, string> = {
      title: "Nordic-tyylinen ansioluettelo",
      editHint: "Muokkaa CV:täsi alla. Klikkaa mitä tahansa kenttää muokataksesi.",
      personal: "Henkilötiedot",
      summary: "Yhteenveto",
      experience: "Työkokemus",
      addExperience: "+ Lisää työkokemus",
      education: "Koulutus",
      addEducation: "+ Lisää koulutus",
      skills: "Taidot",
      addSkill: "+ Lisää taito",
      languages: "Kielet",
      exportJson: "Vie JSON",
      print: "Tulosta / Tallenna PDF",
      name: "Nimi",
      email: "Sähköposti",
      phone: "Puhelin",
      address: "Osoite",
      jobTitle: "Tehtävänimike",
      company: "Yritys",
      period: "Ajanjakso",
      degree: "Tutkinto",
      institution: "Oppilaitos",
    };
    const en: Record<string, string> = {
      title: "Nordic CV Template",
      editHint: "Edit your CV below. Click on any field to edit it.",
      personal: "Personal Information",
      summary: "Professional Summary",
      experience: "Work Experience",
      addExperience: "+ Add Experience",
      education: "Education",
      addEducation: "+ Add Education",
      skills: "Skills",
      addSkill: "+ Add Skill",
      languages: "Languages",
      exportJson: "Export JSON",
      print: "Print / Save as PDF",
      name: "Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      jobTitle: "Job Title",
      company: "Company",
      period: "Period",
      degree: "Degree",
      institution: "Institution",
    };
    return (language === "fi" ? fi : en)[key] || key;
  };
  const defaultData: CVData = {
    name: "Your Name",
    email: "your.email@example.com",
    phone: "+358 50 123 4567",
    address: "Helsinki, Finland",
    summary: "Brief professional summary...",
    experience: [
      {
        title: "Job Title",
        company: "Company Name",
        period: "2020 - Present",
        description: "Job responsibilities and achievements...",
      },
    ],
    education: [
      {
        degree: "Degree",
        institution: "University Name",
        period: "2016 - 2020",
      },
    ],
    skills: ["Skill 1", "Skill 2", "Skill 3"],
    languages: [
      { language: "Finnish", level: "B2" },
      { language: "English", level: "C1" },
    ],
    community: [
      {
        role: "Community Volunteer",
        organization: "Local NGO",
        period: "2023 - Present",
        impact: "Supported newcomers during weekly meetups.",
        hours: 10,
      },
    ],
  };

  const mergedData = useMemo<CVData>(() => {
    if (!initialData) return defaultData;
    return {
      ...defaultData,
      ...initialData,
      experience: initialData.experience ?? defaultData.experience,
      education: initialData.education ?? defaultData.education,
      skills: initialData.skills ?? defaultData.skills,
      languages: initialData.languages ?? defaultData.languages,
      community: initialData.community ?? defaultData.community,
    };
  }, [initialData]);

  const [cvData, setCvData] = useState<CVData>(mergedData);

  useEffect(() => {
    setCvData(mergedData);
  }, [mergedData]);

  const [editingField, setEditingField] = useState<string | null>(null);

  const handleEdit = (field: string, value: string) => {
    if (field.includes(".")) {
      const parts = field.split(".");
      const newData = { ...cvData };
      
      if (parts.length === 3) {
        // Format: experience.0.title
        const [parent, indexStr, child] = parts;
        const index = parseInt(indexStr);
        if (parent === "experience" && !isNaN(index) && newData.experience[index]) {
          newData.experience[index] = { ...newData.experience[index], [child]: value };
        } else if (parent === "education" && !isNaN(index) && newData.education[index]) {
          newData.education[index] = { ...newData.education[index], [child]: value };
        }
      }
      setCvData(newData);
    } else {
      setCvData({ ...cvData, [field]: value });
    }
  };

  return (
    <div className="cv-container" style={{ padding: "24px", background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "var(--shadow)" }}>
      <h2 style={{ marginTop: 0, marginBottom: "24px", fontFamily: "Poppins, Inter, sans-serif", fontSize: "24px", fontWeight: 700 }}>
        {t("title")}
      </h2>
      <p style={{ color: "var(--muted)", marginBottom: "24px", fontSize: "14px" }}>
        {t("editHint")}
      </p>

      {/* Personal Information */}
      <section style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", color: "var(--brand)" }}>
          {t("personal")}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          <EditableField
            label={t("name")}
            value={cvData.name}
            onChange={(v) => handleEdit("name", v)}
            editing={editingField === "name"}
            onFocus={() => setEditingField("name")}
            onBlur={() => setEditingField(null)}
          />
          <EditableField
            label={t("email")}
            value={cvData.email}
            onChange={(v) => handleEdit("email", v)}
            editing={editingField === "email"}
            onFocus={() => setEditingField("email")}
            onBlur={() => setEditingField(null)}
          />
          <EditableField
            label={t("phone")}
            value={cvData.phone}
            onChange={(v) => handleEdit("phone", v)}
            editing={editingField === "phone"}
            onFocus={() => setEditingField("phone")}
            onBlur={() => setEditingField(null)}
          />
          <EditableField
            label={t("address")}
            value={cvData.address}
            onChange={(v) => handleEdit("address", v)}
            editing={editingField === "address"}
            onFocus={() => setEditingField("address")}
            onBlur={() => setEditingField(null)}
          />
        </div>
      </section>

      {/* Professional Summary */}
      <section style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", color: "var(--brand)" }}>
          {t("summary")}
        </h3>
        <EditableTextarea
          value={cvData.summary}
          onChange={(v) => handleEdit("summary", v)}
          editing={editingField === "summary"}
          onFocus={() => setEditingField("summary")}
          onBlur={() => setEditingField(null)}
        />
      </section>

      {/* Work Experience */}
      <section style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", color: "var(--brand)" }}>
          {t("experience")}
        </h3>
        {cvData.experience.map((exp, idx) => (
          <div key={idx} style={{ marginBottom: "20px", padding: "16px", background: "#f8fafc", borderRadius: "12px" }}>
            <EditableField
              label={t("jobTitle")}
              value={exp.title}
              onChange={(v) => {
                const newExp = [...cvData.experience];
                newExp[idx] = { ...newExp[idx], title: v };
                setCvData({ ...cvData, experience: newExp });
              }}
              editing={editingField === `exp-${idx}-title`}
              onFocus={() => setEditingField(`exp-${idx}-title`)}
              onBlur={() => setEditingField(null)}
            />
            <EditableField
              label={t("company")}
              value={exp.company}
              onChange={(v) => {
                const newExp = [...cvData.experience];
                newExp[idx] = { ...newExp[idx], company: v };
                setCvData({ ...cvData, experience: newExp });
              }}
              editing={editingField === `exp-${idx}-company`}
              onFocus={() => setEditingField(`exp-${idx}-company`)}
              onBlur={() => setEditingField(null)}
            />
            <EditableField
              label={t("period")}
              value={exp.period}
              onChange={(v) => {
                const newExp = [...cvData.experience];
                newExp[idx] = { ...newExp[idx], period: v };
                setCvData({ ...cvData, experience: newExp });
              }}
              editing={editingField === `exp-${idx}-period`}
              onFocus={() => setEditingField(`exp-${idx}-period`)}
              onBlur={() => setEditingField(null)}
            />
            <EditableTextarea
              value={exp.description}
              onChange={(v) => {
                const newExp = [...cvData.experience];
                newExp[idx] = { ...newExp[idx], description: v };
                setCvData({ ...cvData, experience: newExp });
              }}
              editing={editingField === `exp-${idx}-desc`}
              onFocus={() => setEditingField(`exp-${idx}-desc`)}
              onBlur={() => setEditingField(null)}
            />
          </div>
        ))}
        <button
          onClick={() => {
            setCvData({
              ...cvData,
              experience: [
                ...cvData.experience,
                { title: "New Position", company: "Company", period: "Period", description: "Description..." },
              ],
            });
          }}
          className="btn"
          style={{ marginTop: "8px" }}
        >
          {t("addExperience")}
        </button>
      </section>

      {/* Community Experience */}
      {cvData.community.length > 0 && (
        <section style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", color: "var(--brand)" }}>
            Community Experience
          </h3>
          {cvData.community.map((entry, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: "16px",
                padding: "18px",
                borderRadius: 12,
                background: "#f1f5f9",
                border: "1px solid #dbeafe",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <strong style={{ fontSize: 15 }}>{entry.role}</strong>
                <span style={{ fontSize: 12, color: "#475569" }}>{entry.period}</span>
              </div>
              <div style={{ fontSize: 13, color: "#1f2937", marginBottom: 6 }}>{entry.organization}</div>
              <p style={{ fontSize: 13, color: "#334155", margin: 0 }}>{entry.impact}</p>
              {entry.hours !== undefined && (
                <div style={{ fontSize: 12, color: "#0f172a", marginTop: 6 }}>Hours logged: {entry.hours.toFixed(1)} h</div>
              )}
              {entry.badges && entry.badges.length > 0 && (
                <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {entry.badges.map((badge) => (
                    <span
                      key={badge}
                      style={{
                        fontSize: 11,
                        padding: "4px 8px",
                        borderRadius: 999,
                        background: "#ede9fe",
                        color: "#5b21b6",
                        border: "1px solid #c4b5fd",
                      }}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      <section style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", color: "var(--brand)" }}>
          {t("education")}
        </h3>
        {cvData.education.map((edu, idx) => (
          <div key={idx} style={{ marginBottom: "16px", padding: "16px", background: "#f8fafc", borderRadius: "12px" }}>
            <EditableField
              label={t("degree")}
              value={edu.degree}
              onChange={(v) => {
                const newEdu = [...cvData.education];
                newEdu[idx] = { ...newEdu[idx], degree: v };
                setCvData({ ...cvData, education: newEdu });
              }}
              editing={editingField === `edu-${idx}-degree`}
              onFocus={() => setEditingField(`edu-${idx}-degree`)}
              onBlur={() => setEditingField(null)}
            />
            <EditableField
              label={t("institution")}
              value={edu.institution}
              onChange={(v) => {
                const newEdu = [...cvData.education];
                newEdu[idx] = { ...newEdu[idx], institution: v };
                setCvData({ ...cvData, education: newEdu });
              }}
              editing={editingField === `edu-${idx}-institution`}
              onFocus={() => setEditingField(`edu-${idx}-institution`)}
              onBlur={() => setEditingField(null)}
            />
            <EditableField
              label={t("period")}
              value={edu.period}
              onChange={(v) => {
                const newEdu = [...cvData.education];
                newEdu[idx] = { ...newEdu[idx], period: v };
                setCvData({ ...cvData, education: newEdu });
              }}
              editing={editingField === `edu-${idx}-period`}
              onFocus={() => setEditingField(`edu-${idx}-period`)}
              onBlur={() => setEditingField(null)}
            />
          </div>
        ))}
        <button
          onClick={() => {
            setCvData({
              ...cvData,
              education: [...cvData.education, { degree: "Degree", institution: "Institution", period: "Period" }],
            });
          }}
          className="btn"
          style={{ marginTop: "8px" }}
        >
          {t("addEducation")}
        </button>
      </section>

      {/* Skills & Languages */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <section>
          <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", color: "var(--brand)" }}>
            {t("skills")}
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {cvData.skills.map((skill, idx) => (
              <span
                key={idx}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newSkills = [...cvData.skills];
                  newSkills[idx] = e.currentTarget.textContent || "";
                  setCvData({ ...cvData, skills: newSkills });
                }}
                style={{
                  padding: "6px 12px",
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "999px",
                  fontSize: "14px",
                  cursor: "text",
                }}
              >
                {skill}
              </span>
            ))}
          </div>
          <button
            onClick={() => setCvData({ ...cvData, skills: [...cvData.skills, "New Skill"] })}
            className="btn"
            style={{ marginTop: "8px", fontSize: "12px" }}
          >
            {t("addSkill")}
          </button>
        </section>

        <section>
          <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px", color: "var(--brand)" }}>
            {t("languages")}
          </h3>
          {cvData.languages.map((lang, idx) => (
            <div key={idx} style={{ marginBottom: "8px", display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="text"
                value={lang.language}
                onChange={(e) => {
                  const newLangs = [...cvData.languages];
                  newLangs[idx].language = e.target.value;
                  setCvData({ ...cvData, languages: newLangs });
                }}
                style={{ flex: 1, padding: "6px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "14px" }}
              />
              <select
                value={lang.level}
                onChange={(e) => {
                  const newLangs = [...cvData.languages];
                  newLangs[idx].level = e.target.value;
                  setCvData({ ...cvData, languages: newLangs });
                }}
                style={{ padding: "6px", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "14px" }}
              >
                <option>A1</option>
                <option>A2</option>
                <option>B1</option>
                <option>B2</option>
                <option>C1</option>
                <option>C2</option>
              </select>
            </div>
          ))}
          <button
            onClick={() => setCvData({ ...cvData, languages: [...cvData.languages, { language: "Language", level: "A1" }] })}
            className="btn"
            style={{ marginTop: "8px", fontSize: "12px" }}
          >
            + Add Language
          </button>
        </section>
      </div>

      {/* Download/Export Button */}
      <div style={{ marginTop: "32px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <button
          className="btn"
          onClick={() => {
            const blob = new Blob([JSON.stringify(cvData, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "cv-data.json";
            a.click();
          }}
        >
          {t("exportJson")}
        </button>
        <button
          className="btn primary"
          onClick={() => window.print()}
        >
          {t("print")}
        </button>
      </div>
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
  editing,
  onFocus,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  editing: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 500, marginBottom: "4px", color: "var(--muted)" }}>
        {label}
      </label>
      {editing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          autoFocus
          style={{
            width: "100%",
            padding: "8px",
            border: "2px solid var(--brand)",
            borderRadius: "6px",
            fontSize: "14px",
          }}
        />
      ) : (
        <div
          onClick={onFocus}
          style={{
            padding: "8px",
            border: "1px solid #e2e8f0",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "text",
            background: "white",
            minHeight: "20px",
          }}
        >
          {value || `Click to edit ${label.toLowerCase()}`}
        </div>
      )}
    </div>
  );
}

function EditableTextarea({
  value,
  onChange,
  editing,
  onFocus,
  onBlur,
}: {
  value: string;
  onChange: (v: string) => void;
  editing: boolean;
  onFocus: () => void;
  onBlur: () => void;
}) {
  return editing ? (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      autoFocus
      rows={4}
      style={{
        width: "100%",
        padding: "8px",
        border: "2px solid var(--brand)",
        borderRadius: "6px",
        fontSize: "14px",
        resize: "vertical",
      }}
    />
  ) : (
    <div
      onClick={onFocus}
      style={{
        padding: "8px",
        border: "1px solid #e2e8f0",
        borderRadius: "6px",
        fontSize: "14px",
        cursor: "text",
        background: "white",
        minHeight: "60px",
        whiteSpace: "pre-wrap",
      }}
    >
      {value || "Click to edit..."}
    </div>
  );
}

