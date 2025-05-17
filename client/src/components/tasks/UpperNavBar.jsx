import { useNavigate } from "react-router-dom";

function UpperNavBar() {
  const navigate = useNavigate();
  return (
    <div className="top-actions">
      <button onClick={() => navigate("/profile")}>My Profile</button>
      <button
        onClick={() => {
          localStorage.removeItem("userName");
          window.location.href = "/";
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default UpperNavBar;
