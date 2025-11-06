import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL; // e.g. wss://xyz.livekit.cloud

export const revalidate = 0;

export async function POST(request: Request) {
  try {
    if (!API_KEY || !API_SECRET || !LIVEKIT_URL) {
      throw new Error("LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET must be set");
    }

    const { roomName } = await request.json();
    if (!roomName || typeof roomName !== "string") {
      return new NextResponse("roomName is required", { status: 400 });
    }

    // Convert ws(s) -> http(s) for REST
    const base = LIVEKIT_URL.replace(/^wss:/, "https:").replace(/^ws:/, "http:");
    const url = `${base}/agents/jobs`;

    // Create Bearer token signed with API secret; issuer is API key
    const bearer = jwt.sign({}, API_SECRET, {
      issuer: API_KEY,
      expiresIn: "5m",
      algorithm: "HS256",
    });

    // Minimal job request targeting the room by name
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearer}`,
      },
      body: JSON.stringify({
        input: { room: { name: roomName } },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return new NextResponse(`Dispatch failed: ${res.status} ${text}`, { status: 500 });
    }

    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await res.json();
      return NextResponse.json(data, { headers: new Headers({ "Cache-Control": "no-store" }) });
    }
    const text = await res.text();
    return new NextResponse(text, { status: 200, headers: new Headers({ "Cache-Control": "no-store" }) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new NextResponse(msg, { status: 500 });
  }
}


