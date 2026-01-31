import { useState } from "react";
import { API } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/buttons.css";
import "../styles/inputs.css";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const uploadVideo = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMsg("Please select a video");
      return;
    }

    if (!title.trim()) {
      setMsg("Please enter a title");
      return;
    }

    setLoading(true);
    setMsg("");

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);

    try {
      await API.post("/videos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMsg("✅ Upload successful!");
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      console.error("Upload error:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Upload failed";
      setMsg(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h2>Upload Video</h2>
        <form onSubmit={uploadVideo}>
          <input
            type="text"
            placeholder="Video Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input"
          />
          
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="file-input"
          />
          
          <button type="submit" className="btn btnPrimary" disabled={loading}>
            {loading ? "Uploading..." : "Upload Video"}
          </button>
          
          {msg && <p className="upload-msg" style={{ color: msg.includes("✅") ? "#4ade80" : "#f87171" }}>{msg}</p>}
        </form>
      </div>
    </div>
  );
}
