import { clearAllTasks } from "../../services/taskApiCalls";
import { useTasks } from "../../contexts/TasksContext";

function ClearAllButton() {
  const { setTasks, setError } = useTasks();

  return (
    <button
      className="clearBtn"
      onClick={async () => {
        try {
          await clearAllTasks();
          setError(null); // clear error
          setTasks([]);
        } catch (err) {
          setError(err.message);
        }
      }}
    >
      Clear All
    </button>
  );
}

export default ClearAllButton;
