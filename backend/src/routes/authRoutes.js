const express = require('express');
const { 
  register, 
  login, 
  getMe, 
  updateProfile, 
  logout,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { 
  registerSchema, 
  loginSchema, 
  updateProfileSchema 
} = require('../utils/validationSchemas');

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/logout', logout);

// Protected routes - require authentication
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, validate(updateProfileSchema), updateProfile);
router.put('/changepassword', protect, changePassword);

module.exports = router;
