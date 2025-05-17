import { useState } from "react";
import "../../css/Profile.css";
import ChangePassword from "./ChangePassword";
import ChangeUserInfo from "./ChangeUserInfo";
import DeleteAccount from "./DeleteAccount";
import UpperNavBar from "./UpperNavBar";

function Profile() {
  return (
    <div className="profile-container">
      <UpperNavBar />

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
