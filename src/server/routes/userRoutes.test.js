require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const databaseConnect = require("../../database");
const User = require("../../database/models/user");
const app = require("../index");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectionString = mongoServer.getUri();

  await databaseConnect(connectionString);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.create({
    username: "user1",
    password: "$2b$10$vQcjA2ldvcvUuGTil.Jp6uLgNoAZvVtmFFR1hHH4iKHz4zqfvl7oe",
    teamName: "team1",
    players: [],
  });

  await User.create({
    username: "user2",
    password: "user2",
    teamName: "team2",
    players: [],
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("Given a /login endpoint", () => {
  describe("When it receives a POST request with a correct username and correct password", () => {
    test("Then it should return a token", async () => {
      const user = {
        username: "user1",
        password: "user1",
      };

      const { body } = await request(app)
        .post("/user/login")
        .send(user)
        .expect(200);

      expect(body).toHaveProperty("token");
    });
  });

  describe("When it recevies a POST request with a wrong username", () => {
    test("Then it should respond with a 401", async () => {
      const user = {
        username: "afsjkdl",
        password: "user1",
      };
      const expectedError = {
        error: true,
        message: "Wrong username, user not found",
      };

      const { body } = await request(app)
        .post("/user/login")
        .send(user)
        .expect(404);

      expect(body).toHaveProperty("message", expectedError.message);
      expect(body).toHaveProperty("error", expectedError.error);
    });
  });
});
