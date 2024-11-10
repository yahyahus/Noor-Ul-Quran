import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Badge, Box } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Logout from './Logout';

const Header = () => {
  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          Logo
        </Typography>

        {/* Right Side (Notifications, User Icon) */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* Notifications */}
          <IconButton color="inherit" aria-label="notifications">
            <Badge badgeContent={5} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          {/* User Icon */}
          <IconButton color="inherit">
            <AccountCircleIcon fontSize="large" />
          </IconButton>

          <Logout />

        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
