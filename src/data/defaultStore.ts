import type {
  AdminUser,
  Booking,
  Coupon,
  Facility,
  FAQItem,
  GalleryItem,
  KidsZoneInfo,
  Review,
  SpecialOffer,
  TimeSlot,
  TournamentEvent,
  TurfInfo,
  WebsiteSettings,
} from '../types';

export const defaultSettings: WebsiteSettings = {
  websiteNameBn: "টমছম ব্রিজ টার্ফ ও কিডস জোন",
  websiteNameEn: "Tomsom Bridge Turf & Kids Zone",
  tagline: "খেলাধুলা, বিনোদন ও আনন্দের এক ঠিকানা",
  logoUrl: "",
  faviconUrl: "",
  heroHeadline: "টমছম ব্রিজ টার্ফ ও কিডস জোন",
  heroSubheadline: "আন্তর্জাতিক মানের কৃত্রিম ঘাসের ফুটবল টার্ফ এবং শিশুদের জন্য নিরাপদ ও রোমাঞ্চকর কিডস জোন।",
  heroImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80",
  heroBadge: "কুমিল্লার সেরা স্পোর্টস ও এন্টারটেইনমেন্ট জোন",
  topbarText: "টমছম ব্রিজ টার্ফ ও কিডস জোনে আপনাকে স্বাগতম! অগ্রিম অনলাইন বুকিং চলছে।",
  isTopbarActive: true,
  headerBookingBtnText: "এখনই বুক করুন",
  headerSearchBtnText: "বুকিং অনুসন্ধান",
  heroBookingBtnText: "এখনই বুক করুন",
  heroKidsBtnText: "কিডস জোন দেখুন",
  footerAboutText: "টমছম ব্রিজ টার্ফ ও কিডস জোন কুমিল্লায় খেলাধুলা ও পরিবারের বিনোদনের জন্য একটি প্রিমিয়াম আন্তর্জাতিক মানের স্পোর্টস কমপ্লেক্স। ফিফা কোয়ালিটি টার্ফ ও শিশুদের জন্য রঙিন রাইডস।",
  footerCopyrightText: "টমছম ব্রিজ টার্ফ ও কিডস জোন। সর্বস্বত্ব সংরক্ষিত।",
  footerNoticeText: "বুকিং সংক্রান্ত যে কোন সহায়তায় আমাদের হটলাইনে যোগাযোগ করুন।",
  phone: "01869818818",
  phoneSecondary: "01712000000",
  whatsapp: "8801869818818",
  email: "tomsomturf@gmail.com",
  addressBn: "মধ্য আশরাফপুর, মাজার গেট (টমসন ব্রিজ সংলগ্ন), কুমিল্লা।",
  addressEn: "Madhyam Ashrafpur, Mazar Gate (Adjacent to Tomsom Bridge), Cumilla",
  locationLandmark: "টমসন ব্রিজ পার হয়ে মাজার গেটের ঠিক পাশেই অবস্থিত।",
  googleMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.887640248464!2d91.1785!3d23.4567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDI3JzI0LjEiTiA5McKwMTAnNDIuNiJF!5e0!3m2!1sbn!2sbd!4v1620000000000!5m2!1sbn!2sbd",
  googleMapDirectLink: "https://maps.google.com/?q=Tomsom+Bridge+Cumilla",
  facebookPageUrl: "https://www.facebook.com/profile.php?id=61589880077238",
  instagramUrl: "",
  youtubeUrl: "",
  currencySymbol: "৳",
  timezone: "Asia/Dhaka",
  regularPrice: 800,
  nightPrice: 1200,
  weekendPrice: 1000,
  cancellationNoticeDays: 3,
  cancellationPolicyText: "বুকিং বাতিল বা সময় পরিবর্তনের প্রয়োজন হলে খেলার নির্ধারিত তারিখের কমপক্ষে ৩ দিন (৭২ ঘণ্টা) আগে কর্তৃপক্ষকে জানাতে হবে। অন্যথায় বুকিং ফি ফেরতযোগ্য হবে না।",
  rulesList: [
    "নির্ধারিত খেলার সময়ের কমপক্ষে ৫–১০ মিনিট পূর্বে মাঠে উপস্থিত হতে হবে।",
    "বুকিং সময়ের অতিরিক্ত সময় মাঠে অবস্থান করা বা খেলা চালিয়ে যাওয়া সম্পূর্ণ নিষেধ।",
    "প্রতিটি স্লট ৬০ মিনিটের (৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট ও প্রস্তুত হওয়ার সময়)।",
    "টার্ফের কোনো সরঞ্জাম, জাল, ঘাস বা আলোর ক্ষতিসাধন করলে উপযুক্ত ক্ষতিপূরণ দিতে হবে।",
    "মাঠ বা গ্যালারির ভেতর চিপসের প্যাকেট, বোতল বা কোনো ধরনের ময়লা ফেলা সম্পূর্ণ নিষিদ্ধ।",
    "টার্ফ চত্বরে ধূমপান, ই-সিগারেট ও যেকোনো ধরনের মাদকদ্রব্য গ্রহণ কঠোরভাবে নিষিদ্ধ।",
    "টার্ফে শুধুমাত্র অনুমোদিত টার্ফ শু (Turf Shoes) পরিধান করে প্রবেশ করতে হবে। মেটাল স্পাইক বা সাধারণ শক্ত জুতো নিষেধ।",
    "মাঠে বা আঙিনায় কোনো ধরনের মারামারি, অশালীন আচরণ বা বিশৃঙ্খলা বরদাশত করা হবে না।",
    "অনুমোদিত বুকিং ব্যতীত অন্য কারও মাঠে অনধিকার প্রবেশ নিষিদ্ধ।",
    "ব্যক্তিগত মূল্যবান সামগ্রী (মোবাইল, ওয়ালেট, ব্যাগ)-এর দায়িত্ব সম্পূর্ণ ব্যবহারকারীর।",
    "কিডস জোনে শিশুদের অভিভাবকের সার্বক্ষণিক তত্ত্বাবধানে রাখতে হবে।",
    "প্রাকৃতিক দুর্যোগ, ভারী বৃষ্টি বা যেকোনো অনিবার্য কারণে খেলা স্থগিত হলে কর্তৃপক্ষের সিদ্ধান্তই চূড়ান্ত।"
  ],
  bkashNumber: "01869818818",
  bkashType: "Merchant",
  nagadNumber: "01869818818",
  nagadType: "Personal",
  rocketNumber: "01869818818",
  rocketType: "Personal",
  cashInstruction: "টার্ফে উপস্থিত হয়ে কাউন্টারে ক্যাশ পেমেন্ট করতে পারবেন। কাউন্টার থেকে ক্যাশ পরিশোধ নিশ্চিত করার পর বুকিং চূড়ান্ত হবে।",
  receiptHeaderTitle: "TOMSOM BRIDGE TURF & KIDS ZONE",
  receiptHeaderSubtitle: "Madhya Ashrafpur, Mazar Gate (Near Tomsom Bridge), Cumilla",
  receiptContactText: "Phone: 01869818818 | Web: tomsomturf.com",
  receiptFooterNote: "ধন্যবাদ! টমছম ব্রিজ টার্ফ ও কিডস জোনে আপনাকে স্বাগতম।",
  receiptAuthorizedSealText: "অফিসিয়াল অনুমোদিত ডিজিটাল ভাউচার",
  receiptFooterRules: [
    "নির্ধারিত খেলার সময়ের ১৫ মিনিট পূর্বে মাঠে উপস্থিত হতে হবে।",
    "টার্ফে শুধুমাত্র অনুমোদিত টার্ফ বুট / ফ্ল্যাট স্নিকার্স প্রযোজ্য। মেটাল স্পাইক নিষিদ্ধ।",
    "মাঠের অভ্যন্তরে ধূমপান, পান ও বাইরের ভারী খাবার সম্পূর্ণ নিষিদ্ধ।",
    "বুকিং বাতিল বা সময় পরিবর্তনের জন্য কমপক্ষে ৩ দিন আগে অবহিত করতে হবে।"
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
    contact: true
  },
  seo: {
    metaTitle: "টমছম ব্রিজ টার্ফ ও কিডস জোন | কুমিল্লা",
    metaDescription: "কুমিল্লার মধ্য আশরাফপুর মাজার গেটে অবস্থিত আধুনিক টমছম ব্রিজ টার্ফ ও কিডস জোন। অনলাইন স্লট বুকিং ও খেলার সুব্যবস্থা।",
    keywords: "টমছম ব্রিজ টার্ফ, টমছম ব্রিজ টার্ফ বুকিং, কুমিল্লা টার্ফ, কুমিল্লা ফুটবল টার্ফ, টমছম ব্রিজ কিডস জোন",
    ogImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80"
  }
};

