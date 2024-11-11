import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Dashboard, Notifications, Settings, Group, Assessment } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


const navItems = {
  student: [
    { name: 'Dashboard', path: '/portal/student/dashboard', icon: <Dashboard /> },
    { name: 'Sabak/Manzil', path: '/portal/sabak', icon: <Group /> },
    { name: 'Attendance', path: '/portal/attendance', icon: <Assessment /> },
    { name: 'Notifications', path: '/portal/notifications', icon: <Notifications /> },
    { name: 'Settings', path: '/portal/settings', icon: <Settings /> },
  ],
  teacher: [
    { name: 'Dashboard', path: '/portal/teacher/dashboard', icon: <Dashboard /> },
    { name: 'Students', path: '/portal/teacher-students', icon: <Group /> },
    { name: 'Mark Progress', path: '/portal/mark-progress', icon: <Assessment /> },
    { name: 'Mark Attendance', path: '/portal/mark-attendance', icon: <Notifications /> },
  ],
  admin: [
    { name: 'Dashboard', path: '/portal/admin/dashboard', icon: <Dashboard /> },
    { name: 'Unassigned Students', path: '/portal/unassigned-students', icon: <Group /> },
    { name: 'Create User', path: '/portal/create-student', icon: <Assessment /> },
    { name: 'Settings', path: '/portal/settings', icon: <Settings /> },
  ],
};

const Navbar = () => {
  const role = useSelector((state) => state.role);
  const items = navItems[role] || [];

  return (
    <Box
      component="nav"
      sx={{
        width: { xs: '200px', md: '240px' },
        bgcolor: 'grey.100',
        height: '100vh',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <List>
        {items.map((item) => (
          <ListItem
            button
            key={item.name}
            component={Link}
            to={item.path}
            sx={{
              '&:hover': { bgcolor: 'grey.200' },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Navbar;
