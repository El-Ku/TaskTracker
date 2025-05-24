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
    <button id="updateTasksBtn" onClick={async () => updateTasksToDatabase()}>
      Sync Edits To Database
    </button>
  );
}

export default SyncToDBButton;
