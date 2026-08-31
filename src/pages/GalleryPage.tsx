import React from 'react';
import { 
  Camera, 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  CalendarCheck,
  Share2
} from 'lucide-react';
import type { WebsiteSettings, GalleryItem } from '../types';
import { GallerySection } from '../components/GallerySection';

interface GalleryPageProps {
  settings: WebsiteSettings;
  gallery: GalleryItem[];
  onNavigate: (page: string) => void;
  onOpenBooking: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  settings,
  gallery,
  onNavigate,
  onOpenBooking,
}) => {
  return (
    <div className="space-y-12 pb-16">
      {/* 1. Dedicated Header */}
      <div className="bg-gradient-to-b from-red-50/70 to-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-xs font-bold text-red-600 mb-3">
            <button onClick={() => onNavigate('hero')} className="hover:underline cursor-pointer">
              হোম
            </button>
            <span>/</span>
            <span className="text-gray-600">গ্যালারি</span>
          </div>

          <div className="max-w-3xl">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 mb-3">
              <Camera className="w-3.5 h-3.5 mr-1" />
              ছবির গ্যালারি
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight">
              টার্ফ ও কিডস জোনের স্মরণীয় মুহূর্ত
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              দিনের ম্যাচ, নাইট ম্যাচ, আলো ঝলমলে ফ্লাডলাইট এবং শিশুদের আনন্দের কিছু অসাধারণ দৃশ্য।
            </p>
          </div>
        </div>
      </div>

      {/* 2. Gallery Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GallerySection gallery={gallery} />
      </div>

      {/* 3. CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 text-white text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-left space-y-1">
            <h3 className="text-xl font-black">আপনিও খেলতে চান কুমিল্লার সেরা টার্ফে?</h3>
            <p className="text-gray-400 text-xs">আপনার পছন্দের তারিখ ও সময় বেছে নিন এবং অনলাইন বুকিং কনফার্ম করুন।</p>
          </div>
          <button
            onClick={onOpenBooking}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            টার্ফ বুক করুন
          </button>
        </div>
      </div>
    </div>
  );
};
