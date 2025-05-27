import { useAdmin } from "../../contexts/AdminContext";
import { updateUsers } from "../../services/adminApiCalls";

function SyncToDBButton() {
  const { users, setError, originalUsers, setOriginalUsers } = useAdmin();

  const updateUsersToDatabase = async () => {
    const modifiedUsers = users
      .filter((user) => {
        const originalUser = originalUsers.find((t) => t._id === user._id);
        return (
          originalUser.username !== user.username ||
          originalUser.role !== user.role ||
          originalUser.email !== user.email ||
          originalUser.settings.fullName !== user.settings.fullName
        );
      })
      .map(({ _id, username, role, email, settings }) => ({
        _id,
        username,
        role,
        email,
        settings: {
          fullName: settings.fullName,
        },
      }));

    if (modifiedUsers.length === 0) {
      setError("No changes detected");
      return;
    }
    try {
      await updateUsers(modifiedUsers);
      setOriginalUsers(users);
      setError(null);
      alert("Users updated successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <button id="updateUsersBtn" onClick={async () => updateUsersToDatabase()}>
      Sync Edits To Database
    </button>
  );
}

export default SyncToDBButton;
