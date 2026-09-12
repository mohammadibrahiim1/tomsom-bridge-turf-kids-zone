import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAppDispatch } from '../../redux/store/store';
import { logout, setUser } from '../../features/authentication/services/authSlice/authSlice';
import { useLazyGetMeQuery } from '../../features/authentication/services/authApi/authApi';
import Preloader from '../Preloader';

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [triggerGetMe] = useLazyGetMeQuery();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        
        const response = await triggerGetMe(null).unwrap();

        if (response?.success && response?.data) {
          dispatch(setUser({ user: response.data }));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        
        dispatch(logout());
      } finally {
        
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch, triggerGetMe]);

if (isInitializing) {
    return <Preloader />;
  }

  return <>{children}</>;
};
