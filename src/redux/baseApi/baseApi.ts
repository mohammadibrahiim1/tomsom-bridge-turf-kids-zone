import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store/store';

// ============================================================
// Base Query Configuration
// ============================================================
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: 'include', // HttpOnly cookie (refresh/access token) handle korar jonno
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    
    // Jodi Redux state-এ accessToken থাকে, তবে সেটি হেডার-এ যুক্ত হবে
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
});

// ============================================================
// Clean Base Query with minimal error handling
// (API protection and authentication logic are handled by backend middleware)
// ============================================================
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  // Frontend e kono aggressive token refresh ba block logic thakbe na.
  // Backend-er auth middleware thik kore dibe konta protected ebong konta public.
  const result = await baseQuery(args, api, extraOptions);

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Booking', 'Turf', 'Slots'],
  endpoints: () => ({}),
});