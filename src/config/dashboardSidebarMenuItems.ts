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

export interface DashboardSidebarMenuItem {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
  roles: string[]; // কোন কোন রোল এই মেনু দেখতে পাবে
}

export const DashboardSidebarMenuItems: DashboardSidebarMenuItem[] = [
  { id: 'overview', label: 'ড্যাশবোর্ড', to: '/dashboard/adm_v1', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { id: 'bookings', label: 'বুকিং ব্যবস্থাপনা', to: '/dashboard/adm_v1/bookings', icon: CalendarCheck, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
  { id: 'slots', label: 'টাইম স্লট ও প্রাইসিং', to: '/dashboard/adm_v1/slot-management', icon: Clock, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { id: 'settings', label: 'টার্ফ ও সাইট সেটিংস', to: '/dashboard/adm_v1/settings', icon: Settings, roles: ['SUPER_ADMIN'] },
  { id: 'kids', label: 'কিডস জোন সেটিংস', to: '/dashboard/adm_v1/kids', icon: Baby, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { id: 'coupons', label: 'কুপন ও স্পেশাল অফার', to: '/dashboard/adm_v1/coupons', icon: Tag, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { id: 'customers', label: 'কাস্টমার ডাটাবেস', to: '/dashboard/adm_v1/customers', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'] },
  { id: 'events', label: 'টুর্নামেন্ট ও ইভেন্ট', to: '/dashboard/adm_v1/events', icon: Trophy, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { id: 'gallery', label: 'গ্যালারি মিডিয়া', to: '/dashboard/adm_v1/gallery', icon: ImageIcon, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { id: 'reviews', label: 'রিভিউ মডারেশন', to: '/dashboard/adm_v1/reviews', icon: MessageSquare, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { id: 'faqs', label: 'প্রশ্নোত্তর (FAQ)', to: '/dashboard/adm_v1/faqs', icon: HelpCircle, roles: ['SUPER_ADMIN', 'ADMIN'] },
  { id: 'reports', label: 'আয়-ব্যয় ও রিপোর্ট', to: '/dashboard/adm_v1/reports', icon: BarChart3, roles: ['SUPER_ADMIN'] },
  { id: 'staff', label: 'স্টাফ ও রোল এক্সেস', to: '/dashboard/adm_v1/staff', icon: ShieldAlert, roles: ['SUPER_ADMIN'] },
  { id: 'backup', label: 'ডাটা ব্যাকআপ ও রিস্টোর', to: '/dashboard/adm_v1/backup', icon: Database, roles: ['SUPER_ADMIN'] },
  { id: 'logs', label: 'কার্যক্রম লগ (Logs)', to: '/dashboard/adm_v1/logs', icon: History, roles: ['SUPER_ADMIN'] },
  
  // কাস্টমারদের জন্য আলাদা মেনু চাইলে এভাবে দিতে পারেন:
  { id: 'customer-home', label: 'আমার ড্যাশবোর্ড', to: '/dashboard/customer', icon: LayoutDashboard, roles: ['CUSTOMER'] },
];