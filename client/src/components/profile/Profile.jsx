import { useState } from "react";
import "../../css/Profile.css";
import ChangePassword from "./ChangePassword";
import ChangeUserInfo from "./ChangeUserInfo";

function Profile() {
  const handleUserInfoChange = (e) => {
    setUserProfileInfo({ ...user, [e.target.name]: e.target.value });
  };

  const updatePassword = () => {
    console.log("Password updated", user);
  };

  const deleteAccount = () => {
    console.log("Account deleted");
  };

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

        <button className="delete-btn" onClick={deleteAccount}>
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default Profile;

/* import { useState } from "react";
import updatePassword from "../services/updatePassword";
import deleteAccount from "../services/deleteAccount";
import FormField from "./FormField";

function Profile() {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="actionButtons">
        <button
          className="viewTasksBtn"
          onClick={() => {
            window.location.href = "/tasks";
          }}
        >
          View my tasks
        </button>
        <button
          className="logoutBtn"
          onClick={() => {
            localStorage.removeItem("userName");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
      <p>Welcome to your profile page!</p>
      <p>
        Username:{" "}
        <strong className="username-highlight">
          {localStorage.getItem("userName")}
        </strong>
      </p>
      <h2>User settings:</h2>
      <ul>
        <li>
          <FormField
            type="password"
            name="currentPassword"
            placeholder="Enter current password"
            value={form.currentPassword}
            handleChange={handleChange}
            required={true}
          />
          <FormField
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            value={form.newPassword}
            handleChange={handleChange}
            required={true}
          />
          <FormField
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={form.confirmPassword}
            handleChange={handleChange}
            required={true}
          />
          <button
            className="btn"
            onClick={() => {
              updatePassword(form);
            }}
          >
            Change password
          </button>
        </li>
        <li>
          <button
            onClick={() => {
              deleteAccount();
            }}
          >
            Delete account
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Profile;
 */
