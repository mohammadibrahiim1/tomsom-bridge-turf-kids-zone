import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitialLoading: boolean;
  isMustChangePassword: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialLoading: true,
  isMustChangePassword: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User; accessToken?: string; isMustChangePassword?: boolean }>) => {
      state.user = action.payload.user;
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
      }
      state.isAuthenticated = true;
      state.isInitialLoading = false;
      state.isMustChangePassword = action.payload.isMustChangePassword ?? false;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isInitialLoading = false;
      state.isMustChangePassword = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isInitialLoading = action.payload;
    },
  },
});

export const { setUser, setAccessToken, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
