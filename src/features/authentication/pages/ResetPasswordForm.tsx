import React, { useState } from 'react';
import { User, Lock, AlertCircle, Loader2, ArrowRight, Eye, EyeOff, CheckCircle2, KeyRound, LogIn } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResetPasswordMutation, useVerifyUserMutation } from '../services/authApi/authApi';
import { useNavigate } from '@tanstack/react-router';

// Step 1 Schema
const verifySchema = z.object({
  identity: z.string().min(1, 'অনুগ্রহ করে আপনার ইউজারনেম, ইমেইল বা ফোন নম্বর দিন।'),
});
type VerifyFormData = z.infer<typeof verifySchema>;

// Step 2 Schema
const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'),
    confirmPassword: z.string().min(1, 'কনফার্ম পাসওয়ার্ড দিন।'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'পাসওয়ার্ড দুটি মেলেনি!',
    path: ['confirmPassword'],
  });
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export interface ResetPasswordFormProps {
  onSwitchToLogin?: () => void;
  onSuccess?: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSwitchToLogin, onSuccess }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [verifiedIdentity, setVerifiedIdentity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [verifyUser, { isLoading: isVerifying }] = useVerifyUserMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  // Form 1: Verify User
  const {
    register: registerVerify,
    handleSubmit: handleSubmitVerify,
    formState: { errors: verifyErrors },
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
  });

  // Form 2: Reset Password
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleLoginNavigation = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      navigate({ to: '/login' });
    }
  };

  const onVerifySubmit = async (data: VerifyFormData) => {
    setErrorMessage(null);
    try {
      const res = await verifyUser({ identity: data.identity }).unwrap();
      if (res.success || res.data?.exists) {
        setVerifiedIdentity(data.identity);
        setStep(2);
      } else {
        setErrorMessage('এই তথ্যে কোনো অ্যাকাউন্ট পাওয়া যায়নি।');
      }
    } catch (err: any) {
      setErrorMessage(err?.data?.message || 'ইউজার ম্যাচ করেনি। সঠিক তথ্য দিন।');
    }
  };

  const onResetSubmit = async (data: ResetPasswordFormData) => {
    setErrorMessage(null);
    try {
      const res = await resetPassword({ identity: verifiedIdentity, newPassword: data.newPassword }).unwrap();
      if (res.success || res.statusCode === 200) {
        if (onSuccess) onSuccess();
        handleLoginNavigation();
      }
    } catch (err: any) {
      setErrorMessage(err?.data?.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className='space-y-6'>
      <div className='text-center space-y-1'>
        <h3 className='text-xl font-black tracking-tight text-slate-900'>পাসওয়ার্ড রিসেট করুন</h3>
        <p className='text-xs text-slate-500 font-medium'>
          {step === 1 ? 'অ্যাকাউন্ট ভেরিফিকেশন' : 'নতুন পাসওয়ার্ড সেট করুন'}
        </p>
      </div>

      {errorMessage && (
        <div className='p-3.5 bg-red-50 text-red-700 border border-red-200/80 rounded-xl text-xs font-semibold flex items-center space-x-2.5'>
          <AlertCircle className='w-4 h-4 text-red-600 shrink-0' />
          <span>{errorMessage}</span>
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleSubmitVerify(onVerifySubmit)} className='space-y-4'>
          <div>
            <label className='block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5'>
              ইউজারনেম বা ইমেইল <span className='text-red-600'>*</span>
            </label>
            <div className='relative'>
              <input
                {...registerVerify('identity')}
                type='text'
                placeholder='আপনার ইউজারনেম/ইমেইল নাম্বার'
                className='w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-red-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all'
              />
              <User className='w-4 h-4 text-slate-400 absolute left-3.5 top-3.5' />
            </div>
            {verifyErrors.identity && (
              <p className='mt-1 text-xs text-red-600 font-medium'>{verifyErrors.identity.message}</p>
            )}
          </div>

          <button
            type='submit'
            disabled={isVerifying}
            className='w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center cursor-pointer disabled:opacity-70'
          >
            {isVerifying ? (
              <Loader2 className='w-5 h-5 animate-spin' />
            ) : (
              <span className='inline-flex items-center'>
                যাচাই করুন <ArrowRight className='w-4 h-4 ml-2' />
              </span>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmitReset(onResetSubmit)} className='space-y-4'>
          <div className='p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center text-xs font-bold text-emerald-800 space-x-2'>
            <CheckCircle2 className='w-4 h-4 text-emerald-600 shrink-0' />
            <span>অ্যাকাউন্ট ভেরিফাইড: ({verifiedIdentity})</span>
          </div>

          <div>
            <label className='block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5'>
              নতুন পাসওয়ার্ড <span className='text-red-600'>*</span>
            </label>
            <div className='relative'>
              <input
                {...registerReset('newPassword')}
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                className='w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 focus:border-red-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all'
              />
              <Lock className='w-4 h-4 text-slate-400 absolute left-3.5 top-3.5' />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer'
              >
                {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
              </button>
            </div>
            {resetErrors.newPassword && (
              <p className='mt-1 text-xs text-red-600 font-medium'>{resetErrors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className='block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5'>
              কনফার্ম পাসওয়ার্ড *
            </label>
            <div className='relative'>
              <input
                {...registerReset('confirmPassword')}
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                className='w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-red-600 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all'
              />
              <KeyRound className='w-4 h-4 text-slate-400 absolute left-3.5 top-3.5' />
            </div>
            {resetErrors.confirmPassword && (
              <p className='mt-1 text-xs text-red-600 font-medium'>{resetErrors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type='submit'
            disabled={isResetting}
            className='w-full py-3.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/25 transition-all flex items-center justify-center cursor-pointer disabled:opacity-70'
          >
            {isResetting ? <Loader2 className='w-5 h-5 animate-spin' /> : 'পাসওয়ার্ড পরিবর্তন করুন'}
          </button>
        </form>
      )}

      <div className='pt-4 border-t border-slate-100 text-center'>
        <button
          type='button'
          onClick={handleLoginNavigation}
          className='inline-flex items-center hover:underline text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer'
        >
          <LogIn className='w-3.5 h-3.5 mr-1' />
          লগইন করুন
        </button>
      </div>
    </div>
  );
};
