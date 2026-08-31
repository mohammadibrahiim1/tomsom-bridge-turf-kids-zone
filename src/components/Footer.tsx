import React from 'react';
import { MapPin, Phone, Mail, Clock, ExternalLink, Shield, FileText, UserCircle } from 'lucide-react';
import type { WebsiteSettings } from '../types';

interface FooterProps {
  settings?: WebsiteSettings;
  onNavigate?: (sectionId: string) => void;
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenAdmin?: () => void;
}

// স্থায়ী সমাধানের জন্য একটি Safe Default Object
const defaultFooterSettings: Partial<WebsiteSettings> = {
  websiteNameBn: 'টমছম ব্রিজ টার্ফ ও কিডস জোন',
  tagline: 'খেলার মাঠ ও বিনোদন কেন্দ্র',
  footerAboutText:
    'কুমিল্লার প্রাণকেন্দ্রে আন্তর্জাতিক মানের কৃত্রিম ঘাসের খেলার টার্ফ ও শিশুদের আনন্দময় বিনোদন কেন্দ্র।',
  phone: '01700000000',
  email: 'info@tomsombridgeturf.com',
  addressBn: 'টমছম ব্রিজ, কুমিল্লা',
  googleMapDirectLink: '#',
  footerCopyrightText: '© ২০২৬ টমছম ব্রিজ টার্ফ ও কিডস জোন। সর্বস্বত্ব সংরক্ষিত।',
};

