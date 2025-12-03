import { useState, useRef, useEffect, useCallback } from 'react';
import { FiMic } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const VoiceSearchButton = ({ onVoiceResult, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [feedback, setFeedback] = useState('');
  const recognitionRef = useRef(null);
  const onVoiceResultRef = useRef(onVoiceResult);
  const feedbackTimeoutRef = useRef(null);

  useEffect(() => {
    onVoiceResultRef.current = onVoiceResult;
  }, [onVoiceResult]);

  const showFeedback = useCallback((message, duration = 3000) => {
    setFeedback(message);
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback('');
    }, duration);
  }, []);

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
      showFeedback('Listening... Speak now', 10000);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Voice search transcript:', transcript);
      showFeedback(`Searching for "${transcript}"`, 2000);
      if (onVoiceResultRef.current) {
        onVoiceResultRef.current(transcript);
      }
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);

      if (event.error === 'not-allowed') {
        showFeedback('Microphone access denied. Please enable microphone permissions.', 5000);
      } else if (event.error === 'no-speech') {
        showFeedback('No speech detected. Click the mic and try again.', 3000);
      } else if (event.error !== 'aborted') {
        showFeedback('Voice search failed. Please try again.', 3000);
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
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, [showFeedback]);

  const handleClick = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      showFeedback('Voice search is not supported in this browser. Use Chrome or Edge.', 4000);
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current.stop();
        setFeedback('');
      } catch (error) {
        console.error('Error stopping recognition:', error);
        setIsListening(false);
      }
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        showFeedback('Could not start voice recognition. Please try again.', 3000);
      }
    }
  }, [isListening, isSupported, showFeedback]);

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  return (
    <div className="relative">
      <motion.button
        type="button"
        className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border text-white transition disabled:opacity-40 ${
          isListening
            ? 'border-brand bg-brand/20 shadow-[0_0_16px_rgba(229,9,20,0.6)] animate-pulse'
            : 'border-white/10 bg-white/10 hover:border-brand/40 hover:bg-white/20'
        }`}
        onClick={handleClick}
        disabled={disabled}
        aria-label={isListening ? 'Listening... Click to stop' : 'Start voice search'}
        title={isListening ? 'Listening... Click to stop' : 'Click to start voice search'}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
      >
        {isListening ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <FiMic className="text-brand" />
          </motion.div>
        ) : (
          <FiMic />
        )}
        {isListening && (
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-brand shadow-[0_0_8px_rgba(229,9,20,0.8)] animate-pulse" />
        )}
      </motion.button>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute right-0 top-12 z-50 whitespace-nowrap rounded-xl border border-white/10 bg-black/90 px-4 py-2 text-sm text-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl"
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceSearchButton;
