import { motion } from 'framer-motion';
import MovieList from '../components/MovieList';
import EmptyState from '../components/EmptyState';
import { useWatchlist } from '../context/WatchlistContext';

const Watchlist = () => {
  const { items } = useWatchlist();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 lg:px-6">
      <motion.div
        className="mb-8 flex flex-col gap-2"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-semibold text-white">Your Watchlist</h1>
        <p className="max-w-2xl text-white/70">
          Save movies to watch later. We keep everything synced across your browser using
          local storage magic.
        </p>
      </motion.div>

      {items.length ? (
        <MovieList title="" movies={items} layout="grid" variant="poster" />
      ) : (
        <EmptyState
          title="Your watchlist is empty"
          message="Add movies from the homepage or search results to build your personal queue."
          ctaLabel="Discover titles"
          ctaHref="/"
        />
      )}
    </div>
  );
};

export default Watchlist;


