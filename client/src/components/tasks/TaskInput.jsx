import { useState } from "react";
import { addTasks } from "../../services/taskApiCalls";
import { useTasks } from "../../contexts/TasksContext";

function TaskInput() {
  const { tasks, setTasks } = useTasks();
  const [taskInput, setTaskInput] = useState("");

  const handleChange = (e) => {
    setTaskInput(e.target.value);
  };

  const addTasksToDatabase = async () => {
    const newTasks = await addTasks(taskInput);
    setTasks([...tasks, ...newTasks]);
    setTaskInput(""); // clear input
  };

  return (
    <div className="task-container">
      <div className="task-input-section">
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
    </div>
  );
}

export default TaskInput;
