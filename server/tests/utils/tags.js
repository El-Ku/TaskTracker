import request from "supertest";
import app from "../../src/server";
import { verifySuccessfulTagCreation } from "../controllers/tagController.test";
import {
  getNotificationInfos,
  getUserInfoByEmailId,
  countConfirmTokens,
} from "./db";

export const createTag = async (userOrig) => {
  const newTag = {
    tagName: "test-tag",
    managerEmails: ["dummy-email1@dummy.com", userOrig[1].email],
    memberEmails: ["dummy-email2@dummy.com", userOrig[2].email],
  };
  const response = await request(app)
    .post("/tasktracker/api/tags")
    .set("Authorization", `Bearer ${userOrig[0].token}`)
    .send(newTag);

  await verifySuccessfulTagCreation(response, newTag, userOrig);

  return response.body.payload;
};

export const acceptInvite = async (userEmail, userToken, userRole, tagName) => {
  const userInfo = await getUserInfoByEmailId(userEmail);
  const notifications = await getNotificationInfos(userInfo._id);
  const token = notifications[0].gotoUrlOnClick.split("/").pop();

  const response = await request(app)
    .get(`/tasktracker/api/tags/accept-invite/${token}`)
    .set("Authorization", `Bearer ${userToken}`);

  expect(response.status).toBe(200);
  expect(response.body.message).toBe("User added to the tag successfully");

  // Verify that the tag is listed in the user's document
  const updatedUserInfo = await getUserInfoByEmailId(userEmail);
  let tagDetailsFoundInUser = false;
  for (const tag of updatedUserInfo.tags) {
    if (tag.tagName === tagName) {
      expect(tag.tagName).toBe(tagName);
      expect(tag.userRole).toBe(userRole);
      expect(tag.tagId).toBeDefined();
      tagDetailsFoundInUser = true;
      break;
    }
  }
  expect(tagDetailsFoundInUser).toBe(true);

  // Fails when tried again with the same token
  const response2 = await request(app)
    .get(`/tasktracker/api/tags/accept-invite/${token}`)
    .set("Authorization", `Bearer ${userToken}`);
  expect(response2.status).toBe(404);
  expect(response2.body.message).toBe("Token not found");
};
