# Audio Not Working - Debug Steps

## ✅ Agent Status
- Agent is running: `ps aux | grep tavus.py`
- Agent is registered: Check logs for "registered worker"
- Agent logs location: `/tmp/agent.log`

## 🔍 What to Check:

### 1. Browser Console (F12 → Console)
Run this in browser console after clicking "Enable Voice Assistant":
```javascript
// Check if room is connected
console.log("Room connected:", room?.state);

// Check participants
room?.remoteParticipants.forEach((p, id) => {
  console.log("Participant:", id, p.identity);
  p.audioTracks.forEach((track, trackId) => {
    console.log("Audio track:", trackId, track.track?.kind);
    console.log("Track muted:", track.isMuted);
  });
});

// Check if assistant is connected
const assistant = Array.from(room?.remoteParticipants.values()).find(
  p => p.identity === "assistant"
);
console.log("Assistant found:", !!assistant);
if (assistant) {
  console.log("Assistant audio tracks:", assistant.audioTracks.size);
}
```

### 2. Agent Logs (Terminal)
```bash
tail -f /tmp/agent.log
```

When you speak, you should see:
- `"Final transcript received, generating reply: [your text]"`
- `"Reply generation started for: [your text]"`
- `"Initial greeting generated successfully"` (on connection)

### 3. Check if Agent is Dispatched
After clicking "Enable Voice Assistant", check browser Network tab:
- Look for `/api/dispatch` request
- Should return 200 OK

### 4. Common Issues:

**Issue A: Agent not connecting to room**
- Check `/api/dispatch` response
- Check agent logs for "entrypoint" or "connected" messages

**Issue B: Agent not generating replies**
- Check agent logs for transcript events
- Check OpenAI API key has funds
- Check for TTS errors (429, quota, etc.)

**Issue C: Audio track not published**
- Check browser console for "assistant" participant
- Check if audio tracks exist
- Check RoomAudioRenderer is mounted

**Issue D: Browser not playing audio**
- System volume not muted
- Browser tab not muted
- Check browser audio permissions

---

## 📝 Next Steps:

1. Open browser console (F12)
2. Click "Enable Voice Assistant"
3. Run the JavaScript code above
4. Say "Hello" to the AI
5. Share the console output and agent logs

