# Database Connection Test

## Test the Database Connection

Run these commands to test the database connection:

```bash
# Test consent checking
curl -X GET "http://localhost:3000/api/user-data-export?userId=YOUR_USER_ID"

# Test deletion status
curl -X GET "http://localhost:3000/api/user-data-deletion?userId=YOUR_USER_ID"

# Test cron job (with secret)
curl -X GET "http://localhost:3000/api/cron/hard-delete-users" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Environment Variables Needed

Add to `.env.local`:
```
DATABASE_URL=postgresql://neondb_owner:npg_A35QzgMxEqHo@ep-old-voice-a9yusk0l-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require
CRON_SECRET=your-secret-token-here
```

## Verify Database Tables

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('ai_interaction_logs', 'consent_logs', 'audit_logs', 'data_exports');

-- Check if functions exist
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('anonymize_user_logs', 'soft_delete_user', 'hard_delete_user');

-- Check users table columns
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('gdpr_consent', 'ai_processing_consent', 'data_deletion_requested');
```
