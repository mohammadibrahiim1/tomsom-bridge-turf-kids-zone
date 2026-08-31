import React from 'react';
import { Trophy, ShieldCheck, Zap, Users } from 'lucide-react';
import type { TurfInfo, WebsiteSettings } from '../types';

interface AboutSectionProps {
  turfInfo?: TurfInfo | null;
  settings?: WebsiteSettings | null;
  onOpenBooking?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ turfInfo, settings, onOpenBooking }) => {
  const primaryImage = turfInfo?.primaryImage || (turfInfo?.bannerImages && turfInfo.bannerImages[0]) || 'https://images.unsplash.com/photo-1529900245584-8898151b30bc?auto=format&fit=crop&w=800&q=80';
  const turfGrass = turfInfo?.turfType || 'FIFA অনুমোদিত নন-অ্যাব্রেসিভ আর্টিফিশিয়াল গ্রাস';

  const handleBooking = onOpenBooking || (() => {
    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });

  return (
    <section id="about" className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3.5 py-1.5 rounded-full">
            আমাদের পরিচিতি
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950">
            টমছম ব্রিজ টার্ফ ও কিডস জোন সম্পর্কে
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            কুমিল্লার ক্রীড়াপ্রেমী তরুণ এবং পরিবারের সদস্যদের বিনোদনের এক আদর্শ ও নিরাপদ মিলনমেলা।
          </p>
        </div>

        {/* Grid Layout: Text & Visual Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Bento */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src={primaryImage}
                alt="টমছম ব্রিজ টার্ফ গ্রাউন্ড"
                className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md text-gray-900 p-3.5 rounded-2xl border border-gray-100 shadow-md">
                <div className="text-xs text-red-600 font-bold">ঘাসের ধরন</div>
                <div className="text-sm font-black">{turfGrass}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-1">
                <div className="text-2xl font-black text-red-600">১০০%</div>
                <div className="text-xs font-bold text-gray-900">আন্তর্জাতিক মানসম্পন্ন মাঠ</div>
                <p className="text-2xs text-gray-500">ইনজুরি মুক্ত নরম রাবার ইনফিল সহ প্রফেশনাল গ্রাস</p>
              </div>

              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-1">
                <div className="text-2xl font-black text-black">২৪/৭</div>
                <div className="text-xs font-bold text-gray-900">নিরাপদ ও সুসজ্জিত ক্যাম্পাস</div>
                <p className="text-2xs text-gray-500">সিসিটিভি ও সার্বক্ষণিক নিরাপত্তা কর্মী</p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
              <p>
                <strong className="text-gray-950">টমছম ব্রিজ টার্ফ ও কিডস জোন</strong> কুমিল্লার প্রাণকেন্দ্র মধ্য আশরাফপুর, মাজার গেট (টমসন ব্রিজ সংলগ্ন) এলাকায় অবস্থিত একটি পূর্ণাঙ্গ স্পোর্টস ও ফ্যামিলি বিনোদন কেন্দ্র।
              </p>
              <p>
                আমরা ফুটবলপ্রেমীদের জন্য নিয়ে এসেছি বিশ্বমানের কৃত্রিম ঘাস, চমৎকার ড্রেনেজ ব্যবস্থা এবং চোখ ধাঁধানো এলইডি ফ্লাডলাইট যাতে রাতের বেলাতেও দিনের আলোর মতো ফুটবলের আনন্দ উপভোগ করা যায়।
              </p>
              <p>
                পাশাপাশি শিশুদের শারীরিক ও মানসিক বিকাশের কথা বিবেচনা করে তৈরি করা হয়েছে আধুনিক রাইড সমৃদ্ধ <strong>কিডস জোন</strong>।
              </p>
            </div>

            {/* Core Values / Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start space-x-3 p-3 bg-red-50/50 rounded-xl border border-red-100">
                <Trophy className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-950">ফিফা কোয়ালিটি টার্ফ</h4>
                  <p className="text-2xs text-gray-600">খেলোয়াড়দের পায়ের গ্রিপ ও নিরাপত্তার নিখুঁত ভারসাম্য।</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-red-50/50 rounded-xl border border-red-100">
                <Zap className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-950">নাইট ম্যাচ সুবিধা</h4>
                  <p className="text-2xs text-gray-600">উচ্চ ক্ষমতাসম্পন্ন ফ্লাডলাইটে রাতের ফুটবল।</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-red-50/50 rounded-xl border border-red-100">
                <Users className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-950">ফ্যামিলি ফ্রেন্ডলি পরিবেশ</h4>
                  <p className="text-2xs text-gray-600">পরিবার ও সন্তানদের নিয়ে সময় কাটানোর নিরাপদ স্থান।</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-red-50/50 rounded-xl border border-red-100">
                <ShieldCheck className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-950">ফার্স্ট এইড ও নিরাপত্তা</h4>
                  <p className="text-2xs text-gray-600">জরুরি প্রাথমিক চিকিৎসা ও সার্বক্ষণিক নজরদারি।</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleBooking}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                আজই আপনার স্লট বুক করুন
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
