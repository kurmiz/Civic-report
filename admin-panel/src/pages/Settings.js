import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Reset states
    setPasswordError('');
    setPasswordSuccess('');
    
    // Validate passwords
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    
    try {
      setPasswordLoading(true);
      
      await api.auth.changePassword(currentPassword, newPassword);
      
      setPasswordSuccess('Password changed successfully');
      toast.success('Password changed successfully');
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error changing password:', err);
      setPasswordError(err.response?.data?.message || 'Failed to change password');
      toast.error('Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };
  
  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Name
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="body1">
                  {user?.name}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="body1">
                  {user?.email}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Role
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                  {user?.role}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Change Password */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}
            
            {passwordSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {passwordSuccess}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handlePasswordChange}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="currentPassword"
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                disabled={passwordLoading}
                startIcon={passwordLoading ? <CircularProgress size={20} /> : null}
              >
                {passwordLoading ? 'Changing Password...' : 'Change Password'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
