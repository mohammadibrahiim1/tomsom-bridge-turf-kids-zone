import React, { useState } from 'react';
import {
  Gamepad2,
  Sparkles,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Users,
  Heart,
  PhoneCall,
  Send,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import type { WebsiteSettings, KidsZoneInfo } from '../../../types';
import { KidsZoneSection } from '../../../components/KidsZoneSection';

interface KidsZonePageProps {
  settings?: WebsiteSettings;
  kidsZoneInfo?: KidsZoneInfo;
  onNavigate?: (page?: string) => void;
}

export const KidsZonePage: React.FC<KidsZonePageProps> = ({ settings, kidsZoneInfo, onNavigate }) => {
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [kidsCount, setKidsCount] = useState('1');
  const [partyDate, setPartyDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className='space-y-12 pb-16'>
      {/* 1. Dedicated Header */}
      <div className='bg-gradient-to-b from-amber-50/70 to-white py-12 border-b border-gray-100'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center space-x-2 text-xs font-bold text-amber-600 mb-3'>
            {onNavigate && (
              <button onClick={() => onNavigate('hero')} className='hover:underline cursor-pointer'>
                হোম
              </button>
            )}
            <span>/</span>
            <span className='text-gray-600'>কিডস জোন</span>
          </div>

          <div className='max-w-3xl'>
            <span className='inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-3'>
              <Gamepad2 className='w-3.5 h-3.5 mr-1' />
              শিশুদের আনন্দের জগৎ
            </span>
            <h1 className='text-3xl sm:text-5xl font-black text-gray-950 tracking-tight'>
              {kidsZoneInfo?.title || 'টমছম ব্রিজ কিডস জোন'}
            </h1>
            <p className='mt-4 text-base sm:text-lg text-gray-600 leading-relaxed'>
              {kidsZoneInfo?.subtitle || 'শিশুদের শারীরিক ও মানসিক বিকাশে চমৎকার সব আধুনিক রাইডস ও বিনোদন সুবিধা।'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Kids Zone Component */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <KidsZoneSection kidsZoneInfo={kidsZoneInfo} settings={settings} />
      </div>

      {/* 3. Birthday & Group Party Celebration Booking Form */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-white rounded-3xl p-8 border border-amber-200 shadow-sm'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 items-center'>
            <div className='space-y-4'>
              <span className='inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold'>
                <Sparkles className='w-3.5 h-3.5 mr-1 text-amber-600' />
                বার্থডে পার্টি ও ফ্যামিলি ইভেন্ট
              </span>
              <h2 className='text-2xl sm:text-3xl font-black text-gray-950'>
                সন্তানের জন্মদিন পালন করুন আমাদের কিডস জোনে!
              </h2>
              <p className='text-sm text-gray-600 leading-relaxed'>
                বাচ্চাদের জন্মদিনের উৎসব, স্কুল পিকনিক বা ফ্যামিলি গ্যাদারিংয়ের জন্য কিডস জোন ও স্পেশাল লাউঞ্জ রিজার্ভ
                করতে নিচে অনুরোধ পাঠান।
              </p>

              <div className='space-y-2.5 pt-2'>
                <div className='flex items-center space-x-3 text-xs font-bold text-gray-800'>
                  <CheckCircle2 className='w-4 h-4 text-amber-500 shrink-0' />
                  <span>স্পেশাল ডেকোরেশন ও সাউন্ড সিস্টেমের সুবিধা</span>
                </div>
                <div className='flex items-center space-x-3 text-xs font-bold text-gray-800'>
                  <CheckCircle2 className='w-4 h-4 text-amber-500 shrink-0' />
                  <span>বাচ্চাদের জন্য আনলিমিটেড রাইড অ্যাক্সেস প্যাকেজ</span>
                </div>
                <div className='flex items-center space-x-3 text-xs font-bold text-gray-800'>
                  <CheckCircle2 className='w-4 h-4 text-amber-500 shrink-0' />
                  <span>অভিভাবকদের জন্য আরামদায়ক বসার লাউঞ্জ ও ক্যাফেটারিয়া</span>
                </div>
              </div>

              <div className='pt-4 flex items-center space-x-3'>
                <a
                  href={`tel:${settings?.phone}`}
                  className='inline-flex items-center px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs'
                >
                  <PhoneCall className='w-3.5 h-3.5 mr-1.5' />
                  কল: {settings?.phone}
                </a>
                <a
                  href={`https://wa.me/${settings?.whatsapp?.replace(/\D/g, '')}`}
                  target='_blank'
                  rel='noreferrer'
                  className='inline-flex items-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs'
                >
                  <MessageCircle className='w-3.5 h-3.5 mr-1.5' />
                  হোয়াটসঅ্যাপ মেসেজ
                </a>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className='bg-amber-50/60 p-6 sm:p-8 rounded-3xl border border-amber-100'>
              {submitted ? (
                <div className='text-center py-8 space-y-3'>
                  <div className='w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto'>
                    <CheckCircle2 className='w-8 h-8' />
                  </div>
                  <h3 className='text-lg font-black text-gray-900'>ধন্যবাদ! অনুরোধ গ্রহণ করা হয়েছে</h3>
                  <p className='text-xs text-gray-600 max-w-sm mx-auto'>
                    আমরা খুব শীঘ্রই আপনার সাথে যোগাযোগ করে পার্টি প্যাকেজ ও সময় চূড়ান্ত করব।
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className='px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl'
                  >
                    আরেকটি অনুরোধ পাঠান
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className='space-y-4'>
                  <h3 className='text-base font-black text-gray-900 border-b border-amber-200 pb-2'>
                    ইভেন্ট / পার্টি ইনকোয়ারি ফর্ম
                  </h3>

                  <div>
                    <label className='block text-xs font-bold text-gray-700 mb-1'>অভিভাবকের নাম *</label>
                    <input
                      type='text'
                      required
                      placeholder='আপনার নাম'
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className='w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold focus:border-amber-500 outline-hidden'
                    />
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                    <div>
                      <label className='block text-xs font-bold text-gray-700 mb-1'>মোবাইল নম্বর *</label>
                      <input
                        type='tel'
                        required
                        placeholder='017XXXXXXXX'
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        className='w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold focus:border-amber-500 outline-hidden'
                      />
                    </div>
                    <div>
                      <label className='block text-xs font-bold text-gray-700 mb-1'>বাচ্চার সংখ্যা *</label>
                      <input
                        type='number'
                        min='1'
                        required
                        value={kidsCount}
                        onChange={(e) => setKidsCount(e.target.value)}
                        className='w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold focus:border-amber-500 outline-hidden'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-xs font-bold text-gray-700 mb-1'>সম্ভাব্য তারিখ</label>
                    <input
                      type='date'
                      value={partyDate}
                      onChange={(e) => setPartyDate(e.target.value)}
                      className='w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold focus:border-amber-500 outline-hidden'
                    />
                  </div>

                  <div>
                    <label className='block text-xs font-bold text-gray-700 mb-1'>বিশেষ কোনো চাহিদা বা বার্তা</label>
                    <textarea
                      rows={2}
                      placeholder='ইভেন্টের বিস্তারিত বা কোনো প্রশ্ন থাকলে লিখুন...'
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className='w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold focus:border-amber-500 outline-hidden'
                    />
                  </div>

                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center cursor-pointer'
                  >
                    {isSubmitting ? (
                      <Loader2 className='w-5 h-5 animate-spin' />
                    ) : (
                      <>
                        <Send className='w-4 h-4 mr-2' />
                        অনুরোধ পাঠান
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
