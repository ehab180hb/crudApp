const Joi = require('joi');

const email = Joi.string()
  .email()
  .lowercase()
  .trim()
  .error(new Error('Invalid email format'));
const password = Joi.string().error(new Error('Invalid password format'));

exports.authSchema = Joi.object().keys({
  email: email.required(),
  password: password.required(),
});
