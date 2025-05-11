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

// Change password validation schema
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'string.empty': 'Current password is required'
    }),

  newPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 6 characters'
    })
});

// Create issue validation schema
const createIssueSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 5 characters',
      'string.max': 'Title cannot be more than 100 characters'
    }),

  description: Joi.string()
    .min(20)
    .max(1000)
    .required()
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 20 characters',
      'string.max': 'Description cannot be more than 1000 characters'
    }),

  category: Joi.string()
    .valid('pothole', 'street-light', 'water-leak', 'garbage', 'sidewalk', 'park', 'safety', 'other')
    .required()
    .messages({
      'string.empty': 'Category is required',
      'any.only': 'Please select a valid category'
    }),

  department: Joi.string()
    .valid('public-works', 'water-department', 'sanitation', 'parks-recreation', 'transportation', 'public-safety', 'municipal-services', 'other')
    .messages({
      'any.only': 'Please select a valid department'
    }),

  location: Joi.string()
    .required()
    .messages({
      'string.empty': 'Location is required'
    }),

  lat: Joi.number()
    .required()
    .messages({
      'number.base': 'Latitude must be a number',
      'any.required': 'Latitude is required'
    }),

  lng: Joi.number()
    .required()
    .messages({
      'number.base': 'Longitude must be a number',
      'any.required': 'Longitude is required'
    }),

  image_url: Joi.string()
    .uri()
    .allow(null, '')
    .messages({
      'string.uri': 'Image URL must be a valid URL'
    })
});

// Update issue validation schema
const updateIssueSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(100)
    .messages({
      'string.min': 'Title must be at least 5 characters',
      'string.max': 'Title cannot be more than 100 characters'
    }),

  description: Joi.string()
    .min(20)
    .max(1000)
    .messages({
      'string.min': 'Description must be at least 20 characters',
      'string.max': 'Description cannot be more than 1000 characters'
    }),

  category: Joi.string()
    .valid('pothole', 'street-light', 'water-leak', 'garbage', 'sidewalk', 'park', 'safety', 'other')
    .messages({
      'any.only': 'Please select a valid category'
    }),

  department: Joi.string()
    .valid('public-works', 'water-department', 'sanitation', 'parks-recreation', 'transportation', 'public-safety', 'municipal-services', 'other')
    .messages({
      'any.only': 'Please select a valid department'
    }),

  status: Joi.string()
    .valid('pending', 'in-progress', 'resolved', 'rejected')
    .messages({
      'any.only': 'Please select a valid status'
    }),

  location: Joi.string(),

  lat: Joi.number()
    .messages({
      'number.base': 'Latitude must be a number'
    }),

  lng: Joi.number()
    .messages({
      'number.base': 'Longitude must be a number'
    }),

  image_url: Joi.string()
    .uri()
    .allow(null, '')
    .messages({
      'string.uri': 'Image URL must be a valid URL'
    })
});

// Create comment validation schema
const createCommentSchema = Joi.object({
  text: Joi.string()
    .min(2)
    .max(500)
    .required()
    .messages({
      'string.empty': 'Comment text is required',
      'string.min': 'Comment must be at least 2 characters',
      'string.max': 'Comment cannot be more than 500 characters'
    })
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  createIssueSchema,
  updateIssueSchema,
  createCommentSchema
};
