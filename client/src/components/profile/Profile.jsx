import { useState } from "react";
import "../../css/Profile.css";
import ChangePassword from "./ChangePassword";
import ChangeUserInfo from "./ChangeUserInfo";
import DeleteAccount from "./DeleteAccount";

function Profile() {
  return (
    <div className="profile-container">
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

      <h1 className="welcome-message">
        Welcome, {localStorage.getItem("userName") || user.fullName}!
      </h1>
      <hr />

      <ChangeUserInfo />

      <div className="section">
        <h2>Account Settings</h2>
        <ChangePassword />
        <hr />
        <DeleteAccount />
      </div>
    </div>
  );
}

export default Profile;
