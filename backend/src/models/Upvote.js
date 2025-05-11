const mongoose = require('mongoose');

const UpvoteSchema = new mongoose.Schema({
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
  }
});

// Compound index to ensure a user can only upvote an issue once
UpvoteSchema.index({ issue: 1, user: 1 }, { unique: true });

// Static method to update upvote count on issue
UpvoteSchema.statics.updateUpvoteCount = async function(issueId) {
  const upvoteCount = await this.countDocuments({ issue: issueId });
  
  await this.model('Issue').findByIdAndUpdate(issueId, {
    upvotes_count: upvoteCount
  });
};

// Call updateUpvoteCount after save
UpvoteSchema.post('save', function() {
  this.constructor.updateUpvoteCount(this.issue);
});

// Call updateUpvoteCount after remove
UpvoteSchema.post('remove', function() {
  this.constructor.updateUpvoteCount(this.issue);
});

module.exports = mongoose.model('Upvote', UpvoteSchema);
