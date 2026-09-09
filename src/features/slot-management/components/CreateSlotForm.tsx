import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Clock, Sparkles, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { useCreateSlotMutation } from '../service/slotApi/slogApi';
import { ISlotPayload } from '../slotTypes/slot.types';

// Ammenities List
const AMENITIES_OPTIONS = [
  'জার্সি',
  'গ্লাভস',
  'প্রিমিয়াম ব্যাট ও বল',
  'বিশুদ্ধ পানি',
  'হাই-পাওয়ার ফ্লাডলাইট',
  'চেঞ্জিং রুম',
  'শাওয়ার রুম',
  'ফ্রি ওয়াইফাই (WiFi)',
  'গাড়ী পার্কিং',
  'ফার্স্ট এইড বক্স',
  'রেফারি সার্ভিস',
  'দর্শকদের বসার ব্যবস্থা',
];

// ২৪ ঘন্টার "HH:MM" সময়কে ১২ ঘন্টার AM/PM ফরম্যাটে রূপান্তর করার ফাংশন
const formatTo12Hour = (time24: string): string => {
  if (!time24) return '';
  const [hoursStr, minutesStr] = time24.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || '00';
  if (isNaN(hours)) return '';

  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  return `${formattedHours}:${minutes} ${period}`;
};

