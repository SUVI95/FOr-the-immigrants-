-- Complete Job Board System Database Schema
-- Includes: Job listings, categories, applications, resumes, alerts, tracking

-- ============================================
-- JOB CATEGORIES & TAXONOMIES
-- ============================================

-- Job Categories table
CREATE TABLE IF NOT EXISTS job_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100), -- Icon name or emoji
    parent_id UUID REFERENCES job_categories(id) ON DELETE SET NULL, -- For subcategories
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Types table (Full-time, Part-time, Contract, etc.)
CREATE TABLE IF NOT EXISTS job_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Locations table
CREATE TABLE IF NOT EXISTS job_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Finland',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(city, region, country)
);

-- Job Tags table
CREATE TABLE IF NOT EXISTS job_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(20), -- Hex color for UI
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ENHANCED JOB OPPORTUNITIES
-- ============================================

-- Enhanced Job Opportunities table
CREATE TABLE IF NOT EXISTS job_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    company VARCHAR(255) NOT NULL,
    company_logo_url TEXT,
    company_website TEXT,
    company_description TEXT,
    
    -- Job Details
    description TEXT NOT NULL,
    requirements TEXT[],
    responsibilities TEXT[],
    benefits TEXT[],
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(10) DEFAULT 'EUR',
    salary_type VARCHAR(50), -- hourly, monthly, yearly
    
    -- Classification
    category_id UUID REFERENCES job_categories(id),
    job_type_id UUID REFERENCES job_types(id),
    location_id UUID REFERENCES job_locations(id),
    
    -- Skills & Requirements
    required_skills TEXT[],
    preferred_skills TEXT[],
    language_requirement VARCHAR(50),
    language_level_required VARCHAR(10), -- A0, A1, A2, B1, B2, C1, C2
    education_level VARCHAR(100),
    experience_years INTEGER,
    
    -- Application Details
    application_method VARCHAR(50) DEFAULT 'form', -- form, external_link, email
    application_email VARCHAR(255),
    application_link TEXT,
    application_form_fields JSONB, -- Custom form fields
    
    -- Status & Visibility
    status VARCHAR(50) DEFAULT 'draft', -- draft, published, closed, expired
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    
    -- Dates
    posted_date DATE DEFAULT CURRENT_DATE,
    deadline DATE,
    expires_at TIMESTAMP,
    
    -- Metadata
    tags TEXT[],
    xp_reward INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id), -- Employer/admin who created
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Listing Tags (Many-to-Many)
CREATE TABLE IF NOT EXISTS job_listing_tags (
    job_listing_id UUID REFERENCES job_listings(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES job_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (job_listing_id, tag_id)
);

-- ============================================
-- CANDIDATE RESUMES & PROFILES
-- ============================================

-- Candidate Resumes table
CREATE TABLE IF NOT EXISTS candidate_resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    resume_name VARCHAR(255) NOT NULL, -- User-friendly name
    resume_file_url TEXT NOT NULL,
    resume_file_name VARCHAR(255) NOT NULL,
    resume_file_size INTEGER,
    resume_type VARCHAR(50) DEFAULT 'cv', -- cv, cover_letter, portfolio, other
    is_primary BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE, -- Allow employers to view
    metadata JSONB, -- Additional metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Candidate Profile (Extended)
CREATE TABLE IF NOT EXISTS candidate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    headline VARCHAR(255), -- Professional headline
    summary TEXT, -- Professional summary
    current_position VARCHAR(255),
    current_company VARCHAR(255),
    location VARCHAR(255),
    phone VARCHAR(50),
    website TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    portfolio_url TEXT,
    availability_status VARCHAR(50) DEFAULT 'available', -- available, not_looking, open_to_offers
    desired_salary_min INTEGER,
    desired_salary_max INTEGER,
    desired_job_types TEXT[],
    desired_locations TEXT[],
    desired_categories TEXT[],
    languages JSONB, -- [{language: 'Finnish', level: 'B1'}, ...]
    skills TEXT[],
    work_experience JSONB,
    education JSONB,
    certifications JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- JOB APPLICATIONS
-- ============================================

-- Enhanced Job Applications table
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_listing_id UUID REFERENCES job_listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Applicant Information
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(50),
    
    -- Application Content
    cover_letter TEXT,
    resume_id UUID REFERENCES candidate_resumes(id) ON DELETE SET NULL,
    additional_documents JSONB, -- Array of document URLs
    
    -- Custom Form Fields
    custom_fields JSONB, -- Store custom form field responses
    
    -- Status Tracking
    status VARCHAR(50) DEFAULT 'pending', -- pending, reviewed, shortlisted, interviewed, rejected, hired
    status_notes TEXT,
    rating INTEGER, -- 1-5 star rating by employer
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    
    -- Application Metadata
    source VARCHAR(100), -- website, referral, job_board, etc.
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Dates
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(job_listing_id, user_id) -- One application per user per job
);

