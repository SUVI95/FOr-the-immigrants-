import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { pseudonymizeUserId } from "@/lib/security";

export const dynamic = "force-dynamic";

/**
 * GDPR Article 15: Right to Access
 * Exports all user data in JSON format
 */
export async function GET(request: Request) {
  try {
    // Get user ID from query parameter or header
    const userId = request.headers.get("x-user-id") || new URL(request.url).searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required. Please log in to export your data." },
        { status: 401 }
      );
    }

    // Fetch user profile
    const userResult = await query(
      "SELECT id, email, name, country, language_level, created_at, updated_at, gdpr_consent, gdpr_consent_date, ai_processing_consent, ai_processing_consent_date, data_deletion_requested FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userResult.rows[0];

    // Fetch user profile data
    const profileResult = await query(
      "SELECT * FROM user_profiles WHERE user_id = $1",
      [userId]
    );

    // Fetch integration progress
    const progressResult = await query(
      "SELECT * FROM integration_progress WHERE user_id = $1 ORDER BY current_month_start DESC",
      [userId]
    );

    // Fetch group memberships
    const groupsResult = await query(
      "SELECT g.*, gm.role, gm.joined_at FROM groups g JOIN group_members gm ON g.id = gm.group_id WHERE gm.user_id = $1",
      [userId]
    );

    // Fetch event RSVPs
    const eventsResult = await query(
      "SELECT e.*, er.status, er.rsvp_at FROM events e JOIN event_rsvps er ON e.id = er.event_id WHERE er.user_id = $1",
      [userId]
    );

    // Fetch usage tracking
    const usageResult = await query(
      "SELECT * FROM usage_tracking WHERE user_id = $1 ORDER BY timestamp DESC",
      [userId]
    );

    // Fetch AI interactions (pseudonymized)
    const userHash = pseudonymizeUserId(userId);
    const aiInteractionsResult = await query(
      "SELECT topic, message_length, tokens_used, model, status, timestamp FROM ai_interaction_logs WHERE user_hash = $1 ORDER BY timestamp DESC",
      [userHash]
    );

    // Fetch consent history
    const consentResult = await query(
      "SELECT * FROM consent_logs WHERE user_id = $1 ORDER BY consent_date DESC",
      [userId]
    );

    // Fetch audit logs for this user
    const auditResult = await query(
      "SELECT action, resource, result, metadata, created_at FROM audit_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100",
      [userId]
    );

    // Compile all data
    const userData = {
      profile: {
        id: user.id,
        email: user.email,
        name: user.name,
        country: user.country,
        language_level: user.language_level,
        created_at: user.created_at,
        updated_at: user.updated_at,
        profile_data: profileResult.rows[0] || null,
      },
      learning_history: {
        integration_progress: progressResult.rows,
        usage_tracking: usageResult.rows,
        total_minutes_used: usageResult.rows.reduce((sum, row) => sum + (row.minutes_used || 0), 0),
      },
      community_activity: {
        groups_joined: groupsResult.rows,
        events_rsvped: eventsResult.rows,
        total_groups: groupsResult.rows.length,
        total_events: eventsResult.rows.length,
      },
      ai_interactions: {
        interactions: aiInteractionsResult.rows,
        total_interactions: aiInteractionsResult.rows.length,
        topics_used: [...new Set(aiInteractionsResult.rows.map((r) => r.topic).filter(Boolean))],
        total_tokens_used: aiInteractionsResult.rows.reduce((sum, r) => sum + (r.tokens_used || 0), 0),
        note: "User IDs are pseudonymized in AI interaction logs for privacy",
      },
      consent_history: {
        current_consent: {
          gdpr_consent: user.gdpr_consent,
          gdpr_consent_date: user.gdpr_consent_date,
          ai_processing_consent: user.ai_processing_consent,
          ai_processing_consent_date: user.ai_processing_consent_date,
        },
        consent_logs: consentResult.rows,
        data_deletion_requested: user.data_deletion_requested,
      },
      audit_logs: {
        recent_actions: auditResult.rows,
        total_logged_actions: auditResult.rows.length,
      },
      export_metadata: {
        exported_at: new Date().toISOString(),
        format_version: "1.0",
        data_categories: ["profile", "learning", "community", "ai_interactions", "consent", "audit"],
        user_id: userId,
      },
    };

    // Log the export
    await query(
      "INSERT INTO data_exports (user_id, exported_at, format, data_categories) VALUES ($1, NOW(), $2, $3)",
      [userId, "json", ["profile", "learning", "community", "ai_interactions", "consent", "audit"]]
    );

    // Log in audit trail
    await query(
      "INSERT INTO audit_logs (user_id, action, resource, result, metadata) VALUES ($1, $2, $3, $4, $5)",
      [
        userId,
        "data_export",
        "user_data",
        "success",
        JSON.stringify({ exported_at: new Date().toISOString(), format: "json" }),
      ]
    );

    return NextResponse.json(userData, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="knuut-data-export-${userId}-${Date.now()}.json"`,
      },
    });
  } catch (error) {
    console.error("Data export error:", error);
    return NextResponse.json(
      { error: "Failed to export data. Please try again later." },
      { status: 500 }
    );
  }
}

