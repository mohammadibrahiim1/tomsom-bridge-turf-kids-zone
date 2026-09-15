import React from 'react';
import {
  CalendarCheck,
  Search,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  Info,
  Clock,
  CreditCard,
  CheckCircle2,
} from 'lucide-react';
import type { WebsiteSettings, TurfInfo } from '../../../types';
import { TurfBookingFlow } from '../../../components/TurfBookingFlow';

export interface BookingPageProps {
  settings?: WebsiteSettings;
  turfInfo?: TurfInfo;
  initialDate?: string;
  onNavigate?: (page: string) => void;
  onOpenSearch?: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  settings,
  turfInfo,
  initialDate,
  onNavigate,
  onOpenSearch,
}) => {
  return (
    <div className='space-y-10 pb-16'>
      {/* 1. Dedicated Header */}
      <div className='bg-linear-to-b from-red-50/70 to-white py-10 border-b border-gray-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between flex-wrap gap-4'>
            <div>
              <div className='flex items-center space-x-2 text-xs font-bold text-red-600 mb-2'>
                <button onClick={() => onNavigate?.('hero')} className='hover:underline cursor-pointer'>
                  হোম
                </button>
                <span>/</span>
                <span className='text-gray-600'>টার্ফ বুকিং</span>
              </div>
              <h1 className='text-3xl sm:text-4xl font-black text-gray-950 tracking-tight flex items-center'>
                <CalendarCheck className='w-8 h-8 mr-3 text-red-600' />
                অনলাইন টার্ফ স্লট বুকিং
              </h1>
              <p className='mt-2 text-sm sm:text-base text-gray-600'>
                তারিখ ও সময় স্লট নির্বাচন করে বিকাশ, নগদ বা রকেটের মাধ্যমে কনফার্ম করুন।
              </p>
            </div>

            {/* Previous Booking Search Button */}
            <button
              onClick={onOpenSearch}
              className='inline-flex items-center px-4 py-2.5 bg-white text-gray-800 hover:text-red-600 text-xs font-bold rounded-2xl border border-gray-300 shadow-xs hover:border-red-400 transition-all cursor-pointer'
            >
              <Search className='w-4 h-4 mr-2 text-red-600' />
              পূর্বের বুকিং খুঁজুন ও রসিদ প্রিন্ট করুন
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Booking Flow Component */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <TurfBookingFlow settings={settings} turfInfo={turfInfo} initialDate={initialDate} />
      </div>

      {/* 3. Booking Guidelines & Help Box */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white p-6 rounded-3xl border border-gray-200 shadow-xs'>
            <div className='w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4'>
              <CreditCard className='w-5 h-5' />
            </div>
            <h3 className='text-sm font-black text-gray-900 mb-2'>অগ্রিম পেমেন্ট নিয়ম</h3>
            <p className='text-xs text-gray-600 leading-relaxed'>
              স্লট নিশ্চিত করতে ন্যূনতম ৫০০ টাকা বা পূর্ণ ফি বিকাশ/নগদে সেন্ড মানি করে ট্রানজাকশন আইডি ও নম্বর প্রদান
              করুন।
            </p>
          </div>

          <div className='bg-white p-6 rounded-3xl border border-gray-200 shadow-xs'>
            <div className='w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4'>
              <CheckCircle2 className='w-5 h-5' />
            </div>
            <h3 className='text-sm font-black text-gray-900 mb-2'>তাৎক্ষণিক কনফার্মেশন</h3>
            <p className='text-xs text-gray-600 leading-relaxed'>
              ফর্ম পূরণ সম্পন্ন হওয়ার সাথে সাথে ডিজিটাল রসিদ ও বুকিং কোড স্ক্রিনে দেখতে পাবেন যা সংরক্ষণ করবেন।
            </p>
          </div>

          <div className='bg-white p-6 rounded-3xl border border-gray-200 shadow-xs'>
            <div className='w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4'>
              <PhoneCall className='w-5 h-5' />
            </div>
            <h3 className='text-sm font-black text-gray-900 mb-2'>জরুরি প্রয়োজনে সহায়তা</h3>
            <p className='text-xs text-gray-600 leading-relaxed'>
              বুকিং সংক্রান্ত যেকোনো প্রশ্নে আমাদের সরাসরি কল করতে পারেন:{' '}
              <strong className='text-red-600'>{settings?.phone}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
