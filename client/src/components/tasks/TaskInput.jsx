import { useState } from "react";
import { addTasks } from "../../services/taskApiCalls";
import { useTasks } from "../../contexts/TasksContext";

function TaskInput() {
  const { tasks, setTasks } = useTasks();
  const [taskInput, setTaskInput] = useState("");

  const handleChange = (e) => {
    setTaskInput(e.target.value);
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
        />
        <button
          id="addBtn"
          onClick={async () => {
            const newTasks = await addTasks(taskInput);
            setTasks([...tasks, ...newTasks]);
            setTaskInput(""); // clear input
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default TaskInput;
