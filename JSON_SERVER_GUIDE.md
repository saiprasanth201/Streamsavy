# JSON Server Setup Guide

## Overview
This project now includes JSON Server functionality to manage custom movies with video URLs. You can add your own movies that will be displayed alongside TMDB movies and can be played directly in the app.

## Getting Started

### 1. Start the Development Servers
Run both the Vite dev server and JSON server simultaneously:
```bash
npm run dev:full
```

Or run them separately:
```bash
# Terminal 1 - JSON Server (port 3001)
npm run json-server

# Terminal 2 - Vite Dev Server (port 5173)
npm run dev
```

### 2. Adding Custom Movies
1. Click the "Add Movie" button on the home page
2. Fill in the movie details:
   - **Title** (required): Movie name
   - **Video URL** (required): Direct link to video file (mp4, webm, etc.)
   - **Overview**: Movie description
   - **Poster URL**: Link to poster image
   - **Backdrop URL**: Link to backdrop image
   - **Release Date**: Movie release date
   - **Rating**: Movie rating (0-10)

### 3. Playing Custom Movies
- Custom movies display with a play button overlay
- Click on the movie card to open the video player
- Video player includes:
  - Play/pause controls
  - Progress bar (clickable for seeking)
  - Volume control
  - Fullscreen toggle
  - Time display

## Database Structure
The JSON server uses `db.json` file with the following structure:

```json
{
  "movies": [
    {
      "id": 1,
      "title": "Movie Title",
      "video_url": "https://example.com/movie.mp4",
      "overview": "Movie description",
      "poster_path": "https://example.com/poster.jpg",
      "backdrop_path": "https://example.com/backdrop.jpg",
      "release_date": "2024-01-01",
      "vote_average": 8.5,
      "vote_count": 1000,
      "genre_ids": [28, 12],
      "adult": false,
      "original_language": "en",
      "original_title": "Movie Title",
      "popularity": 100.5,
      "video": true
    }
  ]
}
```

## API Endpoints
JSON Server provides REST API endpoints:

- `GET /movies` - Get all custom movies
- `POST /movies` - Add a new movie
- `PUT /movies/:id` - Update a movie
- `DELETE /movies/:id` - Delete a movie
- `GET /movies/:id` - Get a specific movie

## Video URL Requirements
- Use direct links to video files (mp4, webm, ogg)
- Ensure the server hosting the video allows cross-origin requests
- For testing, you can use sample video URLs like:
  - `https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4`
  - `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`

## Features
- Custom movies appear at the top of movie lists
- Integrated with existing movie browsing experience
- Video player with full controls
- Watchlist support for custom movies
- Search functionality includes custom movies

## Troubleshooting
1. **JSON Server not starting**: Make sure port 3001 is available
2. **Videos not playing**: Check if the video URL is accessible and supports CORS
3. **Images not loading**: Verify image URLs are accessible
4. **Movies not appearing**: Check if JSON server is running on port 3001

## File Structure
```
src/
├── components/
│   ├── AddMovieForm.jsx      # Form for adding movies
│   ├── VideoPlayer.jsx       # Video player component
│   └── MovieCard.jsx         # Updated with video support
├── utils/
│   ├── jsonServerApi.js      # JSON server API functions
│   └── api.js               # Enhanced with custom movies
└── pages/
    └── Home.jsx             # Updated with add movie functionality
```