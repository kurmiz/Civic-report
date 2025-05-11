const express = require('express');
const {
  updateComment,
  deleteComment
} = require('../controllers/commentController');

const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createCommentSchema } = require('../utils/validationSchemas');

const router = express.Router();

router.route('/:id')
  .put(protect, validate(createCommentSchema), updateComment)
  .delete(protect, deleteComment);

module.exports = router;
