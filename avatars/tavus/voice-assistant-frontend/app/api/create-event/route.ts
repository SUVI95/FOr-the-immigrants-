import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { title, description, event_date, location_name, location_lat, location_lng, group_id } = await request.json();

    if (!title || !description || !event_date || !location_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Call agent to create event
    // 3. Return success

    // For now, return success - the agent will handle creation via RPC
    return NextResponse.json({
      success: true,
      message: "Event creation request received",
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

