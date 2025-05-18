import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../css/Navbar.css"; // Assuming you have a CSS file for styling

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // true if token exists
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/"); // redirect to login page
  };

  return (
    <nav className="navbar">
      <ul>
        <li onClick={() => navigate("/")}>Home</li>
        {isLoggedIn && <li onClick={() => navigate("/profile")}>Profile</li>}
        {isLoggedIn && <li onClick={() => navigate("/tasks")}>Tasks</li>}
        {isLoggedIn && <li onClick={handleLogout}>Logout</li>}
      </ul>
    </nav>
  );
}

export default Navbar;
