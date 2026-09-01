import React from 'react';
import { PhoneCall, MapPin, Mail, Clock, MessageCircle, Navigation, CheckCircle2, Send } from 'lucide-react';
import type { WebsiteSettings } from '../types';
import { ContactSection } from '../components/ContactSection';

interface ContactPageProps {
  settings?: WebsiteSettings;
  onNavigate?: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings, onNavigate }) => {
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
            <span className='text-gray-600'>যোগাযোগ</span>
          </div>

          <div className='max-w-3xl'>
            <span className='inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 mb-3'>
              <PhoneCall className='w-3.5 h-3.5 mr-1' />
              যোগাযোগ ও সহায়তা
            </span>
            <h1 className='text-3xl sm:text-5xl font-black text-gray-950 tracking-tight'>আমাদের সাথে যোগাযোগ করুন</h1>
            <p className='mt-4 text-base sm:text-lg text-gray-600 leading-relaxed'>
              স্লট বুকিং, টুর্নামেন্ট আয়োজন, কিডস জোন পার্টি বা যেকোনো তথ্যের জন্য সরাসরি কল বা বার্তা পাঠান।
            </p>
          </div>
        </div>
      </div>

      {/* 2. Contact Section with Map & Form */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <ContactSection settings={settings} />
      </div>

      {/* 3. Directions & Transportation Help */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='bg-gray-50 rounded-3xl p-8 border border-gray-200 space-y-6'>
          <div className='border-b border-gray-200 pb-4'>
            <h2 className='text-xl font-black text-gray-900 flex items-center'>
              <Navigation className='w-5 h-5 mr-2 text-red-600' />
              কীভাবে পৌঁছাবেন (যাতায়াত নির্দেশিকা)
            </h2>
            <p className='text-xs text-gray-600 mt-1'>
              কুমিল্লা শহরের যেকোনো স্থান থেকে সহজে টমছম ব্রিজ টার্ফে আসার উপায়:
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-700'>
            <div className='bg-white p-5 rounded-2xl border border-gray-200 space-y-2'>
              <span className='font-bold text-red-600 text-sm'>১. কান্দিরপাড় থেকে</span>
              <p className='leading-relaxed'>
                কান্দিরপাড় থেকে টমছম ব্রিজ রোডের অটো বা রিকশা দিয়ে সরাসরি মাজার গেটের সামনে নেমে ১ মিনিট হেঁটে টার্ফে
                পৌঁছানো যায়।
              </p>
            </div>

            <div className='bg-white p-5 rounded-2xl border border-gray-200 space-y-2'>
              <span className='font-bold text-red-600 text-sm'>২. পদুয়ার বাজার / বিশ্বরোড থেকে</span>
              <p className='leading-relaxed'>
                বিশ্বরোড থেকে সিএনজি বা অটোতে টমছম ব্রিজ জংশনে নেমে আশরাফপুর মাজার গেট সংলগ্ন মূল গেটে আসুন।
              </p>
            </div>

            <div className='bg-white p-5 rounded-2xl border border-gray-200 space-y-2'>
              <span className='font-bold text-red-600 text-sm'>৩. নিজস্ব বাহন ও পার্কিং</span>
              <p className='leading-relaxed'>
                টার্ফের নিজস্ব চত্বরে প্রাইভেট কার ও মোটরসাইকেলের জন্য পর্যাপ্ত ও নিরাপদ পার্কিং সুবিধা রয়েছে।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
