import { useState, useEffect } from "react";
import getTasks from "../services/getTasks";
import { ButtonText } from "../../../CONSTANTS";

function TaskTable() {
  const [tasks, setTasks] = useState([]);
  console.log(tasks);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks(); // Await the result
        setTasks(data); // Set the tasks state
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchTasks();
  }, []);

  const onAction = (action, task) => {
    console.log("Action:", action, task);
  };

  return (
    <table className="task-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Date</th>
          <th colSpan={5}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task._id}>
            <td>{task.desc}</td>
            <td>{task.time}</td>
            <td>
              <button onClick={() => onAction("done", task)}>
                {ButtonText["done"]}
              </button>
            </td>
            <td>
              <button onClick={() => onAction("pause", task)}>
                {ButtonText["paused"]}
              </button>
            </td>
            <td>
              <button onClick={() => onAction("todo", task)}>
                {ButtonText["pending"]}
              </button>
            </td>
            <td>
              <button onClick={() => onAction("delete", task)}>
                {ButtonText["Delete"]}
              </button>
            </td>
            <td>
              <button onClick={() => onAction("edit", task)}>
                {ButtonText["Edit"]}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TaskTable;
