import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Research Consent API
 * Records user consent for research participation
 */
export async function POST(request: Request) {
  try {
    const { userId, researchModule, consented } = await request.json();

    if (!userId || !researchModule) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (consented) {
      // Record consent
      await query(
        `INSERT INTO research_participants (user_id, research_module, consented_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id, research_module) DO UPDATE SET
           consented_at = NOW(),
           opted_out_at = NULL`,
        [userId, researchModule]
      );

      // Log in audit trail
      await query(
        `INSERT INTO audit_logs (user_id, action, resource, result, metadata)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          userId,
          "research_consent",
          "research_participation",
          "success",
          JSON.stringify({ researchModule, consentedAt: new Date().toISOString() }),
        ]
      );
    } else {
      // Record opt-out
      await query(
        `UPDATE research_participants
         SET opted_out_at = NOW()
         WHERE user_id = $1 AND research_module = $2`,
        [userId, researchModule]
      );
    }

    return NextResponse.json({ success: true, consented });
  } catch (error) {
    console.error("Research consent error:", error);
    return NextResponse.json({ error: "Failed to record consent" }, { status: 500 });
  }
}

