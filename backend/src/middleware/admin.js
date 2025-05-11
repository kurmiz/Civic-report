/**
 * Middleware to ensure the user is an admin
 * This should be used after the protect middleware
 */
exports.isAdmin = (req, res, next) => {
  // Check if user exists and is an admin
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin privileges required'
    });
  }
  
  next();
};

/**
 * Middleware to check if a user is an admin
 * This doesn't block the request, just adds isAdmin flag to req
 */
exports.checkAdmin = (req, res, next) => {
  // Add isAdmin flag to req
  req.isAdmin = !!(req.user && req.user.role === 'admin');
  next();
};
