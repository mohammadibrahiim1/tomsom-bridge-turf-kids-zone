import React from 'react';
import {
  CreditCard,
  Sparkles,
  ShieldCheck,
  CalendarCheck,
  ArrowRight,
  Clock,
  Tag,
  HelpCircle,
  PhoneCall,
} from 'lucide-react';
import type { WebsiteSettings, TimeSlot, SpecialOffer } from '../../../types';
import { PricingSection } from '../../../components/PricingSection';

export interface PricingPageProps {
  settings?: WebsiteSettings;
  slots?: any[];
  offers?: any[];
  onNavigate?: (page: string) => void;
  onOpenBooking?: (date?: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ settings, slots, offers, onNavigate, onOpenBooking }) => {
  return (
    <div className='space-y-12 pb-16'>
      {/* 1. Dedicated Header */}
      <div className='bg-gradient-to-b from-red-50/70 to-white py-12 border-b border-gray-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center space-x-2 text-xs font-bold text-red-600 mb-3'>
            <button onClick={() => onNavigate?.('hero')} className='hover:underline cursor-pointer'>
              হোম
            </button>
            <span>/</span>
            <span className='text-gray-600'>মূল্য তালিকা</span>
          </div>

          <div className='max-w-3xl'>
            <span className='inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 mb-3'>
              <CreditCard className='w-3.5 h-3.5 mr-1' />
              স্বচ্ছ ও সাশ্রয়ী রেট
            </span>
            <h1 className='text-3xl sm:text-5xl font-black text-gray-950 tracking-tight'>
              টার্ফ ও কিডস জোন মূল্য তালিকা
            </h1>
            <p className='mt-4 text-base sm:text-lg text-gray-600 leading-relaxed'>
              দিনের ম্যাচ, ফ্লাডলাইট নাইট ম্যাচ, কিডস জোনের টিকিট এবং কর্পোরেট টুর্নামেন্ট প্যাকেজের সম্পূর্ণ বিবরণ।
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Pricing Cards Component */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <PricingSection settings={settings} slots={slots} offers={offers} onBookNowClick={onOpenBooking} />
      </div>

      {/* 3. Special Discounts & Coupon Code Showcase */}
      {(offers?.length ?? 0) > 0 && (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='bg-white rounded-3xl p-8 border border-red-200 shadow-sm space-y-6'>
            <h2 className='text-xl font-black text-gray-900 flex items-center'>
              <Tag className='w-5 h-5 mr-2 text-red-600' />
              চলমান ডিসকাউন্ট অফারসমূহ
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {offers?.map((offer) => (
                <div
                  key={offer.id}
                  className='p-6 bg-gradient-to-br from-red-50 to-white rounded-2xl border border-red-100 flex flex-col justify-between'
                >
                  <div className='space-y-2'>
                    <span className='inline-block px-2.5 py-0.5 bg-red-600 text-white rounded text-2xs font-bold'>
                      {offer.isActive ? 'সক্রিয় অফার' : 'আসন্ন'}
                    </span>
                    <h3 className='text-lg font-black text-gray-900'>{offer.title}</h3>
                    <p className='text-xs text-gray-600 leading-relaxed'>{offer.description}</p>
                  </div>

                  {offer.code && (
                    <div className='mt-4 pt-3 border-t border-red-100 flex items-center justify-between'>
                      <span className='text-xs font-bold text-gray-600'>কুপন কোড:</span>
                      <code className='bg-white border border-red-200 text-red-600 font-mono font-black px-3 py-1 rounded-lg text-xs shadow-2xs'>
                        {offer.code}
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Payment Terms & Refund Policy */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-gray-50 rounded-3xl p-8 border border-gray-200 space-y-4'>
          <h3 className='text-base font-black text-gray-900 flex items-center'>
            <HelpCircle className='w-5 h-5 mr-2 text-red-600' />
            পেমেন্ট ও রিফান্ড সংক্রান্ত নিয়মাবলি
          </h3>
          <ul className='space-y-2 text-xs text-gray-600 list-disc list-inside leading-relaxed'>
            <li>অনলাইনে অগ্রিম পরিশোধিত ফি বুকিং চূড়ান্ত করার পর গণ্য করা হয়।</li>
            <li>
              ম্যাচ শুরুর অন্তত ৬ ঘণ্টা পূর্বে বুকিং বাতিল করলে সম্পূর্ণ টাকা রিফান্ড বা অন্য দিনে রিশিডিউল করা সম্ভব।
            </li>
            <li>
              প্রাকৃতিক দুর্যোগ বা প্রচণ্ড বৃষ্টির কারণে খেলা অসম্ভব হলে সম্পূর্ণ রিফান্ড বা বিকল্প স্লট দেওয়া হবে।
            </li>
            <li>পেমেন্টের রসিদটি খেলায় প্রবেশের পূর্বে টার্ফ ম্যানেজমেন্টকে দেখাতে হবে।</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
