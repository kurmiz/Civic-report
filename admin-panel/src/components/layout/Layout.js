import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

const drawerWidth = 240;

const Layout = () => {
  const [open, setOpen] = useState(true);
  
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header open={open} drawerWidth={drawerWidth} toggleDrawer={toggleDrawer} />
      <Sidebar open={open} drawerWidth={drawerWidth} toggleDrawer={toggleDrawer} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          overflow: 'auto'
        }}
      >
        <Toolbar /> {/* This creates space below the app bar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
