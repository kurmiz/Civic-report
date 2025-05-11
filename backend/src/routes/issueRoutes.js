const express = require('express');
const {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
  upvoteIssue,
  getUpvotedIssues,
  checkUpvoted,
  getIssuesByRadius
} = require('../controllers/issueController');

const {
  getComments,
  addComment
} = require('../controllers/commentController');

const { protect, authorize, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createIssueSchema,
  updateIssueSchema,
  createCommentSchema
} = require('../utils/validationSchemas');

const router = express.Router();

// Issue routes
router.route('/')
  .get(optionalAuth, getIssues) // Public route, but can use auth if 'current' user is specified
  .post(protect, validate(createIssueSchema), createIssue);

router.route('/upvoted')
  .get(protect, getUpvotedIssues);

router.route('/radius/:lat/:lng/:distance')
  .get(getIssuesByRadius);

router.route('/:id')
  .get(getIssue)
  .put(protect, validate(updateIssueSchema), updateIssue)
  .delete(protect, deleteIssue);

router.route('/:id/upvote')
  .post(protect, upvoteIssue);

router.route('/:id/upvoted')
  .get(protect, checkUpvoted);

// Comment routes
router.route('/:issueId/comments')
  .get(getComments)
  .post(protect, validate(createCommentSchema), addComment);

module.exports = router;
