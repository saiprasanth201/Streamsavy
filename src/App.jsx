import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import LoadingPage from './components/LoadingPage.jsx';
import LandingPage from './components/LandingPage.jsx';
import Home from './pages/Home.jsx';
import Browse from './pages/Browse.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import TvDetails from './pages/TvDetails.jsx';
import CustomMovieDetails from './pages/CustomMovieDetails.jsx';
import Watchlist from './pages/Watchlist.jsx';
import SignUp from './pages/SignUp.jsx';
import SignIn from './pages/SignIn.jsx';
import Payment from './pages/Payment.jsx';
import Account from './pages/Account.jsx';
import Subscription from './pages/Subscription.jsx';
import Downloads from './pages/Downloads.jsx';
import Settings from './pages/Settings.jsx';
import Help from './pages/Help.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import NotFound from './pages/NotFound.jsx';

const AppRoutes = ({ homeSearchTerm, onClearHomeSearch }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/payment" element={<Payment />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home
                externalSearchTerm={homeSearchTerm}
                onExternalSearchConsumed={onClearHomeSearch}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movies"
          element={
            <ProtectedRoute>
              <Browse mediaType="movie" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tv"
          element={
            <ProtectedRoute>
              <Browse mediaType="tv" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movie/:id"
          element={
            <ProtectedRoute>
              <MovieDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tv/:id"
          element={
            <ProtectedRoute>
              <TvDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/custom-movie/:id"
          element={
            <ProtectedRoute>
              <CustomMovieDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <ProtectedRoute>
              <Subscription />
            </ProtectedRoute>
          }
        />
        <Route
          path="/downloads"
          element={
            <ProtectedRoute>
              <Downloads />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <Help />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [homeSearchTerm, setHomeSearchTerm] = useState('');
  const [showSplash, setShowSplash] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showLanding, setShowLanding] = useState(false);
  const [hasSeenSplash, setHasSeenSplash] = useState(false);

  // Check if user has seen splash before (optional - remove if you want it every time)
  useEffect(() => {
    const seen = sessionStorage.getItem('streamsavvy_splash_seen');
    if (seen) {
      setShowSplash(false);
      setHasSeenSplash(true);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setShowLoading(true);
    setHasSeenSplash(true);
    sessionStorage.setItem('streamsavvy_splash_seen', 'true');
  };

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setShowLanding(true);
  };

  const handleLandingComplete = () => {
    setShowLanding(false);
  };

  // Video paths from public folder
  const splashVideoSrc = '/intro.mp4';
  const loadingVideoSrc = '/load.mp4';
  const landingVideoSrc = '/hero.mp4';

  return (
    <div className="flex min-h-screen flex-col bg-app-gradient text-white">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen
            key="splash"
            onComplete={handleSplashComplete}
            videoSrc={splashVideoSrc}
          />
        ) : showLoading ? (
          <LoadingPage
            key="loading"
            onComplete={handleLoadingComplete}
            videoSrc={loadingVideoSrc}
          />
        ) : showLanding ? (
          <LandingPage
            key="landing"
            onComplete={handleLandingComplete}
            videoSrc={landingVideoSrc}
          />
        ) : (
          <>
            <Navbar onSearch={setHomeSearchTerm} />
            <ScrollToTop />
            <main className="flex flex-1 flex-col">
              <AppRoutes
                homeSearchTerm={homeSearchTerm}
                onClearHomeSearch={() => setHomeSearchTerm('')}
              />
            </main>
            <Footer />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
