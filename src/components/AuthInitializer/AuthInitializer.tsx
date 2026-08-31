import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useAppDispatch } from '../../redux/store/store';
import { logout, setLoading, setUser } from '../../features/authentication/services/authSlice/authSlice';
import { useGetMeQuery } from '../../features/authentication/services/authApi/authApi';

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  const { data, isLoading, isError } = useGetMeQuery(null);

  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
    } else if (data?.success && data?.data) {
      dispatch(setUser({ user: data?.data }));
    } else if (isError) {
      dispatch(logout());
    }
  }, [data, isLoading, isError, dispatch]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-900 text-white'>
        <Loader2 className='w-8 h-8 animate-spin text-red-600' />
      </div>
    );
  }

  return <>{children}</>;
};
