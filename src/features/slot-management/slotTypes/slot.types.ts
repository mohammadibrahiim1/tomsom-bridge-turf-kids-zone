// ==========================================
// Enums & Union Types
// ==========================================
export type SportType = 'FOOTBALL' | 'CRICKET' | 'BADMINTON' | 'KIDS_ZONE' | 'TENNIS' | 'BASKETBALL';

export type GroundType = 'PITCH_1_SMALL' | 'PITCH_2_MEDIUM' | 'PITCH_3_LARGE' | 'INDOR_TURF' | 'ROOFTOP_TURF' | 'VIP_TURF';

export type SlotTimeType = 'EARLY_MORNING' | 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT' | 'LATE_NIGHT' | 'Weekend_SPECIAL';

export type SlotStatus = 'AVAILABLE' | 'BOOKED' | 'LOCKED' | 'MAINTENANCE' | 'PENDING' | 'CANCELLED' | 'EXPIRED' | 'COMPLETED' | 'RESCHEDULED' | 'লকড' | 'বুকড' | 'অপেক্ষমাণ' | 'উপলব্ধ' | 'নির্বাচিত' | 'বন্ধ';

export type TabType = 'create' | 'list';

// ==========================================
// Slot Interface (Matches Backend Prisma Model)
// ==========================================
export interface Slot {
  id: string;
  slotId: string;
  
  groundType: GroundType;
  groundTypeBn?: string | null;
  
  sportType: SportType;
  sportTypeBn?: string | null;
  
  packageNumber?: number | null;
  packageName?: string | null;
  
  startTime: string;
  endTime: string;
  displayTime: string;
  bookingDate?: string | Date | null;
  
  playDurationMinutes: number;
  bufferDurationMinutes: number;
  
  hasExtraTime: boolean;
  extraTimeMinutes: number;
  extraTimeCharge: number;
  
  slotType: SlotTimeType;
  slotTypeBn?: string | null;
  
  regularPrice: number;
  extraGroundCharge: number;
  totalPrice: number;
  peakPrice?: number | null;
  weekendPrice?: number | null;
  
  isNightMatch: boolean;
  hasRainEffect: boolean;
  hasSoundSystem: boolean;
  includedAmenities: string[];
  
  customAttributes?: {
    extraNote?: string;
    maxPlayer?: number;
    [key: string]: unknown;
  } | null;
  
  status: SlotStatus;
  isActive: boolean;
  
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// ==========================================
// Payload Interface for Creation/Updates
// ==========================================
export interface ISlotPayload {
  groundType: GroundType;
  groundTypeBn?: string;
  sportType: SportType;
  sportTypeBn?: string;
  packageNumber?: number;
  packageName?: string;
  startTime: string;
  endTime: string;
  displayTime: string;
  playDurationMinutes?: number;
  bufferDurationMinutes?: number;
  hasExtraTime?: boolean;
  extraTimeMinutes?: number;
  extraTimeCharge?: number;
  slotType: SlotTimeType;
  slotTypeBn?: string;
  regularPrice: number;
  extraGroundCharge?: number;
  totalPrice: number;
  peakPrice?: number;
  weekendPrice?: number;
  isNightMatch?: boolean;
  hasRainEffect?: boolean;
  hasSoundSystem?: boolean;
  includedAmenities?: string[];
  customAttributes?: {
    extraNote?: string;
    maxPlayer?: number;
    [key: string]: unknown;
  };
  status?: SlotStatus;
  isActive?: boolean;
  slotId?: string;
}

export interface SlotLock {
  slotId: string;
  date: string;
  lockedAt: number;
  lockedBy: string;
}