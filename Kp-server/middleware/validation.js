const Joi = require("joi");

const validateWith = (schema) => {
  return (req, res, next) => {
    console.log("Request Headers:");
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).send({ error: error.details[0].message });
    }
    next();
  };
};

module.exports = validateWith;
