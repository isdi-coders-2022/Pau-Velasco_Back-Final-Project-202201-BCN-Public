const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { notFoundError, generalError } = require("./middlewares/errors");
const route = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());

app.use("/user", route);

app.use(generalError);
app.use(notFoundError);

module.exports = app;
