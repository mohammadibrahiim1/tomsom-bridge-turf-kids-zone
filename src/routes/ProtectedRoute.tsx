import { createRoute, redirect, Outlet } from '@tanstack/react-router';
import { Role } from '../types';
import { rootRoute } from './router';
import { store } from '../redux/store/store';
import { authApi } from '../features/authentication/services/authApi/authApi';
import { setUser, logout } from '../features/authentication/services/authSlice/authSlice';

interface GuardOptions {
  allowedRoles?: Role[];
}

export const ProtectedRoute = (id: string, options?: GuardOptions) => {
  return createRoute({
    getParentRoute: () => rootRoute,
    id,
    beforeLoad: async ({ location }) => {
      let state = store.getState();
      let user = state.auth.user; 

      // যদি রিফ্রেশ করার কারণে Redux-এ user না থাকে, তবে সার্ভার থেকে কুকি দিয়ে চেক করে নেব
      if (!user) {
        try {
          const result = await store.dispatch(
            authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true })
          ).unwrap();

          if (result?.success && result?.data) {
            store.dispatch(setUser({ user: result.data }));
            user = result.data;
          }
        } catch (error) {
          store.dispatch(logout());
        }
      }

      // ফ্রেশ স্টেট থেকে আবার চেক করা
      const updatedState = store.getState();
      const currentUser = updatedState.auth.user;
      const isAuthenticated = Boolean(currentUser);
      const isMustChangePassword = updatedState.auth.isMustChangePassword;

      // ১. আনঅথেন্টিকেটেড হলে লগইন পেজে পাঠাবে
      if (!isAuthenticated || !currentUser) {
        throw redirect({
          to: '/login',
        });
      }

      // ২. পাসওয়ার্ড পরিবর্তনের প্রয়োজন হলে
      if (isMustChangePassword && location.pathname !== '/change-password') {
        throw redirect({
          to: '/change-password' as never,
        });
      }

      // ৩. রোল বেইজড অ্যাক্সেস কন্ট্রোল (RBAC)
      if (options?.allowedRoles && options.allowedRoles.length > 0 && !options.allowedRoles.includes(currentUser.role)) {
        throw redirect({
          to: '/unauthorized' as never,
        });
      }
    },
    component: () => <Outlet />,
  });
};