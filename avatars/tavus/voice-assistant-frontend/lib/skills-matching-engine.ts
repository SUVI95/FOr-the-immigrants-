/**
 * Non-AI Rule-Based Skills Matching Engine
 * EU AI Act Classification: NOT AN AI SYSTEM (No Risk)
 * 
 * This is a deterministic rule-based matching algorithm that calculates
 * job fit scores without using AI. AI is only used for suggestions/explanations.
 */

export interface UserSkill {
  skill: string;
  esco_code?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  source: string; // 'qualification', 'work_experience', 'volunteering', 'learning'
}

export interface JobRequirement {
  required_skills: string[];
  preferred_skills?: string[];
  language_level?: string; // A0, A1, A2, B1, B2, C1, C2
  qualifications?: string[];
}

export interface MatchResult {
  matchScore: number; // 0-100
  matchedSkills: string[];
  missingSkills: string[];
  missingLanguageLevel?: boolean;
  breakdown: {
    skillsMatch: number; // 0-100
    languageMatch: number; // 0-100
    qualificationMatch: number; // 0-100
    explanation: string;
  };
}

/**
 * Calculate skills match score (non-AI, rule-based)
 */
export function calculateSkillsMatch(
  userSkills: UserSkill[],
  jobRequirements: JobRequirement,
  userLanguageLevel: string = 'A0'
): MatchResult {
  const userSkillNames = userSkills.map(s => s.skill.toLowerCase());
  const userEscoCodes = userSkills
    .filter(s => s.esco_code)
    .map(s => s.esco_code!.toLowerCase());

  // Match required skills
  const requiredSkillsLower = jobRequirements.required_skills.map(s => s.toLowerCase());
  const matchedRequired = requiredSkillsLower.filter(reqSkill => {
    // Direct match
    if (userSkillNames.some(us => us === reqSkill || us.includes(reqSkill) || reqSkill.includes(us))) {
      return true;
    }
    // ESCO code match
    if (userEscoCodes.some(code => code === reqSkill.toLowerCase())) {
      return true;
    }
    return false;
  });

  // Match preferred skills (bonus points)
  const preferredSkillsLower = (jobRequirements.preferred_skills || []).map(s => s.toLowerCase());
  const matchedPreferred = preferredSkillsLower.filter(prefSkill => {
    if (userSkillNames.some(us => us === prefSkill || us.includes(prefSkill) || prefSkill.includes(us))) {
      return true;
    }
    if (userEscoCodes.some(code => code === prefSkill.toLowerCase())) {
      return true;
    }
    return false;
  });

  // Calculate skills match percentage
  const requiredMatchRatio = jobRequirements.required_skills.length > 0
    ? matchedRequired.length / jobRequirements.required_skills.length
    : 1;
  const preferredMatchRatio = preferredSkillsLower.length > 0
    ? matchedPreferred.length / preferredSkillsLower.length
    : 0;

  // Skills score: 70% required, 30% preferred
  const skillsMatchScore = Math.round(
    (requiredMatchRatio * 70) + (preferredMatchRatio * 30)
  );

  // Language level match
  const languageLevels = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const userLevelIndex = languageLevels.indexOf(userLanguageLevel.toUpperCase());
  const requiredLevelIndex = jobRequirements.language_level
    ? languageLevels.indexOf(jobRequirements.language_level.toUpperCase())
    : -1;

  let languageMatchScore = 100;
  let missingLanguageLevel = false;

  if (requiredLevelIndex >= 0) {
    if (userLevelIndex >= requiredLevelIndex) {
      languageMatchScore = 100;
    } else {
      const gap = requiredLevelIndex - userLevelIndex;
      languageMatchScore = Math.max(0, 100 - (gap * 20)); // -20 points per level gap
      missingLanguageLevel = true;
    }
  }

  // Qualification match (if specified)
  let qualificationMatchScore = 100;
  if (jobRequirements.qualifications && jobRequirements.qualifications.length > 0) {
    // Simple keyword matching for qualifications
    const userQuals = userSkills
      .filter(s => s.source === 'qualification')
      .map(s => s.skill.toLowerCase());
    
    const hasMatchingQual = jobRequirements.qualifications.some(reqQual => {
      const reqQualLower = reqQual.toLowerCase();
      return userQuals.some(uq => uq.includes(reqQualLower) || reqQualLower.includes(uq));
    });

    qualificationMatchScore = hasMatchingQual ? 100 : 50; // 50% if no direct match
  }

  // Overall match score: 60% skills, 30% language, 10% qualifications
  const overallScore = Math.round(
    (skillsMatchScore * 0.6) +
    (languageMatchScore * 0.3) +
    (qualificationMatchScore * 0.1)
  );

  // Missing skills
  const missingSkills = requiredSkillsLower.filter(reqSkill => {
    return !matchedRequired.includes(reqSkill);
  });

  // Generate explanation
  const explanation = generateMatchExplanation(
    overallScore,
    matchedRequired.length,
    jobRequirements.required_skills.length,
    missingSkills,
    missingLanguageLevel,
    userLanguageLevel,
    jobRequirements.language_level
  );

  return {
    matchScore: overallScore,
    matchedSkills: matchedRequired,
    missingSkills,
    missingLanguageLevel,
    breakdown: {
      skillsMatch: skillsMatchScore,
      languageMatch: languageMatchScore,
      qualificationMatch: qualificationMatchScore,
      explanation,
    },
  };
}

