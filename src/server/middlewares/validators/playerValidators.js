const { Joi } = require("express-validation");

const createPlayerValidator = {
  body: Joi.object({
    name: Joi.string().max(20),
    number: Joi.number().max(99).min(0),
    goals: Joi.number().max(99).min(0),
    assists: Joi.number().max(99).min(0),
    yellowCards: Joi.number().max(99).min(0),
    redCards: Joi.number().max(99).min(0),
    totalMatches: Joi.number().max(99).min(0),
    position: Joi.string(),
    photo: Joi.string(),
  }),
};

const deletePlayerValidator = {
  body: Joi.object({
    id: Joi.string().required,
  }),
};

module.exports = { createPlayerValidator, deletePlayerValidator };
