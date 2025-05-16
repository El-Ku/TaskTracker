import makeApiCall from "./makeApiCall";

export const getTasks = async () => {
  const data = await makeApiCall("/api/tasks/allTasks", null, null);
  return data.payload;
};

export const addTasks = async (taskInput) => {
  const trimmed = taskInput.trim();
  if (!trimmed) return;

  const newTasks = trimmed.split(",").map((t) => ({
    desc: t.trim(),
  }));
  const data = await makeApiCall("/api/tasks/", "POST", newTasks);
  return data.payload;
};

export const deleteTasks = async (id) => {
  return await makeApiCall(`/api/tasks/${id}`, "DELETE", null);
};

export const updateTaskStatus = async (id, status) => {
  return await makeApiCall(`/api/tasks/${id}`, "PATCH", { status });
};

export const updateFieldCallApi = async (id, fieldToUpdate) => {
  return await makeApiCall(`/api/tasks/${id}`, "PATCH", fieldToUpdate);
};
