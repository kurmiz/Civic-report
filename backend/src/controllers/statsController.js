const Issue = require('../models/Issue');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Upvote = require('../models/Upvote');
const asyncHandler = require('../middleware/async');

// @desc    Get statistics for dashboard
// @route   GET /api/stats
// @access  Public
exports.getStats = asyncHandler(async (req, res) => {
  // Get issue statistics
  const totalIssues = await Issue.countDocuments();
  const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });
  const pendingIssues = await Issue.countDocuments({ status: 'pending' });
  const inProgressIssues = await Issue.countDocuments({ status: 'in-progress' });

  // Get category statistics
  const categoryStats = await Issue.aggregate([
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

  // Format category stats
  const formattedCategoryStats = {};
  categoryStats.forEach(stat => {
    formattedCategoryStats[stat._id] = stat.count;
  });

  // Get upvote statistics
  const totalUpvotes = await Upvote.countDocuments();
  
  // Get upvotes from the last 7 days
  const lastWeekDate = new Date();
  lastWeekDate.setDate(lastWeekDate.getDate() - 7);
  
  const upvotesLastWeek = await Upvote.countDocuments({
    created_at: { $gte: lastWeekDate }
  });
  
  // Calculate percentage change
  const previousWeekDate = new Date();
  previousWeekDate.setDate(previousWeekDate.getDate() - 14);
  
  const upvotesPreviousWeek = await Upvote.countDocuments({
    created_at: { $gte: previousWeekDate, $lt: lastWeekDate }
  });
  
  const upvotePercentChange = upvotesPreviousWeek === 0 
    ? 100 
    : Math.round(((upvotesLastWeek - upvotesPreviousWeek) / upvotesPreviousWeek) * 100);

  // Get comment statistics
  const totalComments = await Comment.countDocuments();
  
  // Get comments from the last 7 days
  const commentsLastWeek = await Comment.countDocuments({
    created_at: { $gte: lastWeekDate }
  });
  
  // Calculate percentage change
  const commentsPreviousWeek = await Comment.countDocuments({
    created_at: { $gte: previousWeekDate, $lt: lastWeekDate }
  });
  
  const commentPercentChange = commentsPreviousWeek === 0 
    ? 100 
    : Math.round(((commentsLastWeek - commentsPreviousWeek) / commentsPreviousWeek) * 100);

  // Get user statistics
  const totalUsers = await User.countDocuments();
  
  // Get active users (users who created issues or comments in the last 30 days)
  const lastMonthDate = new Date();
  lastMonthDate.setDate(lastMonthDate.getDate() - 30);
  
  const activeUserIssues = await Issue.distinct('user', {
    created_at: { $gte: lastMonthDate }
  });
  
  const activeUserComments = await Comment.distinct('user', {
    created_at: { $gte: lastMonthDate }
  });
  
  // Combine and deduplicate active users
  const activeUsers = [...new Set([...activeUserIssues, ...activeUserComments])];
  const activeUserCount = activeUsers.length;
  
  // Calculate percentage change
  const previousMonthDate = new Date();
  previousMonthDate.setDate(previousMonthDate.getDate() - 60);
  
  const previousActiveUserIssues = await Issue.distinct('user', {
    created_at: { $gte: previousMonthDate, $lt: lastMonthDate }
  });
  
  const previousActiveUserComments = await Comment.distinct('user', {
    created_at: { $gte: previousMonthDate, $lt: lastMonthDate }
  });
  
  const previousActiveUsers = [...new Set([...previousActiveUserIssues, ...previousActiveUserComments])];
  const previousActiveUserCount = previousActiveUsers.length;
  
  const userPercentChange = previousActiveUserCount === 0 
    ? 100 
    : Math.round(((activeUserCount - previousActiveUserCount) / previousActiveUserCount) * 100);

  // Return all statistics
  res.status(200).json({
    success: true,
    data: {
      issueStats: {
        total: totalIssues,
        resolved: resolvedIssues,
        pending: pendingIssues,
        inProgress: inProgressIssues
      },
      categoryStats: formattedCategoryStats,
      upvoteStats: {
        total: totalUpvotes,
        lastWeek: upvotesLastWeek,
        percentChange: upvotePercentChange
      },
      commentStats: {
        total: totalComments,
        lastWeek: commentsLastWeek,
        percentChange: commentPercentChange
      },
      userStats: {
        total: totalUsers,
        active: activeUserCount,
        percentChange: userPercentChange
      }
    }
  });
});
