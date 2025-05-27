import makeApiCall from "./makeApiCall";
import { z } from "zod";
import { schemaDesc } from "../validation/zodSchemas";

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
  const tasksArraySchema = z.array(schemaDesc);
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
