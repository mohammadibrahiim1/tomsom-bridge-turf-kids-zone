import { baseApi } from '../../../../redux/baseApi/baseApi';
import { ISlotPayload, Slot } from '../../slotTypes/slot.types';

// ============================================================
// API Response & Payload Types
// ============================================================

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ISlotsApiResponse {
  success: boolean;
  message: string;
  meta: IPaginationMeta;
  data: Slot[];
}

export interface IDeleteSlotsResponse {
  success: boolean;
  message: string;
  deletedCount: number;
}

export interface IGetAllSlotsParams {
  page?: number;
  limit?: number;
  [key: string]: any; // অতিরিক্ত ফিল্টার প্যারামিটার হ্যান্ডেল করার জন্য
}

// ============================================================
// Slot API Slice
// ============================================================

export const slotApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    getAllSlots: builder.query<ISlotsApiResponse, IGetAllSlotsParams>({
      query: (params) => ({
        url: '/slots',
        params,
      }),
      providesTags: ['Slots'],
    }),

    
    createSlot: builder.mutation<any, ISlotPayload>({
      query: (newSlot) => ({
        url: '/slots/create',
        method: 'POST',
        body: newSlot,
      }),
      invalidatesTags: ['Slots'],
    }),

    
    deleteSlots: builder.mutation<IDeleteSlotsResponse, string[]>({
      query: (ids) => ({
        url: '/slots/delete-slots',
        method: 'DELETE',
        body: { ids },
      }),
      invalidatesTags: ['Slots'],
    }),
  }),
});

// ============================================================
// Exported Hooks
// ============================================================

export const {
  useCreateSlotMutation,
  useGetAllSlotsQuery,
  useDeleteSlotsMutation,
} = slotApi;