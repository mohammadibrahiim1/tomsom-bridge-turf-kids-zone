import { createRoute, redirect, Outlet } from '@tanstack/react-router';
import { Role } from '../types';
import { rootRoute } from './router';

interface GuardOptions {
  allowedRoles?: Role[];
}

export const ProtectedRoute = (id: string, options?: GuardOptions) => {
  return createRoute({
    getParentRoute: () => rootRoute,
    id,
    beforeLoad: async ({ context, location }) => {
      const auth = (context as any)?.auth;
      const user = auth?.user;
      const isAuthenticated = auth?.isAuthenticated;
      const isMustChangePassword = auth?.isMustChangePassword;

      // 1. Unauthenticated User Check
      if (!isAuthenticated || !user) {
        throw redirect({
          to: '/login',
        });
      }

      // 2. Must Change Password Check
      if (isMustChangePassword && location.pathname !== '/change-password') {
        throw redirect({
          to: '/change-password',
        });
      }

      // 3. Role-Based Access Control (RBAC) Check
      if (options?.allowedRoles && options.allowedRoles.length > 0 && !options.allowedRoles.includes(user.role)) {
        throw redirect({
          to: '/unauthorized',
        });
      }
    },
    component: () => <Outlet />,
  });
};
