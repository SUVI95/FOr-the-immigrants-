# Quick Fix: 404 Error on /jobs

## The Issue
The `/jobs` page shows a 404 error because Next.js dev server needs to be restarted to pick up new routes.

## Solution

### Step 1: Restart the Dev Server

**Stop the current server** (if running):
- Press `Ctrl+C` in the terminal where `npm run dev` is running

**Start it again**:
```bash
cd avatars/tavus/voice-assistant-frontend
npm run dev
# or
pnpm dev
```

### Step 2: Wait for Compilation

Wait until you see:
```
✓ Ready in X seconds
○ Compiling /jobs ...
✓ Compiled /jobs in X ms
```

### Step 3: Access the Page

Open in your browser:
- **Job Board**: http://localhost:3000/jobs

## Alternative: Check Browser Console

If still getting 404, check browser console (F12) for errors. Common issues:

1. **Import errors** - Check terminal for compilation errors
2. **Missing dependencies** - Run `npm install` or `pnpm install`
3. **Port conflict** - Try a different port: `npm run dev -- -p 3001`

## Quick Test

Try accessing these URLs to verify the server is running:
- http://localhost:3000 (home page)
- http://localhost:3000/work-opportunities (should work)
- http://localhost:3000/jobs (new page)

## If Still Not Working

Check the terminal output for:
- Compilation errors
- Import errors
- Missing module errors

Share any errors you see!