export const defaultTurfInfo: TurfInfo = {
  titleBn: "আন্তর্জাতিক মানের ফুটবল ও ক্রিকেট টার্ফ",
  titleEn: "International Standard Football & Cricket Turf",
  descriptionBn: "ফিফা অনুমোদিত ৫০ মিমি প্রিমিয়াম কৃত্রিম ঘাস, শক্তিশালী হাই-লুমেন ফ্লাডলাইট, উন্নত বাউন্ডারি সেফটি নেট এবং পূর্ণাঙ্গ ড্রেনেজ সিস্টেম। বৃষ্টিতেও জমে না পানি!",
  descriptionEn: "FIFA quality 50mm artificial grass turf with high lumen LED floodlights, advanced safety nets, and all-weather drainage.",
  lengthFeet: 110,
  widthFeet: 65,
  grassType: "FIFA Quality 50mm Monofilament Synthetic Turf",
  lighting: "12x High-Power Anti-Glare LED Floodlights",
  recommendedPlayers: "5 vs 5 / 6 vs 6 / 7 vs 7",
  suitableSports: ["ফুটবল (Futsal/Football)", "বক্স ক্রিকেট (Box Cricket)", "ব্যাডমিন্টন", "ফিটনেস ট্রেনিং"],
  highlights: [
    "৫০ মিমি প্রিমিয়াম মোনোফিলামেন্ট শক-অ্যাবজরবিং ঘাস",
    "নাইট ম্যাচের জন্য উচ্চমানের ফ্লাডলাইট ব্যবস্থা",
    "পূর্ণাঙ্গ সেফটি নেট ও বল রিবাউন্ড বাউন্ডারি",
    "প্লেয়ার্স ডাগআউট ও রিফ্রেশমেন্ট কর্নার",
    "বৃষ্টি প্রতিরোধী অল-ওয়েদার ড্রেনেজ প্রযুক্তি",
    "ফুটবল, ক্রিকেট বল ও বিবস ফ্রি প্রদান"
  ],
  galleryImages: [
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80"
  ]
};

