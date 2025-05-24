import makeApiCall from "./makeApiCall";
import { z } from "zod";

export const getTasks = async () => {
  try {
    const data = await makeApiCall("/api/tasks/", null, null);
    if (data.result === "error") {
      return;
    } else {
      return data.payload;
    }
  } catch (err) {
    throw err;
  }
};

export const addTasks = async (taskInput) => {
  // Schema for a single task
  const taskSchema = z.object({
    desc: z
      .string()
      .min(3, "Task description should contain at least 3 characters")
      .max(500, "Task description should not exceed 500 characters"),
  });
  const tasksArraySchema = z.array(taskSchema);
  try {
    const trimmed = taskInput.trim();
    if (!trimmed) return;

    const newTasks = trimmed.split(",").map((t) => ({
      desc: t.trim(),
    }));
    tasksArraySchema.parse(newTasks);
    const data = await makeApiCall("/api/tasks/", "POST", newTasks);
    return data.payload;
  } catch (err) {
    throw err;
  }
};

export const deleteTasks = async (taskIds) => {
  try {
    return await makeApiCall(`/api/tasks/`, "DELETE", taskIds);
  } catch (err) {
    throw err;
  }
};

export const updateTasks = async (modifiedTasks) => {
  try {
    return await makeApiCall("/api/tasks/", "PATCH", modifiedTasks);
  } catch (err) {
    throw err;
  }
};

export const clearAllTasks = async () => {
  try {
    return await makeApiCall("/api/tasks/", "DELETE");
  } catch (err) {
    throw err;
  }
};
