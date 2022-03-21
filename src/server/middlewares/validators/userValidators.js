const { Joi } = require("express-validation");

const createUserValidator = {
  body: Joi.object({
    username: Joi.string().max(12).required(),
    password: Joi.string().required(),
    teamName: Joi.string().required(),
  }),
};

module.exports = { createUserValidator };
