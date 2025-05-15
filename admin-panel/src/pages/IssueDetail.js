import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  TextField,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Alert,
  Checkbox
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  Send as SendIcon,
  Comment as CommentIcon,
  ThumbUp as ThumbUpIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminComment, setAdminComment] = useState('');
  const [workCompleted, setWorkCompleted] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  const fetchIssueDetails = async () => {
    try {
      setLoading(true);

      // Fetch issue details
      const issueResponse = await api.admin.getIssue(id);
      setIssue(issueResponse.data);

      // Fetch comments
      const commentsResponse = await api.admin.getComments(id);
      setComments(commentsResponse.data);

      setError(null);
    } catch (err) {
      console.error('Error fetching issue details:', err);
      setError('Failed to load issue details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssueDetails();
  }, [id]);

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };

  const handleStatusDialogOpen = () => {
    setNewStatus(issue?.status || '');
    setAdminComment('');
    setWorkCompleted(issue?.work_completed || false);
    setStatusDialogOpen(true);
  };

  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
  };

  const handleStatusUpdate = async () => {
    try {
      setStatusUpdateLoading(true);

      await api.admin.updateIssueStatus(id, {
        status: newStatus,
        adminComment: adminComment.trim() ? adminComment : undefined,
        workCompleted: workCompleted
      });

      // Refresh issue details
      await fetchIssueDetails();

      let successMessage = `Issue status updated to ${newStatus}`;
      if (workCompleted) {
        successMessage += ' and marked as work completed';
      }

      toast.success(successMessage);
      setStatusDialogOpen(false);
    } catch (err) {
      console.error('Error updating issue status:', err);
      toast.error('Failed to update issue status');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in-progress':
        return 'info';
      case 'resolved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button variant="contained" onClick={() => fetchIssueDetails()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!issue) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">
          Issue not found
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/issues')}
          sx={{ mt: 2 }}
        >
          Back to Issues
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/issues')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4">
          Issue Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                {issue.title}
              </Typography>
              <Chip
                label={issue.status}
                color={getStatusColor(issue.status)}
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Chip
                label={issue.category}
                variant="outlined"
                size="small"
                sx={{ mr: 2, textTransform: 'capitalize' }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <ThumbUpIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {issue.upvotes_count || 0} upvotes
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CommentIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {issue.comments_count || 0} comments
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {issue.location}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Reported on {format(new Date(issue.created_at), 'PPP')}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="body1" paragraph>
              {issue.description}
            </Typography>

            {issue.image_url && (
              <Box sx={{ mt: 2, mb: 3 }}>
                <img
                  src={issue.image_url}
                  alt={issue.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    borderRadius: '8px'
                  }}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleStatusDialogOpen}
              >
                Update Status
              </Button>
            </Box>
          </Paper>

          {/* Comments Section */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Comments ({comments.length})
            </Typography>

            <List sx={{ width: '100%' }}>
              {comments.map((comment) => (
                <React.Fragment key={comment._id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      bgcolor: comment.is_admin_comment ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                      borderRadius: 1
                    }}
                  >
                    <ListItemAvatar>
                      {comment.author?.avatar_url ? (
                        <Avatar src={comment.author.avatar_url} alt={comment.author.name} />
                      ) : (
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      )}
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ mr: 1 }}
                          >
                            {comment.author?.name || 'Anonymous'}
                          </Typography>
                          {comment.is_admin_comment && (
                            <Chip
                              label="Admin"
                              size="small"
                              color="primary"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{ display: 'block', mt: 0.5, mb: 0.5 }}
                          >
                            {comment.text}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            color="text.secondary"
                          >
                            {format(new Date(comment.created_at), 'PPp')}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}

              {comments.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="No comments yet"
                    secondary="Be the first to comment on this issue"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Reporter Info */}
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardHeader
              title="Reporter Information"
              subheader={format(new Date(issue.created_at), 'PPP')}
              avatar={
                issue.author?.avatar_url ? (
                  <Avatar src={issue.author.avatar_url} alt={issue.author.name} />
                ) : (
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                )
              }
            />
            <CardContent>
              <Typography variant="body1">
                {issue.author?.name || 'Anonymous'}
              </Typography>
              {issue.author?.email && (
                <Typography variant="body2" color="text.secondary">
                  {issue.author.email}
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Location Info */}
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardHeader
              title="Location Information"
              avatar={
                <Avatar>
                  <LocationIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Typography variant="body1" gutterBottom>
                {issue.location}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Latitude: {issue.lat}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Longitude: {issue.lng}
              </Typography>

              {/* Map View */}
              <Box
                sx={{
                  mt: 2,
                  height: 200,
                  borderRadius: 1,
                  overflow: 'hidden'
                }}
              >
                <iframe
                  title="Issue Location Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={`https://maps.google.com/maps?q=${issue.lat},${issue.lng}&z=15&output=embed`}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Status History and Work Completion */}
          <Card elevation={3}>
            <CardHeader
              title="Status History"
              avatar={
                <Avatar>
                  <AccessTimeIcon />
                </Avatar>
              }
            />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Created"
                    secondary={format(new Date(issue.created_at), 'PPp')}
                  />
                  <Chip
                    label="pending"
                    size="small"
                    color="warning"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </ListItem>

                {issue.status !== 'pending' && (
                  <ListItem>
                    <ListItemText
                      primary="Status Updated"
                      secondary={format(new Date(issue.updated_at), 'PPp')}
                    />
                    <Chip
                      label={issue.status}
                      size="small"
                      color={getStatusColor(issue.status)}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </ListItem>
                )}

                {issue.work_completed && (
                  <ListItem>
                    <ListItemText
                      primary="Work Completed"
                      secondary={format(new Date(issue.updated_at), 'PPp')}
                    />
                    <Chip
                      label="Completed"
                      size="small"
                      color="success"
                    />
                  </ListItem>
                )}
              </List>

              {issue.status === 'resolved' && !issue.work_completed && (
                <Box sx={{ mt: 2, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="warning.contrastText">
                    Issue is marked as resolved but work is not yet marked as completed.
                  </Typography>
                </Box>
              )}

              {issue.work_completed && (
                <Box sx={{ mt: 2, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="success.contrastText">
                    Work has been completed for this issue.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={handleStatusDialogClose}>
        <DialogTitle>Update Issue Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Change the status of this issue and optionally add an admin comment.
          </DialogContentText>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <FormControl component="fieldset">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={workCompleted}
                  onChange={(e) => setWorkCompleted(e.target.checked)}
                  color="primary"
                />
                <Typography>
                  Mark work as completed
                </Typography>
              </Box>
            </FormControl>
          </Box>

          <TextField
            margin="dense"
            label="Admin Comment (optional)"
            fullWidth
            multiline
            rows={4}
            value={adminComment}
            onChange={(e) => setAdminComment(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStatusDialogClose}>Cancel</Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            disabled={!newStatus || statusUpdateLoading}
          >
            {statusUpdateLoading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IssueDetail;
