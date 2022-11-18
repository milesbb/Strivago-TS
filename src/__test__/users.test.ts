import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UsersModel from "../api/user/model.js";
import server from "../server";

dotenv.config();

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

const client = supertest(server);

const correctUserGuest = {
  email: "john@gmail.com",
  password: "12345",
  role: "Guest",
};

const correctUserGuestLogin = {
  email: "john@gmail.com",
  password: "12345",
};

const correctUserHost = {
  email: "alex@gmail.com",
  password: "12345",
  role: "Host",
};

const correctUserHostLogin = {
  email: "alex@gmail.com",
  password: "12345",
};

const UserInvalid = {
  email: "INVALIDINVALID@gmail.com",
  password: "badpass",
  role: "invalidValue",
};

describe("Test User Endpoints", () => {
  let hostTokens: LoginResponse;
  let guestTokens: LoginResponse;

  beforeAll(async () => {
    if (process.env.MONGO_DB_CONNECTION_STRING) {
      await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
    }
  });

  //   Mongo check

  it("Should check that Mongo connection string is not undefined", () => {
    expect(process.env.MONGO_DB_CONNECTION_STRING).toBeDefined();
  });

  //   GET users

  it("Should return 200 when GET /users is successful", async () => {
    const response = await client.get("/users");
    expect(response.status).toBe(200);
  });

  //   REGISTER users

  it("Should return 201 when POST /users/register with a Guest is successful", async () => {
    const response = await client
      .post("/users/register")
      .send(correctUserGuest);
    expect(response.status).toBe(201);
  });

  it("Should return 201 when POST /users/register with a Host is successful", async () => {
    const response = await client.post("/users/register").send(correctUserHost);
    expect(response.status).toBe(201);
  });

  it("Should return 400 when POST /users/register with invalid data", async () => {
    const response = await client.post("/users/register").send(UserInvalid);
    expect(response.status).toBe(400);
  });

  //   LOGIN users

  it("Should return 200 and access and refresh tokens of type string when POST /users/login with a valid HOST login", async () => {
    const response = await client
      .post("/users/login")
      .send(correctUserHostLogin)
      .expect(200);
    hostTokens = { ...response.body };
    expect(typeof hostTokens.accessToken).toBe("string");
    expect(typeof hostTokens.refreshToken).toBe("string");
  });

  it("Should return 200 and access and refresh tokens of type string when POST /users/login with a valid GUEST login", async () => {
    const response = await client
      .post("/users/login")
      .send(correctUserGuestLogin)
      .expect(200);
    guestTokens = { ...response.body };
    expect(typeof guestTokens.accessToken).toBe("string");
    expect(typeof guestTokens.refreshToken).toBe("string");
  });

  it("Should return 401 when POST /users/login with an invalid login", async () => {
    const response = await client.post("/users/login").send(UserInvalid);
    expect(response.status).toBe(401);
  });

  //   GET ME

  it("Should return 200 POST /users/me", async () => {
    const response = await client
      .post("/users/me")
      .set("Authorization", `Bearer ${guestTokens.accessToken}`)
      .expect(200);
  });

  //   REFRESH tokens

  it("Should return 200 when POST /users/refreshTokens and return different tokens than previous set", async () => {
    const response = await client
      .post("/users/refreshTokens")
      .send({ currentRefreshToken: hostTokens.refreshToken })
      .expect(200);
    console.log("response", response.body);
    console.log("old host", hostTokens);
    let oldTokens: LoginResponse = hostTokens;
    guestTokens = response.body;
    expect(oldTokens.accessToken !== hostTokens.accessToken).toBeTruthy();
    expect(oldTokens.refreshToken !== hostTokens.refreshToken).toBeTruthy();
  });

  // Close MongoDB connection after suite finish

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
