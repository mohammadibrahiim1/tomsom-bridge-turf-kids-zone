import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../redux/store/store';
import { useLoginMutation } from '../services/authApi/authApi';
import { setUser } from '../services/authSlice/authSlice';
import { User } from '../../../types';

const loginSchema = z.object({
  username: z.string().min(1, 'ইমেইল অথবা ইউজারনেম দেওয়া আবশ্যক।'),
  password: z.string().min(1, 'পাসওয়ার্ড দেওয়া আবশ্যক।'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

interface UseLoginModalProps {
  onClose?: () => void;
  onOpenRegister?: () => void;
  onForgotPassword?: (username?: string) => void;
}

export const useLoginModal = ({ onClose, onOpenRegister, onForgotPassword }: UseLoginModalProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const handleClose = () => {
    setErrorMessage(null);
    reset();
    if (onClose) {
      onClose();
    } else {
      navigate('/'); // ডিফল্টভাবে হোম পেজে রিডাইরেক্ট করবে
    }
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleForgotPasswordClick = () => {
    const currentUsername = getValues('username');
    if (onForgotPassword) {
      onForgotPassword(currentUsername);
    } else {
      navigate('/reset-password'); // URL নেভিগেশন
    }
  };

  const handleRegisterClick = () => {
    if (onOpenRegister) {
      onOpenRegister();
    } else {
      navigate('/register'); // URL নেভিগেশন
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    try {
      const credentials = {
        identity: data.username.trim(),
        password: data.password,
      };

      const res = await login(credentials).unwrap();

      if (res.success && res.data?.user) {
        dispatch(setUser({ user: res.data.user as User }));
        handleClose();
      }
    } catch (err: any) {
      const backendErrorMsg = err?.data?.message || err?.message || 'ভুল ইমেইল/ইউজারনেম বা পাসওয়ার্ড।';
      setErrorMessage(backendErrorMsg);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    errorMessage,
    showPassword,
    toggleShowPassword,
    isLoginLoading,
    handleClose,
    handleForgotPasswordClick,
    handleRegisterClick,
    onSubmit,
  };
};
