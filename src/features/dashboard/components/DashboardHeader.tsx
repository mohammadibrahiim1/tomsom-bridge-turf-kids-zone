import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Globe, User as UserIcon, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useLogoutMutation } from '../../authentication/services/authApi/authApi';
import { logout } from '../../authentication/services/authSlice/authSlice';
import { useDispatch } from 'react-redux';
import { baseApi } from '../../../redux/baseApi/baseApi';

interface DashboardHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: {
    name: string;
    role: string;
  };
  handleLogoutAction?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isCollapsed, setIsCollapsed, currentUser }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [logoutApi] = useLogoutMutation();

  const onLogout = async () => {
    setIsDropdownOpen(false);

    try {
      await logoutApi({}).unwrap();
    } catch (error) {
    } finally {
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
      navigate({ to: '/login' });
    }
  };

  return (
    <header
      style={{
        transition: 'left 0.3s ease-in-out',
      }}
      className={`fixed top-0 right-0 z-30 h-16 bg-emerald-950/95 backdrop-blur-md border-b border-emerald-800/80 px-4 sm:px-6 flex items-center justify-between shadow-md transition-all duration-300 left-0 ${
        isCollapsed ? 'lg:left-[80px]' : 'lg:left-[280px]'
      }`}
    >
      {/* Mobile & Tablet Branding (Hidden on Desktop) */}
      <div className='flex lg:hidden items-center gap-2.5'>
        <div className='w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center font-black text-xs text-white shadow-md border border-emerald-400/30'>
          TB
        </div>
        <span className='font-bold text-xs sm:text-sm text-emerald-50 truncate max-w-[150px]'>টমছম ব্রিজ টার্ফ</span>
      </div>

      {/* Desktop Large Device: Sidebar Expand/Collapse Button & Title */}
      <div className='hidden lg:flex items-center gap-3'>
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className='p-2 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors border border-emerald-700/60 cursor-pointer flex items-center justify-center'
          title={isCollapsed ? 'Sidebar প্রসারণ করুন' : 'Sidebar সংকুচিত করুন'}
        >
          {isCollapsed ? (
            <ChevronRight className='w-4 h-4 text-emerald-300' />
          ) : (
            <ChevronLeft className='w-4 h-4 text-emerald-300' />
          )}
        </button>

        <h1 className='text-sm font-extrabold text-emerald-100 tracking-wide'>অ্যাডমিন কনসোল</h1>
      </div>

      {/* User Actions & Profile Dropdown */}
      <div className='flex items-center gap-3'>
        <div className='h-4 w-px bg-emerald-800/80 hidden sm:block' />

        {/* Profile Dropdown Container */}
        <div className='relative' ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className='flex items-center gap-2.5 p-1.5 rounded-md hover:bg-emerald-900/70 transition-colors cursor-pointer border border-transparent hover:border-emerald-800'
          >
            <div className='w-8 h-8 bg-emerald-900 border border-emerald-700/80 rounded-full flex items-center justify-center text-emerald-200 shrink-0 shadow-inner'>
              <UserIcon className='w-4 h-4 text-emerald-300' />
            </div>
            <div className='text-left hidden sm:block'>
              <span className='text-xs font-bold text-emerald-50 block leading-tight'>{currentUser?.name}</span>
              <span className='text-[10px] font-medium text-emerald-300/80 block uppercase tracking-wider'>
                {currentUser?.role}
              </span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-emerald-300 transition-transform duration-200 hidden sm:block ${
                isDropdownOpen ? 'rotate-180 text-green-400' : ''
              }`}
            />
          </button>

          {/* Animated Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className='absolute right-0 mt-2 w-56 bg-emerald-950 border border-emerald-800/90 rounded-md shadow-2xl overflow-hidden z-50 p-1.5'
              >
                {/* User Info Header inside Dropdown */}
                <div className='px-3 py-2.5 border-b border-emerald-800/80 mb-1'>
                  <p className='text-xs font-bold text-emerald-50 truncate'>{currentUser?.name}</p>
                  <p className='text-[10px] font-semibold text-green-400 uppercase tracking-wider'>
                    {currentUser?.role}
                  </p>
                </div>

                {/* Dropdown Options */}
                <div className='space-y-0.5'>
                  <Link
                    to='/'
                    onClick={() => setIsDropdownOpen(false)}
                    className='flex sm:hidden items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold text-emerald-200 hover:text-white hover:bg-emerald-900/80 transition-colors'
                  >
                    <Globe className='w-4 h-4 text-emerald-400' />
                    <span>ওয়েবসাইট দেখুন</span>
                  </Link>
                </div>

                <div className='my-1 border-t border-emerald-800/80' />

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className='w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-semibold text-red-300 hover:text-white hover:bg-red-600 transition-all cursor-pointer'
                >
                  <LogOut className='w-4 h-4' />
                  <span>লগআউট</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
