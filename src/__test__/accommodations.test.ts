import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import server from "../server";
import UsersModel from "../api/user/model";

dotenv.config();

const client = supertest(server);

describe("Test Accommodations Endpoints", async () => {
  const users = await UsersModel.find({ role: "host" });

  const correctAccommodation = {
    name: "Plaza del Sol",
    host: users[0]._id,
    description: "test description",
    maxGuests: 4,
    city: "Santander",
  };

  const invalidAccommodation = {
    name: "Plaza del Sol",
    host: users[0]._id,
    description: "test description",
    maxGuests: "INVALID MAX GUESTS",
    city: "Santander",
  };

  let newAccommodationId: string;

  beforeAll(async () => {
    if (process.env.MONGO_DB_CONNECTION_STRING) {
      await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
    }
  });

  //   Mongo check

  it("Should check that Mongo connection string is not undefined", () => {
    expect(process.env.MONGO_DB_CONNECTION_STRING).toBeDefined();
  });

  //   GET accommodations

  it("Should return 200 when GET /accommodations is successful", async () => {
    const response = await client.get("/accommodations");
    expect(response.status).toBe(200);
  });

  // Close MongoDB connection after suite finish

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
