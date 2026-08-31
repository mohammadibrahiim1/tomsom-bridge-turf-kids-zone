import React, { useState } from 'react';
import { Calendar, Clock, ArrowRight, Zap } from 'lucide-react';
import { QuickBookingBarProps } from '../landingTypes/quickBooking.types';

export const QuickBookingBar: React.FC<QuickBookingBarProps> = ({
  slots = [],
  selectedDate: propDate,
  onDateChange,
  onStartBooking,
  onBookClick,
  availableCount,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [internalDate, setInternalDate] = useState(today);
  const currentDate = propDate || internalDate;
  const [selectedSlotId, setSelectedSlotId] = useState(slots?.[0]?.id || '');

  const handleDateChange = (newDate: string) => {
    setInternalDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onStartBooking) {
      onStartBooking(currentDate, selectedSlotId);
    } else if (onBookClick) {
      onBookClick(currentDate);
    } else {
      const el = document.getElementById('booking');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-4', 'ring-red-500/40', 'rounded-3xl');
        setTimeout(() => el.classList.remove('ring-4', 'ring-red-500/40'), 1500);
      }
    }
  };

  return (
    <div className='relative -mt-6 z-20 max-w-5xl mx-auto px-4 sm:px-6'>
      <div className='bg-white rounded-3xl shadow-xl border-2 border-red-600 p-5 sm:p-7'>
        {/* Header Header Info */}
        <div className='flex items-center justify-between flex-wrap gap-2 mb-4'>
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-600'>
              <Zap className='w-4 h-4 animate-pulse' />
            </div>
            <h2 className='text-lg font-black text-gray-950'>দ্রুত টার্ফ বুকিং</h2>
            <span className='text-xs text-gray-600 font-medium hidden sm:inline'>
              — মাত্র ২ মিনিটে পছন্দের তারিখ ও সময় নির্বাচন করে বুক করুন
            </span>
          </div>

          {typeof availableCount === 'number' && (
            <span className='text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full'>
              {availableCount} টি স্লট ফাঁকা আছে
            </span>
          )}
        </div>

        {/* Quick Booking Form */}
        <form onSubmit={handleSubmit} className='grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end'>
          {/* Date Picker */}
          <div className='sm:col-span-4'>
            <label
              htmlFor='quick-booking-date'
              className='block text-xs font-bold text-gray-800 mb-1.5 flex items-center'
            >
              <Calendar className='w-3.5 h-3.5 text-red-600 mr-1.5' />
              <span>খেলার তারিখ নির্বাচন করুন</span>
            </label>
            <input
              type='date'
              id='quick-booking-date'
              min={today}
              value={currentDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className='w-full px-3.5 py-3 bg-gray-50 border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-100 rounded-xl text-sm font-bold text-gray-900 outline-none transition-all'
              required
            />
          </div>

          {/* Time Slot Picker */}
          <div className='sm:col-span-5'>
            <label
              htmlFor='quick-booking-slot'
              className='block text-xs font-bold text-gray-800 mb-1.5 flex items-center'
            >
              <Clock className='w-3.5 h-3.5 text-red-600 mr-1.5' />
              <span>পছন্দের সময়সূচি</span>
            </label>
            <select
              id='quick-booking-slot'
              value={selectedSlotId}
              onChange={(e) => setSelectedSlotId(e.target.value)}
              className='w-full px-3.5 py-3 bg-gray-50 border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-100 rounded-xl text-sm font-bold text-gray-900 outline-none transition-all'
            >
              <option value=''>-- যে কোনো সময় নির্বাচন করুন --</option>
              {slots?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.startTime} - {s.endTime} ({s.slotType} | ৳{s.regularPrice})
                </option>
              ))}
            </select>
          </div>

          {/* Submit CTA Button */}
          <div className='sm:col-span-3'>
            <button
              type='submit'
              id='quick-book-submit-btn'
              className='w-full flex items-center justify-center py-3 px-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-red-600/25 transition-all cursor-pointer'
            >
              <span>স্লট বুক করুন</span>
              <ArrowRight className='w-4 h-4 ml-1.5' />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
