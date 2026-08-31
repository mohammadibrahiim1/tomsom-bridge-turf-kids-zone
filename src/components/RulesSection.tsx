import React from 'react';
import { ShieldCheck, AlertOctagon, Clock, RefreshCw, CheckCircle2 } from 'lucide-react';
import type { WebsiteSettings } from '../types';

interface RulesSectionProps {
  settings: WebsiteSettings;
}

export const RulesSection: React.FC<RulesSectionProps> = ({ settings }) => {
  return (
    <section id="rules" className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3.5 py-1.5 rounded-full">
            শৃঙ্খলার মানদণ্ড
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950">
            টার্ফ ও কিডস জোনের নিয়ম ও নীতিমালা
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            একটি সুন্দর, পরিচ্ছন্ন এবং পেশাদার খেলার পরিবেশ নিশ্চিত করতে অনুগ্রহ করে নিচের নিয়মগুলো মেনে চলুন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Ground & Footwear Rules */}
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-950">মাঠ ও পোশাকের নিয়ম</h3>
            <ul className="space-y-2.5 text-xs text-gray-700 leading-relaxed">
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 text-red-600 mr-2 shrink-0 mt-0.5" />
                টার্ফে শুধু <strong>টার্ফ বুট (Turf Shoes)</strong> অথবা সাধারণ স্নিকার্স পরতে হবে।
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 text-red-600 mr-2 shrink-0 mt-0.5" />
                মেটাল স্টাড বা ধারালো বুট পরে মাঠে নামা সম্পূর্ণ নিষিদ্ধ।
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 text-red-600 mr-2 shrink-0 mt-0.5" />
                যথাসম্ভব প্রোপার স্পোর্টস জার্সি ও ট্রাউজার পরিধান করুন।
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 text-red-600 mr-2 shrink-0 mt-0.5" />
                মাঠের ঘাস বা নেটের কোনো প্রকার ক্ষতিসাধন করা যাবে না।
              </li>
            </ul>
          </div>

          {/* Card 2: Time Discipline & Slot Management */}
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-950">সময় ও স্লটের নিয়ম</h3>
            <ul className="space-y-2.5 text-xs text-gray-700 leading-relaxed">
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 text-red-600 mr-2 shrink-0 mt-0.5" />
                প্রতিটি স্লট ৬০ মিনিটের (৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট)।
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 text-red-600 mr-2 shrink-0 mt-0.5" />
                খেলার নির্ধারিত সময়ের কমপক্ষে ১৫ মিনিট আগে মাঠে উপস্থিত থাকতে হবে।
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 text-red-600 mr-2 shrink-0 mt-0.5" />
                দেরিতে উপস্থিত হলে অতিরিক্ত সময় দাবি করা যাবে না।
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 text-red-600 mr-2 shrink-0 mt-0.5" />
                পরবর্তী দলের জন্য সময়মতো মাঠ ছেড়ে দেওয়া আবশ্যক।
              </li>
            </ul>
          </div>

          {/* Card 3: Cancellation & Refund Policy (3-day policy) */}
          <div className="bg-red-50/70 rounded-2xl p-6 sm:p-8 border-2 border-red-200 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-red-950">বাতিল ও রিফান্ড নীতি</h3>
            <ul className="space-y-2.5 text-xs text-gray-800 leading-relaxed">
              <li className="flex items-start">
                <AlertOctagon className="w-4 h-4 text-red-600 mr-2 shrink-0 mt-0.5" />
                <span className="font-bold">কমপক্ষে ৩ দিন (৭২ ঘণ্টা) পূর্বে: </span>
                বুকিং বাতিল বা সময় পরিবর্তনের জন্য কমপক্ষে ৩ দিন আগে অবহিত করতে হবে।
              </li>
              <li className="flex items-start">
                <AlertOctagon className="w-4 h-4 text-red-600 mr-2 shrink-0 mt-0.5" />
                খেলার ৩ দিনের মধ্যে বাতিলের আবেদন করলে টাকা রিফান্ড বা অ্যাডজাস্ট করা হবে না।
              </li>
              <li className="flex items-start">
                <AlertOctagon className="w-4 h-4 text-red-600 mr-2 shrink-0 mt-0.5" />
                প্রাকৃতিক দুর্যোগ বা ভারী বৃষ্টির ক্ষেত্রে কর্তৃপক্ষের সিদ্ধান্তে পরবর্তী দিন নির্ধারণ করা হবে।
              </li>
            </ul>
          </div>

        </div>

        {/* Prohibitions Bar */}
        <div className="mt-8 bg-black text-white p-6 rounded-2xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <AlertOctagon className="w-8 h-8 text-red-500 shrink-0" />
            <div>
              <div className="font-bold text-sm sm:text-base">টার্ফ ক্যাম্পাসে সম্পূর্ণ নিষিদ্ধ:</div>
              <div className="text-xs text-gray-400">
                ধূমপান, পান-সুপারি, বাজি-পটকা, মাদকদ্রব্য, খালি পায়ে খেলা এবং মাঠে বাইরের খাবার ও সফট ড্রিংকস নিয়ে প্রবেশ।
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-red-400 bg-red-900/40 px-3 py-1.5 rounded-full border border-red-500/30 shrink-0">
            সিসিটিভি দ্বারা সার্বক্ষণিক নিয়ন্ত্রিত
          </span>
        </div>

      </div>
    </section>
  );
};
