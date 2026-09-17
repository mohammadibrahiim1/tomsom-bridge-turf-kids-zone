import { createRootRoute, createRouter, Outlet } from '@tanstack/react-router';
import { publicLayoutRoute, publicRoutes } from './public/public.routes';
import {  authRoutes } from './auth/auth.routes';
import { authenticatedRoute, dashboardRoute, dashboardRoutes } from './dashboard/dashboard.routes';

const NotFoundPage = () => (
  <div className='flex h-screen items-center justify-center text-2xl font-bold'>404 - Page Not Found</div>
);

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: NotFoundPage,
});

// Build Route Tree Hierarchy
const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([...publicRoutes,...authRoutes]),
  authenticatedRoute.addChildren([dashboardRoute.addChildren(dashboardRoutes)]),
]);

export const router = createRouter({ routeTree });


