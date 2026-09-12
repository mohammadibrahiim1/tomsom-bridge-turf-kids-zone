import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateSlotMutation } from '../service/slotApi/slotApi';
import { ISlotPayload } from '../slotTypes/slot.types';
import { calculateSlotDurations, formatTo12Hour } from '../utils/slotTimeUtils';

// Helper interface for standard API error responses
interface ApiErrorResponse {
  status?: number | string;
  data?: {
    message?: string;
    error?: string;
  };
}

export const useCreateSlotForm = () => {
  const [createSlot, { isLoading }] = useCreateSlotMutation();
  const [successMsg, setSuccessMsg] = useState('');
  const [serverError, setServerError] = useState('');

  const formMethods = useForm<ISlotPayload>({
    defaultValues: {
      groundType: 'PITCH_1_SMALL',
      groundTypeBn: 'মাঠ ১ (ছোট মাঠ)',
      sportType: 'CRICKET',
      sportTypeBn: '',
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
      slotTypeBn: '',
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

  const { control, handleSubmit, watch, setValue, reset, formState } = formMethods;

  const watchStartTime = watch('startTime');
  const watchEndTime = watch('endTime');
  const watchRegularPrice = watch('regularPrice');
  const watchExtraGroundCharge = watch('extraGroundCharge');
  const watchPlayDuration = watch('playDurationMinutes');
  const watchBufferDuration = watch('bufferDurationMinutes');

  // সময় পরিবর্তনের সাথে সাথে ডিসপ্লে টাইম এবং ডিউরেশন আপডেট
  useEffect(() => {
    if (watchStartTime && watchEndTime) {
      const formattedStart = formatTo12Hour(watchStartTime);
      const formattedEnd = formatTo12Hour(watchEndTime);
      setValue('displayTime', `${formattedStart} - ${formattedEnd}`, { shouldValidate: true });

      const { playDuration, bufferDuration } = calculateSlotDurations(watchStartTime, watchEndTime);

      setValue('playDurationMinutes', playDuration, { shouldValidate: true });
      setValue('bufferDurationMinutes', bufferDuration, { shouldValidate: true });
    }
  }, [watchStartTime, watchEndTime, setValue]);

  // প্রাইস ক্যালকুলেশন
  useEffect(() => {
    const regPrice = Number(watchRegularPrice) || 0;
    const extraCharge = Number(watchExtraGroundCharge) || 0;
    setValue('totalPrice', regPrice + extraCharge, { shouldValidate: true });
  }, [watchRegularPrice, watchExtraGroundCharge, setValue]);

  // Professional error extraction helper
  const extractErrorMessage = (err: unknown): string => {
    if (err && typeof err === 'object') {
      const apiError = err as ApiErrorResponse;
      
      // ব্যাকএন্ড থেকে পাঠানো কাস্টম বা গ্লোবাল এরর মেসেজ থাকলে তা রিসিভ করবে
      if (apiError.data?.message) {
        return apiError.data.message;
      }
      
      if (apiError.data?.error) {
        return apiError.data.error;
      }

      // নেটওয়ার্ক বা কানেকশন ত্রুটি হ্যান্ডেল করা
      if ('status' in apiError && apiError.status !== undefined) {
        const statusStr = String(apiError.status);
        if (statusStr === 'FETCH_ERROR' || statusStr === '503' || statusStr === '504') {
          return 'সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হচ্ছে না। অনুগ্রহ করে আপনার ইন্টারনেট কানেকশন চেক করুন।';
        }
        if (statusStr === '500') {
          return 'সিস্টেম বা সার্ভারে সাময়িক সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।';
        }
      }
    }

    return 'স্লট তৈরি করতে সমস্যা হয়েছে! পরে আবার চেষ্টা করুন।';
  };

  
// ফর্ম সাবমিট হ্যান্ডলার
  const onSubmit = async (data: ISlotPayload) => {
    // নতুন সাবমিট শুরু হওয়ার আগে আগের সকল মেসেজ ক্লিয়ার করা হবে
    setServerError('');
    setSuccessMsg('');

    try {
      const startFormatted = data.startTime.replace(':', '');
      const endFormatted = data.endTime.replace(':', '');
      const generatedSlotId = `${data.sportType}-${data.slotType}-${startFormatted}-${endFormatted}-${Date.now().toString().slice(-4)}`;

      const payload: ISlotPayload = {
        ...data,
        slotId: generatedSlotId,
        regularPrice: Number(data.regularPrice) || 0,
        extraGroundCharge: Number(data.extraGroundCharge) || 0,
        totalPrice: Number(data.totalPrice) || 0,
      };

      console.log('[Slot Creation Payload]:', payload);

      // ১. এখানে .unwrap() এর ফলাফলটি একটি ভেরিয়েবলে রিসিভ করে চেক করতে পারেন
      const response = await createSlot(payload).unwrap();
      console.log('[Slot Creation Response]:', response);

      // ব্যাকএন্ড যদি সরাসরি { success: true, message: "..." } পাঠায়
      setSuccessMsg(response?.message || 'নতুন টার্ফ স্লট সফলভাবে তৈরি হয়েছে!');
      reset();
      
      // ৪ সেকেন্ড পর সাকসেস মেসেজ অটো রিমুভ হবে
      setTimeout(() => {
        setSuccessMsg('');
      }, 4000);

    } catch (err: unknown) {
      // ডিবাগিংয়ের জন্য ব্যাকএন্ডের টেকনিক্যাল এরর কনসোলে থাকবে
      console.error('[Slot Creation Critical Error]:', err);

      // ইউজারকে দেখানোর জন্য পরিচ্ছন্ন মেসেজ সেট করা
      const friendlyMessage = extractErrorMessage(err);
      setServerError(friendlyMessage);
    }
  };

  const totalSlotDuration = (watchPlayDuration || 0) + (watchBufferDuration || 0);

  return {
    formMethods,
    control,
    handleSubmit: handleSubmit(onSubmit),
    errors: formState.errors,
    isLoading,
    successMsg,
    serverError,
    watchPlayDuration,
    watchBufferDuration,
    totalSlotDuration,
  };
};