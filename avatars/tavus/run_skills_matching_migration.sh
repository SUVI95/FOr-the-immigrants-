#!/bin/bash
# Script to run skills matching database migration

echo "=========================================="
echo "Skills Matching Database Migration"
echo "=========================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not found in environment"
    echo ""
    echo "Please set DATABASE_URL in your .env file or export it:"
    echo "export DATABASE_URL='postgresql://neondb_owner:npg_A35QzgMxEqHo@ep-old-voice-a9yusk0l-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require'"
    echo ""
    echo "Or run the migration manually in Neon SQL Editor:"
    echo "https://console.neon.tech/app/projects/proud-breeze-78072175/sql"
    echo ""
    exit 1
fi

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SCHEMA_FILE="$SCRIPT_DIR/database_schema_skills_matching.sql"

if [ ! -f "$SCHEMA_FILE" ]; then
    echo "❌ Schema file not found: $SCHEMA_FILE"
    exit 1
fi

echo "📋 Schema file: $SCHEMA_FILE"
echo ""

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "⚠️  psql not found. Please install PostgreSQL client tools."
    echo ""
    echo "Alternative: Run the migration manually in Neon SQL Editor:"
    echo "https://console.neon.tech/app/projects/proud-breeze-78072175/sql"
    echo ""
    echo "1. Open the SQL Editor"
    echo "2. Copy contents of: $SCHEMA_FILE"
    echo "3. Paste and click 'Run'"
    echo ""
    exit 1
fi

echo "🚀 Running migration..."
echo ""

# Run the migration
psql "$DATABASE_URL" < "$SCHEMA_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration completed successfully!"
    echo ""
    echo "Tables created:"
    echo "  - job_opportunities"
    echo "  - skills_profiles"
    echo "  - skills_analyses"
    echo "  - job_matches"
    echo "  - oph_recognition_requests"
    echo "  - retention_tracking"
    echo "  - impact_metrics"
    echo "  - professional_connections"
    echo ""
    echo "🎉 Skills matching system is ready!"
else
    echo ""
    echo "❌ Migration failed. Please check the error messages above."
    echo ""
    echo "Alternative: Run the migration manually in Neon SQL Editor:"
    echo "https://console.neon.tech/app/projects/proud-breeze-78072175/sql"
    exit 1
fi

