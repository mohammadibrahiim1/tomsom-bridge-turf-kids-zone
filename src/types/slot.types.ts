export type SlotStatus = 'উপলব্ধ' | 'নির্বাচিত' | 'বুকড' | 'বন্ধ' | 'অপেক্ষমাণ';

export interface TimeSlot {
  id: string;
  startTime: string; // e.g. "06:00 AM"
  endTime: string; // e.g. "07:00 AM"
  playDuration: string; // "৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট"
  slotType: 'সকাল' | 'দুপুর' | 'বিকাল' | 'সন্ধ্যা' | 'রাত';
  regularPrice: number;
  peakPrice?: number;
  weekendPrice?: number;
  isActive: boolean;
  currentStatus: SlotStatus;
  displayTime:string;
}

export interface SlotLock {
  slotId: string;
  date: string;
  lockedAt: number;
  lockedBy: string; // session ID
}
