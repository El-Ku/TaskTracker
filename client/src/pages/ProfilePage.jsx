import Profile from "../components/profile/Profile";
import "../css/Profile.css";

function ProfilePage() {
  return (
    <div>
      <Profile />
      {
        // TODO: divide into smaller components such as action buttons, user information, and user settings
      }
    </div>
  );
}

export default ProfilePage;
