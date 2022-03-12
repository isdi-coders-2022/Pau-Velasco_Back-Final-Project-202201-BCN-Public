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

    res.status(201).json(newPlayer);
  } catch (error) {
    error.message = "Error, can't create the player";
    error.code = 400;
    next(error);
  }
};

const deletePlayer = async (req, res, next) => {
  try {
    const headerAuthorization = req.header("authorization");
    const token = headerAuthorization.replace("Bearer ", "");
    const { username } = jwt.decode(token);
    const { id } = req.params;
    const user = await User.findOne({ username });
    const userUpdated = await User.findOneAndUpdate(
      { username },
      {
        players: user.players.filter((player) => player.toString() !== id),
      },
      { new: true }
    );

    if (!userUpdated) {
      const error = new Error("This player doesn't belong to your user");
      error.code = 403;
      return next(error);
    }

    const deletedPlayer = await Player.findByIdAndDelete(id);
    if (!deletedPlayer) {
      const error = new Error("This player doesn't exist");
      error.code = 404;
      return next(error);
    }

    return res.json(userUpdated);
  } catch (error) {
    return next(error);
  }
};

module.exports = { createPlayer, deletePlayer };
