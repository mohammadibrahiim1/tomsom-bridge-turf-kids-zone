import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ISlotPayload } from '../../slotTypes/slot.types';



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
