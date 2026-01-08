-- CV Submissions Table
-- Allows users to submit CVs for job applications

CREATE TABLE IF NOT EXISTS cv_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id VARCHAR(255), -- Can reference job_opportunities.id or external job ID
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(50),
    cover_letter TEXT,
    cv_file_url TEXT NOT NULL, -- URL to uploaded CV file
    cv_file_name VARCHAR(255) NOT NULL,
    cv_file_size INTEGER, -- File size in bytes
    additional_documents JSONB, -- Array of {url: string, name: string, type: string}
    status VARCHAR(50) DEFAULT 'pending', -- pending, reviewed, shortlisted, rejected, hired
    notes TEXT, -- Admin notes
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cv_submissions_user ON cv_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_submissions_job ON cv_submissions(job_id);
CREATE INDEX IF NOT EXISTS idx_cv_submissions_status ON cv_submissions(status);
CREATE INDEX IF NOT EXISTS idx_cv_submissions_submitted ON cv_submissions(submitted_at DESC);

