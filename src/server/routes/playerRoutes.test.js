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

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
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
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

// describe("Given a player/create/ endpoint", () => {
//   describe("When it recevies a POST request with a new user", () => {
//     test("Then it should create the new user", async () => {
//       const newPlayer = {
//         name: "Benzema",
//         number: 7,
//         goals: 21,
//         assists: 3,
//         yellowCards: 4,
//         redCards: 1,
//         totalMatches: 21,
//         position: "Pívote",
//         photo:
//           "https://img.uefa.com/imgml/TP/players/1/2022/324x324/63706.jpg?imwidth=36",
//       };
//       jest.mock("fs");

//       const { body } = await request(app)
//         .post("/player/create-player")
//         .set("authorization", `Bearer ${token1}`)
//         .send(newPlayer)
//         .expect(201);

//       const { id, ...expectedBody } = body;
//       expect(expectedBody).toEqual(newPlayer);
//     });
//   });
// });

describe("Given a player/delete/ endpoint", () => {
  describe("When it receives a DELETE request with an id", () => {
    test("Then it should delete the player", async () => {
      const { id } = await Player.findOne({ name: "Cristiano" });

      await request(app)
        .delete(`/player/delete/${id}`)
        .set("authorization", `Bearer ${token1}`)
        .expect(200);
    });
  });
});
