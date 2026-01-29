import { API } from "../services/api";

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    navigate("/");
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};
