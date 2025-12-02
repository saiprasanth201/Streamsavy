import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = ({ onComplete, videoSrc }) => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
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

  const handleGetStarted = () => {
    if (onComplete) {
      onComplete();
    }
    navigate('/signup');
  };

  const handleSignIn = () => {
    if (onComplete) {
      onComplete();
    }
    navigate('/signin');
  };

  return (
    <div className="landing-page">
      {/* Video Background */}
      {videoSrc && (
        <video
          ref={videoRef}
          className="landing-page__video"
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
        />
      )}

      {/* Overlay */}
      <div className="landing-page__overlay" />

      {/* Animated Streaks */}
      <div className="landing-page__streaks">
        <div className="landing-page__streak landing-page__streak--1" />
        <div className="landing-page__streak landing-page__streak--2" />
        <div className="landing-page__streak landing-page__streak--3" />
      </div>

      {/* Particles */}
      <div className="landing-page__particles">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="landing-page__particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="landing-page__content">
        <motion.div
          className="landing-page__text"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Main Heading */}
          <h1 className="landing-page__heading">
            Unlimited movies, anime,
            <br />
            and more.
          </h1>

          {/* Subheading */}
          <p className="landing-page__subheading">
            Watch anywhere. Cancel anytime.
          </p>

          {/* Description */}
          <p className="landing-page__description">
            Ready to watch? Sign up to create or restart your membership.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="landing-page__buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button
            className="landing-page__button landing-page__button--primary"
            onClick={handleGetStarted}
          >
            <span>Get Started</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 4L10 8L6 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            className="landing-page__button landing-page__button--secondary"
            onClick={handleSignIn}
          >
            Sign In
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;

