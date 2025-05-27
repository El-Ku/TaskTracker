import makeApiCall from "./makeApiCall";

export const getUsers = async () => {
  try {
    const data = await makeApiCall("/api/admin/users", null, null);
    if (data.result === "error") {
      return;
    } else {
      return data.payload;
    }
  } catch (err) {
    throw err;
  }
};

export const deleteUsers = async (userIds) => {
  try {
    return await makeApiCall(`/api/admin/users`, "DELETE", userIds);
  } catch (err) {
    throw err;
  }
};

export const clearAllUsers = async () => {
  try {
    return await makeApiCall("/api/admin/users/", "DELETE");
  } catch (err) {
    throw err;
  }
};

export const updateUsers = async (modifiedUsers) => {
  try {
    return await makeApiCall("/api/admin/users/", "PATCH", modifiedUsers);
  } catch (err) {
    throw err;
  }
};

export const addUsers = async (newUsers) => {
  try {
    return await makeApiCall("/api/admin/users/", "POST", newUsers);
  } catch (err) {
    throw err;
  }
};
