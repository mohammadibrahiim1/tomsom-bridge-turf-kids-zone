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
  Globe
} from 'lucide-react';
import { api } from '../services/api';
import type { AdminUser, WebsiteSettings } from '../types';
import { AdminDashboard } from '../components/admin/AdminDashboard';

interface AdminPageProps {
  currentUser: AdminUser | null;
  onLoginSuccess: (user: AdminUser, token: string) => void;
  onLogout: () => void;
  onRefreshPublicData: () => void;
  onNavigateHome: () => void;
  settings: WebsiteSettings | null;
}

type AuthMode = 'login' | 'forgot_request' | 'forgot_reset' | 'force_change';

export const AdminPage: React.FC<AdminPageProps> = ({
  currentUser,
  onLoginSuccess,
  onLogout,
  onRefreshPublicData,
  onNavigateHome,
  settings,
}) => {
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Login fields
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  
  // Forgot password fields
  const [recoveryIdentity, setRecoveryIdentity] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  
  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [generatedCodeHint, setGeneratedCodeHint] = useState<string | null>(null);

  // Forced password change state
  const [tempUser, setTempUser] = useState<AdminUser | null>(null);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // If already logged in as Admin, show Admin Dashboard view
  if (currentUser) {
    return (
      <AdminDashboard
        currentUser={currentUser}
        onLogout={onLogout}
        onRefreshPublicData={onRefreshPublicData}
      />
    );
  }

  const resetAllStates = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setGeneratedCodeHint(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetAllStates();
    setIsLoading(true);

    try {
      const res = await api.login(username.trim(), password);
      if (res.success && res.data) {
        localStorage.setItem('tomsom_admin_token', res.data.token);
        localStorage.setItem('tomsom_admin_user', JSON.stringify(res.data.admin));

        if (res.data.admin.isMustChangePassword) {
          setMode('force_change');
          setTempUser(res.data.admin);
          setTempToken(res.data.token);
        } else {
          onLoginSuccess(res.data.admin, res.data.token);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'ভুল ইউজারনেম বা পাসওয়ার্ড।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    resetAllStates();

    if (!recoveryIdentity.trim()) {
      setErrorMessage('ইউজারনেম বা ইমেইল প্রদান করুন।');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.forgotPassword(recoveryIdentity.trim());
      if (res.success) {
        setSuccessMessage(`ভেরিফিকেশন কোড পাঠানো হয়েছে।`);
        if (res.resetCode) {
          setGeneratedCodeHint(res.resetCode);
          setResetCode(res.resetCode);
        }
        setMode('forgot_reset');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'পাসওয়ার্ড রিসেট কোড পাঠাতে ব্যর্থ হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    resetAllStates();

    if (!resetCode.trim()) {
      setErrorMessage('অনুগ্রহ করে ৬ ডিজিটের ওটিপি ভেরিফিকেশন কোড দিন।');
      return;
    }

    if (resetNewPassword.length < 6) {
      setErrorMessage('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      setErrorMessage('নতুন পাসওয়ার্ড দুটি মিলছে না।');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.resetPassword(
        recoveryIdentity.trim(),
        resetCode.trim(),
        resetNewPassword,
        resetConfirmPassword
      );

      if (res.success) {
        setSuccessMessage('পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে! নতুন পাসওয়ার্ড দিয়ে লগইন করুন।');
        setPassword(resetNewPassword);
        setUsername(recoveryIdentity.trim());
        setMode('login');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForcePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    resetAllStates();

    if (newPassword.length < 6) {
      setErrorMessage('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('নতুন পাসওয়ার্ড দুটি মিলছে না।');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.changePassword(newPassword, confirmPassword);
      if (res.success && tempUser && tempToken) {
        tempUser.isMustChangePassword = false;
        localStorage.setItem('tomsom_admin_user', JSON.stringify(tempUser));
        onLoginSuccess(tempUser, tempToken);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between p-4 sm:p-6 text-gray-100">
      
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg">
            TB
          </div>
          <div>
            <span className="font-black text-white text-base block">
              {settings?.websiteNameBn || 'টমছম ব্রিজ টার্ফ'}
            </span>
            <span className="text-2xs text-gray-400">সুপার অ্যাডমিন ড্যাশবোর্ড ও CMS</span>
          </div>
        </div>

        <button
          onClick={onNavigateHome}
          className="inline-flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 mr-1.5 text-red-400" />
          ওয়েবসাইটে ফিরে যান
        </button>
      </div>

      {/* Main Form Box */}
      <div className="max-w-md w-full mx-auto my-8 bg-white text-gray-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
        
        {/* Box Header */}
        <div className="p-6 bg-slate-950 text-white flex items-center space-x-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-bold text-white shadow-md">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">অ্যাডমিন সাইন ইন</h2>
            <p className="text-2xs text-gray-400">নিরাপদ ইউজারনেম/ইমেইল ও পাসওয়ার্ড</p>
          </div>
        </div>

        {/* Box Body */}
        <div className="p-6 sm:p-8 space-y-5">
          
          {errorMessage && (
            <div className="p-3.5 bg-red-50 text-red-700 border-l-4 border-red-600 rounded-r-xl text-xs font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-50 text-emerald-800 border-l-4 border-emerald-600 rounded-r-xl text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* MODE 1: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  ইউজারনেম বা ইমেইল *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    id="admin-page-username"
                    placeholder="admin অথবা yourname@email.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 focus:border-red-600 focus:bg-white rounded-xl text-sm font-semibold outline-hidden transition-all"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    পাসওয়ার্ড *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      resetAllStates();
                      setRecoveryIdentity(username);
                      setMode('forgot_request');
                    }}
                    className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                  >
                    পাসওয়ার্ড ভুলে গেছেন?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    id="admin-page-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 focus:border-red-600 focus:bg-white rounded-xl text-sm font-semibold outline-hidden transition-all"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                id="admin-page-login-submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-red-600/25 transition-all flex items-center justify-center cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    ড্যাশবোর্ডে লগইন করুন
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-500 space-y-1">
                <div>
                  ডিফল্ট একাউন্ট: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-bold text-gray-800">admin</code> | পাসওয়ার্ড: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-bold text-gray-800">admin123</code>
                </div>
                <div className="text-2xs text-gray-400">
                  সম্পূর্ণ সুরক্ষিত ও বাংলা ভাষায় পরিচালিত অ্যাডমিন পোর্টাল
                </div>
              </div>
            </form>
          )}

          {/* MODE 2: FORGOT REQUEST */}
          {mode === 'forgot_request' && (
            <form onSubmit={handleRequestResetCode} className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 space-y-1">
                <div className="font-bold flex items-center">
                  <KeyRound className="w-4 h-4 mr-1 text-red-600" />
                  পাসওয়ার্ড পুনরুদ্ধার:
                </div>
                <p>আপনার অ্যাডমিন ইউজারনেম বা ইমেইল প্রদান করুন। তাৎক্ষণিক ৬ ডিজিট ওটিপি কোড পাঠানো হবে।</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  ইউজারনেম বা ইমেইল *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="admin অথবা email@domain.com"
                    value={recoveryIdentity}
                    onChange={(e) => setRecoveryIdentity(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 focus:border-red-600 rounded-xl text-sm font-semibold outline-hidden"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ওটিপি ভেরিফিকেশন কোড পান'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    resetAllStates();
                    setMode('login');
                  }}
                  className="inline-flex items-center text-xs font-bold text-gray-600 hover:text-red-600 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  লগইন পেজে ফিরে যান
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: FORGOT RESET */}
          {mode === 'forgot_reset' && (
            <form onSubmit={handleConfirmPasswordReset} className="space-y-4">
              {generatedCodeHint && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 space-y-1">
                  <div className="font-bold flex items-center text-emerald-800">
                    <Key className="w-4 h-4 mr-1 text-emerald-600" />
                    আপনার ৬-ডিজিট ওটিপি কোড:
                  </div>
                  <div className="text-lg font-black tracking-widest text-emerald-700 bg-white py-1.5 px-3 rounded-lg border border-emerald-200 text-center font-mono">
                    {generatedCodeHint}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  ৬-ডিজিট ভেরিফিকেশন কোড *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: 123456"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  className="w-full px-3.5 py-3 bg-gray-50 border border-gray-300 focus:border-red-600 rounded-xl text-sm font-black tracking-widest outline-hidden text-center"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 focus:border-red-600 rounded-xl text-sm font-semibold outline-hidden"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  নতুন পাসওয়ার্ড নিশ্চিত করুন *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={resetConfirmPassword}
                    onChange={(e) => setResetConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 focus:border-red-600 rounded-xl text-sm font-semibold outline-hidden"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'পাসওয়ার্ড রিসেট ও লগইন করুন'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    resetAllStates();
                    setMode('login');
                  }}
                  className="inline-flex items-center text-xs font-bold text-gray-600 hover:text-red-600 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  বাতিল করুন
                </button>
              </div>
            </form>
          )}

          {/* MODE 4: FORCE CHANGE */}
          {mode === 'force_change' && (
            <form onSubmit={handleForcePasswordChange} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center">
                  <KeyRound className="w-4 h-4 mr-1 text-amber-600" />
                  নিরাপত্তা নির্দেশিকা:
                </div>
                <p>প্রাথমিক ডিফল্ট পাসওয়ার্ড পরিবর্তন করে নতুন পাসওয়ার্ড সেট করুন।</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 focus:border-red-600 rounded-xl text-sm font-semibold outline-hidden"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  নতুন পাসওয়ার্ড নিশ্চিত করুন *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-300 focus:border-red-600 rounded-xl text-sm font-semibold outline-hidden"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'পাসওয়ার্ড পরিবর্তন ও ড্যাশবোর্ডে প্রবেশ'}
              </button>
            </form>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 py-4">
        © {new Date().getFullYear()} {settings?.websiteNameBn || 'টমছম ব্রিজ টার্ফ'} — সর্বস্বত্ব সংরক্ষিত।
      </div>

    </div>
  );
};
