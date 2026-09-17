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
    <div className='min-h-screen flex items-center justify-center'>
<div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-center transition-all">
      {/* Header */}
      <div className="text-center space-y-1.5 mb-6">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-emerald-950">
          টমছম ব্রিজ টার্ফ ও কিডস জোন
        </h2>
        <div className="inline-block px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100/60">
          <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            লগইন করুন
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

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-5 p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-semibold flex items-center space-x-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="leading-tight">{successMessage}</span>
        </div>
      )}

      {/* Form Elements */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Username / Email Field */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            ইমেইল বা ইউজারনেম <span className="text-emerald-600">*</span>
          </label>
          <div className="relative">
            <input
              {...register('username')}
              type="text"
              placeholder="username / email@domain.com"
              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {errors.username && (
            <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.username.message as string}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide">
              পাসওয়ার্ড <span className="text-emerald-600">*</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPasswordClick}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline transition-colors cursor-pointer"
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </button>
          </div>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.password.message as string}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoginLoading || !!successMessage}
          className="w-full py-3.5 mt-2 bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border border-emerald-500/20"
        >
          {isLoginLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span className="inline-flex items-center">
              লগইন করুন
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </button>
      </form>

      {/* Footer / Register Redirect */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-center">
        <span className="text-xs sm:text-sm text-slate-500 font-medium">
          কোনো অ্যাকাউন্ট নেই?
        </span>
        <button
          type="button"
          onClick={handleRegisterClick}
          className="inline-flex items-center text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5 mr-1.5" />
          রেজিস্ট্রেশন করুন
        </button>
      </div>
    </div>
    </div>
  );
};