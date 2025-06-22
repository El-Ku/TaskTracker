export const userRegInfo = [
  {
    username: "username1",
    password: "Password1",
    confirmPassword: "Password1",
    email: "email1@elku.com",
  },
  {
    username: "username2",
    password: "Password2",
    confirmPassword: "Password2",
    email: "email2@elku.com",
  },
  {
    username: "username3",
    password: "Password3",
    confirmPassword: "Password3",
    email: "email3@elku.com",
  },
];

export const userLoginInfo = userRegInfo.map(({ email, ...rest }) => rest);

export const invalidPasswords = [
  { pass: "Abcd123", error: "Password must be at least 8 characters long" },
  {
    pass: "Abcd1234Abcd1234Abcd1234Abcd12345",
    error: "Password must be at most 32 characters long",
  },
  {
    pass: "abcd1234",
    error: "Password must include at least one uppercase letter",
  },
  {
    pass: "Abcdefgh",
    error: "Password must include at least one number letter",
  },
  {
    pass: "ABCD1234",
    error: "Password must include at least one lowercase letter",
  },
];

export const invalidEmails = [
  "@gmail.com",
  "gmail.com",
  "lala@.com",
  "lala@.",
  "lala@com",
];

export const tagInfo = {};
