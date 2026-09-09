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

  const handleSuccess = () => {
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md transition-opacity animate-fadeIn'
      onClick={handleClose}
    >
      <div
        className='relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 transform transition-all p-6'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className='absolute top-4 right-4 z-10 p-2 text-slate-500 hover:text-slate-800 bg-slate-100/80 hover:bg-slate-200/90 rounded-full transition-colors cursor-pointer border border-slate-200/50'
          aria-label='Close modal'
        >
          <X className='w-5 h-5' />
        </button>

        <div className='mt-2'>
          {currentMode === 'login' && (
            <LoginForm
              onSwitchToRegister={() => dispatch(switchAuthMode('register'))}
              onSwitchToResetPassword={() => dispatch(switchAuthMode('reset-password'))}
              onSuccess={handleSuccess}
              onClose={handleClose}
            />
          )}

          {currentMode === 'register' && (
            <RegisterForm onSwitchToLogin={() => dispatch(switchAuthMode('login'))} onSuccess={handleSuccess} />
          )}

          {currentMode === 'reset-password' && (
            <ResetPasswordForm onSwitchToLogin={() => dispatch(switchAuthMode('login'))} onSuccess={handleSuccess} />
          )}
        </div>
      </div>
    </div>
  );
};
