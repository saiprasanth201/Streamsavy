import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  addToWatchlistStorage,
  getWatchlist,
  isInWatchlistStorage,
  removeFromWatchlistStorage,
} from '../utils/localStorage';

const WatchlistContext = createContext(undefined);

export const WatchlistProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    return getWatchlist();
  });

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'streamsavvy_watchlist') {
        setItems(getWatchlist());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const add = (movie) => {
    const updated = addToWatchlistStorage(movie);
    setItems(updated);
  };

  const remove = (id) => {
    const updated = removeFromWatchlistStorage(id);
    setItems(updated);
  };

  const isInWatchlist = (id) => items.some((item) => item.id === id);

  const value = useMemo(
    () => ({
      items,
      add,
      remove,
      isInWatchlist,
    }),
    [items]
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};


