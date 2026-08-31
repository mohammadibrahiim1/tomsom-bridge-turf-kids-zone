import React, { useState } from 'react';
import {
  CalendarCheck,
  Search,
  UserCircle,
  Menu,
  X,
  PhoneCall,
  MessageCircle,
  Sparkles,
  Home,
  Tag,
  Images,
  Mail,
  Info,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import type { WebsiteSettings } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { Link } from 'react-router-dom';

interface NavbarProps {
  settings?: WebsiteSettings;
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
  onOpenBooking?: () => void;
  onOpenSearch?: () => void;
  onOpenAdmin?: () => void;
  onLogout?: () => void;
}

// স্থায়ী সমাধানের জন্য একটি Safe Default Object
const defaultNavbarSettings: Partial<WebsiteSettings> = {
  isTopBarActive: true,
  topBarText: 'মধ্য আশরাফপুর, মাজার গেট (টমসন ব্রিজ সংলগ্ন), কুমিল্লা',
  websiteNameBn: 'টমছম ব্রিজ টার্ফ ও কিডস জোন',
  tagline: 'খেলার মাঠ ও বিনোদন কেন্দ্র',
  phone: '01700000000',
  whatsapp: '01700000000',
  addressBn: 'মধ্য আশরাফপুর, মাজার গেট (টমসন ব্রিজ সংলগ্ন), কুমিল্লা',
  headerSearchBtnText: 'অনুসন্ধান',
  headerBookingBtnText: 'এখনই বুক করুন',
};

export const Navbar: React.FC<NavbarProps> = ({
  settings: customSettings,
  activeSection = 'hero',
  onNavigate,
  onOpenBooking,
  onOpenSearch,
  onOpenAdmin,
  onLogout,
}) => {
  // settings না পাঠানো হলে defaultNavbarSettings কাজ করবে
  const settings = { ...defaultNavbarSettings, ...customSettings };

  const currentUser = useSelector((state: RootState) => state.auth?.user);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'booking', label: 'টার্ফ বুকিং', icon: CalendarCheck },
    { id: 'kids-zone', label: 'কিডস জোন', icon: Sparkles },
    { id: 'pricing', label: 'মূল্য তালিকা', icon: Tag },
    { id: 'about', label: 'আমাদের সম্পর্কে', icon: Info },
    { id: 'gallery', label: 'গ্যালারি', icon: Images },
    { id: 'contact', label: 'যোগাযোগ', icon: Mail },
  ];

  // মোবাইল নিচের ট্যাব বারের প্রধান ৩টি রুট
  const bottomTabRoutes = ['booking', 'kids-zone', 'pricing'];

  const handleItemClick = (id: string) => {
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const targetId = id === 'hero' ? 'hero-section' : id;
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBooking = () => {
    setIsMobileMenuOpen(false);
    if (onOpenBooking) {
      onOpenBooking();
    }
  };

  // WhatsApp নম্বর ফিল্টারিং সেফগার্ড
  const rawWhatsapp = settings.whatsapp || settings.phone || '';
  const cleanWhatsappNumber = rawWhatsapp.replace(/\D/g, '');

  return (
    <>
      <header className='sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs'>
        {/* Top bar for quick contact & location */}
        {settings?.isTopBarActive !== false && (
          <div className='bg-[#990000] text-white text-xs py-2 px-4'>
            <div className='max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2'>
              <div className='flex items-center space-x-2'>
                <span className='inline-flex items-center bg-emerald-600 px-2 py-0.5 rounded text-2xs font-bold text-white shadow-xs'>
                  <Sparkles className='w-3 h-3 mr-1' />
                  ঘোষণা
                </span>
                <span className='text-white/95 font-medium truncate max-w-md sm:max-w-xl'>
                  {settings?.topBarText ||
                    settings.addressBn ||
                    'মধ্য আশরাফপুর, মাজার গেট (টমসন ব্রিজ সংলগ্ন), কুমিল্লা'}
                </span>
              </div>

              <div className='flex items-center space-x-3 sm:space-x-4'>
                {settings.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className='flex items-center text-white hover:text-emerald-300 font-semibold transition-colors'
                  >
                    <PhoneCall className='w-3.5 h-3.5 mr-1' />
                    কল: {settings.phone}
                  </a>
                )}
                {settings.phone && cleanWhatsappNumber && <span className='text-white/40'>|</span>}
                {cleanWhatsappNumber && (
                  <a
                    href={`https://wa.me/${cleanWhatsappNumber}`}
                    target='_blank'
                    rel='noreferrer'
                    className='flex items-center bg-[#2E7D32] hover:bg-[#256628] text-white px-2 py-0.5 rounded font-semibold transition-colors text-2xs shadow-xs'
                  >
                    <MessageCircle className='w-3 h-3 mr-1' />
                    হোয়াটসঅ্যাপ
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Bar */}
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center justify-between h-20'>
            {/* Brand Logo */}
            <div
              className='flex items-center cursor-pointer space-x-3 group'
              onClick={() => handleItemClick('hero')}
              id='brand-logo-btn'
            >
              <div className='w-12 h-12 bg-[#990000] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md ring-4 ring-red-100 group-hover:scale-105 transition-transform'>
                TB
              </div>
              <div>
                <span className='block font-black text-lg sm:text-xl tracking-tight text-gray-950 leading-tight'>
                  {settings.websiteNameBn || 'টমছম ব্রিজ টার্ফ ও কিডস জোন'}
                </span>
                <span className='block text-xs font-semibold text-[#2E7D32] tracking-normal'>
                  {settings.tagline || 'খেলার মাঠ ও বিনোদন কেন্দ্র'}
                </span>
              </div>
            </div>

            {/* Desktop Nav Items */}
            <nav className='hidden xl:flex items-center space-x-1 whitespace-nowrap'>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleItemClick(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
                    activeSection === item.id
                      ? 'text-[#990000] bg-red-50 shadow-xs ring-1 ring-red-200'
                      : 'text-gray-700 hover:text-[#990000] hover:bg-gray-100/80'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Action CTAs & Dynamic Auth Button */}
            <div className='hidden sm:flex items-center space-x-2.5'>
              <button
                id='search-booking-btn'
                onClick={onOpenSearch}
                className='inline-flex items-center px-3.5 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer border border-gray-200'
                title='বুকিং অনুসন্ধান'
              >
                <Search className='w-4 h-4 mr-1.5 text-gray-600' />
                {settings.headerSearchBtnText || 'অনুসন্ধান'}
              </button>

              <button
                id='book-now-header-btn'
                onClick={handleBooking}
                className='inline-flex items-center px-4 py-2.5 bg-[#990000] hover:bg-[#800000] active:scale-95 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-red-900/25 transition-all cursor-pointer'
              >
                <CalendarCheck className='w-4 h-4 mr-1.5' />
                {settings.headerBookingBtnText || 'এখনই বুক করুন'}
              </button>

              {/* Login/User Toggle Button */}
              {currentUser ? (
                <div className='flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shadow-xs'>
                  <div className='w-8 h-8 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-xs'>
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className='hidden lg:block text-left'>
                    <span className='block text-xs font-black text-gray-900 leading-tight'>
                      {currentUser.name || 'অ্যাডমিন'}
                    </span>
                    <span className='block text-2xs font-bold text-[#2E7D32]'>অনলাইন</span>
                  </div>
                  <button
                    onClick={onOpenAdmin}
                    className='p-1.5 text-[#2E7D32] hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer'
                    title='ড্যাশবোর্ড'
                  >
                    <UserCircle className='w-4 h-4' />
                  </button>
                  {onLogout && (
                    <button
                      onClick={onLogout}
                      className='p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer'
                      title='লগআউট'
                    >
                      <LogOut className='w-4 h-4' />
                    </button>
                  )}
                </div>
              ) : (
                <Link
                  to='/login'
                  id='admin-login-nav-btn'
                  onClick={onOpenAdmin}
                  className='inline-flex items-center p-2.5 text-gray-700 hover:text-[#990000] hover:bg-gray-100 rounded-xl transition-colors cursor-pointer border border-gray-200'
                  title='লগইন'
                >
                  <UserCircle className='w-5 h-5 text-[#2E7D32]' />
                </Link>
              )}
            </div>

            {/* Mobile menu toggle button */}
            <div className='flex items-center sm:hidden space-x-2'>
              <button
                id='mobile-search-btn'
                onClick={onOpenSearch}
                className='p-2 text-gray-700 bg-gray-100 rounded-xl cursor-pointer border border-gray-200'
                aria-label='Search Booking'
              >
                <Search className='w-4 h-4' />
              </button>

              <button
                id='mobile-book-btn'
                onClick={handleBooking}
                className='px-3.5 py-2 bg-[#990000] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer'
              >
                বুক করুন
              </button>

              <button
                id='mobile-menu-toggle-btn'
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className='p-2 text-gray-800 hover:text-[#990000] rounded-xl cursor-pointer bg-gray-50 border border-gray-200'
                aria-label='Toggle Menu'
              >
                {isMobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div className='xl:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 shadow-xl space-y-3'>
            {currentUser && (
              <div className='flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl'>
                <div className='flex items-center space-x-2'>
                  <div className='w-8 h-8 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-bold text-xs'>
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div>
                    <span className='block text-xs font-bold text-gray-900'>{currentUser.name}</span>
                    <span className='block text-2xs text-[#2E7D32] font-semibold'>লগইন করা আছে</span>
                  </div>
                </div>
                <button
                  onClick={onOpenAdmin}
                  className='px-3 py-1.5 bg-[#2E7D32] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer'
                >
                  প্যানেল
                </button>
              </div>
            )}

            <div className='text-xs font-bold text-gray-400 uppercase px-1 tracking-wider'>অন্যান্য পেজ</div>
            <div className='grid grid-cols-1 gap-1'>
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold cursor-pointer transition-colors ${
                      activeSection === item.id
                        ? 'text-[#990000] bg-red-50 border-l-4 border-[#990000]'
                        : 'text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <div className='flex items-center space-x-3'>
                      <IconComponent className='w-4 h-4 text-[#2E7D32]' />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className='w-4 h-4 text-gray-400' />
                  </button>
                );
              })}
            </div>

            <div className='pt-3 border-t border-gray-100 flex flex-col gap-2'>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenAdmin) onOpenAdmin();
                }}
                className='w-full flex items-center justify-center py-3 bg-emerald-50 text-[#2E7D32] font-bold rounded-xl text-sm cursor-pointer border border-emerald-200 shadow-xs'
              >
                <UserCircle className='w-4 h-4 mr-2' />
                {currentUser ? 'অ্যাডমিন ড্যাশবোর্ড' : 'অ্যাডমিন পোর্টাল লগইন'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Facebook-style Mobile Bottom Navigation Bar */}
      <div className='sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] px-2 py-1.5 flex justify-around items-center'>
        <button
          onClick={() => handleItemClick('hero')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeSection === 'hero' ? 'text-[#990000]' : 'text-gray-600 hover:text-[#990000]'
          }`}
        >
          <Home className='w-5 h-5 mb-0.5' />
          <span className='text-3xs font-black tracking-tight'>হোম</span>
        </button>

        {bottomTabRoutes.map((routeId) => {
          const item = navItems.find((n) => n.id === routeId);
          if (!item) return null;
          const IconComponent = item.icon;
          const isActive = activeSection === routeId;

          return (
            <button
              key={routeId}
              onClick={() => handleItemClick(routeId)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
                isActive ? 'text-[#990000]' : 'text-gray-600 hover:text-[#990000]'
              }`}
            >
              {isActive && <span className='absolute top-0 w-8 h-1 bg-[#990000] rounded-full'></span>}
              <IconComponent className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#990000]' : 'text-[#2E7D32]'}`} />
              <span className='text-3xs font-black tracking-tight truncate max-w-[70px]'>{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isMobileMenuOpen ? 'text-[#990000]' : 'text-gray-600 hover:text-[#990000]'
          }`}
        >
          <Menu className='w-5 h-5 mb-0.5' />
          <span className='text-3xs font-black tracking-tight'>মেনু</span>
        </button>
      </div>
    </>
  );
};
