import React, { useEffect } from 'react';
import { useAppDispatch } from '../../redux/store/store';
import { logout, setUser } from '../../features/authentication/services/authSlice/authSlice';
import { useLazyGetMeQuery } from '../../features/authentication/services/authApi/authApi';

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  
  
  const [getMe, { data: response, isSuccess, isError,isLoading, isUninitialized }] = useLazyGetMeQuery();

  useEffect(() => {
    getMe(undefined);
  }, []);

  
  useEffect(() => {
    
    if (isSuccess || isError) {
      if (isSuccess && response?.success && response?.data) {
        dispatch(setUser({ user: response.data }));
      } else {
        dispatch(logout());
      }

    
      const loader = document.getElementById('initial-loader');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
          loader.remove();
        }, 400);
      }
    }
  }, [isSuccess, isError, response, dispatch]);


  if (isLoading || isUninitialized) {
    return null;
  }

  return <>{children}</>;
};