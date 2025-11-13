import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { calculateSkillsMatch, UserSkill } from "@/lib/skills-matching-engine";

export const dynamic = "force-dynamic";

/**
 * Non-AI Job Matching API
 * EU AI Act Classification: NOT AN AI SYSTEM (No Risk)
 * 
 * This endpoint uses rule-based matching only. AI is never used for matching decisions.
 * AI may be used separately for suggestions/explanations (LOW-RISK).
 */
export async function POST(request: Request) {
  try {
    const { userId, jobIds } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Get user skills profile
    const skillsResult = await query(
      `SELECT skills, esco_skills, language_level 
       FROM skills_profiles 
       WHERE user_id = $1`,
      [userId]
    );

    if (skillsResult.rows.length === 0) {
      return NextResponse.json({ 
        matches: [],
        message: "No skills profile found. Please complete skills analysis first."
      });
    }

    const userSkillsData = skillsResult.rows[0];
    const userSkills: UserSkill[] = Array.isArray(userSkillsData.skills)
      ? userSkillsData.skills
      : JSON.parse(userSkillsData.skills || "[]");
    
    const userLanguageLevel = userSkillsData.language_level || "A0";

    // Get job opportunities
    let jobsQuery = `
      SELECT id, title, company, field, city, language_requirement, job_type,
             description, requirements, required_skills, preferred_skills,
             language_level_required, xp_reward, deadline, application_link, tags
      FROM job_opportunities
      WHERE is_active = TRUE
    `;

    const queryParams: any[] = [];
    if (jobIds && Array.isArray(jobIds) && jobIds.length > 0) {
      jobsQuery += ` AND id = ANY($${queryParams.length + 1}::uuid[])`;
      queryParams.push(jobIds);
    }

    jobsQuery += ` ORDER BY created_at DESC LIMIT 100`;

    const jobsResult = await query(jobsQuery, queryParams);

    // Calculate matches using non-AI rule-based engine
    const matches = jobsResult.rows.map((job: any) => {
      const matchResult = calculateSkillsMatch(
        userSkills,
        {
          required_skills: job.required_skills || [],
          preferred_skills: job.preferred_skills || [],
          language_level: job.language_level_required,
          qualifications: job.requirements || [],
        },
        userLanguageLevel
      );

      return {
        jobId: job.id,
        job: {
          id: job.id,
          title: job.title,
          company: job.company,
          field: job.field,
          city: job.city,
          language: job.language_requirement,
          type: job.job_type,
          description: job.description,
          requirements: job.requirements || [],
          xpReward: job.xp_reward || 0,
          deadline: job.deadline,
          link: job.application_link,
          tags: job.tags || [],
        },
        match: matchResult,
      };
    });

    // Sort by match score (highest first)
    matches.sort((a, b) => b.match.matchScore - a.match.matchScore);

    // Save matches to database (for analytics)
    for (const match of matches.slice(0, 20)) { // Save top 20 matches
      await query(
        `INSERT INTO job_matches (user_id, job_id, match_score, matched_skills, missing_skills, match_breakdown, match_type)
         VALUES ($1, $2, $3, $4, $5, $6, 'rule_based')
         ON CONFLICT (user_id, job_id) DO UPDATE SET
           match_score = $3,
           matched_skills = $4,
           missing_skills = $5,
           match_breakdown = $6,
           updated_at = NOW()`,
        [
          userId,
          match.jobId,
          match.match.matchScore,
          match.match.matchedSkills,
          match.match.missingSkills,
          JSON.stringify(match.match.breakdown),
        ]
      );
    }

    return NextResponse.json({
      matches,
      totalJobs: jobsResult.rows.length,
      message: "Matches calculated using rule-based algorithm (non-AI). AI suggestions available separately.",
    });
  } catch (error) {
    console.error("Job matching error:", error);
    return NextResponse.json({ error: "Failed to calculate matches" }, { status: 500 });
  }
}

/**
 * GET endpoint to retrieve saved matches for a user
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const result = await query(
      `SELECT jm.*, jo.title, jo.company, jo.field, jo.city, jo.job_type, jo.description
       FROM job_matches jm
       JOIN job_opportunities jo ON jm.job_id = jo.id
       WHERE jm.user_id = $1 AND jo.is_active = TRUE
       ORDER BY jm.match_score DESC, jm.created_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    return NextResponse.json({
      matches: result.rows.map((row: any) => ({
        jobId: row.job_id,
        matchScore: row.match_score,
        matchedSkills: row.matched_skills || [],
        missingSkills: row.missing_skills || [],
        breakdown: row.match_breakdown,
        job: {
          title: row.title,
          company: row.company,
          field: row.field,
          city: row.city,
          type: row.job_type,
          description: row.description,
        },
        viewedAt: row.user_viewed_at,
        appliedAt: row.user_applied_at,
      })),
    });
  } catch (error) {
    console.error("Get matches error:", error);
    return NextResponse.json({ error: "Failed to get matches" }, { status: 500 });
  }
}

