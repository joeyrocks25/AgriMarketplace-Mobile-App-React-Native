const Joi = require("joi");

const validateWith = (schema) => {
  return (req, res, next) => {
    console.log("Request Headers:");
    const { error } = schema.validate(req.body);
    if (error) {
      // Validation failed
      return res.status(400).send({ error: error.details[0].message });
    }
    // Validation passed, continue to the next middleware
    next();
  };
};

module.exports = validateWith;
