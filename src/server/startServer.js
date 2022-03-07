const debug = require("debug")("futsal-stats: server");
const chalk = require("chalk");

const startServer = (app, port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.bold.green(`Server listening on ${port}`));
      resolve();
    });
  });
