import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const SplashScreen = ({ onComplete, videoSrc }) => {
  const [loading, setLoading] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const effectiveVideoSrc = videoSrc || '/intro.mp4';

  // Generate particles
  useEffect(() => {
    const particleCount = 50;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  // Handle video loading
  useEffect(() => {
    if (videoRef.current && effectiveVideoSrc) {
      const video = videoRef.current;
      
      const handleCanPlay = () => {
        setVideoReady(true);
        video.play().catch((err) => {
          console.log('Video autoplay prevented:', err);
          setVideoReady(true);
        });
      };

      const handleLoadedData = () => {
        setLoading(false);
      };

      const handleError = (e) => {
        console.warn('Video loading error:', e);
        setVideoReady(true); // Continue even if video fails
        setLoading(false);
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    } else {
      // No video provided, continue without it
      setVideoReady(true);
      setLoading(false);
    }
  }, [effectiveVideoSrc]);

  // Auto-complete after exactly 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 8000); // Exactly 8 seconds display

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Video Background */}
      {effectiveVideoSrc && (
        <div className="splash-screen__video-container">
          <video
            ref={videoRef}
            className="splash-screen__video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={effectiveVideoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="splash-screen__video-overlay" />
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="splash-screen__background">
        {/* Glowing red streaks */}
        <motion.div
          className="splash-screen__streak splash-screen__streak--1"
          animate={{
            x: [-100, 200],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="splash-screen__streak splash-screen__streak--2"
          animate={{
            x: [200, -100],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        {/* Animated Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="splash-screen__particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="splash-screen__content">
        <motion.div
          className="splash-screen__logo"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h1 className="splash-screen__title">
            <span className="splash-screen__title-stream">STREAM</span>
            <span className="splash-screen__title-savvy">SAVVY</span>
          </h1>
          <motion.p
            className="splash-screen__tagline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Unlimited Movies. Unlimited Entertainment.
          </motion.p>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default SplashScreen;

