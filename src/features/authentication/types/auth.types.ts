import { User } from '../../../types/user.types';

export interface LoginCredentials {
  identity: string; // Phone / Email / Username
  password: string;
}

export interface RegisterCredentials {
  name: string;
  phone: string;
  email?: string;
  username?: string;
  password: string;
}

export interface VerifyUserRequest {
  identity: string; // Username or Email or Phone
}

export interface VerifyUserResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    exists: boolean;
    identity: string;
  };
}

export interface ResetPasswordRequest {
  identity: string;
  newPassword: string;
}

export interface LoginResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    user: User;
    isMustChangePassword?: boolean;
    accessToken?: string;
  };
}

export interface UserProfileResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: User;
}
