const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const connectToMongoDB = require("../../database");
const User = require("../../database/models/user");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectionString = mongoServer.getUri();

  await connectToMongoDB(connectionString);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.create({
    username: "user1",
    password: "user1",
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
