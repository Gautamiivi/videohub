import { API } from "../services/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await API.get("/videos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setVideos(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error(err);
        }
      }
    };

    fetchVideos();
  }, [navigate]);

  return (
    <>
      {videos.map((v) => (
        <div key={v._id}>{v.title}</div>
      ))}
    </>
  );
};

export default Home;
