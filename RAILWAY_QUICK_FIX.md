# Railway Quick Fix - "No start command found"

## Problem
Railway shows: "No start command was found"

## Solution

### Step 1: Set Root Directory (IMPORTANT!)

1. Go to Railway Dashboard → Your Service
2. Click **Settings** tab
3. Scroll to **Source** section
4. Set **Root Directory** to: `avatars/tavus`
5. Click **Save**

### Step 2: Verify Configuration Files

Make sure these files exist in `avatars/tavus/`:
- ✅ `app.py` - Entry point (just created)
- ✅ `Procfile` - Contains: `web: python app.py`
- ✅ `requirements.txt` - Python dependencies
- ✅ `runtime.txt` - Python version (python-3.12)

### Step 3: Redeploy

1. Railway should automatically redeploy after you set the root directory
2. Or manually trigger: **Deployments** → **Redeploy**

### Step 4: Check Logs

After redeploy, check logs. You should see:
- ✅ "Detected Python"
- ✅ "Installing dependencies..."
- ✅ "Starting application..."
- ✅ Agent logs showing it's running

## If Still Not Working

### Option 1: Manual Start Command

1. Go to Service Settings → **Deploy**
2. Set **Start Command** manually to: `python app.py`
3. Save and redeploy

### Option 2: Use Procfile

Railway should automatically detect the `Procfile`. If not:
1. Make sure `Procfile` is in `avatars/tavus/` directory
2. Content should be: `web: python app.py`
3. No extra spaces or lines

### Option 3: Check File Structure

Your repository structure should be:
```
FOr-the-immigrants-/
└── avatars/
    └── tavus/
        ├── app.py          ← Entry point
        ├── tavus.py        ← Main agent code
        ├── Procfile        ← Start command
        ├── requirements.txt
        ├── runtime.txt
        └── ...
```

## Common Issues

### Issue: "Module not found: tavus"
- **Fix**: Make sure root directory is set to `avatars/tavus`
- The `app.py` imports from `tavus.py` in the same directory

### Issue: "No module named 'livekit'"
- **Fix**: Check `requirements.txt` includes all dependencies
- Railway should install them automatically

### Issue: Still can't find start command
- **Fix**: Manually set in Railway Settings → Deploy → Start Command: `python app.py`

## Success Indicators

When it works, you'll see in logs:
```
✓ Detected Python
✓ Installing dependencies from requirements.txt
✓ Starting: python app.py
✓ Agent started successfully
✓ Registered RPC methods
```

