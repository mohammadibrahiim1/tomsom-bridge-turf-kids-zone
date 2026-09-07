import { createRoute, redirect, Outlet } from '@tanstack/react-router';
import { Suspense, lazy } from 'react';
import { rootRoute } from '../router';
import { store } from '../../redux/store/store'; // Redux Store Import
import SlotManagement from '../../features/slot-management/pages/SlotManagement';

const DashboardLayout = lazy(() =>
  import('../../layouts/DashboardLayout').then((m) => ({ default: m.DashboardLayout })),
);
const AdminPage = lazy(() => import('../../pages/AdminPage').then((m) => ({ default: m.AdminPage })));

const PageLoader = () => (
  <div className='flex min-h-screen items-center justify-center'>
    <div className='h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent' />
  </div>
);

// Protected Guard via beforeLoad
export const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_authenticated',
  beforeLoad: async () => {
    const { isAuthenticated } = store.getState().auth;
    if (!isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: () => <Outlet />,
});

export const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/dashboard/adm_v1',
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <DashboardLayout />
    </Suspense>
  ),
});

export const adminIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/',
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminPage />
    </Suspense>
  ),
});

// Create Slot Route (/dashboard/adm_v1/create-slot)
export const slotManagementRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/slot-management',
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SlotManagement />
    </Suspense>
  ),
});

export const dashboardRoutes = [adminIndexRoute, slotManagementRoute];
