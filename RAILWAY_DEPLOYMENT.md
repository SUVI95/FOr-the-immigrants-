# Railway Deployment Guide for Knuut AI

## Overview

This guide will help you deploy the entire Knuut AI platform to Railway, including:
- **Python LiveKit Agent** (tavus.py) - The voice assistant backend
- **Next.js Frontend** (optional on Railway, or deploy to Vercel)

## Prerequisites

1. **Railway Account**: Sign up at https://railway.app
2. **GitHub Repository**: Your code is already on GitHub
3. **Environment Variables**: All API keys and secrets ready

## Deployment Options

### Option 1: Deploy Everything on Railway (Recommended for Simplicity)

Deploy both the Python agent and Next.js frontend as separate services on Railway.

### Option 2: Hybrid Deployment (Recommended for Performance)

- **Python Agent** → Railway (better for long-running processes)
- **Next.js Frontend** → Vercel (better for static/SSR, free tier)

This guide covers **Option 1** (everything on Railway).

---

## Step 1: Deploy Python Agent to Railway

### 1.1 Create New Project on Railway

1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `SUVI95/FOr-the-immigrants-`
5. Railway will detect it's a Python project

### 1.2 Configure the Service

1. **Service Name**: `knuut-ai-agent` (or any name you prefer)
2. **Root Directory**: Set to `avatars/tavus`
3. **Start Command**: Railway will auto-detect, but verify it's:
   ```
   livekit-agents dev tavus.py
   ```
4. **Build Command**: 
   ```
   pip install -r requirements.txt
   ```

### 1.3 Set Environment Variables

In Railway Dashboard → Your Service → Variables, add all these:

```env
# LiveKit Configuration
LIVEKIT_URL=wss://your-livekit-url.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret

# OpenAI (for LLM and TTS)
OPENAI_API_KEY=your-openai-key

# Deepgram (for Speech-to-Text)
DEEPGRAM_API_KEY=your-deepgram-key

# Tavus (Avatar - if using)
TAVUS_API_KEY=your-tavus-key
TAVUS_REPLICA_ID=your-replica-id
TAVUS_PERSONA_ID=your-persona-id

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Stack Auth (if using)
STACK_AUTH_PROJECT_ID=your-project-id
STACK_AUTH_JWKS_URL=your-jwks-url
```

### 1.4 Deploy

1. Railway will automatically detect the `Procfile` or use the start command
2. Click **"Deploy"**
3. Wait for build to complete
4. Check logs to ensure agent starts successfully

---

## Step 2: Deploy Next.js Frontend to Railway (Optional)

### 2.1 Create Second Service

1. In the same Railway project, click **"New Service"**
2. Select **"GitHub Repo"** again
3. Choose the same repository

### 2.2 Configure Frontend Service

1. **Service Name**: `knuut-ai-frontend`
2. **Root Directory**: Set to `avatars/tavus/voice-assistant-frontend`
3. **Build Command**: 
   ```
   npm install && npm run build
   ```
4. **Start Command**:
   ```
   npm start
   ```

### 2.3 Set Frontend Environment Variables

```env
# LiveKit (Public - safe to expose)
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-url.livekit.cloud

# API Endpoints (if using Railway's public URL)
NEXT_PUBLIC_API_URL=https://your-frontend-service.railway.app
```

### 2.4 Generate Public URL

1. Railway will generate a public URL automatically
2. Copy this URL
3. Update your LiveKit agent configuration if needed

---

## Step 3: Database Setup (Neon PostgreSQL)

### 3.1 Create Database

1. Go to https://neon.tech (or your PostgreSQL provider)
2. Create a new database
3. Copy the connection string

### 3.2 Run Database Schema

1. Go to Neon SQL Editor
2. Copy contents of `avatars/tavus/database_schema.sql`
3. Paste and execute

### 3.3 Add to Railway

Add `DATABASE_URL` to your Railway service environment variables.

---

## Step 4: Verify Deployment

### 4.1 Check Agent Logs

1. Go to Railway Dashboard → Your Agent Service → Logs
2. Look for:
   - ✅ "Agent started successfully"
   - ✅ "Registered RPC methods"
   - ✅ No errors

