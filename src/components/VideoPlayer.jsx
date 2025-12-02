import { useState, useRef, useEffect } from 'react';

const VideoPlayer = ({ videoUrl, title, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // Check if URL is YouTube
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  
  // Extract YouTube video ID
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  const youtubeId = isYouTube ? getYouTubeId(videoUrl) : null;
  const embedUrl = youtubeId ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1` : null;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div ref={containerRef} className="relative w-full h-full max-w-6xl max-h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white text-2xl hover:text-gray-300 bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
        >
          ×
        </button>

        {isYouTube && embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onClick={togglePlay}
          />
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="text-white mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
          </div>

          {/* Progress Bar */}
          <div
            className="w-full h-2 bg-gray-600 rounded cursor-pointer mb-4"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-red-600 rounded"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Controls - Only show for non-YouTube videos */}
          {!isYouTube && (
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="text-2xl hover:text-gray-300"
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>

                <div className="flex items-center gap-2">
                  <span>🔊</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20"
                  />
                </div>

                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <button
                onClick={toggleFullscreen}
                className="text-xl hover:text-gray-300"
              >
                {isFullscreen ? '🗗' : '🗖'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;