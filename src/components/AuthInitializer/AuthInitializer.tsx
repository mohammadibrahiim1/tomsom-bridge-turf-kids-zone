import React, { useEffect } from 'react';
import { useAppDispatch } from '../../redux/store/store';
import { logout, setUser } from '../../features/authentication/services/authSlice/authSlice';
import { useGetMeQuery } from '../../features/authentication/services/authApi/authApi';

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  
  // Regular Query use korle component mount howar shathe shathe automatic call hoye jay
  const { data: response, isSuccess, isError, isLoading, isFetching } = useGetMeQuery(undefined, {
    // optional: forceRefetching ba polling bondho rakhar jonno
  });


  

  useEffect(() => {
    if (isSuccess || isError) {
      if (isSuccess && response?.success && response?.data) {
        dispatch(setUser({ user: response.data }));
      } else {
        dispatch(logout());
      }

      // Initial HTML loader remove korar logic
      const loader = document.getElementById('initial-loader');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.remove();
        }, 400);
      }
    }
  }, [isSuccess, isError, response, dispatch]);

  // API call cholakalin somoy children render hobe na, fole unauthorized redirect hobe na
  if (isLoading || isFetching) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-emerald-950'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent' />
      </div>
    );
  }

  return <>{children}</>;
};