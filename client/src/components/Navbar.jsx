import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiShield, FiLogOut, FiUpload, FiGrid, FiUsers, FiLogIn, FiUserPlus } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" id="navbar-home">
        <FiShield className="brand-icon" />
        <span>DocVerify</span>
      </Link>

      <div className="navbar-links">
        {user ? (
          <>
            {user.role === "admin" ? (
              <Link to="/admin" className={`nav-link ${isActive("/admin") ? "active" : ""}`}>
                <FiUsers />
                Admin Panel
              </Link>
            ) : (
              <>
                <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>
                  <FiGrid />
                  Dashboard
                </Link>
                <Link to="/upload" className={`nav-link ${isActive("/upload") ? "active" : ""}`}>
                  <FiUpload />
                  Upload
                </Link>
              </>
            )}

            <div className="nav-user">
              <div className="user-avatar">{user.name?.charAt(0).toUpperCase()}</div>
              <span className="user-name">{user.name}</span>
            </div>

            <button className="btn-logout" onClick={handleLogout} id="logout-btn">
              <FiLogOut />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`nav-link ${isActive("/login") ? "active" : ""}`} id="nav-login">
              <FiLogIn />
              Sign In
            </Link>
            <Link to="/register" className="btn-primary" id="nav-register" style={{ padding: "0.45rem 1rem", fontSize: "0.875rem" }}>
              <FiUserPlus size={15} />
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

