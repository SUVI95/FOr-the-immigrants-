import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET /api/jobs - List jobs with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const location = searchParams.get("location");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let sql = `
      SELECT 
        jl.id,
        jl.title,
        jl.slug,
        jl.company,
        jl.company_logo_url,
        jl.description,
        jc.name as category,
        jt.name as job_type,
        jloc.city as location,
        jl.salary_min,
        jl.salary_max,
        jl.salary_currency,
        jl.language_requirement,
        jl.posted_date,
        jl.deadline,
        jl.is_featured,
        jl.views_count,
        jl.applications_count,
        jl.tags,
        jl.status
      FROM job_listings jl
      LEFT JOIN job_categories jc ON jl.category_id = jc.id
      LEFT JOIN job_types jt ON jl.job_type_id = jt.id
      LEFT JOIN job_locations jloc ON jl.location_id = jloc.id
      WHERE jl.status = 'published' AND jl.is_active = true
    `;

    const params: any[] = [];
    let paramCount = 1;

    // Apply filters
    if (category && category !== "all") {
      sql += ` AND LOWER(jc.slug) = $${paramCount}`;
      params.push(category.toLowerCase());
      paramCount++;
    }

    if (type && type !== "all") {
      sql += ` AND LOWER(jt.slug) = $${paramCount}`;
      params.push(type.toLowerCase());
      paramCount++;
    }

    if (location && location !== "all") {
      sql += ` AND LOWER(jloc.city) = $${paramCount}`;
      params.push(location.toLowerCase());
      paramCount++;
    }

    if (search) {
      sql += ` AND (
        jl.title ILIKE $${paramCount} OR 
        jl.company ILIKE $${paramCount} OR 
        jl.description ILIKE $${paramCount}
      )`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Sorting
    switch (sort) {
      case "oldest":
        sql += ` ORDER BY jl.created_at ASC`;
        break;
      case "salary_high":
        sql += ` ORDER BY jl.salary_max DESC NULLS LAST, jl.salary_min DESC NULLS LAST`;
        break;
      case "salary_low":
        sql += ` ORDER BY jl.salary_min ASC NULLS LAST, jl.salary_max ASC NULLS LAST`;
        break;
      case "applications":
        sql += ` ORDER BY jl.applications_count DESC`;
        break;
      case "views":
        sql += ` ORDER BY jl.views_count DESC`;
        break;
      case "newest":
      default:
        sql += ` ORDER BY jl.created_at DESC, jl.is_featured DESC`;
        break;
    }

    sql += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);
    paramCount += 2;

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      jobs: result.rows,
      total: result.rowCount,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create new job listing
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.company || !data.description) {
      return NextResponse.json(
        { error: "Missing required fields: title, company, and description are required" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Get or create category
    let categoryId = null;
    if (data.category) {
      const categoryResult = await query(
        `SELECT id FROM job_categories WHERE slug = $1`,
        [data.category]
      );
      if (categoryResult.rows.length > 0) {
        categoryId = categoryResult.rows[0].id;
      }
    }

    // Get or create job type
    let jobTypeId = null;
    if (data.job_type) {
      const typeResult = await query(
        `SELECT id FROM job_types WHERE slug = $1`,
        [data.job_type]
      );
      if (typeResult.rows.length > 0) {
        jobTypeId = typeResult.rows[0].id;
      }
    }

    // Get or create location
    let locationId = null;
    if (data.location) {
      const locationResult = await query(
        `SELECT id FROM job_locations WHERE LOWER(city) = $1`,
        [data.location.toLowerCase()]
      );
      if (locationResult.rows.length > 0) {
        locationId = locationResult.rows[0].id;
      } else {
        // Create new location
        const newLocationResult = await query(
          `INSERT INTO job_locations (city, country) VALUES ($1, 'Finland') RETURNING id`,
          [data.location]
        );
        locationId = newLocationResult.rows[0].id;
      }
    }

    // Insert job listing
    const insertResult = await query(
      `INSERT INTO job_listings (
        title, slug, company, company_logo_url, company_website, description,
        requirements, responsibilities, benefits,
        category_id, job_type_id, location_id,
        salary_min, salary_max, salary_currency,
        language_requirement, language_level_required,
        application_method, application_email, application_link,
        deadline, tags, status, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24
      ) RETURNING id, title, slug, company`,
      [
        data.title,
        slug,
        data.company,
        data.company_logo_url || null,
        data.company_website || null,
        data.description,
        data.requirements || [],
        data.responsibilities || [],
        data.benefits || [],
        categoryId,
        jobTypeId,
        locationId,
        data.salary_min || null,
        data.salary_max || null,
        data.salary_currency || "EUR",
        data.language_requirement || null,
        data.language_level_required || null,
        data.application_method || "form",
        data.application_email || null,
        data.application_link || null,
        data.deadline || null,
        data.tags || [],
        "published", // Default to published
        data.created_by || null,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Job posted successfully",
      job: insertResult.rows[0],
    });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job listing" },
      { status: 500 }
    );
  }
}

