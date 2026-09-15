import React from 'react';
import { X } from 'lucide-react';
import { useNavigate, Outlet } from '@tanstack/react-router';

export const AuthModalLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    
    if (window.history.length > 2) {
      window.history.back();
    } else {
      navigate({ to: '/', replace: true });
    }
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs transition-opacity animate-fadeIn'
      onClick={handleClose}
    >
      <div
        className='relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className='absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer'
          aria-label='Close modal'
        >
          <X className='w-5 h-5' />
        </button>

        {/* Dynamic Route Content (LoginForm, RegisterForm, ResetPasswordForm) */}
        <div className='p-6'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
