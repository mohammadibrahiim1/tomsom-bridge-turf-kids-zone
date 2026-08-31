import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/store/store';
import { openAuthModal } from '../redux/features/modal/modalSlice';
import { Loader2 } from 'lucide-react';
import { Role } from '../types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isInitialLoading, isMustChangePassword } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isInitialLoading && !isAuthenticated) {
      dispatch(openAuthModal('login'));
    }
  }, [isInitialLoading, isAuthenticated, dispatch]);

  if (isInitialLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-slate-900 text-white'>
        <Loader2 className='h-8 w-8 animate-spin text-red-600' />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to='/' state={{ from: location }} replace />;
  }

  if (isMustChangePassword && location.pathname !== '/change-password') {
    return <Navigate to='/change-password' replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to='/unauthorized' replace />;
  }

  return <Outlet />;
};
