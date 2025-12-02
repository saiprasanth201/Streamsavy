import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiCheck } from 'react-icons/fi';

const Payment = () => {
  const navigate = useNavigate();
  const { hasCompletedSignUp, completePayment } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if user hasn't signed up
  useEffect(() => {
    if (!hasCompletedSignUp) {
      navigate('/signup');
    }
  }, [hasCompletedSignUp, navigate]);

  const handleCompletePayment = () => {
    setIsProcessing(true);

    // Simulate payment processing (2-3 seconds)
    setTimeout(() => {
      completePayment();
      setShowSuccess(true);
      setIsProcessing(false);

      // Redirect to sign in after showing success notification
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    }, 2500);
  };

  const features = [
    {
      title: 'Unlimited Streaming',
      description: 'Watch as much as you want, anytime',
    },
    {
      title: 'HD & 4K Quality',
      description: 'Crystal clear viewing experience',
    },
    {
      title: 'Ad-Free Experience',
      description: 'Enjoy uninterrupted entertainment',
    },
    {
      title: 'Cancel Anytime',
      description: 'No long-term commitments required',
    },
  ];

  return (
    <div className="payment-page">
      <div className="payment-page__background" />
      <div className="payment-page__overlay" />
      <div className="payment-page__container">
        <motion.div
          className="payment-page__content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="payment-page__title">Choose Your Plan</h1>
          <p className="payment-page__subtitle">
            Unlock unlimited access to premium content
          </p>

          <div className="payment-page__plan-card">
            <div className="payment-page__plan-header">
              <div className="payment-page__plan-left">
                <h2 className="payment-page__plan-name">Premium</h2>
                <p className="payment-page__plan-type">Monthly Subscription</p>
              </div>
              <div className="payment-page__plan-right">
                <div className="payment-page__plan-price">₹99</div>
                <p className="payment-page__plan-period">per month</p>
              </div>
            </div>

            <div className="payment-page__features">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="payment-page__feature"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="payment-page__feature-icon">
                    <FiCheck />
                  </div>
                  <div className="payment-page__feature-content">
                    <h3 className="payment-page__feature-title">
                      {feature.title}
                    </h3>
                    <p className="payment-page__feature-description">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <button
            onClick={handleCompletePayment}
            className="payment-page__button"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing Payment...' : 'Complete Payment'}
          </button>

          <Link to="/signup" className="payment-page__back-link">
            ← Back to Sign Up
          </Link>
        </motion.div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="payment-page__success"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="payment-page__success-icon">
              <FiCheck />
            </div>
            <div className="payment-page__success-content">
              <h3 className="payment-page__success-title">Payment Successful!</h3>
              <p className="payment-page__success-message">
                You can now login to your account
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payment;

