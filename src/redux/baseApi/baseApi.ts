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

  const isAuthEndpoint = 
    url.includes('/auth/login') || 
    url.includes('/auth/register') || 
    url.includes('/auth/logout') || 
    url.includes('/auth/refresh-token');

  // টোকেন না থাকলে এবং অথ এন্ডপয়েন্ট না হলে রিফ্রেশ টোকেন কল করা হবে
  if (!token && !isAuthEndpoint) {
    const refreshResult = await baseQuery({ url: '/auth/refresh-token', method: 'POST' }, api, extraOptions);

    if (refreshResult.data) {
      const newAccessToken = (refreshResult.data as any).data?.accessToken;
      if (newAccessToken) {
        api.dispatch(setAccessToken(newAccessToken));
        token = newAccessToken;
      }
    } else {
      const errorStatus = refreshResult.error?.status;
      // শুধুমাত্র টোকেন ইনভ্যালিড (401/403) হলেই লগআউট হবে
      if (errorStatus === 401 || errorStatus === 403) {
        api.dispatch(logout());
      }
      return refreshResult;
    }
  }

  // টোকেনের মেয়াদ চেক করা এবং ৩০ সেকেন্ডের কম থাকলে রিন্যু করা
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
      // Decode error ignore
    }
  }

  let result = await baseQuery(args, api, extraOptions);

  // যদি রিকোয়েস্টে 401 এরর আসে তবে একবার রিফ্রেশ ট্রাই করা
  if (result.error && result.error.status === 401 && !isAuthEndpoint) {
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
  tagTypes: ['User', 'Booking', 'Turf', 'Slots'],
  endpoints: () => ({}),
});