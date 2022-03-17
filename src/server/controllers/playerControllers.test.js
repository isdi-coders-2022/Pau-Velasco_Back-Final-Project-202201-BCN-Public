require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const { default: ObjectID } = require("bson-objectid");
const fs = require("fs");
const User = require("../../database/models/user");
const databaseConnect = require("../../database/index");
const {
  deletePlayer,
  createPlayer,
  updatePlayer,
} = require("./playerControllers");
const Player = require("../../database/models/player");

let database;
let token;
jest.mock("firebase/storage", () => ({
  getStorage: () => "holaa",
  ref: () => {},
  getDownloadURL: async () => "download.url",
  uploadBytes: async () => {},
}));

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

describe("Given a updoadPlayer controller", () => {
  describe("When it receives a req with an user", () => {
    test("Then it should call json method with the new player", async () => {
      const newPlayer = {
        name: "Benzema",
        number: 7,
        goals: 21,
        assists: 3,
        yellowCards: 4,
        redCards: 1,
        totalMatches: 21,
        position: "Pívote",
        id: "1",
      };
      const newFile = {
        fieldname: "photo",
        originalname: "cristianito.jpeg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "93ec034d18753a982e662bc2fdf9a584",
        path: "uploads/93ec034d18753a982e662bc2fdf9a584",
        size: 8750,
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback();
        });

      const req = {
        body: newPlayer,
        file: newFile,
        params: "1",
      };
      const next = jest.fn();
      Player.findByIdAndUpdate = jest.fn().mockResolvedValue("123");

      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback(null, newFile);
      });

      await updatePlayer(req, res, next);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When the rename function throw an error", () => {
    test("Then it should call next method", async () => {
      const newPlayer = {
        name: "Benzema",
        number: 7,
        goals: 21,
        assists: 3,
        yellowCards: 4,
        redCards: 1,
        totalMatches: 21,
        position: "Pívote",
        id: "1",
      };
      const newFile = {
        fieldname: "photo",
        originalname: "cristianito.jpeg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "93ec034d18753a982e662bc2fdf9a584",
        path: "uploads/93ec034d18753a982e662bc2fdf9a584",
        size: 8750,
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback("error");
        });

      const req = {
        body: newPlayer,
        file: newFile,
        params: "1",
      };
      const next = jest.fn();
      Player.findByIdAndUpdate = jest.fn().mockResolvedValue("123");

      await updatePlayer(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When the readFile function throw an error", () => {
    test("Then it should call next method", async () => {
      const newPlayer = {
        name: "Benzema",
        number: 7,
        goals: 21,
        assists: 3,
        yellowCards: 4,
        redCards: 1,
        totalMatches: 21,
        position: "Pívote",
        id: "1",
      };
      const newFile = {
        fieldname: "photo",
        originalname: "cristianito.jpeg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "93ec034d18753a982e662bc2fdf9a584",
        path: "uploads/93ec034d18753a982e662bc2fdf9a584",
        size: 8750,
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback();
        });

      const req = {
        body: newPlayer,
        file: newFile,
        params: "1",
      };
      const next = jest.fn();
      Player.findByIdAndUpdate = jest.fn().mockResolvedValue("123");

      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback("error");
      });

      await updatePlayer(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a createPlayer controller", () => {
  describe("When it's instantiated with a new player in the body and a photo in the file", () => {
    test("Then it should call json with the new player and the firebase url in the photo property", async () => {
      const newPlayer = {
        name: "Cristiano",
        number: 7,
        goals: 21,
        assists: 3,
        yellowCards: 4,
        redCards: 1,
        totalMatches: 21,
        position: "Alero",
        id: "1",
      };
      const newFile = {
        fieldname: "photo",
        originalname: "cristianito.jpeg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "93ec034d18753a982e662bc2fdf9a584",
        path: "uploads/93ec034d18753a982e662bc2fdf9a584",
        size: 8750,
      };
      const userData = {
        username: registeredUsername,
        password: registeredPassword,
        teamName: "hola",
        id: "12",
        players: [ObjectID("123456789012"), ObjectID("234567890123")],
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback();
        });

      const req = {
        header: jest.fn().mockReturnValue(`Bearer ${token}`),
        body: newPlayer,
        file: newFile,
      };
      const next = jest.fn();
      userData.save = jest.fn(() => ({ saved: true }));
      Player.create = jest.fn().mockResolvedValue("123");
      User.findOne = jest.fn().mockResolvedValue(userData);
      jwt.decode = jest.fn().mockReturnValue(token);

      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback(null, newFile);
      });

      await createPlayer(req, res, next);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it's instantiated with a new player in the body and a photo in the file, and has an error on fs.rename", () => {
    test("Then it should should call next with an error", async () => {
      const newPlayer = {
        name: "Cristiano",
        number: 7,
        goals: 21,
        assists: 3,
        yellowCards: 4,
        redCards: 1,
        totalMatches: 21,
        position: "Alero",
        id: "1",
      };
      const newFile = {
        fieldname: "photo",
        originalname: "cristianito.jpeg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "93ec034d18753a982e662bc2fdf9a584",
        path: "uploads/93ec034d18753a982e662bc2fdf9a584",
        size: 8750,
      };

      const req = {
        header: jest.fn().mockReturnValue(`Bearer ${token}`),
        body: newPlayer,
        file: newFile,
      };
      const next = jest.fn();

      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback("error", null);
      });

      await createPlayer(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with file and no player on body", () => {
    test("Then it should call next with an error", async () => {
      const newFile = {
        fieldname: "photo",
        originalname: "cristianito.jpeg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "93ec034d18753a982e662bc2fdf9a584",
        path: "uploads/93ec034d18753a982e662bc2fdf9a584",
        size: 8750,
      };

      const req = {
        header: jest.fn().mockReturnValue(`Bearer ${token}`),
        file: newFile,
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      jest.spyOn(fs, "unlink").mockImplementation((path, callback) => {
        callback();
      });

      await createPlayer(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it has an erro when rename the file", () => {
    test("Then it should call the next method with an error", async () => {
      const newPlayer = {
        name: "Cristiano",
        number: 7,
        goals: 21,
        assists: 3,
        yellowCards: 4,
        redCards: 1,
        totalMatches: 21,
        position: "Alero",
        id: "1",
      };
      const newFile = {
        fieldname: "photo",
        originalname: "cristianito.jpeg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "93ec034d18753a982e662bc2fdf9a584",
        path: "uploads/93ec034d18753a982e662bc2fdf9a584",
        size: 8750,
      };

      const req = {
        header: jest.fn().mockReturnValue(`Bearer ${token}`),
        body: newPlayer,
        file: newFile,
      };
      const next = jest.fn();

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback("error");
        });

      await createPlayer(req, null, next);

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
