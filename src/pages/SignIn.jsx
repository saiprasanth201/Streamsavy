import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUnlock } from 'react-icons/fi';

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    const result = await signIn(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Invalid email or password');
    }
  };

  return (
    <div className="auth-page">
      <div
        className="auth-page__background"
        style={{
          backgroundImage:
            "url('https://cdn.mos.cms.futurecdn.net/rDJegQJaCyGaYysj2g5XWY.jpg')",
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
          <h1 className="auth-page__title">Sign In</h1>
          <p className="auth-page__subtitle">Login to continue watching</p>

          <form onSubmit={handleSubmit} className="auth-page__form">
            {error && <div className="auth-page__error-message">{error}</div>}

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
                  className="auth-page__input"
                />
              </div>
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
                  placeholder="Enter your password"
                  className="auth-page__input"
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
            </div>

            <button type="submit" className="auth-page__button">
              Sign In
            </button>
          </form>

          <p className="auth-page__footer">
            New to Streamsavvy?{' '}
            <Link to="/signup" className="auth-page__link">
              Sign up now
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;

