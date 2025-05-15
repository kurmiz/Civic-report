const Issue = require('../models/Issue');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Upvote = require('../models/Upvote');
const asyncHandler = require('../middleware/async');

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Set cookie options
  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url
      }
    });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an email and password'
    });
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if user is an admin
  if (user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin privileges required'
    });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Update last login time
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
});

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
exports.getAdminStats = asyncHandler(async (req, res) => {
  // Get counts
  const issueCount = await Issue.countDocuments();
  const userCount = await User.countDocuments();
  const pendingIssueCount = await Issue.countDocuments({ status: 'pending' });
  const resolvedIssueCount = await Issue.countDocuments({ status: 'resolved' });
  const inProgressIssueCount = await Issue.countDocuments({ status: 'in-progress' });
  const completedWorkCount = await Issue.countDocuments({ work_completed: true });
  const commentCount = await Comment.countDocuments();

  // Get recent issues
  const recentIssues = await Issue.find()
    .sort({ created_at: -1 })
    .limit(5)
    .populate({
      path: 'user',
      select: 'name avatar_url'
    });

  // Get issue counts by category
  const issuesByCategory = await Issue.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  // Get issue counts by status
  const issuesByStatus = await Issue.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  // Get most active users
  const mostActiveUsers = await Issue.aggregate([
    {
      $group: {
        _id: '$user',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 5
    }
  ]);

  // Populate user details for most active users
  const populatedActiveUsers = await User.populate(mostActiveUsers, {
    path: '_id',
    select: 'name avatar_url email'
  });

  const activeUsers = populatedActiveUsers.map(user => ({
    user: user._id,
    count: user.count
  }));

  res.status(200).json({
    success: true,
    data: {
      counts: {
        issues: issueCount,
        users: userCount,
        pendingIssues: pendingIssueCount,
        resolvedIssues: resolvedIssueCount,
        inProgressIssues: inProgressIssueCount,
        completedWork: completedWorkCount,
        comments: commentCount
      },
      recentIssues,
      issuesByCategory,
      issuesByStatus,
      activeUsers
    }
  });
});

// @desc    Get all issues with advanced filtering for admin
// @route   GET /api/admin/issues
// @access  Admin
exports.getAllIssues = asyncHandler(async (req, res) => {
  // Build query
  const query = {};

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by user
  if (req.query.user) {
    query.user = req.query.user;
  }

  // Filter by date range
  if (req.query.startDate && req.query.endDate) {
    query.created_at = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  // Search functionality
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { location: searchRegex }
    ];
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Issue.countDocuments(query);

  // Execute query
  const issues = await Issue.find(query)
    .populate({
      path: 'user',
      select: 'name avatar_url email'
    })
    .sort(req.query.sort ? JSON.parse(req.query.sort) : { created_at: -1 })
    .skip(startIndex)
    .limit(limit);

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: issues.length,
    pagination,
    total,
    data: issues
  });
});

// @desc    Update issue status
// @route   PUT /api/admin/issues/:id/status
// @access  Admin
exports.updateIssueStatus = asyncHandler(async (req, res) => {
  const { status, adminComment, workCompleted } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a status'
    });
  }

  // Validate status
  const validStatuses = ['pending', 'in-progress', 'resolved', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be one of: pending, in-progress, resolved, rejected'
    });
  }

  // Find issue
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    return res.status(404).json({
      success: false,
      message: 'Issue not found'
    });
  }

  // Update issue status
  issue.status = status;
  issue.updated_at = Date.now();

  // Update work_completed status if provided
  if (workCompleted !== undefined) {
    issue.work_completed = workCompleted;

    // If work is completed, automatically set status to resolved
    if (workCompleted === true && status !== 'resolved') {
      issue.status = 'resolved';
    }
  }

  // Add admin comment if provided
  if (adminComment) {
    await Comment.create({
      issue: issue._id,
      user: req.user.id,
      text: adminComment,
      is_admin_comment: true
    });
  }

  await issue.save();

  res.status(200).json({
    success: true,
    data: issue
  });
});

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  // Build query
  const query = {};

  // Filter by role
  if (req.query.role) {
    query.role = req.query.role;
  }

  // Search by name or email
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    query.$or = [
      { name: searchRegex },
      { email: searchRegex }
    ];
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await User.countDocuments(query);

  // Execute query
  const users = await User.find(query)
    .select('-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken -emailVerificationExpire')
    .sort(req.query.sort ? JSON.parse(req.query.sort) : { createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: users.length,
    pagination,
    total,
    data: users
  });
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Admin
exports.updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a role'
    });
  }

  // Validate role
  const validRoles = ['user', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role. Must be one of: user, admin'
    });
  }

  // Find user
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Prevent admin from changing their own role
  if (user._id.toString() === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot change your own role'
    });
  }

  // Update user role
  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own account'
    });
  }

  // Delete user's issues, comments, and upvotes
  const userIssues = await Issue.find({ user: user._id });

  // Delete all comments and upvotes for each issue
  for (const issue of userIssues) {
    await Comment.deleteMany({ issue: issue._id });
    await Upvote.deleteMany({ issue: issue._id });
  }

  // Delete all issues
  await Issue.deleteMany({ user: user._id });

  // Delete user's comments and upvotes on other issues
  await Comment.deleteMany({ user: user._id });
  await Upvote.deleteMany({ user: user._id });

  // Delete user
  await user.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
