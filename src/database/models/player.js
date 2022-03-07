const { Schema } = require("mongoose");

const PlayerSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 12,
  },
  number: {
    type: Number,
    max: 99,
    min: 1,
    required: true,
  },
  goals: {
    type: Number,
    max: 99,
    min: 1,
    required: true,
  },
  assists: {
    type: Number,
    max: 99,
    min: 1,
    required: true,
  },
  yellowCards: {
    type: Number,
    max: 99,
    min: 1,
    required: true,
  },
  redCards: {
    type: Number,
    max: 99,
    min: 1,
    required: true,
  },
  totalMatches: {
    type: Number,
    max: 99,
    min: 1,
    required: true,
  },
  position: {
    type: String,
    default: "Cierre",
    required: true,
    maxlength: 7,
  },
});
