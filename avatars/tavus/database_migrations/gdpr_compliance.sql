-- GDPR Compliance Database Migrations
-- Run these migrations to add GDPR compliance features

-- Add GDPR consent fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS gdpr_consent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS gdpr_consent_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS ai_processing_consent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ai_processing_consent_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS data_deletion_requested BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS data_deletion_requested_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP; -- Soft delete timestamp

-- Create AI interaction logs table (pseudonymized)
CREATE TABLE IF NOT EXISTS ai_interaction_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_hash VARCHAR(255) NOT NULL, -- Pseudonymized user ID (SHA-256 hash)
    topic VARCHAR(100),
    message_length INTEGER,
    tokens_used INTEGER,
    model VARCHAR(50) DEFAULT 'gpt-4o-mini',
    status VARCHAR(20) DEFAULT 'success', -- success, error
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_logs_user_hash ON ai_interaction_logs(user_hash);
CREATE INDEX IF NOT EXISTS idx_ai_logs_timestamp ON ai_interaction_logs(timestamp);

-- Create consent history log table
CREATE TABLE IF NOT EXISTS consent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL, -- 'gdpr', 'ai_processing', etc.
    consent_given BOOLEAN NOT NULL,
    consent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_consent_logs_user ON consent_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_logs_date ON consent_logs(consent_date);

-- Create audit log table for compliance tracking
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'data_access', 'data_export', 'data_deletion', 'consent_change', etc.
    resource VARCHAR(100), -- 'user_data', 'ai_interactions', etc.
    ip_address INET,
    user_agent TEXT,
    result VARCHAR(20) DEFAULT 'success', -- success, failure
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Create data export history table
CREATE TABLE IF NOT EXISTS data_exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    exported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    format VARCHAR(50) DEFAULT 'json',
    file_size_bytes INTEGER,
    data_categories TEXT[], -- Array of exported categories
    ip_address INET
);

CREATE INDEX IF NOT EXISTS idx_data_exports_user ON data_exports(user_id);
CREATE INDEX IF NOT EXISTS idx_data_exports_date ON data_exports(exported_at);

-- Function to anonymize user data in logs
CREATE OR REPLACE FUNCTION anonymize_user_logs(target_user_id UUID)
RETURNS void AS $$
BEGIN
    -- Anonymize AI interaction logs
    UPDATE ai_interaction_logs
    SET user_hash = 'deleted_user_' || user_hash
    WHERE user_hash IN (
        SELECT encode(digest(target_user_id::text, 'sha256'), 'hex')
    );
    
    -- Anonymize audit logs (keep for compliance but remove user reference)
    UPDATE audit_logs
    SET user_id = NULL,
        metadata = jsonb_set(metadata, '{anonymized}', 'true')
    WHERE user_id = target_user_id;
    
    -- Log the anonymization
    INSERT INTO audit_logs (user_id, action, resource, result, metadata)
    VALUES (target_user_id, 'data_anonymized', 'user_logs', 'success', 
            jsonb_build_object('anonymized_at', NOW()));
END;
$$ LANGUAGE plpgsql;

-- Function to soft delete user (mark for deletion)
CREATE OR REPLACE FUNCTION soft_delete_user(target_user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE users
    SET 
        data_deletion_requested = true,
        data_deletion_requested_at = NOW(),
        deleted_at = NOW() + INTERVAL '30 days' -- 30 day retention period
    WHERE id = target_user_id;
    
    -- Log the deletion request
    INSERT INTO audit_logs (user_id, action, resource, result, metadata)
    VALUES (target_user_id, 'data_deletion_requested', 'user_data', 'success',
            jsonb_build_object('requested_at', NOW(), 'retention_days', 30));
END;
$$ LANGUAGE plpgsql;

-- Function to hard delete user (after retention period)
CREATE OR REPLACE FUNCTION hard_delete_user(target_user_id UUID)
RETURNS void AS $$
BEGIN
    -- First anonymize logs
    PERFORM anonymize_user_logs(target_user_id);
    
    -- Then delete user data (cascade will handle related records)
    DELETE FROM users WHERE id = target_user_id;
    
    -- Log the hard delete
    INSERT INTO audit_logs (action, resource, result, metadata)
    VALUES ('data_hard_deleted', 'user_data', 'success',
            jsonb_build_object('deleted_at', NOW(), 'user_id_was', target_user_id::text));
END;
$$ LANGUAGE plpgsql;

-- Scheduled job to process hard deletes (run daily)
-- This would typically be set up in a cron job or scheduled task
-- Example: SELECT hard_delete_user(id) FROM users WHERE deleted_at < NOW() AND deleted_at IS NOT NULL;

-- Add comments for documentation
COMMENT ON TABLE ai_interaction_logs IS 'Stores pseudonymized AI interaction logs for audit and compliance';
COMMENT ON TABLE consent_logs IS 'Tracks all consent changes for GDPR compliance';
COMMENT ON TABLE audit_logs IS 'Comprehensive audit log for all data access and modifications';
COMMENT ON TABLE data_exports IS 'Tracks all data export requests (GDPR Article 15)';

