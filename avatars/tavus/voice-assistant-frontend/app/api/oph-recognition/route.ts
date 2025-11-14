import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { pseudonymizeUserId, sanitizeUserInput } from "@/lib/security";

// Note: In production, use proper file storage (S3, Cloudinary, etc.)
// This is a simplified version for the prototype

export const dynamic = "force-dynamic";

/**
 * OPH Recognition Fast-Track API
 * EU AI Act Classification: NOT AN AI SYSTEM (No Risk)
 * 
 * This endpoint handles document upload, translation, and status tracking
 * for foreign qualification recognition through OPH (Finnish National Agency for Education).
 * 
 * AI may be used for document translation (LOW-RISK, separate endpoint).
 */

/**
 * POST: Submit recognition request (with file upload support)
 */
export async function POST(request: Request) {
  try {
    // Try to parse as FormData first (for file uploads)
    try {
      const formData = await request.formData();
      const userId = formData.get("userId") as string;
      const documents = formData.getAll("documents") as File[];
      
      if (!userId) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
      }

      if (documents.length === 0) {
        return NextResponse.json({ error: "At least one document required" }, { status: 400 });
      }

      // In production, upload files to cloud storage (S3, etc.) and get URLs
      // For now, simulate successful upload
      const documentUrls: string[] = [];
      for (const doc of documents) {
        // Simulate file upload - in production, upload to storage and get URL
        const simulatedUrl = `/uploads/${userId}/${doc.name}`;
        documentUrls.push(simulatedUrl);
      }

      // Create recognition request with first document
      const qualificationTitle = documents[0]?.name || "Foreign Qualification";
      const result = await query(
        `INSERT INTO oph_recognition_requests 
         (user_id, qualification_title, document_url, status)
         VALUES ($1, $2, $3, 'submitted')
         RETURNING id, status, created_at`,
        [userId, qualificationTitle, documentUrls[0]]
      );

      const requestData = result.rows[0];

      // Log for analytics
      const userHash = pseudonymizeUserId(userId);
      await query(
        `INSERT INTO impact_metrics (user_id, metric_type, metric_name, metric_value, metric_data)
         VALUES ($1, 'recognition', 'oph_request_submitted', 1, $2)`,
        [
          userId,
          JSON.stringify({
            document_count: documents.length,
            timestamp: new Date(),
          }),
        ]
      );

      return NextResponse.json({
        requestId: requestData.id,
        status: requestData.status,
        message: "Documents uploaded successfully. Recognition request submitted to OPH.",
        documentCount: documents.length,
        nextSteps: [
          "Documents will be translated to Finnish/Swedish",
          "Translated documents will be sent to OPH",
          "Expected processing time: 3-4 months",
          "You'll receive updates on recognition status",
        ],
      });
    } catch (formDataError) {
      // Not FormData, try JSON
      const jsonData = await request.json();
      const { userId, qualificationTitle, qualificationType, issuingCountry, issuingInstitution, documentUrl } = jsonData;

    if (!userId || !qualificationTitle) {
      return NextResponse.json({ error: "User ID and qualification title required" }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedTitle = sanitizeUserInput(qualificationTitle);
    const sanitizedType = qualificationType ? sanitizeUserInput(qualificationType) : null;
    const sanitizedCountry = issuingCountry ? sanitizeUserInput(issuingCountry) : null;
    const sanitizedInstitution = issuingInstitution ? sanitizeUserInput(issuingInstitution) : null;

    // Create recognition request
    const result = await query(
      `INSERT INTO oph_recognition_requests 
       (user_id, qualification_title, qualification_type, issuing_country, issuing_institution, document_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING id, status, created_at`,
      [userId, sanitizedTitle, sanitizedType, sanitizedCountry, sanitizedInstitution, documentUrl]
    );

    const requestData = result.rows[0];

    // Log for analytics
    const userHash = pseudonymizeUserId(userId);
    await query(
      `INSERT INTO impact_metrics (user_id, metric_type, metric_name, metric_value, metric_data)
       VALUES ($1, 'recognition', 'oph_request_submitted', 1, $2)`,
      [
        userId,
        JSON.stringify({
          qualification_type: sanitizedType,
          issuing_country: sanitizedCountry,
          timestamp: new Date(),
        }),
      ]
    );

    return NextResponse.json({
      requestId: requestData.id,
      status: requestData.status,
      message: "Recognition request submitted. Document translation will be processed next.",
      nextSteps: [
        "Document will be translated to Finnish/Swedish",
        "Translated document will be sent to OPH",
        "You'll receive updates on recognition status",
      ],
    });
  } catch (error) {
    console.error("OPH recognition request error:", error);
    return NextResponse.json({ error: "Failed to submit recognition request" }, { status: 500 });
  }
}

/**
 * GET: Get recognition status for user
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const requestId = searchParams.get("requestId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    let queryText = `
      SELECT id, qualification_title, qualification_type, issuing_country, issuing_institution,
             document_url, translated_document_url, status, oph_reference_number,
             submitted_at, decision_at, decision_notes, created_at, updated_at
      FROM oph_recognition_requests
      WHERE user_id = $1
    `;
    const queryParams: any[] = [userId];

    if (requestId) {
      queryText += ` AND id = $2`;
      queryParams.push(requestId);
    }

    queryText += ` ORDER BY created_at DESC`;

    const result = await query(queryText, queryParams);

    return NextResponse.json({
      requests: result.rows.map((row: any) => ({
        id: row.id,
        qualificationTitle: row.qualification_title,
        qualificationType: row.qualification_type,
        issuingCountry: row.issuing_country,
        issuingInstitution: row.issuing_institution,
        documentUrl: row.document_url,
        translatedDocumentUrl: row.translated_document_url,
        status: row.status,
        ophReferenceNumber: row.oph_reference_number,
        submittedAt: row.submitted_at,
        decisionAt: row.decision_at,
        decisionNotes: row.decision_notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    });
  } catch (error) {
    console.error("Get OPH recognition status error:", error);
    return NextResponse.json({ error: "Failed to get recognition status" }, { status: 500 });
  }
}

/**
 * PUT: Update recognition request status (for OPH integration or admin)
 */
export async function PUT(request: Request) {
  try {
    const { requestId, status, ophReferenceNumber, decisionNotes, translatedDocumentUrl } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json({ error: "Request ID and status required" }, { status: 400 });
    }

    const validStatuses = ['pending', 'submitted', 'in_review', 'approved', 'rejected', 'needs_info'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    updateFields.push(`status = $${paramIndex++}`);
    updateValues.push(status);

    if (ophReferenceNumber) {
      updateFields.push(`oph_reference_number = $${paramIndex++}`);
      updateValues.push(ophReferenceNumber);
    }

    if (translatedDocumentUrl) {
      updateFields.push(`translated_document_url = $${paramIndex++}`);
      updateValues.push(translatedDocumentUrl);
    }

    if (decisionNotes) {
      updateFields.push(`decision_notes = $${paramIndex++}`);
      updateValues.push(sanitizeUserInput(decisionNotes));
    }

    if (status === 'submitted') {
      updateFields.push(`submitted_at = NOW()`);
    }

    if (status === 'approved' || status === 'rejected') {
      updateFields.push(`decision_at = NOW()`);
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(requestId);

    const result = await query(
      `UPDATE oph_recognition_requests 
       SET ${updateFields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING id, status, updated_at`,
      updateValues
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Recognition request not found" }, { status: 404 });
    }

    return NextResponse.json({
      requestId: result.rows[0].id,
      status: result.rows[0].status,
      updatedAt: result.rows[0].updated_at,
      message: "Recognition request updated successfully",
    });
  } catch (error) {
    console.error("Update OPH recognition error:", error);
    return NextResponse.json({ error: "Failed to update recognition request" }, { status: 500 });
  }
}

