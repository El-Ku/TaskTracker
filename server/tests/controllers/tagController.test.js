import { describe, expect, test } from "@jest/globals";
import { userRegInfo, userLoginInfo } from "../utils/constants";
import { regAndLoginSuccessfully } from "../utils/auth";
import {
  clearDB,
  getNotificationInfos,
  countConfirmTokens,
  getUserInfoByEmailId,
} from "../utils/db";
import request from "supertest";
import app from "../../src/server";

describe("Accessing without correct token", () => {
  test("Fails: Tries to access /api/tags route without access token", async () => {
    await clearDB();
    await regAndLoginSuccessfully(userRegInfo, userLoginInfo);
    const response = await request(app)
      .get("/tasktracker/api/tags")
      .set("Authorization", `Bearer ${"dummy token string"}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token is not valid");
  });
});
describe("Create a tag", () => {
  let userOrig;
  beforeEach(async () => {
    await clearDB();
    userOrig = await regAndLoginSuccessfully(userRegInfo, userLoginInfo);
  });

  test("Fails: Simple tag creation without tagName", async () => {
    const response = await request(app)
      .post("/tasktracker/api/tags")
      .set("Authorization", `Bearer ${userOrig[0].token}`)
      .send({});
    expect(response.status).toBe(500);
    expect(response.body.message).toContain("Tag name is required");
  });

  test("Success: Simple tag creation with tagName", async () => {
    const newTag = { tagName: "test-tag" };
    const response = await request(app)
      .post("/tasktracker/api/tags")
      .set("Authorization", `Bearer ${userOrig[0].token}`)
      .send(newTag);
    expect(response.status).toBe(200);
    expect(response.body.result).toBe("success");
    expect(response.body.message).toBe("Tag was created successfully");
    expect(response.body.payload).toHaveProperty("_id");
  });

  test("Fails: Tag creation with invalid manager email", async () => {
    const newTag = { tagName: "test-tag", managerEmails: ["invalid-email"] };
    const response = await request(app)
      .post("/tasktracker/api/tags")
      .set("Authorization", `Bearer ${userOrig[0].token}`)
      .send(newTag);
    expect(response.status).toBe(500);
    expect(response.body.message).toContain("Error: Invalid email");
  });

  test("Success: Tag creation with 1 manager and 1 member", async () => {
    const newTag = {
      tagName: "test-tag",
      managerEmails: [userOrig[1].email],
      memberEmails: [userOrig[2].email],
    };
    const response = await request(app)
      .post("/tasktracker/api/tags")
      .set("Authorization", `Bearer ${userOrig[0].token}`)
      .send(newTag);
    await verifySuccessfulTagCreation(response, newTag, userOrig);
  });

  test("Success: Tag creation with 0 manager and 1 member", async () => {
    const newTag = {
      tagName: "test-tag",
      memberEmails: [userOrig[1].email],
    };
    const response = await request(app)
      .post("/tasktracker/api/tags")
      .set("Authorization", `Bearer ${userOrig[0].token}`)
      .send(newTag);
    await verifySuccessfulTagCreation(response, newTag, userOrig);
  });

  test("Success: Tag creation with 2 managers and zero members", async () => {
    const newTag = {
      tagName: "test-tag",
      managerEmails: [userOrig[1].email, userOrig[2].email],
    };
    const response = await request(app)
      .post("/tasktracker/api/tags")
      .set("Authorization", `Bearer ${userOrig[0].token}`)
      .send(newTag);
    console.table(response.body);
    await verifySuccessfulTagCreation(response, newTag, userOrig);
  });

  test("Success: Tag creation with unregistered manager and member", async () => {
    const newTag = {
      tagName: "test-tag",
      managerEmails: ["dummy-email1@dummy.com"],
      memberEmails: ["dummy-email2@dummy.com"],
    };
    const response = await request(app)
      .post("/tasktracker/api/tags")
      .set("Authorization", `Bearer ${userOrig[0].token}`)
      .send(newTag);
    console.table(response.body);
    await verifySuccessfulTagCreation(response, newTag, userOrig);
  });
});

const verifySuccessfulTagCreation = async (response, newTag, userOrig) => {
  expect(response.status).toBe(200);
  expect(response.body.message).toBe("Tag was created successfully");

  const savedTag = response.body.payload;

  expect(savedTag).toHaveProperty("_id");
  expect(savedTag.tagName).toBe(newTag.tagName);
  expect(savedTag.superManagerId).toBe(userOrig[0]._id.toString());

  if (newTag.managerEmails) {
    expect(savedTag.managers).toHaveLength(newTag.managerEmails.length);
    for (const email of newTag.managerEmails) {
      const match = savedTag.managers.find((m) => m.email === email);
      expect(match).toBeDefined();
      await validateNotification(email, newTag.tagName, "Manager");
    }
  } else {
    expect(savedTag.managers || []).toHaveLength(0);
  }

  if (newTag.memberEmails) {
    expect(savedTag.members).toHaveLength(newTag.memberEmails.length);
    for (const email of newTag.memberEmails) {
      const match = savedTag.members.find((m) => m.email === email);
      expect(match).toBeDefined();
      await validateNotification(email, newTag.tagName, "Member");
    }
  } else {
    expect(savedTag.members || []).toHaveLength(0);
  }

  const confirmTokensCount = await countConfirmTokens();
};

const validateNotification = async (email, tagName, roleLabel) => {
  const userInfo = await getUserInfoByEmailId(email);

  const identifier = userInfo ? userInfo._id : email;
  const notifications = await getNotificationInfos(identifier);

  expect(notifications).toHaveLength(1);
  const notification = notifications[0];

  if (userInfo) {
    expect(notification.userId).toBe(userInfo._id.toString());
  } else {
    expect(notification.userId).toBe(email);
  }

  expect(notification.notificationText).toBe(
    `You have been invited to join the ${tagName} tag as a ${roleLabel}`
  );
  expect(notification.gotoUrlOnClick).toBeDefined();
};
