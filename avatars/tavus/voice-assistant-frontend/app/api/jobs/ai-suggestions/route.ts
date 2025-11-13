import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { pseudonymizeUserId, sanitizeUserInput } from "@/lib/security";

export const dynamic = "force-dynamic";

/**
 * AI Job Suggestions API (LOW-RISK AI)
 * EU AI Act Classification: Limited Risk (Article 50)
 * 
 * This endpoint uses AI ONLY for suggestions and explanations.
 * It does NOT make matching decisions - those are done by the non-AI matching engine.
 * 
 * Purpose: Help users understand opportunities and get personalized suggestions.
 * User always decides which jobs to apply for.
 */
export async function POST(request: Request) {
  try {
    const { userId, jobIds, userSkills, userLanguageLevel } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Get job details
    const jobsResult = await query(
      `SELECT id, title, company, field, description, requirements, required_skills
       FROM job_opportunities
       WHERE is_active = TRUE AND id = ANY($1::uuid[])
       LIMIT 10`,
      [jobIds || []]
    );

    if (jobsResult.rows.length === 0) {
      return NextResponse.json({ suggestions: [] });
    }

    // Prepare data for AI (sanitized)
    const sanitizedSkills = (userSkills || []).map((s: string) => sanitizeUserInput(s));
    const jobsData = jobsResult.rows.map((job: any) => ({
      title: sanitizeUserInput(job.title),
      company: sanitizeUserInput(job.company),
      field: sanitizeUserInput(job.field || ""),
      description: sanitizeUserInput(job.description || "").substring(0, 200),
      requiredSkills: (job.required_skills || []).map((s: string) => sanitizeUserInput(s)),
    }));

    // AI Analysis (LOW-RISK: Suggestions only, not decisions)
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
            content: `You are a job discovery assistant. Your role is to provide helpful SUGGESTIONS and EXPLANATIONS to help users understand job opportunities.

IMPORTANT RULES:
1. You do NOT make hiring decisions
2. You do NOT filter or rank jobs
3. You ONLY provide informational suggestions and explanations
4. The user always decides which jobs to explore
5. Be transparent about why a job might be interesting
6. Suggest skills they might want to develop
7. Explain how their current skills relate to job requirements

This is a LOW-RISK AI system for user empowerment, not employment decisions.`,
          },
          {
            role: "user",
            content: `User skills: ${JSON.stringify(sanitizedSkills)}
User language level: ${userLanguageLevel || "A0"}

Jobs to analyze:
${JSON.stringify(jobsData)}

Provide personalized suggestions for each job:
- Why this job might be interesting for this user
- How their skills relate to requirements
- What skills they might want to develop
- Any tips for applying

Format as JSON array with one suggestion per job.`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
        user: userHash,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error");
      return NextResponse.json({ 
        suggestions: [],
        message: "AI suggestions temporarily unavailable. You can still browse all jobs."
      });
    }

    const data = await response.json();
    const suggestionsText = data?.choices?.[0]?.message?.content || "";

    // Parse suggestions (simple JSON extraction)
    let suggestions: any[] = [];
    try {
      // Try to extract JSON from response
      const jsonMatch = suggestionsText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: create suggestions from text
        suggestions = jobsData.map((job, idx) => ({
          jobId: jobsResult.rows[idx].id,
          suggestion: suggestionsText.substring(0, 200),
          type: "ai_suggestion",
        }));
      }
    } catch (error) {
      console.error("Failed to parse AI suggestions:", error);
      // Return empty suggestions - user can still use non-AI matching
      suggestions = [];
    }

    // Ensure each suggestion has a jobId
    suggestions = suggestions.map((suggestion, idx) => ({
      ...suggestion,
      jobId: suggestion.jobId || jobsResult.rows[idx]?.id,
      type: "ai_suggestion",
      disclaimer: "This is an AI-generated suggestion for informational purposes only. You decide which jobs to apply for.",
    }));

    return NextResponse.json({
      suggestions,
      disclaimer: "AI suggestions are for informational purposes only. Job matching is done by non-AI rule-based algorithm. You always decide which jobs to explore.",
    });
  } catch (error) {
    console.error("AI suggestions error:", error);
    return NextResponse.json({ 
      suggestions: [],
      message: "AI suggestions temporarily unavailable. You can still browse all jobs using the rule-based matching."
    });
  }
}

