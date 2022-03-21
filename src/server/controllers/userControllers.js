const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../../database/models/user");

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    const error = new Error("Wrong username, user not found");
    error.code = 404;
    return next(error);
  }

  const rightPassword = await bcrypt.compare(password, user.password);
  if (!rightPassword) {
    const error = new Error("Wrong password");
    error.code = 401;
    return next(error);
  }

  const userData = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userData, process.env.JWT_SECRET);
  return res.json({ token });
};

const loadUser = async (req, res) => {
  const headerAuthorization = req.header("authorization");
  const token = headerAuthorization.replace("Bearer ", "");
  const { username } = jwt.decode(token);
  const user = await User.findOne({ username });

  res.json(user);
};

const registerUser = async (req, res, next) => {
  const { username, password } = req.body;

  const findUser = await User.findOne({ username });

  if (findUser) {
    const error = new Error("This username already exists");
    error.code = 409;
    return next(error);
  }
  const encryptedPassword = await bcrypt.hash(password, 10);
  req.body.password = encryptedPassword;
  const newUser = await User.create(req.body);

  return res.status(201).json(newUser);
};

const loadUserPlayers = async (req, res) => {
  const headerAuthorization = req.header("authorization");
  const token = headerAuthorization.replace("Bearer ", "");
  const { username } = jwt.decode(token);
  const user = await User.findOne({ username }).populate("players");

  res.json(user.players);
};

module.exports = { loginUser, loadUserPlayers, loadUser, registerUser };
