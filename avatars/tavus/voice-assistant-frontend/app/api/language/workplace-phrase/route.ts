import { NextResponse } from "next/server";
import { sanitizeUserInput, pseudonymizeUserId } from "@/lib/security";
import { logAIInteractionServer } from "@/lib/db-utils-server";

export const dynamic = "force-dynamic";

/**
 * Workplace Phrase Suggestion API (Limited Risk AI)
 * Suggests workplace phrases based on context
 */
export async function POST(request: Request) {
  try {
    const { text, context, userId } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    // Sanitize input
    const sanitizedText = sanitizeUserInput(text);
    const userHash = userId ? pseudonymizeUserId(userId) : "anonymous";

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
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
            content: `You are a Finnish language coach for workplace situations.
            Suggest a helpful Finnish phrase for the workplace context.
            Keep it short (1-2 sentences max).
            Provide the phrase in Finnish with English translation in parentheses.
            Do not request or store personal information.`,
          },
          {
            role: "user",
            content: `Context: ${context || "workplace"}. User said: "${sanitizedText}". Suggest a helpful Finnish phrase.`,
          },
        ],
        max_tokens: 100,
        temperature: 0.7,
        user: userHash,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error");
      return NextResponse.json({ error: "Phrase suggestion unavailable" }, { status: 500 });
    }

    const data = await response.json();
    const phrase = data?.choices?.[0]?.message?.content || "Hei, voisitko auttaa minua? (Hi, could you help me?)";

    // Log interaction (anonymized)
    if (userId) {
      await logAIInteractionServer({
        userHash,
        topic: "workplace-language",
        messageLength: sanitizedText.length,
        timestamp: new Date(),
        status: "success",
      });
    }

    return NextResponse.json({ phrase });
  } catch (error) {
    console.error("Workplace phrase error:", error);
    return NextResponse.json({ error: "Failed to get phrase" }, { status: 500 });
  }
}

