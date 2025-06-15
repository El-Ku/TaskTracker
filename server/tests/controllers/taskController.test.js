import { describe, expect, test } from "@jest/globals";
import { userRegInfo, userLoginInfo } from "../utils/constants";
import { regAndLoginSuccessfully } from "../utils/auth";
import { clearDB } from "../utils/db";
import request from "supertest";
import app from "../../src/server";

describe("Accessing without correct token", () => {
  test("Fails: Tries to access /api/tasks route without access token", async () => {
    await clearDB();
    await regAndLoginSuccessfully(userRegInfo, userLoginInfo);
    const response = await request(app)
      .get("/tasktracker/api/tasks")
      .set("Authorization", `Bearer ${"dummy token string"}`);
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Token is not valid");
  });
});
