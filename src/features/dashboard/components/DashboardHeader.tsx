import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Globe, User as UserIcon, Settings, LogOut, ChevronDown } from 'lucide-react';

interface DashboardHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: {
    name: string;
    role: string;
  };
  handleLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isCollapsed,
  setIsCollapsed,
  currentUser,
  handleLogout,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <header
      style={{
        transition: 'left 0.3s ease-in-out',
      }}
      className={`fixed top-0 right-0 z-30 h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between shadow-sm transition-all duration-300 left-0 ${
        isCollapsed ? 'lg:left-[80px]' : 'lg:left-[280px]'
      }`}
    >
      {/* Mobile & Tablet Branding (Hidden on Desktop) */}
      <div className='flex lg:hidden items-center gap-2.5'>
        <div className='w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center font-black text-xs text-white shadow-md'>
          TB
        </div>
        <span className='font-bold text-xs sm:text-sm text-slate-100 truncate max-w-[150px]'>টমছম ব্রিজ টার্ফ</span>
      </div>

      {/* Desktop Large Device: Sidebar Expand/Collapse Button & Title */}
      <div className='hidden lg:flex items-center gap-3'>
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className='p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60 cursor-pointer flex items-center justify-center'
          title={isCollapsed ? 'Sidebar প্রসারণ করুন' : 'Sidebar সংকুচিত করুন'}
        >
          {isCollapsed ? (
            <ChevronRight className='w-4 h-4 text-red-400' />
          ) : (
            <ChevronLeft className='w-4 h-4 text-red-400' />
          )}
        </button>

        <h1 className='text-sm font-extrabold text-slate-200 tracking-wide'>অ্যাডমিন কনসোল</h1>
      </div>

      {/* User Actions & Profile Dropdown */}
      <div className='flex items-center gap-3'>
        <button
          onClick={() => window.open('/', '_blank')}
          className='hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg border border-slate-700/60 transition-colors cursor-pointer'
        >
          <Globe className='w-3.5 h-3.5 text-emerald-400' />
          <span>লাইভ সাইট</span>
        </button>

        <div className='h-4 w-px bg-slate-800 hidden sm:block' />

        {/* Profile Dropdown Container */}
        <div className='relative' ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className='flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer border border-transparent hover:border-slate-800'
          >
            <div className='w-8 h-8 bg-slate-800 border border-slate-700/80 rounded-full flex items-center justify-center text-slate-300 shrink-0 shadow-inner'>
              <UserIcon className='w-4 h-4 text-red-400' />
            </div>
            <div className='text-left hidden sm:block'>
              <span className='text-xs font-bold text-slate-100 block leading-tight'>{currentUser.name}</span>
              <span className='text-[10px] font-medium text-slate-400 block uppercase tracking-wider'>
                {currentUser.role}
              </span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 hidden sm:block ${
                isDropdownOpen ? 'rotate-180 text-red-400' : ''
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
                className='absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5'
              >
                {/* User Info Header inside Dropdown */}
                <div className='px-3 py-2.5 border-b border-slate-800 mb-1'>
                  <p className='text-xs font-bold text-slate-100 truncate'>{currentUser.name}</p>
                  <p className='text-[10px] font-semibold text-red-400 uppercase tracking-wider'>{currentUser.role}</p>
                </div>

                {/* Navigation Links */}
                <div className='space-y-0.5'>
                  <Link
                    to='/dashboard/profile'
                    onClick={() => setIsDropdownOpen(false)}
                    className='flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors'
                  >
                    <UserIcon className='w-4 h-4 text-slate-400' />
                    <span>প্রোফাইল</span>
                  </Link>

                  <Link
                    to='/dashboard/settings'
                    onClick={() => setIsDropdownOpen(false)}
                    className='flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors'
                  >
                    <Settings className='w-4 h-4 text-slate-400' />
                    <span>সেটিংস</span>
                  </Link>
                </div>

                <div className='my-1 border-t border-slate-800' />

                {/* Logout Button */}
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    handleLogout();
                  }}
                  className='w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-white hover:bg-red-600 transition-all cursor-pointer'
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
