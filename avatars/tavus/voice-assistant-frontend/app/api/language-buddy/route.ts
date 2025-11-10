import { NextResponse } from "next/server";

const TOPIC_PROMPTS: Record<string, string> = {
  job_interview:
    "You are a friendly Finnish job interviewer helping a newcomer prepare for entry-level roles. Respond in Finnish first, followed by a short English hint in parentheses. Keep answers concise (max 2 sentences).",
  doctor_visit:
    "You are a Finnish nurse helping a patient explain symptoms. Respond in simple Finnish with key vocabulary and an English hint in parentheses. Keep answers concise (max 2 sentences).",
  everyday:
    "You are a Finnish friend practicing everyday conversation (supermarket, bus, school). Answer in easy Finnish first, then give an English hint in parentheses. Short answers only (max 2 sentences).",
  housing:
    "You are a housing advisor in Kajaani. Help the learner deal with landlords, DVV, and rental issues. Respond in Finnish first, then add an English hint in parentheses. Short answers (max 2 sentences).",
};

export async function POST(request: Request) {
  try {
    const { topic, message } = await request.json();

    if (!topic || typeof topic !== "string" || !TOPIC_PROMPTS[topic]) {
      return NextResponse.json({ error: "Unknown topic" }, { status: 400 });
    }
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
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
            content: TOPIC_PROMPTS[topic],
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI error", err);
      return NextResponse.json({ error: "OpenAI request failed" }, { status: 500 });
    }

    const data = await response.json();
    const output = data?.choices?.[0]?.message?.content ?? "Anteeksi, en ymmärtänyt. Kokeillaan uudelleen.";

    return NextResponse.json({ reply: output });
  } catch (error) {
    console.error("Language buddy error", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
