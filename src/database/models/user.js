const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    maxlength: 12,
  },
  teamName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  players: {
    type: [Schema.Types.ObjectId],
    ref: "Player",
    default: [],
  },
});

const User = model("User", UserSchema, "users");

module.exports = User;
