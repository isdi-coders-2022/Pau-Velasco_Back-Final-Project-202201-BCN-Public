const { Schema, model } = require("mongoose");

const PlayerSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20,
  },
  number: {
    type: Number,
    max: 99,
    min: 0,
    required: true,
  },
  goals: {
    type: Number,
    max: 99,
    min: 0,
    required: true,
  },
  assists: {
    type: Number,
    max: 99,
    min: 0,
    required: true,
  },
  yellowCards: {
    type: Number,
    max: 99,
    min: 0,
    required: true,
  },
  redCards: {
    type: Number,
    max: 99,
    min: 0,
    required: true,
  },
  totalMatches: {
    type: Number,
    max: 99,
    min: 0,
    required: true,
  },
  position: {
    type: String,
    default: "Cierre",
    required: true,
    maxlength: 7,
  },
  photo: {
    type: String,
    default: "",
  },
});

const Player = model("Player", PlayerSchema, "players");

module.exports = Player;
