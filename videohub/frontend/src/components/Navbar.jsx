import { useNavigate } from "react-router-dom";
import "../styles/layout.css";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🎬</span>
        <span className="brand-text">VideoHub</span>
      </div>
      
      <div className="navbar-links">
        <button 
          className="nav-link" 
          onClick={() => navigate("/home")}
        >
          Home
        </button>
        
        <button 
          className="nav-link" 
          onClick={() => navigate("/upload")}
        >
          Upload
        </button>
        
        <div className="navbar-user">
          <span className="user-name">{user?.name || "User"}</span>
          <button className="btn btnSecondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
