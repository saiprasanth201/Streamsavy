// Extract YouTube video ID from URL
export const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Get YouTube video details using oEmbed API (no API key required)
export const getYouTubeDetails = async (videoUrl) => {
  try {
    const videoId = getYouTubeId(videoUrl);
    if (!videoId) return null;

    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oEmbedUrl);
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    return {
      title: data.title,
      author_name: data.author_name,
      thumbnail_url: data.thumbnail_url,
      thumbnail_width: data.thumbnail_width,
      thumbnail_height: data.thumbnail_height,
      html: data.html
    };
  } catch (error) {
    console.error('Error fetching YouTube details:', error);
    return null;
  }
};