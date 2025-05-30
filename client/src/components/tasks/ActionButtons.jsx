import { useTasks } from "../../contexts/TasksContext";
import { updateTasks, deleteTasks } from "../../services/taskApiCalls";
import SingleActionButton from "./SingleActionButton";

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
    <div className="flex flex-row gap-4 px-6 mb-4 justify-center flex-wrap">
      <SingleActionButton action={deleteSelectedTasks} text="Delete Tasks" />
      <SingleActionButton action={changeStatus("done")} text="Mark Done" />
      <SingleActionButton
        action={changeStatus("pending")}
        text="Mark Pending"
      />
      <SingleActionButton action={changeStatus("paused")} text="Mark Paused" />
    </div>
  );
}

export default ActionButtons;
