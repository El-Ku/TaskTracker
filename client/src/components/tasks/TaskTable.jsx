import { useEffect } from "react";
import {
  getTasks,
  deleteTasks,
  updateTaskStatus,
} from "../../services/taskApiCalls";
import { useTasks } from "../../contexts/TasksContext";
import { ButtonText } from "../../../../CONSTANTS";
import EditField from "./EditField";

function TaskTable() {
  const { tasks, setTasks, setEditTaskId, setEditValue } = useTasks();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchTasks();
  }, []);

  const onAction = async (action, task) => {
    let data;
    if (action === "delete") {
      data = await deleteTasks(task._id);
      if (data.result === "success") {
        setTasks((prevTasks) => prevTasks.filter((t) => t._id !== task._id));
      }
      return;
    } else if (["done", "paused", "pending"].includes(action)) {
      data = await updateTaskStatus(task._id, action);
      if (data.result === "success") {
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t._id === task._id ? { ...t, status: action } : t
          )
        );
      }
    }
  };

  return (
    <table className="task-table">
      <thead>
        <tr>
          <th className="task-desc">Description</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task._id} className={`task-row ${task.status}`}>
            {/* Add task description with editable functionality and task created time */}
            <EditField task={task} propertyToUpdate="desc" />
            <td>{formatDate(task.time)}</td>
            {/* Add action buttons */}
            <td>
              {["done", "paused", "pending", "delete"].map((action) => (
                <button
                  key={action}
                  onClick={() => onAction(action, task)}
                  className={`btn btn-${action}`}
                >
                  {ButtonText[action]}
                </button>
              ))}
              <button
                onClick={() => {
                  setEditTaskId(task._id);
                  setEditValue(task.desc);
                }}
              >
                {ButtonText["edit"]}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const formatDate = (date) => {
  {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }
};

export default TaskTable;
