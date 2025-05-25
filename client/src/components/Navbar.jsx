import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/Navbar.css"; // Assuming you have a CSS file for styling

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // true if token exists
    setIsAdmin(localStorage.getItem("userRole") === "admin"); // true if user role is admin
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/"); // redirect to login page
  };

  return (
    <nav className="navbar">
      <p className="welcome-user-text">
        Welcome {localStorage.getItem("userName")}
      </p>
      <ul>
        {!isLoggedIn && <li onClick={() => navigate("/")}>Home</li>}
        {isLoggedIn && <li onClick={() => navigate("/profile")}>Profile</li>}
        {isLoggedIn && !isAdmin && (
          <li onClick={() => navigate("/tasks")}>Tasks</li>
        )}
        {isLoggedIn && isAdmin && (
          <li onClick={() => navigate("/admin")}>Dashboard</li>
        )}
        {isLoggedIn && <li onClick={handleLogout}>Logout</li>}
      </ul>
    </nav>
  );
}

export default Navbar;
