export interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  price: number;
  status: 'Available' | 'Booked' | 'Maintenance';
  date: string;
}

export type TabType = 'create' | 'list';

export interface ISlotPayload {
  groundType: string;
  groundTypeBn: string;
  sportType: string;
  sportTypeBn: string;
  packageNumber: number;
  packageName: string;
  startTime: string;
  endTime: string;
  displayTime: string;
  playDurationMinutes: number;
  bufferDurationMinutes: number;
  hasExtraTime: boolean;
  extraTimeMinutes: number;
  extraTimeCharge: number;
  slotType: string;
  slotTypeBn: string;
  regularPrice: number;
  extraGroundCharge: number;
  totalPrice: number;
  peakPrice: number;
  weekendPrice: number;
  isNightMatch: boolean;
  hasRainEffect: boolean;
  hasSoundSystem: boolean;
  includedAmenities: string[];
  customAttributes: {
    extraNote: string;
    maxPlayer: number;
  };
  status: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE';
  isActive: boolean;
  slotId?: string;
}
