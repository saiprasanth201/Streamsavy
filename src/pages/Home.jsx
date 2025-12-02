import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import MovieList from '../components/MovieList';
import SearchBar from '../components/SearchBar';
import GenreFilter from '../components/GenreFilter';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import AddMovieForm from '../components/AddMovieForm';
import {
  fetchGenres,
  fetchMoviesByGenre,
  fetchNowPlayingMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchUpcomingMovies,
  fetchMovieDetails,
  fetchSouthIndianMovies,
  searchMoviesWithCustom,
} from '../utils/api';
import { useNotifications } from '../context/NotificationContext.jsx';

const Home = ({ externalSearchTerm = '', onExternalSearchConsumed }) => {
  const [heroMovie, setHeroMovie] = useState(null);
  const [sections, setSections] = useState({});
  const [loadingSections, setLoadingSections] = useState(true);
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState('all');
  const [genreResults, setGenreResults] = useState([]);
  const [loadingGenre, setLoadingGenre] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [showAddMovieForm, setShowAddMovieForm] = useState(false);
  const { addNotifications } = useNotifications();
  const searchResultsRef = useRef(null);

  const sectionConfigs = useMemo(
    () => [
      { key: 'trending', title: 'Trending Now', fetcher: fetchTrendingMovies },
      { key: 'southIndian', title: 'South Indian Spotlight', fetcher: fetchSouthIndianMovies },
      { key: 'topRated', title: 'Top Rated', fetcher: fetchTopRatedMovies },
      { key: 'upcoming', title: 'Upcoming Premieres', fetcher: fetchUpcomingMovies },
      { key: 'nowPlaying', title: 'Now Playing In Theaters', fetcher: fetchNowPlayingMovies },
      { key: 'popular', title: 'Popular On StreamSavvy', fetcher: fetchPopularMovies },
    ],
    []
  );

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        setLoadingSections(true);
        const results = await Promise.all(
          sectionConfigs.map(async (section) => {
            const data = await section.fetcher();
            return [section.key, data.results || []];
          })
        );

        const sectionMap = Object.fromEntries(results);
        setSections(sectionMap);

        const heroCandidate =
          sectionMap.trending?.[0] ||
          sectionMap.southIndian?.[0] ||
          sectionMap.popular?.[0] ||
          sectionMap.topRated?.[0] ||
          sectionMap.nowPlaying?.[0] ||
          sectionMap.upcoming?.[0];

        if (heroCandidate) {
          try {
            const detailed = await fetchMovieDetails(heroCandidate.id);
            setHeroMovie(detailed);
          } catch (error) {
            console.error('Failed to fetch hero details', error);
            setHeroMovie(heroCandidate);
          }
        }
      } catch (error) {
        console.error('Failed to fetch homepage data', error);
      } finally {
        setLoadingSections(false);
      }
    };

    fetchHomepageData();
  }, [sectionConfigs]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!sections.trending || sections.trending.length === 0) return;
    const storageKey = 'streamsavvy_seen_trending_ids';
    let seenIds = [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        seenIds = JSON.parse(stored);
        if (!Array.isArray(seenIds)) {
          seenIds = [];
        }
      }
    } catch (error) {
      console.warn('Failed to parse seen trending ids', error);
      seenIds = [];
    }

    const freshItems = sections.trending.filter((movie) => movie && !seenIds.includes(movie.id));

    if (freshItems.length > 0) {
      addNotifications(
        freshItems.slice(0, 5).map((movie) => ({
          id: `trending-${movie.id}`,
          title: movie.title || movie.name || 'New title',
          message: `${movie.title || movie.name || 'A new title'} is now trending on StreamSavvy.`,
          timestamp: Date.now(),
        }))
      );

      const updatedIds = Array.from(new Set([...seenIds, ...freshItems.map((movie) => movie.id)]));
      try {
        localStorage.setItem(storageKey, JSON.stringify(updatedIds.slice(-100)));
      } catch (error) {
        console.warn('Failed to store trending ids', error);
      }
    }
  }, [sections.trending, addNotifications]);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await fetchGenres();
        setGenres(data.genres || []);
      } catch (error) {
        console.error('Failed to fetch genres', error);
      }
    };

    loadGenres();
  }, []);

  const handleSearch = useCallback(async (term) => {
    if (!term) {
      setSearchTerm('');
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    try {
      setSearchLoading(true);
      setSearchTerm(term);
      const data = await searchMoviesWithCustom(term);
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Failed to search movies', error);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!searchTerm || searchLoading) return;
    if (searchResultsRef.current) {
      searchResultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchTerm, searchLoading]);

  useEffect(() => {
    if (!externalSearchTerm) return;
    handleSearch(externalSearchTerm);
    onExternalSearchConsumed?.();
  }, [externalSearchTerm, handleSearch, onExternalSearchConsumed]);

  useEffect(() => {
    const loadGenreMovies = async () => {
      if (activeGenre === 'all') {
        setGenreResults([]);
        return;
      }

      try {
        setLoadingGenre(true);
        const data = await fetchMoviesByGenre(activeGenre);
        setGenreResults(data.results || []);
      } catch (error) {
        console.error('Failed to load genre movies', error);
      } finally {
        setLoadingGenre(false);
      }
    };

    loadGenreMovies();
  }, [activeGenre]);

  const handleSearchInput = (term) => {
    handleSearch(term);
  };

  const handleMovieAdded = () => {
    // Refresh the sections to include the new movie
    const fetchHomepageData = async () => {
      try {
        const results = await Promise.all(
          sectionConfigs.map(async (section) => {
            const data = await section.fetcher();
            return [section.key, data.results || []];
          })
        );
        const sectionMap = Object.fromEntries(results);
        setSections(sectionMap);
      } catch (error) {
        console.error('Failed to refresh homepage data', error);
      }
    };
    fetchHomepageData();
  };

  return (
    <div className="w-full">
      {loadingSections && !heroMovie ? (
        <Loader message="Loading your cinematic universe..." />
      ) : (
        <>
          <HeroBanner movie={heroMovie} />

          <div className="mx-auto w-full max-w-6xl px-4 py-10 lg:px-6">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <SearchBar
                onSearch={handleSearchInput}
                initialValue={searchTerm}
                className="mt-4 md:mt-0"
              />
              <button
                onClick={() => setShowAddMovieForm(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <span>+</span>
                Add Movie
              </button>
            </div>

            <GenreFilter
              genres={genres}
              activeGenre={activeGenre}
              onSelect={setActiveGenre}
            />

            {searchTerm ? (
              <div ref={searchResultsRef} className="scroll-mt-36 pt-4">
                <h2 className="mt-10 text-2xl font-semibold">
                  Search results for “{searchTerm}”
                </h2>
                {searchLoading ? (
                  <Loader message="Searching the catalog..." />
                ) : searchResults.length ? (
                  <MovieList
                    title=""
                    movies={searchResults}
                    layout="grid"
                    variant="poster"
                  />
                ) : (
                  <EmptyState
                    title="No titles found"
                    message="Try a different search term or explore other categories."
                  />
                )}
              </div>
            ) : null}

            {activeGenre !== 'all' ? (
              <>
                <h2 className="mt-12 text-2xl font-semibold text-white">We hand-picked these for you</h2>
                {loadingGenre ? (
                  <Loader message="Curating by genre..." />
                ) : genreResults.length ? (
                  <MovieList
                    title=""
                    movies={genreResults}
                    layout="grid"
                    variant="poster"
                  />
                ) : (
                  <EmptyState
                    title="Nothing in this genre yet"
                    message="Try another genre or clear the filter."
                  />
                )}
              </>
            ) : null}

            {activeGenre === 'all'
              ? sectionConfigs.map((section) => (
                <MovieList
                  key={section.key}
                  title={section.title}
                  movies={sections[section.key] || []}
                  layout="slider"
                  variant={section.key === 'nowPlaying' ? 'backdrop' : 'poster'}
                />
              ))
              : null}
          </div>
        </>
      )}

      {showAddMovieForm && (
        <AddMovieForm
          onMovieAdded={handleMovieAdded}
          onClose={() => setShowAddMovieForm(false)}
        />
      )}
    </div>
  );
};

export default Home;


