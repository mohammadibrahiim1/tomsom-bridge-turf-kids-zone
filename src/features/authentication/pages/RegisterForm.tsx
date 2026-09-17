import React, { useState } from 'react';
import { User, Phone, Mail, Lock, AlertCircle, Loader2, LogIn, Eye, EyeOff, UserCheck, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterMutation } from '../services/authApi/authApi';
import { useNavigate } from '@tanstack/react-router';

const registerSchema = z.object({
  name: z.string().min(1, 'পূর্ণ নাম দেওয়া আবশ্যক।'),
  phone: z
    .string()
    .min(11, 'সঠিক মোবাইল নম্বর দিন (কমপক্ষে ১১ ডিজিট)।')
    .regex(/^[0-9]+$/, 'মোবাইল নম্বর শুধুমাত্র সংখ্যা হতে হবে।'),
  email: z.string().email('সঠিক ইমেইল ফরম্যাট দিন।').optional().or(z.literal('')),
  username: z
    .string()
    .min(1, 'ইউজারনেম দেওয়া আবশ্যক।')
    .min(3, 'ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে।')
    .regex(/^[a-zA-Z0-9_]+$/, 'ইউজারনেমে শুধুমাত্র ইংরেজি অক্ষর, সংখ্যা এবং (_) ব্যবহার করা যাবে।'),
  password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export interface RegisterFormProps {
  onSwitchToLogin?: () => void;
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, onSuccess }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      username: '',
      password: '',
    },
  });

  const handleLoginNavigation = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      navigate({ to: '/login' });
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage(null);
    try {
      const res = await registerUser(data).unwrap();
      if (res.success || res.statusCode === 200 || res.statusCode === 201) {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate({ to: '/login' });
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.data?.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
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
            নতুন অ্যাকাউন্ট তৈরি করুন
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

      {/* Form Elements */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            পূর্ণ নাম <span className="text-emerald-600">*</span>
          </label>
          <div className="relative">
            <input
              {...register('name')}
              type="text"
              placeholder="আপনার পুরো নাম লিখুন"
              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
            />
            <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {errors.name && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.name.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            মোবাইল নম্বর <span className="text-emerald-600">*</span>
          </label>
          <div className="relative">
            <input
              {...register('phone')}
              type="text"
              placeholder="017XXXXXXXX"
              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
            />
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {errors.phone && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.phone.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            ইমেইল <span className="text-slate-400 font-normal normal-case">(অপশনাল)</span>
          </label>
          <div className="relative">
            <input
              {...register('email')}
              type="email"
              placeholder="user@domain.com"
              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {errors.email && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.email.message}</p>}
        </div>

        {/* Username */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            ইউজারনেম <span className="text-emerald-600">*</span>
          </label>
          <div className="relative">
            <input
              {...register('username')}
              type="text"
              placeholder="username"
              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {errors.username && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.username.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            পাসওয়ার্ড <span className="text-emerald-600">*</span>
          </label>
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
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 mt-2 bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/25 transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border border-emerald-500/20"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span className="inline-flex items-center">
              রেজিস্ট্রেশন করুন
              <ArrowRight className="w-4 h-4 ml-2" />
            </span>
          )}
        </button>
      </form>

      {/* Footer / Login Redirect */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-center">
        <span className="text-xs sm:text-sm text-slate-500 font-medium">
          আগে থেকেই অ্যাকাউন্ট আছে?
        </span>
        <button
          type="button"
          onClick={handleLoginNavigation}
          className="inline-flex items-center text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors cursor-pointer"
        >
          <LogIn className="w-3.5 h-3.5 mr-1.5" />
          লগইন করুন
        </button>
      </div>
    </div>
    </div>
  );
};