export const defaultKidsZoneInfo: KidsZoneInfo = {
  titleBn: "নিরাপদ ও রঙিন কিডস জোন",
  titleEn: "Safe & Colorful Kids Entertainment Zone",
  descriptionBn: "শিশুদের আনন্দময় শৈশব ও শারীরিক বিকাশের জন্য কুমিল্লার সেরা পারিবারিক বিনোদন কেন্দ্র। নরম ম্যাটযুক্ত মেঝে, আধুনিক রাইডস ও সার্বক্ষণিক নিরাপত্তা নিশ্চিত।",
  descriptionEn: "A vibrant, safe, and fun wonderland for kids with soft cushioned flooring, exciting rides, and full adult supervision.",
  ageGroup: "২ বছর থেকে ১২ বছর বয়স পর্যন্ত",
  rides: [
    { id: '1', name: 'টয় ট্রেন (Mini Toy Train)', description: 'শিশুদের প্রিয় রঙিন মিউজিক্যাল ট্রেন রাইড', icon: 'Train' },
    { id: '2', name: 'জাম্পিং বাউন্সি ক্যাসেল', description: 'নিরাপদ ইনফ্লেটেবল জাম্পিং হাউজ', icon: 'Smile' },
    { id: '3', name: 'স্লাইডার ও ক্লাইম্বার', description: 'নরম স্পাইরাল স্লাইডার ও আরোহন গেম', icon: 'Flame' },
    { id: '4', name: 'বল পুল ও সফট প্লে এরিয়া', description: 'হাজারো রঙিন বলের নরম খেলার জায়গা', icon: 'Sparkles' },
    { id: '5', name: 'প্যারেন্ট লাউঞ্জ ও ক্যাফে', description: 'অভিভাবকদের বসে থাকার আরামদায়ক ব্যবস্থা', icon: 'Coffee' }
  ],
  highlights: [
    "১০০% নরম অ্যান্টি-শক কুশন ফ্লোরিং",
    "সার্বক্ষণিক সিসিটিভি ও প্রশিক্ষণপ্রাপ্ত কেয়ারটেকার",
    "দৈনিক স্যানিটাইজেশন ও পরিষ্কার-পরিচ্ছন্নতা",
    "অভিভাবকদের জন্য আরামদায়ক ক্যাফে লাউঞ্জ ও ফ্রি ওয়াইফাই"
  ],
  ticketPricing: {
    singleEntry: 100,
    hourlyUnlimited: 150,
    guardianFee: 0,
    monthlyPass: 1200
  },
  galleryImages: [
    "https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1596464716127-f2a829822301?auto=format&fit=crop&w=800&q=80"
  ]
};

