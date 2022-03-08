require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const User = require("../../database/models/user");
const databaseConnect = require("../../database/index");
const loginUser = require("./userControllers");

jest.mock("../../database/models/user");

let database;
beforeAll(async () => {
  database = await MongoMemoryServer.create();
  const uri = database.getUri();
  await databaseConnect(uri);
});

let registeredUsername;
let registeredPassword;

beforeEach(async () => {
  registeredPassword = await bcrypt.hash("1234", 3);
  registeredUsername = "Lionel";

  await User.create({
    username: registeredUsername,
    password: registeredPassword,
    teamName: "dsfd",
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(() => {
  mongoose.connection.close();
  database.stop();
});
