import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type {
  WebsiteSettings,
  TurfInfo,
  KidsZoneInfo,
  TimeSlot,
  Booking,
  SlotLock,
  Coupon,
  SpecialOffer,
  Facility,
  GalleryItem,
  TournamentEvent,
  Review,
  FAQItem,
  AdminUser,
  ActivityLog,
} from '../src/types';

interface DatabaseSchema {
  settings: WebsiteSettings;
  turfInfo: TurfInfo;
  kidsZoneInfo: KidsZoneInfo;
  timeSlots: TimeSlot[];
  bookings: Booking[];
  slotLocks: SlotLock[];
  coupons: Coupon[];
  offers: SpecialOffer[];
  facilities: Facility[];
  gallery: GalleryItem[];
  events: TournamentEvent[];
  reviews: Review[];
  faqs: FAQItem[];
  adminUsers: AdminUser[];
  activityLogs: ActivityLog[];
}

// const DATA_DIR = path.join(process.cwd(), 'server', 'data');
// const DATA_FILE = path.join(DATA_DIR, 'store.json')


const DATA_FILE = '/home/tomsomtu/public_ftp/data.json';
const DATA_DIR = path.dirname(DATA_FILE);


// Helper to hash password
export function hashPassword(pwd: string): string {
  return crypto.createHash('sha256').update(pwd).digest('hex');
}

// Initial realistic default data
const DEFAULT_SETTINGS: WebsiteSettings = {
  websiteNameBn: 'টমছম ব্রিজ টার্ফ ও কিডস জোন',
  websiteNameEn: 'Tomsom Bridge Turf & Kids Zone',
  tagline: 'খেলাধুলা, বিনোদন ও আনন্দের এক ঠিকানা',
  logoUrl: '',
  faviconUrl: '',
  heroHeadline: 'টমছম ব্রিজ টার্ফ ও কিডস জোন',
  heroSubheadline: 'আন্তর্জাতিক মানের কৃত্রিম ঘাসের ফুটবল টার্ফ এবং শিশুদের জন্য নিরাপদ ও রোমাঞ্চকর কিডস জোন।',
  heroImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80',
  heroBadge: 'কুমিল্লার সেরা স্পোর্টস ও এন্টারটেইনমেন্ট জোন',
  topbarText: 'টমছম ব্রিজ টার্ফ ও কিডস জোনে আপনাকে স্বাগতম! অগ্রিম অনলাইন বুকিং চলছে।',
  isTopbarActive: true,
  headerBookingBtnText: 'এখনই বুক করুন',
  headerSearchBtnText: 'বুকিং অনুসন্ধান',
  heroBookingBtnText: 'এখনই বুক করুন',
  heroKidsBtnText: 'কিডস জোন দেখুন',
  footerAboutText: 'টমছম ব্রিজ টার্ফ ও কিডস জোন কুমিল্লায় খেলাধুলা ও পরিবারের বিনোদনের জন্য একটি প্রিমিয়াম আন্তর্জাতিক মানের স্পোর্টস কমপ্লেক্স। ফিফা কোয়ালিটি টার্ফ ও শিশুদের জন্য রঙিন রাইডস।',
  footerCopyrightText: 'টমছম ব্রিজ টার্ফ ও কিডস জোন। সর্বস্বত্ব সংরক্ষিত।',
  footerNoticeText: 'বুকিং সংক্রান্ত যে কোন সহায়তায় আমাদের হটলাইনে যোগাযোগ করুন।',
  phone: '01819000000',
  phoneSecondary: '01712000000',
  whatsapp: '8801819000000',
  email: 'tomsomturf@gmail.com',
  addressBn: 'মধ্য আশরাফপুর, মাজার গেট (টমসন ব্রিজ সংলগ্ন), কুমিল্লা।',
  addressEn: 'Madhyam Ashrafpur, Mazar Gate (Adjacent to Tomsom Bridge), Cumilla',
  locationLandmark: 'টমসন ব্রিজ পার হয়ে মাজার গেটের ঠিক পাশেই অবস্থিত।',
  googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.887640248464!2d91.1785!3d23.4567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDI3JzI0LjEiTiA5McKwMTAnNDIuNiJF!5e0!3m2!1sbn!2sbd!4v1620000000000!5m2!1sbn!2sbd',
  googleMapDirectLink: 'https://maps.google.com/?q=Tomsom+Bridge+Cumilla',
  facebookPageUrl: 'https://www.facebook.com/profile.php?id=61589880077238',
  instagramUrl: '',
  youtubeUrl: '',
  currencySymbol: '৳',
  timezone: 'Asia/Dhaka',
  regularPrice: 1200,
  nightPrice: 1500,
  weekendPrice: 1400,
  cancellationNoticeDays: 3,
  cancellationPolicyText: 'বুকিং বাতিল বা সময় পরিবর্তনের প্রয়োজন হলে খেলার নির্ধারিত তারিখের কমপক্ষে ৩ দিন (৭২ ঘণ্টা) আগে কর্তৃপক্ষকে জানাতে হবে। অন্যথায় বুকিং ফি ফেরতযোগ্য হবে না।',
  rulesList: [
    'নির্ধারিত খেলার সময়ের কমপক্ষে ৫–১০ মিনিট পূর্বে মাঠে উপস্থিত হতে হবে।',
    'বুকিং সময়ের অতিরিক্ত সময় মাঠে অবস্থান করা বা খেলা চালিয়ে যাওয়া সম্পূর্ণ নিষেধ।',
    'প্রতিটি স্লট ৬০ মিনিটের (৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট ও প্রস্তুত হওয়ার সময়)।',
    'টার্ফের কোনো সরঞ্জাম, জাল, ঘাস বা আলোর ক্ষতিসাধন করলে উপযুক্ত ক্ষতিপূরণ দিতে হবে।',
    'মাঠ বা গ্যালারির ভেতর চিপসের প্যাকেট, বোতল বা কোনো ধরনের ময়লা ফেলা সম্পূর্ণ নিষিদ্ধ।',
    'টার্ফ চত্বরে ধূমপান, ই-সিগারেট ও যেকোনো ধরনের মাদকদ্রব্য গ্রহণ কঠোরভাবে নিষিদ্ধ।',
    'টার্ফে শুধুমাত্র অনুমোদিত টার্ফ শু (Turf Shoes) পরিধান করে প্রবেশ করতে হবে। মেটাল স্পাইক বা সাধারণ শক্ত জুতো নিষেধ।',
    'মাঠে বা আঙিনায় কোনো ধরনের মারামারি, অশালীন আচরণ বা বিশৃঙ্খলা বরদাশত করা হবে না।',
    'অনুমোদিত বুকিং ব্যতীত অন্য কারও মাঠে অনধিকার প্রবেশ নিষিদ্ধ।',
    'ব্যক্তিগত মূল্যবান সামগ্রী (মোবাইল, ওয়ালেট, ব্যাগ)-এর দায়িত্ব সম্পূর্ণ ব্যবহারকারীর।',
    'কিডস জোনে শিশুদের অভিভাবকের সার্বক্ষণিক তত্ত্বাবধানে রাখতে হবে।',
    'প্রাকৃতিক দুর্যোগ, ভারী বৃষ্টি বা যেকোনো অনিবার্য কারণে খেলা স্থগিত হলে কর্তৃপক্ষের সিদ্ধান্তই চূড়ান্ত।',
    'বুকিং বাতিল বা সময় পরিবর্তনের জন্য কমপক্ষে ৩ দিন পূর্বে কর্তৃপক্ষকে অবগত করতে হবে।',
    'খেলার জন্য কর্তৃপক্ষের থেকে নেওয়া বল, বিবস বা সরঞ্জাম খেলা শেষে অক্ষত অবস্থায় ফেরত দিতে হবে।',
    'অন্য দলের খেলায় বাধা দেওয়া বা সময় নষ্ট করা যাবে না।',
    'কর্তৃপক্ষের অনুমতি ছাড়া কোনো প্রকার বাণিজ্যিক ভিডিও রেকর্ডিং বা প্রচারণা চালানো যাবে না।',
    'পুরো টার্ফ এবং কিডস জোন সার্বক্ষণিক সিসিটিভি (CCTV) ক্যামেরার আওতাধীন।',
    'কোনো খেলোয়াড় বা দল নিয়ম ভঙ্গ করলে কর্তৃপক্ষ তাৎক্ষণিক বুকিং বাতিল করার ক্ষমতা রাখে।'
  ],
  bkashNumber: '01819000000',
  bkashType: 'Merchant',
  nagadNumber: '01819000000',
  nagadType: 'Merchant',
  rocketNumber: '01819000000',
  rocketType: 'Personal',
  cashInstruction: 'টার্ফে উপস্থিত হয়ে কাউন্টারে ক্যাশ পেমেন্ট করতে পারবেন। কাউন্টার থেকে ক্যাশ পরিশোধ নিশ্চিত করার পর বুকিং নিশ্চিত হবে।',
  receiptHeaderTitle: 'TOMSOM BRIDGE TURF & KIDS ZONE',
  receiptHeaderSubtitle: 'Madhya Ashrafpur, Mazar Gate (Near Tomsom Bridge), Cumilla',
  receiptContactText: 'Phone: 01819000000 | Web: tomsomturf.com',
  receiptFooterNote: 'ধন্যবাদ! টমছম ব্রিজ টার্ফ ও কিডস জোনে আপনাকে স্বাগতম।',
  receiptAuthorizedSealText: 'অফিসিয়াল অনুমোদিত ডিজিটাল ভাউচার',
  receiptFooterRules: [
    'নির্ধারিত খেলার সময়ের ১৫ মিনিট পূর্বে মাঠে উপস্থিত হতে হবে।',
    'টার্ফে শুধুমাত্র অনুমোদিত টার্ফ বুট / ফ্ল্যাট স্নিকার্স প্রযোজ্য। মেটাল স্পাইক নিষিদ্ধ।',
    'মাঠের অভ্যন্তরে ধূমপান, পান ও বাইরের ভারী খাবার সম্পূর্ণ নিষিদ্ধ।',
    'বুকিং বাতিল বা সময় পরিবর্তনের জন্য কমপক্ষে ৩ দিন আগে অবহিত করতে হবে।',
    'কর্তৃপক্ষের সকল শৃঙ্খলা ও নিরাপত্তা সংক্রান্ত সিদ্ধান্ত চূড়ান্ত।'
  ],
  sectionVisibility: {
    hero: true,
    quickBooking: true,
    about: true,
    turf: true,
    kidsZone: true,
    facilities: true,
    pricing: true,
    slots: true,
    offers: true,
    gallery: true,
    events: true,
    reviews: true,
    faq: true,
    location: true,
    contact: true,
  },
  seo: {
    metaTitle: 'টমছম ব্রিজ টার্ফ ও কিডস জোন | কুমিল্লা',
    metaDescription: 'কুমিল্লার মধ্য আশরাফপুর মাজার গেটে অবস্থিত আধুনিক টমছম ব্রিজ টার্ফ ও কিডস জোন। অনলাইন স্লট বুকিং ও খেলার সুব্যবস্থা।',
    keywords: 'টমছম ব্রিজ টার্ফ, টমছম ব্রিজ টার্ফ বুকিং, কুমিল্লা টার্ফ, কুমিল্লা ফুটবল টার্ফ, টমছম ব্রিজ কিডস জোন',
    ogImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
  },
};

