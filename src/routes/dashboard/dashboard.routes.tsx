import { createRoute, redirect, Outlet } from '@tanstack/react-router';
import { Suspense, lazy } from 'react';
// import { rootRoute } from '../router';
// import { store } from '../../redux/store/store';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import SlotManagement from '../../features/slot-management/pages/SlotManagement';
import { CustomerDashboard } from '../../features/dashboard/pages/customer/CustomerDashboard';
import { ProtectedRoute } from '../ProtectedRoute'; // আপনার ProtectedRoute পাথ অনুযায়ী ঠিক করে নেবে
import { Role } from '../../types';

// পেজগুলোর লেজি লোডিং
const AdminPage = lazy(() => import('../../pages/AdminPage').then((m) => ({ default: m.AdminPage })));
// const BookingManagement = lazy(() => import('../../features/bookings/pages/BookingManagement').then((m) => ({ default: m.BookingManagement })));
// const SlotManagement = lazy(() => import('../../features/slot-management/pages/SlotManagement').then((m) => ({ default: m.SlotManagement })));
// const CustomerDashboard = lazy(() => import('../../features/customer/pages/CustomerDashboard').then((m) => ({ default: m.CustomerDashboard })));
// const SettingsPage = lazy(() => import('../../features/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));

const PageLoader = () => (
  <div className='flex min-h-screen items-center justify-center bg-emerald-950'>
    <img
        src="/loaders/tomsom_turf_loader.gif"
        alt="Please wait..."
        className="w-16 h-16"
      />
  </div>
);



export const dashboardRoute = ProtectedRoute('_dashboard', {
  allowedRoles: [Role.SUPER_ADMIN, Role.ADMIN, Role.MANAGER, Role.CUSTOMER], 
  // অথবা সরাসরি স্ট্রিং দিতে চাইলে: allowedRoles: ['SUPER_ADMIN' as Role, 'ADMIN' as Role, ...]
});

// ড্যাশবোর্ড লেআউট রুট (এটি dashboardRoute-এর চাইল্ড হিসেবে থাকবে)
export const dashboardLayoutRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/dashboard',
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <DashboardLayout />
    </Suspense>
  ),
});

// ২. সাব-রাউটসমূহ (প্রত্যেকটিতে নির্দিষ্ট রোল পারমিশন যুক্ত করা হয়েছে)
export const adminIndexRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/adm_v1',
  component: () => <Suspense fallback={<PageLoader />}><AdminPage /></Suspense>,
});

// export const bookingManagementRoute = createRoute({
//   getParentRoute: () => dashboardLayoutRoute,
//   path: '/adm_v1/bookings',
//   component: () => <Suspense fallback={<PageLoader />}><BookingManagement /></Suspense>,
// });

export const slotManagementRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/adm_v1/slot-management',
  component: () => <Suspense fallback={<PageLoader />}><SlotManagement /></Suspense>,
});

// export const settingsRoute = createRoute({
//   getParentRoute: () => dashboardLayoutRoute,
//   path: '/adm_v1/settings',
//   component: () => <Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>,
// });

export const customerDashboardRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/customer',
  component: () => <Suspense fallback={<PageLoader />}><CustomerDashboard /></Suspense>,
});

// সব রাউটের অ্যারে
export const dashboardRoutes = [
  // dashboardRoute,
  dashboardLayoutRoute,
  adminIndexRoute,
  // bookingManagementRoute,
  slotManagementRoute,
  // settingsRoute,
  customerDashboardRoute,
];