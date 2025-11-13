/**
 * Server-side database utilities for API routes
 * Connected to Neon PostgreSQL database
 */

import { query } from "./db";

/**
 * Check if user has given consent for AI processing
 */
export async function checkUserConsentServer(userId: string): Promise<{
  gdprConsent: boolean;
  aiProcessingConsent: boolean;
  dataDeletionRequested: boolean;
}> {
  try {
    const result = await query<{
      gdpr_consent: boolean;
      ai_processing_consent: boolean;
      data_deletion_requested: boolean;
    }>(
      "SELECT gdpr_consent, ai_processing_consent, data_deletion_requested FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      // User not found - return false for all (require explicit consent)
      return {
        gdprConsent: false,
        aiProcessingConsent: false,
        dataDeletionRequested: false,
      };
    }

    const user = result.rows[0];
    return {
      gdprConsent: user.gdpr_consent ?? false,
      aiProcessingConsent: user.ai_processing_consent ?? false,
      dataDeletionRequested: user.data_deletion_requested ?? false,
    };
  } catch (error) {
    console.error("Error checking user consent:", error);
    // On error, default to requiring consent (safer)
    return {
      gdprConsent: false,
      aiProcessingConsent: false,
      dataDeletionRequested: false,
    };
  }
}

/**
 * Log AI interaction for audit trail (server-side)
 */
export async function logAIInteractionServer(data: {
  userHash: string;
  topic: string;
  messageLength: number;
  tokensUsed?: number;
  timestamp: Date;
  status: "success" | "error";
}): Promise<void> {
  try {
    await query(
      `INSERT INTO ai_interaction_logs 
       (user_hash, topic, message_length, tokens_used, timestamp, status) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        data.userHash,
        data.topic,
        data.messageLength,
        data.tokensUsed ?? null,
        data.timestamp,
        data.status,
      ]
    );
  } catch (error) {
    // Log error but don't fail the request
    console.error("Error logging AI interaction:", error);
  }
}

