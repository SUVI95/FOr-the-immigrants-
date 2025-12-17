'use client';

import { useState, useRef, useEffect } from 'react';

export default function InlineVoiceInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcription, setTranscription] = useState('');
  
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // ✅ FIXED: Use the same backend as Knuut demo
  const SERVER_URL = 'http://localhost:8788';

  const startVoice = async () => {
    if (isActive || isConnecting) return;
    setIsConnecting(true);
    console.log('🔄 Starting connection process...');

    try {
      // Request microphone access
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = micStream;
      console.log('✅ Microphone access granted');

      // Create WebRTC peer connection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }]
      });
      pcRef.current = pc;

      // Create audio element for AI voice output
      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      audioEl.playsInline = true;
      audioEl.style.display = 'none';
      document.body.appendChild(audioEl);
      remoteAudioRef.current = audioEl;

      // Handle incoming audio track from AI
      pc.ontrack = (event) => {
        console.log('🔊 Received audio track');
        const stream = event.streams[0];
        
        // Create audio element for playback
        const audioEl = document.createElement('audio');
        audioEl.autoplay = true;
        audioEl.playsInline = true;
        audioEl.srcObject = stream;
        document.body.appendChild(audioEl);
        remoteAudioRef.current = audioEl;
        
        // Set up audio analysis for visualizer
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);
          analyser.fftSize = 256;
          
          audioContextRef.current = audioContext;
          analyserRef.current = analyser;
          
          // Start monitoring audio levels
          monitorAudioLevels();
        } catch (e) {
          console.warn('Audio analysis setup failed:', e);
        }
        
        audioEl.play()
          .then(() => {
            console.log('▶️ AI audio playback started');
            setIsSpeaking(true);
          })
          .catch(err => console.error('Audio playback error:', err));
        
        // Detect when audio stops
        audioEl.addEventListener('ended', () => {
          setIsSpeaking(false);
        });
        
        // Monitor audio for speaking state
        const checkAudio = () => {
          if (audioEl && !audioEl.paused && audioEl.currentTime > 0) {
            setIsSpeaking(true);
          } else {
            setIsSpeaking(false);
          }
          if (isActive) {
            setTimeout(checkAudio, 100);
          }
        };
        checkAudio();
      };

      // Monitor connection state
      pc.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', pc.iceConnectionState);
        if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
          setIsConnecting(false);
          setIsActive(true);
          setIsListening(true);
        }
        if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
          console.warn('Connection lost');
          setIsConnecting(false);
          setIsActive(false);
        }
      };

      // Add microphone track to peer connection
      micStream.getTracks().forEach(track => pc.addTrack(track, micStream));

      // Create data channel for sending events to AI
      const channel = pc.createDataChannel('oai-events');
      
      channel.onopen = () => {
        console.log('📡 Data channel opened');
        try {
          // Configure AI persona and voice
          channel.send(JSON.stringify({
            type: 'session.update',
            session: {
              voice: 'verse',
              instructions: "You are Knuut AI — a masculine, cheerful, and human-like mentor. Your voice is the male voice 'verse'. You were created by Suvi and Henri for Duunijobs, the Finnish recruitment and language platform. Always present yourself as Knuut, mentor of Duunijobs. Be confident, warm, natural, and positive. Never roleplay as a Viking or use a Nordic accent. Speak like a real human, smiling while talking. Always give short answers (1–2 sentences) and pause for the user. Encourage with kindness, humor, and positivity, like a supportive friend and coach."
            }
          }));

          // Request AI to start responding
          channel.send(JSON.stringify({
            type: 'response.create',
            response: { modalities: ['audio', 'text'], conversation: 'auto' }
          }));
          console.log('✅ AI configured and ready');
        } catch (e) {
          console.warn('DataChannel send failed:', e);
        }
      };

      channel.onmessage = (event) => {
        try {
          const obj = JSON.parse(event.data || '{}');
          console.log('💬 AI message:', obj.type);
          
          // Handle transcription
          if (obj.type === 'conversation.item.input_audio_transcription.completed') {
            const text = obj.item?.transcript || '';
            if (text) {
              setTranscription(prev => prev + (prev ? ' ' : '') + text);
              setIsListening(false);
              setTimeout(() => setIsListening(true), 2000);
            }
          }
          
          // Handle AI response
          if (obj.type === 'response.audio_transcript.delta' || obj.type === 'response.text.delta') {
            setIsSpeaking(true);
            setIsListening(false);
          }
          
          if (obj.type === 'response.done') {
            setIsSpeaking(false);
            setIsListening(true);
          }
        } catch (e) {
          console.warn('Failed to parse message:', e);
        }
      };

      // Ensure we can receive audio
      try {
        pc.addTransceiver('audio', { direction: 'sendrecv' });
      } catch (e) {}

      // Create WebRTC offer
      const offer = await pc.createOffer({ 
        offerToReceiveAudio: true, 
        offerToReceiveVideo: false 
      });
      console.log('✅ WebRTC offer created');
      await pc.setLocalDescription(offer);

      // ✅ FIXED: Send directly to backend server (same as Knuut demo)
      const resp = await fetch(`${SERVER_URL}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/sdp' },
        body: offer.sdp || ''
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error('Session failed: ' + errText);
      }

      const answerSdp = await resp.text();
      console.log('✅ Received answer from server');

      // Set remote description with answer
      await pc.setRemoteDescription({ 
        type: 'answer', 
        sdp: answerSdp 
      });

      // Try to play audio
      try {
        await audioEl.play();
      } catch (e) {
        console.warn('Autoplay prevented:', e);
      }

      // Connection will be set to active by oniceconnectionstatechange
      // Don't set it here to avoid race conditions
      console.log('🎉 Voice session active!');
    } catch (error: any) {
      console.error('❌ Connection error:', error);
      stopVoice();
      alert('Could not start voice session: ' + (error?.message || error));
    }
  };

  const monitorAudioLevels = () => {
    if (!analyserRef.current || !isActive) {
      animationFrameRef.current = null;
      return;
    }
    
    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate average audio level
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const normalizedLevel = Math.min(average / 128, 1);
    setAudioLevel(normalizedLevel);
    
    // Continue monitoring
    animationFrameRef.current = requestAnimationFrame(monitorAudioLevels);
  };

  const stopVoice = () => {
    setIsActive(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    setIsListening(false);
    setAudioLevel(0);
    setTranscription('');
    
    try {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
        micStreamRef.current = null;
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = null;
      }
    } catch (e) {
      console.error('Error stopping:', e);
    }
    
    console.log('🛑 Voice session stopped');
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "16px 24px",
          borderRadius: 16,
          border: "2px solid rgba(255,255,255,0.3)",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          color: "#ffffff",
          fontWeight: 700,
          fontSize: 16,
          cursor: "pointer",
          transition: "all 0.3s ease",
          display: "inline-block",
          width: "100%",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.25)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.15)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {isOpen ? "✕ Close Voice Interface" : "🎤 Talk to Knuut AI"}
      </button>

      {/* Voice Interface */}
      {isOpen && (
        <div style={{
          marginTop: 24,
          padding: "32px",
          borderRadius: 24,
          background: "#ffffff",
          border: "2px solid #e2e8f0",
          boxShadow: "0 12px 32px rgba(15,23,42,0.1)",
        }}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "linear-gradient(135deg, #667eea 0%, #7c3aed 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <span className="fa-solid fa-microphone" style={{ fontSize: 24, color: "#ffffff" }}></span>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
                  Knuut AI Voice
                </h3>
                <p style={{ margin: "4px 0 0 0", fontSize: 14, color: "#64748b" }}>
                  AI-Powered Language Learning
                </p>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 15, color: "#475569", lineHeight: 1.6 }}>
              Experience the future of language learning. Talk naturally with Knuut AI — your personal Finnish teacher that listens, understands, and responds in real-time with engaging conversations.
            </p>
          </div>

          {/* Voice Enable Button */}
          <div style={{ marginBottom: 24 }}>
            <button
              onClick={isActive ? stopVoice : startVoice}
              disabled={isConnecting}
              style={{
                width: "100%",
                padding: "20px 24px",
                borderRadius: 16,
                border: isActive 
                  ? (isSpeaking ? "2px solid rgba(59,130,246,0.4)" : "2px solid rgba(34,197,94,0.4)")
                  : "2px solid rgba(124,58,237,0.3)",
                background: isActive
                  ? (isSpeaking 
                      ? "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.1) 100%)"
                      : "linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(16,185,129,0.08) 100%)")
                  : "linear-gradient(135deg, rgba(102,126,234,0.12) 0%, rgba(124,58,237,0.1) 100%)",
                cursor: isConnecting ? "not-allowed" : "pointer",
                opacity: isConnecting ? 0.6 : 1,
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                background: isActive
                  ? (isSpeaking 
                      ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                      : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)")
                  : "linear-gradient(135deg, #667eea 0%, #7c3aed 100%)",
                position: "relative",
              }}>
                {isActive && (isSpeaking || audioLevel > 0.1) && (
                  <div style={{
                    position: "absolute",
                    inset: "-4px",
                    borderRadius: "50%",
                    border: `2px solid ${isSpeaking ? '#3b82f6' : '#22c55e'}`,
                    opacity: 0.6,
                    animation: "ripple 1.5s ease-out infinite"
                  }} />
                )}
                <i className={`fa-solid ${isSpeaking ? 'fa-volume-high' : 'fa-microphone'}`} style={{ 
                  color: "#ffffff",
                  fontSize: 20,
                }}></i>
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: isActive ? (isSpeaking ? "#1e40af" : "#166534") : "#4338ca" }}>
                  {isConnecting 
                    ? "🔄 Connecting..." 
                    : isActive 
                      ? (isSpeaking ? "🔊 Knuut is speaking" : "🎤 Listening")
                      : "🚀 Enable Voice"}
                </div>
                {!isConnecting && (
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                    {isActive 
                      ? (isSpeaking ? "Hear Knuut's response" : "Speak naturally")
                      : "Click to start your learning journey"}
                  </div>
                )}
              </div>
            </button>

            {/* Voice Visualizer Bar - Always visible when open */}
            {(isActive || isConnecting) && (
              <div style={{ 
                marginTop: 20, 
                padding: "20px",
                borderRadius: 16,
                background: isConnecting
                  ? "linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(245,158,11,0.05) 100%)"
                  : isSpeaking 
                    ? "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(37,99,235,0.05) 100%)"
                    : "linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(16,185,129,0.05) 100%)",
                border: isConnecting
                  ? "1px solid rgba(251,191,36,0.2)"
                  : `1px solid ${isSpeaking ? 'rgba(59,130,246,0.2)' : 'rgba(34,197,94,0.2)'}`,
              }}>
                {isConnecting ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <div style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "#f59e0b",
                      animation: "pulse 1.5s infinite"
                    }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#92400e" }}>
                      Connecting...
                    </span>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <div style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: isSpeaking ? "#3b82f6" : "#22c55e",
                      animation: "pulse 1.5s infinite"
                    }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: isSpeaking ? "#1e40af" : "#166534" }}>
                      {isSpeaking ? "Knuut is speaking" : "Listening"}
                    </span>
                  </div>
                )}
                
                {/* Audio Level Bars - Always animated */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, height: 40 }}>
                  {Array.from({ length: 24 }).map((_, i) => {
                    // More natural wave pattern
                    const baseDelay = i * 0.08;
                    const wavePhase = (Date.now() / 1000 + baseDelay) % (Math.PI * 2);
                    const waveHeight = Math.abs(Math.sin(wavePhase));
                    
                    let barHeight;
                    if (isConnecting) {
                      // Gentle pulsing during connection
                      barHeight = 6 + (waveHeight * 8);
                    } else if (isSpeaking || audioLevel > 0.1) {
                      // Active audio visualization
                      const centerDistance = Math.abs(i - 12) / 12;
                      const centerFactor = 1 - (centerDistance * 0.7);
                      barHeight = 6 + (waveHeight * audioLevel * 28 * centerFactor);
                    } else {
                      // Idle state - gentle breathing
                      barHeight = 4 + (waveHeight * 6);
                    }
                    
                    const delay = i * 0.06;
                    const color = isConnecting 
                      ? "linear-gradient(180deg, #f59e0b, #fbbf24)"
                      : isSpeaking 
                        ? "linear-gradient(180deg, #3b82f6, #60a5fa)"
                        : "linear-gradient(180deg, #22c55e, #4ade80)";
                    
                    return (
                      <div
                        key={i}
                        style={{
                          width: 4,
                          height: `${Math.max(4, Math.min(barHeight, 32))}px`,
                          borderRadius: 2,
                          background: color,
                          transition: "height 0.15s ease-out",
                          animation: `wave ${0.8 + (i % 3) * 0.2}s ease-in-out infinite`,
                          animationDelay: `${delay}s`,
                          opacity: 0.9,
                        }}
                      />
                    );
                  })}
                </div>
                
                {/* Status Text - Only show when connected */}
                {!isConnecting && (
                  <div style={{ marginTop: 16, textAlign: "center" }}>
                    <p style={{ margin: 0, fontSize: 13, color: "#64748b", fontWeight: 500 }}>
                      {isSpeaking ? "Hear Knuut's response" : "Speak naturally"}
                    </p>
                  </div>
                )}
                
                {/* Transcription */}
                {transcription && !isConnecting && (
                  <div style={{ 
                    marginTop: 16, 
                    padding: "12px 14px", 
                    borderRadius: 10, 
                    background: "rgba(15,23,42,0.06)",
                    fontSize: 14,
                    color: "#475569",
                    lineHeight: 1.6,
                    border: "1px solid rgba(15,23,42,0.1)",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      You said:
                    </div>
                    "{transcription}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Helper Text - Only show when not active */}
          {!isActive && (
            <p style={{ margin: 0, fontSize: 13, opacity: 0.85, textAlign: "center", color: "#64748b", marginTop: 12 }}>
              Voice or text • Any language • No pressure
            </p>
          )}
        </div>
      )}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.15); }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes wave {
          0%, 100% { transform: scaleY(0.4); opacity: 0.8; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </>
  );
}
