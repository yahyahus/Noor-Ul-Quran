// src/Routes.jsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import App from './App';
import Portal from './components/Portal';

const RoutesComponent = ({ showPortal }) => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route
        path="/portal"
        element={showPortal ? <Portal /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
};

export default RoutesComponent;

// is the above code correct?
// A) Yes
// 