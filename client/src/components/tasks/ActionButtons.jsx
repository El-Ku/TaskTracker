import { useTasks } from "../../contexts/TasksContext";
import { ButtonText } from "../../../../CONSTANTS";
import { deleteTasks, updateTaskStatus } from "../../services/taskApiCalls";

function ActionButtons({ task }) {
  const { setTasks, setEditTaskId, setEditValue, setError } = useTasks();

  const handleAction = async (action) => {
    try {
      if (action === "delete") {
        const data = await deleteTasks(task._id);
        if (data.result === "success") {
          setTasks((prev) => prev.filter((t) => t._id !== task._id));
        }
      } else if (action === "edit") {
        setEditTaskId(task._id);
        setEditValue(task.desc);
      } else {
        const data = await updateTaskStatus(task._id, action);
        if (data.result === "success") {
          setTasks((prev) =>
            prev.map((t) => (t._id === task._id ? { ...t, status: action } : t))
          );
        }
      }
      setError(null); // clear error
    } catch (err) {
      setError(err.message);
    }
  };

  const renderButton = (action) => (
    <button
      key={action}
      onClick={() => handleAction(action)}
      className={`btn btn-${action}`}
    >
      {ButtonText[action]}
    </button>
  );

  return (
    <td>{["done", "paused", "pending", "delete", "edit"].map(renderButton)}</td>
  );
}

export default ActionButtons;
