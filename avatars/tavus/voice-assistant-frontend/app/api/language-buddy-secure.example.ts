/**
 * SECURE VERSION - Language Buddy API Route
 * 
 * This is an example implementation showing:
 * - GDPR compliance
 * - Data minimization
 * - User consent checking
 * - Pseudonymization
 * - Audit logging
 * 
 * Replace the current route.ts with this implementation
 * after adding necessary database functions.
 */

import { NextResponse } from "next/server";
import crypto from "crypto";

const TOPIC_PROMPTS: Record<string, string> = {
  job_interview:
    "You are a friendly Finnish job interviewer helping a newcomer prepare for entry-level roles. Respond in Finnish first, followed by a short English hint in parentheses. Keep answers concise (max 2 sentences). Do not request or store personal information.",
  doctor_visit:
    "You are a Finnish nurse helping a patient explain symptoms. Respond in simple Finnish with key vocabulary and an English hint in parentheses. Keep answers concise (max 2 sentences). Do not request or store personal information.",
  everyday:
    "You are a Finnish friend practicing everyday conversation (supermarket, bus, school). Answer in easy Finnish first, then give an English hint in parentheses. Short answers only (max 2 sentences). Do not request or store personal information.",
  housing:
    "You are a housing advisor in Kajaani. Help the learner deal with landlords, DVV, and rental issues. Respond in Finnish first, then add an English hint in parentheses. Short answers (max 2 sentences). Do not request or store personal information.",
};

/**
 * Pseudonymize user ID for OpenAI API
 * Uses SHA-256 hash (one-way, cannot be reversed)
 */
function pseudonymizeUserId(userId: string): string {
  return crypto.createHash('sha256').update(userId).digest('hex').substring(0, 16);
}

/**
 * Sanitize user input to remove PII (Personally Identifiable Information)
 */
function sanitizeUserInput(input: string): string {
  let sanitized = input;
  
  // Remove email addresses
  sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi, '[EMAIL]');
  
  // Remove phone numbers (Finnish and international formats)
  sanitized = sanitized.replace(/\b(?:\+358|0)[\s-]?\d{2,3}[\s-]?\d{3,4}[\s-]?\d{2,4}\b/g, '[PHONE]');
  sanitized = sanitized.replace(/\b\d{10,}\b/g, '[PHONE]');
  
  // Remove potential addresses
  sanitized = sanitized.replace(/\b\d+\s+[A-Za-z\s]+(?:Street|Avenue|Road|Katu|Tie|Kuja)\b/gi, '[ADDRESS]');
  
  // Remove potential names (basic - can be improved)
  // Note: This is a simple implementation. For production, use a more sophisticated approach.
  
  return sanitized.trim();
}

/**
 * Check if user has given consent for AI processing
 * TODO: Implement database query
 */
async function checkUserConsent(userId: string): Promise<boolean> {
  // TODO: Query database to check:
  // - gdpr_consent = true
  // - ai_processing_consent = true
  // - data_deletion_requested = false
  
  // For now, return true (assumes consent given)
  // In production, implement proper database check
  return true;
}

/**
 * Log AI interaction for audit trail (pseudonymized)
 * TODO: Implement database logging
 */
async function logAIInteraction(data: {
  userHash: string;
  topic: string;
  messageLength: number;
  tokensUsed?: number;
  timestamp: Date;
  status: 'success' | 'error';
}) {
  // TODO: Insert into ai_interaction_logs table
  console.log('AI Interaction Log:', {
    userHash: data.userHash,
    topic: data.topic,
    messageLength: data.messageLength,
    tokensUsed: data.tokensUsed,
    timestamp: data.timestamp.toISOString(),
    status: data.status,
  });
}

export async function POST(request: Request) {
  try {
    const { topic, message, userId } = await request.json();

    // ✅ Validate input
    if (!topic || typeof topic !== "string" || !TOPIC_PROMPTS[topic]) {
      return NextResponse.json({ error: "Unknown topic" }, { status: 400 });
    }
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }
    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    // ✅ Check user consent
    const hasConsent = await checkUserConsent(userId);
    if (!hasConsent) {
      return NextResponse.json(
        {
          error: "AI processing consent required",
          consent_url: "/privacy",
          message: "Please provide consent for AI processing in your privacy settings.",
        },
        { status: 403 }
      );
    }

    // ✅ Sanitize user input (remove PII)
    const sanitizedMessage = sanitizeUserInput(message);
    
    // ✅ Pseudonymize user ID
    const userHash = pseudonymizeUserId(userId);

    // ✅ Log interaction start (for audit)
    await logAIInteraction({
      userHash,
      topic,
      messageLength: sanitizedMessage.length,
      timestamp: new Date(),
      status: 'success',
    });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OpenAI API key not configured");
      return NextResponse.json(
        { error: "Service configuration error" },
        { status: 500 }
      );
    }

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
            content: `${TOPIC_PROMPTS[topic]}\n\nIMPORTANT: Do not request, store, or log personal information such as names, addresses, phone numbers, or email addresses.`,
          },
          {
            role: "user",
            content: sanitizedMessage,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
        user: userHash, // ✅ Pseudonymized user ID for OpenAI DPA compliance
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      // ✅ Don't log sensitive error details
      console.error("OpenAI API error");
      
      await logAIInteraction({
        userHash,
        topic,
        messageLength: sanitizedMessage.length,
        timestamp: new Date(),
        status: 'error',
      });
      
      return NextResponse.json(
        { error: "AI service temporarily unavailable. Please try again later." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const output = data?.choices?.[0]?.message?.content ?? "Anteeksi, en ymmärtänyt. Kokeillaan uudelleen.";

    // ✅ Log successful interaction
    await logAIInteraction({
      userHash,
      topic,
      messageLength: sanitizedMessage.length,
      tokensUsed: data.usage?.total_tokens,
      timestamp: new Date(),
      status: 'success',
    });

    return NextResponse.json({ reply: output });
  } catch (error) {
    // ✅ Generic error message (no sensitive data exposure)
    console.error("Language buddy error");
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again later." },
      { status: 500 }
    );
  }
}

