import { useState } from "react";
import { addTasks } from "../../services/taskApiCalls";
import { useTasks } from "../../contexts/TasksContext";

function TaskInput() {
  const { tasks, setTasks, taskCount, setTaskCount } = useTasks();
  const [taskInput, setTaskInput] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setTaskInput(e.target.value);
    setError(null);
  };

  const addTasksToDatabase = async () => {
    try {
      const newTasks = await addTasks(taskInput);
      setTasks([...tasks, ...newTasks]);
      setTaskCount(taskCount + newTasks.length);
      setTaskInput(""); // clear input
      setError(null); // clear error
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 sm:px-6 gap-4 max-w-6xl mx-auto w-full">
      <div className="flex flex-row gap-4 w-full">
        <input
          className="border-2 border-gray-300 rounded-md p-2 hover:border-gray-400 w-full"
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
        <button
          className="bg-blue-500 text-white px-4 rounded-md hover:bg-blue-600"
          onClick={async () => addTasksToDatabase()}
        >
          Add
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <p className="text-lg mb-4">
        {taskCount > 0 ? (
          <p>
            You have a total of <strong>{taskCount} </strong>tasks
          </p>
        ) : (
          "You have no tasks yet"
        )}
      </p>
    </div>
  );
}

export default TaskInput;
