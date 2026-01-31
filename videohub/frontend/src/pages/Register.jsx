import { useState } from "react";
import { API } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    setMessage("");

    try {
      console.log("Sending registration request with:", { name: form.name, email: form.email });
      const res = await API.post("/auth/register", form);
      console.log("Registration response:", res.data);

      setMessage("✅ Registered successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      console.error("Error response:", err.response?.data);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Registration failed";
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <span className="auth-icon">🎬</span>
          <h2>Create Account</h2>
          <p>Join VideoHub to start uploading</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />

          <button type="submit" className="btn btnPrimary" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>

          {message && (
            <p className="auth-error" style={{ color: message.includes("✅") ? "#4ade80" : "#f87171" }}>
              {message}
            </p>
          )}
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login" className="btnLink">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
