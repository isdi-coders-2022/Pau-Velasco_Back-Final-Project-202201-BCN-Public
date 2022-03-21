const { Joi } = require("express-validation");

const createUserValidator = {
  body: Joi.object({
    username: Joi.string().hex().length(12).required(),
    passwod: Joi.string().required(),
    teamName: Joi.string().required(),
  }),
};

module.exports = { createUserValidator };
