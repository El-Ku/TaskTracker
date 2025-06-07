// src/components/Navbar.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle

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
    navigate("/tasktracker"); // redirect to login page
    setIsOpen(false); // Close mobile menu on logout
  };

  // Handler to navigate and close menu
  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false); // Close mobile menu after navigation
  };

  return (
    <nav className="flex justify-between items-center p-2 text-xl bg-blue-500 text-white shadow-md">
      {/* Welcome Message */}
      <div className="flex items-center">
        <p>
          Welcome{" "}
          <span className="font-bold text-lg italic">
            {localStorage.getItem("userName") || "Guest"}
          </span>
        </p>
      </div>

      {/* Hamburger Icon (visible on mobile) */}
      <button
        className="md:hidden focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          // Close Icon (X)
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          // Hamburger Icon
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        )}
      </button>

      {/* Navigation Links */}
      <ul
        className={`${
          isOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row gap-2 md:gap-4 mt-4 md:mt-0 absolute md:static top-16 left-0 w-full md:w-auto bg-blue-500 md:bg-transparent p-4 md:p-0 transition-all duration-300 ease-in-out z-10 md:z-auto border-t border-blue-400 md:border-none`}
      >
        {!isLoggedIn && (
          <li
            onClick={() => handleNavigate("/tasktracker")}
            className="cursor-pointer hover:bg-blue-600 md:hover:bg-transparent md:hover:text-blue-200 px-3 py-2 rounded-md transition-colors duration-200"
          >
            Home
          </li>
        )}
        {isLoggedIn && (
          <li
            onClick={() => handleNavigate("/tasktracker/profile")}
            className="cursor-pointer hover:bg-blue-600 md:hover:bg-transparent md:hover:text-blue-200 px-3 py-2 rounded-md transition-colors duration-200"
          >
            Profile
          </li>
        )}
        {isLoggedIn && isAdmin && (
          <li
            onClick={() => handleNavigate("/tasktracker/admin")}
            className="cursor-pointer hover:bg-blue-600 md:hover:bg-transparent md:hover:text-blue-200 px-3 py-2 rounded-md transition-colors duration-200"
          >
            Dashboard
          </li>
        )}
        {isLoggedIn && (
          <li
            onClick={() => handleNavigate("/tasktracker/tasks")}
            className="cursor-pointer hover:bg-blue-600 md:hover:bg-transparent md:hover:text-blue-200 px-3 py-2 rounded-md transition-colors duration-200"
          >
            Tasks
          </li>
        )}
        {isLoggedIn && (
          <li
            onClick={handleLogout}
            className="cursor-pointer hover:bg-blue-600 md:hover:bg-transparent md:hover:text-blue-200 px-3 py-2 rounded-md transition-colors duration-200"
          >
            Logout
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
