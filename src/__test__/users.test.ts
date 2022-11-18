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
})