export const Footer: React.FC<FooterProps> = ({
  settings: customSettings,
  onNavigate,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAdmin,
}) => {
  // settings না পাঠানো হলে defaultFooterSettings কাজ করবে
  const settings = { ...defaultFooterSettings, ...customSettings };

  const handleNav = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrivacy = () => {
    if (onOpenPrivacy) {
      onOpenPrivacy();
    } else {
      alert('গোপনীয়তা নীতি: আপনার ব্যক্তিগত তথ্য সম্পূর্ণ সুরক্ষিত এবং তৃতীয় কোনো পক্ষের সাথে শেয়ার করা হয় না।');
    }
  };

  const handleTerms = () => {
    if (onOpenTerms) {
      onOpenTerms();
    } else {
      const el = document.getElementById('rules');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className='bg-slate-50 text-gray-800 pt-16 pb-10 border-t-4 border-red-600 shadow-inner'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Top 4-Column Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12'>
          {/* Col 1: About Institution */}
          <div className='space-y-4'>
            <div className='flex items-center space-x-3'>
              <div className='w-11 h-11 bg-red-600 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-md'>
                TB
              </div>
              <div>
                <h3 className='text-lg font-black text-gray-950 tracking-tight leading-tight'>
                  {settings.websiteNameBn}
                </h3>
                <p className='text-xs font-bold text-red-600'>{settings.tagline}</p>
              </div>
            </div>
            <p className='text-gray-600 text-sm leading-relaxed font-normal'>
              {settings.footerAboutText ||
                `${settings.tagline}। কুমিল্লার প্রাণকেন্দ্রে আন্তর্জাতিক মানের কৃত্রিম ঘাসের খেলার টার্ফ ও শিশুদের আনন্দময় বিনোদন কেন্দ্র।`}
            </p>
            {settings.facebookPageUrl && (
              <div className='pt-1'>
                <a
                  href={settings.facebookPageUrl}
                  target='_blank'
                  rel='noreferrer'
                  id='footer-facebook-link'
                  className='inline-flex items-center space-x-2 text-xs bg-white text-red-600 border border-red-200 px-4 py-2 rounded-xl font-bold shadow-xs hover:bg-red-600 hover:text-white transition-all cursor-pointer'
                >
                  <span>অফিসিয়াল ফেসবুক পেজ</span>
                  <ExternalLink className='w-3.5 h-3.5' />
                </a>
              </div>
            )}
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className='text-sm font-black text-gray-950 uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3'>
              ওয়েবসাইট মেনু লিংক
            </h4>
            <ul className='space-y-2.5 text-sm font-semibold text-gray-700'>
              <li>
                <button
                  onClick={() => handleNav('hero')}
                  className='hover:text-red-600 transition-colors cursor-pointer text-left'
                >
                  • হোম পেজ
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className='hover:text-red-600 transition-colors cursor-pointer text-left'
                >
                  • আমাদের পরিচিতি
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('booking')}
                  className='hover:text-red-600 transition-colors cursor-pointer text-left font-bold text-red-600'
                >
                  • অনলাইন টার্ফ বুকিং
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('pricing')}
                  className='hover:text-red-600 transition-colors cursor-pointer text-left'
                >
                  • মূল্য তালিকা ও অফার
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('kids-zone')}
                  className='hover:text-red-600 transition-colors cursor-pointer text-left'
                >
                  • কিডস জোন বিনোদন
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('gallery')}
                  className='hover:text-red-600 transition-colors cursor-pointer text-left'
                >
                  • ছবির গ্যালারি
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('rules')}
                  className='hover:text-red-600 transition-colors cursor-pointer text-left'
                >
                  • মাঠের নিয়ম ও শর্তাবলি
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className='hover:text-red-600 transition-colors cursor-pointer text-left'
                >
                  • যোগাযোগ ও লোকেশন
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Operating Hours */}
          <div>
            <h4 className='text-sm font-black text-gray-950 uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3'>
              সময়সূচি ও স্লট নিয়ম
            </h4>
            <div className='space-y-3.5 text-sm text-gray-700'>
              <div className='bg-white p-3 rounded-xl border border-gray-200 shadow-xs flex items-start space-x-3'>
                <Clock className='w-5 h-5 text-red-600 mt-0.5 shrink-0' />
                <div>
                  <div className='font-bold text-gray-900 text-xs'>টার্ফ খেলার সময়:</div>
                  <div className='text-xs text-gray-600 font-medium'>প্রতিদিন সকাল ০৬:০০ AM - রাত ১২:০০ AM</div>
                </div>
              </div>

              <div className='bg-white p-3 rounded-xl border border-gray-200 shadow-xs flex items-start space-x-3'>
                <Clock className='w-5 h-5 text-red-600 mt-0.5 shrink-0' />
                <div>
                  <div className='font-bold text-gray-900 text-xs'>কিডস জোন সময়:</div>
                  <div className='text-xs text-gray-600 font-medium'>প্রতিদিন দুপুর ০৩:০০ PM - রাত ১০:০০ PM</div>
                </div>
              </div>

              <div className='p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-950 font-medium'>
                <span className='font-bold text-red-700'>স্লটের নিয়ম: </span>
                প্রতিটি স্লট ৬০ মিনিটের (৫৫ মিনিট খেলা + ৫ মিনিট প্রস্তুতি)।
              </div>
            </div>
          </div>

          {/* Col 4: Location & Contact */}
          <div>
            <h4 className='text-sm font-black text-gray-950 uppercase tracking-wider mb-4 border-l-4 border-red-600 pl-3'>
              ঠিকানা ও সরাসরি যোগাযোগ
            </h4>
            <div className='space-y-3 text-sm text-gray-700'>
              <div className='flex items-start space-x-2.5'>
                <MapPin className='w-5 h-5 text-red-600 mt-0.5 shrink-0' />
                <span className='text-xs leading-relaxed text-gray-800 font-medium'>
                  {settings.addressBn}
                  {settings.locationLandmark && (
                    <span className='block text-gray-500 font-normal'>({settings.locationLandmark})</span>
                  )}
                </span>
              </div>

              <div className='flex items-center space-x-2.5'>
                <Phone className='w-4 h-4 text-red-600 shrink-0' />
                <a
                  href={`tel:${settings.phone}`}
                  className='text-xs font-bold text-gray-900 hover:text-red-600 transition-colors'
                >
                  {settings.phone} {settings.phoneSecondary ? `| ${settings.phoneSecondary}` : ''}
                </a>
              </div>

              <div className='flex items-center space-x-2.5'>
                <Mail className='w-4 h-4 text-red-600 shrink-0' />
                <span className='text-xs text-gray-600 font-medium'>{settings.email}</span>
              </div>

              <div className='pt-2'>
                <a
                  href={settings.googleMapDirectLink || '#location'}
                  target='_blank'
                  rel='noreferrer'
                  id='footer-google-map-btn'
                  className='w-full inline-flex items-center justify-center py-2.5 px-4 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer'
                >
                  <MapPin className='w-3.5 h-3.5 mr-1.5' />
                  গুগল ম্যাপে লোকেশন দেখুন
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Policy links */}
        <div className='border-t border-gray-200 pt-6 pb-4 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600 gap-3'>
          <div className='flex flex-wrap items-center gap-3 sm:gap-4'>
            <button onClick={handlePrivacy} className='hover:text-red-600 flex items-center font-medium cursor-pointer'>
              <Shield className='w-3.5 h-3.5 mr-1 text-red-600' />
              গোপনীয়তা নীতি
            </button>
            <span className='text-gray-300'>•</span>
            <button onClick={handleTerms} className='hover:text-red-600 flex items-center font-medium cursor-pointer'>
              <FileText className='w-3.5 h-3.5 mr-1 text-red-600' />
              ব্যবহারের শর্তাবলি
            </button>
            {onOpenAdmin && (
              <>
                <span className='text-gray-300'>•</span>
                <button
                  onClick={onOpenAdmin}
                  className='text-gray-700 hover:text-red-600 font-bold flex items-center cursor-pointer'
                >
                  <UserCircle className='w-3.5 h-3.5 mr-1' />
                  অ্যাডমিন পোর্টাল লগইন
                </button>
              </>
            )}
          </div>
          <div className='text-gray-500 font-medium'>
            মুদ্রা: <span className='text-red-600 font-bold'>৳ (টাকা)</span> | টাইমজোন:{' '}
            <span className='text-gray-700 font-semibold'>ঢাকা (বাংলাদেশ)</span>
          </div>
        </div>

        {/* Developer Credit Line */}
        <div className='border-t border-gray-200 pt-6 text-center text-xs text-gray-500'>
          <p className='leading-relaxed'>
            {settings.footerCopyrightText || '© ২০২৬ টমছম ব্রিজ টার্ফ ও কিডস জোন। সর্বস্বত্ব সংরক্ষিত।'} |{' '}
            <span className='text-gray-600 font-medium'>
              কারিগরি সহায়তায়{' '}
              <a
                href='https://multitechitbd.com'
                target='_blank'
                rel='noreferrer'
                className='text-red-600 hover:text-red-700 font-bold underline decoration-red-400 hover:decoration-red-600 transition-colors'
              >
                MultiTech IT BD
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};
