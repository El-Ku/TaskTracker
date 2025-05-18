import ChangePassword from "../components/profile/ChangePassword";
import ChangeUserInfo from "../components/profile/ChangeUserInfo";
import DeleteAccount from "../components/profile/DeleteAccount";
import "../css/Profile.css";

function Profile() {
  return (
    <div className="profile-container">
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
