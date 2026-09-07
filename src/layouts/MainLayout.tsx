import { Outlet } from '@tanstack/react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AuthModal } from '../components/AuthModal/AuthModal';

export const MainLayout = () => {
  return (
    <div className='flex min-h-screen flex-col bg-gray-50 text-gray-900'>
      <Navbar />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
    </div>
  );
};
