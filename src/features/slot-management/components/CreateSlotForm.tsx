import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ISlotPayload, useCreateSlotMutation } from '../service/slotApi/slogApi';

const AMENITIES_OPTIONS = ['জার্সি', 'গ্লাভস', 'প্রিমিয়াম ব্যাট ও বল', 'বিশুদ্ধ পানি', 'হাই-পাওয়ার ফ্লাডলাইট'];

export default function CreateSlotForm() {
  const [createSlot, { isLoading, isSuccess, error }] = useCreateSlotMutation();
  const [successMsg, setSuccessMsg] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ISlotPayload>({
    defaultValues: {
      slotId: '',
      groundType: 'PITCH_1_SMALL',
      groundTypeBn: 'মাঠ ১ (ছোট মাঠ)',
      sportType: 'CRICKET',
      sportTypeBn: 'ক্রিকেট টার্ফ',
      packageNumber: 1,
      packageName: 'প্যাকেজ ০১ (ছোট মাঠ)',
      startTime: '18:00',
      endTime: '19:00',
      displayTime: '06:00 PM - 07:00 PM',
      bookingDate: new Date().toISOString().split('T')[0],
      playDurationMinutes: 55,
      bufferDurationMinutes: 5,
      hasExtraTime: false,
      extraTimeMinutes: 0,
      extraTimeCharge: 0,
      slotType: 'EVENING',
      slotTypeBn: 'সন্ধ্যা',
      regularPrice: 1400,
      extraGroundCharge: 200,
      totalPrice: 1400,
      peakPrice: 1600,
      weekendPrice: 1500,
      isNightMatch: true,
      hasRainEffect: false,
      hasSoundSystem: true,
      includedAmenities: ['জার্সি', 'গ্লাভস', 'বিশুদ্ধ পানি'],
      customAttributes: {
        extraNote: 'Evening Floodlight Slot',
        maxPlayer: 12,
      },
      status: 'AVAILABLE',
      isActive: true,
    },
  });

  const onSubmit = async (data: ISlotPayload) => {
    try {
      await createSlot(data).unwrap();
      setSuccessMsg('Turf Slot successfully created!');
      reset();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      console.error('Failed to create slot:', err);
    }
  };

  return (
    <div className='mx-auto  bg-white shadow-2xl rounded-2xl border border-gray-100'>
      <motion.h2
        initial={{ opacity: -20, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-3xl font-extrabold text-gray-800 mb-6 border-b pb-4'
      >
        Create New Turf Slot
      </motion.h2>

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className='mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg font-medium'
        >
          {successMsg}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Slot ID */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Slot ID (Unique)</label>
            <Controller
              name='slotId'
              control={control}
              rules={{ required: 'Slot ID is required' }}
              render={({ field }) => (
                <input
                  {...field}
                  type='text'
                  placeholder='CRICKET-EVENING-1800'
                  className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition'
                />
              )}
            />
            {errors.slotId && <span className='text-red-500 text-xs mt-1 block'>{errors.slotId.message}</span>}
          </div>

          {/* Sport Type */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Sport Type</label>
            <Controller
              name='sportType'
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white'
                >
                  <option value='CRICKET'>CRICKET</option>
                  <option value='FOOTBALL'>FOOTBALL</option>
                  <option value='BADMINTON'>BADMINTON</option>
                  <option value='KIDS_ZONE'>KIDS_ZONE</option>
                </select>
              )}
            />
          </div>

          {/* Ground Type */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Ground Type</label>
            <Controller
              name='groundType'
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white'
                >
                  <option value='PITCH_1_SMALL'>PITCH 1 (Small)</option>
                  <option value='PITCH_2_LARGE'>PITCH 2 (Large)</option>
                </select>
              )}
            />
          </div>

          {/* Slot Time Type */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Slot Time Type</label>
            <Controller
              name='slotType'
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white'
                >
                  <option value='MORNING'>MORNING</option>
                  <option value='AFTERNOON'>AFTERNOON</option>
                  <option value='EVENING'>EVENING</option>
                  <option value='NIGHT'>NIGHT</option>
                </select>
              )}
            />
          </div>

          {/* Package Number */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Package Number</label>
            <Controller
              name='packageNumber'
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type='number'
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none'
                />
              )}
            />
          </div>

          {/* Package Name */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Package Name (Bengali)</label>
            <Controller
              name='packageName'
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type='text'
                  placeholder='প্যাকেজ ০১ (ছোট মাঠ)'
                  className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none'
                />
              )}
            />
          </div>

          {/* Start Time */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Start Time</label>
            <Controller
              name='startTime'
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type='text'
                  placeholder='18:00'
                  className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none'
                />
              )}
            />
          </div>

          {/* End Time */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>End Time</label>
            <Controller
              name='endTime'
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type='text'
                  placeholder='19:00'
                  className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none'
                />
              )}
            />
          </div>

          {/* Display Time */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Display Time</label>
            <Controller
              name='displayTime'
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type='text'
                  placeholder='06:00 PM - 07:00 PM'
                  className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none'
                />
              )}
            />
          </div>

          {/* Booking Date */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Booking Date</label>
            <Controller
              name='bookingDate'
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type='date'
                  className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none'
                />
              )}
            />
          </div>

          {/* Regular Price */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Regular Price</label>
            <Controller
              name='regularPrice'
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type='number'
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none'
                />
              )}
            />
          </div>

          {/* Total Price */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>Total Price</label>
            <Controller
              name='totalPrice'
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type='number'
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none'
                />
              )}
            />
          </div>
        </div>

        {/* Checkboxes / Features Section */}
        <div className='border-t pt-4 mt-6'>
          <label className='block text-sm font-semibold text-gray-700 mb-3'>Features & Amenities</label>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            <Controller
              name='isNightMatch'
              control={control}
              render={({ field }) => (
                <label className='flex items-center space-x-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={field.value}
                    onChange={field.onChange}
                    className='w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500'
                  />
                  <span className='text-sm font-medium text-gray-700'>Night Match (Floodlight)</span>
                </label>
              )}
            />

            <Controller
              name='hasRainEffect'
              control={control}
              render={({ field }) => (
                <label className='flex items-center space-x-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={field.value}
                    onChange={field.onChange}
                    className='w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500'
                  />
                  <span className='text-sm font-medium text-gray-700'>Rain Effect</span>
                </label>
              )}
            />

            <Controller
              name='hasSoundSystem'
              control={control}
              render={({ field }) => (
                <label className='flex items-center space-x-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={field.value}
                    onChange={field.onChange}
                    className='w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500'
                  />
                  <span className='text-sm font-medium text-gray-700'>Sound System</span>
                </label>
              )}
            />
          </div>
        </div>

        {/* Multiple Select for Included Amenities */}
        <div className='border-t pt-4 mt-4'>
          <label className='block text-sm font-semibold text-gray-700 mb-2'>Included Amenities (Multi-Select)</label>
          <Controller
            name='includedAmenities'
            control={control}
            render={({ field }) => (
              <select
                multiple
                value={field.value || []}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions, (option) => option.value);
                  field.onChange(options);
                }}
                className='w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white h-32'
              >
                {AMENITIES_OPTIONS.map((item) => (
                  <option key={item} value={item} className='p-1'>
                    {item}
                  </option>
                ))}
              </select>
            )}
          />
          <p className='text-xs text-gray-500 mt-1'>Hold Ctrl (or Cmd on Mac) to select multiple options.</p>
        </div>

        {/* Submit Button with Framer Motion */}
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className='pt-4'>
          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50'
          >
            {isLoading ? 'Creating Slot...' : 'Create Turf Slot'}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
