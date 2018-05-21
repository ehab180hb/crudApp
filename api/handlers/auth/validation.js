const Joi = require('joi');

const email = Joi.string().email();
const password = Joi.string();

const schemas = {
  auth: Joi.object()
    .keys({
      email: email.required(),
      password: password.required(),
    })
    .required(),
};

module.exports = schemaType => (req, res, next) => {
  const result = Joi.validate(req.body, schemas[schemaType]);
  if (result.error) return res.status(400).json(result.error);

  if (!req.value) req.value = {};
  req.value['body'] = result.value;
  next();
};
