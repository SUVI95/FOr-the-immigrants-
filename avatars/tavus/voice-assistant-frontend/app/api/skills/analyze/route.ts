import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { pseudonymizeUserId, sanitizeUserInput } from "@/lib/security";

export const dynamic = "force-dynamic";

/**
 * Skills Analysis API (LOW-RISK AI)
 * Analyzes user skills for job discovery (informational only)
 */
export async function POST(request: Request) {
  try {
    const { userId, qualifications, workExperience } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Get user's existing skills from database
    const userSkills = await query(
      "SELECT skills FROM skills_profiles WHERE user_id = $1",
      [userId]
    );

    // Get user profile for context
    const userProfile = await query(
      "SELECT name, country, language_level FROM users WHERE id = $1",
      [userId]
    );

    // Prepare skills data for AI analysis
    const skillsData = {
      existingSkills: userSkills.rows[0]?.skills || [],
      qualifications: qualifications || [],
      workExperience: workExperience || [],
      languageLevel: userProfile.rows[0]?.language_level || "A0",
    };

    // Sanitize input before sending to AI
    const sanitizedData = {
      ...skillsData,
      qualifications: skillsData.qualifications.map((q: string) => sanitizeUserInput(q)),
      workExperience: skillsData.workExperience.map((exp: string) => sanitizeUserInput(exp)),
    };

    // AI Skills Analysis (LOW-RISK: Educational/Informational)
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
    }

    const userHash = pseudonymizeUserId(userId);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a skills analysis assistant (LOW-RISK AI - Article 50 EU AI Act).
            Your role is to help users understand their skills profile.

            IMPORTANT RULES:
            1. Extract skills from qualifications and experience
            2. Map skills to ESCO (European Skills, Competences, Qualifications and Occupations) framework when possible
            3. Provide skills in format: {skill: string, esco_code?: string, level?: string, source: string}
            4. Do NOT make job recommendations or hiring decisions
            5. Only analyze and explain skills for user empowerment
            6. Be transparent that this is informational only

            ESCO Framework: Use ESCO skill codes when you can identify them (e.g., "S1.1" for communication skills).
            If you cannot identify ESCO codes, provide skill names and note that ESCO mapping may be available.

            This is for user empowerment, not employment decisions.`,
          },
          {
            role: "user",
            content: `Analyze these skills and qualifications. Extract skills and map to ESCO framework when possible.

            User data: ${JSON.stringify(sanitizedData)}

            Return a JSON object with:
            {
              "skills": [{"skill": "string", "esco_code": "string (optional)", "level": "beginner|intermediate|advanced|expert", "source": "qualification|work_experience|volunteering|learning"}],
              "analysis": "text explanation of skills profile",
              "esco_mapping_notes": "notes about ESCO framework mapping"
            }`,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
        user: userHash,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error");
      return NextResponse.json({ error: "AI analysis temporarily unavailable" }, { status: 500 });
    }

    const data = await response.json();
    const analysisText = data?.choices?.[0]?.message?.content || "";

    // Parse skills from AI response (try JSON first, then fallback)
    let skills: any[] = [];
    let analysis = analysisText;
    let escoMappingNotes = "";

    try {
      // Try to parse as JSON
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        skills = parsed.skills || [];
        analysis = parsed.analysis || analysisText;
        escoMappingNotes = parsed.esco_mapping_notes || "";
      } else {
        // Fallback to simple extraction
        skills = extractSkillsFromAnalysis(analysisText);
      }
    } catch (error) {
      console.error("Failed to parse AI response as JSON, using fallback:", error);
      skills = extractSkillsFromAnalysis(analysisText);
    }

    // Ensure skills have required format
    skills = skills.map((skill: any) => {
      if (typeof skill === "string") {
        return { skill, source: "qualification", level: "intermediate" };
      }
      return {
        skill: skill.skill || skill.name || "Unknown",
        esco_code: skill.esco_code,
        level: skill.level || "intermediate",
        source: skill.source || "qualification",
      };
    });

    // Extract ESCO codes for separate storage
    const escoSkills = skills
      .filter((s: any) => s.esco_code)
      .map((s: any) => s.esco_code);

    // Save to skills_profiles table
    await query(
      `INSERT INTO skills_profiles (user_id, skills, esco_skills, language_level, last_analyzed_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id) DO UPDATE SET
         skills = $2,
         esco_skills = $3,
         language_level = $4,
         last_analyzed_at = NOW(),
         updated_at = NOW()`,
      [
        userId,
        JSON.stringify(skills),
        escoSkills,
        skillsData.languageLevel,
      ]
    );

    // Save analysis to database
    await query(
      `INSERT INTO skills_analyses (user_id, skills, analysis_result, ai_suggestions, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_id) DO UPDATE SET
         skills = $2,
         analysis_result = $3,
         ai_suggestions = $4,
         updated_at = NOW()`,
      [
        userId,
        JSON.stringify(skills),
        JSON.stringify({ analysis, escoMappingNotes, timestamp: new Date() }),
        JSON.stringify({ suggestions: [], timestamp: new Date() }), // AI suggestions stored separately
      ]
    );

    // Log research data (anonymized)
    await query(
      `INSERT INTO research_data (user_hash, research_module, metric_name, metric_value, collected_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [
        userHash,
        "skills-discovery",
        "skills_analysis",
        JSON.stringify({ skillCount: skills.length, timestamp: new Date() }),
      ]
    );

    return NextResponse.json({
      skills,
      analysis: analysisText,
      explanation: "This is an AI-generated analysis to help you understand your skills profile. You decide how to use this information.",
    });
  } catch (error) {
    console.error("Skills analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze skills" }, { status: 500 });
  }
}

function extractSkillsFromAnalysis(analysisText: string): string[] {
  // Simple extraction - in production, use more sophisticated parsing
  const skills: string[] = [];
  const skillPatterns = [
    /(?:skill|ability|competence)[\s:]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:skill|proficiency|expertise)/gi,
  ];

  skillPatterns.forEach((pattern) => {
    const matches = analysisText.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && !skills.includes(match[1])) {
        skills.push(match[1]);
      }
    }
  });

  return skills.slice(0, 20); // Limit to 20 skills
}

