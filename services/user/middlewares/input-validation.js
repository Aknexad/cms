const Joi = require('joi');

function registerValidation(req, res, next) {
  const userInput = {
    username: req.body.username,
    password: req.body.password,
  };

  const schema = Joi.object({
    username: Joi.string().min(3).required,
    password: Joi.string()
      .min(3)
      .required()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  });

  const result = schema.validate(userInput);

  if (result.error !== null) throw new Error(result.error.message);
  next();
}

module.exports = registerValidation;
