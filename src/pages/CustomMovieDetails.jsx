import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCustomMovie } from '../utils/jsonServerApi';
import { getYouTubeId } from '../utils/youtubeApi';
import { fetchPopularMovies } from '../utils/api';
import { useWatchlist } from '../context/WatchlistContext';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import MovieList from '../components/MovieList';

const CustomMovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { add, remove, isInWatchlist } = useWatchlist();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieData, popularData] = await Promise.all([
          getCustomMovie(id),
          fetchPopularMovies()
        ]);
        setMovie(movieData);
        setRecommendations(popularData.results || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <Loader message="Loading your custom title..." />;
  }

  if (!movie) {
    return <EmptyState title="Movie not found" message="This custom title may have been removed." />;
  }

  const isYouTube = movie.video_url?.includes('youtube.com') || movie.video_url?.includes('youtu.be');
  const youtubeId = isYouTube ? getYouTubeId(movie.video_url) : null;

  // Use high-res YouTube thumbnail if available and no poster/backdrop provided
  const backdropUrl = movie.backdrop_path || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null);
  const posterUrl = movie.poster_path || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null);

  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlist = () => {
    if (inWatchlist) {
      remove(movie.id);
    } else {
      add(movie);
    }
  };

  const handleWatchClick = () => {
    if (movie.video_url) {
      window.open(movie.video_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="page page--details">
      <div className="details-hero">
        {backdropUrl && (
          <div
            className="details-hero__background"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          />
        )}
        <div className="details-hero__overlay" />

        <div className="details-hero__content">
          {posterUrl && (
            <motion.img
              src={posterUrl}
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
              <span>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
              <span>•</span>
              <span>{movie.release_date?.slice(0, 4) || 'Unknown'}</span>
              <span>•</span>
              <span className="rounded border border-brand/40 bg-brand/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-brand">
                Custom Content
              </span>
            </p>
            <p className="details-hero__overview">{movie.overview || 'No synopsis available.'}</p>

            <div className="details-hero__actions">
              <button
                className="btn btn--primary"
                onClick={handleWatchClick}
              >
                ▶️ Watch Now
              </button>

              <button
                className={`btn btn--ghost ${inWatchlist ? 'btn--ghost-active' : ''}`}
                onClick={handleWatchlist}
              >
                {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </button>

              <button
                className="btn btn--ghost"
                onClick={() => navigate(-1)}
              >
                Back
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
              {movie.credits.crew.slice(0, 6).map((member) => (
                <li key={member.credit_id}>
                  <span>{member.name}</span>
                  <small>{member.job}</small>
                </li>
              ))}
            </ul>
          </motion.section>
        ) : null}
      </div>

      {recommendations.length > 0 && (
        <MovieList
          title="You might also like"
          movies={recommendations.slice(0, 12)}
          layout="slider"
          variant="poster"
        />
      )}
    </div>
  );
};

export default CustomMovieDetails;