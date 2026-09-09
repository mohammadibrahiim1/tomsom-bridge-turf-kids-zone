import { createRoute, Outlet } from '@tanstack/react-router';
import { Suspense } from 'react';
import { rootRoute } from '../router';

import { MainLayout } from '../../layouts/MainLayout';
import { HomePage } from '../../features/landing/pages/HomePage';
import { KidsZonePage } from '../../features/landing/pages/KidsZonePage';
import { PricingPage } from '../../features/landing/pages/PricingPage';
import { BookingPage } from '../../features/landing/pages/BookingPage';
import { AboutPage } from '../../features/landing/pages/AboutPage';
import { GalleryPage } from '../../features/landing/pages/GalleryPage';
import { ContactPage } from '../../pages/ContactPage';
import { FindYourBooking } from '../../features/landing/components/FindYourBooking';

const PageLoader = () => (
  <div className='flex min-h-[60vh] items-center justify-center'>
    <div className='h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent' />
  </div>
);

// Public Main Layout Route
export const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_publicLayout',
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <MainLayout />
    </Suspense>
  ),
});

export const homeRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/',
  component: HomePage,
});

export const kidsZoneRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/kids-zone',
  component: KidsZonePage,
});

export const pricingRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/pricing',
  component: PricingPage,
});

export const bookingRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/booking',
  component: BookingPage,
});

export const aboutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/about-us',
  component: AboutPage,
});

export const galleryRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/gallery',
  component: GalleryPage,
});

export const contactRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/contact',
  component: ContactPage,
});

export const FindYourBookingRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/find-your-booking',
  component: FindYourBooking,
});

export const publicRoutes = [
  homeRoute,
  kidsZoneRoute,
  pricingRoute,
  bookingRoute,
  aboutRoute,
  galleryRoute,
  contactRoute,
  FindYourBookingRoute,
];
