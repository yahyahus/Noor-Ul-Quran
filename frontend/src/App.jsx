import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './components/Login';
import Register from './components/Register';
import Portal from './components/features/Portal';
import Announcements from './components/features/Announcements';
import Settings from './components/features/Settings';
import Support from './components/features/Support';
import TeacherStudents from './components/features/TeacherStudents.jsx';
import Attendance from './components/features/MarkAttendance.jsx';
import UnassignedStudentsList from './components/features/UnassignedStudentsList.jsx';
import { setAuthenticated } from '../src/store/slices/authSlice.js';
import { checkAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute'; function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.role);
  useEffect(() => {
    checkAuth(dispatch);
  }, [dispatch, isAuthenticated]);

  return (
    <Routes>
      
      <Route path="/" element={!isAuthenticated ? <Navigate to="/login" /> : <Navigate to="/portal" />} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/portal" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/portal" />} />
      <Route path="/portal" element={isAuthenticated ? <Portal /> : <Navigate to="/login" />} />
      
      <Route path="/portal/teacher-students" element={<ProtectedRoute element={<TeacherStudents />} allowedRoles={['teacher']} />}/>
      <Route path="/portal/unassigned-students" element={<ProtectedRoute element={<UnassignedStudentsList />} allowedRoles={['admin']} />}/>
      <Route path="/portal/mark-attendance" element={<ProtectedRoute element={<Attendance />} allowedRoles={['teacher']} />}/>

      <Route path="/portal/announcements" element={isAuthenticated ? <Announcements /> : <Navigate to="/login" />} />
      <Route path="/portal/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
      <Route path="/portal/support" element={isAuthenticated ? <Support /> : <Navigate to="/login" />} />
    </Routes>
  );``
}

export default App;
