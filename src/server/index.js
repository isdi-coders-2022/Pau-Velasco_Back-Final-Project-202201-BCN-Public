const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const notFoundError = require("./middlewares/errors");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());

app.use(notFoundError);

module.exports = app;
