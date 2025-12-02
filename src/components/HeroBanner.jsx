import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getBackdropUrl } from '../utils/api';
import { buttonVariants } from '../styles/buttonClasses';

const HeroBanner = ({ movie }) => {
  if (!movie) return null;

  const backdrop = getBackdropUrl(
    movie.backdrop_path || movie.poster_path,
    'w1280'
  );

  return (
    <section className="relative flex min-h-[60vh] flex-col justify-end overflow-hidden text-white sm:min-h-[70vh] lg:min-h-[90vh]">
      {backdrop && (
        <motion.div
          className="absolute inset-0 bg-cover bg-center brightness-90"
          style={{ backgroundImage: `url(${backdrop})` }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      )}

      <div className="absolute inset-0 bg-hero-overlay" />

      <motion.div
        className="relative z-10 max-w-2xl px-6 py-16 sm:px-10 sm:py-20 lg:py-28"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">
          Stream the latest cinematic adventures
        </p>
        <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">{movie.title}</h1>
        <p className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/80">
          {movie.vote_average ? (
            <>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                ⭐ {movie.vote_average?.toFixed(1)}
              </span>
            </>
          ) : null}
          {movie.release_date ? (
            <>
              <span>•</span>
              <span>{movie.release_date.slice(0, 4)}</span>
            </>
          ) : null}
          {movie.runtime ? (
            <>
              <span>•</span>
              <span>{movie.runtime} min</span>
            </>
          ) : null}
        </p>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80">{movie.overview}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link to={`/movie/${movie.id}`} className={buttonVariants.primary}>
            Watch Now
          </Link>
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants.ghost}
          >
            Powered by TMDB
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroBanner;


