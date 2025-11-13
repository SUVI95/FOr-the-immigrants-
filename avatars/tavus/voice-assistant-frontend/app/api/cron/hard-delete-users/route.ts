import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Scheduled job to process hard deletes for users past retention period
 * 
 * This should be called daily via:
 * - Vercel Cron Jobs (vercel.json)
 * - External cron service (cron-job.org, etc.)
 * - Server cron job
 * 
 * Security: Should be protected with a secret token
 */
export async function GET(request: Request) {
  try {
    // Security: Check for secret token
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find users ready for hard delete (deleted_at < NOW())
    const usersToDelete = await query<{ id: string }>(
      "SELECT id FROM users WHERE deleted_at < NOW() AND deleted_at IS NOT NULL AND data_deletion_requested = true"
    );

    const deletedUsers: string[] = [];
    const errors: string[] = [];

    // Process each user
    for (const user of usersToDelete.rows) {
      try {
        // Call the hard_delete_user function
        await query("SELECT hard_delete_user($1)", [user.id]);
        deletedUsers.push(user.id);
      } catch (error) {
        console.error(`Error deleting user ${user.id}:`, error);
        errors.push(user.id);
      }
    }

    // Log the cron job execution
    await query(
      "INSERT INTO audit_logs (action, resource, result, metadata) VALUES ($1, $2, $3, $4)",
      [
        "cron_hard_delete",
        "user_data",
        errors.length === 0 ? "success" : "partial_success",
        JSON.stringify({
          deleted_count: deletedUsers.length,
          error_count: errors.length,
          deleted_users: deletedUsers,
          errors: errors,
          executed_at: new Date().toISOString(),
        }),
      ]
    );

    return NextResponse.json({
      success: true,
      message: `Processed ${deletedUsers.length} user deletions`,
      deleted_users: deletedUsers.length,
      errors: errors.length,
      details: {
        deleted: deletedUsers,
        errors: errors,
      },
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Failed to process hard deletes", details: String(error) },
      { status: 500 }
    );
  }
}

