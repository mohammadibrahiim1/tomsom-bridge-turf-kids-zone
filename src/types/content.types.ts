export interface SpecialOffer {
  id: string;
  code?: string;
  title: string;
  description: string;
  discountText: string;
  image: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Facility {
  id: string;
  title: string;
  description: string;
  iconName: string;
  isActive: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'টার্ফ' | 'কিডস জোন' | 'রাতের দৃশ্য' | 'ইভেন্ট' | 'টুর্নামেন্ট' | 'অন্যান্য';
  imageUrl: string;
  date?: string;
}

export interface TournamentEvent {
  id: string;
  title: string;
  type: 'টুর্নামেন্ট' | 'ইভেন্ট';
  date: string;
  time: string;
  description: string;
  posterImage: string;
  registrationStatus: 'চলমান' | 'শীঘ্রই আসছে' | 'সম্পন্ন';
  entryFee?: number;
  prizeMoney?: string;
  winner?: string;
  runnerUp?: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  userPhone?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}
