require("dotenv").config();
const debug = require("debug")("futsal-stats: root");
const chalk = require("chalk");
const databaseConnect = require("./database");
const app = require("./server");
const startServer = require("./server/startServer");

const port = process.env.PORT || 4000;
const mongoString = process.env.MONGO_STRING(async () => {
  try {
    await startServer(app, port);
    await databaseConnect(mongoString);
  } catch (error) {
    debug(chalk.bold.red(`Error ${error.message}`));
  }
})();
