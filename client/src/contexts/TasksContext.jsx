import { createContext, useContext, useState } from "react";

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editValue, setEditValue] = useState("");

  return (
    <TasksContext.Provider
      value={{
        tasks,
        setTasks,
        editTaskId,
        setEditTaskId,
        editValue,
        setEditValue,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
