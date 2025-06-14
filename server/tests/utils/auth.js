import request from "supertest";
import app from "../../src/server";

export const registerUser = async (userDetails) => {
  return await request(app)
    .post("/tasktracker/api/auth/register")
    .send(userDetails);
};

export const registerUserSuccessfully = async (userDetails) => {
  const response = await registerUser(userDetails);
  expect(response.status).toBe(200);
  expect(response.body.message).toBe(
    "User was successfully registered on the system"
  );
};

export const loginUser = async (userDetails) => {
  return await request(app)
    .post("/tasktracker/api/auth/login")
    .send(userDetails);
};

export const loginUserSuccessfully = async (userDetails) => {
  const response = await loginUser(userDetails);
  expect(response.status).toBe(200);
  expect(response.body.message).toBe("User logged in successfully");
  expect(response.body.token).toHaveLength;
};
