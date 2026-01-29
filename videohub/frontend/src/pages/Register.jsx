import { useState } from "react";
import { API } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
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

    if (form.password.length < 6) {
      setMessage("❌ Password must be at least 6 characters");
      return;
    }

    try {
      await API.post("/auth/register", form);

      setMessage("✅ Registered successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");   // ✅ FIX
      }, 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Registration failed");
    }
  };

  return (
    <div className="centerScreen">
      <form className="card" onSubmit={handleSubmit}>
        <h2 className="authTitle">Create Account</h2>

        <input
          className="input"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

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
          Register
        </button>

        {message && <p className="authSwitch">{message}</p>}

        <p className="authSwitch">
          Already have an account?{" "}
          <Link to="/login" className="btnLink">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
