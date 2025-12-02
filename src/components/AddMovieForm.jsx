import { useState } from 'react';
import { addCustomMovie, createMovieFromUrl } from '../utils/jsonServerApi';
import { getYouTubeDetails, getYouTubeId } from '../utils/youtubeApi';

const AddMovieForm = ({ onMovieAdded, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    overview: '',
    posterUrl: '',
    backdropUrl: '',
    releaseDate: '',
    rating: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let movieData = createMovieFromUrl(formData.title, formData.videoUrl, {
        overview: formData.overview,
        poster_path: formData.posterUrl,
        backdrop_path: formData.backdropUrl,
        release_date: formData.releaseDate,
        vote_average: parseFloat(formData.rating) || 0
      });

      // If it's a YouTube URL and fields are empty, try to fetch details
      const isYouTube = formData.videoUrl.includes('youtube.com') || formData.videoUrl.includes('youtu.be');
      if (isYouTube) {
        const youtubeDetails = await getYouTubeDetails(formData.videoUrl);
        if (youtubeDetails) {
          const youtubeId = getYouTubeId(formData.videoUrl);
          movieData = {
            ...movieData,
            title: formData.title || youtubeDetails.title,
            overview: formData.overview || `YouTube video by ${youtubeDetails.author_name}`,
            poster_path: formData.posterUrl || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
            backdrop_path: formData.backdropUrl || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
          };
        } else {
          // Fallback if YouTube details fetch fails but it is a YouTube URL
          const youtubeId = getYouTubeId(formData.videoUrl);
          if (youtubeId) {
            movieData.poster_path = formData.posterUrl || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
            movieData.backdrop_path = formData.backdropUrl || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
          }
        }
      }

      // Final fallback for poster if still empty
      if (!movieData.poster_path) {
        movieData.poster_path = 'https://via.placeholder.com/500x750?text=No+Image';
      }

      const newMovie = await addCustomMovie(movieData);
      onMovieAdded?.(newMovie);
      onClose?.();

      // Reset form
      setFormData({
        title: '',
        videoUrl: '',
        overview: '',
        posterUrl: '',
        backdropUrl: '',
        releaseDate: '',
        rating: ''
      });
    } catch (err) {
      setError('Failed to add movie. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill YouTube details when URL is entered
    if (name === 'videoUrl' && (value.includes('youtube.com') || value.includes('youtu.be'))) {
      try {
        const youtubeDetails = await getYouTubeDetails(value);
        if (youtubeDetails) {
          const youtubeId = getYouTubeId(value);
          setFormData(prev => ({
            ...prev,
            title: prev.title || youtubeDetails.title,
            overview: prev.overview || `YouTube video by ${youtubeDetails.author_name}`,
            posterUrl: prev.posterUrl || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
            backdropUrl: prev.backdropUrl || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
          }));
        }
      } catch (error) {
        console.error('Error fetching YouTube details:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Add Custom Movie</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-red-500 focus:outline-none"
              placeholder="Enter movie title"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Video URL *</label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              required
              className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-red-500 focus:outline-none"
              placeholder="https://example.com/movie.mp4"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Overview</label>
            <textarea
              name="overview"
              value={formData.overview}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-red-500 focus:outline-none"
              placeholder="Movie description"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Poster URL</label>
            <input
              type="url"
              name="posterUrl"
              value={formData.posterUrl}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-red-500 focus:outline-none"
              placeholder="https://example.com/poster.jpg"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Backdrop URL</label>
            <input
              type="url"
              name="backdropUrl"
              value={formData.backdropUrl}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-red-500 focus:outline-none"
              placeholder="https://example.com/backdrop.jpg"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Release Date</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Rating (0-10)</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="10"
              step="0.1"
              className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:border-red-500 focus:outline-none"
              placeholder="8.5"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Movie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovieForm;