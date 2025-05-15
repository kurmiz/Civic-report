const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['pothole', 'street-light', 'water-leak', 'garbage', 'sidewalk', 'park', 'safety', 'other']
  },
  department: {
    type: String,
    required: [true, 'Please select a government department'],
    enum: ['public-works', 'water-department', 'sanitation', 'parks-recreation', 'transportation', 'public-safety', 'municipal-services', 'other']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  work_completed: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  lat: {
    type: Number,
    required: [true, 'Please add latitude']
  },
  lng: {
    type: Number,
    required: [true, 'Please add longitude']
  },
  image_url: {
    type: String
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  upvotes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  upvotes_count: {
    type: Number,
    default: 0
  },
  comments_count: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the updated_at field on save
IssueSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Virtual for author (user) information
IssueSchema.virtual('author', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true
});

// Set toJSON option to include virtuals
IssueSchema.set('toJSON', { virtuals: true });
IssueSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Issue', IssueSchema);
