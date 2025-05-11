const Joi = require('joi');

/**
 * Validation middleware using Joi schemas
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    errors: {
      wrap: {
        label: ''
      }
    }
  });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({
      success: false,
      message: errorMessage
    });
  }

  next();
};

module.exports = validate;
