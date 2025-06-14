export const userRegInfo = {
  username: "lala",
  password: "Abcd1234",
  confirmPassword: "Abcd1234",
  email: "lala@elku.com",
};

export const userLoginInfo = { ...userRegInfo };
delete userLoginInfo.email;
