import React, { useState } from 'react';
import { User, Phone, Mail, Lock, AlertCircle, Loader2, LogIn, Eye, EyeOff, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterMutation } from '../services/authApi/authApi';

const registerSchema = z.object({
  name: z.string().min(1, 'পূর্ণ নাম দেওয়া আবশ্যক।'),
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
      navigate('/login');
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
          navigate('/login');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.data?.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className='space-y-5'>
      <div className='text-center  space-y-1'>
        <p className='text-xl font-black tracking-tight text-slate-900'>টমছম ব্রিজ টার্ফ ও কিডস জোন</p>
        <h3 className='text-sm text-slate-500 font-medium'>নতুন অ্যাকাউন্ট তৈরি করুন</h3>
      </div>

      {errorMessage && (
        <div className='p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm font-semibold flex items-center space-x-2'>
          <AlertCircle className='w-4 h-4 shrink-0 text-red-600' />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-3.5'>
        {/* Name */}
        <div>
          <label className='block text-sm font-bold text-slate-700  tracking-wider mb-1'>
            পূর্ণ নাম <span className='text-red-600'>*</span>
          </label>
          <div className='relative'>
            <input
              {...register('name')}
              type='text'
              placeholder='আপনার নাম লিখুন'
              className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-red-600 focus:bg-white rounded-md text-sm font-semibold outline-none transition-all'
            />
            <UserCheck className='w-4 h-4 text-slate-400 absolute left-3.5 top-3' />
          </div>
          {errors.name && <p className='mt-1 text-sm text-red-600 font-medium'>{errors.name.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className='block text-sm font-bold text-slate-700  tracking-wider mb-1'>
            মোবাইল নম্বর <span className='text-red-600'>*</span>
          </label>
          <div className='relative'>
            <input
              {...register('phone')}
              type='text'
              placeholder='017XXXXXXXX'
              className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-red-600 focus:bg-white rounded-md text-sm font-semibold outline-none transition-all'
            />
            <Phone className='w-4 h-4 text-slate-400 absolute left-3.5 top-3' />
          </div>
          {errors.phone && <p className='mt-1 text-sm text-red-600 font-medium'>{errors.phone.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className='block text-sm font-bold text-slate-700  tracking-wider mb-1'>ইমেইল (অপশনাল)</label>
          <div className='relative'>
            <input
              {...register('email')}
              type='email'
              placeholder='user@domain.com'
              className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-red-600 focus:bg-white rounded-md text-sm font-semibold outline-none transition-all'
            />
            <Mail className='w-4 h-4 text-slate-400 absolute left-3.5 top-3' />
          </div>
          {errors.email && <p className='mt-1 text-sm text-red-600 font-medium'>{errors.email.message}</p>}
        </div>

        {/* Username */}
        <div>
          <label className='block text-sm font-bold text-slate-700 tracking-wider mb-1'>
            ইউজারনেম <span className='text-red-600'>*</span>
          </label>
          <div className='relative'>
            <input
              {...register('username')}
              type='text'
              placeholder='username'
              className='w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-red-600 focus:bg-white rounded-md text-sm font-semibold outline-none transition-all'
            />
            <User className='w-4 h-4 text-slate-400 absolute left-3.5 top-3' />
          </div>
          {errors.username && <p className='mt-1 text-sm text-red-600 font-medium'>{errors.username.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className='block text-sm font-bold text-slate-700  tracking-wider mb-1'>
            পাসওয়ার্ড <span className='text-red-600'>*</span>
          </label>
          <div className='relative'>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••'
              className='w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-red-600 focus:bg-white rounded-md text-sm font-semibold outline-none transition-all'
            />
            <Lock className='w-4 h-4 text-slate-400 absolute left-3.5 top-3' />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer'
            >
              {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
            </button>
          </div>
          {errors.password && <p className='mt-1 text-sm text-red-600 font-medium'>{errors.password.message}</p>}
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='w-full py-3 mt-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-sm rounded-md shadow-lg shadow-red-600/25 flex items-center justify-center cursor-pointer disabled:opacity-70'
        >
          {isLoading ? <Loader2 className='w-5 h-5 animate-spin' /> : 'রেজিস্ট্রেশন করুন'}
        </button>
      </form>

      <div className='pt-3 border-t border-slate-100 flex items-center justify-between'>
        <p className='text-sm text-slate-500 font-medium'>আগে থেকেই অ্যাকাউন্ট আছে?</p>
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
