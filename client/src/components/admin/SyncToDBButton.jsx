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
    <button
      className="mt-6 px-5 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      onClick={async () => updateUsersToDatabase()}
    >
      Sync Edits To Database
    </button>
  );
}

export default SyncToDBButton;
