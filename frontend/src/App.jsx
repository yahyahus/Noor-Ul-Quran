import React, { useEffect, lazy , Suspense} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './hooks/useAuth';
import AuthGuard from './components/ProtectedRoute';
import LoadingSpinner from './components/features/LoadingSpinner';
import { ROUTES } from './routes/routes';


// Lazy load components
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const Portal = lazy(() => import('./components/features/Portal'));
const TeacherStudents = lazy(() => import('./components/features/TeacherStudents'));
const Attendance = lazy(() => import('./components/features/MarkAttendance'));
const UnassignedStudentsList = lazy(() => import('./components/features/UnassignedStudentsList'));
const ViewAttendance = lazy(() => import('./components/features/ViewAttendance'));
const MarkProgress = lazy(() => import('./components/features/MarkProgress'));
const CreateStudent = lazy(() => import('./components/features/CreateStudent'));
const AdminDashboard = lazy(() => import('./components/features/AdminDashboard'));
const StudentDashboard = lazy(() => import('./components/features/StudentDashboard'));
const TeacherDashboard = lazy(() => import('./components/features/TeacherDashboard'));
const ViewProgress = lazy(() => import('./components/features/ViewProgress'));

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const role = useSelector((state) => state.role);

  useEffect(() => {
    checkAuth(dispatch);
  }, [dispatch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={
            isAuthenticated 
              ? <Navigate to={`${ROUTES.PORTAL}/${role}/dashboard`} replace /> 
              : <Navigate to={ROUTES.LOGIN} replace />
          } 
        />
        <Route 
          path={ROUTES.LOGIN} 
          element={
            isAuthenticated 
              ? <Navigate to={`${ROUTES.PORTAL}/${role}/dashboard`} replace /> 
              : <Login />
          } 
        />
        <Route 
          path={ROUTES.REGISTER} 
          element={
            isAuthenticated 
              ? <Navigate to={`${ROUTES.PORTAL}/${role}/dashboard`} replace /> 
              : <Register />
          } 
        />

        {/* Protected routes */}
        <Route
          path={ROUTES.PORTAL}
          element={
            <AuthGuard allowedRoles={['admin', 'teacher', 'student']}>
              <Portal />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.TEACHER_STUDENTS}
          element={
            <AuthGuard allowedRoles={['teacher']}>
              <TeacherStudents />
            </AuthGuard>
          }
        />
        
        <Route 
          path={ROUTES.MARK_ATTENDANCE} 
          element={
            <AuthGuard allowedRoles={['teacher']}>
              <Attendance />
            </AuthGuard>
          }
        />
        <Route 
          path={ROUTES.UNASSIGNED_STUDENTS} 
          element={
            <AuthGuard allowedRoles={['admin']}>
              <UnassignedStudentsList />
            </AuthGuard>
          }
        />
        <Route 
          path={ROUTES.VIEW_ATTENDANCE} 
          element={
            <AuthGuard allowedRoles={['student']}>
              <ViewAttendance />
            </AuthGuard>
          }
        />
        <Route 
          path={ROUTES.MARK_PROGRESS} 
          element={
            <AuthGuard allowedRoles={['teacher']}>
              <MarkProgress />
            </AuthGuard>
          }
        />
        <Route 
          path={ROUTES.CREATE_STUDENT} 
          element={
            <AuthGuard allowedRoles={['admin']}>
              <CreateStudent />
            </AuthGuard>
          }
        />
        <Route 
          path={ROUTES.ADMIN_DASHBOARD} 
          element={
            <AuthGuard allowedRoles={['admin']}>
              <AdminDashboard />
            </AuthGuard>
          }
        />
        <Route 
          path={ROUTES.STUDENT_DASHBOARD} 
          element={
            <AuthGuard allowedRoles={['student']}>
              <StudentDashboard />
            </AuthGuard>
          }
        />
        <Route 
          path={ROUTES.TEACHER_DASHBOARD} 
          element={
            <AuthGuard allowedRoles={['teacher']}>
              <TeacherDashboard />
            </AuthGuard>
          }
        />
        <Route 
          path={ROUTES.VIEW_PROGRESS} 
          element={
            <AuthGuard allowedRoles={['student']}>
              <ViewProgress />
            </AuthGuard>
          }
        />
        


        <Route path="*" element={<Navigate to="/" replace />} />


      </Routes>
    </Suspense>
  );
}

export default App;