import React, { useState } from 'react';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { useAppDispatch, useAppSelector } from '../redux/store/store';
import { logout } from '../features/authentication/services/authSlice/authSlice';
import { DashboardHeader } from '../features/dashboard/components/DashboardHeader';
import { DashboardSidebar } from '../features/dashboard/components/DashboardSidebar';

export const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);

  const currentUser = {
    name: user?.name || 'অ্যাডমিন',
    role: user?.role || 'Super Admin',
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate({ to: '/' });
  };

  return (
    <div className='min-h-screen flex flex-col font-sans antialiased selection:bg-red-500 selection:text-white'>
      {/* Top Fixed Header */}
      <DashboardHeader
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        currentUser={currentUser}
        handleLogout={handleLogout}
      />

      {/* Dynamic Sidebar & Mobile Bottom Sheet */}
      <DashboardSidebar isCollapsed={isCollapsed} handleLogout={handleLogout} />

      {/* Main Outlet Render Canvas */}
      <main
        style={{
          transition: 'padding-left 0.3s ease-in-out',
        }}
        className={`flex-1 pt-16 pb-20 lg:pb-8 transition-all duration-300 ${
          isCollapsed ? 'lg:pl-[80px]' : 'lg:pl-[280px]'
        }`}
      >
        <div className='mx-auto bg-white w-full min-h-[calc(100vh-4rem)]'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
