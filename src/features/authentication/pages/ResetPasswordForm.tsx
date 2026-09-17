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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <div className='min-h-screen flex items-center justify-center'>
<div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-center transition-all">
      {/* Header */}
      <div className="text-center space-y-1.5 mb-6">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-emerald-950">
          টমছম ব্রিজ টার্ফ ও কিডস জোন
        </h2>
        <div className="inline-block px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100/60">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            {step === 1 ? 'অ্যাকাউন্ট ভেরিফিকেশন' : 'নতুন পাসওয়ার্ড সেট করুন'}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-5 p-3.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium flex items-center space-x-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="leading-tight">{errorMessage}</span>
        </div>
      )}

      {/* Step 1: Verify Identity */}
      {step === 1 ? (
        <form onSubmit={handleSubmitVerify(onVerifySubmit)} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              ইউজারনেম বা ইমেইল <span className="text-emerald-600">*</span>
            </label>
            <div className="relative">
              <input
                {...registerVerify('identity')}
                type="text"
                placeholder="আপনার ইউজারনেম বা ইমেইল লিখুন"
                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {verifyErrors.identity && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">{verifyErrors.identity.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-3.5 mt-2 bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border border-emerald-500/20"
          >
            {isVerifying ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="inline-flex items-center">
                যাচাই করুন <ArrowRight className="w-4 h-4 ml-2" />
              </span>
            )}
          </button>
        </form>
      ) : (
        /* Step 2: Reset Password */
        <form onSubmit={handleSubmitReset(onResetSubmit)} className="space-y-4">
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center text-xs font-semibold text-emerald-900 space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">ভেরিফাইড অ্যাকাউন্ট: <strong className="text-emerald-700">{verifiedIdentity}</strong></span>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              নতুন পাসওয়ার্ড <span className="text-emerald-600">*</span>
            </label>
            <div className="relative">
              <input
                {...registerReset('newPassword')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {resetErrors.newPassword && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">{resetErrors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              পাসওয়ার্ড নিশ্চিত করুন <span className="text-emerald-600">*</span>
            </label>
            <div className="relative">
              <input
                {...registerReset('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {resetErrors.confirmPassword && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">{resetErrors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isResetting}
            className="w-full py-3.5 mt-2 bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border border-emerald-500/20"
          >
            {isResetting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'পাসওয়ার্ড পরিবর্তন করুন'}
          </button>
        </form>
      )}

      {/* Footer Navigation */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center text-center">
        <button
          type="button"
          onClick={handleLoginNavigation}
          className="inline-flex items-center text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors cursor-pointer"
        >
          <LogIn className="w-3.5 h-3.5 mr-1.5" />
          লগইন ফিরে যান
        </button>
      </div>
    </div>
    </div>
  );
};