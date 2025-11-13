# Database Migration Instructions

## ⚠️ Important: DATABASE_URL Required

The migration script needs the `DATABASE_URL` environment variable. You have two options:

---

## Option 1: Manual Migration (Recommended)

### Using Neon SQL Editor

1. **Go to Neon SQL Editor:**
   ```
   https://console.neon.tech/app/projects/proud-breeze-78072175/sql
   ```

2. **Open the schema file:**
   ```
   avatars/tavus/database_schema_skills_matching.sql
   ```

3. **Copy all SQL code** from the file

4. **Paste into Neon SQL Editor**

5. **Click "Run"**

6. **Verify tables created:**
   - `job_opportunities`
   - `skills_profiles`
   - `skills_analyses`
   - `job_matches`
   - `oph_recognition_requests`
   - `retention_tracking`
   - `impact_metrics`
   - `professional_connections`

---

## Option 2: Using psql Command Line

### Step 1: Set DATABASE_URL

```bash
export DATABASE_URL='postgresql://neondb_owner:npg_A35QzgMxEqHo@ep-old-voice-a9yusk0l-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require'
```

### Step 2: Run Migration Script

```bash
cd avatars/tavus
./run_skills_matching_migration.sh
```

### Or Run Directly with psql

```bash
cd avatars/tavus
psql "$DATABASE_URL" < database_schema_skills_matching.sql
```

---

## Option 3: Add to .env File

1. **Edit `.env` file** in project root:
   ```
   /Users/gisrieliamaro/FOr-the-immigrants-/.env
   ```

2. **Add DATABASE_URL:**
   ```bash
   DATABASE_URL=postgresql://neondb_owner:npg_A35QzgMxEqHo@ep-old-voice-a9yusk0l-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require
   ```

3. **Then run migration script:**
   ```bash
   cd avatars/tavus
   source ../../.env  # Load environment variables
   ./run_skills_matching_migration.sh
   ```

---

## Verification

After migration, verify tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'job_opportunities',
  'skills_profiles',
  'skills_analyses',
  'job_matches',
  'oph_recognition_requests',
  'retention_tracking',
  'impact_metrics',
  'professional_connections'
);
```

---

## Troubleshooting

### Error: DATABASE_URL not found
- Use Option 1 (Manual Migration) or set DATABASE_URL as shown in Option 2/3

### Error: Permission denied
- Make sure the script is executable: `chmod +x run_skills_matching_migration.sh`

### Error: Connection refused
- Check your internet connection
- Verify the DATABASE_URL is correct
- Check if your IP is allowed (Neon allows all by default)

---

## Next Steps

After successful migration:

1. ✅ Verify integration on `/work-opportunities` page
2. ✅ Test skills analysis
3. ✅ Check job matching functionality
4. ✅ Verify OPH recognition tracker
5. ✅ Check retention tracking
6. ✅ Test impact dashboard

---

**Migration Status:** ⏳ Pending (requires DATABASE_URL or manual execution)

