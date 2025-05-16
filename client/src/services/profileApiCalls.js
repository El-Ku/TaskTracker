import makeApiCall from "./makeApiCall";

export const getUserInfoFromServer = async () => {
  const data = await makeApiCall("/api/users/user-info", null, null);
  return data.payload;
};

export const updateUserInfo = async (userInfo) => {
  return await makeApiCall("/api/users/update-user-info", "POST", userInfo);
};

export const updatePassword = async (passwordInfo) => {
  return await makeApiCall("/api/users/update-password", "POST", passwordInfo);
};

export const deleteAccount = async () => {
  return await makeApiCall("/api/users/delete-account", "DELETE", null);
};
