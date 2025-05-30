import { clearAllTasks } from "../../services/taskApiCalls";
import { useTasks } from "../../contexts/TasksContext";

function ClearAllButton() {
  const { setTasks, setError, setOriginalTasks, setTaskCount } = useTasks();

  return (
    <div className="flex justify-center mt-6">
      <button
        className="mt-6 mb-6 px-5 py-2 max-w-40ext-sm font-medium text-white bg-red-600 border border-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
    </div>
  );
}

export default ClearAllButton;