export const defaultFacilities: Facility[] = [
  { id: '1', title: 'হাই-লুমেন ফ্লাডলাইট', description: 'রাতের ম্যাচের জন্য চোখ ধাঁধানো আলো মুক্ত সেরা ফ্লাডলাইট ব্যবস্থা।' },
  { id: '2', title: 'ফ্রি ফুটবল ও খেলার সরঞ্জাম', description: 'ম্যাচের জন্য বল, কোণ, বিবস ও মার্কার সম্পূর্ণ ফ্রি সরবরাহ।' },
  { id: '3', title: 'বিশাল পার্কিং এরিয়া', description: 'বাইক ও গাড়ির জন্য পর্যাপ্ত ও নিরাপদ সংরক্ষিত পার্কিং।' },
  { id: '4', title: 'ড্রেসিং রুম ও ওয়াশরুম', description: 'খেলোয়াড়দের জন্য পরিচ্ছন্ন চেঞ্জিং রুম ও আধুনিক ওয়াশরুম।' },
  { id: '5', title: 'ফ্রি হাই-স্পিড ওয়াইফাই', description: 'টার্ফ ও কিডস জোন প্রাঙ্গণে দ্রুতগতির ওয়াইফাই সুবিধা।' },
  { id: '6', title: 'বিশুদ্ধ খাবার পানি', description: 'প্লেয়ার ও অভিভাবকদের জন্য ফিল্টার্ড বিশুদ্ধ ঠান্ডা পানির ব্যবস্থা।' },
  { id: '7', title: 'সার্বক্ষণিক সিসিটিভি নিরাপত্তা', description: 'সম্পূর্ণ চত্বরে ২৪/৭ হাই-ডেফিনিশন ক্যামেরা নজরদারি।' },
  { id: '8', title: 'ফার্স্ট এইড ও প্রাথমিক চিকিৎসা', description: 'খেলার মাঠে ইনজুরি ব্যবস্থাপনায় সার্বক্ষণিক প্রাথমিক চিকিৎসা কিট।' }
];

