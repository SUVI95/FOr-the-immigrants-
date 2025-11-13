#!/bin/bash
# GDPR Compliance Migration Runner
# Usage: ./run_migration.sh [DATABASE_URL]

MIGRATION_FILE="avatars/tavus/database_migrations/gdpr_compliance.sql"

if [ -z "$1" ]; then
    if [ -z "$DATABASE_URL" ]; then
        echo "Error: DATABASE_URL not provided"
        echo "Usage: $0 [DATABASE_URL]"
        echo "   or: export DATABASE_URL='your-connection-string' && $0"
        exit 1
    fi
    DB_URL="$DATABASE_URL"
else
    DB_URL="$1"
fi

echo "Running GDPR compliance migration..."
psql "$DB_URL" -f "$MIGRATION_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully!"
else
    echo "❌ Migration failed. Please check the error above."
    exit 1
fi
