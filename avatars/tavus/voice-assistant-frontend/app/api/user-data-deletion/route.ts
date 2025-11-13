import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GDPR Article 17: Right to Erasure
 * Handles user data deletion requests
 * 
 * Implementation:
 * 1. Soft delete (mark as deleted, retain for 30 days for legal requirements)
 * 2. Anonymize logs and interactions
 * 3. Schedule hard delete after retention period
 */
export async function POST(request: Request) {
  try {
    const { userId, confirmDeletion } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required. Please log in to delete your data." },
        { status: 401 }
      );
    }

    if (!confirmDeletion) {
      return NextResponse.json(
        {
          error: "Confirmation required",
          message: "Please confirm that you want to delete all your data. This action cannot be undone.",
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const userCheck = await query("SELECT id, data_deletion_requested FROM users WHERE id = $1", [userId]);
    if (userCheck.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userCheck.rows[0].data_deletion_requested) {
      return NextResponse.json(
        {
          error: "Deletion already requested",
          message: "Your data deletion request is already in progress.",
        },
        { status: 400 }
      );
    }

    // Call the soft_delete_user function
    await query("SELECT soft_delete_user($1)", [userId]);

    // Get the deletion details
    const deletionInfo = await query(
      "SELECT data_deletion_requested_at, deleted_at FROM users WHERE id = $1",
      [userId]
    );

    const deletionDate = deletionInfo.rows[0]?.deleted_at;
    const requestedAt = deletionInfo.rows[0]?.data_deletion_requested_at;

    return NextResponse.json({
      success: true,
      message: "Your data deletion request has been processed.",
      details: {
        status: "pending",
        requested_at: requestedAt,
        estimated_completion: deletionDate ? new Date(deletionDate).toISOString() : "30 days",
        retention_period: "Data will be retained for 30 days for legal compliance, then permanently deleted.",
        what_happens_next: [
          "Your account is immediately deactivated",
          "AI processing is disabled for your account",
          "Your data will be anonymized within 24 hours",
          "Complete deletion will occur after 30 days",
        ],
        contact: "If you have questions, contact dpo@knuut.ai",
      },
    });
  } catch (error) {
    console.error("Data deletion error:", error);
    return NextResponse.json(
      { error: "Failed to process deletion request. Please try again later." },
      { status: 500 }
    );
  }
}

/**
 * Check deletion request status
 */
export async function GET(request: Request) {
  try {
    const userId = new URL(request.url).searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    const result = await query<{
      data_deletion_requested: boolean;
      data_deletion_requested_at: Date | null;
      deleted_at: Date | null;
    }>(
      "SELECT data_deletion_requested, data_deletion_requested_at, deleted_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = result.rows[0];

    return NextResponse.json({
      deletion_requested: user.data_deletion_requested ?? false,
      requested_at: user.data_deletion_requested_at ? new Date(user.data_deletion_requested_at).toISOString() : null,
      estimated_deletion_date: user.deleted_at ? new Date(user.deleted_at).toISOString() : null,
      status: user.data_deletion_requested ? "pending_deletion" : "active",
    });
  } catch (error) {
    console.error("Deletion status check error:", error);
    return NextResponse.json({ error: "Failed to check status" }, { status: 500 });
  }
}