export const defaultSlots: TimeSlot[] = [
  { id: 'slot-01', startTime: '06:00', endTime: '07:00', label: 'সকাল ০৬:০০ - ০৭:০০', price: 800, isNight: false, isPopular: false, isActive: true },
  { id: 'slot-02', startTime: '07:00', endTime: '08:00', label: 'সকাল ০৭:০০ - ০৮:০০', price: 800, isNight: false, isPopular: false, isActive: true },
  { id: 'slot-03', startTime: '08:00', endTime: '09:00', label: 'সকাল ০৮:০০ - ০৯:০০', price: 800, isNight: false, isPopular: false, isActive: true },
  { id: 'slot-04', startTime: '09:00', endTime: '10:00', label: 'সকাল ০৯:০০ - ১০:০০', price: 800, isNight: false, isPopular: false, isActive: true },
  { id: 'slot-05', startTime: '10:00', endTime: '11:00', label: 'সকাল ১০:০০ - ১১:০০', price: 800, isNight: false, isPopular: false, isActive: true },
  { id: 'slot-06', startTime: '11:00', endTime: '12:00', label: 'সকাল ১১:০০ - দুপুর ১২:০০', price: 800, isNight: false, isPopular: false, isActive: true },
  { id: 'slot-07', startTime: '12:00', endTime: '13:00', label: 'দুপুর ১২:০০ - ০১:০০', price: 800, isNight: false, isPopular: false, isActive: true },
  { id: 'slot-08', startTime: '14:00', endTime: '15:00', label: 'দুপুর ০২:০০ - ০৩:০০', price: 800, isNight: false, isPopular: false, isActive: true },
  { id: 'slot-09', startTime: '15:00', endTime: '16:00', label: 'বিকাল ০৩:০০ - ০৪:০০', price: 800, isNight: false, isPopular: false, isActive: true },
  { id: 'slot-10', startTime: '16:00', endTime: '17:00', label: 'বিকাল ০৪:০০ - ০৫:০০', price: 1000, isNight: false, isPopular: true, isActive: true },
  { id: 'slot-11', startTime: '17:00', endTime: '18:00', label: 'বিকাল ০৫:০০ - সন্ধ্যা ০৬:০০', price: 1000, isNight: false, isPopular: true, isActive: true },
  { id: 'slot-12', startTime: '18:00', endTime: '19:00', label: 'সন্ধ্যা ০৬:০০ - ০৭:০০', price: 1200, isNight: true, isPopular: true, isActive: true },
  { id: 'slot-13', startTime: '19:00', endTime: '20:00', label: 'রাত ০৭:০০ - ০৮:০০', price: 1200, isNight: true, isPopular: true, isActive: true },
  { id: 'slot-14', startTime: '20:00', endTime: '21:00', label: 'রাত ০৮:০০ - ০৯:০০', price: 1200, isNight: true, isPopular: true, isActive: true },
  { id: 'slot-15', startTime: '21:00', endTime: '22:00', label: 'রাত ০৯:০০ - ১০:০০', price: 1200, isNight: true, isPopular: true, isActive: true },
  { id: 'slot-16', startTime: '22:00', endTime: '23:00', label: 'রাত ১০:০০ - ১১:০০', price: 1000, isNight: true, isPopular: false, isActive: true },
  { id: 'slot-17', startTime: '23:00', endTime: '00:00', label: 'রাত ১১:০০ - ১২:০০', price: 1000, isNight: true, isPopular: false, isActive: true }
];

