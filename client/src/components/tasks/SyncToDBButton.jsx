import { useTasks } from "../../contexts/TasksContext";
import { updateTasks } from "../../services/taskApiCalls";

function SyncToDBButton() {
  const { tasks, setError, originalTasks, setOriginalTasks } = useTasks();

  const updateTasksToDatabase = async () => {
    const modifiedTasks = tasks
      .filter((task) => {
        const originalTask = originalTasks.find((t) => t._id === task._id);
        return (
          originalTask.desc !== task.desc || originalTask.status !== task.status
        );
      })
      .map(({ _id, desc, status }) => ({ _id, desc, status }));

    if (modifiedTasks.length === 0) {
      setError("No changes detected");
      return;
    }
    try {
      await updateTasks(modifiedTasks);
      setOriginalTasks(tasks);
      setError(null);
      alert("Tasks updated successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <button
      className="mt-6 px-5 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      onClick={async () => updateTasksToDatabase()}
    >
      Sync Edits To Database
    </button>
  );
}

export default SyncToDBButton;