function generateMatchExplanation(
  score: number,
  matchedCount: number,
  requiredCount: number,
  missingSkills: string[],
  missingLanguage: boolean,
  userLang: string,
  requiredLang?: string
): string {
  let baseMessage = '';
  
  if (score >= 80) {
    baseMessage = `Excellent match! You have ${matchedCount}/${requiredCount} required skills.`;
  } else if (score >= 60) {
    baseMessage = `Good match. You have ${matchedCount}/${requiredCount} required skills.`;
  } else if (score >= 40) {
    baseMessage = `Partial match. You have ${matchedCount}/${requiredCount} required skills.`;
  } else {
    baseMessage = `Limited match. You have ${matchedCount}/${requiredCount} required skills.`;
  }

  const parts: string[] = [baseMessage];

  // Add missing skills note
  if (missingSkills.length > 0) {
    parts.push(`Missing skills: ${missingSkills.slice(0, 3).join(', ')}${missingSkills.length > 3 ? '...' : ''}.`);
  }

  // Add language note if missing
  if (missingLanguage && requiredLang) {
    parts.push(`Language: You have ${userLang}, but ${requiredLang} is required.`);
  }

  return parts.join(' ');
}

/**
 * Filter and sort jobs by match score (non-AI)
 */
export function filterAndSortJobsByMatch(
  jobs: Array<{ id: string; [key: string]: any }>,
  userSkills: UserSkill[],
  userLanguageLevel: string,
  matchFunction: (job: any) => MatchResult
): Array<{ job: any; match: MatchResult }> {
  return jobs
    .map(job => ({
      job,
      match: matchFunction(job),
    }))
    .filter(item => item.match.matchScore > 0) // Only show jobs with some match
    .sort((a, b) => b.match.matchScore - a.match.matchScore); // Sort by match score
}

/**
 * Extract skills from text (simple keyword extraction, non-AI)
 */
export function extractSkillsFromText(text: string): string[] {
  // Common skill keywords
  const skillKeywords = [
    'communication', 'teamwork', 'leadership', 'problem solving', 'analytical',
    'customer service', 'sales', 'marketing', 'design', 'development',
    'programming', 'coding', 'management', 'administration', 'teaching',
    'cooking', 'barista', 'care', 'nursing', 'healthcare', 'education',
    'language', 'translation', 'writing', 'editing', 'research',
  ];

  const textLower = text.toLowerCase();
  const foundSkills: string[] = [];

  skillKeywords.forEach(skill => {
    if (textLower.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  return foundSkills;
}

