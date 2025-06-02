import React, { Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../components/features/LoadingSpinner.jsx';
import { ROUTES } from '../routes/routes';
//where to import suspense from?

const AuthGuard = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const userRole = useSelector((state) => state.role);
  const location = useLocation();


  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={`${ROUTES.PORTAL}/${userRole}/dashboard`} replace />;
  }

  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};

export default AuthGuard;
