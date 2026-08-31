import React from 'react';
import { CalendarCheck, Sparkles, MapPin, Trophy, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { HeroSectionProps } from '../landingTypes/hero.types';

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  turfInfo,
  offers,
  onOpenBooking,
  onBookNowClick,
  onNavigate,
  onExploreKidsZoneClick,
}) => {
  const handleBooking = () => {
    if (onBookNowClick) {
      onBookNowClick();
    } else if (onOpenBooking) {
      onOpenBooking();
    } else {
      const el = document.getElementById('booking');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-4', 'ring-red-500/40', 'rounded-3xl');
        setTimeout(() => el.classList.remove('ring-4', 'ring-red-500/40'), 1500);
      }
    }
  };

  const handleKidsZone = () => {
    if (onExploreKidsZoneClick) {
      onExploreKidsZoneClick();
    } else if (onNavigate) {
      onNavigate('kids-zone');
    } else {
      const el = document.getElementById('kids-zone');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id='hero-section'
      className='relative bg-gradient-to-b from-white via-red-50/20 to-white text-gray-900 border-b border-gray-200 overflow-hidden'
    >
      {/* Decorative ambient blobs */}
      <div className='absolute top-0 right-0 w-96 h-96 bg-red-100/60 rounded-full blur-3xl -z-10 pointer-events-none transform translate-x-1/3 -translate-y-1/3' />
      <div className='absolute bottom-0 left-0 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl -z-10 pointer-events-none transform -translate-x-1/3 translate-y-1/3' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 items-center'>
          {/* Left Text Column */}
          <div className='lg:col-span-7 space-y-6'>
            {/* Top Badge */}
            <div className='inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-red-200 shadow-xs'>
              <Sparkles className='w-4 h-4 text-red-600' />
              <span>{settings?.heroBadge || 'কুমিল্লার সেরা স্পোর্টস ও এন্টারটেইনমেন্ট জোন'}</span>
            </div>

            {/* Main Headline */}
            <h1 className='text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-950 leading-tight sm:leading-snug'>
              {settings?.heroHeadline || settings?.websiteNameBn || 'টমছম ব্রিজ টার্ফ ও কিডস জোন'}
            </h1>

            {/* Tagline */}
            <p className='text-xl sm:text-2xl font-bold text-red-600'>
              {settings?.tagline || 'খেলাধুলা, বিনোদন ও আনন্দের এক ঠিকানা'}
            </p>

            {/* Subheadline Description */}
            <p className='text-base sm:text-lg text-gray-700 leading-relaxed font-normal'>
              {settings?.heroSubheadLine ||
                'আন্তর্জাতিক মানের কৃত্রিম ঘাসের ফুটবল টার্ফ এবং শিশুদের জন্য নিরাপদ ও রোমাঞ্চকর কিডস জোন। মাত্র ২ মিনিটে আপনার পছন্দের স্লট বুক করুন।'}
            </p>

            {/* Action Buttons */}
            <div className='pt-2 flex flex-wrap items-center gap-3.5'>
              <button
                type='button'
                id='hero-book-now-btn'
                onClick={handleBooking}
                className='inline-flex items-center justify-center px-7 py-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-base sm:text-lg rounded-2xl shadow-lg hover:shadow-red-600/30 transition-all cursor-pointer'
              >
                <CalendarCheck className='w-5 h-5 mr-2' />
                {settings?.heroBookingBtnText || 'এখনই বুক করুন'}
                <ArrowRight className='w-4 h-4 ml-1.5' />
              </button>

              <button
                type='button'
                id='hero-kids-zone-btn'
                onClick={handleKidsZone}
                className='inline-flex items-center justify-center px-6 py-4 bg-white hover:bg-gray-50 active:scale-95 text-gray-800 font-bold text-base rounded-2xl border-2 border-gray-300 shadow-xs hover:border-red-400 transition-all cursor-pointer'
              >
                {settings?.heroKidsBtnText || 'কিডস জোন দেখুন'}
              </button>
            </div>

            {/* Location Pill */}
            {settings?.addressBn && (
              <div className='pt-2'>
                <a
                  href={settings?.googleMapDirectLink || '#location'}
                  target='_blank'
                  rel='noreferrer'
                  className='inline-flex items-center text-xs sm:text-sm text-gray-600 hover:text-red-600 font-semibold transition-colors'
                >
                  <MapPin className='w-4 h-4 text-red-600 mr-1.5 shrink-0' />
                  <span>{settings?.addressBn}</span>
                </a>
              </div>
            )}
          </div>

          {/* Right Image Showcase Card */}
          <div className='lg:col-span-5 relative'>
            <div className='relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-gray-200'>
              <img
                src={
                  settings?.heroImage ||
                  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80'
                }
                alt='টমছম ব্রিজ টার্ফ গ্রাউন্ড'
                className='w-full h-80 sm:h-96 object-cover object-center'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent' />

              {/* Floating Live Badge */}
              <div className='absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md flex items-center space-x-2 border border-gray-100'>
                <span className='w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse' />
                <span className='text-xs font-bold text-gray-800'>অনলাইন বুকিং উন্মুক্ত</span>
              </div>

              {/* Bottom Image Info Banner */}
              <div className='absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-gray-100'>
                <div className='flex items-center justify-between'>
                  <div>
                    <span className='text-xs font-bold text-red-600 block'>টার্ফ সাইজ ও কোয়ালিটি</span>
                    <span className='text-sm font-black text-gray-900'>ফিফা স্ট্যান্ডার্ড নরম কৃত্রিম ঘাস</span>
                  </div>
                  <button
                    type='button'
                    onClick={handleBooking}
                    className='px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer'
                  >
                    স্লট বুক করুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Bento Row */}
        <div className='mt-12 pt-8 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-3.5'>
          <div className='bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-3 hover:border-red-300 transition-colors'>
            <div className='w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0'>
              <Trophy className='w-5 h-5' />
            </div>
            <div>
              <div className='text-2xs text-gray-500 font-semibold'>টার্ফ স্ট্যান্ডার্ড</div>
              <div className='text-xs sm:text-sm font-bold text-gray-900'>ফিফা অনুমোদিত ঘাস</div>
            </div>
          </div>

          <div className='bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-3 hover:border-red-300 transition-colors'>
            <div className='w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0'>
              <Clock className='w-5 h-5' />
            </div>
            <div>
              <div className='text-2xs text-gray-500 font-semibold'>স্লট সময়সীমা</div>
              <div className='text-xs sm:text-sm font-bold text-gray-900'>৫৫ মি. খেলা + ৫ মি. ইন/আউট</div>
            </div>
          </div>

          <div className='bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-3 hover:border-red-300 transition-colors'>
            <div className='w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0'>
              <Sparkles className='w-5 h-5' />
            </div>
            <div>
              <div className='text-2xs text-gray-500 font-semibold'>নাইট ম্যাচ</div>
              <div className='text-xs sm:text-sm font-bold text-gray-900'>হাই-লুমেন ফ্লাডলাইট</div>
            </div>
          </div>

          <div className='bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-3 hover:border-red-300 transition-colors'>
            <div className='w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0'>
              <ShieldCheck className='w-5 h-5' />
            </div>
            <div>
              <div className='text-2xs text-gray-500 font-semibold'>নিরাপত্তা</div>
              <div className='text-xs sm:text-sm font-bold text-gray-900'>২৪/৭ সিসিটিভি ও পার্কিং</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
