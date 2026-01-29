import { useState } from "react";
import { API } from "../services/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const uploadVideo = async () => {
    if (!file) {
      setMsg("Please select a video");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);


    try {
      await API.post("/videos/upload", formData);
      setMsg("✅ Upload successful");
    } catch (err) {
      console.error(err);
      setMsg("❌ Upload failed");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={uploadVideo}>Upload</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
