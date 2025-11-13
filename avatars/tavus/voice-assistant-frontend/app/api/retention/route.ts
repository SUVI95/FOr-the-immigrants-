import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Retention Tracking API
 * EU AI Act Classification: NOT AN AI SYSTEM (No Risk)
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const result = await query(
      `SELECT id, job_id, company_name, start_date, check_in_1_month, check_in_3_month,
              check_in_12_month, retention_status, left_date, left_reason
       FROM retention_tracking
       WHERE user_id = $1
       ORDER BY start_date DESC`,
      [userId]
    );

    return NextResponse.json({
      records: result.rows.map((row: any) => ({
        id: row.id,
        jobId: row.job_id,
        companyName: row.company_name,
        startDate: row.start_date,
        checkIn1Month: row.check_in_1_month,
        checkIn3Month: row.check_in_3_month,
        checkIn12Month: row.check_in_12_month,
        retentionStatus: row.retention_status,
        leftDate: row.left_date,
        leftReason: row.left_reason,
      })),
    });
  } catch (error) {
    console.error("Get retention records error:", error);
    return NextResponse.json({ error: "Failed to get retention records" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, jobId, companyName, startDate } = await request.json();

    if (!userId || !companyName || !startDate) {
      return NextResponse.json({ error: "User ID, company name, and start date required" }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO retention_tracking (user_id, job_id, company_name, start_date, retention_status)
       VALUES ($1, $2, $3, $4, 'active')
       RETURNING id, retention_status`,
      [userId, jobId || null, companyName, startDate]
    );

    return NextResponse.json({
      recordId: result.rows[0].id,
      status: result.rows[0].retention_status,
      message: "Retention record created successfully",
    });
  } catch (error) {
    console.error("Create retention record error:", error);
    return NextResponse.json({ error: "Failed to create retention record" }, { status: 500 });
  }
}

