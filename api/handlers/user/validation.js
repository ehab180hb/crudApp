const Joi = require('joi');

const id = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .error(new Error('Invalid ID, must be a string of 24 hex characters'));
const email = Joi.string()
  .email()
  .error(new Error('Invalid email format'));
const password = Joi.string().error(new Error('Invalid password format'));

const schemas = {
  id: Joi.object().keys({
    id: id.required(),
  }),

  addUser: Joi.object()
    .keys({ email: email.required() })
    .required(),

  editUser: Joi.object()
    .keys({
      email: email.required(),
    })
    .required(),
};

module.exports = {
  validateBody: schemaType => (req, res, next) => {
    const result = Joi.validate(req.body, schemas[schemaType]);
    if (result.error) return res.status(400).send(result.error.message);
    if (!req.value) req.value = {};
    req.value['body'] = result.value;
    next();
  },
  validateParamId: (req, res, next) => {
    const result = Joi.validate(req.params, schemas.id);
    if (result.error) return res.status(400).send(result.error.message);
    if (!req.value) req.value = {};
    req.value['params'] = result.value;
    next();
  },
};
