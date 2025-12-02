import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, useMemo } from 'react';
import {
  FiSearch,
  FiSun,
  FiMoon,
  FiBell,
  FiUser,
  FiChevronDown,
  FiLogOut,
  FiCreditCard,
  FiDownload,
  FiSettings,
  FiHelpCircle,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotifications } from '../context/NotificationContext.jsx';
import VoiceSearchButton from './VoiceSearchButton.jsx';

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/movies', label: 'Movies' },
  { to: '/tv', label: 'TV Shows' },
  { to: '/watchlist', label: 'Watchlist' },
];

const Navbar = ({ onSearch }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem('streamsavvy_theme') || 'dark';
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const { user, signOut } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  const displayName = useMemo(() => {
    if (user?.fullName) return user.fullName;
    if (user?.email) {
      const [name] = user.email.split('@');
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return 'StreamSavvy User';
  }, [user]);

  const initials = useMemo(() => displayName?.charAt(0)?.toUpperCase() || 'S', [displayName]);

  const profileMenuItems = useMemo(
    () => [
      { key: 'account', label: 'Account', Icon: FiUser },
      { key: 'subscription', label: 'Subscription', Icon: FiCreditCard },
      { key: 'downloads', label: 'Downloads', Icon: FiDownload },
      { key: 'settings', label: 'Settings', Icon: FiSettings },
      { key: 'help', label: 'Help Center', Icon: FiHelpCircle },
      { key: 'signout', label: 'Sign Out', Icon: FiLogOut, destructive: true },
    ],
    []
  );

  const notificationsToDisplay = useMemo(
    () => notifications.slice(0, 6),
    [notifications]
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setQuery('');
    setMobileSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('streamsavvy_theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (notificationsOpen && unreadCount > 0) {
      markAllAsRead();
    }
  }, [notificationsOpen, unreadCount, markAllAsRead]);

  const handleProfileOptionClick = (key) => {
    setProfileOpen(false);
    switch (key) {
      case 'signout':
        signOut();
        navigate('/signin');
        break;
      case 'account':
        navigate('/account');
        break;
      case 'subscription':
        navigate('/subscription');
        break;
      case 'downloads':
        navigate('/downloads');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'help':
        navigate('/help');
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query.trim()) return;

    onSearch?.(query.trim());
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const headerClasses = [
    'sticky top-0 z-[999] border-b backdrop-blur-xl transition-all duration-300',
    theme === 'dark'
      ? 'border-white/5 bg-gradient-to-b from-black/80 to-black/40 text-white'
      : 'border-black/10 bg-white/90 text-surface shadow-[0_10px_30px_rgba(17,17,26,0.1)]',
    scrolled ? 'shadow-[0_10px_30px_rgba(0,0,0,0.45)]' : '',
  ].join(' ');

  const navLinkClass = (isActive) =>
    `relative pb-1 font-medium transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-brand after:transition-transform ${
      isActive ? 'text-white after:scale-x-100' : 'text-white/70 hover:text-white'
    }`;

  const iconButtonClass =
    'relative inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/20';

  const profileTriggerClass =
    'flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white transition hover:bg-white/15';

  const mobileInputClass =
    'w-full rounded-full border border-white/10 bg-white/10 px-4 py-2 text-white placeholder:text-white/70 focus:border-brand/40 focus:outline-none';

  return (
    <header className={headerClasses}>
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 lg:gap-6 lg:px-6">
        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={() => {
            if (location.pathname === '/') {
              onSearch?.('');
            }
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#E50914" />
              <path d="M12 9L23 16L12 23V9Z" fill="white" />
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-baseline gap-1 text-2xl font-bold">
              <span className="text-white">Stream</span>
              <span className="text-brand">Savvy</span>
            </div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-white/60">
              Premium Entertainment
            </span>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center gap-5 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => navLinkClass(isActive)} end={link.exact}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <form
          className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-white transition focus-within:border-brand/40 focus-within:bg-white/20 lg:flex"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Search titles..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-48 bg-transparent text-sm text-white placeholder:text-white/70 focus:outline-none"
          />
          <button type="submit" aria-label="Search StreamSavvy" className="text-white/70">
            <FiSearch />
          </button>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <button
            className="hidden rounded-full border border-white/10 bg-white/10 p-2 text-white lg:inline-flex"
            onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>

          <div className="relative flex items-center" ref={notificationsRef}>
            <button
              type="button"
              className={iconButtonClass}
              aria-label="Notifications"
              onClick={() => setNotificationsOpen((prev) => !prev)}
            >
              <FiBell />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white shadow-brand-lg">
                  {Math.min(unreadCount, 9)}
                </span>
              )}
            </button>
            <VoiceSearchButton onVoiceResult={onSearch} />
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  className="absolute right-0 top-12 w-72 rounded-2xl border border-white/10 bg-black/90 p-4 text-sm shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="mb-3 text-base font-semibold text-white">Notifications</div>
                  <div className="flex max-h-80 flex-col gap-3 overflow-y-auto">
                    {notificationsToDisplay.length === 0 ? (
                      <div className="text-center text-white/70">You're all caught up!</div>
                    ) : (
                      notificationsToDisplay.map((notification) => (
                        <div key={notification.id} className="grid gap-1 text-white/80">
                          <div className="font-semibold text-white">{notification.title}</div>
                          <div className="text-sm text-white/70">{notification.message}</div>
                          {notification.timestamp && (
                            <div className="text-xs text-white/50">
                              {new Date(notification.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative flex items-center" ref={profileRef}>
            <button
              type="button"
              className={profileTriggerClass}
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-label="User menu"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark font-semibold">
                {initials}
              </div>
              <FiChevronDown className={`transition ${profileOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  className="absolute right-0 top-12 w-64 rounded-2xl border border-white/10 bg-black/95 p-4 text-sm shadow-[0_22px_48px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/20 text-xl text-brand">
                      <FiUser />
                    </div>
                    <div>
                      <span className="block font-semibold text-white">{displayName}</span>
                      <small className="text-white/70">Premium Member</small>
                    </div>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="mt-3 flex flex-col gap-2">
                    {profileMenuItems.map(({ key, label, Icon, destructive }) => (
                      <button
                        key={key}
                        type="button"
                        className={`flex items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                          destructive ? 'text-red-400 hover:bg-red-500/10' : 'text-white/80 hover:bg-white/10'
                        }`}
                        onClick={() => handleProfileOptionClick(key)}
                      >
                        <Icon />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            className={`${iconButtonClass} lg:hidden`}
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            aria-label="Open search"
          >
            <FiSearch />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.form
            className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 pb-4 lg:hidden"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <input
              type="text"
              placeholder="Search titles..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className={mobileInputClass}
            />
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-brand to-brand-light px-4 py-2 font-semibold text-white"
            >
              Search
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;


