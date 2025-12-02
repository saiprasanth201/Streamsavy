const JSON_SERVER_URL = 'http://localhost:3001';

// Fetch all custom movies from JSON server
export const fetchCustomMovies = async () => {
  try {
    const response = await fetch(`${JSON_SERVER_URL}/movies`);
    if (!response.ok) {
      throw new Error('Failed to fetch custom movies');
    }
    const movies = await response.json();
    return { results: movies };
  } catch (error) {
    console.error('Error fetching custom movies:', error);
    return { results: [] };
  }
};

// Add a new movie to JSON server
export const addCustomMovie = async (movieData) => {
  try {
    const response = await fetch(`${JSON_SERVER_URL}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movieData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add movie');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding movie:', error);
    throw error;
  }
};

// Delete a custom movie
export const deleteCustomMovie = async (movieId) => {
  try {
    const response = await fetch(`${JSON_SERVER_URL}/movies/${movieId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete movie');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
};

// Update a custom movie
export const updateCustomMovie = async (movieId, movieData) => {
  try {
    const response = await fetch(`${JSON_SERVER_URL}/movies/${movieId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(movieData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update movie');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating movie:', error);
    throw error;
  }
};

// Get a single custom movie by ID
export const getCustomMovie = async (movieId) => {
  try {
    const response = await fetch(`${JSON_SERVER_URL}/movies/${movieId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch movie');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching movie:', error);
    throw error;
  }
};

// Helper function to create movie object from URL
export const createMovieFromUrl = (title, videoUrl, additionalData = {}) => {
  return {
    title,
    video_url: videoUrl,
    overview: additionalData.overview || `Custom movie: ${title}`,
    poster_path: additionalData.poster_path || null,
    backdrop_path: additionalData.backdrop_path || null,
    release_date: additionalData.release_date || new Date().toISOString().split('T')[0],
    vote_average: additionalData.vote_average || 0,
    vote_count: additionalData.vote_count || 0,
    genre_ids: additionalData.genre_ids || [],
    adult: false,
    original_language: additionalData.original_language || 'en',
    original_title: additionalData.original_title || title,
    popularity: additionalData.popularity || 0,
    video: true
  };
};