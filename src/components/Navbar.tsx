import React, { useState, useRef, useEffect } from 'react';
import {
  CalendarCheck,
  Search,
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
  ChevronDown,
  LayoutDashboard,
  LogIn,
} from 'lucide-react';
import type { WebsiteSettings } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  settings?: WebsiteSettings;
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
  onOpenBooking?: () => void;
  onOpenSearch?: () => void;
  onOpenAdmin?: () => void;
  onLogout?: () => void;
}

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
  const settings = { ...defaultNavbarSettings, ...customSettings };
  const currentUser = useSelector((state: RootState) => state.auth?.user);
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Outside Click Listener for Profile Dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'kids-zone', label: 'কিডস জোন', icon: Sparkles, path: '/#kids-zone' },
    { id: 'pricing', label: 'মূল্য তালিকা', icon: Tag, path: '/#pricing' },
    { id: 'about', label: 'আমাদের সম্পর্কে', icon: Info, path: '/#about' },
    { id: 'gallery', label: 'গ্যালারি', icon: Images, path: '/#gallery' },
    { id: 'contact', label: 'যোগাযোগ', icon: Mail, path: '/#contact' },
  ];

  const bottomTabRoutes = ['kids-zone', 'pricing', 'gallery'];

  const handleItemClick = (id: string) => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);

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
    setIsProfileDropdownOpen(false);
    if (onOpenBooking) {
      onOpenBooking();
    }
  };

  const handleLogoutAction = () => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleDashboardAction = () => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    if (onOpenAdmin) {
      onOpenAdmin();
    } else {
      navigate('/admin/dashboard');
    }
  };

  const rawWhatsapp = settings.whatsapp || settings.phone || '';
  const cleanWhatsappNumber = rawWhatsapp.replace(/\D/g, '');

  return (
    <>
      <header className='sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs'>
        {/* Top Contact Bar */}
        {settings?.isTopBarActive !== false && (
          <div className='bg-[#990000] text-white text-xs py-1.5 px-3 sm:px-4'>
            <div className='max-w-8xl mx-auto flex flex-wrap justify-between items-center gap-2'>
              <div className='flex items-center space-x-1.5 sm:space-x-2'>
                <span className='inline-flex items-center bg-emerald-600 px-1.5 py-0.5 rounded text-[10px] sm:text-2xs font-bold text-white shadow-xs whitespace-nowrap'>
                  <Sparkles className='w-3 h-3 mr-1' />
                  ঘোষণা
                </span>
                <span className='text-white/95 font-medium truncate max-w-[200px] xs:max-w-xs sm:max-w-md lg:max-w-xl text-[11px] sm:text-xs'>
                  {settings?.topBarText || settings.addressBn}
                </span>
              </div>

              <div className='flex items-center space-x-2 sm:space-x-4 text-[11px] sm:text-xs'>
                {settings.phone && (
                  <a
                    href={`tel:${settings.phone}`}
                    className='flex items-center text-white hover:text-emerald-300 font-semibold transition-colors'
                  >
                    <PhoneCall className='w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1' />
                    <span className='hidden xs:inline'>কল: </span>
                    {settings.phone}
                  </a>
                )}
                {settings.phone && cleanWhatsappNumber && <span className='text-white/40'>|</span>}
                {cleanWhatsappNumber && (
                  <a
                    href={`https://wa.me/${cleanWhatsappNumber}`}
                    target='_blank'
                    rel='noreferrer'
                    className='flex items-center bg-[#2E7D32] hover:bg-[#256628] text-white px-2 py-0.5 rounded font-semibold transition-colors text-[10px] sm:text-2xs shadow-xs'
                  >
                    <MessageCircle className='w-3 h-3 mr-1' />
                    হোয়াটসঅ্যাপ
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Navbar Header Bar */}
        <div className='max-w-8xl mx-auto px-3 sm:px-6 lg:px-8'>
          {/* Top Row: Brand Name & User Login/Avatar Profile */}
          <div className='flex items-center justify-between h-16 xl:h-20'>
            {/* Left: Brand Name Only */}
            <Link
              to='/'
              className='flex items-center space-x-2 sm:space-x-3 group cursor-pointer overflow-hidden'
              onClick={() => handleItemClick('hero')}
            >
              <div className='w-9 h-9 sm:w-11 sm:h-11 bg-[#990000] rounded-md sm:rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-black text-base sm:text-xl shadow-md ring-2 ring-red-100 group-hover:scale-105 transition-transform'>
                TB
              </div>
              <div className='truncate'>
                <span className='block font-black text-sm sm:text-base lg:text-lg tracking-tight text-slate-900 leading-tight truncate'>
                  {settings.websiteNameBn}
                </span>
                <span className='block text-[10px] sm:text-xs font-semibold text-[#2E7D32] tracking-normal truncate'>
                  {settings.tagline}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation & Actions */}
            <div className='hidden xl:flex items-center space-x-6'>
              <nav className='flex items-center space-x-1 whitespace-nowrap'>
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => handleItemClick(item.id)}
                    className={`px-3 py-2 rounded-md text-xs sm:text-sm font-bold transition-all duration-150 ${
                      activeSection === item.id
                        ? 'text-[#990000] bg-red-50 shadow-xs ring-1 ring-red-200'
                        : 'text-slate-700 hover:text-[#990000] hover:bg-slate-100/80'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className='flex items-center space-x-2.5 border-l border-slate-200 pl-6'>
                <button
                  onClick={onOpenSearch}
                  className='inline-flex items-center px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer border border-slate-200'
                >
                  <Search className='w-4 h-4 mr-1.5 text-slate-600' />
                  {settings.headerSearchBtnText || 'অনুসন্ধান'}
                </button>

                <button
                  onClick={handleBooking}
                  className='inline-flex items-center px-4 py-2 bg-[#990000] hover:bg-[#800000] active:scale-95 text-white font-bold text-xs rounded-md shadow-md hover:shadow-red-900/25 transition-all cursor-pointer'
                >
                  <CalendarCheck className='w-4 h-4 mr-1.5' />
                  {settings.headerBookingBtnText || 'এখনই বুক করুন'}
                </button>

                {/* Desktop User Profile Dropdown with Framer Motion */}
                {currentUser ? (
                  <div className='relative' ref={dropdownRef}>
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className='flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-md transition-all cursor-pointer'
                    >
                      <div className='w-7 h-7 rounded-lg bg-[#2E7D32] text-white flex items-center justify-center font-bold text-xs shadow-xs'>
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className='block text-xs font-bold text-slate-900 max-w-[100px] truncate'>
                        {currentUser.name}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isProfileDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className='absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50'
                        >
                          <div className='px-4 py-2.5 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl'>
                            <p className='text-xs font-bold text-slate-900 truncate'>{currentUser.name}</p>
                            <p className='text-xs font-medium text-slate-500 truncate mt-0.5'>
                              {currentUser.phone || currentUser.email || ''}
                            </p>
                          </div>
                          <div className='p-1.5 space-y-1'>
                            {/* Dashboard First */}
                            <button
                              onClick={handleDashboardAction}
                              className='w-full flex items-center px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer'
                            >
                              <LayoutDashboard className='w-4 h-4 mr-2.5 text-[#2E7D32]' />
                              ড্যাশবোর্ড
                            </button>

                            {/* Logout Second */}
                            {
                              <button
                                onClick={handleLogoutAction}
                                className='w-full flex items-center px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer'
                              >
                                <LogOut className='w-4 h-4 mr-2.5 text-red-600' />
                                লগআউট করুন
                              </button>
                            }
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to='/login'
                    className='inline-flex items-center px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-[#990000] bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer border border-slate-200'
                  >
                    <LogIn className='w-4 h-4 mr-1.5 text-[#2E7D32]' />
                    লগইন
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile / Tablet Top Right: Avatar or Login Only */}
            <div className='flex xl:hidden items-center space-x-2' ref={dropdownRef}>
              {currentUser ? (
                <div className='relative'>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className='w-9 h-9 rounded-full bg-[#2E7D32] text-white flex items-center justify-center font-black text-sm shadow-md ring-2 ring-emerald-100 cursor-pointer active:scale-95 transition-transform'
                    title={currentUser.name}
                  >
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </button>

                  {/* Mobile Profile Dropdown */}
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className='absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50'
                      >
                        <div className='px-4 py-2 border-b border-slate-100 bg-slate-50 rounded-t-2xl'>
                          <p className='text-xs font-bold text-slate-900 truncate'>{currentUser.name}</p>
                          <p className='text-[11px] text-slate-500 truncate'>
                            {currentUser.phone || currentUser.email || ''}
                          </p>
                        </div>
                        <div className='p-1.5 space-y-1'>
                          {/* Dashboard First */}
                          <button
                            onClick={handleDashboardAction}
                            className='w-full flex items-center px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer'
                          >
                            <LayoutDashboard className='w-4 h-4 mr-2 text-[#2E7D32]' />
                            ড্যাশবোর্ড
                          </button>

                          {/* Logout Second */}
                          {onLogout && (
                            <button
                              onClick={handleLogoutAction}
                              className='w-full flex items-center px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-md cursor-pointer'
                            >
                              <LogOut className='w-4 h-4 mr-2 text-red-600' />
                              লগআউট
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to='/login'
                  className='inline-flex items-center px-3 py-1.5 bg-[#2E7D32] hover:bg-[#256628] text-white font-bold text-xs rounded-md shadow-xs transition-colors'
                >
                  <LogIn className='w-3.5 h-3.5 mr-1' />
                  লগইন
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Bottom Row: Left Search & Right Booking Button */}
          <div className='flex xl:hidden items-center justify-between gap-2 pb-2.5 pt-1 border-t border-slate-100'>
            <button
              onClick={onOpenSearch}
              className='flex-1 inline-flex items-center justify-center px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md border border-slate-200 transition-colors cursor-pointer'
            >
              <Search className='w-3.5 h-3.5 mr-1.5 text-slate-600' />
              {settings.headerSearchBtnText || 'অনুসন্ধান'}
            </button>

            <button
              onClick={handleBooking}
              className='flex-1 inline-flex items-center justify-center px-3 py-2 bg-[#990000] hover:bg-[#800000] text-white font-bold text-xs rounded-md shadow-xs transition-all cursor-pointer'
            >
              <CalendarCheck className='w-3.5 h-3.5 mr-1.5' />
              {settings.headerBookingBtnText || 'এখনই বুক করুন'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Drawer Slide-Up Menu with Framer Motion Animation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className='xl:hidden fixed inset-0 z-50 flex flex-col justify-end'>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='fixed inset-0 bg-slate-900/60 backdrop-blur-xs'
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Bottom Sheet Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className='relative w-full bg-white rounded-t-3xl shadow-2xl border-t border-slate-200 p-5 space-y-4 max-h-[80vh] overflow-y-auto z-10'
            >
              {/* Drawer Pull Bar */}
              <div className='w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-1' />

              <div className='flex items-center justify-between pb-2 border-b border-slate-100'>
                <span className='text-xs font-extrabold text-slate-400 uppercase tracking-wider'>মেনু নেভিগেশন</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='p-1.5 text-slate-500 hover:bg-slate-100 rounded-full cursor-pointer'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>

              {/* Navigation Items List */}
              <div className='grid grid-cols-1 gap-1.5'>
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                        activeSection === item.id
                          ? 'text-[#990000] bg-red-50 border-l-4 border-[#990000]'
                          : 'text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <div className='flex items-center space-x-3'>
                        <IconComponent className='w-4 h-4 text-[#2E7D32]' />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className='w-4 h-4 text-slate-400' />
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Facebook-style Mobile Bottom Navigation Bar */}
      <div className='xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] px-2 py-1 flex justify-around items-center'>
        <button
          onClick={() => handleItemClick('hero')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeSection === 'hero' ? 'text-[#990000]' : 'text-slate-600 hover:text-[#990000]'
          }`}
        >
          <Home className='w-5 h-5 mb-0.5' />
          <span className='text-[10px] font-black tracking-tight'>হোম</span>
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
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative cursor-pointer ${
                isActive ? 'text-[#990000]' : 'text-slate-600 hover:text-[#990000]'
              }`}
            >
              {isActive && <span className='absolute top-0 w-8 h-1 bg-[#990000] rounded-full'></span>}
              <IconComponent className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#990000]' : 'text-[#2E7D32]'}`} />
              <span className='text-[10px] font-black tracking-tight truncate max-w-[70px]'>{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            isMobileMenuOpen ? 'text-[#990000]' : 'text-slate-600 hover:text-[#990000]'
          }`}
        >
          <Menu className='w-5 h-5 mb-0.5' />
          <span className='text-[10px] font-black tracking-tight'>মেনু</span>
        </button>
      </div>
    </>
  );
};
