const Joi = require('joi');

const id = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const email = Joi.string().email();

const getUserSchema = Joi.object()
  .keys({ id: id.required() })
  .required();

const addUserSchema = Joi.object()
  .keys({ email: email.required() })
  .required();

const editUserSchema = Joi.object()
  .keys({
    id: id.required(),
    email: email.required(),
  })
  .required();

const deleteUserSchema = Joi.object()
  .keys({ id: id.required() })
  .required();

module.exports = {
  validateGetUser: inp => Joi.validate(inp, getUserSchema),
  validateAddUser: inp => Joi.validate(inp, addUserSchema),
  validateEditUser: inp => Joi.validate(inp, editUserSchema),
  validateDeleteUser: inp => Joi.validate(inp, deleteUserSchema),
};