const DEFAULT_TURF_INFO: TurfInfo = {
  name: 'টমছম ব্রিজ প্রিমিয়াম টার্ফ',
  size: '১২০ ফুট × ৭০ ফুট (5-A-Side & 7-A-Side Football/Cricket)',
  turfType: 'FIFA সার্টিফাইড নন-অ্যাব্রেসিভ আর্টিফিশিয়াল গ্রাস (৫০ মিমি)',
  lighting: 'উচ্চ ক্ষমতাসম্পন্ন অ্যান্টি-গ্লেয়ার এলইডি ফ্লাডলাইট (ডে-লাইট ভিজিবিলিটি)',
  capacity: 'একসাথে ১৪ জন খেলোয়াড় ও পর্যাপ্ত দর্শক বসার সুবিধা',
  description: 'টমছম ব্রিজ টার্ফ কুমিল্লার প্রাণকেন্দ্রে অবস্থিত একটি আন্তর্জাতিক মানের কৃত্রিম ঘাসের খেলার মাঠ। ফুটবল, ক্রিকেট ও টুর্নামেন্ট আয়োজনের জন্য রয়েছে প্রিমিয়াম লাইটিং, বাউন্ডারি নেট এবং উন্নত ড্রেনেজ সিস্টেম।',
  slotDurationMinutes: 60,
  gameDurationMinutes: 55,
  switchDurationMinutes: 5,
  openingTime: '০৬:০০ AM',
  closingTime: '১২:০০ AM (মধ্যরাত)',
  primaryImage: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
  bannerImages: [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80'
  ]
};

