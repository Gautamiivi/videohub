import { API } from "../services/api";
import { useEffect, useState } from "react";

const Home = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/videos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setVideos(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVideos();
  }, []);

  return (
    <>
      {videos.map(v => (
        <div key={v._id}>{v.title}</div>
      ))}
    </>
  );
};

export default Home;
