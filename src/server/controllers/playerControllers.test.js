require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const User = require("../../database/models/user");
const databaseConnect = require("../../database/index");
const { createPlayer } = require("./playerControllers");
const Player = require("../../database/models/player");

let database;
let token;

beforeAll(async () => {
  database = await MongoMemoryServer.create();
  const uri = database.getUri();
  await databaseConnect(uri);
  jest.resetAllMocks();
});

let registeredUsername;
let registeredPassword;

beforeEach(async () => {
  registeredPassword = await bcrypt.hash("1234", 3);
  registeredUsername = "Lionel";
  const userDataToken = {
    username: registeredUsername,
  };
  token = jwt.sign(userDataToken, process.env.JWT_SECRET);

  await User.create({
    username: registeredUsername,
    password: registeredPassword,
    teamName: "dsfd",
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await database.stop();
});

describe("Given a createPlayer controller", () => {
  describe("When it's instantiated with a new player", () => {
    test("Then it should return the user with the new player", async () => {
      const newPlayer = {
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
      };

      const userData = {
        username: registeredUsername,
        password: registeredPassword,
        teamName: "hola",
        players: [],
      };

      Player.create = jest.fn().mockResolvedValue("123");
      User.findOne = jest.fn().mockResolvedValue(userData);
      jwt.decode = jest.fn().mockReturnValue(token);

      const req = {
        header: jest.fn().mockReturnValue(`Bearer ${token}`),
        body: newPlayer,
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      userData.save = jest.fn(() => ({ saved: true }));

      await createPlayer(req, res, next);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with a wrong player", () => {
    test("Then it should return an error", async () => {
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await createPlayer(null, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