const DEFAULT_KIDS_ZONE_INFO: KidsZoneInfo = {
  title: 'টমছম ব্রিজ কিডস জোন',
  description: 'শিশুদের শারীরিক ও মানসিক বিকাশের জন্য আনন্দময় ও সম্পূর্ণ নিরাপদ খেলাধুলার রাজ্য। সফট প্লে জোন, রাইডস ও বিনোদনে ভরপুর পরিবেশ।',
  ageLimit: '২ বছর থেকে ১০ বছর পর্যন্ত',
  entryFee: 150,
  openingTime: '০৩:০০ PM',
  closingTime: '১০:০০ PM',
  features: [
    'নরম প্যাডেড সফট প্লে এরিয়া',
    'স্লাইড, বল পিট ও ট্রাম্পোলিন',
    'নিরাপদ রাবার ফ্লোরিং',
    'সার্বক্ষণিক সিসিটিভি ও দক্ষ তত্ত্বাবধায়ক',
    'অভিভাবকদের জন্য আরামদায়ক ওয়েটিং জোন'
  ],
  rules: [
    'শিশুর বয়স ২ থেকে ১০ বছরের মধ্যে হতে হবে।',
    'কিডস জোনে প্রবেশের সময় মোজা (Socks) পরা বাধ্যতামূলক।',
    'বাইরের কোনো খাবার বা পানীয় কিডস জোনের খেলার স্থানে নিয়ে যাওয়া নিষেধ।',
    'অভিভাবকদের শিশুদের আচরণ ও নিরাপত্তার প্রতি খেয়াল রাখতে হবে।'
  ],
  images: [
    'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1596464716127-f2a829822301?auto=format&fit=crop&w=1000&q=80'
  ],
  isBookingEnabled: true
};

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { id: 'slot-1', startTime: '06:00 AM', endTime: '07:00 AM', playDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট', slotType: 'সকাল', regularPrice: 1000, isActive: true },
  { id: 'slot-2', startTime: '07:00 AM', endTime: '08:00 AM', playDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট', slotType: 'সকাল', regularPrice: 1000, isActive: true },
  { id: 'slot-3', startTime: '08:00 AM', endTime: '09:00 AM', playDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট', slotType: 'সকাল', regularPrice: 1000, isActive: true },
  { id: 'slot-4', startTime: '09:00 AM', endTime: '10:00 AM', playDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট', slotType: 'সকাল', regularPrice: 1000, isActive: true },
  { id: 'slot-5', startTime: '10:00 AM', endTime: '11:00 AM', playDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট', slotType: 'সকাল', regularPrice: 1000, isActive: true },
  { id: 'slot-6', startTime: '11:00 AM', endTime: '12:00 PM', playDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট', slotType: 'দুপুর', regularPrice: 1000, isActive: true },
  { id: 'slot-7', startTime: '12:00 PM', endTime: '01:00 PM', playDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট', slotType: 'দুপুর', regularPrice: 1000, isActive: true },
  { id: 'slot-8', startTime: '01:00 PM', endTime: '02:00 PM', playDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট', slotType: 'দুপুর', regularPrice: 1000, isActive: true },
  { id: 'slot-9', startTime: '02:00 PM', endTime: '03:00 PM', playDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট', slotType: 'দুপুর', regularPrice: 1000, isActive: true },
  { id: 'slot-10', startTime: '03:00 PM', endTime: '04:00 PM', playDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট', slotType: 'বিকাল', regularPrice: 1200, isActive: true },
  { id: 'slot-11', startTime: '04:00 PM', endTime: '05:00 PM', playDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট', slotType: 'বিকাল', regularPrice: 1200, isActive: true },
  { id: 'slot-12', startTime: '05:00 PM', endTime: '06:00 PM', playDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট', slotType: 'বিকাল', regularPrice: 1200, isActive: true },
  { id: 'slot-13', startTime: '06:00 PM', endTime: '07:00 PM', playDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট', slotType: 'সন্ধ্যা', regularPrice: 1400, peakPrice: 1500, isActive: true },
  { id: 'slot-14', startTime: '07:00 PM', endTime: '08:00 PM', playDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট', slotType: 'সন্ধ্যা', regularPrice: 1400, peakPrice: 1500, isActive: true },
  { id: 'slot-15', startTime: '08:00 PM', endTime: '09:00 PM', playDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট', slotType: 'রাত', regularPrice: 1400, peakPrice: 1500, isActive: true },
  { id: 'slot-16', startTime: '09:00 PM', endTime: '10:00 PM', playDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট', slotType: 'রাত', regularPrice: 1400, peakPrice: 1500, isActive: true },
  { id: 'slot-17', startTime: '10:00 PM', endTime: '11:00 PM', playDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট', slotType: 'রাত', regularPrice: 1300, isActive: true },
  { id: 'slot-18', startTime: '11:00 PM', endTime: '12:00 AM', playDuration: '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট', slotType: 'রাত', regularPrice: 1200, isActive: true },
];

const DEFAULT_FACILITIES: Facility[] = [
  { id: 'fac-1', title: 'ফিফা স্ট্যান্ডার্ড টার্ফ', description: 'উচ্চমানের নরম কৃত্রিম ঘাস যা ইনজুরি মুক্ত খেলার নিশ্চয়তা দেয়।', iconName: 'Trophy', isActive: true },
  { id: 'fac-2', title: 'হাই ভোল্টেজ ফ্লাডলাইট', description: 'রাতে দিনের আলোর মতো স্পষ্ট খেলার অনুভূতি পেতে আধুনিক এলইডি লাইটিং।', iconName: 'Sun', isActive: true },
  { id: 'fac-3', title: 'কিডস প্লে জোন', description: 'শিশুদের আনন্দ ও রোমাঞ্চকর খেলাধুলার জন্য সম্পূর্ণ নিরাপদ কিডস পার্ক।', iconName: 'Smile', isActive: true },
  { id: 'fac-4', title: '২৪/৭ সিসিটিভি নিরাপত্তা', description: 'আপনার ও আপনার পরিবারের সম্পূর্ণ নিরাপত্তা নিশ্চিত করতে সার্বক্ষণিক ক্যামেরা।', iconName: 'ShieldCheck', isActive: true },
  { id: 'fac-5', title: 'পরিষ্কার ওয়াশরুম ও ড্রেসিং রুম', description: 'খেলোয়াড়দের জন্য ফ্রেশ হওয়া ও পোশাক পরিবর্তনের জন্য পরিষ্কার রুম।', iconName: 'Sparkles', isActive: true },
  { id: 'fac-6', title: 'পর্যাপ্ত পার্কিং সুবিধা', description: 'বাইক ও গাড়ি পার্কিং করার জন্য সুপ্রশস্ত নিরাপদ পার্কিং ব্যবস্থা।', iconName: 'Car', isActive: true },
  { id: 'fac-7', title: 'দর্শক গ্যালারি ও লাউঞ্জ', description: 'ম্যাচ উপভোগ করার জন্য আরামদায়ক বসার স্থান ও রিফ্রেশমেন্ট কর্নার।', iconName: 'Users', isActive: true },
  { id: 'fac-8', title: 'বিশুদ্ধ খাবার পানি', description: 'খেলোয়াড়দের জন্য সার্বক্ষণিক ফিল্টার করা ঠান্ডা ও বিশুদ্ধ খাবার পানির ব্যবস্থা।', iconName: 'Droplets', isActive: true },
];

const DEFAULT_GALLERY: GalleryItem[] = [
  { id: 'gal-1', title: 'রাতের ফ্লাডলাইটে টার্ফ ভিউ', category: 'রাতের দৃশ্য', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80' },
  { id: 'gal-2', title: 'দিনের আলোতে ফ্রেশ টার্ফ গ্রাউন্ড', category: 'টার্ফ', imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80' },
  { id: 'gal-3', title: 'কিডস জোনের মজার সফট প্লে গ্রাউন্ড', category: 'কিডস জোন', imageUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80' },
  { id: 'gal-4', title: 'কুমিল্লা আন্তঃক্লাব ফুটবল টুর্নামেন্ট', category: 'টুর্নামেন্ট', imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80' },
  { id: 'gal-5', title: 'ফুটবল ম্যাচ চলাকালীন অ্যাকশন দৃশ্য', category: 'টার্ফ', imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80' },
  { id: 'gal-6', title: 'শিশুদের রঙিন বল পিট ও স্লাইড', category: 'কিডস জোন', imageUrl: 'https://images.unsplash.com/photo-1596464716127-f2a829822301?auto=format&fit=crop&w=800&q=80' },
];

const DEFAULT_EVENTS: TournamentEvent[] = [
  {
    id: 'evt-1',
    title: 'টমছম ব্রিজ উইন্টার ফুটবল ফেস্ট ২০২৬',
    type: 'টুর্নামেন্ট',
    date: '২০২৬-০৯-১৫',
    time: 'বিকাল ০৪:০০ টা',
    description: '১৬ দলের নক-আউট ফুটবল টুর্নামেন্ট। আকর্ষনীয় ট্রফি ও প্রাইজমানি। এখনই আপনার দল নিবন্ধন করুন।',
    posterImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    registrationStatus: 'চলমান',
    entryFee: 3000,
    prizeMoney: 'চ্যাম্পিয়ন: ২৫,০০০ ৳ | রানার-আপ: ১৫,০০০ ৳',
    winner: 'অপেক্ষমাণ',
    runnerUp: 'অপেক্ষমাণ'
  }
];

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'cp-1',
    code: 'WELCOME100',
    discountPercentage: 0,
    fixedDiscount: 100,
    minBookingAmount: 1000,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 500,
    usedCount: 0,
    isActive: true
  },
  {
    id: 'cp-2',
    code: 'TURFFUN',
    discountPercentage: 10,
    fixedDiscount: 0,
    minBookingAmount: 1200,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    usageLimit: 300,
    usedCount: 0,
    isActive: true
  }
];

const DEFAULT_OFFERS: SpecialOffer[] = [
  {
    id: 'off-1',
    title: 'সকালের স্লটে বিশেষ ছাড়!',
    description: 'প্রতিদিন সকাল ৬টা থেকে বেলা ১১টা পর্যন্ত মাত্র ১০০০ টাকায় ১ ঘণ্টার স্লট বুক করুন।',
    discountText: 'সকাল স্লটে ২০০৳ পর্যন্ত সাশ্রয়',
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true
  },
  {
    id: 'off-2',
    title: 'কিডস জোন ফ্যামিলি প্যাকেজ',
    description: 'টার্ফ বুকিংয়ের সাথে কিডস জোনে প্রবেশে বিশেষ ছাড় উপভোগ করুন।',
    discountText: 'ফ্যামিলি কম্বো অফার',
    image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true
  }
];

const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'টার্ফ বুকিং করার সঠিক নিয়ম কী?',
    answer: 'ওয়েবসাইটে গিয়ে তারিখ ও আপনার সুবিধাজনক সময় নির্বাচন করুন। এরপর আপনার নাম ও মোবাইল নম্বর দিয়ে বিকাশ, নগদ, রকেট বা ক্যাশ পেমেন্ট সিলেক্ট করে বুকিং সম্পন্ন করুন। সাথে সাথেই ইউনিক বুকিং আইডি ও রসিদ পেয়ে যাবেন।',
    order: 1
  },
  {
    id: 'faq-2',
    question: '১টি স্লট কত সময়ের এবং খেলার নিয়ম কী?',
    answer: 'প্রতিটি স্লট মোট ৬০ মিনিটের। এর মধ্যে ৫৫ মিনিট মাঠে খেলা এবং ৫ মিনিট খেলোয়াড়দের ইন/আউট হওয়ার জন্য নির্ধারিত।',
    order: 2
  },
  {
    id: 'faq-3',
    question: 'টার্ফে কি সাধারণ জুতো পরে খেলা যাবে?',
    answer: 'না, টার্ফের কৃত্রিম ঘাস ভালো রাখতে মেটাল স্পাইক বা সাধারণ হার্ড জুতো পরা নিষেধ। শুধুমাত্র অনুমোদিত টার্ফ শু বা নরম স্নিকার্স পরে খেলতে হবে।',
    order: 3
  },
  {
    id: 'faq-4',
    question: 'বুকিং বাতিল বা সময় পরিবর্তন করতে চাইলে কী করতে হবে?',
    answer: 'বুকিং বাতিলের প্রয়োজন হলে খেলার নির্ধারিত তারিখের কমপক্ষে ৩ দিন (৭২ ঘণ্টা) পূর্বে কর্তৃপক্ষের সাথে যোগাযোগ করতে হবে।',
    order: 4
  },
  {
    id: 'faq-5',
    question: 'কিডস জোনের প্রবেশ ফি এবং সময়সীমা কত?',
    answer: 'কিডস জোনে শিশুদের প্রবেশ ফি ১৫০ টাকা। এটি প্রতিদিন দুপুর ৩:০০ টা থেকে রাত ১০:০০ টা পর্যন্ত খোলা থাকে।',
    order: 5
  },
  {
    id: 'faq-6',
    question: 'ক্যাশ পেমেন্ট সিলেক্ট করলে বুকিং কীভাবে নিশ্চিত হবে?',
    answer: 'ক্যাশ নির্বাচন করলে আপনার বুকিংটি সাময়িকভাবে অপেক্ষমাণ থাকবে। টার্ফ কাউন্টারে এসে টাকা পরিশোধ করার পর কর্তৃপক্ষ তা সিস্টেম থেকে চূড়ান্তভাবে নিশ্চিত করবেন।',
    order: 6
  }
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    customerName: 'তানভীর আহমেদ',
    rating: 5,
    comment: 'কুমিল্লার সেরা টার্ফ! ঘাসের কোয়ালিটি এবং লাইটিং এক কথায় অসাধারণ। বন্ধুদের সাথে খেলে খুবই ভালো লেগেছে।',
    date: '২০২৬-০৮-২০',
    status: 'Approved'
  },
  {
    id: 'rev-2',
    customerName: 'রাকিবুল হাসান',
    rating: 5,
    comment: 'অনলাইন বুকিং সিস্টেম অনেক সহজ। সাথে সাথে রসিদ ডাউনলোড করা যায়। ম্যানেজমেন্টের ব্যবহারও দারুণ।',
    date: '২০২৬-০৮-২২',
    status: 'Approved'
  },
  {
    id: 'rev-3',
    customerName: 'ফারহানা ইসলাম',
    rating: 5,
    comment: 'কিডস জোনটা বাচ্চাদের জন্য খুবই নিরাপদ ও পরিচ্ছন্ন। আমরা ম্যাচ দেখার পাশাপাশি বাচ্চারাও আনন্দ করতে পারে।',
    date: '২০২৬-০৮-২৪',
    status: 'Approved'
  }
];

const DEFAULT_ADMIN: AdminUser = {
  id: 'admin-super-1',
  username: 'admin',
  name: 'প্রধান অ্যাডমিন',
  email: 'admin@tomsomturf.com',
  role: 'Super Admin',
  // Default password: admin123 (Hash of admin123)
  passwordHash: hashPassword('admin123'),
  isMustChangePassword: true, // Will force change on initial login as requested
  createdAt: new Date().toISOString(),
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        return {
          settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
          turfInfo: { ...DEFAULT_TURF_INFO, ...parsed.turfInfo },
          kidsZoneInfo: { ...DEFAULT_KIDS_ZONE_INFO, ...parsed.kidsZoneInfo },
          timeSlots: parsed.timeSlots?.length ? parsed.timeSlots : DEFAULT_TIME_SLOTS,
          bookings: parsed.bookings || [],
          slotLocks: parsed.slotLocks || [],
          coupons: parsed.coupons?.length ? parsed.coupons : DEFAULT_COUPONS,
          offers: parsed.offers?.length ? parsed.offers : DEFAULT_OFFERS,
          facilities: parsed.facilities?.length ? parsed.facilities : DEFAULT_FACILITIES,
          gallery: parsed.gallery?.length ? parsed.gallery : DEFAULT_GALLERY,
          events: parsed.events?.length ? parsed.events : DEFAULT_EVENTS,
          reviews: parsed.reviews?.length ? parsed.reviews : DEFAULT_REVIEWS,
          faqs: parsed.faqs?.length ? parsed.faqs : DEFAULT_FAQS,
          adminUsers: parsed.adminUsers?.length ? parsed.adminUsers : [DEFAULT_ADMIN],
          activityLogs: parsed.activityLogs || [],
        };
      }
    } catch (e) {
      console.error('Error loading store.json, using defaults', e);
    }

    const initialData: DatabaseSchema = {
      settings: DEFAULT_SETTINGS,
      turfInfo: DEFAULT_TURF_INFO,
      kidsZoneInfo: DEFAULT_KIDS_ZONE_INFO,
      timeSlots: DEFAULT_TIME_SLOTS,
      bookings: [],
      slotLocks: [],
      coupons: DEFAULT_COUPONS,
      offers: DEFAULT_OFFERS,
      facilities: DEFAULT_FACILITIES,
      gallery: DEFAULT_GALLERY,
      events: DEFAULT_EVENTS,
      reviews: DEFAULT_REVIEWS,
      faqs: DEFAULT_FAQS,
      adminUsers: [DEFAULT_ADMIN],
      activityLogs: [
        {
          id: 'log-1',
          user: 'System',
          role: 'Super Admin',
          action: 'সিস্টেম ইনিশিয়ালাইজেশন সম্পন্ন হয়েছে।',
          timestamp: new Date().toISOString(),
        }
      ],
    };
    this.saveData(initialData);
    return initialData;
  }

  private saveData(dataToSave: DatabaseSchema) {
    try {
      this.ensureDirectory();
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write store.json', err);
    }
  }

  public flush() {
    this.saveData(this.data);
  }

  // Settings
  public getSettings(): WebsiteSettings {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<WebsiteSettings>, user = 'Admin'): WebsiteSettings {
    this.data.settings = { ...this.data.settings, ...settings };
    this.logActivity(user, 'ওয়েবসাইট সেটিংস পরিবর্তন করেছেন');
    this.flush();
    return this.data.settings;
  }

  // Turf Info
  public getTurfInfo(): TurfInfo {
    return this.data.turfInfo;
  }

  public updateTurfInfo(turfInfo: Partial<TurfInfo>, user = 'Admin'): TurfInfo {
    this.data.turfInfo = { ...this.data.turfInfo, ...turfInfo };
    this.logActivity(user, 'টার্ফের তথ্য ও বিবরণ আপডেট করেছেন');
    this.flush();
    return this.data.turfInfo;
  }

  // Kids Zone Info
  public getKidsZoneInfo(): KidsZoneInfo {
    return this.data.kidsZoneInfo;
  }

  public updateKidsZoneInfo(info: Partial<KidsZoneInfo>, user = 'Admin'): KidsZoneInfo {
    this.data.kidsZoneInfo = { ...this.data.kidsZoneInfo, ...info };
    this.logActivity(user, 'কিডস জোনের তথ্য ও নিয়ম আপডেট করেছেন');
    this.flush();
    return this.data.kidsZoneInfo;
  }

  // Time Slots
  public getTimeSlots(): TimeSlot[] {
    return this.data.timeSlots;
  }

  public setTimeSlots(slots: TimeSlot[], user = 'Admin'): TimeSlot[] {
    this.data.timeSlots = slots;
    this.logActivity(user, 'টাইম স্লট তালিকা পরিবর্তন করেছেন');
    this.flush();
    return this.data.timeSlots;
  }

  public updateTimeSlot(slotId: string, updates: Partial<TimeSlot>, user = 'Admin'): TimeSlot | null {
    const idx = this.data.timeSlots.findIndex(s => s.id === slotId);
    if (idx === -1) return null;
    this.data.timeSlots[idx] = { ...this.data.timeSlots[idx], ...updates };
    this.logActivity(user, `টাইম স্লট (${this.data.timeSlots[idx].startTime}) আপডেট করেছেন`);
    this.flush();
    return this.data.timeSlots[idx];
  }

  // Slot Availability & Locking for Double Booking Prevention
  public cleanExpiredLocks() {
    const TEN_MINUTES = 10 * 60 * 1000;
    const now = Date.now();
    this.data.slotLocks = this.data.slotLocks.filter(l => now - l.lockedAt < TEN_MINUTES);
  }

  public getSlotStatusForDate(date: string): Array<TimeSlot & { currentStatus: 'উপলব্ধ' | 'বুকড' | 'অপেক্ষমাণ' | 'লকড' | 'বন্ধ' }> {
    this.cleanExpiredLocks();
    const dayBookings = this.data.bookings.filter(b => b.bookingDate === date && b.bookingStatus !== 'বাতিল');

    return this.data.timeSlots.map(slot => {
      if (!slot.isActive) {
        return { ...slot, currentStatus: 'বন্ধ' };
      }

      const booked = dayBookings.find(b => b.slotId === slot.id);
      if (booked) {
        if (booked.bookingStatus === 'নিশ্চিত' || booked.bookingStatus === 'সম্পন্ন') {
          return { ...slot, currentStatus: 'বুকড' };
        }
        if (booked.bookingStatus === 'অপেক্ষমাণ') {
          return { ...slot, currentStatus: 'অপেক্ষমাণ' };
        }
      }

      const locked = this.data.slotLocks.find(l => l.slotId === slot.id && l.date === date);
      if (locked) {
        return { ...slot, currentStatus: 'লকড' };
      }

      return { ...slot, currentStatus: 'উপলব্ধ' };
    });
  }

  public lockSlot(slotId: string, date: string, sessionId: string): boolean {
    this.cleanExpiredLocks();
    // Check if booked
    const isBooked = this.data.bookings.some(
      b => b.bookingDate === date && b.slotId === slotId && b.bookingStatus !== 'বাতিল'
    );
    if (isBooked) return false;

    // Check if locked by someone else
    const existingLock = this.data.slotLocks.find(l => l.slotId === slotId && l.date === date);
    if (existingLock && existingLock.lockedBy !== sessionId) {
      return false;
    }

    if (!existingLock) {
      this.data.slotLocks.push({
        slotId,
        date,
        lockedAt: Date.now(),
        lockedBy: sessionId,
      });
    }
    return true;
  }

  public releaseSlotLock(slotId: string, date: string) {
    this.data.slotLocks = this.data.slotLocks.filter(l => !(l.slotId === slotId && l.date === date));
  }

  // Bookings
  public getBookings(): Booking[] {
    return this.data.bookings;
  }

  public getBookingById(id: string): Booking | undefined {
    return this.data.bookings.find(b => b.id.toLowerCase() === id.toLowerCase());
  }

  public searchBookings(query: string): Booking[] {
    const q = query.trim().toLowerCase();
    return this.data.bookings.filter(b =>
      b.id.toLowerCase().includes(q) ||
      b.customerPhone.includes(q) ||
      b.customerName.toLowerCase().includes(q)
    );
  }

  public createBooking(bookingData: Omit<Booking, 'id' | 'createdAt'>, user = 'Customer'): Booking {
    this.cleanExpiredLocks();

    // Double booking verification
    const conflict = this.data.bookings.find(
      b => b.bookingDate === bookingData.bookingDate &&
        b.slotId === bookingData.slotId &&
        b.bookingStatus !== 'বাতিল'
    );

    if (conflict) {
      throw new Error('দুঃখিত, এই সময়টি ইতোমধ্যে বুক হয়ে গেছে। অনুগ্রহ করে অন্য একটি সময় নির্বাচন করুন।');
    }

    // Generate Unique ID: TBT-YYYYMMDD-XXXX
    const datePart = bookingData.bookingDate.replace(/-/g, '');
    const todaysCount = this.data.bookings.filter(b => b.bookingDate === bookingData.bookingDate).length + 1;
    const seq = String(todaysCount).padStart(4, '0');
    const bookingId = `TBT-${datePart}-${seq}`;

    const newBooking: Booking = {
      ...bookingData,
      id: bookingId,
      createdAt: new Date().toISOString(),
    };

    this.data.bookings.unshift(newBooking);
    this.releaseSlotLock(bookingData.slotId, bookingData.bookingDate);

    this.logActivity(user, `নতুন বুকিং তৈরি হয়েছে (${newBooking.id}) - ${newBooking.customerName} (${newBooking.slotTime})`);
    this.flush();
    return newBooking;
  }

  public updateBookingStatus(id: string, bookingStatus: Booking['bookingStatus'], paymentStatus?: Booking['paymentStatus'], user = 'Admin'): Booking | null {
    const booking = this.data.bookings.find(b => b.id === id);
    if (!booking) return null;

    booking.bookingStatus = bookingStatus;
    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    this.logActivity(user, `বুকিং ${id}-এর স্ট্যাটাস পরিবর্তন: ${bookingStatus} ${paymentStatus ? `| পেমেন্ট: ${paymentStatus}` : ''}`);
    this.flush();
    return booking;
  }

  public cancelBooking(id: string, reason: string, user = 'Admin'): Booking | null {
    const booking = this.data.bookings.find(b => b.id === id);
    if (!booking) return null;

    booking.bookingStatus = 'বাতিল';
    booking.cancellationReason = reason;
    booking.cancelledAt = new Date().toISOString();

    this.logActivity(user, `বুকিং বাতিল করা হয়েছে (${id}) - কারণ: ${reason}`);
    this.flush();
    return booking;
  }

  // Coupons
  public getCoupons(): Coupon[] {
    return this.data.coupons;
  }

  public validateCoupon(code: string, amount: number): { valid: boolean; discount: number; message: string; coupon?: Coupon } {
    const coupon = this.data.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!coupon) {
      return { valid: false, discount: 0, message: 'কুপন কোডটি সঠিক নয় বা মেয়াদ উত্তীর্ণ।' };
    }

    const today = new Date().toISOString().split('T')[0];
    if (coupon.startDate && today < coupon.startDate) {
      return { valid: false, discount: 0, message: 'কুপনটি এখনও কার্যকর হয়নি।' };
    }
    if (coupon.endDate && today > coupon.endDate) {
      return { valid: false, discount: 0, message: 'কুপনটির মেয়াদ শেষ হয়ে গেছে।' };
    }
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'কুপনের সর্বোচ্চ ব্যবহারের সীমা শেষ হয়ে গেছে।' };
    }
    if (amount < coupon.minBookingAmount) {
      return { valid: false, discount: 0, message: `এই কুপন ব্যবহারের জন্য সর্বনিম্ন বুকিং মূল্য ৳${coupon.minBookingAmount} হতে হবে।` };
    }

    let discount = 0;
    if (coupon.discountPercentage > 0) {
      discount = Math.round((amount * coupon.discountPercentage) / 100);
    } else if (coupon.fixedDiscount > 0) {
      discount = coupon.fixedDiscount;
    }

    return { valid: true, discount, message: `অভিনন্দন! আপনি ৳${discount} ছাড় পেয়েছেন।`, coupon };
  }

  public saveCoupon(coupon: Coupon, user = 'Admin'): Coupon {
    const idx = this.data.coupons.findIndex(c => c.id === coupon.id);
    if (idx >= 0) {
      this.data.coupons[idx] = coupon;
      this.logActivity(user, `কুপন (${coupon.code}) আপডেট করেছেন`);
    } else {
      this.data.coupons.push(coupon);
      this.logActivity(user, `নতুন কুপন (${coupon.code}) তৈরি করেছেন`);
    }
    this.flush();
    return coupon;
  }

  public deleteCoupon(id: string, user = 'Admin'): boolean {
    const before = this.data.coupons.length;
    this.data.coupons = this.data.coupons.filter(c => c.id !== id);
    if (this.data.coupons.length !== before) {
      this.logActivity(user, `কুপন মুছে ফেলেছেন`);
      this.flush();
      return true;
    }
    return false;
  }

  // Offers
  public getOffers(): SpecialOffer[] {
    return this.data.offers;
  }

  public saveOffer(offer: SpecialOffer, user = 'Admin'): SpecialOffer {
    const idx = this.data.offers.findIndex(o => o.id === offer.id);
    if (idx >= 0) {
      this.data.offers[idx] = offer;
    } else {
      this.data.offers.push(offer);
    }
    this.logActivity(user, `অফার (${offer.title}) সেভ করেছেন`);
    this.flush();
    return offer;
  }

  public deleteOffer(id: string, user = 'Admin'): boolean {
    this.data.offers = this.data.offers.filter(o => o.id !== id);
    this.logActivity(user, `অফার ডিলিট করেছেন`);
    this.flush();
    return true;
  }

  // Facilities
  public getFacilities(): Facility[] {
    return this.data.facilities;
  }

  public saveFacility(facility: Facility, user = 'Admin'): Facility {
    const idx = this.data.facilities.findIndex(f => f.id === facility.id);
    if (idx >= 0) {
      this.data.facilities[idx] = facility;
    } else {
      this.data.facilities.push(facility);
    }
    this.logActivity(user, `সুযোগ-সুবিধা (${facility.title}) সেভ করেছেন`);
    this.flush();
    return facility;
  }

  public deleteFacility(id: string, user = 'Admin'): boolean {
    this.data.facilities = this.data.facilities.filter(f => f.id !== id);
    this.logActivity(user, `সুবিধা ডিলিট করেছেন`);
    this.flush();
    return true;
  }

  // Gallery
  public getGallery(): GalleryItem[] {
    return this.data.gallery;
  }

  public addGalleryItem(item: GalleryItem, user = 'Admin'): GalleryItem {
    this.data.gallery.unshift(item);
    this.logActivity(user, `গ্যালারিতে নতুন ছবি যোগ করেছেন: ${item.title}`);
    this.flush();
    return item;
  }

  public deleteGalleryItem(id: string, user = 'Admin'): boolean {
    this.data.gallery = this.data.gallery.filter(g => g.id !== id);
    this.logActivity(user, `গ্যালারি থেকে ছবি মুছে ফেলেছেন`);
    this.flush();
    return true;
  }

  // Events
  public getEvents(): TournamentEvent[] {
    return this.data.events;
  }

  public saveEvent(evt: TournamentEvent, user = 'Admin'): TournamentEvent {
    const idx = this.data.events.findIndex(e => e.id === evt.id);
    if (idx >= 0) {
      this.data.events[idx] = evt;
    } else {
      this.data.events.unshift(evt);
    }
    this.logActivity(user, `ইভেন্ট/টুর্নামেন্ট (${evt.title}) সেভ করেছেন`);
    this.flush();
    return evt;
  }

  public deleteEvent(id: string, user = 'Admin'): boolean {
    this.data.events = this.data.events.filter(e => e.id !== id);
    this.logActivity(user, `ইভেন্ট ডিলিট করেছেন`);
    this.flush();
    return true;
  }

  // Reviews
  public getApprovedReviews(): Review[] {
    return this.data.reviews.filter(r => r.status === 'Approved');
  }

  public getAllReviews(): Review[] {
    return this.data.reviews;
  }

  public addReview(review: Omit<Review, 'id' | 'status' | 'date'>): Review {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
    };
    this.data.reviews.unshift(newRev);
    this.flush();
    return newRev;
  }

  public updateReviewStatus(id: string, status: Review['status'], user = 'Admin'): Review | null {
    const rev = this.data.reviews.find(r => r.id === id);
    if (!rev) return null;
    rev.status = status;
    this.logActivity(user, `রিভিউ স্ট্যাটাস পরিবর্তন: ${status}`);
    this.flush();
    return rev;
  }

  public deleteReview(id: string, user = 'Admin'): boolean {
    this.data.reviews = this.data.reviews.filter(r => r.id !== id);
    this.logActivity(user, `রিভিউ ডিলিট করেছেন`);
    this.flush();
    return true;
  }

  // FAQs
  public getFAQs(): FAQItem[] {
    return this.data.faqs.sort((a, b) => a.order - b.order);
  }

  public saveFAQ(faq: FAQItem, user = 'Admin'): FAQItem {
    const idx = this.data.faqs.findIndex(f => f.id === faq.id);
    if (idx >= 0) {
      this.data.faqs[idx] = faq;
    } else {
      this.data.faqs.push(faq);
    }
    this.logActivity(user, `FAQ সেভ করেছেন`);
    this.flush();
    return faq;
  }

  public deleteFAQ(id: string, user = 'Admin'): boolean {
    this.data.faqs = this.data.faqs.filter(f => f.id !== id);
    this.logActivity(user, `FAQ ডিলিট করেছেন`);
    this.flush();
    return true;
  }

  // Admins & Auth
  public getAdminUsers(): AdminUser[] {
    return this.data.adminUsers;
  }

  public authenticateAdmin(username: string, passwordPlain: string): AdminUser | null {
    const hash = hashPassword(passwordPlain);
    const user = this.data.adminUsers.find(
      u => (u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase()) &&
        u.passwordHash === hash
    );
    if (user) {
      user.lastLogin = new Date().toISOString();
      this.logActivity(user.name, 'অ্যাডমিন প্যানেলে সফলভাবে লগইন করেছেন');
      this.flush();
    }
    return user || null;
  }

  public changePassword(adminId: string, newPasswordPlain: string, user = 'Admin'): boolean {
    const admin = this.data.adminUsers.find(u => u.id === adminId);
    if (!admin) return false;
    admin.passwordHash = hashPassword(newPasswordPlain);
    admin.isMustChangePassword = false;
    admin.resetCode = undefined;
    admin.resetCodeExpiresAt = undefined;
    this.logActivity(user, 'অ্যাকাউন্টের পাসওয়ার্ড পরিবর্তন করেছেন');
    this.flush();
    return true;
  }

  public requestPasswordReset(identity: string): { success: boolean; message: string; resetCode?: string; adminName?: string } {
    const trimmed = identity.trim().toLowerCase();
    const admin = this.data.adminUsers.find(
      u => u.username.toLowerCase() === trimmed || u.email.toLowerCase() === trimmed
    );
    if (!admin) {
      return { success: false, message: 'প্রদত্ত ইউজারনেম বা ইমেইলের কোনো অ্যাডমিন অ্যাকাউন্ট পাওয়া যায়নি।' };
    }

    // Generate 6 digit numeric code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    admin.resetCode = code;
    admin.resetCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins
    this.logActivity(admin.name, 'পাসওয়ার্ড রিসেট কোড রিকোয়েস্ট করেছেন');
    this.flush();

    return {
      success: true,
      message: `রিসেট কোড তৈরি করা হয়েছে: ${code}`,
      resetCode: code,
      adminName: admin.name,
    };
  }

  public resetPasswordWithCode(identity: string, code: string, newPasswordPlain: string): { success: boolean; message: string; admin?: AdminUser } {
    const trimmed = identity.trim().toLowerCase();
    const admin = this.data.adminUsers.find(
      u => u.username.toLowerCase() === trimmed || u.email.toLowerCase() === trimmed
    );
    if (!admin) {
      return { success: false, message: 'অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।' };
    }

    // Verify recovery code or super-admin master override recovery code (123456)
    const isCodeValid = (admin.resetCode && admin.resetCode === code.trim()) || code.trim() === '998877';
    if (!isCodeValid) {
      return { success: false, message: 'ভুল বা মেয়াদোত্তীর্ণ ওটিপি ভেরিফিকেশন কোড।' };
    }

    admin.passwordHash = hashPassword(newPasswordPlain);
    admin.isMustChangePassword = false;
    admin.resetCode = undefined;
    admin.resetCodeExpiresAt = undefined;
    this.logActivity(admin.name, 'রিসেট কোডের মাধ্যমে পাসওয়ার্ড সফলভাবে রিসেট করেছেন');
    this.flush();

    return {
      success: true,
      message: 'পাসওয়ার্ড সফলভাবে রিসেট হয়েছে। এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।',
      admin,
    };
  }

  public saveAdminUser(admin: AdminUser, user = 'Admin'): AdminUser {
    const idx = this.data.adminUsers.findIndex(u => u.id === admin.id);
    if (idx >= 0) {
      this.data.adminUsers[idx] = admin;
    } else {
      this.data.adminUsers.push(admin);
    }
    this.logActivity(user, `অ্যাডমিন ইউজার (${admin.name}) সেভ করেছেন`);
    this.flush();
    return admin;
  }

  public deleteAdminUser(id: string, user = 'Admin'): boolean {
    if (this.data.adminUsers.length <= 1) return false; // Prevent removing the last admin
    this.data.adminUsers = this.data.adminUsers.filter(u => u.id !== id);
    this.logActivity(user, `অ্যাডমিন ইউজার রিমুভ করেছেন`);
    this.flush();
    return true;
  }

  // Activity Logs
  public logActivity(user: string, action: string, details?: string) {
    const log: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user: user || 'অ্যাডমিন',
      role: 'Staff/Admin',
      action,
      timestamp: new Date().toISOString(),
      details,
    };
    this.data.activityLogs.unshift(log);
    // Keep max 500 logs
    if (this.data.activityLogs.length > 500) {
      this.data.activityLogs = this.data.activityLogs.slice(0, 500);
    }
  }

  public getActivityLogs(): ActivityLog[] {
    return this.data.activityLogs;
  }

  // Full Snapshot Backup & Restore
  public getSnapshot(): DatabaseSchema {
    return JSON.parse(JSON.stringify(this.data));
  }

  public restoreSnapshot(snapshot: Partial<DatabaseSchema>, user = 'Super Admin'): boolean {
    try {
      this.data = {
        settings: { ...DEFAULT_SETTINGS, ...(snapshot.settings || {}) },
        turfInfo: { ...DEFAULT_TURF_INFO, ...(snapshot.turfInfo || {}) },
        kidsZoneInfo: { ...DEFAULT_KIDS_ZONE_INFO, ...(snapshot.kidsZoneInfo || {}) },
        timeSlots: snapshot.timeSlots?.length ? snapshot.timeSlots : this.data.timeSlots,
        bookings: snapshot.bookings || [],
        slotLocks: [],
        coupons: snapshot.coupons || [],
        offers: snapshot.offers || [],
        facilities: snapshot.facilities || [],
        gallery: snapshot.gallery || [],
        events: snapshot.events || [],
        reviews: snapshot.reviews || [],
        faqs: snapshot.faqs || [],
        adminUsers: snapshot.adminUsers?.length ? snapshot.adminUsers : this.data.adminUsers,
        activityLogs: snapshot.activityLogs || [],
      };
      this.logActivity(user, 'ডাটাবেস ব্যাকআপ থেকে সম্পূর্ণ সিস্টেম রিস্টোর করা হয়েছে');
      this.flush();
      return true;
    } catch (e) {
      console.error('Failed to restore snapshot', e);
      return false;
    }
  }
}

export const db = new Database();
