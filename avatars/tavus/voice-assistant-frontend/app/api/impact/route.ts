import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Impact Metrics API
 * EU AI Act Classification: NOT AN AI SYSTEM (No Risk)
 * 
 * Provides aggregated metrics for users and municipalities
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const municipality = searchParams.get("municipality") === "true";

    if (!userId && !municipality) {
      return NextResponse.json({ error: "User ID or municipality flag required" }, { status: 400 });
    }

    if (municipality) {
      // Municipality aggregate metrics
      const [
        jobPlacementsResult,
        languageProgressResult,
        skillsGainedResult,
        retentionResult,
        timeToEmploymentResult,
        recognitionResult,
      ] = await Promise.all([
        query(`SELECT COUNT(*) as count FROM job_matches WHERE user_applied_at IS NOT NULL`),
        query(`SELECT AVG(CAST(metric_value AS NUMERIC)) as avg FROM impact_metrics WHERE metric_type = 'language_progress'`),
        query(`SELECT COUNT(DISTINCT jsonb_array_elements_text(skills)) as count FROM skills_profiles`),
        query(`SELECT 
                 COUNT(CASE WHEN retention_status = 'active' THEN 1 END)::float / 
                 NULLIF(COUNT(*), 0) * 100 as rate 
               FROM retention_tracking`),
        query(`SELECT AVG(EXTRACT(EPOCH FROM (user_applied_at - created_at)) / 86400) as avg_days
               FROM job_matches WHERE user_applied_at IS NOT NULL`),
        query(`SELECT COUNT(*) as count FROM oph_recognition_requests`),
      ]);

      return NextResponse.json({
        metrics: {
          jobPlacements: parseInt(jobPlacementsResult.rows[0]?.count || "0"),
          languageProgress: Math.round(parseFloat(languageProgressResult.rows[0]?.avg || "0")),
          skillsGained: parseInt(skillsGainedResult.rows[0]?.count || "0"),
          retentionRate: Math.round(parseFloat(retentionResult.rows[0]?.rate || "0")),
          averageTimeToEmployment: Math.round(parseFloat(timeToEmploymentResult.rows[0]?.avg_days || "0")),
          recognitionRequests: parseInt(recognitionResult.rows[0]?.count || "0"),
        },
        viewMode: "municipality",
      });
    } else {
      // User-specific metrics
      const [
        jobPlacementsResult,
        languageProgressResult,
        skillsResult,
        retentionResult,
      ] = await Promise.all([
        query(`SELECT COUNT(*) as count FROM job_matches WHERE user_id = $1 AND user_applied_at IS NOT NULL`, [userId]),
        query(`SELECT AVG(CAST(metric_value AS NUMERIC)) as avg FROM impact_metrics WHERE user_id = $1 AND metric_type = 'language_progress'`, [userId]),
        query(`SELECT jsonb_array_length(skills) as count FROM skills_profiles WHERE user_id = $1`, [userId]),
        query(`SELECT 
                 COUNT(CASE WHEN retention_status = 'active' THEN 1 END)::float / 
                 NULLIF(COUNT(*), 0) * 100 as rate 
               FROM retention_tracking WHERE user_id = $1`, [userId]),
      ]);

      return NextResponse.json({
        metrics: {
          jobPlacements: parseInt(jobPlacementsResult.rows[0]?.count || "0"),
          languageProgress: Math.round(parseFloat(languageProgressResult.rows[0]?.avg || "0")),
          skillsGained: parseInt(skillsResult.rows[0]?.count || "0"),
          retentionRate: Math.round(parseFloat(retentionResult.rows[0]?.rate || "0")),
          averageTimeToEmployment: 0, // Not shown for user view
          recognitionRequests: 0, // Not shown for user view
        },
        viewMode: "user",
      });
    }
  } catch (error) {
    console.error("Get impact metrics error:", error);
    return NextResponse.json({ error: "Failed to get impact metrics" }, { status: 500 });
  }
}

