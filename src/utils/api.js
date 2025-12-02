const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

import { fetchCustomMovies } from './jsonServerApi.js';

const defaultParams = {
  language: 'en-US',
};

const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  const mergedParams = { ...defaultParams, ...params };

  Object.entries(mergedParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

const fetchFromTMDB = async (endpoint, params = {}) => {
  if (!API_KEY || API_KEY === 'your_tmdb_api_key_here') {
    console.error('⚠️ TMDB API Key is missing!');
    throw new Error(
      'Missing TMDB API key. Please set VITE_TMDB_KEY in your .env file and restart the dev server.'
    );
  }

  const url = buildUrl(endpoint, params);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const message = await response.text();
      throw new Error(`TMDB request failed: ${response.status} ${message}`);
    }

    return response.json();
  } catch (error) {
    console.error('TMDB API Error:', error);
    throw error;
  }
};

export const getImageUrl = (path, size = 'w500') =>
  path ? `${IMAGE_BASE_URL}/${size}${path}` : null;

export const getBackdropUrl = (path, size = 'w1280') =>
  path ? `${IMAGE_BASE_URL}/${size}${path}` : null;

export const fetchPopularMovies = (page = 1) =>
  fetchFromTMDB('movie/popular', { page });

export const fetchTrending = (mediaType = 'movie') =>
  fetchFromTMDB(`trending/${mediaType}/week`);

export const fetchTrendingMovies = () => fetchTrending('movie');

export const fetchTopRatedMovies = (page = 1) =>
  fetchFromTMDB('movie/top_rated', { page });

export const fetchTopRatedTV = (page = 1) =>
  fetchFromTMDB('tv/top_rated', { page });

export const fetchUpcomingMovies = (page = 1) =>
  fetchFromTMDB('movie/upcoming', { page });

export const fetchNowPlayingMovies = (page = 1) =>
  fetchFromTMDB('movie/now_playing', { page });

export const fetchOnAirTV = (page = 1) =>
  fetchFromTMDB('tv/on_the_air', { page });

export const searchMovies = (query, page = 1) =>
  fetchFromTMDB('search/movie', {
    query,
    page,
    include_adult: false,
  });

export const searchTV = (query, page = 1) =>
  fetchFromTMDB('search/tv', {
    query,
    page,
    include_adult: false,
  });

export const fetchMovieDetails = (id) =>
  fetchFromTMDB(`movie/${id}`, {
    append_to_response: 'videos,credits,recommendations,similar',
  });

export const fetchTVDetails = (id) =>
  fetchFromTMDB(`tv/${id}`, {
    append_to_response: 'videos,credits,recommendations,similar',
  });

export const fetchMoviesByGenre = (genreId, page = 1) =>
  fetchFromTMDB('discover/movie', {
    with_genres: genreId,
    sort_by: 'popularity.desc',
    page,
  });

export const fetchGenres = () => fetchFromTMDB('genre/movie/list');

export const fetchTVGenres = () => fetchFromTMDB('genre/tv/list');

export const fetchTVShowsByGenre = (genreId, page = 1) =>
  fetchFromTMDB('discover/tv', {
    with_genres: genreId,
    sort_by: 'popularity.desc',
    page,
  });

export const fetchPopularTV = (page = 1) =>
  fetchFromTMDB('tv/popular', { page });

export const fetchSouthIndianMovies = async () => {
  const languages = ['te', 'ta', 'ml', 'hi'];
  try {
    const responses = await Promise.all(
      languages.map((lang) =>
        fetchFromTMDB('discover/movie', {
          with_original_language: lang,
          sort_by: 'popularity.desc',
          page: 1,
          'vote_count.gte': 50,
        })
      )
    );

    const combined = [];
    const seen = new Set();

    responses.forEach((response) => {
      (response.results || []).forEach((movie) => {
        if (!seen.has(movie.id)) {
          seen.add(movie.id);
          combined.push(movie);
        }
      });
    });

    return { results: combined };
  } catch (error) {
    console.error('Failed to fetch South Indian movies', error);
    return { results: [] };
  }
};

// Combine TMDB movies with custom movies
export const fetchMoviesWithCustom = async (fetchFunction, ...args) => {
  try {
    const [tmdbResponse, customResponse] = await Promise.all([
      fetchFunction(...args),
      fetchCustomMovies()
    ]);

    const tmdbMovies = tmdbResponse.results || [];
    const customMovies = customResponse.results || [];

    // Add custom movies at the beginning
    const combinedResults = [...customMovies, ...tmdbMovies];

    return {
      ...tmdbResponse,
      results: combinedResults,
      total_results: (tmdbResponse.total_results || 0) + customMovies.length
    };
  } catch (error) {
    console.error('Error combining movies:', error);
    return await fetchFunction(...args);
  }
};

// Enhanced popular movies with custom movies
export const fetchPopularMoviesWithCustom = (page = 1) =>
  fetchMoviesWithCustom(fetchPopularMovies, page);

// Enhanced trending movies with custom movies
export const fetchTrendingMoviesWithCustom = () =>
  fetchMoviesWithCustom(fetchTrendingMovies);



// Search movies including custom ones
export const searchMoviesWithCustom = async (query, page = 1) => {
  try {
    const [tmdbResponse, customResponse] = await Promise.all([
      searchMovies(query, page),
      fetchCustomMovies()
    ]);

    const tmdbMovies = tmdbResponse.results || [];
    const customMovies = customResponse.results || [];

    // Filter custom movies by query (case-insensitive)
    const lowerQuery = query.toLowerCase();
    const matchingCustomMovies = customMovies.filter(movie =>
      (movie.title && movie.title.toLowerCase().includes(lowerQuery)) ||
      (movie.name && movie.name.toLowerCase().includes(lowerQuery))
    );

    // Add matching custom movies at the beginning
    const combinedResults = [...matchingCustomMovies, ...tmdbMovies];

    return {
      ...tmdbResponse,
      results: combinedResults,
      total_results: (tmdbResponse.total_results || 0) + matchingCustomMovies.length
    };
  } catch (error) {
    console.error('Error searching movies with custom:', error);
    return await searchMovies(query, page);
  }
};