### 4.2 Test Frontend

1. Open your Railway frontend URL
2. Navigate to `/knuut-voice`
3. Try connecting to the voice assistant
4. Verify agent connects

### 4.3 Test Flashcards

1. Ask Knuut: "Create a flashcard for the word 'terve'"
2. Verify flashcard appears
3. Click to flip and verify it works

---

## Railway Configuration Files

### `Procfile` (for Python agent)
```
web: livekit-agents dev tavus.py
```

### `requirements.txt` (Python dependencies)
```
livekit-agents[openai,silero,turn-detector,deepgram,...]>=0.11.0
asyncpg>=0.29.0
python-dotenv>=1.0.0
```

### `railway.json` (Optional - Railway-specific config)
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pip install -r requirements.txt"
  },
  "deploy": {
    "startCommand": "livekit-agents dev tavus.py"
  }
}
```

---

## Production Considerations

### 1. Use Production Mode

For production, you might want to use:
```bash
livekit-agents start tavus.py
```
instead of `dev` mode.

### 2. Health Checks

Railway automatically monitors your service. Ensure your agent:
- Responds to health check endpoints (if configured)
- Doesn't crash on startup
- Handles errors gracefully

### 3. Scaling

Railway can auto-scale based on:
- CPU usage
- Memory usage
- Request volume

Configure in Railway Dashboard → Settings → Scaling.

### 4. Monitoring

- **Logs**: View in Railway Dashboard → Logs
- **Metrics**: Railway provides CPU, Memory, Network metrics
- **Alerts**: Set up alerts for errors or high resource usage

---

## Troubleshooting

### Agent Not Starting

1. **Check logs** in Railway Dashboard
2. **Verify environment variables** are set correctly
3. **Check Python version** matches `runtime.txt` (3.12)
4. **Verify dependencies** in `requirements.txt` are correct

### Agent Crashes

1. **Check error logs** for specific error messages
2. **Verify API keys** are valid and have credits
3. **Check database connection** if using database features
4. **Review agent code** for any runtime errors

### Frontend Can't Connect to Agent

1. **Verify LiveKit URL** is correct in frontend env vars
2. **Check agent is running** (view logs)
3. **Verify RPC methods** are registered (check agent logs)
4. **Check CORS** if needed (Railway handles this automatically)

### Database Connection Issues

1. **Verify DATABASE_URL** format is correct
2. **Check database is accessible** from Railway's IP
3. **Verify SSL mode** is set correctly (`sslmode=require`)
4. **Test connection** using `test_database_connection.py`

---

## Cost Estimation (Railway)

### Free Tier:
- $5 credit/month
- 500 hours of usage
- 512 MB RAM
- 1 GB storage

### Hobby Plan ($5/month):
- $5 credit included
- Additional usage: $0.000463/GB-second
- Better for development/testing

### Pro Plan ($20/month):
- $20 credit included
- Better performance
- More resources

**Estimated Monthly Cost** (for agent + frontend):
- Development: ~$10-20/month
- Production (low traffic): ~$30-50/month
- Production (medium traffic): ~$50-100/month

---

## Next Steps After Deployment

1. **Set up custom domain** (optional) in Railway Settings
2. **Configure email service** (Resend, SendGrid) for notifications
3. **Set up monitoring** and alerts
4. **Test all features**:
   - Voice assistant
   - Flashcards
   - Quizzes
   - Events
   - Groups
   - Volunteer applications
   - Skills exchange

---

## Quick Deploy Checklist

- [ ] Railway account created
- [ ] GitHub repository connected
- [ ] Python agent service created
- [ ] All environment variables added
- [ ] Database created and schema run
- [ ] Agent deployed and running
- [ ] Frontend service created (optional)
- [ ] Frontend deployed (optional)
- [ ] Tested voice assistant connection
- [ ] Tested flashcards
- [ ] Tested all features
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up

---

## Support

- **Railway Docs**: https://docs.railway.app
- **LiveKit Agents Docs**: https://docs.livekit.io/agents
- **Railway Discord**: https://discord.gg/railway

---

**Last Updated**: [Current Date]
**Maintained By**: Knuut AI Development Team

