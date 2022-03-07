require("dotenv").config();
const debug = require("debug")("futsal-stats: root");
const chalk = require("chalk");
const startServer = require("./server/startServer");

const port = process.env.PORT || 4000;

(async () => {
  try {
    startServer(app, port);
  } catch (error) {
    debug(chalk.bold.red(`Error ${error.message}`));
  }
})();