export default function CreateSlotForm() {
  const [createSlot, { isLoading }] = useCreateSlotMutation();
  const [successMsg, setSuccessMsg] = useState('');
  const [serverError, setServerError] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ISlotPayload>({
    defaultValues: {
      groundType: 'PITCH_1_SMALL',
      groundTypeBn: 'মাঠ ১ (ছোট মাঠ)',
      sportType: 'CRICKET',
      sportTypeBn: 'ক্রিকেট টার্ফ',
      packageNumber: 1,
      packageName: 'প্যাকেজ ০১ (ছোট মাঠ)',
      startTime: '18:00',
      endTime: '19:30',
      displayTime: '06:00 PM - 07:30 PM',
      playDurationMinutes: 0,
      bufferDurationMinutes: 0,
      hasExtraTime: false,
      extraTimeMinutes: 0,
      extraTimeCharge: 0,
      slotType: 'EVENING',
      slotTypeBn: 'সন্ধ্যা',
      regularPrice: 0,
      extraGroundCharge: 0,
      totalPrice: 0,
      peakPrice: 0,
      weekendPrice: 0,
      isNightMatch: true,
      hasRainEffect: false,
      hasSoundSystem: true,
      includedAmenities: ['জার্সি', 'গ্লাভস', 'বিশুদ্ধ পানি', 'চেঞ্জিং রুম'],
      customAttributes: {
        extraNote: 'ইভনিং ফ্লাডলাইট স্লট',
        maxPlayer: 12,
      },
      status: 'AVAILABLE',
      isActive: true,
    },
  });

  // Watch input values for real-time calculation
  const watchStartTime = watch('startTime');
  const watchEndTime = watch('endTime');
  const watchRegularPrice = watch('regularPrice');
  const watchExtraGroundCharge = watch('extraGroundCharge');
  const watchPlayDuration = watch('playDurationMinutes');
  const watchBufferDuration = watch('bufferDurationMinutes');

  // ==========================================
  // [পরিবর্তন ১ & ২] সময় ইনপুট পরিবর্তন হলে সময়ের ব্যবধান, Play Duration ও Buffer Duration জেনারেট করা
  // ==========================================
  useEffect(() => {
    if (watchStartTime && watchEndTime) {
      // AM/PM Display Time ফরম্যাটিং
      const formattedStart = formatTo12Hour(watchStartTime);
      const formattedEnd = formatTo12Hour(watchEndTime);
      setValue('displayTime', `${formattedStart} - ${formattedEnd}`, { shouldValidate: true });

      // মোট কত মিনিট সময় তা গণনা করা
      const [startH, startM] = watchStartTime.split(':').map(Number);
      const [endH, endM] = watchEndTime.split(':').map(Number);

      let startInMinutes = startH * 60 + startM;
      let endInMinutes = endH * 60 + endM;

      // যদি শেষ সময় রাত ১২টা পার হয়ে যায় (Midnight crossover)
      if (endInMinutes <= startInMinutes) {
        endInMinutes += 24 * 60;
      }

      const totalDuration = endInMinutes - startInMinutes;

      // মোট সময় থেকে ৫ মিনিট বাফার টাইম বাদ দিয়ে প্লে ডিউরেশন সেট করা
      const buffer = 5;
      const play = totalDuration > buffer ? totalDuration - buffer : 0;

      setValue('playDurationMinutes', play, { shouldValidate: true });
      setValue('bufferDurationMinutes', buffer, { shouldValidate: true });
    }
  }, [watchStartTime, watchEndTime, setValue]);

  // Regular Price বা Extra Ground Charge পরিবর্তন হলে Total Price অটো হিসাব
  useEffect(() => {
    const regPrice = Number(watchRegularPrice) || 0;
    const extraCharge = Number(watchExtraGroundCharge) || 0;
    setValue('totalPrice', regPrice + extraCharge, { shouldValidate: true });
  }, [watchRegularPrice, watchExtraGroundCharge, setValue]);

  const onSubmit = async (data: ISlotPayload) => {
    setServerError('');
    setSuccessMsg('');

    // স্বয়ংক্রিয়ভাবে ইউনিক স্লট আইডি জেনারেট
    const startFormatted = data.startTime.replace(':', '');
    const endFormatted = data.endTime.replace(':', '');
    const generatedSlotId = `${data.sportType}-${data.slotType}-${startFormatted}-${endFormatted}-${Date.now().toString().slice(-4)}`;

    const payload: ISlotPayload = {
      ...data,
      slotId: generatedSlotId,
      regularPrice: Number(data.regularPrice),
      extraGroundCharge: Number(data.extraGroundCharge),
      totalPrice: Number(data.totalPrice),
    };

    console.log('Submitting Payload:', payload);

    try {
      // await createSlot(payload).unwrap();
      setSuccessMsg('নতুন টার্ফ স্লট সফলভাবে তৈরি হয়েছে!');
      reset();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Failed to create slot:', err);
      setServerError(err?.data?.message || 'স্লট তৈরি করতে সমস্যা হয়েছে! পরে আবার চেষ্টা করুন।');
    }
  };

  const totalSlotDuration = (watchPlayDuration || 0) + (watchBufferDuration || 0);

  return (
    <div className='w-full max-w-4xl p-2 sm:p-4'>
      {/* শিরোনাম (Bangla Heading) */}
      <div className='mb-8 border-b border-slate-100 pb-5'>
        <div className='flex items-center gap-2 text-indigo-600 mb-1 font-bold text-xs uppercase tracking-wider'>
          <Sparkles className='w-4 h-4' />
          <span>অ্যাডমিন প্যানেল</span>
        </div>
        <h2 className='text-2xl sm:text-3xl font-black text-slate-800 tracking-tight'>নতুন টার্ফ স্লট তৈরি করুন</h2>
        <p className='text-slate-500 text-xs sm:text-sm mt-1'>
          সঠিক তথ্য দিয়ে নতুন একটি খেলার স্লট যুক্ত করুন। স্লট আইডি স্বয়ংক্রিয়ভাবে জেনারেট হবে।
        </p>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md flex items-center gap-3 text-sm font-semibold'
        >
          <CheckCircle2 className='w-5 h-5 text-emerald-600 flex-shrink-0' />
          <span>{successMsg}</span>
        </motion.div>
      )}

      {/* Error Notification */}
      {serverError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-md flex items-center gap-3 text-sm font-semibold'
        >
          <AlertCircle className='w-5 h-5 text-rose-600 flex-shrink-0' />
          <span>{serverError}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
        {/* ১. সাধারণ তথ্য (General Information) */}
        <div className='space-y-4'>
          <h3 className='text-sm font-bold text-slate-800 uppercase tracking-wider border-l-4 border-indigo-600 pl-2.5'>
            ১. সাধারণ তথ্য
          </h3>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6'>
            {/* Sport Type */}
            <div>
              <label className='block text-xs font-bold text-slate-700 mb-2'>খেলার ধরণ (Sport Type)</label>
              <Controller
                name='sportType'
                control={control}
                rules={{ required: 'খেলার ধরণ নির্বাচন করুন' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs font-semibold text-slate-800 transition'
                  >
                    <option value='CRICKET'>CRICKET (ক্রিকেট)</option>
                    <option value='FOOTBALL'>FOOTBALL (ফুটবল)</option>
                    <option value='BADMINTON'>BADMINTON (ব্যাডমিন্টন)</option>
                    <option value='BASKETBALL'>BASKETBALL (বাস্কেটবল)</option>
                    <option value='TENNIS'>TENNIS (টেনিস)</option>
                    <option value='KIDS_ZONE'>KIDS_ZONE (কিডস জোন)</option>
                  </select>
                )}
              />
            </div>

            {/* Ground Type */}
            <div>
              <label className='block text-xs font-bold text-slate-700 mb-2'>মাঠের ধরণ (Ground Type)</label>
              <Controller
                name='groundType'
                control={control}
                rules={{ required: 'মাঠের ধরণ নির্বাচন করুন' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs font-semibold text-slate-800 transition'
                  >
                    <option value='PITCH_1_SMALL'>PITCH 1 (ছোট মাঠ - 5v5 / Small)</option>
                    <option value='PITCH_2_MEDIUM'>PITCH 2 (মাঝারি মাঠ - 7v7 / Medium)</option>
                    <option value='PITCH_3_LARGE'>PITCH 3 (বড় মাঠ - 11v11 / Large)</option>
                    <option value='INDOR_TURF'>INDOOR TURF (ইনডোর টার্ফ)</option>
                    <option value='ROOFTOP_TURF'>ROOFTOP TURF (ছাদ টার্ফ)</option>
                    <option value='VIP_TURF'>VIP TURF (ভিআইপি প্রিমিয়াম গ্রাউন্ড)</option>
                  </select>
                )}
              />
            </div>

            {/* Slot Time Type */}
            <div>
              <label className='block text-xs font-bold text-slate-700 mb-2'>স্লটের ক্যাটাগরি (Slot Type)</label>
              <Controller
                name='slotType'
                control={control}
                rules={{ required: 'স্লটের ক্যাটাগরি নির্বাচন করুন' }}
                render={({ field }) => (
                  <select
                    {...field}
                    className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs font-semibold text-slate-800 transition'
                  >
                    <option value='EARLY_MORNING'>EARLY MORNING (ভোর)</option>
                    <option value='MORNING'>MORNING (সকাল)</option>
                    <option value='AFTERNOON'>AFTERNOON (দুপুর)</option>
                    <option value='EVENING'>EVENING (সন্ধ্যা)</option>
                    <option value='NIGHT'>NIGHT (রাত)</option>
                    <option value='LATE_NIGHT'>LATE NIGHT (গভীর রাত)</option>
                    <option value='WEEKEND_SPECIAL'>WEEKEND SPECIAL (ছুটির দিন)</option>
                  </select>
                )}
              />
            </div>

            {/* Package Number */}
            <div>
              <label className='block text-xs font-bold text-slate-700 mb-2'>প্যাকেজ নম্বর</label>
              <Controller
                name='packageNumber'
                control={control}
                rules={{ required: 'প্যাকেজ নম্বর প্রদান করুন' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type='number'
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs font-semibold text-slate-800 transition'
                  />
                )}
              />
            </div>

            {/* Package Name */}
            <div className='sm:col-span-2'>
              <label className='block text-xs font-bold text-slate-700 mb-2'>প্যাকেজের নাম (বাংলা)</label>
              <Controller
                name='packageName'
                control={control}
                rules={{ required: 'প্যাকেজের নাম লিখুন' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type='text'
                    placeholder='প্যাকেজ ০১ (ছোট মাঠ)'
                    className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs font-semibold text-slate-800 transition'
                  />
                )}
              />
              {errors.packageName && (
                <span className='text-rose-500 text-[11px] mt-1 block font-semibold'>{errors.packageName.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* ২. সময়সূচি (Timing Setup - Dynamic Duration Setup) */}
        <div className='space-y-4'>
          <h3 className='text-sm font-bold text-slate-800 uppercase tracking-wider border-l-4 border-indigo-600 pl-2.5'>
            ২. সময়সূচি
          </h3>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6'>
            {/* Start Time Input */}
            <div>
              <label className='block text-xs font-bold text-slate-700 mb-2'>শুরুর সময় (Start Time)</label>
              <Controller
                name='startTime'
                control={control}
                rules={{ required: 'শুরুর সময় দিন' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type='time'
                    className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs font-semibold text-slate-800 transition'
                  />
                )}
              />
            </div>

            {/* End Time Input */}
            <div>
              <label className='block text-xs font-bold text-slate-700 mb-2'>শেষের সময় (End Time)</label>
              <Controller
                name='endTime'
                control={control}
                rules={{ required: 'শেষের সময় দিন' }}
                render={({ field }) => (
                  <input
                    {...field}
                    type='time'
                    className='w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs font-semibold text-slate-800 transition'
                  />
                )}
              />
            </div>

            {/* [পরিবর্তন ৩] Display Time and Calculated Duration Preview Card */}
            <div className='sm:col-span-2 bg-indigo-50/60 border border-indigo-100 rounded-md p-4 space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='p-2.5 bg-indigo-600 text-white rounded-md'>
                    <Clock className='w-5 h-5' />
                  </div>
                  <div>
                    <span className='block text-[11px] font-bold text-indigo-900/60 uppercase tracking-wider'>
                      লাইভ ডিসপ্লে টাইম (AM/PM)
                    </span>
                    <Controller
                      name='displayTime'
                      control={control}
                      render={({ field }) => (
                        <span className='text-base sm:text-lg font-black text-indigo-950'>
                          {field.value || '--:--'}
                        </span>
                      )}
                    />
                  </div>
                </div>
                <span className='text-[10px] font-bold bg-indigo-200/60 text-indigo-800 px-2.5 py-1 rounded-full'>
                  অটোমেটিক আপডেট
                </span>
              </div>

              {/* Dynamic Calculation Info Note */}
              <div className='pt-2 border-t border-indigo-100 flex items-start gap-2 text-xs text-indigo-950 font-medium'>
                <Info className='w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5' />
                <div>
                  <p>
                    মোট সময়: <span className='font-bold text-indigo-700'>{totalSlotDuration} মিনিট</span>
                  </p>
                  <p className='text-[11px] text-slate-600 mt-0.5'>
                    (খেলার সময়: <span className='font-bold text-emerald-700'>{watchPlayDuration || 0} মিনিট</span>,
                    বাফার সময়: <span className='font-bold text-amber-700'>{watchBufferDuration || 0} মিনিট</span>)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ৩. মূল্য নির্ধারণ (Pricing) */}
        <div className='space-y-4'>
          <h3 className='text-sm font-bold text-slate-800 uppercase tracking-wider border-l-4 border-indigo-600 pl-2.5'>
            ৩. মূল্য নির্ধারণ
          </h3>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6'>
            {/* Regular Price */}
            <div>
              <label className='block text-xs font-bold text-slate-700 mb-2'>মূল প্রাইস (Regular Price)</label>
              <Controller
                name='regularPrice'
                control={control}
                rules={{ required: 'মূল্য দেয়া বাধ্যতামূলক' }}
                render={({ field }) => (
                  <div className='relative'>
                    <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs'>
                      ৳
                    </span>
                    <input
                      {...field}
                      type='number'
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder='1400'
                      className='w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs font-semibold text-slate-800 transition'
                    />
                  </div>
                )}
              />
            </div>

            {/* Extra Ground Charge */}
            <div>
              <label className='block text-xs font-bold text-slate-700 mb-2'>
                অতিরিক্ত মাঠের চার্জ (Extra Ground Charge)
              </label>
              <Controller
                name='extraGroundCharge'
                control={control}
                render={({ field }) => (
                  <div className='relative'>
                    <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs'>
                      ৳
                    </span>
                    <input
                      {...field}
                      type='number'
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder='200'
                      className='w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs font-semibold text-slate-800 transition'
                    />
                  </div>
                )}
              />
            </div>

            {/* Total Price */}
            <div>
              <label className='block text-xs font-bold text-slate-700 mb-2'>সর্বমোট মূল্য (Total Price)</label>
              <Controller
                name='totalPrice'
                control={control}
                render={({ field }) => (
                  <div className='relative'>
                    <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-xs'>
                      ৳
                    </span>
                    <input
                      {...field}
                      type='number'
                      readOnly
                      className='w-full pl-8 pr-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-md text-emerald-900 font-black text-xs outline-none cursor-not-allowed'
                    />
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        {/* ৪. ফিচার ও সুযোগ-সুবিধা */}
        <div className='space-y-4'>
          <h3 className='text-sm font-bold text-slate-800 uppercase tracking-wider border-l-4 border-indigo-600 pl-2.5'>
            ৪. ফিচার ও সুযোগ-সুবিধা
          </h3>

          {/* Checkbox Options */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-slate-50/80 border border-slate-200/80 rounded-md'>
            <Controller
              name='isNightMatch'
              control={control}
              render={({ field }) => (
                <label className='flex items-center gap-3 p-2 rounded-md hover:bg-white transition cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={field.value}
                    onChange={field.onChange}
                    className='w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500'
                  />
                  <span className='text-xs font-bold text-slate-700'>নাইট ম্যাচ (ফ্লাডলাইট)</span>
                </label>
              )}
            />

            <Controller
              name='hasRainEffect'
              control={control}
              render={({ field }) => (
                <label className='flex items-center gap-3 p-2 rounded-md hover:bg-white transition cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={field.value}
                    onChange={field.onChange}
                    className='w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500'
                  />
                  <span className='text-xs font-bold text-slate-700'>রেইন ইফেক্ট</span>
                </label>
              )}
            />

            <Controller
              name='hasSoundSystem'
              control={control}
              render={({ field }) => (
                <label className='flex items-center gap-3 p-2 rounded-md hover:bg-white transition cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={field.value}
                    onChange={field.onChange}
                    className='w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500'
                  />
                  <span className='text-xs font-bold text-slate-700'>সাউন্ড সিস্টেম</span>
                </label>
              )}
            />
          </div>

          {/* Multi-Select Amenities Tag Buttons */}
          <div>
            <label className='block text-xs font-bold text-slate-700 mb-2'>অন্তর্ভুক্ত সুযোগ-সুবিধাসমূহ</label>
            <Controller
              name='includedAmenities'
              control={control}
              render={({ field }) => (
                <div className='flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-md'>
                  {AMENITIES_OPTIONS.map((item) => {
                    const isSelected = field.value?.includes(item);
                    return (
                      <button
                        type='button'
                        key={item}
                        onClick={() => {
                          const current = field.value || [];
                          const updated = isSelected ? current?.filter((i) => i !== item) : [...current, item];
                          field.onChange(updated);
                        }}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {item} {isSelected ? '✓' : '+'}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.div whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }} className='pt-4'>
          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-md shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 cursor-pointer text-sm'
          >
            {isLoading ? 'তৈরি করা হচ্ছে...' : 'স্লট তৈরি নিশ্চিত করুন'}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
