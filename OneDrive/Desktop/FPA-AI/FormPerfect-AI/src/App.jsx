import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box, Avatar } from '@mui/material';
import { FitnessCenter, Person, Logout } from '@mui/icons-material';
import LoginPage from './LoginPage';
import SportsLibrary from './SportsLibrary';
import ApiService from './api';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await ApiService.getCurrentUser();
        setUser(userData);
        setCurrentPage('sports');
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  };

  const handleLogin = (userData) => {
    console.log('handleLogin called with:', userData);
    setUser(userData);
    setCurrentPage('sports');
    console.log('Page set to sports');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCurrentPage('login');
    setAnchorEl(null);
  };

  if (currentPage === 'login') return <LoginPage onLogin={handleLogin} />;

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <FitnessCenter sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>FormPerfect AI</Typography>
          <Button color="inherit" onClick={() => setCurrentPage('sports')}>Sports</Button>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={handleLogout}><Logout sx={{ mr: 1 }} /> Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <SportsLibrary />
    </Box>
  );
}

export default App;