import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Portal from './components/Portal';
import Announcements from './components/Announcements';
import Settings from './components/Settings';
import Support from './components/Support';
import useAuth from './hooks/useAuth'; // Custom hook for authentication

function App() {
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
      <Routes>
        <Route path="/" element={!isAuthenticated ? <Navigate to="/login" /> : <Navigate to="/portal" />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/portal" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/portal" />} />
        <Route path="/portal" element={isAuthenticated ? <Portal /> : <Navigate to="/login" />} />
        <Route path="/portal/announcements" element={isAuthenticated ? <Announcements /> : <Navigate to="/login" />} />
        <Route path="/portal/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
        <Route path="/portal/support" element={isAuthenticated ? <Support /> : <Navigate to="/login" />} />
      </Routes>
  );
}

export default App;
