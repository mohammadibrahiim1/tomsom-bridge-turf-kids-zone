import React from 'react';
import { Trophy, Info } from 'lucide-react';
import type { WebsiteSettings, TurfInfo, Facility } from '../../../types';
import { AboutSection } from '../../../components/AboutSection';
import { FacilitiesSection } from '../components/FacilitiesSection';
import { RulesSection } from '../../../components/RulesSection';

interface AboutPageProps {
  settings?: WebsiteSettings;
  turfInfo?: TurfInfo;
  facilities?: Facility[];
  onNavigate?: (page: string) => void;
  onOpenBooking?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  settings,
  turfInfo,
  facilities = [],
  onNavigate,
  onOpenBooking,
}) => {
  return (
    <div className='space-y-12 pb-16'>
      {/* 1. Dedicated Page Header */}
      <div className='bg-gradient-to-b from-red-50/70 to-white py-12 border-b border-gray-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center space-x-2 text-xs font-bold text-red-600 mb-3'>
            <button onClick={() => onNavigate?.('hero')} className='hover:underline cursor-pointer'>
              হোম
            </button>
            <span>/</span>
            <span className='text-gray-600'>আমাদের সম্পর্কে</span>
          </div>

          <div className='max-w-3xl'>
            <span className='inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 mb-3'>
              <Info className='w-3.5 h-3.5 mr-1' />
              প্রতিষ্ঠानের পরিচিতি
            </span>
            <h1 className='text-3xl sm:text-5xl font-black text-gray-950 tracking-tight'>
              {turfInfo?.name || 'টমছম ব্রিজ টার্ফ ও কিডস জোন'}
            </h1>
            <p className='mt-4 text-base sm:text-lg text-gray-600 leading-relaxed'>
              কুমিল্লার প্রাণকেন্দ্র টমছম ব্রিজে অবস্থিত আধুনিক ও প্রফেশনাল কৃত্রিম ঘাসের খেলার মাঠ এবং শিশুদের নিরাপদ
              বিনোদন কেন্দ্র।
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main About Section Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <AboutSection turfInfo={turfInfo} settings={settings} />
      </div>

      {/* 3. Detailed Specifications Grid */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-8'>
          <div className='border-b border-gray-100 pb-6'>
            <h2 className='text-2xl font-black text-gray-900 flex items-center'>
              <Trophy className='w-6 h-6 mr-2 text-red-600' />
              টারফের বিশেষ সুবিধাসমূহ ও স্পেসিফিকেশন
            </h2>
            <p className='text-sm text-gray-600 mt-1'>
              খেলোয়াড়দের স্বাচ্ছন্দ্য ও নিরাপত্তার দিকে শতভাগ নজর দিয়ে টার্ফটি প্রস্তুত করা হয়েছে।
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='p-5 bg-gray-50 rounded-2xl border border-gray-200'>
              <div className='text-xs text-red-600 font-bold uppercase mb-1'>ফিফা গ্রাস কোয়ালিটি</div>
              <div className='text-lg font-black text-gray-900 mb-2'>{turfInfo?.grassType || 'N/A'}</div>
              <p className='text-xs text-gray-600'>
                ৫০ মিমি হাই-ডেনসিটি ফাইবার যা প্রাকৃতিক ঘাসের অনুভূতি দেয় ও পড়ে গেলে আঘাত লাগার ঝুঁকি কমায়।
              </p>
            </div>

            <div className='p-5 bg-gray-50 rounded-2xl border border-gray-200'>
              <div className='text-xs text-red-600 font-bold uppercase mb-1'>মাঠের পরিমাপ</div>
              <div className='text-lg font-black text-gray-900 mb-2'>{turfInfo?.size || 'N/A'}</div>
              <p className='text-xs text-gray-600'>
                ৭-এ-সাইড ও ৮-এ-সাইড ফুটবল এবং শর্ট বাউন্ডারি বক্স ক্রিকেটের জন্য আইডিয়াল ফিল্ড।
              </p>
            </div>

            <div className='p-5 bg-gray-50 rounded-2xl border border-gray-200'>
              <div className='text-xs text-red-600 font-bold uppercase mb-1'>ফ্লাডলাইট ও নাইট ম্যাচ</div>
              <div className='text-lg font-black text-gray-900 mb-2'>{turfInfo?.floodlights || 'N/A'}</div>
              <p className='text-xs text-gray-600'>
                হাই-লুমেন অ্যান্টি-গ্লেয়ার এলইডি লাইট এবং সার্বক্ষণিক স্ট্যান্ডবাই জেনারেটর ব্যাকআপ।
              </p>
            </div>

            <div className='p-5 bg-gray-50 rounded-2xl border border-gray-200'>
              <div className='text-xs text-red-600 font-bold uppercase mb-1'>সময়সূচি ও সার্ভিস</div>
              <div className='text-lg font-black text-gray-900 mb-2'>{turfInfo?.openingHours || 'N/A'}</div>
              <p className='text-xs text-gray-600'>
                সপ্তাহের ৭ দিন সকাল থেকে মধ্যরাত পর্যন্ত নিরবচ্ছিন্ন খেলার সুযোগ ও সার্বক্ষণিক কাস্টমার সাপোর্ট।
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Complete Facilities */}
      {facilities.length > 0 && (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <FacilitiesSection facilities={facilities} />
        </div>
      )}

      {/* 5. Rules & Code of Conduct */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <RulesSection settings={settings} />
      </div>

      {/* 6. Ready to Play CTA */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-red-600 rounded-3xl p-8 sm:p-10 text-white text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl'>
          <div className='text-left space-y-1'>
            <h3 className='text-2xl font-black'>আমাদের মাঠে খেলতে আগ্রহী?</h3>
            <p className='text-red-100 text-sm'>অনলাইনে সরাসরি স্লট বুক করে আপনার খেলার সময় নির্ধারণ করুন।</p>
          </div>
          <button
            onClick={() => onOpenBooking?.()}
            className='px-8 py-3.5 bg-white text-red-600 hover:bg-red-50 text-sm font-black rounded-2xl shadow-lg transition-all cursor-pointer whitespace-nowrap'
          >
            এখনই স্লট বুক করুন
          </button>
        </div>
      </div>
    </div>
  );
};
