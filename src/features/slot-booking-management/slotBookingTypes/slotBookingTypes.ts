import type { Booking, TimeSlot, TurfInfo, WebsiteSettings } from '../../../types';
import type { Slot } from '../../slot-management/slotTypes/slot.types';

export type PaymentMethod = 'বিকাশ' | 'নগদ' | 'রকেট' | 'ক্যাশ';

export type SlotStatusBn = 'উপলব্ধ' | 'বুকড' | 'অপেক্ষমাণ' | 'বন্ধ';

export interface MappedTimeSlot extends TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  displayTime: string;
  regularPrice: number;
  slotType: string;
  playDuration: string;
  currentStatus: SlotStatusBn;
}

export interface SlotBookingManagement {
  settings?: WebsiteSettings;
  turfInfo?: TurfInfo;
  initialDate?: string;
  onNavigate?: (page: string) => void;
  onOpenSearch?: () => void;
  initialSlotId?: string;
  onBookingSuccess?: (bookingData?: Booking) => void;
}

export interface CouponStatus {
  type: 'success' | 'error';
  msg: string;
}