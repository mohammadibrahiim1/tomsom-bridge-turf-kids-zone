import { createRoute, redirect, Outlet } from '@tanstack/react-router';
import { Role } from '../types';
import { rootRoute } from './router';
import { store } from '../redux/store/store';
import { authApi } from '../features/authentication/services/authApi/authApi'; // আপনার authApi এর সঠিক পাথ দিন
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


      console.log("1. Current Redux User:", user); 
      // যদি রিফ্রেশ করার কারণে Redux-এ user না থাকে, 
      // তবে HttpOnly কুকি ব্যবহার করে সরাসরি সার্ভার থেকে চেক করে নেব (রিলোড প্রবলেম ফিক্সড!)
      if (!user) {
        console.log("2. User nai, server theke getMe call kora hocche...");
        try {
          const result = await store.dispatch(
            authApi.endpoints.getMe.initiate(undefined, { forceRefetch: true })
          ).unwrap();

          console.log("3. API Response:", result);

          if (result?.success && result?.data) {
            // সফল হলে Redux স্টোর আপডেট করে দেবো
            store.dispatch(setUser({ user: result.data }));
            user = result.data;
          }
        } catch (error) {
          // কুকি না থাকলে বা এক্সপায়ার হলে লগআউট করে রিডাইরেক্ট করবে
          console.error("4. Auth fetch error in beforeLoad:", error);
          store.dispatch(logout());
        }
      }

      const isAuthenticated = Boolean(user);
      const isMustChangePassword = store.getState().auth.isMustChangePassword;

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