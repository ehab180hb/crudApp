const Joi = require('joi');

const id = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const email = Joi.string().email();

const schemas = {
  getUser: Joi.object()
    .keys({ id: id.required() })
    .required(),

  addUser: Joi.object()
    .keys({ email: email.required() })
    .required(),

  editUser: Joi.object()
    .keys({
      id: id.required(),
      email: email.required(),
    })
    .required(),

  deleteUser: Joi.object()
    .keys({ id: id.required() })
    .required(),
};

module.exports = (input, type) => {
  return Joi.validate(input, schemas[type]);
};
