
import { Slot } from "../../slot-management/slotTypes/slot.types";
import { MappedTimeSlot, SlotStatusBn } from "../slotBookingTypes/slotBookingTypes";

/** Backend English status → Bengali status used in UI */
export const mapStatusToBn = (status?: string): SlotStatusBn => {
  switch (status?.toUpperCase()) {
    case 'AVAILABLE':
      return 'উপলব্ধ';
    case 'BOOKED':
      return 'বুকড';
    case 'PENDING':
    case 'HOLD':
      return 'অপেক্ষমাণ';
    case 'LOCKED':
    case 'CLOSED':
    case 'MAINTENANCE':
    case 'INACTIVE':
      return 'বন্ধ';
    default:
      return 'উপলব্ধ';
  }
};

/** Convert backend Slot → frontend TimeSlot shape (complete & safe) */
export const mapSlotToTimeSlot = (slot: Slot): MappedTimeSlot => {
  const anySlot = slot as any;

  const id = String(anySlot.id ?? anySlot.slotId ?? '');

  const startTime =
    anySlot.startTime ||
    anySlot.displayTime?.split(' - ')[0]?.trim() ||
    anySlot.time?.split('-')[0]?.trim() ||
    '—';

  const endTime =
    anySlot.endTime ||
    anySlot.displayTime?.split(' - ')[1]?.trim() ||
    anySlot.time?.split('-')[1]?.trim() ||
    '—';

  const displayTime =
    anySlot.displayTime ||
    (startTime !== '—' && endTime !== '—' ? `${startTime} - ${endTime}` : '—');

  const regularPrice = Number(
    anySlot.regularPrice ?? anySlot.totalPrice ?? anySlot.price ?? 0
  );

  const slotType =
    anySlot.slotType || anySlot.sportType || anySlot.packageName || 'টার্ফ';

  return {
    ...anySlot,
    id,
    startTime,
    endTime,
    displayTime,
    regularPrice: isNaN(regularPrice) ? 0 : regularPrice,
    slotType,
    playDuration:
      anySlot.playDuration || '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট',
    currentStatus: mapStatusToBn(anySlot.status),
  };
};