import { useState } from "react";
import { addTasks } from "../../services/taskApiCalls";
import { useTasks } from "../../contexts/TasksContext";

function TaskInput() {
  const { tasks, setTasks } = useTasks();
  const [taskInput, setTaskInput] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setTaskInput(e.target.value);
  };

  const addTasksToDatabase = async () => {
    try {
      const newTasks = await addTasks(taskInput);
      setTasks([...tasks, ...newTasks]);
      setTaskInput(""); // clear input
      setError(null); // clear error
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="task-input-section">
      <div className="input-row">
        <input
          type="text"
          id="taskInput"
          value={taskInput}
          onChange={handleChange}
          placeholder="Enter a single task or comma separated multiple tasks"
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              addTasksToDatabase();
            }
            if (e.key === "Escape") {
              setTaskInput(""); // clear input
            }
          }}
        />
        <button id="addBtn" onClick={async () => addTasksToDatabase()}>
          Add
        </button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default TaskInput;
