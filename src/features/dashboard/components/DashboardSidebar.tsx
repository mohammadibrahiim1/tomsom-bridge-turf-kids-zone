import React, { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, MoreHorizontal, X } from 'lucide-react';
import { DashboardSidebarMenuItems } from '../../../config/dashboardSidebarMenuItems';
import { useLogoutMutation } from '../../authentication/services/authApi/authApi';
import { logout } from '../../authentication/services/authSlice/authSlice';
import { baseApi } from '../../../redux/baseApi/baseApi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store';

interface DashboardSidebarProps {
  isCollapsed: boolean;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.role || '';

  const [logoutApi] = useLogoutMutation();

  const onLogout = async () => {
    try {
      await logoutApi({}).unwrap();
    } catch (error) {
      console.error('Logout failed on server:', error);
    } finally {
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
      window.location.href = '/';
    }
  };

  // ইউজারের রোল অনুযায়ী মেনু ফিল্টার করা
  const allowedMenuItems = DashboardSidebarMenuItems.filter((item) => 
    item.roles.includes(userRole)
  );

  
  const visibleNavItems = allowedMenuItems.slice(0, 4);
  const overflowNavItems = allowedMenuItems.slice(4);

  return (
    <>
      {/* 1. Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='hidden lg:flex fixed top-0 left-0 bottom-0 z-40 bg-emerald-950 border-r border-emerald-800/80 flex-col shadow-2xl overflow-hidden'
      >
        <div className='h-16 flex items-center px-4 border-b border-emerald-800/80 shrink-0'>
          <Link to={'/'} className='flex items-center gap-3 overflow-hidden'>
            <div className='w-10 h-10 bg-linear-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shrink-0 border border-emerald-400/30'>
              TB
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className='whitespace-nowrap'
                >
                  <span className='font-extrabold text-sm block leading-tight text-emerald-50'>
                    টমছম ব্রিজ টার্ফ
                  </span>
                  <span className='text-[10px] text-green-400 font-semibold uppercase tracking-wider'>
                    {userRole} Portal
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Filtered Menu Links */}
        <div className='flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-emerald-800'>
          {allowedMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.id}
                to={item.to as any}
                className={`relative flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                  isActive
                    ? 'bg-linear-to-r from-emerald-600 to-green-600 text-white shadow-lg border border-emerald-400/20'
                    : 'text-emerald-200/80 hover:bg-emerald-900/60 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-emerald-300'}`} />
                {!isCollapsed && <span className='truncate'>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <div className='p-3 border-t border-emerald-800/80 shrink-0'>
          <button
            onClick={onLogout}
            className='w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-red-950/40 hover:bg-red-600 text-red-300 hover:text-white border border-red-800/40 text-xs font-bold rounded-xl transition-all'
          >
            <LogOut className='w-4 h-4 shrink-0' />
            {!isCollapsed && <span>লগআউট</span>}
          </button>
        </div>
      </motion.aside>

      {/* 2. Mobile & Pad Bottom Nav */}
      {allowedMenuItems.length > 0 && (
        <div className='lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-emerald-950/95 backdrop-blur-xl border-t border-emerald-800/90 px-2 py-1.5 flex items-center justify-around shadow-2xl'>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.id}
                to={item.to as any}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all min-w-16 ${
                  isActive ? 'text-green-400 bg-emerald-900/60' : 'text-emerald-300/70 hover:text-emerald-100'
                }`}
              >
                <Icon className='w-5 h-5 mb-0.5' />
                <span className='truncate max-w-15 text-center leading-tight'>{item.label}</span>
              </Link>
            );
          })}

          {overflowNavItems.length > 0 && (
            <button
              onClick={() => setIsMoreOpen(true)}
              className='flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold text-emerald-300/70 hover:text-emerald-100 min-w-16'
            >
              <MoreHorizontal className='w-5 h-5 mb-0.5' />
              <span className='truncate max-w-15 text-center leading-tight'>আরও</span>
            </button>
          )}
        </div>
      )}

      {/* 3. Mobile Overflow Bottom Sheet */}
      <AnimatePresence>
        {isMoreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreOpen(false)}
              className='lg:hidden fixed inset-0 z-50 bg-emerald-950/80 backdrop-blur-sm'
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className='lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-emerald-950 border-t border-emerald-800 rounded-t-3xl max-h-[80vh] flex flex-col shadow-2xl'
            >
              <div className='px-5 py-4 border-b border-emerald-800/80 flex items-center justify-between bg-emerald-900/40'>
                <span className='font-extrabold text-sm text-emerald-50'>সকল মেনু অপশন</span>
                <button onClick={() => setIsMoreOpen(false)} className='p-1.5 bg-emerald-900 text-emerald-300 rounded-full'>
                  <X className='w-4 h-4' />
                </button>
              </div>
              <div className='p-4 overflow-y-auto grid grid-cols-2 gap-2.5'>
                {overflowNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to;
                  return (
                    <Link
                      key={item.id}
                      to={item.to as any}
                      onClick={() => setIsMoreOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-bold ${
                        isActive ? 'bg-emerald-600 text-white' : 'bg-emerald-900/50 text-emerald-200'
                      }`}
                    >
                      <Icon className='w-4 h-4 shrink-0' />
                      <span className='truncate'>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};