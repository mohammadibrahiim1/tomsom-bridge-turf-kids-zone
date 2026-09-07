import { createRoute } from '@tanstack/react-router';
import { rootRoute } from '../router';

import { AuthModalLayout } from '../../layouts/AuthModalLayout';
import { LoginForm } from '../../features/authentication/pages/LoginForm';
import { RegisterForm } from '../../features/authentication/pages/RegisterForm';
import { ResetPasswordForm } from '../../features/authentication/pages/ResetPasswordForm';

export const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_authLayout',
  component: AuthModalLayout,
});

export const loginRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/login',
  component: LoginForm,
});

export const registerRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/register',
  component: RegisterForm,
});

export const resetPasswordRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/reset-password',
  component: ResetPasswordForm,
});

export const forgotPasswordRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/forgot-password',
  component: ResetPasswordForm,
});

export const authRoutes = [loginRoute, registerRoute, resetPasswordRoute, forgotPasswordRoute];
