const jwt = require("jsonwebtoken");
const Player = require("../../database/models/player");
const User = require("../../database/models/user");

const createPlayer = async (req, res, next) => {
  try {
    const { body } = req;
    const newPlayer = await Player.create(body);

    const headerAuthorization = req.header("authorization");
    const token = headerAuthorization.replace("Bearer ", "");
    const { username } = jwt.decode(token);

    const user = await User.findOne({ username });
    user.players.push(newPlayer);
    await user.save();

    res.json(user);
  } catch (error) {
    error.message = "Error, can't create the player";
    error.code = 400;
    next(error);
  }
};

module.exports = createPlayer;
