import React from 'react';
import { Lock, User, AlertCircle, CheckCircle2, Loader2, UserPlus, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useLoginModal } from '../hooks/useLogin';

export interface LoginFormProps {
  onSwitchToRegister?: () => void;
  onSwitchToResetPassword?: () => void;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToRegister,
  onSwitchToResetPassword,
  onSuccess,
  onClose,
}) => {
  const {
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
  } = useLoginModal({
    onClose,
    onOpenRegister: onSwitchToRegister,
    onForgotPassword: onSwitchToResetPassword,
    onSuccess,
  });

  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
  };

  return (
    <div className='space-y-5'>
      {/* Header */}
      <div className='text-center space-y-1'>
        <p className='text-xl font-black tracking-tight text-emerald-950'>টমছম ব্রিজ টার্ফ ও কিডস জোন</p>
        <h3 className='text-sm font-semibold text-emerald-700/80 uppercase tracking-wider'>লগইন</h3>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className='p-3.5 bg-red-500/10 text-red-700 border border-red-500/30 rounded-md text-sm font-semibold flex items-center space-x-2.5 animate-in fade-in'>
          <AlertCircle className='w-4 h-4 text-red-600 shrink-0' />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className='p-3.5 bg-emerald-500/15 text-emerald-900 border border-emerald-500/30 rounded-md text-sm font-extrabold flex items-center space-x-2.5 animate-in fade-in'>
          <CheckCircle2 className='w-4 h-4 text-emerald-600 shrink-0' />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form Elements */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
        <div>
          <label className='block text-sm font-semibold text-slate-700 uppercase tracking-wider mb-1.5'>
            ইমেইল বা ইউজারনেম *
          </label>
          <div className='relative'>
            <input
              {...register('username')}
              type='text'
              placeholder='username / email@domain.com'
              className='w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10 rounded-md text-sm font-semibold outline-none transition-all duration-200 placeholder:text-slate-400 text-slate-800'
            />
            <User className='w-4 h-4 text-slate-400 absolute left-3.5 top-3.5' />
          </div>
          {errors.username && (
            <p className='mt-1 text-sm text-red-600 font-semibold'>{errors.username.message as string}</p>
          )}
        </div>

        <div>
          <div className='flex items-center justify-between mb-1.5 gap-2'>
            <label className='block text-sm font-semibold text-slate-700 uppercase tracking-wider shrink-0'>
              পাসওয়ার্ড *
            </label>
            <button
              type='button'
              onClick={handleForgotPasswordClick}
              className='text-[11px] font-semibold text-red-700 hover:text-red-800 hover:underline cursor-pointer transition-colors whitespace-nowrap'
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </button>
          </div>
          <div className='relative'>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••'
              className='w-full pl-10 pr-10 py-3 bg-slate-50/80 border border-slate-200 focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-600/10 rounded-md text-sm font-semibold outline-none transition-all duration-200 placeholder:text-slate-400 text-slate-800'
            />
            <Lock className='w-4 h-4 text-slate-400 absolute left-3.5 top-3' />
            <button
              type='button'
              onClick={toggleShowPassword}
              className='absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer'
            >
              {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
            </button>
          </div>
          {errors.password && (
            <p className='mt-1 text-sm text-red-600 font-semibold'>{errors.password.message as string}</p>
          )}
        </div>

        <button
          type='submit'
          disabled={isLoginLoading || !!successMessage}
          className='w-full py-3 mt-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 active:scale-[0.99] text-white font-semibold text-sm rounded-md shadow-lg shadow-emerald-900/20 transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed border border-emerald-400/20'
        >
          {isLoginLoading ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <span className='inline-flex items-center'>
              লগইন করুন
              <ArrowRight className='w-4 h-4 ml-1.5' />
            </span>
          )}
        </button>
      </form>

      <div className='pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-2'>
        <span className='text-sm text-slate-500 font-semibold'>নতুন একাউন্ট তৈরি করতে চান?</span>
        <button
          type='button'
          onClick={handleRegisterClick}
          className='inline-flex items-center text-sm font-extrabold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer transition-colors'
        >
          <UserPlus className='w-3.5 h-3.5 mr-1' />
          রেজিস্ট্রেশন করুন
        </button>
      </div>
    </div>
  );
};
