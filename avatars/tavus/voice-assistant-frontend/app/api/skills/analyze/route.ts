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
            content: `You are a skills analysis assistant. Help users understand their skills profile.
            Extract skills from their qualifications and experience.
            Return skills in ESCO (European Skills Framework) format.
            Do NOT make job recommendations. Only analyze and explain skills.
            This is for user empowerment, not employment decisions.`,
          },
          {
            role: "user",
            content: `Analyze these skills and qualifications: ${JSON.stringify(sanitizedData)}`,
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

    // Parse skills from AI response (simple extraction)
    const skills = extractSkillsFromAnalysis(analysisText);

    // Save analysis to database
    await query(
      `INSERT INTO skills_analyses (user_id, skills, analysis_result, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id) DO UPDATE SET
         skills = $2,
         analysis_result = $3,
         updated_at = NOW()`,
      [userId, JSON.stringify(skills), JSON.stringify({ analysis: analysisText, timestamp: new Date() })]
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

