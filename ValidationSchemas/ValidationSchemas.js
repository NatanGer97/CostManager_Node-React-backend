const Joi = require('joi');

module.exports.expenseSchema = Joi.object({
  sum: Joi.number()
      .required()
      .min(0),
    description: Joi.string().required(),
});


module.exports.categorySchema = Joi.object({
  category: Joi.object({
    name: Joi.string().required(),
  }).required(),
});

module.exports.UserSchema = Joi.object({
  user: Joi.object({
    name: Joi.string().regex(/^[a-zA-Z]+$/).min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
    
  }).required()
});        // "password":"1234"

