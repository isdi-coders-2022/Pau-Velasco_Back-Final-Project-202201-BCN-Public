require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const databaseConnect = require("../../database");
const User = require("../../database/models/user");
const app = require("../index");
const Player = require("../../database/models/player");

let mongoServer;
let token1;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectionString = mongoServer.getUri();

  await databaseConnect(connectionString);
});

afterAll(() => {
  mongoose.connection.close();
  mongoServer.stop();
});

beforeEach(async () => {
  await User.create({
    username: "user1",
    password: "$2b$10$vQcjA2ldvcvUuGTil.Jp6uLgNoAZvVtmFFR1hHH4iKHz4zqfvl7oe",
    teamName: "team1",
    players: ["6229c27236ee9c9c2b458879"],
  });

  const userDataToken = {
    username: "user1",
  };

  token1 = jwt.sign(userDataToken, process.env.JWT_SECRET);

  await User.create({
    username: "user2",
    password: "user2",
    teamName: "team2",
    players: [],
  });

  await Player.create({
    name: "Cristiano",
    number: 7,
    goals: 21,
    assists: 3,
    yellowCards: 4,
    redCards: 1,
    totalMatches: 21,
    position: "Alero",
    photo:
      "https://img.uefa.com/imgml/TP/players/1/2022/324x324/63706.jpg?imwidth=36",
    id: "6229c27236ee9c9c2b458879",
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

  describe("When it recevies a POST request with a wrong password", () => {
    test("Then it should respond with a 401", async () => {
      const user = {
        username: "user1",
        password: "fdasjo",
      };
      const expectedError = {
        error: true,
        message: "Wrong password",
      };

      const { body } = await request(app)
        .post("/user/login")
        .send(user)
        .expect(401);

      expect(body).toHaveProperty("message", expectedError.message);
      expect(body).toHaveProperty("error", expectedError.error);
    });
  });
});

describe("Given a /load-user endpoint", () => {
  describe("When it receives a POST request with a token", () => {
    test("Then it should respond with the user", async () => {
      const expectedUser = {
        username: "user1",
        teamName: "team1",
        password:
          "$2b$10$vQcjA2ldvcvUuGTil.Jp6uLgNoAZvVtmFFR1hHH4iKHz4zqfvl7oe",
        players: ["6229c27236ee9c9c2b458879"],
      };

      const { body } = await request(app)
        .get("/user/load-user")
        .set("authorization", `Bearer ${token1}`)
        .expect(200);

      const { id, ...newBody } = body;
      const expectedBody = {
        user: newBody,
      };

      expect(expectedBody).toHaveProperty("user", expectedUser);
    });
  });

  describe("When it receives a POST request with a wrong token", () => {
    test("Then it should respond with an error and the message jwt malformed", async () => {
      const expectedError = { error: true, message: "jwt malformed" };

      const { body } = await request(app)
        .get("/user/load-user")
        .set("authorization", `Bearer 24243fsadsfd`)
        .expect(401);

      expect(body).toHaveProperty("error", expectedError.error);
      expect(body).toHaveProperty("message", expectedError.message);
    });
  });

  describe("When it receives a POST request without token", () => {
    test("Then it should respond with an error and the message Token missing", async () => {
      const expectedError = { error: true, message: "Token missing" };

      const { body } = await request(app)
        .get("/user/load-user")
        .set("authorization", "")
        .expect(401);

      expect(body).toHaveProperty("error", expectedError.error);
      expect(body).toHaveProperty("message", expectedError.message);
    });
  });
});

describe("Given a /load-user-players endpoint", () => {
  describe("When it receives a POST request with a token", () => {
    test("Then it should respond with the players", async () => {
      await request(app)
        .get("/user/load-user-players")
        .set("authorization", `Bearer ${token1}`)
        .expect(200);
    });
  });

  describe("When it receives a POST request with a wrong token", () => {
    test("Then it should respond with an error and the message jwt malformed", async () => {
      const expectedError = { error: true, message: "jwt malformed" };

      const { body } = await request(app)
        .get("/user/load-user-players")
        .set("authorization", `Bearer 24243fsadsfd`)
        .expect(401);

      expect(body).toHaveProperty("error", expectedError.error);
      expect(body).toHaveProperty("message", expectedError.message);
    });
  });

  describe("When it receives a POST request without token", () => {
    test("Then it should respond with an error and the message Token missing", async () => {
      const expectedError = { error: true, message: "Token missing" };

      const { body } = await request(app)
        .post("/user/load-user-players")
        .set("authorization", "")
        .expect(401);

      expect(body).toHaveProperty("error", expectedError.error);
      expect(body).toHaveProperty("message", expectedError.message);
    });
  });
});

describe("Given a /register endpoint", () => {
  describe("When it receives a request with a POST method and a new use on the body", () => {
    test.only("Then it should respond with a 201 status and the new user", async () => {
      const newUser = {
        username: "hola",
        teamName: "hola",
        password: "hola",
      };

      const { body } = await request(app)
        .post("/user/register")
        .send(newUser)
        .expect(201);

      expect(body).toHaveProperty("username", newUser.username);
    });
  });
});
