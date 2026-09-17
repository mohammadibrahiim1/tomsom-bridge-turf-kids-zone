import { createRoute } from '@tanstack/react-router';
import { publicLayoutRoute } from '../public/public.routes'; // পাবলিক লেআউট ইমপোর্ট করা হলো

import { LoginForm } from '../../features/authentication/pages/LoginForm';
import { RegisterForm } from '../../features/authentication/pages/RegisterForm';
import { ResetPasswordForm } from '../../features/authentication/pages/ResetPasswordForm';

export const loginRoute = createRoute({
  getParentRoute: () => publicLayoutRoute, 
  path: '/login',
  component: LoginForm,
});

export const registerRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/register',
  component: RegisterForm,
});

export const resetPasswordRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/reset-password',
  component: ResetPasswordForm,
});

export const forgotPasswordRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/forgot-password',
  component: ResetPasswordForm,
});

export const authRoutes = [loginRoute, registerRoute, resetPasswordRoute, forgotPasswordRoute];