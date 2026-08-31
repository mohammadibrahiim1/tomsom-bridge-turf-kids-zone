import { Facility, FAQItem, KidsZoneInfo, Review, SpecialOffer, TurfInfo, WebsiteSettings } from '../../../types';
import { TimeSlot } from './quickBooking.types';

export interface HomePageProps {
  settings?: WebsiteSettings;
  turfInfo?: TurfInfo;
  kidsZoneInfo?: KidsZoneInfo;
  facilities?: Facility[];
  reviews?: Review[];
  faqs?: FAQItem[];
  offers?: SpecialOffer[];
  slots?: TimeSlot[];
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  onNavigate?: (page: string) => void;
  onOpenBooking?: (date?: string) => void;
}
