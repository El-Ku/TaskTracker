import { createContext, useContext, useState } from "react";

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState(null);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        setTasks,
        editTaskId,
        setEditTaskId,
        editValue,
        setEditValue,
        error,
        setError,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
