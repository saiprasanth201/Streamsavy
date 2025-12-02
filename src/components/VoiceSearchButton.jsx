import { useState, useRef, useEffect } from 'react';
import { FiMic, FiMicOff } from 'react-icons/fi';
import { motion } from 'framer-motion';

const VoiceSearchButton = ({ onVoiceResult, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onVoiceResult(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        // Handle specific errors
        if (event.error === 'not-allowed') {
          alert('Microphone permission denied. Please allow microphone access to use voice search.');
        } else if (event.error === 'no-speech') {
          alert('No speech detected. Please try again.');
        } else {
          alert('Voice search failed. Please try again.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onVoiceResult]);

  const handleClick = () => {
    if (!isSupported) {
      alert('Voice search is not supported in this browser. Please use a modern browser like Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  return (
    <motion.button
      type="button"
      className={`relative inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/20 disabled:opacity-40 ${
        isListening ? 'bg-brand/20 shadow-brand-lg animate-pulse' : ''
      }`}
      onClick={handleClick}
      disabled={disabled}
      aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
      whileTap={{ scale: 0.95 }}
    >
      {isListening ? <FiMicOff /> : <FiMic />}
      {isListening && (
        <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-brand shadow-[0_0_8px_rgba(229,9,20,0.8)]" />
      )}
    </motion.button>
  );
};

export default VoiceSearchButton;
