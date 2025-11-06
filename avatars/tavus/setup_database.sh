#!/bin/bash
# Script to set up the Neon database schema

echo "Setting up Neon database schema..."
echo ""
echo "Copy the contents of database_schema.sql and run it in:"
echo "1. Neon Dashboard -> SQL Editor"
echo "2. Or use psql command:"
echo ""
echo "psql 'postgresql://neondb_owner:npg_A35QzgMxEqHo@ep-old-voice-a9yusk0l-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require' < database_schema.sql"
echo ""
echo "Or run the schema file directly in Neon SQL Editor:"
echo "https://console.neon.tech/app/projects/proud-breeze-78072175/sql"
echo ""
echo "Database schema file location:"
echo "$(pwd)/database_schema.sql"
echo ""
echo "After running the schema, test the connection:"
echo "python test_database_connection.py"

