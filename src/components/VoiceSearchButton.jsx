import { useState, useRef, useEffect, useCallback } from 'react';
import { FiMic, FiMicOff } from 'react-icons/fi';
import { motion } from 'framer-motion';

const VoiceSearchButton = ({ onVoiceResult, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);
  const onVoiceResultRef = useRef(onVoiceResult);

  useEffect(() => {
    onVoiceResultRef.current = onVoiceResult;
  }, [onVoiceResult]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onVoiceResultRef.current) {
        onVoiceResultRef.current(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);

      if (event.error === 'not-allowed') {
        alert('Microphone permission denied. Please allow microphone access to use voice search.');
      } else if (event.error === 'no-speech') {
        alert('No speech detected. Please try again.');
      } else if (event.error !== 'aborted') {
        alert('Voice search failed. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    };
  }, []);

  const handleClick = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      alert('Voice search is not supported in this browser. Please use a modern browser like Chrome or Edge.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
        setIsListening(false);
      }
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        alert('Could not start voice recognition. Please try again.');
      }
    }
  }, [isListening, isSupported]);

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
