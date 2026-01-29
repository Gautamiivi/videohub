import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../services/api";
import "../styles/home.css";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  /*  FETCH VIDEOS */
  
  const fetchVideos = async () => {
    try {
      const res = await API.get("/videos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setVideos(res.data);
    } catch (err) {
      console.error("Failed to load videos");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  /* =========================
     UPLOAD VIDEO
  ========================== */
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Select a video");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);

    try {
      setLoading(true);

      await API.post("/videos/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // reset form
      setTitle("");
      setFile(null);
      fileInputRef.current.value = "";

      await fetchVideos();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE VIDEO
  ========================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this video?")) return;

    try {
      await API.delete(`/videos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setVideos((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* LOGOUT  */

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="homeContainer">
      {/* HEADER */}
      <div className="homeHeader">
        <h2 className="homeTitle">🎬 VideoHub</h2>
        <button className="btn btnDanger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* UPLOAD */}
      <form className="uploadBox" onSubmit={handleUpload}>
        <input
          className="input"
          placeholder="Video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="file"
          accept="video/*"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <button className="btn btnPrimary" disabled={loading}>
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </form>

      {/* VIDEOS */}
      <div className="videoGrid">
        {videos.length === 0 && <p>No videos uploaded yet</p>}

        {videos.map((v) => (
          <div className="videoCard" key={v._id}>
            <video
              src={v.videoUrl}
              controls
              controlsList="nodownload"
            />
            <h4>{v.title}</h4>

            <button
              className="btn btnDanger btnSmall"
              onClick={() => handleDelete(v._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
