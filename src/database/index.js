const mongoose = require("mongoose");
const debug = require("debug")("twitter: database");
const chalk = require("chalk");

const databaseConnect = (connectionString) =>
  new Promise((resolve, reject) => {
    mongoose.set("debug", true);
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        delete ret._id;
        // eslint-disable-next-line no-param-reassign, no-underscore-dangle
        delete ret.__v;
      },
    });
    mongoose.connect(connectionString, (error) => {
      if (error) {
        reject(new Error(`Database not connected: ${error.message}`));
        return;
      }
      debug(chalk.yellow("Database connected"));
      resolve();
    });
  });

module.exports = databaseConnect;
