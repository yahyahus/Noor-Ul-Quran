import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Input from './components/Input';
import Portal from './components/Portal';
import useAuth from './hooks/useAuth'; // Custom hook for authentication
import Announcements from './components/Announcements';
import Settings from './components/Settings';
import Support from './components/Support';
function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');
  const { isAuthenticated, checkAuth, login, register } = useAuth();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogin = async () => {
    const result = await login(email, password);
    setResponse(result.message);
  };

  const handleRegister = async () => {
    const result = await register(email, password);
    setResponse(result.message);
  };

  return (
    <Routes>
      <Route path="/" element={!isAuthenticated ? <Input email={email} setEmail={setEmail} password={password} setPassword={setPassword} handleRegister={handleRegister} handleLogin={handleLogin} response={response} /> : <Navigate to="/portal" />} />
      <Route path="/portal/announcements" element={isAuthenticated ? <Announcements /> : <Navigate to="/" />} />
      <Route path="/portal/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/" />} />
      <Route path="/portal/support" element={isAuthenticated ? <Support /> : <Navigate to="/" />} />
      <Route path="/portal" element={isAuthenticated ? <Portal /> : <Navigate to="/" />} />
    </Routes>

  );
}

export default App;
