import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { server } from "../server";
import UsersModel from "../api/user/model.js";

dotenv.config();

const client = supertest(server);

const correctUserGuest = {
  email: "john@gmail.com",
  password: "12345",
  role: "Guest",
};

const UserInvalid = {
    email: "john@gmail.com",
    password: "12345",
    role: "invalidValue",
  };

beforeAll(async () => {
  if (process.env.MONGO_DB_CONNECTION_STRING) {
    await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Test User Endpoints", () => {
    it ("Should return 200 when GET /users is successful", async () => {
        const response = await client.get("/users")
        expect(response.status).toBe(200)
    })

    it ("Should return 201 when POST /users/register is successful", async () => {
        const response = await client.post("/users/register").send(correctUserGuest)
        expect(response.status).toBe(201)
    })

    it ("Should return 400 when POST /users/register with invalid data", async () => {
        const response = await client.post("/users/register").send(UserInvalid)
        expect(response.status).toBe(400)
    })

    it ("Should return 200 when POST /users/login with valid token", async () => {
        const response = await client.post("/users").send(UserInvalid)
        expect(response.status).toBe(200)
    })

    it ("Should return 401 when POST /users/login with invalid token", async () => {
        const response = await client.post("/users").send(UserInvalid)
        expect(response.status).toBe(401)
    })

    it ("Should return 200 when POST /users/refreshTokens", async () => {
        const response = await client.post("/users/refreshTokens").send(UserInvalid)
        expect(response.status).toBe(200)
    })

    

})