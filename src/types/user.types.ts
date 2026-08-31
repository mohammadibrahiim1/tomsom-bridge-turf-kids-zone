export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  CUSTOMER = 'CUSTOMER',
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: Role;
  username?: string;
  avatarUrl?: string;
}

export interface AdminUser extends User {
  email: string; // Email mandatory for admin/staff
  passwordHash?: string;
  isMustChangePassword?: boolean;
  resetCode?: string;
  resetCodeExpiresAt?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  role: Role;
  action: string;
  timestamp: string;
  details?: string;
}
