import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Get user skills from database
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const result = await query(
      "SELECT skills FROM skills_analyses WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ skills: [] });
    }

    const skills = result.rows[0].skills;
    return NextResponse.json({ skills: Array.isArray(skills) ? skills : JSON.parse(skills || "[]") });
  } catch (error) {
    console.error("Get skills error:", error);
    return NextResponse.json({ error: "Failed to get skills" }, { status: 500 });
  }
}

