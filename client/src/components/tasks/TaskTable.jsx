import { useState, useEffect } from "react";
import {
  getTasks,
  deleteTasks,
  updateTaskStatus,
  updateTaskDescription,
} from "../../services/taskApiCalls";
import { useTasks } from "../../contexts/TasksContext";
import { ButtonText } from "../../../../CONSTANTS";

function TaskTable() {
  const { tasks, setTasks } = useTasks();
  const [editTaskId, setEditTaskId] = useState(null);
  const [editValue, setEditValue] = useState("");

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
            <td>
              {editTaskId === task._id ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") {
                      if (!editValue.trim()) {
                        alert("Task description cannot be empty");
                        return;
                      }

                      const data = await updateTaskDescription(
                        task._id,
                        editValue
                      );
                      if (data.result === "success") {
                        setTasks((prev) =>
                          prev.map((t) =>
                            t._id === task._id ? { ...t, desc: editValue } : t
                          )
                        );
                        setEditTaskId(null); // exit edit mode
                      }
                    } else if (e.key === "Escape") {
                      setEditTaskId(null);
                    }
                  }}
                  autoFocus
                />
              ) : (
                task.desc
              )}
            </td>
            <td>
              {new Date(task.time).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </td>
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

export default TaskTable;
