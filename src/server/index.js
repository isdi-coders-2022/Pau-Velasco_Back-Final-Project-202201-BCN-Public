const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { notFoundError, generalError } = require("./middlewares/errors");
const userRouter = require("./routes/userRoutes");
const playerRouter = require("./routes/playerRoutes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));

app.use("/user", userRouter);
app.use("/player", playerRouter);

app.use(generalError);
app.use(notFoundError);

module.exports = app;
