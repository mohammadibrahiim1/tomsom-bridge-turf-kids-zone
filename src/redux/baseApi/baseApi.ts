import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logout, setAccessToken } from '../../features/authentication/services/authSlice/authSlice';
import { jwtDecode } from 'jwt-decode';
import { RootState } from '../store/store';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:9000/api/v1',
  credentials: 'include',
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const state = api.getState() as RootState;
  const token = state.auth.accessToken;

  if (token) {
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
      // Ignore decode error
    }
  }

  let result = await baseQuery(args, api, extraOptions);

  const url = typeof args === 'string' ? args : args.url;
  if (result.error && result.error.status === 401 && !url.includes('/auth/refresh-token')) {
    const refreshResult = await baseQuery({ url: '/auth/refresh-token', method: 'POST' }, api, extraOptions);

    if (refreshResult.data) {
      const newAccessToken = (refreshResult.data as any).data?.accessToken;
      if (newAccessToken) {
        api.dispatch(setAccessToken(newAccessToken));
      }
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Booking', 'Turf'],
  endpoints: () => ({}),
});
