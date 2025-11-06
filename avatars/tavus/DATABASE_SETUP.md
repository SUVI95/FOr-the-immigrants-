# Neon Database Setup Guide

## ✅ Database Connection Details

Your Neon database is ready to use! Here's what you need to do:

### 1. Add DATABASE_URL to .env file

Add this to your `.env` file in the project root:

```bash
# Neon PostgreSQL Database
DATABASE_URL=postgresql://neondb_owner:npg_A35QzgMxEqHo@ep-old-voice-a9yusk0l-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require

# Stack Auth (for future user authentication)
STACK_AUTH_PROJECT_ID=cd4a2612-1526-41d1-9a0c-eac4ec4e342b
STACK_AUTH_JWKS_URL=https://api.stack-auth.com/api/v1/projects/cd4a2612-1526-41d1-9a0c-eac4ec4e342b/.well-known/jwks.json
```

**Location:** `/Users/gisrieliamaro/python-agents-examples/.env`

---

## 2. Install Required Python Package

```bash
cd /Users/gisrieliamaro/python-agents-examples/avatars/tavus
pip install asyncpg
```

---

## 3. Run Database Schema

You have two options:

### Option A: Using Neon SQL Editor (Recommended)

1. Go to: https://console.neon.tech/app/projects/proud-breeze-78072175/sql
2. Open `database_schema.sql` file
3. Copy all the SQL code
4. Paste into Neon SQL Editor
5. Click "Run"

### Option B: Using psql command line

```bash
cd /Users/gisrieliamaro/python-agents-examples/avatars/tavus
psql 'postgresql://neondb_owner:npg_A35QzgMxEqHo@ep-old-voice-a9yusk0l-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require' < database_schema.sql
```

---

## 4. Test Database Connection

```bash
cd /Users/gisrieliamaro/python-agents-examples/avatars/tavus
python test_database_connection.py
```

This will:
- ✅ Test connection to Neon
- ✅ Show PostgreSQL version
- ✅ List all tables created

---

## 5. Verify Tables Created

After running the schema, you should see these tables:

- ✅ `users` - User accounts
- ✅ `groups` - Community groups
- ✅ `group_members` - Group memberships
- ✅ `events` - Meetup events
- ✅ `event_rsvps` - Event RSVPs
- ✅ `user_profiles` - User profiles
- ✅ `integration_progress` - Progress tracking
- ✅ `usage_tracking` - Usage/billing

---

## 6. Start Using the Database

Once setup is complete:

1. **Start the agent:**
   ```bash
   cd /Users/gisrieliamaro/python-agents-examples/avatars/tavus
   ./start_agent.sh
   ```

2. **Test it:**
   - Say to Knuut: "Create a group for mothers with kids"
   - The group will be saved to Neon database
   - Say: "Find groups" - It will load from database

---

## 🔧 Troubleshooting

### Connection Error?
- Check that `DATABASE_URL` is in `.env`
- Verify the connection string is correct
- Make sure your IP is allowed (Neon allows all by default)

### Tables Not Found?
- Run `database_schema.sql` in Neon SQL Editor
- Check that schema ran without errors

### asyncpg Not Installed?
```bash
pip install asyncpg
```

---

## 📊 Database Schema Overview

The schema includes:

1. **Users & Profiles** - User management
2. **Groups** - Community groups with location
3. **Events** - Meetup events with RSVP
4. **Progress Tracking** - Integration scores
5. **Usage Tracking** - For billing/limits

All tables have:
- UUID primary keys
- Timestamps (created_at, updated_at)
- Proper indexes for performance
- Foreign key relationships

---

## 🚀 Next Steps

1. ✅ Add DATABASE_URL to .env
2. ✅ Install asyncpg
3. ✅ Run database_schema.sql
4. ✅ Test connection
5. ✅ Start agent and test!

Your database is ready! 🎉

