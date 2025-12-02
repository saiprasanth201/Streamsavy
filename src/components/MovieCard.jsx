import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/api';
import { useWatchlist } from '../context/WatchlistContext';

const MovieCard = ({ movie, variant = 'poster' }) => {
  const { add, remove, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);

  const isCustomMovie = movie.video_url;
  const title = movie.title || movie.name;
  const releaseYear =
    movie.release_date?.slice(0, 4) || movie.first_air_date?.slice(0, 4) || 'Unknown';

  const normalizedMovie = {
    id: movie.id,
    title,
    name: movie.name,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
    first_air_date: movie.first_air_date,
    media_type: movie.media_type || 'movie',
  };

  const handleWatchlist = () => {
    if (inWatchlist) {
      remove(movie.id);
    } else {
      add(normalizedMovie);
    }
  };

  const poster = movie.poster_path
    ? movie.poster_path.startsWith('http')
      ? movie.poster_path
      : getImageUrl(
        variant === 'backdrop' ? movie.backdrop_path : movie.poster_path,
        variant === 'backdrop' ? 'w780' : 'w500'
      )
    : 'https://via.placeholder.com/500x750?text=No+Image';

  return (
    <motion.article
      className={`group relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/5 shadow-[0_16px_28px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_36px_rgba(0,0,0,0.45)] ${
        variant === 'backdrop' ? 'min-w-[280px]' : ''
      }`}
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <div className="relative">
        <Link to={isCustomMovie ? `/custom-movie/${movie.id}` : `/movie/${movie.id}`}>
          {poster ? (
            <img
              src={poster}
              alt={`${movie.title} poster`}
              loading="lazy"
              className={`w-full ${variant === 'backdrop' ? 'aspect-[16/9]' : 'aspect-[2/3]'} object-cover`}
            />
          ) : (
            <div className="grid h-80 place-items-center text-white/50">No image</div>
          )}
          {isCustomMovie && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="text-4xl">▶️</div>
            </div>
          )}
        </Link>
        <motion.button
          className={`absolute left-1/2 bottom-5 -translate-x-1/2 rounded-full px-4 py-2 font-semibold text-white transition-all duration-200 ${
            inWatchlist
              ? 'bg-gradient-to-r from-brand to-brand-dark shadow-brand-lg'
              : 'bg-black/80 hover:bg-black'
          }`}
          onClick={handleWatchlist}
          whileTap={{ scale: 0.92 }}
        >
          {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        </motion.button>
      </div>

      <div className="px-5 py-4">
        <Link
          to={
            isCustomMovie
              ? `/custom-movie/${movie.id}`
              : `/${normalizedMovie.media_type === 'tv' ? 'tv' : 'movie'}/${movie.id}`
          }
          className="text-base font-semibold text-white transition-colors hover:text-brand"
        >
          {title}
        </Link>
        <div className="mt-3 flex items-center justify-between text-sm text-white/70">
          <span>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
          <span>{releaseYear}</span>
          {isCustomMovie && (
            <span className="rounded border border-brand/40 bg-brand/10 px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-brand">
              Custom
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
};

export default MovieCard;
