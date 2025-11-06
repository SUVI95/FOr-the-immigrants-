import { NextRequest, NextResponse } from "next/server";

// Basic content moderation - check for inappropriate content
function moderateContent(content: string): { approved: boolean; reason?: string } {
  const lowerContent = content.toLowerCase();
  
  // List of inappropriate keywords (simplified - in production, use a proper moderation service)
  const inappropriateWords = [
    "spam", "scam", "fraud", // Add more as needed
  ];
  
  // Check for spam patterns
  if (lowerContent.length < 10) {
    return { approved: false, reason: "Message is too short" };
  }
  
  if (lowerContent.length > 2000) {
    return { approved: false, reason: "Message is too long" };
  }
  
  // Check for inappropriate words
  for (const word of inappropriateWords) {
    if (lowerContent.includes(word)) {
      return { approved: false, reason: "Message contains inappropriate content" };
    }
  }
  
  // Check for excessive links (potential spam)
  const linkPattern = /https?:\/\/[^\s]+/g;
  const links = lowerContent.match(linkPattern);
  if (links && links.length > 3) {
    return { approved: false, reason: "Too many links in message" };
  }
  
  return { approved: true };
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.exchange_id || !data.your_name || !data.your_email || !data.message || !data.privacy_consent) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Content moderation
    const moderation = moderateContent(data.message);
    if (!moderation.approved) {
      return NextResponse.json(
        { 
          error: "Message rejected by moderation",
          reason: moderation.reason 
        },
        { status: 400 }
      );
    }

    // TODO: Save to database with "pending" status
    // Example database operation:
    // const contactRequest = await db.skills_exchange_contacts.insert({
    //   exchange_id: data.exchange_id,
    //   contact_name: data.your_name,
    //   contact_email: data.your_email,
    //   contact_phone: data.your_phone,
    //   message: data.message,
    //   contact_skills: data.your_skills,
    //   submitted_at: new Date(),
    //   status: "pending", // pending, approved, rejected, completed
    //   privacy_consent: data.privacy_consent,
    // });

    // TODO: Get the exchange poster's information from database
    // const exchange = await db.skills_exchanges.findById(data.exchange_id);
    // const posterEmail = exchange.poster_email;
    // const posterName = exchange.poster_name;

    // TODO: Notify the exchange poster (email notification)
    // await sendEmail({
    //   to: posterEmail,
    //   subject: `New Skills Exchange Contact: ${exchange.title}`,
    //   body: `
    //     Hello ${posterName},
    //
    //     Someone is interested in your skills exchange:
    //
    //     Exchange: ${exchange.title}
    //     From: ${data.your_name}
    //
    //     Message:
    //     ${data.message}
    //
    //     Their Skills: ${data.your_skills || "Not provided"}
    //
    //     📧 Contact Email: ${data.your_email}
    //     ${data.your_phone ? `📞 Phone: ${data.your_phone}` : ''}
    //
    //     You can:
    //     1. Accept this exchange and contact them directly
    //     2. Decline if it's not a good match
    //     3. Reply via Knuut AI platform
    //
    //     Log in to manage your exchanges: ${process.env.NEXT_PUBLIC_APP_URL}/my-exchanges
    //   `,
    // });

    // TODO: Send confirmation email to the contact
    // await sendEmail({
    //   to: data.your_email,
    //   subject: `Message Sent: Skills Exchange Contact`,
    //   body: `
    //     Hello ${data.your_name},
    //
    //     Your message has been sent to the person who posted the skills exchange.
    //
    //     Exchange: ${exchange.title}
    //
    //     Your message has been reviewed and approved. The exchange poster will receive a notification and can choose to accept or decline your contact request.
    //
    //     If they accept, your contact information will be shared with them and they can reach out to you directly.
    //
    //     You'll receive another email when they respond.
    //
    //     Best regards,
    //     Knuut AI Team
    //   `,
    // });

    // Log the contact request (for moderation tracking)
    console.log("Skills exchange contact request:", {
      exchange_id: data.exchange_id,
      contact_name: data.your_name,
      contact_email: data.your_email,
      submitted_at: new Date().toISOString(),
      moderation_status: "approved",
    });

    return NextResponse.json({
      success: true,
      message: "Contact request sent successfully",
      data: {
        id: `contact_${Date.now()}`,
        exchange_id: data.exchange_id,
        status: "pending", // pending approval from exchange poster
        submitted_at: new Date().toISOString(),
        moderation_status: "approved",
      },
    });
  } catch (error) {
    console.error("Error processing skills exchange contact:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

