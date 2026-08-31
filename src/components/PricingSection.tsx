import React from 'react';
import { Check, Tag, ArrowRight } from 'lucide-react';
import type { SpecialOffer, TimeSlot, WebsiteSettings } from '../types';

interface PricingSectionProps {
  settings?: WebsiteSettings | null;
  slots?: TimeSlot[];
  offers?: SpecialOffer[];
  onOpenBooking?: () => void;
  onBookNowClick?: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  settings,
  slots = [],
  offers = [],
  onOpenBooking,
  onBookNowClick,
}) => {
  const handleBooking = onBookNowClick || onOpenBooking || (() => {
    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  return (
    <section id="pricing" className="py-20 bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3.5 py-1.5 rounded-full">
            স্বচ্ছ মূল্য তালিকা
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950">
            টার্ফ ও কিডস জোন রেট চার্ট
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            কোনো লুকানো চার্জ নেই। প্রতিটি স্লট ৬০ মিনিট (৫৫ মিনিট ফুল ম্যাচ + ৫ মিনিট ট্রানজিশন)।
          </p>
        </div>

        {/* Offers Banner (if any) */}
        {offers.length > 0 && (
          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white p-5 rounded-2xl shadow-md flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
                    <Tag className="w-3 h-3 mr-1" />
                    বিশেষ অফার!
                  </div>
                  <h4 className="text-lg font-bold">{offer.title}</h4>
                  <p className="text-xs text-red-100">{offer.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xl font-black text-white">{offer.discountText}</div>
                  <button
                    type="button"
                    onClick={handleBooking}
                    className="mt-2 text-xs font-bold bg-white text-red-600 px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
                  >
                    বুক করুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Day Regular Slots */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-200 p-8 flex flex-col justify-between transition-all">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                সকাল ও দুপুর স্লট
              </div>
              <h3 className="text-2xl font-black text-gray-950">ডে ম্যাচ প্যাকেজ</h3>
              <p className="text-xs text-gray-600">
                সকাল ০৬:০০ টা থেকে বিকাল ০৪:০০ টা পর্যন্ত ডে-লাইট ম্যাচ।
              </p>

              <div className="pt-2 flex items-baseline">
                <span className="text-4xl font-black text-red-600">৳১,০০০</span>
                <span className="text-xs text-gray-500 font-semibold ml-2">/ ১ ঘণ্টা স্লট</span>
              </div>

              <ul className="space-y-3 text-xs text-gray-700 pt-4 border-t border-gray-100">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                  ৫৫ মিনিট ফুটবল ম্যাচ + ৫ মিনিট বিরতি
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                  ফ্রি ফুটবল ও বিবস (Bibs) প্রদান
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                  ফিল্টার করা বিশুদ্ধ খাবার পানি
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                  ড্রেসিংরুম ও ওয়াশরুম সুবিধা
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={handleBooking}
                className="w-full py-3 bg-black hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-all cursor-pointer"
              >
                ডে স্লট বুক করুন
              </button>
            </div>
          </div>

          {/* Card 2: Peak Evening & Night Slots (Featured Red) */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-red-600 p-8 flex flex-col justify-between relative transition-all">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
              সবচেয়ে জনপ্রিয়
            </div>

            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-red-600">
                বিকাল, সন্ধ্যা ও রাত
              </div>
              <h3 className="text-2xl font-black text-gray-950">নাইট ফ্লাডলাইট ম্যাচ</h3>
              <p className="text-xs text-gray-600">
                বিকাল ০৪:০০ টা থেকে রাত ১২:০০ টা পর্যন্ত প্রিমিয়াম ফ্লাডলাইটে ম্যাচ।
              </p>

              <div className="pt-2 flex items-baseline">
                <span className="text-4xl font-black text-red-600">৳১,২০০</span>
                <span className="text-xs text-gray-500 font-semibold ml-2">/ ১ ঘণ্টা স্লট</span>
              </div>

              <ul className="space-y-3 text-xs text-gray-700 pt-4 border-t border-gray-100">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-red-600 mr-2 shrink-0" />
                  <span className="font-bold text-gray-900">হাই-পাওয়ার অ্যান্টি-গ্লেয়ার ফ্লাডলাইট</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-red-600 mr-2 shrink-0" />
                  ৫৫ মিনিট ফুল ম্যাচ + ৫ মিনিট প্রস্তুতি
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-red-600 mr-2 shrink-0" />
                  প্রিমিয়াম কোয়ালিটি ফুটবল ও কালার বিবস
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-red-600 mr-2 shrink-0" />
                  সাউন্ড সিস্টেম ও স্কোরবোর্ড সুবিধা
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={handleBooking}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-base rounded-xl shadow-lg transition-all cursor-pointer"
              >
                নাইট স্লট বুক করুন
              </button>
            </div>
          </div>

          {/* Card 3: Kids Zone & Birthday Events */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-200 p-8 flex flex-col justify-between transition-all">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                শিশুদের বিনোদন
              </div>
              <h3 className="text-2xl font-black text-gray-950">কিডস জোন এন্ট্রি</h3>
              <p className="text-xs text-gray-600">
                ২ থেকে ১২ বছর বয়সী শিশুদের জন্য নিরাপদ ইনডোর রাইডস ও ফান।
              </p>

              <div className="pt-2 flex items-baseline">
                <span className="text-4xl font-black text-red-600">৳১৫০</span>
                <span className="text-xs text-gray-500 font-semibold ml-2">/ শিশু (প্রতি ঘণ্টা)</span>
              </div>

              <ul className="space-y-3 text-xs text-gray-700 pt-4 border-t border-gray-100">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                  সকল রাইডস ও বল পিট আনলিমিটেড ব্যবহার
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                  অভিভাবকদের জন্য আরামদায়ক সিটিং জোন
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                  নরম ফোম ম্যাট ও শতভাগ শিশু নিরাপত্তা
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                  বার্থডে ও ফ্যামিলি পার্টি স্পেশাল প্যাকেজ উপলব্ধ
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <a
                href="#kids-zone"
                className="w-full inline-flex items-center justify-center py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-sm rounded-xl transition-all"
              >
                কিডস জোন বিস্তারিত
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
