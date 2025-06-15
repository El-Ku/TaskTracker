import { describe, expect, test, beforeAll } from "@jest/globals";
import { userRegInfo, userLoginInfo, invalidEmails } from "../utils/constants";
import {
  loginUser,
  loginUserSuccessfully,
  regAndLoginSuccessfully,
} from "../utils/auth";
import { clearDB, getUserInfo } from "../utils/db";
import request from "supertest";
import app from "../../src/server";

describe("Update profile info: fullName and email ", () => {
  let userOrig;
  beforeEach(async () => {
    await clearDB();
    userOrig = await regAndLoginSuccessfully(userRegInfo, userLoginInfo);
  });

  test("Fails: Tries to update with incorrect token", async () => {
    const response = await request(app)
      .get("/tasktracker/api/profile/user-info")
      .set("Authorization", `Bearer ${"dummy token string"}`)
      .send({ email: "dummy@dummy.com" });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token is not valid");
  });

  test("Fails: send over only fullname", async () => {
    const response = await request(app)
      .patch("/tasktracker/api/profile/user-info")
      .set("Authorization", `Bearer ${userOrig[0].token}`)
      .send({ fullName: "new full name" });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email is required");
  });

  test("Success: send over only email", async () => {
    const response = await request(app)
      .patch("/tasktracker/api/profile/user-info")
      .set("Authorization", `Bearer ${userOrig[0].token}`)
      .send({ email: "dummy@dummy.com" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Profile updated successfully");
    const currentUserInfo = await getUserInfo(userOrig[0]._id);
    expect(currentUserInfo.email).toBe("dummy@dummy.com");
    expect(currentUserInfo.settings.fullName).toBe(
      userOrig[0].settings.fullName
    );
  });

  test("Success: send over both fullName and email", async () => {
    const response = await request(app)
      .patch("/tasktracker/api/profile/user-info")
      .set("Authorization", `Bearer ${userOrig[0].token}`)
      .send({ fullName: "new fullname", email: "dummy@dummy.com" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Profile updated successfully");
    const currentUserInfo = await getUserInfo(userOrig[0]._id);
    expect(currentUserInfo.email).toBe("dummy@dummy.com");
    expect(currentUserInfo.settings.fullName).toBe("new fullname");
  });

  test("Fails: Invalid email format", async () => {
    for (const email of invalidEmails) {
      const response = await request(app)
        .patch("/tasktracker/api/profile/user-info")
        .set("Authorization", `Bearer ${userOrig[0].token}`)
        .send({ email });
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid email");
    }
  });

  test("Fails: Invalid fullName format", async () => {
    const response = await request(app)
      .patch("/tasktracker/api/profile/user-info")
      .set("Authorization", `Bearer ${userOrig[0].token}`)
      .send({ fullName: "la", email: "dummy@dummy.com" });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Full name must be at least 3 characters"
    );
  });
});

describe("Get user's profile information", () => {
  let userOrig;
  beforeEach(async () => {
    await clearDB();
    userOrig = await regAndLoginSuccessfully(userRegInfo, userLoginInfo);
  });

  test("Success: Returns the default information", async () => {
    const response = await request(app)
      .get("/tasktracker/api/profile/user-info")
      .set("Authorization", `Bearer ${userOrig[0].token}`);
    expect(response.status).toBe(200);
    expect(response.body.payload.fullName).toBe(userLoginInfo[0].username);
    expect(response.body.payload.email).toBe(userRegInfo[0].email);
  });

  test("Success: Returns the updated information", async () => {
    //update info first
    let response = await request(app)
      .patch("/tasktracker/api/profile/user-info")
      .set("Authorization", `Bearer ${userOrig[0].token}`)
      .send({ fullName: "new fullname", email: "dummy@dummy.com" });
    // get info from database through api call
    response = await request(app)
      .get("/tasktracker/api/profile/user-info")
      .set("Authorization", `Bearer ${userOrig[0].token}`);
    expect(response.status).toBe(200);
    expect(response.body.payload.fullName).toBe("new fullname");
    expect(response.body.payload.email).toBe("dummy@dummy.com");
  });

  test("Fails: Tries to access with incorrect token", async () => {
    const response = await request(app)
      .get("/tasktracker/api/profile/user-info")
      .set("Authorization", `Bearer ${"dummy token string"}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token is not valid");
  });
});

describe("Update password", () => {
  let userOrig;
  beforeEach(async () => {
    await clearDB();
    userOrig = await regAndLoginSuccessfully(userRegInfo, userLoginInfo);
  });

  test("Success: Change password", async () => {
    const passwordData = {
      currentPassword: userRegInfo[0].password,
      newPassword: "NewPass1",
      confirmPassword: "NewPass1",
    };
    const response = await request(app)
      .post("/tasktracker/api/profile/update-password")
      .set("Authorization", `Bearer ${userOrig[0].token}`)
      .send(passwordData);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Password changed successfully");
  });

  test("Fails: Incorrect current password", async () => {
    const passwordData = {
      currentPassword: "Incorrect current password1",
      newPassword: "NewPass1",
      confirmPassword: "NewPass1",
    };
    const response = await request(app)
      .post("/tasktracker/api/profile/update-password")
      .set("Authorization", `Bearer ${userOrig[0].token}`)
      .send(passwordData);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid current password");
  });

  test("Fails: One of the password fields is missing", async () => {
    const passwordData = [
      {
        newPassword: "NewPass1",
        confirmPassword: "NewPass1",
      },
      {
        currentPassword: userRegInfo[0].password,
        confirmPassword: "NewPass1",
      },
      {
        currentPassword: userRegInfo[0].password,
        newPassword: "NewPass1",
      },
    ];
    for (const pass of passwordData) {
      const response = await request(app)
        .post("/tasktracker/api/profile/update-password")
        .set("Authorization", `Bearer ${userOrig[0].token}`)
        .send(pass);
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Password is required");
    }
  });

  test("Fails: Trying with incorrect token", async () => {
    const passwordData = {
      currentPassword: "doesnt matter what this is",
      newPassword: "NewPass1",
      confirmPassword: "NewPass1",
    };
    const response = await request(app)
      .post("/tasktracker/api/profile/update-password")
      .set("Authorization", `Bearer ${"Incorrect token string"}`)
      .send(passwordData);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token is not valid");
  });
});

describe("Delete one's own account", () => {
  let userOrig;
  beforeEach(async () => {
    await clearDB();
    userOrig = await regAndLoginSuccessfully(userRegInfo, userLoginInfo);
  });

  test("Success: Account deleted with correct token", async () => {
    const response = await request(app)
      .delete("/tasktracker/api/profile/user-info")
      .set("Authorization", `Bearer ${userOrig[0].token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User account deleted successfully");
    //Make sure user cannot login again
    const response2 = await loginUser(userLoginInfo[0]);
    expect(response2.body.message).toBe("Invalid username or password");
  });

  test("Fails: Account NOT deleted with incorrect token", async () => {
    const response = await request(app)
      .delete("/tasktracker/api/profile/user-info")
      .set("Authorization", `Bearer ${"incorrect dummy token"}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token is not valid");
    //Make sure the same user is able to successfully login again.
    await loginUserSuccessfully(userLoginInfo[0]);
  });
});
