import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // Filtering and pagination state
  const [filters, setFilters] = useState({
    search: '',
    role: ''
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });

  // Dialog state
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params = {
        page: paginationModel.page + 1, // API uses 1-based indexing
        limit: paginationModel.pageSize
      };
      
      // Add filters if they exist
      if (filters.search) params.search = filters.search;
      if (filters.role) params.role = filters.role;
      
      const response = await api.admin.getUsers(params);
      
      setUsers(response.data);
      setTotalUsers(response.total);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [paginationModel.page, paginationModel.pageSize]);

  const handleSearch = () => {
    // Reset to first page when searching
    setPaginationModel({
      ...paginationModel,
      page: 0
    });
    fetchUsers();
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      role: ''
    });
    setPaginationModel({
      ...paginationModel,
      page: 0
    });
    fetchUsers();
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
  };

  const handleRoleDialogOpen = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setRoleDialogOpen(true);
  };

  const handleRoleDialogClose = () => {
    setRoleDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteDialogOpen = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleRoleUpdate = async () => {
    if (!selectedUser || !newRole) return;
    
    try {
      setActionLoading(true);
      
      await api.admin.updateUserRole(selectedUser._id, newRole);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === selectedUser._id ? { ...user, role: newRole } : user
        )
      );
      
      toast.success(`User role updated to ${newRole}`);
      handleRoleDialogClose();
    } catch (err) {
      console.error('Error updating user role:', err);
      toast.error(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setActionLoading(true);
      
      await api.admin.deleteUser(selectedUser._id);
      
      // Update local state
      setUsers(prevUsers => prevUsers.filter(user => user._id !== selectedUser._id));
      setTotalUsers(prev => prev - 1);
      
      toast.success('User deleted successfully');
      handleDeleteDialogClose();
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 90,
      valueGetter: (params) => params.row._id
    },
    { 
      field: 'name', 
      headerName: 'Name', 
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {params.row.avatar_url ? (
            <Box
              component="img"
              sx={{
                height: 32,
                width: 32,
                borderRadius: '50%',
                mr: 1
              }}
              src={params.row.avatar_url}
              alt={params.row.name}
            />
          ) : null}
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 250
    },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color={params.value === 'admin' ? 'primary' : 'default'}
          variant={params.value === 'admin' ? 'filled' : 'outlined'}
        />
      )
    },
    { 
      field: 'createdAt', 
      headerName: 'Joined', 
      width: 150,
      valueGetter: (params) => format(new Date(params.value), 'PP')
    },
    { 
      field: 'lastLogin', 
      headerName: 'Last Login', 
      width: 150,
      valueGetter: (params) => params.value ? format(new Date(params.value), 'PP') : 'Never'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton 
            color="primary" 
            onClick={(e) => {
              e.stopPropagation();
              handleRoleDialogOpen(params.row);
            }}
            title="Edit role"
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            color="error" 
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteDialogOpen(params.row);
            }}
            title="Delete user"
            disabled={params.row.role === 'admin'}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      
      {/* Filters */}
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Search by name or email"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={filters.role}
                label="Role"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FilterListIcon />}
                onClick={handleSearch}
                fullWidth
              >
                Filter
              </Button>
              
              <IconButton 
                color="default" 
                onClick={handleClearFilters}
                title="Clear filters"
              >
                <ClearIcon />
              </IconButton>
              
              <IconButton 
                color="primary" 
                onClick={fetchUsers}
                title="Refresh"
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Data Grid */}
      <Paper elevation={3} sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row._id}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50]}
          rowCount={totalUsers}
          loading={loading}
          disableRowSelectionOnClick
        />
      </Paper>
      
      {/* Role Update Dialog */}
      <Dialog open={roleDialogOpen} onClose={handleRoleDialogClose}>
        <DialogTitle>Update User Role</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Change the role for user: {selectedUser?.name}
          </DialogContentText>
          
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={newRole}
              label="Role"
              onChange={(e) => setNewRole(e.target.value)}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRoleDialogClose}>Cancel</Button>
          <Button 
            onClick={handleRoleUpdate} 
            variant="contained"
            disabled={!newRole || actionLoading}
          >
            {actionLoading ? 'Updating...' : 'Update Role'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user: {selectedUser?.name}? This action cannot be undone.
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, color: 'error.main' }}>
            Warning: This will also delete all issues, comments, and upvotes associated with this user.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button 
            onClick={handleDeleteUser} 
            variant="contained"
            color="error"
            disabled={actionLoading}
          >
            {actionLoading ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;
