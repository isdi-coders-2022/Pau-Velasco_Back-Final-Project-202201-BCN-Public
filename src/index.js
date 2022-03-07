require("dotenv").config();
const debug = require("debug")("futsal-stats: root");
const chalk = require("chalk");
const express = require("express");
const startServer = require("./server/startServer");

const port = process.env.PORT || 4000;
const app = express();

(async () => {
  try {
    startServer(app, port);
  } catch (error) {
    debug(chalk.bold.red(`Error ${error.message}`));
  }
})();
