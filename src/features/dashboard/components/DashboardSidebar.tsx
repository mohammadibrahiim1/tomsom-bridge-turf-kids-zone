import React, { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, MoreHorizontal, X } from 'lucide-react';
import { DashboardSidebarMenuItems } from '../../../config/dashboardSidebarMenuItems';

interface DashboardSidebarProps {
  isCollapsed: boolean;
  handleLogout: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isCollapsed, handleLogout }) => {
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Mobile/Pad Navbar Visible Item Split (First 4 items, rest in sheet)
  const visibleNavItems = DashboardSidebarMenuItems.slice(0, 4);
  const overflowNavItems = DashboardSidebarMenuItems.slice(4);

  return (
    <>
      {/* 1. Desktop Only Sidebar (Hidden on Pad & Mobile screens < 1024px) */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='hidden lg:flex fixed top-0 left-0 bottom-0 z-40 bg-emerald-950 border-r border-emerald-800/80 flex-col shadow-2xl overflow-hidden'
      >
        {/* Branding Area */}
        <div className='h-16 flex items-center px-4 border-b border-emerald-800/80 shrink-0'>
          <Link to={'/'} className='flex items-center gap-3 overflow-hidden'>
            <div className='w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-emerald-900/40 shrink-0 border border-emerald-400/30'>
              TB
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className='whitespace-nowrap'
                >
                  <span className='font-extrabold text-sm block leading-tight text-emerald-50 tracking-wide'>
                    টমছম ব্রিজ টার্ফ
                  </span>
                  <span className='text-[10px] text-green-400 font-semibold uppercase tracking-wider'>
                    Admin Portal
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Sidebar Menu Links */}
        <div className='flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-emerald-800'>
          {DashboardSidebarMenuItems?.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.id}
                to={item.to as any}
                className={`relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-950/50 border border-emerald-400/20'
                    : 'text-emerald-200/80 hover:bg-emerald-900/60 hover:text-white'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-emerald-300 group-hover:text-green-400'
                  }`}
                />

                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.15 }}
                      className='whitespace-nowrap truncate'
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isCollapsed && (
                  <div className='absolute left-full ml-3 px-3 py-1.5 bg-emerald-900 text-emerald-100 text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-emerald-700/80'>
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Logout Area */}
        <div className='p-3 border-t border-emerald-800/80 shrink-0'>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-red-950/40 hover:bg-red-600 text-red-300 hover:text-white border border-red-800/40 hover:border-transparent text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
              isCollapsed ? 'px-0' : ''
            }`}
            title='লগআউট'
          >
            <LogOut className='w-4 h-4 shrink-0' />
            {!isCollapsed && <span>লগআউট</span>}
          </button>
        </div>
      </motion.aside>

      {/* 2. Mobile & Pad Bottom Navigation Bar (< 1024px) */}
      <div className='lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-emerald-950/95 backdrop-blur-xl border-t border-emerald-800/90 px-2 py-1.5 flex items-center justify-around shadow-2xl'>
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.id}
              to={item.to as any}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all min-w-[64px] ${
                isActive ? 'text-green-400 bg-emerald-900/60' : 'text-emerald-300/70 hover:text-emerald-100'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-green-400' : 'text-emerald-300/70'}`} />
              <span className='truncate max-w-[60px] text-center leading-tight'>{item.label}</span>
            </Link>
          );
        })}

        {/* More Dropdown Trigger */}
        <button
          onClick={() => setIsMoreOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all min-w-[64px] ${
            isMoreOpen ? 'text-green-400 bg-emerald-900/60' : 'text-emerald-300/70 hover:text-emerald-100'
          }`}
        >
          <MoreHorizontal className='w-5 h-5 mb-0.5' />
          <span className='truncate max-w-[60px] text-center leading-tight'>আরও</span>
        </button>
      </div>

      {/* 3. Upward Slide Bottom Sheet Drawer (For Mobile/Pad overflow items) */}
      <AnimatePresence>
        {isMoreOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreOpen(false)}
              className='lg:hidden fixed inset-0 z-50 bg-emerald-950/80 backdrop-blur-sm'
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className='lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-emerald-950 border-t border-emerald-800 rounded-t-3xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden'
            >
              {/* Header */}
              <div className='px-5 py-4 border-b border-emerald-800/80 flex items-center justify-between shrink-0 bg-emerald-900/40'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />
                  <span className='font-extrabold text-sm text-emerald-50'>সকল মেনু অপশন</span>
                </div>
                <button
                  onClick={() => setIsMoreOpen(false)}
                  className='p-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-300 hover:text-white rounded-full transition-colors cursor-pointer border border-emerald-700/50'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>

              {/* Scrollable Item Grid */}
              <div className='p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[calc(80vh-120px)] scrollbar-thin scrollbar-thumb-emerald-800'>
                {overflowNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;

                  return (
                    <Link
                      key={item.id}
                      to={item.to as any}
                      onClick={() => setIsMoreOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 to-green-600 border-emerald-400/30 text-white shadow-md'
                          : 'bg-emerald-900/50 border-emerald-800/80 text-emerald-200 hover:bg-emerald-900 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-green-400'}`} />
                      <span className='truncate'>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Logout Button inside Bottom Sheet */}
              <div className='p-4 border-t border-emerald-800/80 bg-emerald-950 shrink-0'>
                <button
                  onClick={() => {
                    setIsMoreOpen(false);
                    handleLogout();
                  }}
                  className='w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-950/50 hover:bg-red-600 text-red-300 hover:text-white border border-red-800/40 text-xs font-bold rounded-xl transition-all cursor-pointer'
                >
                  <LogOut className='w-4 h-4 shrink-0' />
                  <span>সেশন লগআউট করুন</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
