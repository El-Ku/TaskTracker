import { clearAllUsers } from "../../services/adminApiCalls";
import { useAdmin } from "../../contexts/AdminContext";

function ClearAllButton() {
  const { setUsers, setError, setOriginalUsers } = useAdmin();

  return (
    <div className="flex justify-center mt-6">
      <button
        className="mb-12 px-5 py-2 max-w-40ext-sm font-medium text-white bg-red-600 border border-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
    </div>
  );
}

export default ClearAllButton;
