import { SpecialOffer, TurfInfo, WebsiteSettings } from '../../../types';

// ৪. HeroSection Component Props Interface
export interface HeroSectionProps {
  settings?: WebsiteSettings;
  turfInfo?: TurfInfo | null;
  offers?: SpecialOffer[];
  onOpenBooking?: () => void;
  onBookNowClick?: () => void;
  onNavigate?: (sectionId: string) => void;
  onExploreKidsZoneClick?: () => void;
}
