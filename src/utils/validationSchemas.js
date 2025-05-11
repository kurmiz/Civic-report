const Joi = require('joi');

// Register validation schema
const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot be more than 50 characters'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email'
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters'
    })
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required'
    })
});

// Update profile validation schema
const updateProfileSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot be more than 50 characters'
    }),
  
  email: Joi.string()
    .email()
    .messages({
      'string.email': 'Please provide a valid email'
    }),
  
  bio: Joi.string()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Bio cannot be more than 500 characters'
    }),
  
  location: Joi.string()
    .max(100)
    .allow('')
    .messages({
      'string.max': 'Location cannot be more than 100 characters'
    }),
  
  avatar_url: Joi.string()
    .uri()
    .allow('')
    .messages({
      'string.uri': 'Avatar URL must be a valid URL'
    })
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema
};
