const STORAGE_KEY = 'streamsavvy_watchlist';

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.warn('Failed to parse watchlist from localStorage', error);
    return [];
  }
};

export const getWatchlist = () => {
  const value = localStorage.getItem(STORAGE_KEY);
  if (!value) return [];
  return safeParse(value);
};

const persistWatchlist = (items) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const addToWatchlistStorage = (movie) => {
  const current = getWatchlist();
  if (current.some((item) => item.id === movie.id)) {
    return current;
  }
  const updated = [...current, movie];
  persistWatchlist(updated);
  return updated;
};

export const removeFromWatchlistStorage = (id) => {
  const current = getWatchlist();
  const updated = current.filter((item) => item.id !== id);
  persistWatchlist(updated);
  return updated;
};

export const isInWatchlistStorage = (id) => {
  const current = getWatchlist();
  return current.some((item) => item.id === id);
};


