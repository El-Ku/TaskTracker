import React from "react";

function UpperNavBar() {
  return (
    <div className="top-actions">
      <button onClick={() => (window.location.href = "/tasks")}>
        View My Tasks
      </button>
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
