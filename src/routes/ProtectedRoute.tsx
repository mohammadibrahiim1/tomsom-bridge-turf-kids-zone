import { createRoute, redirect, Outlet } from '@tanstack/react-router';
import { Role } from '../types';
import { rootRoute } from './router';
import { store } from '../redux/store/store';
import { authApi } from '../features/authentication/services/authApi/authApi';
import { setUser, logout } from '../features/authentication/services/authSlice/authSlice';

interface GuardOptions {
  allowedRoles?: (Role | string)[];
}

export const ProtectedRoute = (id: string, options?: GuardOptions) => {
  return createRoute({
    getParentRoute: () => rootRoute,
    id,

    beforeLoad: async ({ location }) => {
      let currentUser = store.getState().auth.user;

      // 1. Redux-এ user না থাকলে server থেকে verify
      if (!currentUser) {
        try {
          const result = await store
            .dispatch(
              authApi.endpoints.getMe.initiate(undefined, {
                forceRefetch: true,
              })
            )
            .unwrap();

          currentUser = result?.data ?? null;

          if (currentUser) {
            store.dispatch(
              setUser({
                user: currentUser,
              })
            );
          }
        } catch (error) {
          console.error('Authentication check failed:', error);

          store.dispatch(logout());
          currentUser = null;
        }
      }

      // 2. Authentication check (TypeError ঠিক করার জন্য এখানে search অবজেক্টটি ক্লিন করা হয়েছে)
      if (!currentUser) {
        throw redirect({
          to: '/login',
          // যদি সার্চ প্যারাম পাস করতেই হয়, তবে এটিকে TanStack রাউটারের নিয়মে অবজেক্ট আকারে দিতে হবে
          search: {
            redirect: location.href, 
          } as Record<string, any>,
        });
      }

      // 3. Force password change
      const isMustChangePassword = store.getState().auth.isMustChangePassword;

      if (
        isMustChangePassword &&
        location.pathname !== '/change-password'
      ) {
        throw redirect({
          to: '/change-password',
        });
      }

      // 4. Role authorization
      if (
        options?.allowedRoles?.length &&
        !options.allowedRoles.includes(currentUser.role)
      ) {
        if (currentUser.role === 'CUSTOMER') {
          throw redirect({
            to: '/dashboard/customer',
          });
        }

        throw redirect({
          to: '/dashboard/adm_v1',
        });
      }
    },

    component: () => <Outlet />,
  });
};