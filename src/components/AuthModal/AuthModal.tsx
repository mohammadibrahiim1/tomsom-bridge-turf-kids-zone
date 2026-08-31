import React from 'react';
import { X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { AuthMode, closeAuthModal, switchAuthMode } from '../../redux/features/modal/modalSlice';
import { RootState } from '../../redux/store/store';
import { LoginForm } from '../../features/authentication/pages/LoginForm';
import { RegisterForm } from '../../features/authentication/pages/RegisterForm';
import { ResetPasswordForm } from '../../features/authentication/pages/ResetPasswordForm';

interface AuthModalProps {
  isOpen?: boolean;
  mode?: AuthMode;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen: propIsOpen, mode: propMode, onClose: propOnClose }) => {
  const dispatch = useDispatch();

  const { isAuthModalOpen, authMode } = useSelector((state: RootState) => state.modal);

  const isOpen = propIsOpen ?? isAuthModalOpen;
  const currentMode = propMode ?? authMode;

  if (!isOpen) return null;

  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      dispatch(closeAuthModal());
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn'>
      <div
        className='relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className='absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer'
          aria-label='Close modal'
        >
          <X className='w-5 h-5' />
        </button>

        <div className='p-6'>
          {currentMode === 'login' && (
            <LoginForm
              onSwitchToRegister={() => dispatch(switchAuthMode('register'))}
              onSwitchToResetPassword={() => dispatch(switchAuthMode('reset-password'))}
              onSuccess={handleClose}
            />
          )}

          {currentMode === 'register' && (
            <RegisterForm onSwitchToLogin={() => dispatch(switchAuthMode('login'))} onSuccess={handleClose} />
          )}

          {currentMode === 'reset-password' && (
            <ResetPasswordForm onSwitchToLogin={() => dispatch(switchAuthMode('login'))} onSuccess={handleClose} />
          )}
        </div>
      </div>
    </div>
  );
};
