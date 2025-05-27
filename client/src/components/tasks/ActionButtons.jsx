import { useTasks } from "../../contexts/TasksContext";
import { updateTasks, deleteTasks } from "../../services/taskApiCalls";

function ActionButtons({ task }) {
  const {
    tasks,
    setTasks,
    setError,
    setOriginalTasks,
    setSelectedRows,
    setSelectedSelectAll,
    selectedRows,
    taskCount,
    setTaskCount,
  } = useTasks();

  const deleteSelectedTasks = async () => {
    const tasksToDelete = selectedRows.map((rowIndex) => tasks[rowIndex]._id);
    try {
      await deleteTasks(tasksToDelete);
      setTasks(tasks.filter((task) => !tasksToDelete.includes(task._id)));
      setOriginalTasks(tasks);
      setTaskCount(taskCount - tasksToDelete.length);
      setError(null);
      setSelectedRows([]);
      setSelectedSelectAll(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const markAsDone = async () => {
    changeStatus("done");
  };

  const markAsPaused = async () => {
    changeStatus("paused");
  };

  const markAsPending = async () => {
    changeStatus("pending");
  };

  const changeStatus = async (status) => {
    const tasksToUpdate = selectedRows.map((rowIndex) => ({
      _id: tasks[rowIndex]._id,
      desc: tasks[rowIndex].desc,
      status,
    }));
    try {
      await updateTasks(tasksToUpdate);
      const updatedTasks = tasks.map((task) =>
        tasksToUpdate.find((t) => t._id === task._id)
          ? { ...task, status }
          : task
      );
      setTasks(updatedTasks);
      setOriginalTasks(updatedTasks);
      setError(null);
      setSelectedRows([]);
      setSelectedSelectAll(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="action-buttons">
      <button
        id="deleteTasksBtn"
        onClick={async () => deleteSelectedTasks()}
        disabled={!selectedRows || selectedRows.length === 0}
      >
        Delete Selected Tasks
      </button>
      <button
        id="markAsDoneBtn"
        onClick={async () => markAsDone()}
        disabled={!selectedRows || selectedRows.length === 0}
      >
        Mark As Done
      </button>
      <button
        id="markAsPendingBtn"
        onClick={async () => markAsPending()}
        disabled={!selectedRows || selectedRows.length === 0}
      >
        Mark As Pending
      </button>
      <button
        id="markAsPausedBtn"
        onClick={async () => markAsPaused()}
        disabled={!selectedRows || selectedRows.length === 0}
      >
        Mark As Paused
      </button>
    </div>
  );
}

export default ActionButtons;
