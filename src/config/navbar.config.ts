import { Sparkles, Tag, Images, Mail, Info, LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

export const navItems: NavItem[] = [
  { id: 'kids-zone', label: 'কিডস জোন', icon: Sparkles, path: '/kids-zone' },
  { id: 'pricing', label: 'মূল্য তালিকা', icon: Tag, path: '/pricing' },
  { id: 'about', label: 'আমাদের সম্পর্কে', icon: Info, path: '/about-us' },
  { id: 'gallery', label: 'গ্যালারি', icon: Images, path: '/gallery' },
  { id: 'contact', label: 'যোগাযোগ', icon: Mail, path: '/contact' },
];

export const bottomTabRoutes = ['kids-zone', 'pricing', 'gallery'];

// রোল অনুযায়ী ড্যাশবোর্ড পাথ ও নাম নির্ধারণের ফাংশন
export const getDashboardConfig = (role?: string) => {
  switch (role) {
    case 'SUPER_ADMIN':
    case 'ADMIN':
    case 'MANAGER':
      return { label: 'অ্যাডমিন ড্যাশবোর্ড', path: '/dashboard/adm_v1' };
    case 'CUSTOMER':
      return { label: 'আমার ড্যাশবোর্ড', path: '/dashboard/customer' };
    default:
      return { label: 'ড্যাশবোর্ড', path: '/dashboard/adm_v1' };
  }
};