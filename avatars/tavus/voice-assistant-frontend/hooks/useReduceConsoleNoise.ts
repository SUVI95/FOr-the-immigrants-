import { useEffect } from 'react';
import { setLogLevel, LogLevel } from 'livekit-client';

/**
 * Reduces console noise by setting LiveKit log level to 'warn'
 * This suppresses debug messages like "publishing track" and "silence detected"
 */
export default function useReduceConsoleNoise() {
  useEffect(() => {
    // Set LiveKit log level to 'warn' to reduce console noise
    // Options: 'debug' | 'info' | 'warn' | 'error' | 'silent'
    setLogLevel('warn');
    
    // Optionally suppress React DevTools message (browser extension suggestion)
    // This is just a browser suggestion, not an error
    
    return () => {
      // Reset to default on unmount if needed
      // setLogLevel('info');
    };
  }, []);
}

