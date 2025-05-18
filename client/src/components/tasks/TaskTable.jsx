import { useEffect } from "react";
import { getTasks } from "../../services/taskApiCalls";
import { useTasks } from "../../contexts/TasksContext";
import ActionButtons from "./ActionButtons";
import EditField from "./EditField";

function TaskTable() {
  const { tasks, setTasks, error, setError } = useTasks();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        if (data) {
          setTasks(data);
        }
        setError(null); // clear error
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="task-table-container">
      <table className="task-table">
        <thead>
          <tr>
            <th className="task-desc">Description</th>
            <th>Created @</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className={`task-row ${task.status}`}>
              {/* Add task description with editable functionality and task created time */}
              <EditField task={task} propertyToUpdate="desc" />
              <td>{formatDate(task.time)}</td>
              <ActionButtons task={task} />
            </tr>
          ))}
        </tbody>
      </table>
      {error && <p className="error">{error}</p>}
    </div>
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
