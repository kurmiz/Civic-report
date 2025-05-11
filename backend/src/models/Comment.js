const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please add a comment'],
    trim: true,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  issue: {
    type: mongoose.Schema.ObjectId,
    ref: 'Issue',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  is_admin_comment: {
    type: Boolean,
    default: false
  }
});

// Virtual for author (user) information
CommentSchema.virtual('author', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true
});

// Set toJSON option to include virtuals
CommentSchema.set('toJSON', { virtuals: true });
CommentSchema.set('toObject', { virtuals: true });

// Static method to update comment count on issue
CommentSchema.statics.updateCommentCount = async function(issueId) {
  const commentCount = await this.countDocuments({ issue: issueId });

  await this.model('Issue').findByIdAndUpdate(issueId, {
    comments_count: commentCount
  });
};

// Call updateCommentCount after save
CommentSchema.post('save', function() {
  this.constructor.updateCommentCount(this.issue);
});

// Call updateCommentCount after remove
CommentSchema.post('remove', function() {
  this.constructor.updateCommentCount(this.issue);
});

module.exports = mongoose.model('Comment', CommentSchema);
