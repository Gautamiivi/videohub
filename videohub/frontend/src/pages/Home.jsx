import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../services/api";
import Starfield from "../components/Starfield";
import Navbar from "../components/Navbar";
import "../styles/home.css";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Get API URL from environment, fallback to empty for relative URLs
  const getApiUrl = () => {
    const url = import.meta.env.VITE_API_URL || "";
    // Remove trailing slash if present
    return url.replace(/\/$/, "");
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await API.get("/videos");
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoClick = (video) => {
    setPlayingVideo(video);
  };

  const closePlayer = () => {
    setPlayingVideo(null);
  };

  const getVideoUrl = (video) => {
    if (video.videoUrl) {
      // If videoUrl is already a full URL, use it
      if (video.videoUrl.startsWith("http")) {
        return video.videoUrl;
      }
      // Otherwise, prepend the API URL
      return getApiUrl() + video.videoUrl;
    }
    // Fallback to uploads path with filename
    return getApiUrl() + "/uploads/" + video.filename;
  };

  return (
    <div className="home-container">
      <Starfield />
      <Navbar />
      
      {/* Video Player Modal */}
      {playingVideo && (
        <div className="video-player-overlay" onClick={closePlayer}>
          <div className="video-player-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-player" onClick={closePlayer}>×</button>
            <video
              key={playingVideo._id}
              controls
              autoPlay
              className="video-player"
            >
              <source src={getVideoUrl(playingVideo)} type="video/mp4" />
              Your browser does not support video playback.
            </video>
            <h3 className="playing-title">{playingVideo.title}</h3>
          </div>
        </div>
      )}

      <div className="home-content">
        <h1 className="welcome-text">Welcome to VideoHub</h1>
        <p className="subtitle">Your personal video collection</p>
        
        {loading ? (
          <div className="loading">Loading videos...</div>
        ) : videos.length === 0 ? (
          <div className="empty-state">
            <p>No videos yet. Start uploading to build your collection!</p>
          </div>
        ) : (
          <div className="video-grid">
            {videos.map((v) => (
              <div 
                key={v._id} 
                className="video-card"
                onClick={() => handleVideoClick(v)}
              >
                <div className="video-thumbnail">
                  <span className="play-icon">▶</span>
                  <span className="video-duration">Click to play</span>
                </div>
                <div className="video-info">
                  <h3>{v.title}</h3>
                  <span className="video-date">
                    {new Date(v.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
