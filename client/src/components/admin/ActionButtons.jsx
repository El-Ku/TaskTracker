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
    <div className="action-button">
      <button
        id="deleteusersBtn"
        onClick={async () => deleteSelectedUsers()}
        disabled={!selectedRows || selectedRows.length === 0}
      >
        Delete Selected users
      </button>
    </div>
  );
}

export default ActionButtons;
