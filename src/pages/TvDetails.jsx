import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loader from '../components/Loader';
import MovieList from '../components/MovieList';
import EmptyState from '../components/EmptyState';
import { useWatchlist } from '../context/WatchlistContext';
import {
  fetchTVDetails,
  getBackdropUrl,
  getImageUrl,
} from '../utils/api';

const formatEpisodeRuntime = (minutesArray) => {
  if (!minutesArray?.length) return 'Unknown';
  const minutes = minutesArray[0];
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours ? `${hours}h ${mins}m` : `${mins}m`;
};

const TvDetails = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { add, remove, isInWatchlist } = useWatchlist();

  useEffect(() => {
    const loadShow = async () => {
      try {
        setLoading(true);
        const data = await fetchTVDetails(id);
        setShow(data);
      } catch (err) {
        console.error('Failed to load show details', err);
        setError('Could not load this show right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadShow();
  }, [id]);

  if (loading) {
    return <Loader message="Tuning into the next episode..." />;
  }

  if (error) {
    return <EmptyState title="Whoops!" message={error} />;
  }

  if (!show) {
    return (
      <EmptyState
        title="Show not found"
        message="This series may have wrapped production or left the catalog."
      />
    );
  }

  const backdrop = getBackdropUrl(show.backdrop_path, 'w1280');
  const poster = getImageUrl(show.poster_path, 'w500');
  const trailer = show.videos?.results?.find(
    (video) =>
      video.type === 'Trailer' &&
      video.site === 'YouTube' &&
      video.key
  );

  const inWatchlist = isInWatchlist(show.id);

  const handleWatchlist = () => {
    if (inWatchlist) {
      remove(show.id);
    } else {
      add({
        id: show.id,
        title: show.name,
        name: show.name,
        poster_path: show.poster_path,
        backdrop_path: show.backdrop_path,
        vote_average: show.vote_average,
        first_air_date: show.first_air_date,
        media_type: 'tv',
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
              alt={`${show.name} poster`}
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
            <h1>{show.name}</h1>
            <p className="details-hero__meta">
              <span>⭐ {show.vote_average?.toFixed(1)}</span>
              <span>•</span>
              <span>
                {show.first_air_date?.slice(0, 4)} —{' '}
                {show.status === 'Ended'
                  ? show.last_air_date?.slice(0, 4)
                  : 'Present'}
              </span>
              <span>•</span>
              <span>{formatEpisodeRuntime(show.episode_run_time)}</span>
              <span>•</span>
              <span>{show.number_of_seasons} seasons</span>
            </p>
            <p className="details-hero__overview">
              {show.overview || 'No synopsis available.'}
            </p>

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
          <p>{show.overview || 'No synopsis available.'}</p>
        </motion.section>

        {show.created_by?.length ? (
          <motion.section
            className="details-grid__section"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <h2>Creators</h2>
            <ul className="cast-list">
              {show.created_by.map((creator) => (
                <li key={creator.id}>
                  <span>{creator.name}</span>
                  <small>Creator</small>
                </li>
              ))}
            </ul>
          </motion.section>
        ) : null}

        {show.credits?.cast?.length ? (
          <motion.section
            className="details-grid__section"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            <h2>Cast</h2>
            <ul className="cast-list">
              {show.credits.cast.slice(0, 10).map((person) => (
                <li key={`${person.credit_id}`}>
                  <span>{person.name}</span>
                  <small>{person.character}</small>
                </li>
              ))}
            </ul>
          </motion.section>
        ) : null}
      </div>

      {show.recommendations?.results?.length ? (
        <MovieList
          title="You might also like"
          movies={show.recommendations.results
            .slice(0, 12)
            .map((item) => ({ ...item, media_type: 'tv' }))}
          layout="slider"
          variant="poster"
        />
      ) : show.similar?.results?.length ? (
        <MovieList
          title="Similar shows"
          movies={show.similar.results
            .slice(0, 12)
            .map((item) => ({ ...item, media_type: 'tv' }))}
          layout="slider"
          variant="poster"
        />
      ) : null}
    </div>
  );
};

export default TvDetails;


