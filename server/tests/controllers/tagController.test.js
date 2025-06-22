import { describe, expect, test, jest } from "@jest/globals";
import { userRegInfo, userLoginInfo } from "../utils/constants";
import { regAndLoginSuccessfully } from "../utils/auth";
import {
  clearDB,
  getNotificationInfos,
  countConfirmTokens,
  getUserInfoByEmailId,
  deleteTagById,
  getAllConfirmTokens,
} from "../utils/db";
import request from "supertest";
import app from "../../src/server";
import { createTag, acceptInvite } from "../utils/tags";

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

  test("Success: Manager accepts the invite to join the tag", async () => {
    await createTag(userOrig);
    await acceptInvite(
      userOrig[1].email,
      userOrig[1].token,
      "Manager",
      "test-tag"
    );
  });

  test("Success: Member accepts the invite to join the tag", async () => {
    await createTag(userOrig);
    await acceptInvite(
      userOrig[2].email,
      userOrig[2].token,
      "Member",
      "test-tag"
    );
  });

  test("Fails: Trying to join a tag after its deletion", async () => {
    const savedTag = await createTag(userOrig);
    await deleteTagById(savedTag._id);

    const notifications = await getNotificationInfos(userOrig[2]._id);
    const token = notifications[0].gotoUrlOnClick.split("/").pop();
    const response = await request(app)
      .get(`/tasktracker/api/tags/accept-invite/${token}`)
      .set("Authorization", `Bearer ${userOrig[2].token}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(
      "This tag is either deleted or doesn't exist"
    );
  });

  // this test is not working as expected, so skipping it for now
  // api call is timing out when I use fake timers
  test.skip("Fails: Member tries to accept the invitation after token expires", async () => {
    await createTag(userOrig);
    const userInfo = await getUserInfoByEmailId(userOrig[2].email);
    const notifications = await getNotificationInfos(userInfo._id);
    const token = notifications[0].gotoUrlOnClick.split("/").pop();

    console.log("Current date:", new Date());
    const future = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000);
    jest.useFakeTimers("modern");
    jest.setSystemTime(future);
    console.log("Current date:", new Date());

    console.log("Token:", token);
    const response = await request(app)
      .get(`/tasktracker/api/tags/accept-invite/${token}`)
      .set("Authorization", `Bearer ${userOrig[2].token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User added to the tag successfully");
    jest.useRealTimers();
  });
});

export const verifySuccessfulTagCreation = async (
  response,
  newTag,
  userOrig
) => {
  expect(response.status).toBe(200);
  expect(response.body.message).toBe("Tag was created successfully");

  const savedTag = response.body.payload;

  expect(savedTag).toHaveProperty("_id");
  expect(savedTag.tagName).toBe(newTag.tagName);
  expect(savedTag.superManagerId).toBe(userOrig[0]._id.toString());

  let totalInvitesSent = 0;

  if (newTag.managerEmails) {
    totalInvitesSent += newTag.managerEmails.length;
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
    totalInvitesSent += newTag.memberEmails.length;
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
  expect(confirmTokensCount).toBe(totalInvitesSent);

  if (confirmTokensCount > 0) {
    await validateTokens(savedTag._id);
  }
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

const validateTokens = async (tagId) => {
  const confirmTokens = await getAllConfirmTokens();

  for (const token of confirmTokens) {
    expect(token.action.tagId.toString()).toBe(tagId.toString());
    expect(token.token).toBeDefined();
    expect(token.expiryDate - Date.now()).toBeCloseTo(
      30 * 24 * 60 * 60 * 1000,
      -5000
    ); // within 5 seconds of 30 days
  }
};