export const defaultGallery: GalleryItem[] = [
  { id: 'g1', title: 'টার্ফ নাইট ম্যাচ ও ফ্লাডলাইট', category: 'turf', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80', isFeatured: true },
  { id: 'g2', title: 'প্রিমিয়ার টার্ফ গ্রাস ও বাউন্ডারি', category: 'turf', imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80', isFeatured: true },
  { id: 'g3', title: 'শিশুদের আনন্দময় কিডস জোন', category: 'kids-zone', imageUrl: 'https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?auto=format&fit=crop&w=800&q=80', isFeatured: true },
  { id: 'g4', title: 'রঙিন ইনফ্লেটেবল রাইডস', category: 'kids-zone', imageUrl: 'https://images.unsplash.com/photo-1596464716127-f2a829822301?auto=format&fit=crop&w=800&q=80', isFeatured: false },
  { id: 'g5', title: 'টুর্নামেন্ট ফাইনাল ম্যাচ মুহূর্ত', category: 'tournament', imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80', isFeatured: true },
  { id: 'g6', title: 'প্লেয়ার ড্রেসিং ও লাউঞ্জ সুবিধা', category: 'facilities', imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80', isFeatured: false }
];

export const defaultFaqs: FAQItem[] = [
  { id: 'f1', question: 'অনলাইনে স্লট বুক করার নিয়ম কী?', answer: 'আমাদের ওয়েবসাইটে পছন্দের তারিখ ও সময় নির্বাচন করে আপনার নাম ও মোবাইল নম্বর দিয়ে পেমেন্ট মেথড সিলেক্ট করুন এবং সরাসরি বুকিং জমা দিন।', category: 'booking' },
  { id: 'f2', question: 'টার্ফে খেলার জন্য কী ধরনের জুতো পরা যাবে?', answer: 'টার্ফে শুধুমাত্র অনুমোদিত টার্ফ বুট (TF Shoes) অথবা সাধারণ ফ্ল্যাট রাবার স্নিকার্স পরে খেলতে হবে। মেটাল বা শক্ত স্পাইক জুতো সম্পূর্ণ নিষেধ।', category: 'turf' },
  { id: 'f3', question: 'বৃষ্টি হলে কি খেলা যায়?', answer: 'হ্যাঁ! আমাদের টার্ফে আন্তর্জাতিক মানের অ্যান্টি-ক্লগিং ড্রেনেজ সিস্টেম রয়েছে, তাই হালকা বা মাঝারি বৃষ্টিতেও পানি জমে না এবং খেলা নির্বিঘ্নে চলতে পারে।', category: 'turf' },
  { id: 'f4', question: 'কিডস জোনের প্রবেশ ফি কত এবং শিশুদের বয়সের সীমা কত?', answer: 'কিডস জোনে প্রতিটি শিশুর জন্য প্রবেশ ফি মাত্র ১০০ টাকা (অভিভাবকদের জন্য ফ্রি)। ২ থেকে ১২ বছর বয়সী শিশুরা নিরাপদে খেলতে পারে।', category: 'kids-zone' },
  { id: 'f5', question: 'বুকিং বাতিল বা সময় পরিবর্তন করা যাবে কি?', answer: 'হ্যাঁ, নির্ধারিত খেলার তারিখের কমপক্ষে ৩ দিন (৭২ ঘণ্টা) পূর্বে জানালে বুকিংয়ের সময় পরিবর্তন বা বাতিল করা সম্ভব।', category: 'booking' }
];

export const defaultOffers: SpecialOffer[] = [
  { id: 'o1', title: 'মর্নিং স্লট স্পেশাল ছাড়', description: 'সকাল ০৬:০০ AM থেকে দুপুর ১২:০০ PM পর্যন্ত সকল স্লটে বিশেষ সাশ্রয়ী রেট!', discountAmount: 200, discountType: 'fixed', code: 'MORNING200', startDate: '2026-01-01', endDate: '2026-12-31', isActive: true },
  { id: 'o2', title: 'উইকেন্ড ফুটবল ফেস্ট', description: 'শুক্রবার ও শনিবার একটানা ২ ঘণ্টা বুকিংয়ে ১০% অতিরিক্ত ছাড়!', discountAmount: 10, discountType: 'percentage', code: 'WEEKEND10', startDate: '2026-01-01', endDate: '2026-12-31', isActive: true }
];

export const defaultReviews: Review[] = [
  { id: 'r1', customerName: 'তানভীর আহমেদ', rating: 5, comment: 'কুমিল্লার সেরা টার্ফ! ঘাসের কোয়ালিটি চমৎকার আর ফ্লাডলাইটের আলো রাতে খেলার জন্য একদম নিখুঁত।', date: '2026-08-20', isApproved: true },
  { id: 'r2', customerName: 'রাকিব হাসান', rating: 5, comment: 'অনলাইন বুকিং প্রসেস খুব সহজ আর কাউন্টারে স্টাফদের ব্যবহার দারুণ ছিল। বন্ধুদের সাথে প্রতি সপ্তাহে খেলছি।', date: '2026-08-24', isApproved: true },
  { id: 'r3', customerName: 'ডাঃ আশরাফুল আলম', rating: 5, comment: 'বাচ্চাদের নিয়ে কিডস জোনে গিয়েছিলাম। চমৎকার পরিবেশ এবং খুবই নিরাপদ। অভিভাবক হিসেবে আমি মুগ্ধ।', date: '2026-08-26', isApproved: true }
];
