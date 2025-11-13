-- Skills Matching & Job Integration Schema
-- EU AI Act Compliant: Non-AI matching engine + LOW-RISK AI suggestions

-- Job Opportunities table (stores job listings)
CREATE TABLE IF NOT EXISTS job_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    field VARCHAR(100), -- Food Service, Tech, Health & Care, etc.
    city VARCHAR(100),
    language_requirement VARCHAR(50), -- Finnish A2, English, etc.
    job_type VARCHAR(50), -- Full-time, Part-time, Internship, Training
    description TEXT,
    requirements TEXT[], -- Array of requirement strings
    required_skills TEXT[], -- Array of ESCO skill codes or skill names
    preferred_skills TEXT[], -- Optional preferred skills
    language_level_required VARCHAR(10), -- A0, A1, A2, B1, B2, C1, C2
    xp_reward INTEGER DEFAULT 0,
    deadline DATE,
    application_link TEXT,
    tags TEXT[], -- Inclusive Employer, Mentored, etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills Profiles table (stores user skills in ESCO format)
CREATE TABLE IF NOT EXISTS skills_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skills JSONB NOT NULL, -- Array of {skill: string, esco_code?: string, level?: string, source: string}
    esco_skills TEXT[], -- Array of ESCO skill codes
    language_level VARCHAR(10), -- Current Finnish level
    qualifications TEXT[], -- Array of qualification titles
    work_experience JSONB, -- Array of work experience objects
    last_analyzed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Skills Analyses table (stores AI-generated analyses - LOW-RISK)
CREATE TABLE IF NOT EXISTS skills_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skills JSONB, -- Extracted skills
    analysis_result JSONB, -- AI analysis text and metadata
    ai_suggestions JSONB, -- AI suggestions for skill development (LOW-RISK)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Job Matches table (stores non-AI rule-based matches)
CREATE TABLE IF NOT EXISTS job_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES job_opportunities(id) ON DELETE CASCADE,
    match_score INTEGER NOT NULL, -- 0-100, calculated by non-AI rules
    matched_skills TEXT[], -- Skills that matched
    missing_skills TEXT[], -- Skills user lacks
    match_breakdown JSONB, -- Detailed breakdown of match calculation
    match_type VARCHAR(50) DEFAULT 'rule_based', -- rule_based, ai_suggested
    user_viewed_at TIMESTAMP,
    user_applied_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id)
);

-- OPH Recognition Fast-Track table
CREATE TABLE IF NOT EXISTS oph_recognition_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    qualification_title VARCHAR(255) NOT NULL,
    qualification_type VARCHAR(100), -- Degree, Certificate, etc.
    issuing_country VARCHAR(100),
    issuing_institution VARCHAR(255),
    document_url TEXT, -- URL to uploaded document
    translated_document_url TEXT, -- URL to Finnish/Swedish translation
    status VARCHAR(50) DEFAULT 'pending', -- pending, submitted, in_review, approved, rejected, needs_info
    oph_reference_number VARCHAR(255),
    submitted_at TIMESTAMP,
    decision_at TIMESTAMP,
    decision_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Retention Tracking table
CREATE TABLE IF NOT EXISTS retention_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES job_opportunities(id) ON DELETE SET NULL,
    company_name VARCHAR(255),
    start_date DATE,
    check_in_1_month JSONB, -- {completed: boolean, date: timestamp, satisfaction_score: integer, notes: text}
    check_in_3_month JSONB,
    check_in_12_month JSONB,
    retention_status VARCHAR(50) DEFAULT 'active', -- active, left, transferred
    left_date DATE,
    left_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Impact Metrics table (for dashboards)
CREATE TABLE IF NOT EXISTS impact_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    metric_type VARCHAR(100) NOT NULL, -- job_placement, language_progress, skill_gain, retention
    metric_name VARCHAR(255) NOT NULL,
    metric_value NUMERIC,
    metric_data JSONB, -- Additional structured data
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    period_start DATE, -- For aggregating monthly/yearly metrics
    period_end DATE
);

-- Professional Network Connections table
CREATE TABLE IF NOT EXISTS professional_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    connection_type VARCHAR(50), -- mentor, peer, employer, advisor
    connection_name VARCHAR(255),
    connection_email VARCHAR(255),
    connection_company VARCHAR(255),
    connection_sector VARCHAR(100), -- tech, healthcare, hospitality, etc.
    connection_notes TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, active, completed
    connected_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_opportunities_field ON job_opportunities(field);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_city ON job_opportunities(city);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_language ON job_opportunities(language_level_required);
CREATE INDEX IF NOT EXISTS idx_job_opportunities_active ON job_opportunities(is_active);
CREATE INDEX IF NOT EXISTS idx_job_matches_user ON job_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_job_matches_job ON job_matches(job_id);
CREATE INDEX IF NOT EXISTS idx_job_matches_score ON job_matches(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_skills_profiles_user ON skills_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_oph_requests_user ON oph_recognition_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_oph_requests_status ON oph_recognition_requests(status);
CREATE INDEX IF NOT EXISTS idx_retention_tracking_user ON retention_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_retention_tracking_status ON retention_tracking(retention_status);
CREATE INDEX IF NOT EXISTS idx_impact_metrics_user ON impact_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_impact_metrics_type ON impact_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_professional_connections_user ON professional_connections(user_id);

