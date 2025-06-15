import { describe, expect, test, beforeAll } from "@jest/globals";
import {
  userRegInfo,
  userLoginInfo,
  invalidEmails,
  invalidPasswords,
} from "../utils/constants";
import {
  registerUser,
  registerUserSuccessfully,
  loginUser,
  loginUserSuccessfully,
} from "../utils/auth";
import { clearDB } from "../utils/db";

describe("Registering new user(s)", () => {
  test("Success: Registering a user with all the required fields", async () => {
    await clearDB();
    await registerUserSuccessfully(userRegInfo[0]);
  });

  test("Success: Registering multiple users with all the required fields", async () => {
    await clearDB();
    for (const user of userRegInfo) {
      await registerUserSuccessfully(user);
    }
  });

  test("Fails: Registering with the same username", async () => {
    await clearDB();
    await registerUserSuccessfully(userRegInfo[0]); //1st user
    const response = await registerUser(userRegInfo[0]); //2nd user with same username
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "User already exists. Choose a different username"
    );
  });

  test("Fails: Registering with the same email", async () => {
    await clearDB();
    await registerUserSuccessfully(userRegInfo[0]); //first user
    const data = { ...userRegInfo[0] };
    data.username = "dummy-name";
    const response = await registerUser(data); //2nd user with same email, but different username
    expect(response.status).toBe(500);
    expect(response.body.message).toContain(
      "MongoServerError: E11000 duplicate key error collection"
    );
  });

  test("Fails: Try to register without username field", async () => {
    const data = { ...userRegInfo[0] };
    delete data.username;
    const response = await registerUser(data);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Username is required");
  });

  test("Fails: Try to register without password field", async () => {
    const data = { ...userRegInfo[0] };
    delete data.password;
    const response = await registerUser(data);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Password is required");
  });

  test("Fails: Try to register without confirmPassword field", async () => {
    const data = { ...userRegInfo[0] };
    delete data.confirmPassword;
    const response = await registerUser(data);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Password is required");
  });

  test("Fails: Try to register without email field", async () => {
    const data = { ...userRegInfo[0] };
    delete data.email;
    const response = await registerUser(data);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email is required");
  });

  test("Fails: When username is not valid", async () => {
    const data = { ...userRegInfo[0] };
    data.username = "la";
    const response = await registerUser(data);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Username must be at least 3 characters long"
    );
  });

  test("Fails: When password is not valid", async () => {
    const data = { ...userRegInfo[0] };
    for (const i in invalidPasswords) {
      data.password = invalidPasswords[i].pass;
      const response = await registerUser(data);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(invalidPasswords[i].error);
    }
  });

  test("Fails: When confirmPassword is not valid", async () => {
    const data = { ...userRegInfo[0] };
    for (const i in invalidPasswords) {
      data.confirmPassword = invalidPasswords[i].pass;
      const response = await registerUser(data);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(invalidPasswords[i].error);
    }
  });

  test("Fails: When email is not valid", async () => {
    const data = { ...userRegInfo[0] };
    for (const i in invalidEmails) {
      data.email = invalidEmails[i];
      const response = await registerUser(data);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid email");
    }
  });
});

describe("Logging in", () => {
  beforeAll(async () => {
    await clearDB();
    await registerUserSuccessfully(userRegInfo[0]);
  });

  test("Success: Logging in with the correct info", async () => {
    await loginUserSuccessfully(userLoginInfo[0]);
  });

  test("Fails: Logging in without username", async () => {
    const data = { ...userLoginInfo[0] };
    delete data.username;
    const response = await loginUser(data);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      "Both username and password are required"
    );
  });

  test("Fails: Logging in without password", async () => {
    const data = { ...userLoginInfo[0] };
    delete data.password;
    const response = await loginUser(data);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      "Both username and password are required"
    );
  });

  test("Fails: Logging in with incorrect password", async () => {
    const data = { ...userLoginInfo[0] };
    data.password = "wrong-dummy-password";
    const response = await loginUser(data);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Invalid username or password");
  });

  test("Fails: Logging in with incorrect username", async () => {
    const data = { ...userLoginInfo[0] };
    data.username = "wrong-dummy-username";
    const response = await loginUser(data);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Invalid username or password");
  });
});
