import React, { useEffect } from 'react';
import { useAppDispatch } from '../../redux/store/store';
import { logout, setUser } from '../../features/authentication/services/authSlice/authSlice';
import { useLazyGetMeQuery } from '../../features/authentication/services/authApi/authApi';

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  
  // Browser automatic cookie request-er sathe pathiye dibe.
  const [getMe, { data: response, isSuccess, isError }] = useLazyGetMeQuery();

  useEffect(() => {
    getMe(undefined);
  }, [getMe]);

  useEffect(() => {
    if (isSuccess && response?.success && response?.data) {
      dispatch(setUser({ user: response.data }));
    } else if (isError) {
      // Cookie na thakle ba expired hole server 401 dibe, tokhon logout dispatch hobe
      dispatch(logout());
    }
  }, [isSuccess, isError, response, dispatch]);

  return <>{children}</>;
};