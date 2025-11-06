# Audio Troubleshooting Checklist

## ✅ Quick Checks

1. **Agent is running**
   ```bash
   ps aux | grep tavus.py
   ```

2. **Agent is registered**
   - Check logs for "registered worker"
   - Should see: `"id": "AW_..."`

3. **Frontend connected**
   - Click "Enable Voice Assistant"
   - Check browser console (F12) for errors
   - Look for "assistant" participant in room

4. **Audio permissions**
   - Browser: Check lock icon in address bar → Allow microphone
   - System: Check volume is not muted
   - Browser tab: Check speaker icon is not muted

5. **RoomAudioRenderer**
   - Component is in page.tsx
   - Should automatically play audio from "assistant" participant

## 🔍 Debug Steps

### Check Agent Logs
```bash
tail -f /tmp/agent.log
```

Look for:
- "Generating initial greeting..."
- "Final transcript received, generating reply"
- TTS errors (429, quota, etc.)

### Check Browser Console (F12)
Look for:
- Audio track errors
- WebRTC connection errors
- Permission errors

### Test Audio Track
In browser console:
```javascript
const room = window.room; // If exposed
room.remoteParticipants.forEach((participant, id) => {
  console.log("Participant:", id);
  participant.audioTracks.forEach((track, trackId) => {
    console.log("Audio track:", trackId, track.track);
  });
});
```

## 🎯 Common Issues

1. **No audio track published**
   - Tavus avatar might not be publishing audio
   - Check agent logs for Tavus errors

2. **Agent not generating replies**
   - Check if STT is working (see transcriptions)
   - Check if LLM is responding
   - Check TTS errors

3. **Browser not playing audio**
   - Check system volume
   - Check browser tab volume
   - Check audio permissions

4. **OpenAI TTS quota/errors**
   - Check API key has funds
   - Check quota limits
   - Look for 429 errors in logs

---

**If still not working, check agent logs for specific errors!**

