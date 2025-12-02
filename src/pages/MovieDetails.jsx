import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import MovieList from '../components/MovieList';
import EmptyState from '../components/EmptyState';
import { useWatchlist } from '../context/WatchlistContext';
import {
  fetchMovieDetails,
  getBackdropUrl,
  getImageUrl,
} from '../utils/api';

const formatRuntime = (minutes) => {
  if (!minutes) return 'Unknown';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { add, remove, isInWatchlist } = useWatchlist();

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        const data = await fetchMovieDetails(id);
        setMovie(data);
      } catch (err) {
        console.error('Failed to load movie details', err);
        setError('Could not load this movie right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  if (loading) {
    return <Loader message="Entering the cinematic multiverse..." />;
  }

  if (error) {
    return <EmptyState title="Whoops!" message={error} />;
  }

  if (!movie) {
    return <EmptyState title="Movie not found" message="This title may have left the catalog." />;
  }

  const backdrop = getBackdropUrl(movie.backdrop_path, 'w1280');
  const poster = getImageUrl(movie.poster_path, 'w500');
  const trailer = movie.videos?.results?.find(
    (video) =>
      video.type === 'Trailer' &&
      video.site === 'YouTube' &&
      video.key
  );

  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlist = () => {
    if (inWatchlist) {
      remove(movie.id);
    } else {
      add({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        media_type: 'movie',
      });
    }
  };

  return (
    <div className="page page--details">
      <div className="details-hero">
        {backdrop && (
          <div
            className="details-hero__background"
            style={{ backgroundImage: `url(${backdrop})` }}
          />
        )}
        <div className="details-hero__overlay" />

        <div className="details-hero__content">
          {poster && (
            <motion.img
              src={poster}
              alt={`${movie.title} poster`}
              className="details-hero__poster"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}

          <motion.div
            className="details-hero__info"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1>{movie.title}</h1>
            <p className="details-hero__meta">
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              <span>•</span>
              <span>{movie.release_date?.slice(0, 4)}</span>
              <span>•</span>
              <span>{formatRuntime(movie.runtime)}</span>
              {movie.genres?.length ? (
                <>
                  <span>•</span>
                  <span>{movie.genres.map((genre) => genre.name).join(', ')}</span>
                </>
              ) : null}
            </p>
            <p className="details-hero__overview">{movie.overview || 'No synopsis available.'}</p>

            <div className="details-hero__actions">
              {trailer ? (
                <a
                  className="btn btn--primary"
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch Trailer
                </a>
              ) : null}
              <button
                className={`btn btn--ghost ${inWatchlist ? 'btn--ghost-active' : ''}`}
                onClick={handleWatchlist}
              >
                {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="details-grid">
        <motion.section
          className="details-grid__section"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h2>Synopsis</h2>
          <p>{movie.overview || 'No synopsis available.'}</p>
        </motion.section>

        {movie.credits?.cast?.length ? (
          <motion.section
            className="details-grid__section"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <h2>Cast</h2>
            <ul className="cast-list">
              {movie.credits.cast.slice(0, 10).map((person) => (
                <li key={person.cast_id}>
                  <span>{person.name}</span>
                  <small>{person.character}</small>
                </li>
              ))}
            </ul>
          </motion.section>
        ) : null}

        {movie.credits?.crew?.length ? (
          <motion.section
            className="details-grid__section"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            <h2>Crew</h2>
            <ul className="cast-list">
              {movie.credits.crew
                .filter((member) => ['Director', 'Writer', 'Screenplay'].includes(member.job))
                .slice(0, 6)
                .map((member) => (
                  <li key={`${member.credit_id}`}>
                    <span>{member.name}</span>
                    <small>{member.job}</small>
                  </li>
                ))}
            </ul>
          </motion.section>
        ) : null}
      </div>

      {movie.recommendations?.results?.length ? (
        <MovieList
          title="Because you watched this"
          movies={movie.recommendations.results.slice(0, 12)}
          layout="slider"
          variant="poster"
        />
      ) : movie.similar?.results?.length ? (
        <MovieList
          title="Similar titles"
          movies={movie.similar.results.slice(0, 12)}
          layout="slider"
          variant="poster"
        />
      ) : null}
    </div>
  );
};

export default MovieDetails;


