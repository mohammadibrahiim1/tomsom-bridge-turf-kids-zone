import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  MapPin,
  FileText,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { WebsiteSettings } from '../../../../types';

// ১. টাইপ ডিফিনিশনস (Types Definition)
export interface CustomerUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' | 'MANAGER';
}

export interface BookingSummary {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}

export interface CustomerDashboardProps {
  currentUser?: CustomerUser | null;
  settings?: WebsiteSettings | null;
  bookingSummary?: BookingSummary;
  onNavigateHome?: () => void;
}

// ২. ডিফল্ট প্রপস ডেটা (যদি প্রপস থেকে ডাটা না আসে)
const defaultBookingSummary: BookingSummary = {
  totalBookings: 0,
  activeBookings: 0,
  completedBookings: 0,
  cancelledBookings: 0,
};

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  settings,
  bookingSummary = defaultBookingSummary,
}) => {
  const websiteTitle = settings?.websiteNameBn || 'টমছম ব্রিজ টার্ফ ও কিডস জোন';
  const customerName = currentUser?.name || 'সম্মানিত কাস্টমার';

  return (
    <div className='space-y-6 sm:space-y-8 pb-12'>
      {/* ওয়েলকাম ব্যানার */}
      <div className='bg-linear-to-r from-[#2E7D32] to-emerald-700 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden'>
        <div className='relative z-10 max-w-2xl'>
          <span className='inline-flex items-center bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-3 backdrop-blur-md text-emerald-100'>
            <Sparkles className='w-3.5 h-3.5 mr-1.5' />
            কাস্টমার ড্যাশবোর্ড হোম
          </span>
          <h1 className='text-2xl sm:text-3xl font-black mb-2 tracking-tight'>
            স্বাগতম, {customerName}! 👋
          </h1>
          <p className='text-emerald-100 text-xs sm:text-sm font-medium leading-relaxed'>
            {websiteTitle} এ আপনাকে স্বাগতম। এখান থেকে আপনার বর্তমান বুকিং স্ট্যাটাস এবং পূর্ববর্তী সকল কার্যক্রম একনজরে দেখে নিতে পারেন।
          </p>
        </div>
        <div className='absolute -right-5 -bottom-7.5 opacity-10 pointer-events-none'>
          <Calendar className='w-64 h-64 text-white' />
        </div>
      </div>

      {/* স্ট্যাটাস ওভারভিউ কার্ডস */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
        {/* মোট বুকিং */}
        <div className='bg-white p-5 rounded-md border border-slate-200 shadow-xs flex items-center justify-between'>
          <div>
            <p className='text-xs font-bold text-slate-400 uppercase tracking-wider mb-1'>মোট বুকিং</p>
            <h3 className='text-2xl font-black text-slate-900'>{bookingSummary.totalBookings}</h3>
          </div>
          <div className='w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold'>
            <FileText className='w-6 h-6' />
          </div>
        </div>

        {/* চলমান বুকিং */}
        <div className='bg-white p-5 rounded-md border border-slate-200 shadow-xs flex items-center justify-between'>
          <div>
            <p className='text-xs font-bold text-slate-400 uppercase tracking-wider mb-1'>চলমান বুকিং</p>
            <h3 className='text-2xl font-black text-emerald-600'>{bookingSummary.activeBookings}</h3>
          </div>
          <div className='w-12 h-12 rounded-xl bg-emerald-50 text-[#2E7D32] flex items-center justify-center font-bold'>
            <Clock className='w-6 h-6' />
          </div>
        </div>

        {/* সম্পন্ন বুকিং */}
        <div className='bg-white p-5 rounded-md border border-slate-200 shadow-xs flex items-center justify-between'>
          <div>
            <p className='text-xs font-bold text-slate-400 uppercase tracking-wider mb-1'>সম্পন্ন বুকিং</p>
            <h3 className='text-2xl font-black text-slate-900'>{bookingSummary.completedBookings}</h3>
          </div>
          <div className='w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold'>
            <CheckCircle2 className='w-6 h-6' />
          </div>
        </div>

        {/* বাতিল বুকিং */}
        <div className='bg-white p-5 rounded-md border border-slate-200 shadow-xs flex items-center justify-between'>
          <div>
            <p className='text-xs font-bold text-slate-400 uppercase tracking-wider mb-1'>বাতিল বুকিং</p>
            <h3 className='text-2xl font-black text-red-600'>{bookingSummary.cancelledBookings}</h3>
          </div>
          <div className='w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold'>
            <AlertCircle className='w-6 h-6' />
          </div>
        </div>
      </div>

      {/* কুইক অ্যাকশন ও প্রোফাইল ওভারভিউ سیکশন */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* বাম দিকের কুইক অ্যাকশন */}
        <div className='lg:col-span-2 bg-white rounded-md border border-slate-200 p-6 shadow-xs flex flex-col justify-between'>
          <div>
            <h3 className='text-base font-bold text-slate-900 mb-4 flex items-center gap-2'>
              <Sparkles className='w-4 h-4 text-[#2E7D32]' />
              দ্রুত সেবা ও বুকিং
            </h3>
            <p className='text-xs sm:text-sm text-slate-600 mb-6'>
              আপনার পছন্দের স্লটে নতুন বুকিং নিশ্চিত করতে অথবা আপনার পূর্বের বুকিংয়ের তথ্য দেখতে নিচের বাটনগুলোতে ক্লিক করুন।
            </p>
          </div>

          <div className='flex flex-wrap gap-3'>
            <Link
              to='/booking'
              className='inline-flex items-center px-4 py-2.5 bg-[#990000] hover:bg-[#800000] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer'
            >
              <Calendar className='w-4 h-4 mr-2' />
              নতুন বুকিং করুন
              <ArrowRight className='w-4 h-4 ml-2' />
            </Link>

            <Link
              to='/find-your-booking'
              className='inline-flex items-center px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer border border-slate-200'
            >
              বুকিং খুঁজুন
            </Link>
          </div>
        </div>

        {/* ডান দিকের কাস্টমার ইনফো কার্ড */}
        <div className='bg-white rounded-md border border-slate-200 p-6 shadow-xs'>
          <h3 className='text-base font-bold text-slate-900 mb-4 flex items-center gap-2'>
            <User className='w-4 h-4 text-[#2E7D32]' />
            আপনার প্রোফাইল তথ্য
          </h3>

          <div className='space-y-3.5 text-xs'>
            <div className='flex items-center justify-between py-2 border-b border-slate-100'>
              <span className='text-slate-500 font-medium'>নাম:</span>
              <span className='font-bold text-slate-900'>{currentUser?.name || 'N/A'}</span>
            </div>
            <div className='flex items-center justify-between py-2 border-b border-slate-100'>
              <span className='text-slate-500 font-medium flex items-center gap-1'><Phone className='w-3.5 h-3.5 text-slate-400' /> ফোন:</span>
              <span className='font-bold text-slate-900'>{currentUser?.phone || 'যোগ করা হয়নি'}</span>
            </div>
            <div className='flex items-center justify-between py-2 border-b border-slate-100'>
              <span className='text-slate-500 font-medium flex items-center gap-1'><Mail className='w-3.5 h-3.5 text-slate-400' /> ইমেইল:</span>
              <span className='font-bold text-slate-900'>{currentUser?.email || 'যোগ করা হয়নি'}</span>
            </div>
            <div className='flex items-center justify-between py-2'>
              <span className='text-slate-500 font-medium'>রোল:</span>
              <span className='inline-flex px-2 py-0.5 bg-emerald-50 text-[#2E7D32] rounded-md font-bold text-[10px]'>
                {currentUser?.role || 'CUSTOMER'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};