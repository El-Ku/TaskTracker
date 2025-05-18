import makeApiCall from "./makeApiCall";

export const getTasks = async () => {
  try {
    const data = await makeApiCall("/api/tasks/allTasks", null, null);
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
  try {
    const trimmed = taskInput.trim();
    if (!trimmed) return;

    const newTasks = trimmed.split(",").map((t) => ({
      desc: t.trim(),
    }));
    const data = await makeApiCall("/api/tasks/", "POST", newTasks);
    return data.payload;
  } catch (err) {
    throw err;
  }
};

export const deleteTasks = async (id) => {
  try {
    return await makeApiCall(`/api/tasks/${id}`, "DELETE", null);
  } catch (err) {
    throw err;
  }
};

export const updateTaskStatus = async (id, status) => {
  try {
    return await makeApiCall(`/api/tasks/${id}`, "PATCH", { status });
  } catch (err) {
    throw err;
  }
};

export const updateFieldCallApi = async (id, fieldToUpdate) => {
  try {
    return await makeApiCall(`/api/tasks/${id}`, "PATCH", fieldToUpdate);
  } catch (err) {
    throw err;
  }
};

export const clearAllTasks = async () => {
  try {
    return await makeApiCall("/api/tasks/allTasks", "DELETE", null);
  } catch (err) {
    throw err;
  }
};
