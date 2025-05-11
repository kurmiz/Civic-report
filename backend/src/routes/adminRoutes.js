const express = require('express');
const {
  getAdminStats,
  getAllIssues,
  updateIssueStatus,
  getAllUsers,
  updateUserRole,
  deleteUser,
  adminLogin
} = require('../controllers/adminController');

const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/admin');

const router = express.Router();

// Public admin routes
router.post('/login', adminLogin);

// Protected admin routes
router.use(protect);
router.use(isAdmin);

// Admin dashboard stats
router.get('/stats', getAdminStats);

// Issue management
router.get('/issues', getAllIssues);
router.put('/issues/:id/status', updateIssueStatus);

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;
