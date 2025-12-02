import { useEffect, useMemo, useState } from 'react';
import GenreFilter from '../components/GenreFilter';
import SearchBar from '../components/SearchBar';
import MovieList from '../components/MovieList';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import {
  fetchGenres,
  fetchMoviesByGenre,
  fetchPopularMovies,
  fetchPopularTV,
  fetchTopRatedMovies,
  fetchTopRatedTV,
  fetchTrending,
  fetchTVGenres,
  fetchTVShowsByGenre,
  fetchUpcomingMovies,
  fetchOnAirTV,
  searchMovies,
  searchTV,
} from '../utils/api';

const Browse = ({ mediaType }) => {
  const [genres, setGenres] = useState([]);
  const [activeGenre, setActiveGenre] = useState('all');
  const [genreResults, setGenreResults] = useState([]);
  const [sections, setSections] = useState({});
  const [loadingSections, setLoadingSections] = useState(true);
  const [loadingGenre, setLoadingGenre] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const pageTitle = mediaType === 'tv' ? 'TV Shows' : 'Movies';
  const mediaKey = mediaType === 'tv' ? 'tv' : 'movie';

  const sectionConfigs = useMemo(() => {
    if (mediaType === 'tv') {
      return [
        { key: 'trending', title: 'Trending This Week', fetcher: () => fetchTrending('tv') },
        { key: 'topRated', title: 'Top Rated Series', fetcher: fetchTopRatedTV },
        { key: 'onAir', title: 'On Air Tonight', fetcher: fetchOnAirTV },
        { key: 'popular', title: 'Popular on StreamSavvy', fetcher: fetchPopularTV },
      ];
    }

    return [
      { key: 'trending', title: 'Trending This Week', fetcher: () => fetchTrending('movie') },
      { key: 'topRated', title: 'Top Rated Films', fetcher: fetchTopRatedMovies },
      { key: 'upcoming', title: 'Coming Soon', fetcher: fetchUpcomingMovies },
      { key: 'popular', title: 'Popular on StreamSavvy', fetcher: fetchPopularMovies },
    ];
  }, [mediaType]);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = mediaType === 'tv' ? await fetchTVGenres() : await fetchGenres();
        setGenres(data.genres || []);
      } catch (error) {
        console.error('Failed to load genres', error);
      }
    };

    loadGenres();
  }, [mediaType]);

  useEffect(() => {
    const loadSections = async () => {
      try {
        setLoadingSections(true);
        const results = await Promise.all(
          sectionConfigs.map(async (section) => {
            const data = await section.fetcher();
            const normalized = (data.results || []).map((item) => ({
              ...item,
              media_type: mediaKey,
            }));
            return [section.key, normalized];
          })
        );
        setSections(Object.fromEntries(results));
      } catch (error) {
        console.error('Failed to load section data', error);
      } finally {
        setLoadingSections(false);
      }
    };

    loadSections();
  }, [sectionConfigs, mediaKey]);

  useEffect(() => {
    const loadGenreItems = async () => {
      if (activeGenre === 'all') {
        setGenreResults([]);
        return;
      }

      try {
        setLoadingGenre(true);
        const data =
          mediaType === 'tv'
            ? await fetchTVShowsByGenre(activeGenre)
            : await fetchMoviesByGenre(activeGenre);
        setGenreResults(
          (data.results || []).map((item) => ({
            ...item,
            media_type: mediaKey,
          }))
        );
      } catch (error) {
        console.error('Failed to load genre titles', error);
      } finally {
        setLoadingGenre(false);
      }
    };

    loadGenreItems();
  }, [activeGenre, mediaType, mediaKey]);

  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (!term) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const data = mediaType === 'tv' ? await searchTV(term) : await searchMovies(term);
      setSearchResults(
        (data.results || []).map((item) => ({
          ...item,
          media_type: mediaKey,
        }))
      );
    } catch (error) {
      console.error('Failed to search titles', error);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 lg:px-6">
      <div className="mb-6 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-white">{pageTitle}</h1>
        <p className="max-w-2xl text-white/70">
          Browse {pageTitle.toLowerCase()} curated for your cinematic taste.
        </p>
      </div>

      <SearchBar onSearch={handleSearch} initialValue={searchTerm} className="mt-2" />

      <GenreFilter
        genres={genres}
        activeGenre={activeGenre}
        onSelect={setActiveGenre}
      />

      {searchTerm ? (
        <>
          <h2 className="mt-10 text-2xl font-semibold text-white">
            Search results for “{searchTerm}”
          </h2>
          {searchLoading ? (
            <Loader message="Searching titles..." />
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
              message="Try refining your search or explore another genre."
            />
          )}
        </>
      ) : null}

      {activeGenre !== 'all' ? (
        <>
          <h2 className="mt-12 text-2xl font-semibold text-white">Genre spotlight</h2>
          {loadingGenre ? (
            <Loader message="Fetching titles..." />
          ) : genreResults.length ? (
            <MovieList
              title=""
              movies={genreResults}
              layout="grid"
              variant="poster"
            />
          ) : (
            <EmptyState
              title="No titles available"
              message="Choose a different genre to continue exploring."
            />
          )}
        </>
      ) : null}

      {activeGenre === 'all' ? (
        loadingSections ? (
          <Loader message="Loading collections..." />
        ) : (
          sectionConfigs.map((section) => (
            <MovieList
              key={section.key}
              title={section.title}
              movies={sections[section.key] || []}
              layout="slider"
              variant={section.key === 'onAir' ? 'backdrop' : 'poster'}
            />
          ))
        )
      ) : null}
    </div>
  );
};

export default Browse;


