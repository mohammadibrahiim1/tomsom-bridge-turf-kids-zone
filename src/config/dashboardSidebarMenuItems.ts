import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  Settings,
  Baby,
  Tag,
  Users,
  Trophy,
  ImageIcon,
  MessageSquare,
  HelpCircle,
  BarChart3,
  ShieldAlert,
  Database,
  History,
  LucideIcon,
} from 'lucide-react';

export interface DashboardSidebarMenuItems {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
}

export const DashboardSidebarMenuItems: DashboardSidebarMenuItems[] = [
  { id: 'overview', label: 'ড্যাশবোর্ড', to: '/dashboard/adm_v1', icon: LayoutDashboard },
  { id: 'bookings', label: 'বুকিং ব্যবস্থাপনা', to: '/dashboard/adm_v1/bookings', icon: CalendarCheck },
  { id: 'slots', label: 'টাইম স্লট ও প্রাইসিং', to: '/dashboard/adm_v1/slot-management', icon: Clock },
  { id: 'settings', label: 'টার্ফ ও সাইট সেটিংস', to: '/dashboard/adm_v1/settings', icon: Settings },
  { id: 'kids', label: 'কিডস জোন সেটিংস', to: '/dashboard/adm_v1/kids', icon: Baby },
  { id: 'coupons', label: 'কুপন ও স্পেশাল অফার', to: '/dashboard/adm_v1/coupons', icon: Tag },
  { id: 'customers', label: 'কাস্টমার ডাটাবেস', to: '/dashboard/adm_v1/customers', icon: Users },
  { id: 'events', label: 'টুর্নামেন্ট ও ইভেন্ট', to: '/dashboard/adm_v1/events', icon: Trophy },
  { id: 'gallery', label: 'গ্যালারি মিডিয়া', to: '/dashboard/adm_v1/gallery', icon: ImageIcon },
  { id: 'reviews', label: 'রিভিউ মডারেশন', to: '/dashboard/adm_v1/reviews', icon: MessageSquare },
  { id: 'faqs', label: 'প্রশ্নোত্তর (FAQ)', to: '/dashboard/adm_v1/faqs', icon: HelpCircle },
  { id: 'reports', label: 'আয়-ব্যয় ও রিপোর্ট', to: '/dashboard/adm_v1/reports', icon: BarChart3 },
  { id: 'staff', label: 'স্টাফ ও রোল এক্সেস', to: '/dashboard/adm_v1/staff', icon: ShieldAlert },
  { id: 'backup', label: 'ডাটা ব্যাকআপ ও রিস্টোর', to: '/dashboard/adm_v1/backup', icon: Database },
  { id: 'logs', label: 'কার্যক্রম লগ (Logs)', to: '/dashboard/adm_v1/logs', icon: History },
];
