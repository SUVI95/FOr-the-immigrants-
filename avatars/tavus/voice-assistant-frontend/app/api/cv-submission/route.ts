import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "text/plain",
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const jobId = formData.get("jobId") as string;
    const applicantName = formData.get("applicantName") as string;
    const applicantEmail = formData.get("applicantEmail") as string;
    const applicantPhone = formData.get("applicantPhone") as string;
    const coverLetter = formData.get("coverLetter") as string;
    const userId = formData.get("userId") as string;

    // Validate required fields
    if (!jobId || !applicantName || !applicantEmail) {
      return NextResponse.json(
        { error: "Missing required fields: jobId, applicantName, and applicantEmail are required" },
        { status: 400 }
      );
    }

    // Get CV file
    const cvFile = formData.get("cvFile") as File | null;
    if (!cvFile) {
      return NextResponse.json(
        { error: "CV file is required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(cvFile.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload PDF, DOC, DOCX, or TXT files only." },
        { status: 400 }
      );
    }

    // Validate file size
    if (cvFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "cv");
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFileName = cvFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${sanitizedFileName}`;
    const filePath = join(uploadsDir, fileName);

    // Save file
    const bytes = await cvFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // File URL (relative to public directory)
    const fileUrl = `/uploads/cv/${fileName}`;

    // TODO: Save to database
    // Example database operation:
    // const { db } = await import("@/lib/db");
    // const submission = await db.cv_submissions.insert({
    //   user_id: userId || null,
    //   job_id: jobId,
    //   applicant_name: applicantName,
    //   applicant_email: applicantEmail,
    //   applicant_phone: applicantPhone || null,
    //   cover_letter: coverLetter || null,
    //   cv_file_url: fileUrl,
    //   cv_file_name: cvFile.name,
    //   cv_file_size: cvFile.size,
    //   status: "pending",
    //   submitted_at: new Date(),
    // });

    // TODO: Send notification email to admin/employer
    // await sendEmail({
    //   to: adminEmail,
    //   subject: `New CV Submission: ${applicantName} - ${jobTitle}`,
    //   body: `
    //     A new CV has been submitted:
    //
    //     Job: ${jobTitle}
    //     Applicant: ${applicantName}
    //     Email: ${applicantEmail}
    //     Phone: ${applicantPhone || "Not provided"}
    //
    //     Cover Letter:
    //     ${coverLetter || "No cover letter provided"}
    //
    //     CV File: ${fileUrl}
    //   `,
    // });

    // TODO: Send confirmation email to applicant
    // await sendEmail({
    //   to: applicantEmail,
    //   subject: `CV Submission Received: ${jobTitle}`,
    //   body: `Thank you for your application! We've received your CV and will review it shortly.`,
    // });

    console.log("CV submission received:", {
      jobId,
      applicantName,
      applicantEmail,
      fileName: cvFile.name,
      fileSize: cvFile.size,
      fileUrl,
    });

    return NextResponse.json({
      success: true,
      message: "CV submitted successfully",
      data: {
        id: `cv_${timestamp}`,
        jobId,
        applicantName,
        applicantEmail,
        cvFileUrl: fileUrl,
        submittedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error processing CV submission:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

