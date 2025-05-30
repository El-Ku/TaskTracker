import { useAdmin } from "../../contexts/AdminContext";
import { deleteUsers } from "../../services/adminApiCalls";

function ActionButtons({ user }) {
  const {
    users,
    setUsers,
    setError,
    setOriginalUsers,
    setSelectedRows,
    setSelectedSelectAll,
    selectedRows,
  } = useAdmin();

  const deleteSelectedUsers = async () => {
    const usersToDelete = selectedRows.map((rowIndex) => users[rowIndex]._id);
    try {
      await deleteUsers(usersToDelete);
      setUsers(users.filter((user) => !usersToDelete.includes(user._id)));
      setOriginalUsers(users);
      setError(null);
      setSelectedRows([]);
      setSelectedSelectAll(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-row gap-4 px-6 mb-4 justify-center flex-wrap">
      <button
        className="m-2 px-1 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 min-w-50 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={async () => deleteSelectedUsers()}
        disabled={!selectedRows || selectedRows.length === 0}
      >
        Delete Selected users
      </button>
    </div>
  );
}

export default ActionButtons;
