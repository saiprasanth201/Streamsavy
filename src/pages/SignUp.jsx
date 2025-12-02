import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiUnlock } from 'react-icons/fi';
import { isPasswordBreached } from '../utils/security';

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [pwnedCount, setPwnedCount] = useState(0);
  const [showPwnedPrompt, setShowPwnedPrompt] = useState(false);
  const [allowPwnedPassword, setAllowPwnedPassword] = useState(false);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push('Minimum 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('At least one uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('At least one number');
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setGeneralError(''); // Clear general error on input change
    setPwnedCount(0);
    setShowPwnedPrompt(false);
    setAllowPwnedPassword(false);

    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Validate password in real-time
    if (name === 'password') {
      const passwordErrors = validatePassword(value);
      if (passwordErrors.length > 0) {
        setPasswordError(passwordErrors.join(', '));
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCheckingPassword) return;

    const newErrors = {};

    // Validate fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordErrors = validatePassword(formData.password);
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors.join(', ');
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsCheckingPassword(true);
    try {
      const breachCount = await isPasswordBreached(formData.password);
      setPwnedCount(breachCount);

      if (breachCount > 0 && !allowPwnedPassword) {
        setGeneralError(
          `This password has appeared in known data breaches (${breachCount.toLocaleString()} times). Please choose a different password or proceed at your own risk.`
        );
        setShowPwnedPrompt(true);
        setIsCheckingPassword(false);
        return;
      }
    } catch (error) {
      console.error('Password pwned check failed:', error);
      setGeneralError('Failed to check password security. Please try again.');
      setIsCheckingPassword(false);
      return;
    } finally {
      setIsCheckingPassword(false);
    }

    completeSignUp();
  };

  const completeSignUp = () => {
    signUp({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
    });
    navigate('/payment');
  };

  const handleUsePasswordAnyway = () => {
    setAllowPwnedPassword(true);
    setShowPwnedPrompt(false);
    setGeneralError('');
    completeSignUp();
  };

  return (
    <div className="auth-page">
      <div
        className="auth-page__background"
        style={{
          backgroundImage:
            "url('https://analyticsindiamag.com/wp-content/uploads/2019/05/apps.55787.9007199266246365.687a10a8-4c4a-4a47-8ec5-a95f70d8852d.jpg')",
        }}
      />
      <div className="auth-page__overlay" />
      <div className="auth-page__container">
        <motion.div
          className="auth-page__content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="auth-page__title">Sign Up</h1>
          <p className="auth-page__subtitle">
            Create your account to start watching
          </p>

          <form onSubmit={handleSubmit} className="auth-page__form">
            {generalError && (
              <div className="auth-page__error-message">{generalError}</div>
            )}

            {/* Full Name */}
            <div className="auth-page__field">
              <label htmlFor="fullName" className="auth-page__label">
                Full Name
              </label>
              <div className="auth-page__input-wrapper">
                <FiUser className="auth-page__input-icon" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`auth-page__input ${
                    errors.fullName ? 'auth-page__input--error' : ''
                  }`}
                />
              </div>
              {errors.fullName && (
                <span className="auth-page__error">{errors.fullName}</span>
              )}
            </div>

            {/* Email */}
            <div className="auth-page__field">
              <label htmlFor="email" className="auth-page__label">
                Email Address
              </label>
              <div className="auth-page__input-wrapper">
                <FiMail className="auth-page__input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`auth-page__input ${
                    errors.email ? 'auth-page__input--error' : ''
                  }`}
                />
              </div>
              {errors.email && (
                <span className="auth-page__error">{errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className="auth-page__field">
              <label htmlFor="password" className="auth-page__label">
                Password
              </label>
              <div className="auth-page__input-wrapper">
                <FiLock className="auth-page__input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={`auth-page__input ${
                    errors.password || passwordError
                      ? 'auth-page__input--error'
                      : ''
                  }`}
                />
                <button
                  type="button"
                  className="auth-page__visibility-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiUnlock /> : <FiLock />}
                </button>
              </div>
              {(errors.password || passwordError) && (
                <span className="auth-page__error">
                  {errors.password || passwordError}
                </span>
              )}
            </div>

            <button type="submit" className="auth-page__button" disabled={isCheckingPassword}>
              {isCheckingPassword ? 'Checking password...' : 'Continue to Payment'}
            </button>

            {showPwnedPrompt && (
              <button
                type="button"
                className="auth-page__button auth-page__button--secondary"
                onClick={handleUsePasswordAnyway}
              >
                Use password anyway
              </button>
            )}
          </form>

          <div className="auth-page__footer">
            <p className="auth-page__footer-text">
              Already have an account?{' '}
              <Link to="/signin" className="auth-page__link">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;

