import { createContext, useContext, useState } from "react";

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [originalTasks, setOriginalTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedSelectAll, setSelectedSelectAll] = useState(false);
  const [taskCount, setTaskCount] = useState(0);

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
        originalTasks,
        setOriginalTasks,
        selectedRows,
        setSelectedRows,
        selectedSelectAll,
        setSelectedSelectAll,
        taskCount,
        setTaskCount,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);
