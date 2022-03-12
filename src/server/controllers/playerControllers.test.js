require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const User = require("../../database/models/user");
const databaseConnect = require("../../database/index");
const { createPlayer, deletePlayer } = require("./playerControllers");
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
    id: "12",
    players: [ObjectID("123456789012"), ObjectID("234567890123")],
  });

  await Player.create({
    name: "Benzema",
    number: 7,
    goals: 21,
    assists: 3,
    yellowCards: 4,
    redCards: 1,
    totalMatches: 21,
    position: "Pívote",
    photo:
      "https://img.uefa.com/imgml/TP/players/1/2022/324x324/63706.jpg?imwidth=36",
    id: "1",
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
        id: "1",
      };

      const userData = {
        username: registeredUsername,
        password: registeredPassword,
        teamName: "hola",
        id: "12",
        players: [ObjectID("123456789012"), ObjectID("234567890123")],
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

describe("Given a deleteUser controller", () => {
  describe("When it's instantiated with a token and player id in the request", () => {
    test("Then it should delete the player id", async () => {
      const playerId = "123456789012";

      const userData = {
        username: registeredUsername,
        password: registeredPassword,
        teamName: "hola",
        players: [ObjectID("123456789012"), ObjectID("234567890123")],
      };

      const updatedUser = {
        username: registeredUsername,
        password: registeredPassword,
        teamName: "hola",
        players: [ObjectID("234567890123")],
      };

      User.findOne = jest.fn().mockResolvedValue(userData);
      User.findOneAndUpdate = jest.fn().mockResolvedValue(updatedUser);
      Player.findByIdAndDelete = jest.fn().mockResolvedValue("123");
      jwt.decode = jest.fn().mockReturnValue(token);

      const req = {
        header: jest.fn().mockReturnValue(`Bearer ${token}`),
        params: playerId,
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await deletePlayer(req, res, next);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a req with indvalid request", () => {
    test("Then it should call an error with the text 'This player doesn't belong to your user'", async () => {
      const playerId = "123456789012324";
      const error = new Error("This player doesn't belong to your user");

      const userData = {
        username: registeredUsername,
        password: registeredPassword,
        teamName: "hola",
        players: [ObjectID("123456789012"), ObjectID("234567890123")],
      };

      User.findOne = jest.fn().mockResolvedValue(userData);
      User.findOneAndUpdate = jest.fn().mockResolvedValue(null);
      Player.findByIdAndDelete = jest.fn().mockResolvedValue("123");
      jwt.decode = jest.fn().mockReturnValue(token);

      const req = {
        header: jest.fn().mockReturnValue(`Bearer ${token}`),
        params: playerId,
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await deletePlayer(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives a req request with invalid id", () => {
    test("Then it should call next with the error 'This player doesn't exist'", async () => {
      const playerId = "1234fasd";
      const error = new Error("This player doesn't exist");

      const userData = {
        username: registeredUsername,
        password: registeredPassword,
        teamName: "hola",
        players: [ObjectID("123456789012"), ObjectID("234567890123")],
      };

      const updatedUser = {
        username: registeredUsername,
        password: registeredPassword,
        teamName: "hola",
        players: [ObjectID("234567890123")],
      };

      User.findOne = jest.fn().mockResolvedValue(userData);
      User.findOneAndUpdate = jest.fn().mockResolvedValue(updatedUser);
      Player.findByIdAndDelete = jest.fn().mockResolvedValue(null);
      jwt.decode = jest.fn().mockReturnValue(token);

      const req = {
        header: jest.fn().mockReturnValue(`Bearer ${token}`),
        params: playerId,
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await deletePlayer(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives a req request with invalid token", () => {
    test("Then it should call next", async () => {
      jwt.decode = jest.fn().mockReturnValue(null);
      const next = jest.fn();

      await deletePlayer(null, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
