# Starting the Development Server

## ✅ Server Starting

The development server is starting in the background. Wait 10-15 seconds for it to compile.

## 🌐 Access Your App

Once the server is ready, open:

- **Home Page**: http://localhost:3000
- **Job Board**: http://localhost:3000/jobs
- **Work Opportunities**: http://localhost:3000/work-opportunities

## ⏱️ Wait for This Message

Look for this in your terminal:
```
✓ Ready in X seconds
```

## 🔍 Check Server Status

If you see "ERR_CONNECTION_REFUSED":
1. Wait 10-15 more seconds
2. Check terminal for errors
3. Try refreshing the browser

## 🚀 Manual Start (if needed)

If the server didn't start automatically:

```bash
cd avatars/tavus/voice-assistant-frontend
npm run dev
```

Or with pnpm:
```bash
cd avatars/tavus/voice-assistant-frontend
pnpm dev
```

## 📝 What You Should See

When the server is ready:
- Terminal shows: `✓ Ready` and `○ Compiling /jobs`
- Browser can access http://localhost:3000
- No connection errors

## 🐛 Troubleshooting

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
# Then access: http://localhost:3001
```

**Missing dependencies?**
```bash
cd avatars/tavus/voice-assistant-frontend
npm install
# or
pnpm install
```

**Check if server is running:**
```bash
lsof -i :3000
```

