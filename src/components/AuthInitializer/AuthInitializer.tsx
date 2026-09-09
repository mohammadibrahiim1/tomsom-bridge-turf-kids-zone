import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAppDispatch } from '../../redux/store/store';
import { logout, setUser } from '../../features/authentication/services/authSlice/authSlice';
import { useLazyGetMeQuery } from '../../features/authentication/services/authApi/authApi';

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [triggerGetMe] = useLazyGetMeQuery();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // ১. সরাসরি useGetMeQuery অটো-কল না করে trigger দিয়ে কল করা হচ্ছে
        // আমাদের baseQueryWithReauth-এ অটোমেটিক রিফ্রেশ টোকেন হ্যান্ডেল হবে
        const response = await triggerGetMe(null).unwrap();

        if (response?.success && response?.data) {
          dispatch(setUser({ user: response.data }));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        // রিফ্রেশ টোকেন এবং এক্সেস টোকেন দুটোই না থাকলে বা মেয়াদ শেষ হলে সেশন আউট হবে
        dispatch(logout());
      } finally {
        // চেকিং শেষ হওয়া মাত্রই লোডার বন্ধ হয়ে যাবে
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch, triggerGetMe]);

  // ২. চেকিং প্রসেস এবং ভেরিফিকেশন শেষ না হওয়া পর্যন্ত লোডার দেখাবে
  if (isInitializing) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-900 text-white'>
        <Loader2 className='w-8 h-8 animate-spin text-red-600' />
      </div>
    );
  }

  return <>{children}</>;
};
