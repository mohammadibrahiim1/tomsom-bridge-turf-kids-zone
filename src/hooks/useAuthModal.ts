import { useNavigate, useSearch } from '@tanstack/react-router';
import { AuthMode } from '../redux/features/modal/modalSlice';

export const useAuthModal = () => {
  const navigate = useNavigate();

  const search = useSearch({ strict: false }) as { authModal?: AuthMode };

  return {
    isOpen: !!search.authModal,
    mode: search.authModal || 'login',

    open: (mode: AuthMode = 'login') =>
      navigate({
        search: (prev: any) => ({ ...prev, authModal: mode }),
      }),

    close: () =>
      navigate({
        search: (prev: any) => ({ ...prev, authModal: undefined }),
      }),

    switchMode: (mode: AuthMode) =>
      navigate({
        search: (prev: any) => ({ ...prev, authModal: mode }),
      }),
  };
};
