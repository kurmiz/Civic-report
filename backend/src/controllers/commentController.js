const Comment = require('../models/Comment');
const Issue = require('../models/Issue');
const asyncHandler = require('../middleware/async');

// @desc    Get comments for an issue
// @route   GET /api/issues/:issueId/comments
// @access  Public
exports.getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ issue: req.params.issueId })
    .populate({
      path: 'user',
      select: 'name avatar_url'
    })
    .sort({ created_at: -1 });

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments
  });
});

// @desc    Add comment to an issue
// @route   POST /api/issues/:issueId/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res) => {
  // Check if issue exists
  const issue = await Issue.findById(req.params.issueId);

  if (!issue) {
    return res.status(404).json({
      success: false,
      message: 'Issue not found'
    });
  }

  // Create comment
  const comment = await Comment.create({
    text: req.body.text,
    issue: req.params.issueId,
    user: req.user.id
  });

  // Populate user information
  await comment.populate({
    path: 'user',
    select: 'name avatar_url'
  });

  res.status(201).json({
    success: true,
    data: comment
  });
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = asyncHandler(async (req, res) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  // Make sure user is comment owner or admin
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this comment'
    });
  }

  // Update comment
  comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { text: req.body.text },
    {
      new: true,
      runValidators: true
    }
  ).populate({
    path: 'user',
    select: 'name avatar_url'
  });

  res.status(200).json({
    success: true,
    data: comment
  });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: 'Comment not found'
    });
  }

  // Make sure user is comment owner or admin
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this comment'
    });
  }

  // Delete comment
  await comment.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
