import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const LoadingPage = ({ onComplete, videoSrc }) => {
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const [particles, setParticles] = useState([]);

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
    if (videoRef.current && videoSrc) {
      const video = videoRef.current;
      
      const handleCanPlay = () => {
        video.play().catch((err) => {
          console.log('Video autoplay prevented:', err);
        });
      };

      const handleError = (e) => {
        console.warn('Video loading error:', e);
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [videoSrc]);

  // Progress animation
  useEffect(() => {
    const duration = 5000; // 5 seconds to reach 100%
    const interval = 50; // Update every 50ms
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Redirect when progress reaches 100%
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        onComplete();
      }, 300); // Small delay after reaching 100%

      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      className="loading-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Video Background */}
      {videoSrc && (
        <div className="loading-page__video-container">
          <video
            ref={videoRef}
            className="loading-page__video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="loading-page__video-overlay" />
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="loading-page__background">
        {/* Glowing red streaks */}
        <motion.div
          className="loading-page__streak loading-page__streak--1"
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
          className="loading-page__streak loading-page__streak--2"
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
            className="loading-page__particle"
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
      <div className="loading-page__content">
        {/* Logo + Circular Loader */}
<motion.div
  className="loading-page__logo"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2 }}
>
  {/* LOGO */}
  <div className="loading-page__logo-icon">
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="32" height="32" rx="6" fill="#E50914" />
      <path d="M12 9L23 16L12 23V9Z" fill="white" />
    </svg>
  </div>

  <div className="loading-page__logo-text">
    <div className="loading-page__logo-title">
      <span className="loading-page__logo-stream">STREAM</span>
      <span className="loading-page__logo-savvy">SAVVY</span>
    </div>
    <div className="loading-page__logo-tagline">PREMIUM ENTERTAINMENT</div>
  </div>

   {/* Circular Loop Loader */}
   <div className="loading-page__circular-loop">
     {/* Outer spinner */}
     <div className="loading-page__spinner loading-page__spinner--outer"></div>
     {/* Inner spinner */}
     <div className="loading-page__spinner loading-page__spinner--inner"></div>
   </div>
</motion.div>


        {/* Line Loader with Percentage */}
        <motion.div
          className="loading-page__line-loader-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="loading-page__line-loader">
            <motion.div
              className="loading-page__line-progress"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="loading-page__percentage">{Math.round(progress)}%</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingPage;
