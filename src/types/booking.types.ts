import { BookingStatus, PaymentMethod, PaymentStatus } from './common.types';

export interface Booking {
  id: string; // e.g. "TBT-20260828-0001"
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  bookingDate: string; // "YYYY-MM-DD"
  slotId: string;
  slotTime: string; // e.g. "07:00 PM - 08:00 PM"
  slotDuration: string;
  type: 'টার্ফ' | 'কিডস জোন';
  amount: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  paymentSenderNumber?: string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  createdAt: string;
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  fixedDiscount: number;
  minBookingAmount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface ReportSummary {
  todayBookingsCount: number;
  todayRevenue: number;
  totalBookingsCount: number;
  confirmedCount: number;
  pendingCount: number;
  cancelledCount: number;
  completedCount: number;
  totalRevenue: number;
  cashRevenue: number;
  bkashRevenue: number;
  nagadRevenue: number;
  rocketRevenue: number;
}
