# Vercel Deployment Guide for Knuut AI Frontend

## Quick Deploy Steps

### Option 1: Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import from GitHub: `SUVI95/FOr-the-immigrants-`

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `avatars/tavus/voice-assistant-frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Add Environment Variables**
   Go to Project Settings → Environment Variables, add:

   ```
   NEXT_PUBLIC_LIVEKIT_URL=wss://YOUR.livekit.cloud
   LIVEKIT_API_KEY=YOUR_LIVEKIT_API_KEY
   LIVEKIT_API_SECRET=YOUR_LIVEKIT_API_SECRET
   OPENAI_API_KEY=YOUR_OPENAI_API_KEY
   DEEPGRAM_API_KEY=YOUR_DEEPGRAM_API_KEY
   DATABASE_URL=YOUR_DATABASE_URL
   STACK_AUTH_PROJECT_ID=
   STACK_AUTH_JWKS_URL=
   ```

   **Get your actual keys from**: `.env` file in the project root or your Railway environment variables.

   **Important**: 
   - `NEXT_PUBLIC_LIVEKIT_URL` should be available to **Production, Preview, and Development**
   - All other keys should be **Production and Preview only** (not Development for security)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at: `https://your-project.vercel.app`

### Option 2: Vercel CLI

```bash
cd avatars/tavus/voice-assistant-frontend
npm install -g vercel
vercel login
vercel
```

Follow prompts to link project and deploy.

## Post-Deployment

1. **Test Your App**
   - Visit the Vercel URL
   - Test all pages: `/`, `/knuut-voice`, `/learn-finnish`, `/events`, `/groups`, `/volunteer`

2. **Verify Agent Connection**
   - Make sure your Railway agent is running
   - Test voice assistant on `/knuut-voice` page
   - Agent should connect via LiveKit

3. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain

## Troubleshooting

### Build Fails
- Check Root Directory is set to `avatars/tavus/voice-assistant-frontend`
- Verify all environment variables are set
- Check build logs in Vercel dashboard

### Agent Not Connecting
- Verify Railway agent is running
- Check `NEXT_PUBLIC_LIVEKIT_URL` is correct
- Verify `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` are set

### Environment Variables Not Working
- Make sure `NEXT_PUBLIC_*` variables are set for Production, Preview, and Development
- Redeploy after adding new environment variables
