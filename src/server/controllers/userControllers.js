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

module.exports = loginUser;
