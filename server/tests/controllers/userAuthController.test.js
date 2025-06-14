import { describe, expect, test, beforeAll } from "@jest/globals";
import { userRegInfo, userLoginInfo } from "../utils/constants";
import {
  registerUser,
  registerUserSuccessfully,
  loginUser,
  loginUserSuccessfully,
} from "../utils/auth";
import { clearDB } from "../utils/db";

describe("Register as a user", () => {
  test("Success: Registering a user with all the required fields", async () => {
    await clearDB();
    await registerUserSuccessfully(userRegInfo);
  });

  test("Fails: Registering with the same username", async () => {
    await clearDB();
    await registerUserSuccessfully(userRegInfo); //1st user
    const response = await registerUser(userRegInfo); //2nd user with same username
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "User already exists. Choose a different username"
    );
  });

  test("Fails: Registering with the same email", async () => {
    await clearDB();
    await registerUserSuccessfully(userRegInfo); //first user
    const data = { ...userRegInfo };
    data.username = "dummy-name";
    const response = await registerUser(data); //2nd user with same email, but different username
    expect(response.status).toBe(500);
    expect(response.body.message).toContain(
      "MongoServerError: E11000 duplicate key error collection"
    );
  });

  test("Fails: Try to register without username field", async () => {
    const data = { ...userRegInfo };
    delete data.username;
    const response = await registerUser(data);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Username is required");
  });

  test("Fails: Try to register without password field", async () => {
    const data = { ...userRegInfo };
    delete data.password;
    const response = await registerUser(data);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Password is required");
  });

  test("Fails: Try to register without confirmPassword field", async () => {
    const data = { ...userRegInfo };
    delete data.confirmPassword;
    const response = await registerUser(data);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Password is required");
  });

  test("Fails: Try to register without email field", async () => {
    const data = { ...userRegInfo };
    delete data.email;
    const response = await registerUser(data);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email is required");
  });

  test("Fails: When username is not valid", async () => {
    const data = { ...userRegInfo };
    data.username = "la";
    const response = await registerUser(data);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Username must be at least 3 characters long"
    );
  });

  test("Fails: When password is not valid", async () => {
    const invalidPasswords = [
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
    const data = { ...userRegInfo };
    for (const i in invalidPasswords) {
      data.password = invalidPasswords[i].pass;
      const response = await registerUser(data);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(invalidPasswords[i].error);
    }
  });

  test("Fails: When confirmPassword is not valid", async () => {
    const invalidPasswords = [
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
    const data = { ...userRegInfo };
    for (const i in invalidPasswords) {
      data.confirmPassword = invalidPasswords[i].pass;
      const response = await registerUser(data);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(invalidPasswords[i].error);
    }
  });

  test("Fails: When email is not valid", async () => {
    const invalidEmails = [
      "@gmail.com",
      "gmail.com",
      "lala@.com",
      "lala@.",
      "lala@com",
    ];
    const data = { ...userRegInfo };
    for (const i in invalidEmails) {
      data.email = invalidEmails[i];
      const response = await registerUser(data);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid email");
    }
  });
});

describe("Logging in", () => {
  //registerUserSuccessfully(userRegInfo);
  beforeAll(async () => {
    await clearDB();
    await registerUserSuccessfully(userRegInfo);
  });

  test("Success: Logging in with the correct info", async () => {
    await loginUserSuccessfully(userLoginInfo);
  });

  test("Fails: Logging in without username", async () => {
    const data = { ...userLoginInfo };
    delete data.username;
    const response = await loginUser(data);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      "Both username and password are required"
    );
  });

  test("Fails: Logging in without password", async () => {
    const data = { ...userLoginInfo };
    delete data.password;
    const response = await loginUser(data);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      "Both username and password are required"
    );
  });

  test("Fails: Logging in with incorrect password", async () => {
    const data = { ...userLoginInfo };
    data.password = "wrong-dummy-password";
    const response = await loginUser(data);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Invalid username or password");
  });

  test("Fails: Logging in with incorrect username", async () => {
    const data = { ...userLoginInfo };
    data.username = "wrong-dummy-username";
    const response = await loginUser(data);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Invalid username or password");
  });
});
