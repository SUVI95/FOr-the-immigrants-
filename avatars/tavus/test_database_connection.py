#!/usr/bin/env python3
"""
Test Neon database connection
"""
import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv
import asyncpg

load_dotenv(dotenv_path=Path(__file__).parent.parent.parent / '.env')

async def test_connection():
    """Test database connection"""
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        print("❌ DATABASE_URL not found in .env file")
        return False
    
    print(f"🔗 Connecting to database...")
    print(f"   URL: {database_url.split('@')[1] if '@' in database_url else 'hidden'}")
    
    try:
        conn = await asyncpg.connect(database_url)
        print("✅ Database connection successful!")
        
        # Test query
        version = await conn.fetchval("SELECT version()")
        print(f"📊 PostgreSQL version: {version.split(',')[0]}")
        
        # Check if tables exist
        tables = await conn.fetch("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        """)
        
        if tables:
            print(f"\n📋 Existing tables ({len(tables)}):")
            for table in tables:
                print(f"   - {table['table_name']}")
        else:
            print("\n⚠️  No tables found. Run database_schema.sql to create tables.")
        
        await conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("\n💡 Make sure:")
        print("   1. DATABASE_URL is correct in .env")
        print("   2. Database is accessible from your IP")
        print("   3. You have run database_schema.sql")
        return False

if __name__ == "__main__":
    asyncio.run(test_connection())

