/**
 * Simple Language Helper
 * Converts technical terms to 7th-grade reading level
 */

export const simpleLanguage = {
  // CEFR Levels
  cefr: {
    A0: { simple: "No Finnish yet", tooltip: "CEFR A0: You're just starting to learn Finnish" },
    A1: { simple: "Beginner", tooltip: "CEFR A1: You can say hello, thank you, and basic words" },
    A2: { simple: "Elementary", tooltip: "CEFR A2: You can talk about simple topics like work and daily life" },
    B1: { simple: "Intermediate", tooltip: "CEFR B1: You can have conversations about familiar topics" },
    B2: { simple: "Upper Intermediate", tooltip: "CEFR B2: You can discuss complex topics and work situations" },
    C1: { simple: "Advanced", tooltip: "CEFR C1: You speak Finnish very well, almost like a native" },
    C2: { simple: "Expert", tooltip: "CEFR C2: You speak Finnish perfectly, like a native speaker" },
  },

  // Technical Terms
  terms: {
    ESCO: { simple: "Skill Categories", tooltip: "ESCO: A European system that organizes skills into categories" },
    "EU AI Act": { simple: "AI Safety Rules", tooltip: "EU AI Act: European rules to make sure AI is safe and fair" },
    CEFR: { simple: "Language Levels", tooltip: "CEFR: A system that measures how well you speak a language" },
    XP: { simple: "Points", tooltip: "XP: Points you earn when you complete tasks and learn" },
    OPH: { simple: "Education Office", tooltip: "OPH: The office in Finland that checks if your foreign education is valid" },
    "Skills Matching": { simple: "Finding Jobs That Fit", tooltip: "Skills Matching: The system finds jobs that match your skills" },
  },

  // Simplify text
  simplify: (text: string): string => {
    let simplified = text;
    
    // Replace technical terms
    Object.entries(simpleLanguage.terms).forEach(([term, replacement]) => {
      const regex = new RegExp(term, "gi");
      simplified = simplified.replace(regex, replacement.simple);
    });

    // Replace CEFR levels
    Object.entries(simpleLanguage.cefr).forEach(([level, replacement]) => {
      const regex = new RegExp(`\\b${level}\\b`, "gi");
      simplified = simplified.replace(regex, replacement.simple);
    });

    return simplified;
  },

  // Get tooltip for term
  getTooltip: (term: string): string | null => {
    const cefrMatch = Object.entries(simpleLanguage.cefr).find(([level]) => 
      term.includes(level) || level.toLowerCase() === term.toLowerCase()
    );
    if (cefrMatch) return cefrMatch[1].tooltip;

    const termMatch = Object.entries(simpleLanguage.terms).find(([key]) => 
      term.includes(key) || key.toLowerCase() === term.toLowerCase()
    );
    if (termMatch) return termMatch[1].tooltip;

    return null;
  },
};

