import { createRoute, redirect, Outlet } from '@tanstack/react-router';
import { Role } from '../types';
import { rootRoute } from './router';
import { store } from '../redux/store/store';

interface GuardOptions {
  allowedRoles?: Role[];
}

export const ProtectedRoute = (id: string, options?: GuardOptions) => {
  return createRoute({
    getParentRoute: () => rootRoute,
    id,
    beforeLoad: async ({ location }) => {
      
      const state = store.getState();
      const user = state.auth.user; 
      const isAuthenticated = Boolean(user);
      const isMustChangePassword = state.auth.isMustChangePassword;

      // 2. Unauthenticated User Check
      if (!isAuthenticated || !user) {
        throw redirect({
          to: '/login',
        });
      }

      // 3. Must Change Password Check
      if (isMustChangePassword && location.pathname !== '/change-password') {
        throw redirect({
          to: '/change-password' as never,
        });
      }

      // 4. Role-Based Access Control (RBAC) Check
      if (options?.allowedRoles && options.allowedRoles.length > 0 && !options.allowedRoles.includes(user.role)) {
        throw redirect({
          to: '/unauthorized' as never,
        });
      }
    },
    component: () => <Outlet />,
  });
};