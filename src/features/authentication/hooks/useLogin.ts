import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '../../../redux/store/store';
import { useLoginMutation } from '../services/authApi/authApi';
import { setUser } from '../services/authSlice/authSlice';
import { User } from '../../../types';
import { useNavigate, useRouter } from '@tanstack/react-router';

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

export const useLoginModal = ({ onClose, onOpenRegister, onForgotPassword, onSuccess }: UseLoginModalProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const router = useRouter();
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

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleForgotPasswordClick = () => {
    const currentUsername = getValues('username');
    if (onForgotPassword) {
      onForgotPassword(currentUsername);
    } else {
      router.navigate({ to: '/reset-password' });
    }
  };

  const handleRegisterClick = () => {
    if (onOpenRegister) {
      onOpenRegister();
    } else {
      router.navigate({ to: '/register' });
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const credentials = {
        identity: data.username.trim(),
        password: data.password,
      };

      const res = await login(credentials).unwrap();

      if (res.success && res.data?.user) {
        // ১. Redux-এ ইউজার সেট
        dispatch(setUser({ user: res.data.user as User }));

        // ২. সাকসেস মেসেজ শো
        setSuccessMessage('লগইন সফল হয়েছে! রিডাইরেক্ট করা হচ্ছে...');

        // ৩. রাউটার ইনভ্যালিডেট করে রিফ্রেশ ছাড়া অটো রিডাইরেক্ট
        setTimeout(async () => {
          if (onSuccess) onSuccess();

          // TanStack Router-কে নতুন Redux State আপডেট রি-ইভালুয়েট করানো
          await router.invalidate();

          if (onClose) {
            onClose();
          } else {
            // রিফ্রেশ ছাড়াই হোমপেজ/ড্যাশবোর্ডে নেভিগেট
            navigate({ to: '/' });
          }
        }, 1200);
      }
    } catch (err: any) {
      // 👈 এরর আসলে সফল মেসেজ দেখাবে না, শুধু এরর মেসেজ নিয়ে লগইন পেজেই থাকবে
      const backendErrorMsg = err?.data?.message || err?.message || 'ভুল ইমেইল/ইউজারনেম বা পাসওয়ার্ড।';
      setErrorMessage(backendErrorMsg);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    errorMessage,
    successMessage,
    showPassword,
    toggleShowPassword,
    isLoginLoading,
    handleForgotPasswordClick,
    handleRegisterClick,
    onSubmit,
  };
};
