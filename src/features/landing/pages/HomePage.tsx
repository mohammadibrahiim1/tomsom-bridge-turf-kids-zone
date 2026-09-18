import React from 'react';
import { Trophy, Sparkles, ArrowRight, CalendarCheck, Gamepad2, ChevronRight, PhoneCall } from 'lucide-react';

import { HeroSection } from '../components/HeroSection';
import { QuickBookingBar } from '../components/QuickBookingBar';
import { FacilitiesSection } from '../components/FacilitiesSection';
import { ReviewsSection } from '../components/ReviewsSection';
import { FAQSection } from '../../../components/FAQSection';
import { HomePageProps } from '../landingTypes/home.types';

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  turfInfo,
  kidsZoneInfo,
  facilities = [],
  reviews = [],
  faqs = [],
  offers = [],
  slots = [],
  selectedDate,
  onDateChange,
  onNavigate,
  onOpenBooking,
}) => {
  // Safe calculation for available slots
  const availableSlotsCount = slots.filter((s) => s?.status === 'AVAILABLE').length;

  // Active promo offer filtering
  const activeOffer = offers.find((o) => o?.isActive);

  return (
    <div className='space-y-16 pb-12'>
      {/* 1. Hero Section */}
      <HeroSection
        settings={settings}
        turfInfo={turfInfo}
        offers={offers}
        onNavigate={onNavigate}
        onBookNowClick={() => onOpenBooking?.(selectedDate)}
        onExploreKidsZoneClick={() => onNavigate?.('kids-zone')}
      />

      {/* 2. Quick Booking Bar */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6'>
        <QuickBookingBar
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          availableCount={availableSlotsCount}
          onBookClick={() => onOpenBooking?.(selectedDate)}
        />
      </div>

      {/* 3. Core Highlights / Why Choose Us */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center max-w-3xl mx-auto mb-12'>
          <span className='inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700 mb-3'>
            <Sparkles className='w-3.5 h-3.5 mr-1 text-red-600' />
            কেন আমরা সেরা
          </span>
          <h2 className='text-2xl sm:text-4xl font-black text-gray-950 tracking-tight'>
            কুমিল্লার সেরা স্পোর্টস ও ফ্যামিলি এন্টারটেইনমেন্ট
          </h2>
          <p className='text-gray-600 text-sm sm:text-base mt-3'>
            টমছম ব্রিজে আন্তর্জাতিক মানের ফিফা অনুমোদিত টার্ফ ও নিরাপদ আধুনিক কিডস জোন।
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Card 1 */}
          <div className='bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-red-300 group'>
            <div className='w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform'>
              <Trophy className='w-7 h-7' />
            </div>
            <h3 className='text-lg font-black text-gray-900 mb-2'>আন্তর্জাতিক মানের টার্ফ</h3>
            <p className='text-sm text-gray-600 leading-relaxed'>
              ফিফা অনুমোদিত ৫০ মিমি কৃত্রিম ঘাস, ডাবল কুশন লেয়ার এবং হাই-লুমেন এলইডি ফ্লাডলাইট যা ইনজুরি মুক্ত ও চমৎকার
              খেলার অভিজ্ঞতা নিশ্চিত করে।
            </p>
            <button
              onClick={() => onNavigate?.('about')}
              className='mt-4 inline-flex items-center text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer'
            >
              বিস্তারিত দেখুন <ArrowRight className='w-3.5 h-3.5 ml-1' />
            </button>
          </div>

          {/* Card 2 */}
          <div className='bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-red-300 group'>
            <div className='w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform'>
              <Gamepad2 className='w-7 h-7' />
            </div>
            <h3 className='text-lg font-black text-gray-900 mb-2'>আনন্দময় কিডস জোন</h3>
            <p className='text-sm text-gray-600 leading-relaxed'>
              শিশুদের জন্য জাম্পিং ক্যাসেল, বল পিট, ট্রাম্পোলিন ও সফট প্লে এরিয়া। সম্পূর্ণ সিসিটিভি ও ট্রেন্ড
              সুপারভাইজার দ্বারা সার্বক্ষণিক নিয়ন্ত্রিত।
            </p>
            <button
              onClick={() => onNavigate?.('kids-zone')}
              className='mt-4 inline-flex items-center text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer'
            >
              কিডস জোন রাইডস <ArrowRight className='w-3.5 h-3.5 ml-1' />
            </button>
          </div>

          {/* Card 3 */}
          <div className='bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-red-300 group'>
            <div className='w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform'>
              <CalendarCheck className='w-7 h-7' />
            </div>
            <h3 className='text-lg font-black text-gray-900 mb-2'>সহজ ও দ্রুত অনলাইন বুকিং</h3>
            <p className='text-sm text-gray-600 leading-relaxed'>
              সরাসরি ক্যালেন্ডার থেকে পছন্দমতো তারিখ ও সময় নির্বাচন করে বিকাশ, নগদ বা রকেটের মাধ্যমে মাত্র ১ মিনিটে
              নিশ্চিত করুন আপনার স্লট।
            </p>
            <button
              onClick={() => onNavigate?.('booking')}
              className='mt-4 inline-flex items-center text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer'
            >
              স্লট বুক করুন <ArrowRight className='w-3.5 h-3.5 ml-1' />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Two Main Sections Showcase (Turf + Kids Zone) */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Turf Teaser Card */}
          <div className='bg-linear-to-br from-red-50 to-white p-8 rounded-3xl border border-red-100 shadow-sm flex flex-col justify-between'>
            <div className='space-y-4'>
              <div className='inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg'>
                ফুটবল ও ক্রিকেট টার্ফ
              </div>
              <h3 className='text-2xl font-black text-gray-900'>{turfInfo?.name || 'টমছম ব্রিজ টার্ফ গ্রাউন্ড'}</h3>
              <p className='text-sm text-gray-700 leading-relaxed'>
                {turfInfo?.description ||
                  '৭-এ-সাইড ফুটবল এবং বক্স ক্রিকেটের জন্য কুমিল্লার সেরা কৃত্রিম ঘাসের গ্রাউন্ড। আন্তর্জাতিক আলো ও পরিষ্কার পরিবেশ।'}
              </p>

              <div className='grid grid-cols-2 gap-3 pt-2'>
                <div className='bg-white p-3.5 rounded-2xl border border-gray-200'>
                  <div className='text-xs text-gray-500 font-bold'>মাঠের সাইজ</div>
                  <div className='text-base font-black text-gray-900'>{turfInfo?.size || 'N/A'}</div>
                </div>
                <div className='bg-white p-3.5 rounded-2xl border border-gray-200'>
                  <div className='text-xs text-gray-500 font-bold'>ঘাসের ধরন</div>
                  <div className='text-base font-black text-gray-900'>{turfInfo?.grassType || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div className='pt-6 flex flex-wrap items-center gap-3'>
              <button
                onClick={() => onNavigate?.('booking')}
                className='px-5 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center'
              >
                <CalendarCheck className='w-4 h-4 mr-2' />
                টার্ফ স্লট বুক করুন
              </button>
              <button
                onClick={() => onNavigate?.('about')}
                className='px-4 py-3 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-xl border border-gray-200 transition-all cursor-pointer inline-flex items-center'
              >
                মাঠের সুবিধা ও নিয়ম <ChevronRight className='w-4 h-4 ml-1' />
              </button>
            </div>
          </div>

          {/* Kids Zone Teaser Card */}
          <div className='bg-linear-to-br from-amber-50 to-white p-8 rounded-3xl border border-amber-100 shadow-sm flex flex-col justify-between'>
            <div className='space-y-4'>
              <div className='inline-flex items-center px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-lg'>
                কিডস প্লে জোন ও বিনোদন
              </div>
              <h3 className='text-2xl font-black text-gray-900'>{kidsZoneInfo?.title || 'টমছম ব্রিজ কিডস জোন'}</h3>
              <p className='text-sm text-gray-700 leading-relaxed'>
                {kidsZoneInfo?.subtitle ||
                  'শিশুদের আনন্দের রাজ্য! নিরাপদ রাইডস, বার্থডে পার্টি সেলিব্রেশন ও আধুনিক খেলার সামগ্রী।'}
              </p>

              <div className='grid grid-cols-2 gap-3 pt-2'>
                <div className='bg-white p-3.5 rounded-2xl border border-gray-200'>
                  <div className='text-xs text-gray-500 font-bold'>উপযুক্ত বয়সসীমা</div>
                  <div className='text-base font-black text-gray-900'>{kidsZoneInfo?.ageRange || 'N/A'}</div>
                </div>
                <div className='bg-white p-3.5 rounded-2xl border border-gray-200'>
                  <div className='text-xs text-gray-500 font-bold'>এন্ট্রি ফি</div>
                  <div className='text-base font-black text-emerald-600'>{kidsZoneInfo?.entryFee || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div className='pt-6 flex flex-wrap items-center gap-3'>
              <button
                onClick={() => onNavigate?.('kids-zone')}
                className='px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center'
              >
                <Gamepad2 className='w-4 h-4 mr-2' />
                কিডস জোন ঘুরে দেখুন
              </button>
              <button
                onClick={() => onNavigate?.('pricing')}
                className='px-4 py-3 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-xl border border-gray-200 transition-all cursor-pointer inline-flex items-center'
              >
                মূল্য ও টিকিট প্যাকেজ <ChevronRight className='w-4 h-4 ml-1' />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Key Facilities */}
      {facilities.length > 0 && <FacilitiesSection facilities={facilities} />}

      {/* 6. Special Promo Offer Banner */}
      {activeOffer && (
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='bg-linear-to-r from-red-600 via-red-700 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6'>
            <div className='space-y-2 text-center md:text-left'>
              <span className='inline-flex items-center px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold'>
                <Sparkles className='w-3.5 h-3.5 mr-1' />
                বিশেষ অফার
              </span>
              <h3 className='text-2xl sm:text-3xl font-black'>{activeOffer.title}</h3>
              <p className='text-sm text-red-100 max-w-xl'>{activeOffer.description}</p>
              {activeOffer.code && (
                <div className='pt-2'>
                  <span className='text-xs text-red-200'>কুপন কোড: </span>
                  <code className='bg-white text-red-600 font-mono font-black px-3 py-1 rounded-lg text-sm ml-1 shadow-sm'>
                    {activeOffer.code}
                  </code>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate?.('booking')}
              className='px-6 py-3.5 bg-white text-red-600 hover:bg-red-50 text-sm font-black rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer whitespace-nowrap'
            >
              অফারটি গ্রহণ করুন
            </button>
          </div>
        </section>
      )}

      {/* 7. Reviews Section */}
      {reviews?.length > 0 && <ReviewsSection reviews={reviews} />}

      {/* 8. FAQ Section */}
      {faqs?.length > 0 && <FAQSection faqs={faqs} settings={settings} />}

      {/* 9. Bottom CTA Strip */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl'>
          <h2 className='text-2xl sm:text-4xl font-black tracking-tight'>আজই আপনার পছন্দের স্লট বুক করুন!</h2>
          <p className='text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed'>
            বন্ধুদের সাথে ফুটবল/ক্রিকেট ম্যাচ কিংবা বাচ্চাদের নিয়ে আনন্দঘন সময় কাটাতে আজই ভিজিট করুন টমছম ব্রিজ টার্ফ
            ও কিডস জোন।
          </p>
          <div className='flex flex-wrap items-center justify-center gap-4 pt-2'>
            <button
              onClick={() => onNavigate?.('booking')}
              className='px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-red-600/30 transition-all cursor-pointer inline-flex items-center'
            >
              <CalendarCheck className='w-5 h-5 mr-2' />
              অনলাইন টার্ফ বুকিং
            </button>
            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className='px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-2xl border border-slate-700 transition-all cursor-pointer inline-flex items-center'
              >
                <PhoneCall className='w-4 h-4 mr-2 text-red-400' />
                সরাসরি কল: {settings.phone}
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
