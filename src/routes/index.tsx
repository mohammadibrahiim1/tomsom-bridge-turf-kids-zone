import { Suspense } from 'react';
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
import { KidsZonePage } from '../features/landing/pages/KidsZonePage';
import { PricingPage } from '../features/landing/pages/PricingPage';
import { BookingPage } from '../features/landing/pages/BookingPage';
import { AboutPage } from '../features/landing/pages/AboutPage';
import { GalleryPage } from '../features/landing/pages/GalleryPage';
import { ContactPage } from '../pages/ContactPage';

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
      { path: '/', index: true, element: <HomePage /> },
      {
        path: '/kids-zone',
        element: <KidsZonePage />,
      },
      {
        path: '/pricing',
        element: <PricingPage />,
      },
      {
        path: '/booking',
        element: <BookingPage />,
      },

      {
        path: '/about-us',
        element: <AboutPage />,
      },
      {
        path: '/gallery',
        element: <GalleryPage />,
      },
      {
        path: '/contact',
        element: <ContactPage />,
      },

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
