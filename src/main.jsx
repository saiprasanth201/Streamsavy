import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { WatchlistProvider } from './context/WatchlistContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

// Check API key on startup
const API_KEY = import.meta.env.VITE_TMDB_KEY;
if (!API_KEY || API_KEY === 'your_tmdb_api_key_here') {
  console.error('⚠️ TMDB API Key is missing or not set!');
  console.error('Please set VITE_TMDB_KEY in your .env file');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <WatchlistProvider>
              <App />
            </WatchlistProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
