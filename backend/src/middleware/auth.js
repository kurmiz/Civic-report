const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../utils/jwtUtils');

/**
 * Middleware to protect routes - requires authentication
 */
exports.protect = async (req, res, next) => {
  try {
    // Get token from authorization header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Also check for token in cookies for browser clients
      token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Please login to access this resource'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource'
    });
  }
};

/**
 * Middleware for role-based authorization
 * @param {...String} roles - Roles allowed to access the route
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user has required role
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user ? req.user.role : 'none'}' is not authorized to access this resource`
      });
    }
    next();
  };
};

/**
 * Middleware to optionally authenticate a user
 * This will add the user to req if token is valid, but won't block the request if no token
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    // Get token from authorization header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Also check for token in cookies for browser clients
      token = req.cookies.token;
    }

    // If no token, just continue without setting user
    if (!token) {
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if user still exists
      const user = await User.findById(decoded.id);
      if (user) {
        // Add user to request object
        req.user = user;
      }
    } catch (err) {
      // If token is invalid, just continue without setting user
      console.log('Invalid token in optional auth:', err.message);
    }

    next();
  } catch (err) {
    // If any other error, just continue without setting user
    console.error('Optional auth middleware error:', err.message);
    next();
  }
};
