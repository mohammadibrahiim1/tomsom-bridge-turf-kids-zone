import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from '@tanstack/react-router';
// import { logout } from '../features/authentication/services/authSlice/authSlice';
// import { useLogoutMutation } from '../features/authentication/services/authApi/authApi';
// import { baseApi } from '../redux/baseApi/baseApi';
import toast from 'react-hot-toast';
import { useLogoutMutation } from '../../features/authentication/services/authApi/authApi';
import { baseApi } from '../../redux/baseApi/baseApi';
import { logout } from '../../features/authentication/services/authSlice/authSlice';

interface UseNavbarProps {
  onNavigate?: (sectionId: string) => void;
  onOpenBooking?: () => void;
}

export const useNavbar = ({ onNavigate, onOpenBooking }: UseNavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();

  // Outside Click Listener for Profile Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (id: string) => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);

    if (onNavigate) {
      onNavigate(id);
    } else {
      const targetId = id === 'hero' ? 'hero-section' : id;
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBooking = () => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    if (onOpenBooking) {
      onOpenBooking();
    }
  };

  const handleLogoutAction = async () => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsLoggingOut(true);

    const toastId = toast.loading('লগআউট হচ্ছে...');

    try {
      await logoutApi({}).unwrap();
    } catch (error) {
      console.error('Logout failed on server:', error);
    } finally {
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
      setIsLoggingOut(false);
      toast.success('Logout successful!', { id: toastId });
      window.location.href = '/';
    }
  };

  return {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isProfileDropdownOpen,
    setIsProfileDropdownOpen,
    isLoggingOut,
    dropdownRef,
    handleItemClick,
    handleBooking,
    handleLogoutAction,
  };
};