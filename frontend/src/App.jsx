import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './components/Login';
import Register from './components/Register';
import Portal from './components/features/Portal';
import TeacherStudents from './components/features/TeacherStudents.jsx';
import Attendance from './components/features/MarkAttendance.jsx';
import UnassignedStudentsList from './components/features/UnassignedStudentsList.jsx';
import ViewAttendance from './components/features/ViewAttendance.jsx';
import MarkProgress from './components/features/MarkProgress.jsx';
import CreateStudent from './components/features/CreateStudent';
import AdminDashboard from './components/features/AdminDashboard';
import StudentDashboard from './components/features/StudentDashboard';
import TeacherDashboard from './components/features/TeacherDashboard';
import { setAuthenticated } from '../src/store/slices/authSlice.js';
import ViewProgress from './components/features/ViewProgress.jsx';
import { checkAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute'; 
function App() {
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
      <Route path="/portal/attendance" element={<ProtectedRoute element={<ViewAttendance />} allowedRoles={['student']} />}/>
      <Route path="/portal/mark-progress" element={<ProtectedRoute element={<MarkProgress />} allowedRoles={['teacher']} />}/>
      <Route path="/portal/create-student" element={<ProtectedRoute element={<CreateStudent />} allowedRoles={['admin']} />} />
      <Route path="/portal/admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={['admin']} />} />
      <Route path="/portal/student/dashboard" element={<ProtectedRoute element={<StudentDashboard />} allowedRoles={['student']} />} />
      <Route path="/portal/teacher/dashboard" element={<ProtectedRoute element={<TeacherDashboard />} allowedRoles={['teacher']} />} />
      <Route path="/portal/view-progress" element={<ProtectedRoute element={<ViewProgress />} allowedRoles={['student']} />} />

    </Routes>
  );``
}

export default App;
