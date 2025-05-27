import { clearAllTasks } from "../../services/taskApiCalls";
import { useTasks } from "../../contexts/TasksContext";

function ClearAllButton() {
  const { setTasks, setError, setOriginalTasks, setTaskCount } = useTasks();

  return (
    <button
      className="clearBtn"
      onClick={async () => {
        try {
          await clearAllTasks();
          setError(null); // clear error
          setTasks([]);
          setOriginalTasks([]);
          setTaskCount(0);
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
