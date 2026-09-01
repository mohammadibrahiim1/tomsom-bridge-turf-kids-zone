import React from 'react';
import { ShieldCheck, Heart, Sparkles, Phone, MessageCircle } from 'lucide-react';
import type { KidsZoneInfo, WebsiteSettings } from '../types';

interface KidsZoneSectionProps {
  kidsZoneInfo?: KidsZoneInfo | null;
  settings?: WebsiteSettings | null;
}

export const KidsZoneSection: React.FC<KidsZoneSectionProps> = ({ kidsZoneInfo, settings }) => {
  const primaryImage =
    (kidsZoneInfo?.images && kidsZoneInfo.images[0]) ||
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80';
  const ageLimit = kidsZoneInfo?.ageLimit || '২ বছর থেকে ১০ বছর';
  const entryFee = kidsZoneInfo?.entryFee || 150;
  const openingTime = kidsZoneInfo?.openingTime || '০৩:০০ PM';
  const closingTime = kidsZoneInfo?.closingTime || '১০:০০ PM';
  const featuresList = kidsZoneInfo?.features || [
    'নরম প্যাডেড সফট প্লে এরিয়া',
    'স্লাইড, বল পিট ও ট্রাম্পোলিন',
    'নিরাপদ রাবার ফ্লোরিং',
    'সার্বক্ষণিক সিসিটিভি ও দক্ষ তত্ত্বাবধায়ক',
    'অভিভাবকদের জন্য আরামদায়ক ওয়েটিং জোন',
  ];
  const rulesList = kidsZoneInfo?.rules || [
    'শিশুর বয়স ২ থেকে ১০ বছরের মধ্যে হতে হবে।',
    'কিডস জোনে প্রবেশের সময় মোজা (Socks) পরা বাধ্যতামূলক।',
    'বাইরের কোনো খাবার বা পানীয় কিডস জোনের খেলার স্থানে নিয়ে যাওয়া নিষেধ।',
    'অভিভাবকদের শিশুদের আচরণ ও নিরাপত্তার প্রতি খেয়াল রাখতে হবে।',
  ];

  return (
    <section id='kids-zone' className='py-20 bg-white border-b border-gray-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center max-w-3xl mx-auto mb-16 space-y-3'>
          <span className='text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3.5 py-1.5 rounded-full'>
            শিশুদের বিনোদন
          </span>
          <h2 className='text-3xl sm:text-4xl font-black text-gray-950'>টমছম ব্রিজ কিডস জোন (Kids Zone)</h2>
          <p className='text-gray-600 text-base leading-relaxed'>
            শিশুদের আনন্দময় শৈশব ও শারীরিক সক্রিয়তা বৃদ্ধিতে কুমিল্লার সবচেয়ে রঙিন ও নিরাপদ ইনডোর কিডস জোন।
          </p>
        </div>

        {/* Feature Bento Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16'>
          {/* Visual Gallery Preview */}
          <div className='lg:col-span-6 space-y-4'>
            <div className='relative rounded-2xl overflow-hidden shadow-xl border-4 border-white'>
              <img
                src={primaryImage}
                alt='টমছম ব্রিজ কিডস জোন'
                className='w-full h-80 object-cover hover:scale-105 transition-transform duration-500'
              />
              <div className='absolute top-4 left-4 bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md'>
                বয়স সীমা: {ageLimit}
              </div>
            </div>

            <div className='grid grid-cols-3 gap-3'>
              <div className='bg-red-50 p-4 rounded-xl border border-red-100 text-center'>
                <div className='text-xl font-black text-red-600'>৳{entryFee}</div>
                <div className='text-2xs font-bold text-gray-800'>এন্ট্রি ফি (১ ঘণ্টা)</div>
              </div>
              <div className='bg-red-50 p-4 rounded-xl border border-red-100 text-center'>
                <div className='text-xl font-black text-black'>{openingTime}</div>
                <div className='text-2xs font-bold text-gray-800'>শুরুর সময়</div>
              </div>
              <div className='bg-red-50 p-4 rounded-xl border border-red-100 text-center'>
                <div className='text-xl font-black text-red-600'>{closingTime}</div>
                <div className='text-2xs font-bold text-gray-800'>বন্ধের সময়</div>
              </div>
            </div>
          </div>

          {/* Attractions & Descriptions */}
          <div className='lg:col-span-6 space-y-6'>
            <div className='space-y-4'>
              <h3 className='text-2xl font-black text-gray-950'>নিরাপদ রাইডস ও রোমাঞ্চকর খেলাধুলা</h3>
              <p className='text-gray-600 text-sm leading-relaxed'>
                আমাদের কিডস জোনে রয়েছে নন-টক্সিক ও সফট ফোম ম্যাটিং করা পরিবেশ। বাচ্চারা যাতে নিরাপদে দৌড়াদৌড়ি, স্লাইডিং
                ও জাম্পিং করতে পারে তার সর্বোচ্চ ব্যবস্থা নিশ্চিত করা হয়েছে।
              </p>
            </div>

            {/* Attractions List */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              {featuresList.map((attr, idx) => (
                <div
                  key={idx}
                  className='flex items-center space-x-2.5 p-3 bg-gray-50 rounded-xl border border-gray-200'
                >
                  <Sparkles className='w-4 h-4 text-red-600 shrink-0' />
                  <span className='text-xs font-bold text-gray-800'>{attr}</span>
                </div>
              ))}
            </div>

            {/* Birthday Party Booking Banner */}
            {settings && (
              <div className='p-6 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-3xl border border-red-500 shadow-md space-y-3'>
                <div className='flex items-center space-x-2 text-white font-black text-sm'>
                  <Heart className='w-5 h-5 text-red-200 fill-red-200' />
                  <span>বার্থডে পার্টি ও ফ্যামিলি ইভেন্ট প্যাকেজ</span>
                </div>
                <p className='text-xs sm:text-sm text-white/90 leading-relaxed'>
                  সন্তানের জন্মদিন বা পারিবারিক পুনর্মিলনীর জন্য সম্পূর্ণ কিডস জোন ও টার্ফ স্পেশাল রিজার্ভেশন করতে
                  সরাসরি কল বা হোয়াটসঅ্যাপ করুন।
                </p>
                <div className='flex flex-wrap items-center gap-3 pt-2'>
                  <a
                    href={`tel:${settings.phone}`}
                    className='inline-flex items-center px-4 py-2.5 bg-white text-red-700 hover:bg-red-50 font-bold text-xs rounded-xl shadow-xs transition-colors'
                  >
                    <Phone className='w-4 h-4 mr-1.5' />
                    কল করুন: {settings.phone}
                  </a>
                  <a
                    href={`https://wa.me/${settings?.whatsapp?.replace(/\D/g, '')}`}
                    target='_blank'
                    rel='noreferrer'
                    className='inline-flex items-center px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors'
                  >
                    <MessageCircle className='w-4 h-4 mr-1.5' />
                    হোয়াটসঅ্যাপ
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Safety Guidelines for Kids Zone */}
        <div className='bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200'>
          <div className='flex items-center space-x-2 mb-4'>
            <ShieldCheck className='w-5 h-5 text-red-600' />
            <h4 className='text-base font-bold text-gray-950'>কিডস জোনের নিরাপত্তা ও অভিভাবক নির্দেশিকা</h4>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-700'>
            {rulesList.map((rule, idx) => (
              <div key={idx} className='bg-white p-3.5 rounded-xl border border-gray-200 space-y-1'>
                <span className='w-5 h-5 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center text-2xs mb-1'>
                  {idx + 1}
                </span>
                <p className='font-semibold text-gray-800'>{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
