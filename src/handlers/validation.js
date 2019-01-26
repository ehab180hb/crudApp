const Joi = require('joi');

module.exports = {
  validate: (objName, schema) => (req, res, next) => {
    const result = Joi.validate(req[objName], schema);
    if (result.error)
      return res.status(400).json({
        error: result.error.message,
      });
    if (!req.value) req.value = {};
    req.value[objName] = result.value;
    next();
  },
};
