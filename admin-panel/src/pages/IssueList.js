import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { api } from '../services/api';

const IssueList = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalIssues, setTotalIssues] = useState(0);
  
  // Filtering and pagination state
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: ''
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  });

  const fetchIssues = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const params = {
        page: paginationModel.page + 1, // API uses 1-based indexing
        limit: paginationModel.pageSize
      };
      
      // Add filters if they exist
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.category) params.category = filters.category;
      
      const response = await api.admin.getIssues(params);
      
      setIssues(response.data);
      setTotalIssues(response.total);
      setError(null);
    } catch (err) {
      console.error('Error fetching issues:', err);
      setError('Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [paginationModel.page, paginationModel.pageSize]);

  const handleSearch = () => {
    // Reset to first page when searching
    setPaginationModel({
      ...paginationModel,
      page: 0
    });
    fetchIssues();
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      category: ''
    });
    setPaginationModel({
      ...paginationModel,
      page: 0
    });
    fetchIssues();
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
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

  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 90,
      valueGetter: (params) => params.row._id
    },
    { 
      field: 'title', 
      headerName: 'Title', 
      width: 250,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
          onClick={() => navigate(`/issues/${params.row._id}`)}
        >
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'category', 
      headerName: 'Category', 
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          variant="outlined"
        />
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          size="small" 
          color={getStatusColor(params.value)}
        />
      )
    },
    { 
      field: 'location', 
      headerName: 'Location', 
      width: 200,
      valueGetter: (params) => params.row.location
    },
    { 
      field: 'user', 
      headerName: 'Reported By', 
      width: 180,
      valueGetter: (params) => params.row.author?.name || 'Anonymous',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {params.row.author?.avatar_url ? (
            <Box
              component="img"
              sx={{
                height: 24,
                width: 24,
                borderRadius: '50%',
                mr: 1
              }}
              src={params.row.author.avatar_url}
              alt={params.row.author.name}
            />
          ) : null}
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      )
    },
    { 
      field: 'created_at', 
      headerName: 'Date', 
      width: 120,
      valueGetter: (params) => format(new Date(params.value), 'PP')
    },
    { 
      field: 'upvotes_count', 
      headerName: 'Upvotes', 
      width: 100,
      type: 'number'
    },
    { 
      field: 'comments_count', 
      headerName: 'Comments', 
      width: 100,
      type: 'number'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, py: 2 }}>
      <Typography variant="h4" gutterBottom>
        Issues
      </Typography>
      
      {/* Filters */}
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search"
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
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={filters.status}
                label="Status"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={filters.category}
                label="Category"
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pothole">Pothole</MenuItem>
                <MenuItem value="street-light">Street Light</MenuItem>
                <MenuItem value="water-leak">Water Leak</MenuItem>
                <MenuItem value="garbage">Garbage</MenuItem>
                <MenuItem value="sidewalk">Sidewalk</MenuItem>
                <MenuItem value="park">Park</MenuItem>
                <MenuItem value="safety">Safety</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={2}>
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
                onClick={fetchIssues}
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
          rows={issues}
          columns={columns}
          getRowId={(row) => row._id}
          pagination
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 25, 50]}
          rowCount={totalIssues}
          loading={loading}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell:hover': {
              cursor: 'pointer',
            },
          }}
          onRowClick={(params) => {
            navigate(`/issues/${params.row._id}`);
          }}
        />
      </Paper>
    </Box>
  );
};

export default IssueList;
