import { useState } from "react";

function TaskInput() {
  const [taskList, setTaskList] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setTaskInput(e.target.value);
  };

  const addTasks = async () => {
    const trimmed = taskInput.trim();
    if (!trimmed) return;

    const newTasks = trimmed.split(",").map((t) => ({
      desc: t.trim(),
    }));
    console.log(newTasks);

    const response = await fetch("/api/tasks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newTasks),
    });

    const data = await response.json();
    const { result, message, payload } = data;
    console.log(`${result} : ${message}`);
    console.log(payload);

    setTaskList([...taskList, ...newTasks]);
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
        />
        <button id="addBtn" onClick={addTasks}>
          Add
        </button>
      </div>
    </div>
  );
}

export default TaskInput;
