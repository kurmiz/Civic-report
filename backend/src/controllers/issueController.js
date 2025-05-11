const Issue = require('../models/Issue');
const User = require('../models/User');
const Upvote = require('../models/Upvote');
const Comment = require('../models/Comment');
const asyncHandler = require('../middleware/async');
const { getDefaultDepartment } = require('../utils/departmentMapping');

// @desc    Get all issues
// @route   GET /api/issues
// @access  Public
exports.getIssues = asyncHandler(async (req, res) => {
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
    // If 'current' is specified and user is authenticated, use the current user's ID
    if (req.query.user === 'current' && req.user) {
      query.user = req.user.id;
    } else {
      query.user = req.query.user;
    }
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
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Issue.countDocuments(query);

  // Execute query
  const issues = await Issue.find(query)
    .populate({
      path: 'user',
      select: 'name avatar_url'
    })
    .sort({ created_at: -1 })
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
    data: issues
  });
});

// @desc    Get single issue
// @route   GET /api/issues/:id
// @access  Public
exports.getIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate({
    path: 'user',
    select: 'name avatar_url'
  });

  if (!issue) {
    return res.status(404).json({
      success: false,
      message: 'Issue not found'
    });
  }

  res.status(200).json({
    success: true,
    data: issue
  });
});

// @desc    Create new issue
// @route   POST /api/issues
// @access  Private
exports.createIssue = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // If department is not provided, set a default based on the category
  if (!req.body.department && req.body.category) {
    req.body.department = getDefaultDepartment(req.body.category);
  }

  // Create issue
  const issue = await Issue.create(req.body);

  res.status(201).json({
    success: true,
    data: issue
  });
});

// @desc    Update issue
// @route   PUT /api/issues/:id
// @access  Private
exports.updateIssue = asyncHandler(async (req, res) => {
  let issue = await Issue.findById(req.params.id);

  if (!issue) {
    return res.status(404).json({
      success: false,
      message: 'Issue not found'
    });
  }

  // Make sure user is issue owner or admin
  if (issue.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this issue'
    });
  }

  // Update issue
  issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: issue
  });
});

// @desc    Delete issue
// @route   DELETE /api/issues/:id
// @access  Private
exports.deleteIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    return res.status(404).json({
      success: false,
      message: 'Issue not found'
    });
  }

  // Make sure user is issue owner or admin
  if (issue.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this issue'
    });
  }

  // Delete all comments and upvotes associated with this issue
  await Comment.deleteMany({ issue: req.params.id });
  await Upvote.deleteMany({ issue: req.params.id });

  // Delete issue
  await issue.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upvote an issue
// @route   POST /api/issues/:id/upvote
// @access  Private
exports.upvoteIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    return res.status(404).json({
      success: false,
      message: 'Issue not found'
    });
  }

  // Check if user already upvoted this issue
  const existingUpvote = await Upvote.findOne({
    issue: req.params.id,
    user: req.user.id
  });

  if (existingUpvote) {
    // User already upvoted, so remove the upvote
    await existingUpvote.deleteOne();

    // Update upvotes array in issue
    await Issue.findByIdAndUpdate(req.params.id, {
      $pull: { upvotes: req.user.id }
    });

    return res.status(200).json({
      success: true,
      message: 'Upvote removed',
      data: { upvoted: false }
    });
  }

  // Create upvote
  await Upvote.create({
    issue: req.params.id,
    user: req.user.id
  });

  // Update upvotes array in issue
  await Issue.findByIdAndUpdate(req.params.id, {
    $push: { upvotes: req.user.id }
  });

  res.status(200).json({
    success: true,
    message: 'Issue upvoted',
    data: { upvoted: true }
  });
});

// @desc    Get user's upvoted issues
// @route   GET /api/issues/upvoted
// @access  Private
exports.getUpvotedIssues = asyncHandler(async (req, res) => {
  const upvotes = await Upvote.find({ user: req.user.id }).select('issue');

  const issueIds = upvotes.map(upvote => upvote.issue);

  const issues = await Issue.find({ _id: { $in: issueIds } }).populate({
    path: 'user',
    select: 'name avatar_url'
  });

  res.status(200).json({
    success: true,
    count: issues.length,
    data: issues
  });
});

// @desc    Check if user upvoted an issue
// @route   GET /api/issues/:id/upvoted
// @access  Private
exports.checkUpvoted = asyncHandler(async (req, res) => {
  const upvote = await Upvote.findOne({
    issue: req.params.id,
    user: req.user.id
  });

  res.status(200).json({
    success: true,
    data: { upvoted: !!upvote }
  });
});

// @desc    Get issues by location (within radius)
// @route   GET /api/issues/radius/:lat/:lng/:distance
// @access  Public
exports.getIssuesByRadius = asyncHandler(async (req, res) => {
  const { lat, lng, distance } = req.params;

  // Calculate radius using radians
  // Earth radius is 6,378 km
  const radius = distance / 6378;

  const issues = await Issue.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius]
      }
    }
  }).populate({
    path: 'user',
    select: 'name avatar_url'
  });

  res.status(200).json({
    success: true,
    count: issues.length,
    data: issues
  });
});
