# Voice Not Working - Debug Guide

## Step 1: Check Browser Console (F12)
Open DevTools → Console tab and look for:
- ✅ "assistant" participant connected
- ❌ Audio track errors
- ❌ WebRTC errors
- ❌ Permission errors

## Step 2: Verify Connection
After clicking "Enable Voice Assistant":
1. Check browser console for "Connected to room"
2. Check if you see transcription text appearing
3. Check if video/avatar appears

## Step 3: Check Agent Logs
```bash
tail -f /tmp/agent.log
```

Look for:
- ✅ "Generating initial greeting..."
- ✅ "Final transcript received, generating reply"
- ❌ TTS errors (429, quota, etc.)
- ❌ OpenAI errors

## Step 4: Test Audio Track
In browser console, run:
```javascript
const room = window.room; // If room is exposed
if (room) {
  room.remoteParticipants.forEach((participant, id) => {
    console.log("Participant:", id);
    participant.audioTracks.forEach((track, trackId) => {
      console.log("Audio track:", trackId, track.track);
    });
  });
}
```

## Common Issues:

1. **Agent not generating replies**
   - Check if you see "Final transcript received" in logs
   - Check if LLM is responding
   - Check TTS errors

2. **Audio track not published**
   - Tavus avatar might not be publishing audio
   - Check agent logs for Tavus errors

3. **Browser not playing audio**
   - Check system volume
   - Check browser tab volume (speaker icon)
   - Check audio permissions

4. **OpenAI TTS quota/errors**
   - Check API key has funds
   - Look for 429 errors in logs

---

**Share the browser console output and agent logs for specific help!**

