import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  Settings,
  Baby,
  Tag,
  Users,
  Trophy,
  Image as ImageIcon,
  MessageSquare,
  HelpCircle,
  BarChart3,
  ShieldAlert,
  Database,
  History,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Printer,
  Search,
  DollarSign,
  TrendingUp,
  Download,
  Upload,
  UserPlus,
  Save,
  Key,
  FileSpreadsheet,
} from 'lucide-react';
import { api } from '../../services/api';
import { exportBookingsToExcel, exportCustomersToExcel, exportFinancialReportToExcel } from '../../utils/excelExport';
import { downloadCpanelZip } from '../../utils/cpanelExporter';
import type {
  AdminUser,
  Booking,
  Coupon,
  Facility,
  FAQItem,
  GalleryItem,
  KidsZoneInfo,
  SpecialOffer,
  TimeSlot,
  TournamentEvent,
  TurfInfo,
  WebsiteSettings,
} from '../../types';
import { PrintableReceipt } from '../PrintableReceipt';

interface AdminDashboardProps {
  currentUser: AdminUser;
  onLogout: () => void;
  onRefreshPublicData: () => void;
}

type TabType =
  | 'overview'
  | 'bookings'
  | 'slots'
  | 'settings'
  | 'kids'
  | 'coupons'
  | 'customers'
  | 'events'
  | 'gallery'
  | 'reviews'
  | 'faqs'
  | 'reports'
  | 'staff'
  | 'backup'
  | 'logs';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onLogout, onRefreshPublicData }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Data States
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingFilterStatus, setBookingFilterStatus] = useState('All');
  const [bookingSearch, setBookingSearch] = useState('');
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [turfInfo, setTurfInfo] = useState<TurfInfo | null>(null);
  const [kidsZoneInfo, setKidsZoneInfo] = useState<KidsZoneInfo | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [events, setEvents] = useState<TournamentEvent[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [reports, setReports] = useState<any>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [cpanelExporting, setCpanelExporting] = useState(false);
  const [cpanelStatus, setCpanelStatus] = useState('');

  const handleCpanelExport = async () => {
    if (cpanelExporting) return;
    try {
      setCpanelExporting(true);
      setCpanelStatus('প্রোডাকশন ফাইলসমূহ সংগ্রহ হচ্ছে...');
      await downloadCpanelZip((msg) => setCpanelStatus(msg));
      setCpanelStatus('ডাউনলোড সম্পন্ন!');
      setSuccessMessage('cPanel এর জন্য public_html-ready ZIP ডাউনলোড শুরু হয়েছে!');
      setTimeout(() => {
        setCpanelExporting(false);
        setCpanelStatus('');
      }, 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'ZIP ডাউনলোড ব্যর্থ হয়েছে।');
      setCpanelExporting(false);
      setCpanelStatus('');
    }
  };

  // Selected Booking for Receipt preview
  const [selectedReceiptBooking, setSelectedReceiptBooking] = useState<Booking | null>(null);

  // Manual Booking Modal
  const [showManualBookingModal, setShowManualBookingModal] = useState(false);
  const [manualData, setManualData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    bookingDate: new Date().toISOString().split('T')[0],
    slotId: '',
    slotTime: '',
    amount: 1200,
    paymentMethod: 'ক্যাশ',
    transactionId: '',
    bookingStatus: 'নিশ্চিত',
    paymentStatus: 'সফল',
    notes: 'অ্যাডমিন কাউন্টার ম্যানুয়াল বুকিং',
  });

  // Slot Edit Modal
  const [editingSlot, setEditingSlot] = useState<Partial<TimeSlot> | null>(null);

  // Coupon Edit Modal
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);

  // Offer Edit Modal
  const [editingOffer, setEditingOffer] = useState<Partial<SpecialOffer> | null>(null);

  // Event Edit Modal
  const [editingEvent, setEditingEvent] = useState<Partial<TournamentEvent> | null>(null);

  // Gallery Add Modal
  const [newGalleryItem, setNewGalleryItem] = useState({ title: '', category: 'টার্ফ', imageUrl: '' });
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // Staff Modal
  const [newStaffData, setNewStaffData] = useState({ username: '', name: '', email: '', role: 'Staff', password: '' });
  const [showStaffModal, setShowStaffModal] = useState(false);

  // Settings CMS SubTab & Password States
  const [settingsSubTab, setSettingsSubTab] = useState<
    'header' | 'hero' | 'footer' | 'receipt' | 'turf' | 'payments' | 'visibility' | 'security'
  >('header');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newReceiptRuleText, setNewReceiptRuleText] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।', true);
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('নতুন পাসওয়ার্ড দুটি মিলছে না।', true);
      return;
    }
    try {
      const res = await api.changePassword(newPassword, confirmPassword);
      if (res.success) {
        showToast('অ্যাডমিন পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      showToast(err.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে', true);
    }
  };

  // Load Tab Data
  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab]);

  const showToast = (msg: string, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(null), 4000);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const loadTabData = async (tab: TabType) => {
    setIsLoading(true);
    try {
      if (tab === 'overview') {
        const res = await api.getDashboardStats();
        if (res.success) setStats(res.data);
      } else if (tab === 'bookings') {
        const res = await api.getAdminBookings({
          status: bookingFilterStatus,
          search: bookingSearch,
        });
        if (res.success) setBookings(res.data);
        const sltRes = await api.getAdminSlots();
        if (sltRes.success) setSlots(sltRes.data);
      } else if (tab === 'slots') {
        const res = await api.getAdminSlots();
        if (res.success) setSlots(res.data);
      } else if (tab === 'settings') {
        const cfg = await api.getConfig();
        if (cfg.success) {
          setSettings(cfg.data.settings);
          setTurfInfo(cfg.data.turfInfo);
        }
      } else if (tab === 'kids') {
        const cfg = await api.getConfig();
        if (cfg.success) setKidsZoneInfo(cfg.data.kidsZoneInfo);
      } else if (tab === 'coupons') {
        const cp = await api.getAdminCoupons();
        const of = await api.getAdminOffers();
        if (cp.success) setCoupons(cp.data);
        if (of.success) setOffers(of.data);
      } else if (tab === 'customers') {
        const res = await api.getCustomers();
        if (res.success) setCustomers(res.data);
      } else if (tab === 'events') {
        const res = await api.getEvents();
        if (res.success) setEvents(res.data);
      } else if (tab === 'gallery') {
        const res = await api.getGallery();
        if (res.success) setGallery(res.data);
      } else if (tab === 'reviews') {
        const res = await api.getAllAdminReviews();
        if (res.success) setReviews(res.data);
      } else if (tab === 'faqs') {
        const res = await api.getConfig();
        if (res.success) setFaqs(res.data.faqs);
      } else if (tab === 'reports') {
        const res = await api.getReports();
        if (res.success) setReports(res.data);
      } else if (tab === 'staff') {
        const res = await api.getStaff();
        if (res.success) setStaff(res.data);
      } else if (tab === 'logs') {
        const res = await api.getActivityLogs();
        if (res.success) setActivityLogs(res.data);
      }
    } catch (err: any) {
      showToast(err.message || 'ডাটা লোড করতে ব্যর্থ', true);
    } finally {
      setIsLoading(false);
    }
  };

  // Status Updater
  const handleUpdateBookingStatus = async (id: string, bStatus: string, pStatus?: string) => {
    try {
      const res = await api.updateBookingStatus(id, bStatus, pStatus);
      if (res.success) {
        showToast('বুকিং স্ট্যাটাস আপডেট হয়েছে');
        loadTabData('bookings');
        onRefreshPublicData();
      }
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  // Create Manual Booking
  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualData.customerName || !manualData.customerPhone || !manualData.slotTime) {
      showToast('নাম, ফোন ও সময় আবশ্যক', true);
      return;
    }

    try {
      const res = await api.createManualBooking({
        ...manualData,
        slotDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট',
        type: 'টার্ফ',
        discountAmount: 0,
        totalAmount: manualData.amount,
      });
      if (res.success) {
        showToast('ম্যানুয়াল বুকিং যোগ করা হয়েছে');
        setShowManualBookingModal(false);
        loadTabData('bookings');
        onRefreshPublicData();
      }
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const res = await api.updateSettings(settings);
      if (res.success) {
        showToast('সেটিংস সফলভাবে সংরক্ষিত হয়েছে');
        onRefreshPublicData();
      }
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  // Save Turf Info
  const handleSaveTurf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turfInfo) return;
    try {
      const res = await api.updateTurf(turfInfo);
      if (res.success) {
        showToast('টার্ফের বিবরণ সংরক্ষিত হয়েছে');
        onRefreshPublicData();
      }
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  // Save Kids Zone Info
  const handleSaveKidsZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kidsZoneInfo) return;
    try {
      const res = await api.updateKidsZone(kidsZoneInfo);
      if (res.success) {
        showToast('কিডস জোন তথ্য সংরক্ষিত হয়েছে');
        onRefreshPublicData();
      }
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  // Time Slot Save
  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlot) return;
    try {
      if (editingSlot.id) {
        await api.updateSlot(editingSlot.id, editingSlot);
      } else {
        await api.createSlot(editingSlot);
      }
      showToast('স্লট সফলভাবে সংরক্ষিত হয়েছে');
      setEditingSlot(null);
      loadTabData('slots');
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleDeleteSlot = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত এই স্লটটি মুছে ফেলতে চান?')) return;
    try {
      await api.deleteSlot(id);
      showToast('স্লট মুছে ফেলা হয়েছে');
      loadTabData('slots');
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  // Coupon Save
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon || !editingCoupon.code) return;
    try {
      await api.saveCoupon(editingCoupon);
      showToast('কুপন সংরক্ষিত হয়েছে');
      setEditingCoupon(null);
      loadTabData('coupons');
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('কুপনটি মুছে ফেলতে চান?')) return;
    try {
      await api.deleteCoupon(id);
      showToast('কুপন মুছে ফেলা হয়েছে');
      loadTabData('coupons');
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  // Special Offer Save
  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;
    try {
      await api.saveOffer(editingOffer);
      showToast('অফার সংরক্ষিত হয়েছে');
      setEditingOffer(null);
      loadTabData('coupons');
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  // Event Save
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      await api.saveEvent(editingEvent);
      showToast('ইভেন্ট সংরক্ষিত হয়েছে');
      setEditingEvent(null);
      loadTabData('events');
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('ইভেন্টটি মুছে ফেলতে চান?')) return;
    try {
      await api.deleteEvent(id);
      showToast('ইভেন্ট মুছে ফেলা হয়েছে');
      loadTabData('events');
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  // Gallery Save
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.imageUrl) return;
    try {
      await api.saveGalleryItem(newGalleryItem);
      showToast('ছবি গ্যালারিতে যোগ হয়েছে');
      setShowGalleryModal(false);
      setNewGalleryItem({ title: '', category: 'টার্ফ', imageUrl: '' });
      loadTabData('gallery');
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('ছবিটি ডিলিট করবেন?')) return;
    try {
      await api.deleteGalleryItem(id);
      showToast('ছবি মুছে ফেলা হয়েছে');
      loadTabData('gallery');
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  // Review Status
  const handleUpdateReviewStatus = async (id: string, status: string) => {
    try {
      await api.updateReviewStatus(id, status);
      showToast('রিভিউ আপডেট হয়েছে');
      loadTabData('reviews');
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('রিভিউ মুছে ফেলবেন?')) return;
    try {
      await api.deleteReview(id);
      showToast('রিভিউ মোছা হয়েছে');
      loadTabData('reviews');
      onRefreshPublicData();
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  // Staff Save
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createStaff(newStaffData);
      showToast('নতুন স্টাফ অ্যাকাউন্ট তৈরি হয়েছে');
      setShowStaffModal(false);
      setNewStaffData({ username: '', name: '', email: '', role: 'Staff', password: '' });
      loadTabData('staff');
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm('স্টাফ অ্যাকাউন্টটি মুছে ফেলতে চান?')) return;
    try {
      await api.deleteStaff(id);
      showToast('স্টাফ ডিলিট হয়েছে');
      loadTabData('staff');
    } catch (err: any) {
      showToast(err.message, true);
    }
  };

  // Backup & Restore
  const handleDownloadBackup = async () => {
    try {
      window.open('/api/admin/backup/download', '_blank');
      showToast('ডাটাবেস ব্যাকআপ ডাউনলোড হচ্ছে...');
    } catch (err: any) {
      showToast('ব্যাকআপ ডাউনলোড ব্যর্থ', true);
    }
  };

  const handleRestoreBackupFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('সতর্কতা: ব্যাকআপ রিস্টোর করলে বর্তমান ডাটা প্রতিস্থাপিত হবে। চালিয়ে যেতে চান?')) {
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const res = await api.restoreBackup(json);
        if (res.success) {
          showToast('ডাটা সফলভাবে রিস্টোর হয়েছে!');
          loadTabData(activeTab);
          onRefreshPublicData();
        }
      } catch (err: any) {
        showToast('অবৈধ ব্যাকআপ ফাইল।', true);
      }
    };
    reader.readAsText(file);
  };

  const menuItems: { id: TabType; label: string; icon: any }[] = [
    { id: 'overview', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'bookings', label: 'বুকিং ব্যবস্থাপনা', icon: CalendarCheck },
    { id: 'slots', label: 'টাইম স্লট ও প্রাইসিং', icon: Clock },
    { id: 'settings', label: 'টার্ফ ও সাইট সেটিংস', icon: Settings },
    { id: 'kids', label: 'কিডস জোন সেটিংস', icon: Baby },
    { id: 'coupons', label: 'কুপন ও স্পেশাল অফার', icon: Tag },
    { id: 'customers', label: 'কাস্টমার ডাটাবেস', icon: Users },
    { id: 'events', label: 'টুর্নামেন্ট ও ইভেন্ট', icon: Trophy },
    { id: 'gallery', label: 'গ্যালারি মিডিয়া', icon: ImageIcon },
    { id: 'reviews', label: 'রিভিউ মডারেশন', icon: MessageSquare },
    { id: 'faqs', label: 'প্রশ্নোত্তর (FAQ)', icon: HelpCircle },
    { id: 'reports', label: 'আয়-ব্যয় ও রিপোর্ট', icon: BarChart3 },
    { id: 'staff', label: 'স্টাফ ও রোল এক্সেস', icon: ShieldAlert },
    { id: 'backup', label: 'ডাটা ব্যাকআপ ও রিস্টোর', icon: Database },
    { id: 'logs', label: 'কার্যক্রম লগ (Logs)', icon: History },
  ];

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      {/* Top Admin Header */}
      <header className='bg-slate-900 text-white px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-slate-800 shadow-md'>
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-md'>
            TB
          </div>
          <div>
            <span className='font-black text-base block leading-tight'>টমছম ব্রিজ টার্ফ — অ্যাডমিন পোর্টাল</span>
            <span className='text-2xs text-gray-300 font-medium'>
              লগইন ইউজার: <strong className='text-red-400 font-bold'>{currentUser.name}</strong> ({currentUser.role})
            </span>
          </div>
        </div>

        <div className='flex items-center space-x-3'>
          <button
            onClick={() => window.open('/', '_blank')}
            className='hidden sm:inline-flex items-center px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl transition-colors'
          >
            ওয়েবসাইট ভিউ
          </button>
          <button
            onClick={onLogout}
            className='inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer'
          >
            <LogOut className='w-3.5 h-3.5 mr-1' />
            লগআউট
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className='flex-1 flex flex-col md:flex-row'>
        {/* Left Sidebar */}
        <aside className='w-full md:w-64 bg-white border-r border-gray-200 p-3 space-y-1 shrink-0 overflow-y-auto max-h-auto md:max-h-[calc(100vh-60px)]'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive ? 'bg-red-600 text-white shadow-xs' : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Right Content Area */}
        <main className='flex-1 p-4 sm:p-8 overflow-y-auto max-h-[calc(100vh-60px)]'>
          {/* Notifications */}
          {successMessage && (
            <div className='mb-6 p-4 bg-emerald-50 text-emerald-800 border-l-4 border-emerald-600 rounded-r-xl text-xs font-bold flex items-center space-x-2 shadow-xs'>
              <CheckCircle2 className='w-5 h-5 text-emerald-600 shrink-0' />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className='mb-6 p-4 bg-red-50 text-red-800 border-l-4 border-red-600 rounded-r-xl text-xs font-bold flex items-center space-x-2 shadow-xs'>
              <AlertCircle className='w-5 h-5 text-red-600 shrink-0' />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && stats && (
            <div className='space-y-6'>
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                <div>
                  <h2 className='text-2xl font-black text-gray-950'>আজকের ড্যাশবোর্ড ও পরিসংখ্যান</h2>
                  <p className='text-xs text-gray-500'>টার্ফের বুকিং ও আয়ের তাৎক্ষণিক সারসংক্ষেপ</p>
                </div>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => exportBookingsToExcel(stats.recentBookings || [])}
                    className='px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center cursor-pointer transition-colors'
                    title='সাম্প্রতিক বুকিং এক্সেলে ডাউনলোড করুন'
                  >
                    <FileSpreadsheet className='w-4 h-4 mr-1.5' />
                    এক্সেল ডাউনলোড
                  </button>
                  <button
                    onClick={() => setShowManualBookingModal(true)}
                    className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center cursor-pointer'
                  >
                    <Plus className='w-4 h-4 mr-1' />
                    নতুন ম্যানুয়াল বুকিং
                  </button>
                </div>
              </div>

              {/* Stats KPI Cards */}
              <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                <div className='bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1'>
                  <span className='text-xs font-bold text-gray-500 uppercase'>আজকের বুকিং</span>
                  <div className='text-3xl font-black text-gray-950'>{stats.todayBookingsCount} টি</div>
                  <span className='text-2xs text-gray-400'>সর্বমোট বুকিং: {stats.totalBookingsCount}</span>
                </div>

                <div className='bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1'>
                  <span className='text-xs font-bold text-gray-500 uppercase'>আজকের মোট আয়</span>
                  <div className='text-3xl font-black text-red-600'>৳{stats.todayRevenue}</div>
                  <span className='text-2xs text-emerald-600 font-semibold'>সফল ও সংগৃহীত পেমেন্ট</span>
                </div>

                <div className='bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1'>
                  <span className='text-xs font-bold text-gray-500 uppercase'>নিশ্চিত বুকিং</span>
                  <div className='text-3xl font-black text-emerald-600'>{stats.confirmedCount} টি</div>
                  <span className='text-2xs text-amber-600 font-bold'>অপেক্ষমাণ: {stats.pendingCount}</span>
                </div>

                <div className='bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-1'>
                  <span className='text-xs font-bold text-gray-500 uppercase'>মোট সর্বমোট রাজস্ব</span>
                  <div className='text-3xl font-black text-black'>৳{stats.totalRevenue}</div>
                  <span className='text-2xs text-gray-400'>সম্পূর্ণ সিস্টেম লাইফটাইম</span>
                </div>
              </div>

              {/* Weekly Trend Table / Visual */}
              <div className='bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4'>
                <h3 className='text-base font-bold text-gray-950 flex items-center'>
                  <TrendingUp className='w-5 h-5 text-red-600 mr-2' />
                  বিগত ৭ দিনের আয় ও ম্যাচ বিশ্লেষণ
                </h3>
                <div className='grid grid-cols-2 sm:grid-cols-7 gap-2'>
                  {stats.last7Days?.map((d: any, i: number) => (
                    <div key={i} className='bg-gray-50 p-3 rounded-xl border border-gray-200 text-center space-y-1'>
                      <div className='text-2xs font-bold text-gray-500'>{d.dateLabel}</div>
                      <div className='text-sm font-black text-red-600'>৳{d.revenue}</div>
                      <div className='text-3xs text-gray-500'>{d.bookingsCount} টি ম্যাচ</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Bookings Mini-Table */}
              <div className='bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-base font-bold text-gray-950'>সাম্প্রতিক বুকিংসহ লাইভ তালিকা</h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className='text-xs font-bold text-red-600 hover:underline'
                  >
                    সকল বুকিং দেখুন →
                  </button>
                </div>

                <div className='overflow-x-auto'>
                  <table className='w-full text-left text-xs'>
                    <thead className='bg-gray-50 text-gray-700 uppercase font-bold border-y'>
                      <tr>
                        <th className='p-3'>আইডি</th>
                        <th className='p-3'>গ্রাহক</th>
                        <th className='p-3'>তারিখ ও সময়</th>
                        <th className='p-3'>মূল্য ও মাধ্যম</th>
                        <th className='p-3'>স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100 font-medium text-gray-800'>
                      {stats.recentBookings?.map((b: Booking) => (
                        <tr key={b.id} className='hover:bg-gray-50'>
                          <td className='p-3 font-mono font-bold text-red-600'>{b.id}</td>
                          <td className='p-3'>
                            <div className='font-bold'>{b.customerName}</div>
                            <div className='text-2xs text-gray-500'>{b.customerPhone}</div>
                          </td>
                          <td className='p-3'>
                            <div>{b.bookingDate}</div>
                            <div className='text-2xs text-gray-500'>{b.slotTime}</div>
                          </td>
                          <td className='p-3'>
                            <div className='font-bold'>৳{b.totalAmount}</div>
                            <div className='text-2xs text-gray-500'>{b.paymentMethod}</div>
                          </td>
                          <td className='p-3'>
                            <span
                              className={`px-2 py-0.5 rounded-full text-2xs font-bold ${
                                b.bookingStatus === 'নিশ্চিত'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : b.bookingStatus === 'অপেক্ষমাণ'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {b.bookingStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOOKINGS MANAGER */}
          {activeTab === 'bookings' && (
            <div className='space-y-6'>
              <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                <div>
                  <h2 className='text-2xl font-black text-gray-950'>বুকিং ব্যবস্থাপনা</h2>
                  <p className='text-xs text-gray-500'>অনলাইন ও অফলাইন সকল ম্যাচের তালিকা ও স্ট্যাটাস কন্ট্রোল</p>
                </div>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => exportBookingsToExcel(bookings)}
                    className='px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center cursor-pointer transition-colors'
                    title='সকল বুকিং এক্সেল ফাইলে এক্সপোর্ট করুন'
                  >
                    <FileSpreadsheet className='w-4 h-4 mr-1.5' />
                    এক্সেল এক্সপোর্ট ({bookings.length})
                  </button>
                  <button
                    onClick={() => setShowManualBookingModal(true)}
                    className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center cursor-pointer'
                  >
                    <Plus className='w-4 h-4 mr-1' />
                    নতুন ম্যানুয়াল বুকিং
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className='bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center gap-3'>
                <div className='flex-1 min-w-[200px] relative'>
                  <input
                    type='text'
                    placeholder='আইডি, গ্রাহকের নাম, ফোন বা TrxID...'
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadTabData('bookings')}
                    className='w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs outline-hidden'
                  />
                  <Search className='w-4 h-4 text-gray-400 absolute left-3 top-2.5' />
                </div>

                <select
                  value={bookingFilterStatus}
                  onChange={(e) => {
                    setBookingFilterStatus(e.target.value);
                  }}
                  className='px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold outline-hidden'
                >
                  <option value='All'>সকল স্ট্যাটাস</option>
                  <option value='নিশ্চিত'>নিশ্চিত</option>
                  <option value='অপেক্ষমাণ'>অপেক্ষমাণ</option>
                  <option value='সম্পন্ন'>সম্পন্ন</option>
                  <option value='বাতিল'>বাতিল</option>
                </select>

                <button
                  onClick={() => loadTabData('bookings')}
                  className='px-4 py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl cursor-pointer'
                >
                  ফিল্টার প্রয়োগ
                </button>
              </div>

              {/* Bookings Table */}
              <div className='bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden'>
                <div className='overflow-x-auto'>
                  <table className='w-full text-left text-xs'>
                    <thead className='bg-gray-900 text-white font-bold uppercase'>
                      <tr>
                        <th className='p-3.5'>বুকিং আইডি</th>
                        <th className='p-3.5'>গ্রাহক তথ্য</th>
                        <th className='p-3.5'>তারিখ ও স্লট</th>
                        <th className='p-3.5'>পেমেন্ট ও TrxID</th>
                        <th className='p-3.5'>বুকিং স্ট্যাটাস</th>
                        <th className='p-3.5 text-center'>অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-200 font-medium text-gray-800'>
                      {bookings.map((b) => (
                        <tr key={b.id} className='hover:bg-gray-50'>
                          <td className='p-3.5 font-mono font-bold text-red-600'>
                            {b.id}
                            <div className='text-3xs text-gray-400 font-normal'>
                              {new Date(b.createdAt).toLocaleTimeString('bn-BD', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </td>
                          <td className='p-3.5'>
                            <div className='font-bold text-gray-900'>{b.customerName}</div>
                            <div className='font-mono text-gray-600'>{b.customerPhone}</div>
                            {b.customerEmail && <div className='text-3xs text-gray-400'>{b.customerEmail}</div>}
                          </td>
                          <td className='p-3.5'>
                            <div className='font-bold'>{b.bookingDate}</div>
                            <div className='text-red-600 font-semibold'>{b.slotTime}</div>
                          </td>
                          <td className='p-3.5'>
                            <div className='font-bold text-gray-950'>৳{b.totalAmount}</div>
                            <div className='text-2xs text-gray-600'>
                              {b.paymentMethod} ({b.paymentStatus})
                            </div>
                            {b.transactionId && (
                              <div className='text-3xs font-mono bg-gray-100 p-0.5 rounded text-gray-700'>
                                Trx: {b.transactionId}
                              </div>
                            )}
                          </td>
                          <td className='p-3.5'>
                            <div className='space-y-1'>
                              <select
                                value={b.bookingStatus}
                                onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                                className={`px-2 py-1 rounded-lg text-2xs font-bold border ${
                                  b.bookingStatus === 'নিশ্চিত'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : b.bookingStatus === 'অপেক্ষমাণ'
                                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                                      : b.bookingStatus === 'সম্পন্ন'
                                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                                        : 'bg-red-50 text-red-800 border-red-300'
                                }`}
                              >
                                <option value='অপেক্ষমাণ'>অপেক্ষমাণ</option>
                                <option value='নিশ্চিত'>নিশ্চিত</option>
                                <option value='সম্পন্ন'>সম্পন্ন</option>
                                <option value='বাতিল'>বাতিল</option>
                              </select>

                              <div>
                                <select
                                  value={b.paymentStatus}
                                  onChange={(e) => handleUpdateBookingStatus(b.id, b.bookingStatus, e.target.value)}
                                  className='text-3xs text-gray-600 bg-gray-50 border rounded px-1.5 py-0.5'
                                >
                                  <option value='অপেক্ষমাণ'>পেমেন্ট: অপেক্ষমাণ</option>
                                  <option value='সফল'>পেমেন্ট: সফল</option>
                                  <option value='ব্যর্থ'>পেমেন্ট: ব্যর্থ</option>
                                  <option value='রিফান্ড'>পেমেন্ট: রিফান্ড</option>
                                </select>
                              </div>
                            </div>
                          </td>
                          <td className='p-3.5 text-center'>
                            <button
                              onClick={() => setSelectedReceiptBooking(b)}
                              className='p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold inline-flex items-center'
                              title='রসিদ দেখুন ও প্রিন্ট করুন'
                            >
                              <Printer className='w-3.5 h-3.5 text-red-600 mr-1' />
                              রসিদ
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SLOTS & PRICING */}
          {activeTab === 'slots' && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-2xl font-black text-gray-950'>টাইম স্লট ও প্রাইসিং</h2>
                  <p className='text-xs text-gray-500'>দৈনিক খেলার সময়সূচি ও রেট কনফিগারেশন</p>
                </div>
                <button
                  onClick={() =>
                    setEditingSlot({
                      startTime: '০৬:০০ PM',
                      endTime: '০৭:০০ PM',
                      playDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট',
                      slotType: 'সন্ধ্যা',
                      regularPrice: 1200,
                      isActive: true,
                    })
                  }
                  className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center'
                >
                  <Plus className='w-4 h-4 mr-1' />
                  নতুন স্লট যোগ করুন
                </button>
              </div>

              {/* Slot Cards Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {slots.map((s) => (
                  <div
                    key={s.id}
                    className='bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3 flex flex-col justify-between'
                  >
                    <div className='space-y-1'>
                      <div className='flex items-center justify-between'>
                        <span className='text-xs font-bold text-red-600 uppercase'>{s.slotType}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-2xs font-bold ${s.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {s.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </span>
                      </div>
                      <h4 className='text-lg font-black text-gray-950'>
                        {s.startTime} - {s.endTime}
                      </h4>
                      <p className='text-2xs text-gray-500'>{s.playDuration}</p>
                      <div className='text-xl font-bold text-red-600 pt-2'>৳{s.regularPrice}</div>
                    </div>

                    <div className='pt-3 border-t border-gray-100 flex items-center justify-end space-x-2'>
                      <button
                        onClick={() => setEditingSlot(s)}
                        className='p-1.5 text-gray-600 hover:text-black bg-gray-50 rounded-lg text-xs'
                      >
                        <Edit2 className='w-3.5 h-3.5' />
                      </button>
                      <button
                        onClick={() => handleDeleteSlot(s.id)}
                        className='p-1.5 text-red-600 hover:text-red-800 bg-red-50 rounded-lg text-xs'
                      >
                        <Trash2 className='w-3.5 h-3.5' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS & CMS SUITE */}
          {activeTab === 'settings' && settings && (
            <div className='space-y-6 max-w-5xl'>
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div>
                  <h2 className='text-2xl font-black text-gray-950'>ওয়েবসাইট CMS ও সিস্টেম সেটিংস</h2>
                  <p className='text-xs text-gray-600 font-medium'>
                    হিডার, ফুটার, হিরো ব্যানার, টার্ফ তথ্য, পেমেন্ট ও অ্যাডমিন পাসওয়ার্ড পরিবর্তন করুন
                  </p>
                </div>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={handleSaveSettings}
                    className='px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center'
                  >
                    <Save className='w-4 h-4 mr-1.5' />
                    সব সেটিংস সেভ করুন
                  </button>
                </div>
              </div>

              {/* Subtab Navigation Pills */}
              <div className='flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-xs'>
                {[
                  { id: 'header', label: 'হিডার ও টপবার' },
                  { id: 'hero', label: 'হিরো ব্যানার ও টেক্সট' },
                  { id: 'footer', label: 'ফুটার ও সোশ্যাল লিংক' },
                  { id: 'receipt', label: 'রসিদ ও মেমো কাস্টমাইজ' },
                  { id: 'turf', label: 'টার্ফ মাঠের তথ্য' },
                  { id: 'payments', label: 'পেমেন্ট ও পলিসি' },
                  { id: 'visibility', label: 'সেকশন অন/অফ' },
                  { id: 'security', label: 'অ্যাডমিন পাসওয়ার্ড' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type='button'
                    onClick={() => setSettingsSubTab(st.id as any)}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      settingsSubTab === st.id
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              <div className='bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6 text-xs'>
                {/* 1. Header & Topbar */}
                {settingsSubTab === 'header' && (
                  <div className='space-y-5'>
                    <div className='border-b pb-3'>
                      <h3 className='text-base font-black text-gray-900'>হিডার ও টপবার কনফিগারেশন</h3>
                      <p className='text-gray-500 text-2xs'>ওয়েবসাইটের উপরের মেনু ও ঘোষণা নিয়ন্ত্রণ করুন</p>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>প্রতিষ্ঠানের নাম (বাংলা) *</label>
                        <input
                          type='text'
                          value={settings.websiteNameBn || ''}
                          onChange={(e) => setSettings({ ...settings, websiteNameBn: e.target.value })}
                          className='w-full p-3 bg-gray-50 border border-gray-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-xl font-bold text-gray-900'
                        />
                      </div>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>প্রতিষ্ঠানের নাম (ইংরেজি) *</label>
                        <input
                          type='text'
                          value={settings.websiteNameEn || ''}
                          onChange={(e) => setSettings({ ...settings, websiteNameEn: e.target.value })}
                          className='w-full p-3 bg-gray-50 border border-gray-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-xl font-bold text-gray-900'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block font-bold text-gray-800 mb-1'>স্লোগান (Tagline)</label>
                      <input
                        type='text'
                        value={settings.tagline || ''}
                        onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                        className='w-full p-3 bg-gray-50 border border-gray-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-xl font-semibold text-gray-900'
                      />
                    </div>

                    <div className='p-4 bg-red-50/50 rounded-2xl border border-red-100 space-y-3'>
                      <div className='flex items-center justify-between'>
                        <label className='font-bold text-red-950'>টপবার ঘোষণা সক্রিয় রাখবেন?</label>
                        <input
                          type='checkbox'
                          checked={settings.isTopbarActive !== false}
                          onChange={(e) => setSettings({ ...settings, isTopbarActive: e.target.checked })}
                          className='w-5 h-5 accent-red-600 rounded cursor-pointer'
                        />
                      </div>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>টপবার ঘোষণা টেক্সট (Topbar Notice)</label>
                        <input
                          type='text'
                          value={settings.topbarText || ''}
                          onChange={(e) => setSettings({ ...settings, topbarText: e.target.value })}
                          placeholder='🎉 রমজান ও বিশেষ টুর্নামেন্ট বুকিং চলছে!...'
                          className='w-full p-3 bg-white border border-red-200 focus:border-red-600 rounded-xl font-semibold text-gray-900'
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>হিডার বুকিং বাটন টেক্সট</label>
                        <input
                          type='text'
                          value={settings.headerBookingBtnText || ''}
                          onChange={(e) => setSettings({ ...settings, headerBookingBtnText: e.target.value })}
                          placeholder='বুক নাও'
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900'
                        />
                      </div>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>হিডার সার্চ বাটন টেক্সট</label>
                        <input
                          type='text'
                          value={settings.headerSearchBtnText || ''}
                          onChange={(e) => setSettings({ ...settings, headerSearchBtnText: e.target.value })}
                          placeholder='রসিদ খুঁজুন'
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900'
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Hero Banner */}
                {settingsSubTab === 'hero' && (
                  <div className='space-y-5'>
                    <div className='border-b pb-3'>
                      <h3 className='text-base font-black text-gray-900'>হিরো ব্যানার ও টেক্সট কনফিগারেশন</h3>
                      <p className='text-gray-500 text-2xs'>ওয়েবসাইটের প্রধান ব্যানার ও মূল টেক্সট কাস্টমাইজ করুন</p>
                    </div>

                    <div>
                      <label className='block font-bold text-gray-800 mb-1'>হিরো ব্যাজ টেক্সট</label>
                      <input
                        type='text'
                        value={settings.heroBadge || ''}
                        onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                        placeholder='কুমিল্লার সেরা স্পোর্টস ও এন্টারটেইনমেন্ট জোন'
                        className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900'
                      />
                    </div>

                    <div>
                      <label className='block font-bold text-gray-800 mb-1'>হিরো প্রধান শিরোনাম (Headline)</label>
                      <input
                        type='text'
                        value={settings.heroHeadline || ''}
                        onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                        placeholder='টমছম ব্রিজ টার্ফ ও কিডস জোন'
                        className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-black text-gray-900 text-sm'
                      />
                    </div>

                    <div>
                      <label className='block font-bold text-gray-800 mb-1'>হিরো বিস্তারিত বিবরণ (Sub-headline)</label>
                      <textarea
                        rows={3}
                        value={settings.heroSubheadline || ''}
                        onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                        placeholder='আন্তর্জাতিক মানের কৃত্রিম ঘাসের ফুটবল টার্ফ এবং শিশুদের জন্য নিরাপদ ও রোমাঞ্চকর কিডস জোন।...'
                        className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-medium text-gray-900 leading-relaxed'
                      />
                    </div>

                    <div>
                      <label className='block font-bold text-gray-800 mb-1'>হিরো ইমেজ URL</label>
                      <input
                        type='text'
                        value={settings.heroImage || ''}
                        onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
                        className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-mono text-xs text-gray-900'
                      />
                      {settings.heroImage && (
                        <div className='mt-2 w-48 h-28 rounded-xl overflow-hidden border'>
                          <img src={settings.heroImage} alt='Hero Preview' className='w-full h-full object-cover' />
                        </div>
                      )}
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>হিরো বুকিং বাটন টেক্সট</label>
                        <input
                          type='text'
                          value={settings.heroBookingBtnText || ''}
                          onChange={(e) => setSettings({ ...settings, heroBookingBtnText: e.target.value })}
                          placeholder='এখনই বুক করুন'
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900'
                        />
                      </div>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>হিরো কিডস জোন বাটন টেক্সট</label>
                        <input
                          type='text'
                          value={settings.heroKidsBtnText || ''}
                          onChange={(e) => setSettings({ ...settings, heroKidsBtnText: e.target.value })}
                          placeholder='কিডস জোন দেখুন'
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900'
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Footer & Contacts */}
                {settingsSubTab === 'footer' && (
                  <div className='space-y-5'>
                    <div className='border-b pb-3'>
                      <h3 className='text-base font-black text-gray-900'>ফুটার ও যোগাযোগ তথ্য কনফিগারেশন</h3>
                      <p className='text-gray-500 text-2xs'>
                        ফুটার পরিচিতি, ঠিকানা, ফোন নম্বর ও ম্যাপ লিংক পরিবর্তন করুন
                      </p>
                    </div>

                    <div>
                      <label className='block font-bold text-gray-800 mb-1'>ফুটার পরিচিতি টেক্সট</label>
                      <textarea
                        rows={2}
                        value={settings.footerAboutText || ''}
                        onChange={(e) => setSettings({ ...settings, footerAboutText: e.target.value })}
                        placeholder='কুমিল্লার প্রাণকেন্দ্রে আন্তর্জাতিক মানের কৃত্রিম ঘাসের খেলার টার্ফ ও শিশুদের আনন্দময় বিনোদন কেন্দ্র।'
                        className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-medium text-gray-900'
                      />
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>হটলাইন মোবাইল নম্বর *</label>
                        <input
                          type='text'
                          value={settings.phone || ''}
                          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900'
                        />
                      </div>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>বিকল্প মোবাইল নম্বর</label>
                        <input
                          type='text'
                          value={settings.phoneSecondary || ''}
                          onChange={(e) => setSettings({ ...settings, phoneSecondary: e.target.value })}
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900'
                        />
                      </div>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>হোয়াটসঅ্যাপ নম্বর</label>
                        <input
                          type='text'
                          value={settings.whatsapp || ''}
                          onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900'
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>অফিসিয়াল ইমেইল</label>
                        <input
                          type='email'
                          value={settings.email || ''}
                          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-medium text-gray-900'
                        />
                      </div>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>ফেসবুক পেজ লিংক</label>
                        <input
                          type='text'
                          value={settings.facebookPageUrl || ''}
                          onChange={(e) => setSettings({ ...settings, facebookPageUrl: e.target.value })}
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-mono text-xs text-gray-900'
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>সম্পূর্ণ ঠিকানা (বাংলা)</label>
                        <input
                          type='text'
                          value={settings.addressBn || ''}
                          onChange={(e) => setSettings({ ...settings, addressBn: e.target.value })}
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900'
                        />
                      </div>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>ল্যান্ডমার্ক নির্দেশক</label>
                        <input
                          type='text'
                          value={settings.locationLandmark || ''}
                          onChange={(e) => setSettings({ ...settings, locationLandmark: e.target.value })}
                          placeholder='টমছম ব্রিজ মাজার গেট সংলগ্ন...'
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-medium text-gray-900'
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>
                          গুগল ম্যাপ সরাসরি লিংক (Direct URL)
                        </label>
                        <input
                          type='text'
                          value={settings.googleMapDirectLink || ''}
                          onChange={(e) => setSettings({ ...settings, googleMapDirectLink: e.target.value })}
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-mono text-xs text-gray-900'
                        />
                      </div>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>গুগল ম্যাপ এমবেড কোড / URL</label>
                        <input
                          type='text'
                          value={settings.googleMapEmbedUrl || ''}
                          onChange={(e) => setSettings({ ...settings, googleMapEmbedUrl: e.target.value })}
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-mono text-xs text-gray-900'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block font-bold text-gray-800 mb-1'>কপিরাইট লাইন (Footer Copyright)</label>
                      <input
                        type='text'
                        value={settings.footerCopyrightText || ''}
                        onChange={(e) => setSettings({ ...settings, footerCopyrightText: e.target.value })}
                        placeholder='© ২০২৬ টমছম ব্রিজ টার্ফ ও কিডস জোন। সর্বস্বত্ব সংরক্ষিত।'
                        className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-medium text-gray-900'
                      />
                    </div>
                  </div>
                )}

                {/* 3.5. Receipt Customization (Super Admin) */}
                {settingsSubTab === 'receipt' && (
                  <div className='space-y-6'>
                    <div className='border-b pb-3 flex flex-col sm:flex-row justify-between sm:items-center gap-2'>
                      <div>
                        <h3 className='text-base font-black text-gray-900'>
                          অফিসিয়াল বুকিং রসিদ / ভাউচার কাস্টমাইজেশন
                        </h3>
                        <p className='text-gray-500 text-2xs'>
                          রসিদের হেডার টাইটেল, ঠিকানা, যোগাযোগের টেক্সট, অনুমোদিত সিল এবং টার্মস ও কন্ডিশন পরিবর্তন করুন
                        </p>
                      </div>
                      <span className='self-start sm:self-auto px-3 py-1 bg-red-100 text-red-700 font-bold text-2xs rounded-full'>
                        সুপার অ্যাডমিন কন্ট্রোল
                      </span>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>
                          রসিদের মূল হেডার টাইটেল (Title on Voucher)
                        </label>
                        <input
                          type='text'
                          value={settings.receiptHeaderTitle || ''}
                          onChange={(e) => setSettings({ ...settings, receiptHeaderTitle: e.target.value })}
                          placeholder='TOMSOM BRIDGE TURF & KIDS ZONE'
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900'
                        />
                        <span className='text-3xs text-gray-500 mt-1 block'>
                          রসিদের একদম উপরে বড় অক্ষরে প্রদর্শিত নাম।
                        </span>
                      </div>

                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>রসিদ সাব-হেডার / লোকেশন লাইন</label>
                        <input
                          type='text'
                          value={settings.receiptHeaderSubtitle || ''}
                          onChange={(e) => setSettings({ ...settings, receiptHeaderSubtitle: e.target.value })}
                          placeholder='Madhya Ashrafpur, Mazar Gate (Near Tomsom Bridge), Cumilla'
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-medium text-gray-900'
                        />
                        <span className='text-3xs text-gray-500 mt-1 block'>হেডারের নিচে রসিদের ঠিকানা লাইন।</span>
                      </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>রসিদ যোগাযোগ ও হটলাইন টেক্সট</label>
                        <input
                          type='text'
                          value={settings.receiptContactText || ''}
                          onChange={(e) => setSettings({ ...settings, receiptContactText: e.target.value })}
                          placeholder='Phone: 01819000000 | Web: tomsomturf.com'
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-mono text-xs text-gray-900'
                        />
                        <span className='text-3xs text-gray-500 mt-1 block'>
                          রসিদের হেডারে প্রদর্শিত হেল্পলাইন ও ওয়েবসাইট টেক্সট।
                        </span>
                      </div>

                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>
                          অনুমোদিত স্বাক্ষর ও সিলের টেক্সট (Seal Text)
                        </label>
                        <input
                          type='text'
                          value={settings.receiptAuthorizedSealText || ''}
                          onChange={(e) => setSettings({ ...settings, receiptAuthorizedSealText: e.target.value })}
                          placeholder='অফিসিয়াল অনুমোদিত ডিজিটাল ভাউচার'
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900'
                        />
                        <span className='text-3xs text-gray-500 mt-1 block'>
                          স্বাক্ষর লাইনের নিচে প্রদর্শিত সিল বা অথরাইজেশন টেক্সট।
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className='block font-bold text-gray-800 mb-1'>
                        রসিদের ফুটার কৃতজ্ঞতা বার্তা (Thank You Note)
                      </label>
                      <input
                        type='text'
                        value={settings.receiptFooterNote || ''}
                        onChange={(e) => setSettings({ ...settings, receiptFooterNote: e.target.value })}
                        placeholder='ধন্যবাদ! টমছম ব্রিজ টার্ফ ও কিডস জোনে আপনাকে স্বাগতম।'
                        className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-medium text-gray-900'
                      />
                    </div>

                    {/* Receipt Rules list manager */}
                    <div className='space-y-3 p-4 bg-gray-50 rounded-2xl border border-gray-200'>
                      <label className='block font-black text-gray-900'>
                        রসিদে প্রদর্শিত টার্ফ নিয়মাবলী ও নির্দেশিকা (Receipt Rules)
                      </label>
                      <div className='space-y-2'>
                        {(settings.receiptFooterRules || []).map((rule, idx) => (
                          <div key={idx} className='flex items-center gap-2'>
                            <span className='font-bold text-gray-500 w-6 text-center'>{idx + 1}.</span>
                            <input
                              type='text'
                              value={rule}
                              onChange={(e) => {
                                const updated = [...(settings.receiptFooterRules || [])];
                                updated[idx] = e.target.value;
                                setSettings({ ...settings, receiptFooterRules: updated });
                              }}
                              className='flex-1 p-2 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-900'
                            />
                            <button
                              type='button'
                              onClick={() => {
                                const updated = (settings.receiptFooterRules || []).filter((_, i) => i !== idx);
                                setSettings({ ...settings, receiptFooterRules: updated });
                              }}
                              className='p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer'
                              title='এই নিয়মটি মুছুন'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className='flex gap-2 pt-2'>
                        <input
                          type='text'
                          placeholder='নতুন নিয়ম বা শর্ত লিখুন...'
                          value={newReceiptRuleText}
                          onChange={(e) => setNewReceiptRuleText(e.target.value)}
                          className='flex-1 p-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 font-medium'
                        />
                        <button
                          type='button'
                          onClick={() => {
                            if (!newReceiptRuleText.trim()) return;
                            const updated = [...(settings.receiptFooterRules || []), newReceiptRuleText.trim()];
                            setSettings({ ...settings, receiptFooterRules: updated });
                            setNewReceiptRuleText('');
                          }}
                          className='px-4 py-2.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl flex items-center cursor-pointer'
                        >
                          <Plus className='w-4 h-4 mr-1' />
                          নিয়ম যোগ করুন
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Turf Specs */}
                {settingsSubTab === 'turf' && turfInfo && (
                  <div className='space-y-5'>
                    <div className='border-b pb-3'>
                      <h3 className='text-base font-black text-gray-900'>টার্ফ মাঠের পূর্ণ তথ্য ও স্পেসিফিকেশন</h3>
                      <p className='text-gray-500 text-2xs'>মাঠের সাইজ, ঘাসের মান ও শিডিউল আপডেট করুন</p>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>মাঠের সাইজ ও ডাইমেনশন</label>
                        <input
                          type='text'
                          value={turfInfo.size || ''}
                          onChange={(e) => setTurfInfo({ ...turfInfo, size: e.target.value })}
                          placeholder='100ft x 60ft (7A Side)'
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900'
                        />
                      </div>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>ঘাসের ধরন ও মান</label>
                        <input
                          type='text'
                          value={turfInfo.turfType || ''}
                          onChange={(e) => setTurfInfo({ ...turfInfo, turfType: e.target.value })}
                          placeholder='FIFA Approved 50mm Monofilament Synthetic Grass'
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900'
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>ফ্লাডলাইট ব্যবস্থা</label>
                        <input
                          type='text'
                          value={turfInfo.lighting || ''}
                          onChange={(e) => setTurfInfo({ ...turfInfo, lighting: e.target.value })}
                          placeholder='High Lumen Commercial LED Floodlights'
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900'
                        />
                      </div>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>ধারণক্ষমতা (খেলোয়াড়/দর্শক)</label>
                        <input
                          type='text'
                          value={turfInfo.capacity || ''}
                          onChange={(e) => setTurfInfo({ ...turfInfo, capacity: e.target.value })}
                          placeholder='14 Players (7 vs 7) + 50 Spectators'
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900'
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>খোলার সময় (সকাল)</label>
                        <input
                          type='text'
                          value={turfInfo.openingTime || ''}
                          onChange={(e) => setTurfInfo({ ...turfInfo, openingTime: e.target.value })}
                          placeholder='০৬:০০ AM'
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900'
                        />
                      </div>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>বন্ধের সময় (রাত)</label>
                        <input
                          type='text'
                          value={turfInfo.closingTime || ''}
                          onChange={(e) => setTurfInfo({ ...turfInfo, closingTime: e.target.value })}
                          placeholder='১২:০০ AM (মধ্যরাত)'
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block font-bold text-gray-800 mb-1'>টার্ফের বিস্তারিত বিবরণ</label>
                      <textarea
                        rows={3}
                        value={turfInfo.description || ''}
                        onChange={(e) => setTurfInfo({ ...turfInfo, description: e.target.value })}
                        className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-medium text-gray-900 leading-relaxed'
                      />
                    </div>
                  </div>
                )}

                {/* 5. Payments & Policies */}
                {settingsSubTab === 'payments' && (
                  <div className='space-y-5'>
                    <div className='border-b pb-3'>
                      <h3 className='text-base font-black text-gray-900'>পেমেন্ট গেটওয়ে ও বুকিং নীতিমালা</h3>
                      <p className='text-gray-500 text-2xs'>বিকাশ, নগদ, রকেট নম্বর ও বাতিলের নিয়ম সেট করুন</p>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                      <div className='p-4 bg-pink-50 rounded-2xl border border-pink-200 space-y-2'>
                        <label className='block font-black text-pink-900'>বিকাশ নম্বর</label>
                        <input
                          type='text'
                          value={settings.bkashNumber || ''}
                          onChange={(e) => setSettings({ ...settings, bkashNumber: e.target.value })}
                          className='w-full p-2.5 bg-white border border-pink-300 rounded-xl font-mono font-bold text-gray-900'
                        />
                        <input
                          type='text'
                          value={settings.bkashType || 'মার্চেন্ট / পার্সোনাল'}
                          onChange={(e) => setSettings({ ...settings, bkashType: e.target.value })}
                          placeholder='ধরন (উদাঃ পার্সোনাল/মার্চেন্ট)'
                          className='w-full p-2 bg-white border border-pink-200 rounded-lg text-2xs font-semibold text-gray-700'
                        />
                      </div>

                      <div className='p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2'>
                        <label className='block font-black text-amber-900'>নগদ নম্বর</label>
                        <input
                          type='text'
                          value={settings.nagadNumber || ''}
                          onChange={(e) => setSettings({ ...settings, nagadNumber: e.target.value })}
                          className='w-full p-2.5 bg-white border border-amber-300 rounded-xl font-mono font-bold text-gray-900'
                        />
                        <input
                          type='text'
                          value={settings.nagadType || 'পার্সোনাল'}
                          onChange={(e) => setSettings({ ...settings, nagadType: e.target.value })}
                          placeholder='ধরন (উদাঃ পার্সোনাল)'
                          className='w-full p-2 bg-white border border-amber-200 rounded-lg text-2xs font-semibold text-gray-700'
                        />
                      </div>

                      <div className='p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2'>
                        <label className='block font-black text-purple-900'>রকেট নম্বর</label>
                        <input
                          type='text'
                          value={settings.rocketNumber || ''}
                          onChange={(e) => setSettings({ ...settings, rocketNumber: e.target.value })}
                          className='w-full p-2.5 bg-white border border-purple-300 rounded-xl font-mono font-bold text-gray-900'
                        />
                        <input
                          type='text'
                          value={settings.rocketType || 'পার্সোনাল'}
                          onChange={(e) => setSettings({ ...settings, rocketType: e.target.value })}
                          placeholder='ধরন (উদাঃ পার্সোনাল)'
                          className='w-full p-2 bg-white border border-purple-200 rounded-lg text-2xs font-semibold text-gray-700'
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>বুকিং বাতিলের নোটিশ সময় (দিন)</label>
                        <input
                          type='number'
                          value={settings.cancellationNoticeDays || 1}
                          onChange={(e) => setSettings({ ...settings, cancellationNoticeDays: Number(e.target.value) })}
                          className='w-full p-3 bg-gray-50 border border-gray-300 rounded-xl font-bold text-gray-900'
                        />
                        <p className='text-2xs text-gray-500 mt-1'>
                          ম্যাচের কতদিন পূর্বে বাতিল করলে রিফান্ড গ্রহণযোগ্য হবে
                        </p>
                      </div>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>বাতিল ও রিফান্ড নীতিমালা টেক্সট</label>
                        <textarea
                          rows={2}
                          value={settings.cancellationPolicyText || ''}
                          onChange={(e) => setSettings({ ...settings, cancellationPolicyText: e.target.value })}
                          placeholder='ম্যাচ শুরুর কমপক্ষে ২৪ ঘণ্টা আগে অবহিত করলে স্লট রি-শিডিউল বা রিফান্ড প্রযোজ্য হবে।'
                          className='w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-medium text-gray-900'
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Section Visibility Toggles */}
                {settingsSubTab === 'visibility' && (
                  <div className='space-y-5'>
                    <div className='border-b pb-3'>
                      <h3 className='text-base font-black text-gray-900'>ওয়েবসাইট সেকশন অন/অফ ভিজিবিলিটি</h3>
                      <p className='text-gray-500 text-2xs'>
                        যে সেকশনগুলো ওয়েবসাইটে দেখাতে চান তা সক্রিয় বা বন্ধ রাখুন
                      </p>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                      {[
                        { key: 'showHero', label: 'হিরো ব্যানার সেকশন' },
                        { key: 'showQuickBooking', label: 'দ্রুত বুকিং বার' },
                        { key: 'showAbout', label: 'পরিচিতি সেকশন' },
                        { key: 'showBooking', label: 'অনলাইন স্লট বুকিং' },
                        { key: 'showPricing', label: 'মূল্য তালিকা ও প্যাকেজ' },
                        { key: 'showKidsZone', label: 'কিডস জোন সেকশন' },
                        { key: 'showFacilities', label: 'সুযোগ-সুবিধাসমূহ' },
                        { key: 'showGallery', label: 'ছবির গ্যালারি' },
                        { key: 'showEvents', label: 'টুর্নামেন্ট ও ইভেন্টস' },
                        { key: 'showReviews', label: 'গ্রাহকদের রিভিউ' },
                        { key: 'showFaq', label: 'সাধারণ প্রশ্নাবলী (FAQ)' },
                        { key: 'showContact', label: 'যোগাযোগ ও ম্যাপ' },
                      ].map((item) => (
                        <div
                          key={item.key}
                          className='p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between'
                        >
                          <span className='font-bold text-gray-800'>{item.label}</span>
                          <input
                            type='checkbox'
                            checked={settings.sectionVisibility?.[item.key] !== false}
                            onChange={(e) => {
                              const updatedVis = {
                                ...(settings.sectionVisibility || {}),
                                [item.key]: e.target.checked,
                              };
                              setSettings({ ...settings, sectionVisibility: updatedVis });
                            }}
                            className='w-5 h-5 accent-red-600 rounded cursor-pointer'
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. Security & Admin Password Change */}
                {settingsSubTab === 'security' && (
                  <div className='space-y-5'>
                    <div className='border-b pb-3'>
                      <h3 className='text-base font-black text-gray-900'>অ্যাডমিন পাসওয়ার্ড ও নিরাপত্তা পরিবর্তন</h3>
                      <p className='text-gray-500 text-2xs'>অ্যাডমিন প্যানেলে লগইনের জন্য নতুন পাসওয়ার্ড সেট করুন</p>
                    </div>

                    <form onSubmit={handleChangePassword} className='max-w-md space-y-4'>
                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>নতুন পাসওয়ার্ড (New Password) *</label>
                        <input
                          type='password'
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder='কমপক্ষে ৬ অক্ষর...'
                          className='w-full p-3 bg-gray-50 border border-gray-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-xl font-mono text-gray-900'
                        />
                      </div>

                      <div>
                        <label className='block font-bold text-gray-800 mb-1'>নতুন পাসওয়ার্ড নিশ্চিত করুন *</label>
                        <input
                          type='password'
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder='আবারও একই পাসওয়ার্ড লিখুন...'
                          className='w-full p-3 bg-gray-50 border border-gray-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-xl font-mono text-gray-900'
                        />
                      </div>

                      <button
                        type='submit'
                        className='px-6 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center'
                      >
                        <Key className='w-4 h-4 mr-1.5' />
                        পাসওয়ার্ড আপডেট করুন
                      </button>
                    </form>
                  </div>
                )}

                {/* Bottom Save CTA */}
                <div className='pt-6 border-t border-gray-200 flex items-center justify-between'>
                  <span className='text-gray-500 text-2xs font-medium'>পরিবর্তন সম্পন্ন হলে সেভ বাটনে চাপ দিন</span>
                  <button
                    type='button'
                    onClick={handleSaveSettings}
                    className='px-7 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-red-600/30 transition-all cursor-pointer flex items-center'
                  >
                    <Save className='w-4 h-4 mr-2' />
                    সব সেটিংস সেভ করুন
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KIDS ZONE */}
          {activeTab === 'kids' && kidsZoneInfo && (
            <div className='space-y-6 max-w-3xl'>
              <div>
                <h2 className='text-2xl font-black text-gray-950'>কিডস জোন কনফিগারেশন</h2>
                <p className='text-xs text-gray-500'>রাইডস, বয়স সীমা ও নিরাপত্তা নিয়মাবলী</p>
              </div>

              <form
                onSubmit={handleSaveKidsZone}
                className='bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4 text-xs'
              >
                <div>
                  <label className='block font-bold text-gray-700 mb-1'>বয়স সীমা</label>
                  <input
                    type='text'
                    value={kidsZoneInfo.ageGroup}
                    onChange={(e) => setKidsZoneInfo({ ...kidsZoneInfo, ageGroup: e.target.value })}
                    className='w-full p-2.5 bg-gray-50 border rounded-xl font-bold'
                  />
                </div>

                <div>
                  <label className='block font-bold text-gray-700 mb-1'>টিকিট মূল্য (প্রতি ঘণ্টা)</label>
                  <input
                    type='number'
                    value={kidsZoneInfo.ticketPricePerHour}
                    onChange={(e) => setKidsZoneInfo({ ...kidsZoneInfo, ticketPricePerHour: Number(e.target.value) })}
                    className='w-full p-2.5 bg-gray-50 border rounded-xl font-bold'
                  />
                </div>

                <div>
                  <label className='block font-bold text-gray-700 mb-1'>বিবরণ</label>
                  <textarea
                    rows={3}
                    value={kidsZoneInfo.description}
                    onChange={(e) => setKidsZoneInfo({ ...kidsZoneInfo, description: e.target.value })}
                    className='w-full p-2.5 bg-gray-50 border rounded-xl'
                  />
                </div>

                <div className='pt-2'>
                  <button type='submit' className='px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl'>
                    কিডস জোন সেভ করুন
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: COUPONS & OFFERS */}
          {activeTab === 'coupons' && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-2xl font-black text-gray-950'>কুপন ও স্পেশাল অফার</h2>
                  <p className='text-xs text-gray-500'>প্রোমো কোড এবং ডিসকাউন্ট ক্যাম্পেইন</p>
                </div>
                <div className='flex space-x-2'>
                  <button
                    onClick={() =>
                      setEditingCoupon({
                        code: 'PROMO100',
                        fixedDiscount: 100,
                        discountPercentage: 0,
                        minBookingAmount: 1000,
                        startDate: '2026-01-01',
                        endDate: '2026-12-31',
                        usageLimit: 100,
                        usedCount: 0,
                        isActive: true,
                      })
                    }
                    className='px-3.5 py-2 bg-red-600 text-white font-bold text-xs rounded-xl flex items-center'
                  >
                    <Plus className='w-4 h-4 mr-1' />
                    নতুন কুপন
                  </button>

                  <button
                    onClick={() =>
                      setEditingOffer({
                        title: 'নতুন সিজন অফার',
                        description: 'সকল নাইট ম্যাচে স্পেশাল ছাড়',
                        discountText: '৳১০০ ফ্ল্যাট অফ',
                        isActive: true,
                      })
                    }
                    className='px-3.5 py-2 bg-black text-white font-bold text-xs rounded-xl flex items-center'
                  >
                    <Plus className='w-4 h-4 mr-1' />
                    নতুন অফার ব্যানার
                  </button>
                </div>
              </div>

              {/* Coupons List */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {coupons.map((c) => (
                  <div key={c.id} className='bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='font-mono font-black text-lg text-red-600'>{c.code}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-2xs font-bold ${c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {c.isActive ? 'সক্রিয়' : 'বন্ধ'}
                      </span>
                    </div>
                    <div className='text-xs text-gray-700'>
                      ছাড়:{' '}
                      <strong>{c.fixedDiscount ? `৳${c.fixedDiscount} ফ্ল্যাট` : `${c.discountPercentage}%`}</strong>
                    </div>
                    <div className='text-2xs text-gray-500'>
                      ব্যবহার: {c.usedCount} / {c.usageLimit || 'আনলিমিটেড'} বার
                    </div>
                    <div className='pt-2 flex justify-end space-x-2 border-t'>
                      <button onClick={() => handleDeleteCoupon(c.id)} className='p-1 text-red-600 hover:text-red-800'>
                        <Trash2 className='w-3.5 h-3.5' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CUSTOMERS CRM */}
          {activeTab === 'customers' && (
            <div className='space-y-6'>
              <div>
                <h2 className='text-2xl font-black text-gray-950'>কাস্টমার ডাটাবেস (CRM)</h2>
                <p className='text-xs text-gray-500'>খেলোয়াড় ও গ্রাহকদের বুকিং হিস্ট্রি ও পরিসংখ্যান</p>
              </div>

              <div className='bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden'>
                <table className='w-full text-left text-xs'>
                  <thead className='bg-gray-900 text-white font-bold uppercase'>
                    <tr>
                      <th className='p-3.5'>গ্রাহকের নাম</th>
                      <th className='p-3.5'>মোবাইল</th>
                      <th className='p-3.5'>মোট ম্যাচ</th>
                      <th className='p-3.5'>মোট ব্যয় (টাকা)</th>
                      <th className='p-3.5'>সর্বশেষ বুকিং</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 font-medium'>
                    {customers.map((c, i) => (
                      <tr key={i} className='hover:bg-gray-50'>
                        <td className='p-3.5 font-bold text-gray-950'>{c.name}</td>
                        <td className='p-3.5 font-mono text-gray-700'>{c.phone}</td>
                        <td className='p-3.5 font-bold text-red-600'>{c.totalBookings} টি</td>
                        <td className='p-3.5 font-bold text-gray-900'>৳{c.totalSpent}</td>
                        <td className='p-3.5 text-gray-500'>{c.lastBookingDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: EVENTS */}
          {activeTab === 'events' && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-2xl font-black text-gray-950'>টুর্নামেন্ট ও ইভেন্ট</h2>
                  <p className='text-xs text-gray-500'>প্রতিযোগিতা শিডিউল ও ফলাফল</p>
                </div>
                <button
                  onClick={() =>
                    setEditingEvent({
                      title: 'টমছম প্রিমিয়ার কাপ ২০২৬',
                      type: 'টুর্নামেন্ট',
                      date: '২০২৬-০৯-১০',
                      time: 'বিকাল ০৪:০০ টা',
                      description: '১৬ দলের নকআউট ফুটবল যুদ্ধ।',
                      registrationStatus: 'চলমান',
                      entryFee: 3000,
                      prizeMoney: '৳২০,০০০ + ট্রফি',
                    })
                  }
                  className='px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl flex items-center'
                >
                  <Plus className='w-4 h-4 mr-1' />
                  নতুন টুর্নামেন্ট যোগ
                </button>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {events.map((evt) => (
                  <div key={evt.id} className='bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2'>
                    <div className='flex justify-between items-start'>
                      <h4 className='font-bold text-base text-gray-950'>{evt.title}</h4>
                      <button onClick={() => handleDeleteEvent(evt.id)} className='text-red-600'>
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                    <p className='text-xs text-gray-600'>{evt.description}</p>
                    <div className='text-2xs text-gray-500'>
                      তারিখ: {evt.date} | সময়: {evt.time}
                    </div>
                    <div className='text-xs font-bold text-red-600'>পুরস্কার: {evt.prizeMoney}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: GALLERY */}
          {activeTab === 'gallery' && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-2xl font-black text-gray-950'>গ্যালারি মিডিয়া</h2>
                  <p className='text-xs text-gray-500'>ছবি আপলোড ও গ্যালারি সাজানো</p>
                </div>
                <button
                  onClick={() => setShowGalleryModal(true)}
                  className='px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl flex items-center'
                >
                  <Plus className='w-4 h-4 mr-1' />
                  নতুন ছবি যোগ
                </button>
              </div>

              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                {gallery.map((g) => (
                  <div key={g.id} className='bg-white rounded-xl border overflow-hidden relative group'>
                    <img src={g.imageUrl} alt={g.title} className='w-full h-36 object-cover' />
                    <div className='p-2 text-2xs font-bold'>
                      {g.title} ({g.category})
                    </div>
                    <button
                      onClick={() => handleDeleteGallery(g.id)}
                      className='absolute top-2 right-2 bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                      <Trash2 className='w-3.5 h-3.5' />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className='space-y-6'>
              <div>
                <h2 className='text-2xl font-black text-gray-950'>রিভিউ মডারেশন</h2>
                <p className='text-xs text-gray-500'>ওয়েবসাইটে প্রদর্শনের জন্য গ্রাহকের রিভিউ অনুমোদন বা বাতিল</p>
              </div>

              <div className='space-y-3'>
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className='bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center justify-between'
                  >
                    <div className='space-y-1 text-xs'>
                      <div className='font-bold text-gray-900'>
                        {r.customerName} (রেটিং: {r.rating}★)
                      </div>
                      <p className='text-gray-600'>"{r.comment}"</p>
                      <span className='text-3xs text-gray-400'>তারিখ: {r.date}</span>
                    </div>

                    <div className='flex items-center space-x-2'>
                      <select
                        value={r.status}
                        onChange={(e) => handleUpdateReviewStatus(r.id, e.target.value)}
                        className='text-xs p-1.5 border rounded-lg font-bold'
                      >
                        <option value='Approved'>অনুমোদিত (Approved)</option>
                        <option value='Pending'>অপেক্ষমাণ (Pending)</option>
                        <option value='Rejected'>বাতিল (Rejected)</option>
                      </select>
                      <button onClick={() => handleDeleteReview(r.id)} className='text-red-600 p-1'>
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: REPORTS */}
          {activeTab === 'reports' && reports && (
            <div className='space-y-6'>
              <div>
                <h2 className='text-2xl font-black text-gray-950'>আয়-ব্যয় ও বিক্রয় রিপোর্ট</h2>
                <p className='text-xs text-gray-500'>পেমেন্ট গেটওয়ে ও স্লটভিত্তিক আয় বিশ্লেষণ</p>
              </div>

              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                <div className='bg-white p-4 rounded-xl border'>
                  <div className='text-2xs text-gray-500'>বিকাশ থেকে আয়</div>
                  <div className='text-xl font-bold text-pink-600'>৳{reports.bKashRevenue}</div>
                </div>
                <div className='bg-white p-4 rounded-xl border'>
                  <div className='text-2xs text-gray-500'>নগদ থেকে আয়</div>
                  <div className='text-xl font-bold text-amber-600'>৳{reports.nagadRevenue}</div>
                </div>
                <div className='bg-white p-4 rounded-xl border'>
                  <div className='text-2xs text-gray-500'>রকেট থেকে আয়</div>
                  <div className='text-xl font-bold text-purple-600'>৳{reports.rocketRevenue}</div>
                </div>
                <div className='bg-white p-4 rounded-xl border'>
                  <div className='text-2xs text-gray-500'>ক্যাশ কাউন্টার থেকে আয়</div>
                  <div className='text-xl font-bold text-emerald-600'>৳{reports.cashRevenue}</div>
                </div>
              </div>

              {/* Popular Slots */}
              <div className='bg-white p-6 rounded-2xl border space-y-3'>
                <h4 className='font-bold text-sm text-gray-900'>সবচেয়ে চাহিদাসম্পন্ন সময়সূচি (Popular Slots)</h4>
                <div className='space-y-2'>
                  {reports.popularSlots?.map((slot: any, idx: number) => (
                    <div key={idx} className='flex justify-between text-xs py-1 border-b'>
                      <span>{slot.slotTime}</span>
                      <span className='font-bold text-red-600'>{slot.count} বার বুকড</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: STAFF */}
          {activeTab === 'staff' && (
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <h2 className='text-2xl font-black text-gray-950'>স্টাফ ও রোল ব্যবস্থাপনা</h2>
                  <p className='text-xs text-gray-500'>অ্যাডমিন ও সাব-অ্যাডমিন অ্যাকাউন্টস</p>
                </div>
                <button
                  onClick={() => setShowStaffModal(true)}
                  className='px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl flex items-center'
                >
                  <UserPlus className='w-4 h-4 mr-1' />
                  নতুন স্টাফ যোগ
                </button>
              </div>

              <div className='bg-white rounded-2xl border overflow-hidden'>
                <table className='w-full text-left text-xs'>
                  <thead className='bg-gray-900 text-white font-bold uppercase'>
                    <tr>
                      <th className='p-3.5'>ইউজারনেম</th>
                      <th className='p-3.5'>নাম</th>
                      <th className='p-3.5'>রোল</th>
                      <th className='p-3.5 text-right'>অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {staff.map((st) => (
                      <tr key={st.id} className='hover:bg-gray-50'>
                        <td className='p-3.5 font-bold font-mono text-gray-900'>{st.username}</td>
                        <td className='p-3.5'>{st.name}</td>
                        <td className='p-3.5'>
                          <span className='bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold text-2xs'>
                            {st.role}
                          </span>
                        </td>
                        <td className='p-3.5 text-right'>
                          {st.username !== 'admin' && (
                            <button onClick={() => handleDeleteStaff(st.id)} className='text-red-600'>
                              <Trash2 className='w-4 h-4' />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 13: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className='space-y-6 max-w-xl'>
              <div>
                <h2 className='text-2xl font-black text-gray-950'>ডাটাবেস ব্যাকআপ ও রিস্টোর</h2>
                <p className='text-xs text-gray-500'>আপনার পুরো ওয়েবসাইটের ডাটা নিরাপদ রাখুন</p>
              </div>

              <div className='bg-white p-6 rounded-2xl border space-y-4'>
                <h4 className='font-bold text-sm text-gray-900'>ইনস্ট্যান্ট ব্যাকআপ ডাউনলোড</h4>
                <p className='text-xs text-gray-600'>
                  সকল বুকিং, সেটিংস, কাস্টমার তথ্য এবং কনফিগারেশনের একটি সম্পূর্ণ JSON ব্যাকআপ ডাউনলোড করুন।
                </p>
                <button
                  onClick={handleDownloadBackup}
                  className='px-5 py-2.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl flex items-center cursor-pointer'
                >
                  <Download className='w-4 h-4 mr-2 text-red-500' />
                  JSON ব্যাকআপ ডাউনলোড করুন
                </button>
              </div>

              <div className='bg-white p-6 rounded-2xl border space-y-4'>
                <h4 className='font-bold text-sm text-gray-900'>ডাটাবেস রিস্টোর করুন</h4>
                <p className='text-xs text-gray-600'>
                  পূর্বে ডাউনলোড করা JSON ফাইল আপলোড করে সম্পূর্ণ সিস্টেম আগের অবস্থায় ফিরিয়ে আনুন।
                </p>
                <label className='inline-flex items-center px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer'>
                  <Upload className='w-4 h-4 mr-2' />
                  JSON ফাইল নির্বাচন ও রিস্টোর
                  <input type='file' accept='.json' onChange={handleRestoreBackupFile} className='hidden' />
                </label>
              </div>

              {/* cPanel Deployment Card */}
              <div className='bg-gradient-to-br from-red-50 to-white p-6 rounded-2xl border-2 border-red-200 space-y-4'>
                <div className='flex items-center justify-between'>
                  <h4 className='font-black text-sm text-red-950 flex items-center'>
                    <Download className='w-4 h-4 mr-2 text-red-600' />
                    cPanel / public_html রেডি প্যাকেজ (ZIP)
                  </h4>
                  <span className='bg-red-600 text-white text-2xs px-2.5 py-0.5 rounded-full font-bold'>
                    ১ ক্লিকে ব্রাউজার ডাউনলোড
                  </span>
                </div>
                <p className='text-xs text-gray-700 leading-relaxed'>
                  এই প্যাকেজে সম্পূর্ণ প্রস্তুতকৃত <code className='bg-red-100 px-1 rounded font-bold'>index.html</code>
                  , <code className='bg-red-100 px-1 rounded font-bold'>.htaccess</code> এবং{' '}
                  <code className='bg-red-100 px-1 rounded font-bold'>assets/</code> ফোল্ডার সাজানো রয়েছে। এটি নামিয়ে
                  সরাসরি cPanel-এর <code className='bg-gray-200 px-1 rounded font-bold'>public_html</code> এ
                  এক্সট্র্যাক্ট করে দিলেই সাইট সাথে সাথে চালু হবে।
                </p>
                <button
                  onClick={handleCpanelExport}
                  disabled={cpanelExporting}
                  className={`inline-flex items-center px-5 py-3 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer ${
                    cpanelExporting
                      ? 'bg-amber-500 text-white cursor-wait'
                      : 'bg-red-600 hover:bg-red-700 active:scale-95 text-white'
                  }`}
                >
                  {cpanelExporting ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin text-white' />
                      {cpanelStatus || 'তৈরি হচ্ছে...'}
                    </>
                  ) : (
                    <>
                      <Download className='w-4 h-4 mr-2 text-white' />
                      cPanel ZIP ফাইল ডাউনলোড করুন
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 14: ACTIVITY LOGS */}
          {activeTab === 'logs' && (
            <div className='space-y-6'>
              <div>
                <h2 className='text-2xl font-black text-gray-950'>কার্যক্রম ও অডিট লগ</h2>
                <p className='text-xs text-gray-500'>অ্যাডমিনদের দ্বারা সম্পাদিত পরিবর্তনের রেকর্ড</p>
              </div>

              <div className='bg-white rounded-2xl border overflow-hidden'>
                <table className='w-full text-left text-xs'>
                  <thead className='bg-gray-900 text-white font-bold uppercase'>
                    <tr>
                      <th className='p-3'>সময়</th>
                      <th className='p-3'>ইউজার</th>
                      <th className='p-3'>অ্যাকশন</th>
                      <th className='p-3'>বিবরণ</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200'>
                    {activityLogs.map((log) => (
                      <tr key={log.id} className='hover:bg-gray-50'>
                        <td className='p-3 text-gray-500'>{new Date(log.timestamp).toLocaleString('bn-BD')}</td>
                        <td className='p-3 font-bold text-red-600'>{log.performedBy}</td>
                        <td className='p-3 font-bold text-gray-900'>{log.action}</td>
                        <td className='p-3 text-gray-600'>{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Manual Booking Modal */}
      {showManualBookingModal && (
        <div className='fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto'>
            <h3 className='text-lg font-bold text-gray-950'>কাউন্টার ম্যানুয়াল বুকিং তৈরি করুন</h3>
            <form onSubmit={handleCreateManualBooking} className='space-y-3 text-xs'>
              <div>
                <label className='block font-bold mb-1'>গ্রাহকের নাম *</label>
                <input
                  type='text'
                  required
                  value={manualData.customerName}
                  onChange={(e) => setManualData({ ...manualData, customerName: e.target.value })}
                  className='w-full p-2 border rounded-lg'
                />
              </div>

              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <label className='block font-bold mb-1'>মোবাইল নম্বর *</label>
                  <input
                    type='tel'
                    required
                    value={manualData.customerPhone}
                    onChange={(e) => setManualData({ ...manualData, customerPhone: e.target.value })}
                    className='w-full p-2 border rounded-lg'
                  />
                </div>
                <div>
                  <label className='block font-bold mb-1'>খেলার তারিখ *</label>
                  <input
                    type='date'
                    required
                    value={manualData.bookingDate}
                    onChange={(e) => setManualData({ ...manualData, bookingDate: e.target.value })}
                    className='w-full p-2 border rounded-lg'
                  />
                </div>
              </div>

              <div>
                <label className='block font-bold mb-1'>খেলার সময় (Time Slot) *</label>
                <select
                  required
                  value={manualData.slotTime}
                  onChange={(e) => {
                    const sel = slots.find((s) => `${s.startTime} - ${s.endTime}` === e.target.value);
                    setManualData({
                      ...manualData,
                      slotTime: e.target.value,
                      slotId: sel?.id || 'manual-slot',
                      amount: sel?.regularPrice || 1200,
                    });
                  }}
                  className='w-full p-2 border rounded-lg'
                >
                  <option value=''>-- সময় নির্বাচন করুন --</option>
                  {slots.map((s) => (
                    <option key={s.id} value={`${s.startTime} - ${s.endTime}`}>
                      {s.startTime} - {s.endTime} (৳{s.regularPrice})
                    </option>
                  ))}
                </select>
              </div>

              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <label className='block font-bold mb-1'>ভাড়া মূল্য (টাকা)</label>
                  <input
                    type='number'
                    value={manualData.amount}
                    onChange={(e) => setManualData({ ...manualData, amount: Number(e.target.value) })}
                    className='w-full p-2 border rounded-lg font-bold'
                  />
                </div>
                <div>
                  <label className='block font-bold mb-1'>পেমেন্ট মাধ্যম</label>
                  <select
                    value={manualData.paymentMethod}
                    onChange={(e) => setManualData({ ...manualData, paymentMethod: e.target.value })}
                    className='w-full p-2 border rounded-lg'
                  >
                    <option value='ক্যাশ'>ক্যাশ</option>
                    <option value='বিকাশ'>বিকাশ</option>
                    <option value='নগদ'>নগদ</option>
                    <option value='রকেট'>রকেট</option>
                  </select>
                </div>
              </div>

              <div className='flex justify-end space-x-2 pt-3'>
                <button
                  type='button'
                  onClick={() => setShowManualBookingModal(false)}
                  className='px-4 py-2 bg-gray-200 font-bold rounded-lg'
                >
                  বাতিল
                </button>
                <button type='submit' className='px-4 py-2 bg-red-600 text-white font-bold rounded-lg'>
                  বুকিং সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slot Modal */}
      {editingSlot && (
        <div className='fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl max-w-md w-full p-6 space-y-4'>
            <h3 className='text-lg font-bold text-gray-950'>স্লট কনফিগারেশন</h3>
            <form onSubmit={handleSaveSlot} className='space-y-3 text-xs'>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <label className='block font-bold mb-1'>শুরুর সময়</label>
                  <input
                    type='text'
                    required
                    value={editingSlot.startTime || ''}
                    onChange={(e) => setEditingSlot({ ...editingSlot, startTime: e.target.value })}
                    className='w-full p-2 border rounded-lg'
                    placeholder='যেমন: ০৬:০০ PM'
                  />
                </div>
                <div>
                  <label className='block font-bold mb-1'>শেষের সময়</label>
                  <input
                    type='text'
                    required
                    value={editingSlot.endTime || ''}
                    onChange={(e) => setEditingSlot({ ...editingSlot, endTime: e.target.value })}
                    className='w-full p-2 border rounded-lg'
                    placeholder='যেমন: ০৭:০০ PM'
                  />
                </div>
              </div>

              <div>
                <label className='block font-bold mb-1'>স্লটের ধরন</label>
                <select
                  value={editingSlot.slotType || 'সন্ধ্যা'}
                  onChange={(e) => setEditingSlot({ ...editingSlot, slotType: e.target.value as any })}
                  className='w-full p-2 border rounded-lg'
                >
                  <option value='সকাল'>সকাল</option>
                  <option value='দুপুর'>দুপুর</option>
                  <option value='বিকাল'>বিকাল</option>
                  <option value='সন্ধ্যা'>সন্ধ্যা</option>
                  <option value='রাত'>রাত</option>
                </select>
              </div>

              <div>
                <label className='block font-bold mb-1'>ভাড়া মূল্য (টাকা)</label>
                <input
                  type='number'
                  required
                  value={editingSlot.regularPrice || 1200}
                  onChange={(e) => setEditingSlot({ ...editingSlot, regularPrice: Number(e.target.value) })}
                  className='w-full p-2 border rounded-lg font-bold'
                />
              </div>

              <div className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  id='slot-active-check'
                  checked={editingSlot.isActive !== false}
                  onChange={(e) => setEditingSlot({ ...editingSlot, isActive: e.target.checked })}
                />
                <label htmlFor='slot-active-check' className='font-bold'>
                  স্লট সক্রিয় রাখুন
                </label>
              </div>

              <div className='flex justify-end space-x-2 pt-3'>
                <button
                  type='button'
                  onClick={() => setEditingSlot(null)}
                  className='px-4 py-2 bg-gray-200 font-bold rounded-lg'
                >
                  বাতিল
                </button>
                <button type='submit' className='px-4 py-2 bg-red-600 text-white font-bold rounded-lg'>
                  সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Modal */}
      {showStaffModal && (
        <div className='fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl max-w-md w-full p-6 space-y-4'>
            <h3 className='text-lg font-bold text-gray-950'>নতুন স্টাফ অ্যাকাউন্ট</h3>
            <form onSubmit={handleCreateStaff} className='space-y-3 text-xs'>
              <div>
                <label className='block font-bold mb-1'>ইউজারনেম *</label>
                <input
                  type='text'
                  required
                  value={newStaffData.username}
                  onChange={(e) => setNewStaffData({ ...newStaffData, username: e.target.value })}
                  className='w-full p-2 border rounded-lg font-mono'
                />
              </div>
              <div>
                <label className='block font-bold mb-1'>পূর্ণ নাম *</label>
                <input
                  type='text'
                  required
                  value={newStaffData.name}
                  onChange={(e) => setNewStaffData({ ...newStaffData, name: e.target.value })}
                  className='w-full p-2 border rounded-lg'
                />
              </div>
              <div>
                <label className='block font-bold mb-1'>রোল</label>
                <select
                  value={newStaffData.role}
                  onChange={(e) => setNewStaffData({ ...newStaffData, role: e.target.value })}
                  className='w-full p-2 border rounded-lg font-bold'
                >
                  <option value='Staff'>স্টাফ (Staff)</option>
                  <option value='Admin'>অ্যাডমিন (Admin)</option>
                  <option value='Super Admin'>সুপার অ্যাডমিন (Super Admin)</option>
                </select>
              </div>
              <div>
                <label className='block font-bold mb-1'>পাসওয়ার্ড *</label>
                <input
                  type='password'
                  required
                  value={newStaffData.password}
                  onChange={(e) => setNewStaffData({ ...newStaffData, password: e.target.value })}
                  className='w-full p-2 border rounded-lg'
                />
              </div>
              <div className='flex justify-end space-x-2 pt-2'>
                <button
                  type='button'
                  onClick={() => setShowStaffModal(false)}
                  className='px-4 py-2 bg-gray-200 font-bold rounded-lg'
                >
                  বাতিল
                </button>
                <button type='submit' className='px-4 py-2 bg-red-600 text-white font-bold rounded-lg'>
                  তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div className='fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4'>
          <div className='bg-white rounded-2xl max-w-md w-full p-6 space-y-4'>
            <h3 className='text-lg font-bold text-gray-950'>গ্যালারিতে নতুন ছবি যোগ করুন</h3>
            <form onSubmit={handleSaveGallery} className='space-y-3 text-xs'>
              <div>
                <label className='block font-bold mb-1'>ছবির শিরোনাম</label>
                <input
                  type='text'
                  required
                  value={newGalleryItem.title}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                  className='w-full p-2 border rounded-lg'
                  placeholder='যেমন: নাইট ম্যাচ ফুটবল'
                />
              </div>
              <div>
                <label className='block font-bold mb-1'>ক্যাটাগরি</label>
                <select
                  value={newGalleryItem.category}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                  className='w-full p-2 border rounded-lg'
                >
                  <option value='টার্ফ'>টার্ফ</option>
                  <option value='কিডস জোন'>কিডস জোন</option>
                  <option value='নাইট ম্যাচ'>নাইট ম্যাচ</option>
                  <option value='টুর্নামেন্ট'>টুর্নামেন্ট</option>
                </select>
              </div>
              <div>
                <label className='block font-bold mb-1'>ছবির URL *</label>
                <input
                  type='url'
                  required
                  value={newGalleryItem.imageUrl}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, imageUrl: e.target.value })}
                  className='w-full p-2 border rounded-lg'
                  placeholder='https://images.unsplash.com/...'
                />
              </div>
              <div className='flex justify-end space-x-2 pt-2'>
                <button
                  type='button'
                  onClick={() => setShowGalleryModal(false)}
                  className='px-4 py-2 bg-gray-200 font-bold rounded-lg'
                >
                  বাতিল
                </button>
                <button type='submit' className='px-4 py-2 bg-red-600 text-white font-bold rounded-lg'>
                  যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Preview Modal */}
      {selectedReceiptBooking && settings && (
        <div className='fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto'>
          <div className='bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center no-print'>
              <h3 className='font-bold text-base'>রসিদ প্রিন্ট ও ভিউ</h3>
              <button
                onClick={() => setSelectedReceiptBooking(null)}
                className='p-1 text-gray-500 hover:text-black font-bold'
              >
                বন্ধ করুন ✕
              </button>
            </div>
            <PrintableReceipt booking={selectedReceiptBooking} settings={settings} />
          </div>
        </div>
      )}
    </div>
  );
};
