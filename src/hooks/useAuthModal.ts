import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { AuthMode, closeAuthModal, openAuthModal, switchAuthMode } from '../redux/features/modal/modalSlice';

export const useAuthModal = () => {
  const dispatch = useDispatch();
  const { isAuthModalOpen, authMode } = useSelector((state: RootState) => state.modal);

  return {
    isOpen: isAuthModalOpen,
    mode: authMode,

    open: (mode?: AuthMode) => dispatch(openAuthModal(mode)),

    close: () => dispatch(closeAuthModal()),

    switchMode: (mode: AuthMode) => dispatch(switchAuthMode(mode)),
  };
};
