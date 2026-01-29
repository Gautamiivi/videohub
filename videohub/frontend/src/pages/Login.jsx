import { useState } from "react";
import { API } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      const token = res.data.token || res.data?.data?.token; // ✅ SAFETY

      if (!token) {
        throw new Error("Token missing");
      }

      localStorage.setItem("token", token);

      setMessage("✅ Login successful!");

      setTimeout(() => {
        navigate("/home");
      }, 800);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Invalid email or password");
    }
  };

  return (
    <div className="centerScreen">
      <form className="card" onSubmit={handleSubmit}>
        <h2 className="authTitle">Login</h2>

        <input
          className="input"
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          className="input"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btnPrimary">
          Login
        </button>

        {message && <p className="authSwitch">{message}</p>}

        <p className="authSwitch">
          Don’t have an account?{" "}
          <Link to="/register" className="btnLink">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
