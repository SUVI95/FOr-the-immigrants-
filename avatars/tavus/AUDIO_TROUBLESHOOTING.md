# Audio Troubleshooting Guide

## ✅ What I Fixed

1. **Killed duplicate agent processes** - Only one agent should run at a time
2. **Restarted agent** - Fresh start with clean configuration
3. **Verified audio_enabled=True** - Audio output is enabled in agent

## 🔍 Check These Things:

### 1. Browser Console (F12)
Open browser DevTools → Console tab and check for:
- Audio track errors
- WebRTC connection errors
- Permission errors

### 2. Browser Audio Permissions
- Chrome: Click the lock icon in address bar → Check "Sound" is allowed
- Check system volume is not muted
- Check browser tab is not muted (look for speaker icon in tab)

### 3. Verify Agent is Connected
- Look for "assistant" participant in the room
- Check if video track is visible (if video works, audio should too)

### 4. Check RoomAudioRenderer
- `RoomAudioRenderer` component is in the JSX
- It should automatically play audio from the "assistant" participant

### 5. Test Audio Track
In browser console, run:
```javascript
// Check if audio track exists
const room = window.room; // If room is exposed
if (room) {
  const participants = room.remoteParticipants;
  for (const [id, participant] of participants) {
    const audioTrack = participant.audioTracks.values().next().value?.track;
    if (audioTrack) {
      console.log("✅ Audio track found:", audioTrack);
    } else {
      console.log("❌ No audio track for participant:", id);
    }
  }
}
```

## 🎯 Common Issues:

1. **Browser muted**: Check system volume and browser tab volume
2. **No audio track published**: Tavus avatar might not be publishing audio
3. **Agent not generating replies**: Check agent logs for errors
4. **WebRTC connection issues**: Check network connectivity

## 🔧 Quick Fixes:

1. **Hard refresh**: Cmd/Ctrl + Shift + R
2. **Check agent logs**: `tail -f /tmp/agent.log`
3. **Restart everything**: Kill agent, restart frontend, reconnect
4. **Try different browser**: Sometimes browser-specific issues

---

**If still not working, check browser console for specific errors!**

