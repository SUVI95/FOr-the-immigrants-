# Quick Start Guide - Knuut AI with Database

## 🚀 Get Everything Running in 5 Minutes

### Step 1: Add Database URL to .env

**Edit:** `/Users/gisrieliamaro/python-agents-examples/.env`

**Add these lines:**
```bash
DATABASE_URL=postgresql://neondb_owner:npg_A35QzgMxEqHo@ep-old-voice-a9yusk0l-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require
STACK_AUTH_PROJECT_ID=cd4a2612-1526-41d1-9a0c-eac4ec4e342b
```

---

### Step 2: Install asyncpg

```bash
cd /Users/gisrieliamaro/python-agents-examples/avatars/tavus
pip install asyncpg
```

---

### Step 3: Run Database Schema

**Go to Neon SQL Editor:**
https://console.neon.tech/app/projects/proud-breeze-78072175/sql

**Copy and paste the entire contents of:**
`avatars/tavus/database_schema.sql`

**Click "Run"**

---

### Step 4: Test Connection

```bash
cd /Users/gisrieliamaro/python-agents-examples/avatars/tavus
python test_database_connection.py
```

You should see:
```
✅ Database connection successful!
📊 PostgreSQL version: PostgreSQL 16.x
📋 Existing tables (8):
   - events
   - event_rsvps
   - groups
   - group_members
   - integration_progress
   - usage_tracking
   - user_profiles
   - users
```

---

### Step 5: Start Everything

**Terminal 1 - Agent:**
```bash
cd /Users/gisrieliamaro/python-agents-examples/avatars/tavus
./start_agent.sh
```

**Terminal 2 - Frontend:**
```bash
cd /Users/gisrieliamaro/python-agents-examples/avatars/tavus/voice-assistant-frontend
npm install
npm run dev
```

---

### Step 6: Test It!

1. Open: http://localhost:3000
2. Click "Start a conversation"
3. Say: **"Create a group for mothers with kids in Kajaani"**
4. **See the modal appear with the group card!**
5. Say: **"Find groups"** - It will load from database!

---

## ✅ What Should Work

- ✅ Groups saved to database
- ✅ Events saved to database
- ✅ Join/RSVP updates database
- ✅ Find commands load from database
- ✅ Google Maps links work
- ✅ Modal overlays appear

---

## 🐛 Troubleshooting

**"DATABASE_URL not found"**
- Make sure you added it to `.env` file in project root

**"asyncpg not installed"**
```bash
pip install asyncpg
```

**"Table doesn't exist"**
- Run `database_schema.sql` in Neon SQL Editor

**"Connection refused"**
- Check DATABASE_URL is correct
- Verify Neon database is running

---

## 📚 Files You Need

- ✅ `.env` - Add DATABASE_URL here
- ✅ `database_schema.sql` - Run this in Neon
- ✅ `tavus.py` - Agent with database integration
- ✅ `database.py` - Database helper
- ✅ Frontend components - Already created

---

**Ready to test!** 🎉

