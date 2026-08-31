// src/features/landing/types/quickBooking.types.ts

// ১. টাইম স্লট ইন্টারফেস
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  slotType: string;
  regularPrice: number;
  isAvailable?: boolean;
  [key: string]: unknown; // ভবিষ্যতে নতুন প্রপার্টি যোগ করার জন্য
}

// ২. QuickBookingBar Props Interface
export interface QuickBookingBarProps {
  slots?: TimeSlot[];
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  onStartBooking?: (date: string, slotId?: string) => void;
  onBookClick?: (date?: string) => void;
  availableCount?: number;
}
