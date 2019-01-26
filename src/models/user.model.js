const Joi = require('joi');

const idSchema = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .error(new Error('Invalid ID, must be a string of 24 hex characters'));

const emailSchema = Joi.string()
  .email()
  .lowercase()
  .trim()
  .error(new Error('Invalid email format'));

exports.idInObjectSchema = Joi.object().keys({ id: idSchema });

exports.modifyUserSchema = Joi.object().keys({ email: emailSchema });
