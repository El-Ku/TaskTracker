import { clearAllUsers } from "../../services/adminApiCalls";
import { useAdmin } from "../../contexts/AdminContext";

function ClearAllButton() {
  const { setUsers, setError, setOriginalUsers } = useAdmin();

  return (
    <button
      className="clearBtn"
      onClick={async () => {
        try {
          await clearAllUsers();
          setError(null); // clear error
          setUsers([]);
          setOriginalUsers([]);
        } catch (err) {
          setError(err.message);
        }
      }}
    >
      Clear All Users
    </button>
  );
}

export default ClearAllButton;
