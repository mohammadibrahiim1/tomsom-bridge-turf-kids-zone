import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logout, setAccessToken } from '../../features/authentication/services/authSlice/authSlice';
import { jwtDecode } from 'jwt-decode';
import { RootState } from '../store/store';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let state = api.getState() as RootState;
  let token = state.auth.accessToken;
  const url = typeof args === 'string' ? args : args.url;


  if (!token && !url.includes('/auth/refresh-token') && !url.includes('/auth/login')) {
    const refreshResult = await baseQuery({ url: '/auth/refresh-token', method: 'POST' }, api, extraOptions);

    if (refreshResult.data) {
      const newAccessToken = (refreshResult.data as any).data?.accessToken;
      if (newAccessToken) {
        api.dispatch(setAccessToken(newAccessToken));
        token = newAccessToken; // নতুন টোকেন আপডেট হলো
      }
    }
  }


  if (token && !url.includes('/auth/refresh-token')) {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp - currentTime < 30) {
        const refreshResult = await baseQuery({ url: '/auth/refresh-token', method: 'POST' }, api, extraOptions);

        if (refreshResult.data) {
          const newAccessToken = (refreshResult.data as any).data?.accessToken;
          if (newAccessToken) {
            api.dispatch(setAccessToken(newAccessToken));
          }
        }
      }
    } catch (err) {
      // Decode Error হ্যান্ডেলিং
    }
  }

  // ৩. মূল API কল করা
  let result = await baseQuery(args, api, extraOptions);

  // ৪. যদি তবুও ৪০১ আসে তাহলে শেষ চেষ্টা হিসেবে পুনরায় RefreshToken ট্রাই করা
  if (result.error && result.error.status === 401 && !url.includes('/auth/refresh-token')) {
    const refreshResult = await baseQuery({ url: '/auth/refresh-token', method: 'POST' }, api, extraOptions);

    if (refreshResult.data) {
      const newAccessToken = (refreshResult.data as any).data?.accessToken;
      if (newAccessToken) {
        api.dispatch(setAccessToken(newAccessToken));
        result = await baseQuery(args, api, extraOptions);
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Booking', 'Turf','Slots'],
  endpoints: () => ({}),
});
