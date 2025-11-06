# Vercel Deployment Guide for Knuut AI

## Important: This is NOT a Flask Application

This repository contains:
- **Next.js Frontend** (in `avatars/tavus/voice-assistant-frontend/`) - Deploy this to Vercel
- **Python LiveKit Agent** (in `avatars/tavus/tavus.py`) - Runs separately, NOT on Vercel

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to your Vercel project settings
2. **Framework Preset**: Select **"Next.js"** (NOT Flask)
3. **Root Directory**: Set to `avatars/tavus/voice-assistant-frontend`
4. **Build Command**: `npm run build` (or leave default)
5. **Output Directory**: `.next` (or leave default)
6. **Install Command**: `npm install` (or leave default)

### Option 2: Use vercel.json (Already Created)

The `vercel.json` file in the root directory is already configured. Vercel should automatically detect it.

### Environment Variables Needed

Add these in Vercel Dashboard → Settings → Environment Variables:

```
LIVEKIT_URL=wss://your-livekit-url.livekit.cloud
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-url.livekit.cloud
```

**Note**: Variables starting with `NEXT_PUBLIC_` are exposed to the browser. Only add public variables that are safe to expose.

## Python Agent Deployment

The Python agent (`tavus.py`) does NOT run on Vercel. It needs to run on a server that supports:
- Python 3.12+
- Long-running processes
- WebSocket connections

**Recommended hosting options:**
- **Railway** (https://railway.app) - Easy Python deployment
- **Render** (https://render.com) - Free tier available
- **Fly.io** (https://fly.io) - Good for WebSocket apps
- **Your own server** - VPS, EC2, etc.

The agent connects to LiveKit Cloud and handles voice interactions.

## Project Structure

```
python-agents-examples/
├── vercel.json                    # Vercel config (points to frontend)
├── avatars/tavus/
│   ├── tavus.py                  # Python agent (NOT for Vercel)
│   └── voice-assistant-frontend/  # Next.js app (Deploy this to Vercel)
│       ├── app/
│       ├── components/
│       ├── package.json
│       └── ...
```

## Troubleshooting

### Error: "No flask entrypoint found"
- **Solution**: Change Framework Preset to "Next.js" in Vercel settings
- Or ensure `vercel.json` is in the root directory

### Build fails
- Check that `rootDirectory` in `vercel.json` points to the correct path
- Ensure `package.json` exists in the frontend directory
- Check build logs for specific errors

### Environment variables not working
- Make sure variables are added in Vercel Dashboard
- Restart deployment after adding variables
- Use `NEXT_PUBLIC_` prefix for client-side variables

## Next Steps After Deployment

1. **Deploy Python Agent** separately (Railway, Render, etc.)
2. **Configure Environment Variables** in both Vercel and agent hosting
3. **Test the connection** between frontend and agent
4. **Set up database** (Neon, Supabase, etc.) if not already done
5. **Configure email service** (Resend, SendGrid, etc.) for notifications

