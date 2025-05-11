/**
 * Async handler to wrap async functions and avoid try-catch blocks
 * @param {Function} fn - Async function to execute
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  try {
    return Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error('Async error:', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Server Error'
      });
    });
  } catch (err) {
    console.error('Sync error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Server Error'
    });
  }
};

module.exports = asyncHandler;