-- Application Status History
CREATE TABLE IF NOT EXISTS application_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- JOB ALERTS
-- ============================================

-- Job Alerts table
CREATE TABLE IF NOT EXISTS job_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    alert_name VARCHAR(255) NOT NULL,
    
    -- Search Criteria
    keywords TEXT[],
    category_ids UUID[],
    job_type_ids UUID[],
    location_ids UUID[],
    salary_min INTEGER,
    salary_max INTEGER,
    language_level VARCHAR(10),
    
    -- Alert Settings
    frequency VARCHAR(50) DEFAULT 'daily', -- daily, weekly, biweekly, monthly
    is_active BOOLEAN DEFAULT TRUE,
    last_sent_at TIMESTAMP,
    next_send_at TIMESTAMP,
    
    -- Statistics
    total_sent INTEGER DEFAULT 0,
    total_matches INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Alert Matches (Track which jobs matched alerts)
CREATE TABLE IF NOT EXISTS job_alert_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID REFERENCES job_alerts(id) ON DELETE CASCADE,
    job_listing_id UUID REFERENCES job_listings(id) ON DELETE CASCADE,
    sent_at TIMESTAMP,
    clicked_at TIMESTAMP,
    applied_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(alert_id, job_listing_id)
);

-- ============================================
-- EMPLOYERS & ADMIN
-- ============================================

-- Employers table
CREATE TABLE IF NOT EXISTS employers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL UNIQUE,
    company_slug VARCHAR(255) NOT NULL UNIQUE,
    company_logo_url TEXT,
    company_website TEXT,
    company_description TEXT,
    industry VARCHAR(100),
    company_size VARCHAR(50), -- startup, small, medium, large, enterprise
    location VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employer Users (Many-to-Many: Users can be associated with multiple employers)
CREATE TABLE IF NOT EXISTS employer_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID REFERENCES employers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'recruiter', -- admin, recruiter, viewer
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employer_id, user_id)
);

-- ============================================
-- ANALYTICS & TRACKING
-- ============================================

-- Job Views Tracking
CREATE TABLE IF NOT EXISTS job_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_listing_id UUID REFERENCES job_listings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(45),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job Search Logs
CREATE TABLE IF NOT EXISTS job_search_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    search_query TEXT,
    filters JSONB, -- Store filter criteria
    results_count INTEGER,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Job Listings Indexes
CREATE INDEX IF NOT EXISTS idx_job_listings_status ON job_listings(status);
CREATE INDEX IF NOT EXISTS idx_job_listings_active ON job_listings(is_active);
CREATE INDEX IF NOT EXISTS idx_job_listings_category ON job_listings(category_id);
CREATE INDEX IF NOT EXISTS idx_job_listings_type ON job_listings(job_type_id);
CREATE INDEX IF NOT EXISTS idx_job_listings_location ON job_listings(location_id);
CREATE INDEX IF NOT EXISTS idx_job_listings_featured ON job_listings(is_featured);
CREATE INDEX IF NOT EXISTS idx_job_listings_created ON job_listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_listings_deadline ON job_listings(deadline);
CREATE INDEX IF NOT EXISTS idx_job_listings_slug ON job_listings(slug);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_job_listings_search ON job_listings USING gin(to_tsvector('english', title || ' ' || description || ' ' || company));

-- Applications Indexes
CREATE INDEX IF NOT EXISTS idx_applications_job ON job_applications(job_listing_id);
CREATE INDEX IF NOT EXISTS idx_applications_user ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied ON job_applications(applied_at DESC);

-- Resumes Indexes
CREATE INDEX IF NOT EXISTS idx_resumes_user ON candidate_resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_primary ON candidate_resumes(user_id, is_primary);

-- Job Alerts Indexes
CREATE INDEX IF NOT EXISTS idx_alerts_user ON job_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON job_alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_alerts_next_send ON job_alerts(next_send_at);

-- Views Indexes
CREATE INDEX IF NOT EXISTS idx_job_views_job ON job_views(job_listing_id);
CREATE INDEX IF NOT EXISTS idx_job_views_date ON job_views(viewed_at DESC);

