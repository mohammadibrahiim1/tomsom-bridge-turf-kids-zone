import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Pages Loaders & Components
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { Role } from '../types';
import { AuthModalLayout } from '../layouts/AuthModalLayout';
import { HomePage } from '../features/landing/pages/HomePage';
import { LoginForm } from '../features/authentication/pages/LoginForm';
import { RegisterForm } from '../features/authentication/pages/RegisterForm';
import { ResetPasswordForm } from '../features/authentication/pages/ResetPasswordForm';

// Lazy loading pages for performance optimization
const AboutPage = lazy(() => import('../pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const BookingPage = lazy(() => import('../pages/BookingPage').then((m) => ({ default: m.BookingPage })));
const KidsZonePage = lazy(() => import('../pages/KidsZonePage').then((m) => ({ default: m.KidsZonePage })));
const PricingPage = lazy(() => import('../pages/PricingPage').then((m) => ({ default: m.PricingPage })));
const GalleryPage = lazy(() => import('../pages/GalleryPage').then((m) => ({ default: m.GalleryPage })));
const ContactPage = lazy(() => import('../pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const AdminPage = lazy(() => import('../pages/AdminPage').then((m) => ({ default: m.AdminPage })));

const PageLoader = () => (
  <div className='flex min-h-[60vh] items-center justify-center'>
    <div className='h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent'></div>
  </div>
);

export const router = createBrowserRouter([
  // Public Routes (MainLayout-এর অধীনে)
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <MainLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // {
      //   path: 'about',
      //   element: <AboutPage />,
      // },
      // {
      //   path: 'booking',
      //   element: <BookingPage />,
      // },

      /* ========================================================
         Auth Modal Routes (Nested under MainLayout)
         ======================================================== */
      {
        element: <AuthModalLayout />,
        children: [
          {
            path: 'login',
            element: <LoginForm />,
          },
          {
            path: 'register',
            element: <RegisterForm />,
          },
          {
            path: 'reset-password',
            element: <ResetPasswordForm />,
          },
          {
            path: 'forgot-password',
            element: <ResetPasswordForm />,
          },
        ],
      },
    ],
  },

  // Protected Admin Route
  {
    element: <ProtectedRoute allowedRoles={[Role.SUPER_ADMIN, Role.ADMIN]} />,
    children: [
      {
        path: '/admin',
        element: <Suspense fallback={<PageLoader />}>{/* <AdminPage /> */}</Suspense>,
      },
    ],
  },

  // Fallback Route
  {
    path: '*',
    element: <div className='flex h-screen items-center justify-center text-2xl font-bold'>404 - Page Not Found</div>,
  },
]);
