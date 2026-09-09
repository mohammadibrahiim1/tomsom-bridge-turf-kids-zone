import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Mail,
  ArrowLeft,
  Key,
  Globe,
} from 'lucide-react';
import { api } from '../services/api';
import type { AdminUser, WebsiteSettings } from '../types';
import { AdminDashboard } from '../components/admin/AdminDashboard';

interface AdminPageProps {
  currentUser?: AdminUser | null;
  onLoginSuccess?: (user: AdminUser, token: string) => void;
  onLogout?: () => void;
  onRefreshPublicData?: () => void;
  onNavigateHome?: () => void;
  settings?: WebsiteSettings | null;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  currentUser,
  onLoginSuccess,
  onLogout,
  onRefreshPublicData,
  onNavigateHome,
  settings,
}) => {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <section>
        <main>
          <h1 className='text-2xl font-bold text-slate-800 dark:text-slate-200'>Admin Dashboard</h1>
        </main>
      </section>
    </div>
  );
};
