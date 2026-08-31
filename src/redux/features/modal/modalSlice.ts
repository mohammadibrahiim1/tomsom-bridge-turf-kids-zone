import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthMode = 'login' | 'register' | 'reset-password';

interface ModalState {
  isAuthModalOpen: boolean;
  authMode: AuthMode;
}

const initialState: ModalState = {
  isAuthModalOpen: false,
  authMode: 'login',
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openAuthModal: (state, action: PayloadAction<AuthMode | undefined>) => {
      state.isAuthModalOpen = true;
      state.authMode = action.payload ?? 'login';
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    switchAuthMode: (state, action: PayloadAction<AuthMode>) => {
      state.authMode = action.payload;
    },
  },
});

export const { openAuthModal, closeAuthModal, switchAuthMode } = modalSlice.actions;
export default modalSlice.reducer;
