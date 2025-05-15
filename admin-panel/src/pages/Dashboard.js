import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import {
  Report as ReportIcon,
  Person as PersonIcon,
  Comment as CommentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  HourglassEmpty as HourglassEmptyIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { api } from '../services/api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.admin.getStats();
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  // Prepare data for charts
  const categoryChartData = {
    labels: stats?.issuesByCategory.map(item => item._id) || [],
    datasets: [
      {
        label: 'Issues by Category',
        data: stats?.issuesByCategory.map(item => item.count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)',
          'rgba(83, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const statusChartData = {
    labels: stats?.issuesByStatus.map(item => item._id) || [],
    datasets: [
      {
        label: 'Issues by Status',
        data: stats?.issuesByStatus.map(item => item.count) || [],
        backgroundColor: [
          'rgba(255, 159, 64, 0.6)', // pending
          'rgba(54, 162, 235, 0.6)', // in-progress
          'rgba(75, 192, 192, 0.6)', // resolved
          'rgba(255, 99, 132, 0.6)', // rejected
        ],
        borderWidth: 1,
      },
    ],
  };

  // Work completion chart data
  const workCompletionData = {
    labels: ['Completed', 'Not Completed'],
    datasets: [
      {
        label: 'Work Completion Status',
        data: [
          stats?.counts.completedWork || 0,
          stats?.counts.resolvedIssues - (stats?.counts.completedWork || 0)
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // completed
          'rgba(255, 159, 64, 0.6)', // not completed
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3} lg={2}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.light',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ReportIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Total Issues
              </Typography>
            </Box>
            <Typography variant="h3" component="div">
              {stats?.counts.issues || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={2}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'warning.light',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PendingIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Pending Issues
              </Typography>
            </Box>
            <Typography variant="h3" component="div">
              {stats?.counts.pendingIssues || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={2}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'info.light',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HourglassEmptyIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                In Progress
              </Typography>
            </Box>
            <Typography variant="h3" component="div">
              {stats?.counts.inProgressIssues || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={2}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.light',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Resolved Issues
              </Typography>
            </Box>
            <Typography variant="h3" component="div">
              {stats?.counts.resolvedIssues || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={2}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'secondary.light',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircleIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Work Completed
              </Typography>
            </Box>
            <Typography variant="h3" component="div">
              {stats?.counts.completedWork || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3} lg={2}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'error.light',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PendingIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="div">
                Pending Work
              </Typography>
            </Box>
            <Typography variant="h3" component="div">
              {(stats?.counts.resolvedIssues || 0) - (stats?.counts.completedWork || 0)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Issues by Category
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar
                data={categoryChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Issues by Status
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar
                data={statusChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Work Completion Status
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar
                data={workCompletionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Issues and Active Users */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader title="Recent Issues" />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List sx={{ width: '100%' }}>
                {stats?.recentIssues.map((issue) => (
                  <React.Fragment key={issue._id}>
                    <ListItem
                      alignItems="flex-start"
                      button
                      onClick={() => navigate(`/issues/${issue._id}`)}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <ReportIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={issue.title}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {issue.category} - {issue.status}
                            </Typography>
                            {" — "}
                            {format(new Date(issue.created_at), 'PPP')}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
                {stats?.recentIssues.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No recent issues" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader title="Most Active Users" />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List sx={{ width: '100%' }}>
                {stats?.activeUsers.map((item) => (
                  <React.Fragment key={item.user._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        {item.user.avatar_url ? (
                          <Avatar src={item.user.avatar_url} alt={item.user.name} />
                        ) : (
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        )}
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.user.name}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {item.user.email}
                            </Typography>
                            {" — "}
                            {item.count} {item.count === 1 ? 'issue' : 'issues'} reported
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
                {stats?.activeUsers.length === 0 && (
                  <ListItem>
                    <ListItemText primary="No active users" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
