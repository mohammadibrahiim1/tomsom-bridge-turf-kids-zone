// ==========================================
// 1. RTK QUERY API SLICE (slotApi.ts)
// ==========================================

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ISlotPayload {
  slotId: string;
  groundType: 'PITCH_1_SMALL' | 'PITCH_2_LARGE';
  groundTypeBn?: string;
  sportType: 'FOOTBALL' | 'CRICKET' | 'BADMINTON' | 'KIDS_ZONE';
  sportTypeBn?: string;
  packageNumber?: number;
  packageName?: string;
  startTime: string;
  endTime: string;
  displayTime: string;
  bookingDate?: string;
  playDurationMinutes?: number;
  bufferDurationMinutes?: number;
  hasExtraTime?: boolean;
  extraTimeMinutes?: number;
  extraTimeCharge?: number;
  slotType: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';
  slotTypeBn?: string;
  regularPrice: number;
  extraGroundCharge?: number;
  totalPrice?: number;
  peakPrice?: number;
  weekendPrice?: number;
  isNightMatch?: boolean;
  hasRainEffect?: boolean;
  hasSoundSystem?: boolean;
  includedAmenities?: string[];
  customAttributes?: {
    extraNote?: string;
    maxPlayer?: number;
    [key: string]: any;
  };
  status?: 'AVAILABLE' | 'BOOKED' | 'LOCKED' | 'MAINTENANCE';
  isActive?: boolean;
}

export const slotApi = createApi({
  reducerPath: 'slotApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/v1' }),
  tagTypes: ['Slots'],
  endpoints: (builder) => ({
    getAllSlots: builder.query({
      query: (params) => ({
        url: '/slots',
        params,
      }),
      providesTags: ['Slots'],
    }),
    createSlot: builder.mutation<any, ISlotPayload>({
      query: (newSlot) => ({
        url: '/slots',
        method: 'POST',
        body: newSlot,
      }),
      invalidatesTags: ['Slots'],
    }),
  }),
});

export const { useCreateSlotMutation, useGetAllSlotsQuery } = slotApi;
