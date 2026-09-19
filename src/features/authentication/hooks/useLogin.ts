import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '../../../redux/store/store';
import { useLoginMutation } from '../services/authApi/authApi';
import { setUser } from '../services/authSlice/authSlice';
import { User } from '../../../types';
import { useNavigate, useRouter } from '@tanstack/react-router';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  username: z.string().min(1, 'ইমেইল অথবা ইউজারনেম দেওয়া আবশ্যক।'),
  password: z.string().min(1, 'পাসওয়ার্ড দেওয়া আবশ্যক।'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

interface UseLoginModalProps {
  onClose?: () => void;
  onOpenRegister?: () => void;
  onForgotPassword?: (username?: string) => void;
  onSuccess?: () => void;
}

export const useLoginModal = ({
  onClose,
  onOpenRegister,
  onForgotPassword,
  onSuccess,
}: UseLoginModalProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleForgotPasswordClick = () => {
    const currentUsername = getValues('username');
    if (onForgotPassword) {
      onForgotPassword(currentUsername);
    } else {
      navigate({ to: '/reset-password' });
    }
  };

  const handleRegisterClick = () => {
    if (onOpenRegister) {
      onOpenRegister();
    } else {
      navigate({ to: '/register' });
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const credentials = {
        identity: data.username.trim(),
        password: data.password,
      };

      const res = await login(credentials).unwrap();

      if (!res.success) {
        return;
      }

      // ১. রিডক্সে ইউজার সেট করুন
      dispatch(
        setUser({
          user: res.data.user as User,
        })
      );

      // ২. সাকসেস টোস্ট দেখান
      toast.success(res.message || 'লগইন সফল হয়েছে!');

      // ৩. রাউটার ইনভ্যালিডেট করে প্রটেক্টেড রাউটের গার্ড রি-রান করুন
      await router.invalidate();

      // ৪. রোল বা আগের লোকেশন অনুযায়ী রিডাইরেক্ট ফ্লো
      const userRole = res.data.user.role;
      let redirectTo = '/';

      if (userRole === 'CUSTOMER') {
        redirectTo = '/dashboard/customer';
      } else if (['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(userRole)) {
        redirectTo = '/dashboard/adm_v1';
      }

      await navigate({
        to: redirectTo as any,
      });

      // ৫. মোডাল বা প্রপস কলব্যাক ক্লোজ করা
      onClose?.();
      onSuccess?.();

    } catch (err: any) {
      console.error('Login Error:', err);

      const backendErrorMsg =
        err?.data?.message ||
        err?.message ||
        'ভুল ইমেইল/ইউজারনেম বা পাসওয়ার্ড।';

      toast.error(backendErrorMsg);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    showPassword,
    toggleShowPassword,
    isLoginLoading,
    handleForgotPasswordClick,
    handleRegisterClick,
    onSubmit,
  };
};