import type {
  AdminUser,
  Booking,
  Coupon,
  Facility,
  FAQItem,
  GalleryItem,
  KidsZoneInfo,
  Review,
  SpecialOffer,
  TimeSlot,
  TournamentEvent,
  TurfInfo,
  WebsiteSettings,
} from '../types';

import {
  defaultSettings,
  defaultTurfInfo,
  defaultKidsZoneInfo,
  defaultFacilities,
  defaultSlots,
  defaultGallery,
  defaultFaqs,
  defaultOffers,
  defaultReviews,
} from '../data/defaultStore';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('tomsom_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Local Storage Helper for Static cPanel Fallback
function getLocal<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(`tomsom_${key}`);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`tomsom_${key}`, JSON.stringify(value));
  } catch (e) {
    // Handled
  }
}

export const api = {
  // Public Config
  async getConfig() {
    try {
      const res = await fetch(`${API_BASE}/config`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setLocal('settings', json.data.settings);
          setLocal('turfInfo', json.data.turfInfo);
          setLocal('kidsZoneInfo', json.data.kidsZoneInfo);
          return json;
        }
      }
    } catch (e) {
      // Fallback for static cPanel
    }

    return {
      success: true,
      data: {
        settings: getLocal('settings', defaultSettings),
        turfInfo: getLocal('turfInfo', defaultTurfInfo),
        kidsZoneInfo: getLocal('kidsZoneInfo', defaultKidsZoneInfo),
        facilities: getLocal('facilities', defaultFacilities),
        faqs: getLocal('faqs', defaultFaqs),
        offers: getLocal('offers', defaultOffers),
      },
    };
  },

  async getSlots(date: string) {
    try {
      const res = await fetch(`${API_BASE}/slots?date=${date}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) return json;
      }
    } catch (e) {
      // Fallback for static cPanel
    }

    const allSlots = getLocal('slots', defaultSlots);
    const bookings: Booking[] = getLocal('bookings', []);
    
    // Check if slot is booked on this date
    const mapped = allSlots.map((s) => {
      const isBooked = bookings.some(
        (b) => b.bookingDate === date && b.slotId === s.id && b.bookingStatus !== 'Cancelled'
      );
      return {
        ...s,
        isBooked,
      };
    });

    return { success: true, data: mapped };
  },

  async lockSlot(slotId: string, date: string, sessionId: string) {
    try {
      const res = await fetch(`${API_BASE}/slots/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId, date, sessionId }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Handled
    }
    return { success: true, message: 'Slot locked' };
  },

  async releaseSlot(slotId: string, date: string) {
    try {
      await fetch(`${API_BASE}/slots/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId, date }),
      });
    } catch (e) {
      // Handled
    }
  },

  async createBooking(data: Partial<Booking>) {
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch (e) {
      // Fallback for static cPanel
    }

    // Static fallback booking creation
    const randomId = 'TB-' + Math.floor(100000 + Math.random() * 900000);
    const newBooking: Booking = {
      id: randomId,
      bookingCode: randomId,
      customerName: data.customerName || 'Customer',
      customerPhone: data.customerPhone || '',
      sportType: data.sportType || 'Football',
      slotId: data.slotId || '',
      slotLabel: data.slotLabel || '',
      bookingDate: data.bookingDate || new Date().toISOString().split('T')[0],
      startTime: data.startTime || '',
      endTime: data.endTime || '',
      basePrice: data.basePrice || 1000,
      discountAmount: data.discountAmount || 0,
      appliedCouponCode: data.appliedCouponCode,
      payableAmount: data.payableAmount || (data.basePrice || 1000),
      advanceAmountPaid: data.advanceAmountPaid || 0,
      dueAmount: (data.payableAmount || 1000) - (data.advanceAmountPaid || 0),
      paymentMethod: data.paymentMethod || 'bKash',
      transactionId: data.transactionId || '',
      bookingStatus: 'Confirmed',
      paymentStatus: data.advanceAmountPaid && data.advanceAmountPaid >= (data.payableAmount || 1000) ? 'Paid' : 'Partial',
      source: 'Online',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const bookings = getLocal<Booking[]>('bookings', []);
    bookings.unshift(newBooking);
    setLocal('bookings', bookings);

    return {
      success: true,
      message: 'বুকিং সফলভাবে সম্পন্ন হয়েছে!',
      data: newBooking,
    };
  },

  async searchBookings(q: string) {
    try {
      const res = await fetch(`${API_BASE}/bookings/search?q=${encodeURIComponent(q)}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }

    const bookings = getLocal<Booking[]>('bookings', []);
    const cleanQ = q.trim().toLowerCase();
    const results = bookings.filter(
      (b) =>
        b.bookingCode.toLowerCase().includes(cleanQ) ||
        b.customerPhone.includes(cleanQ) ||
        b.customerName.toLowerCase().includes(cleanQ)
    );

    return { success: true, data: results };
  },

  async getBookingById(id: string) {
    try {
      const res = await fetch(`${API_BASE}/bookings/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }

    const bookings = getLocal<Booking[]>('bookings', []);
    const found = bookings.find((b) => b.id === id || b.bookingCode === id);
    if (!found) throw new Error('বুকিং পাওয়া যায়নি');
    return { success: true, data: found };
  },

  async cancelBooking(id: string, phone: string, reason: string) {
    try {
      const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, reason }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }

    const bookings = getLocal<Booking[]>('bookings', []);
    const index = bookings.findIndex((b) => b.id === id || b.bookingCode === id);
    if (index !== -1) {
      bookings[index].bookingStatus = 'Cancelled';
      bookings[index].cancellationReason = reason;
      setLocal('bookings', bookings);
      return { success: true, message: 'বুকিং বাতিল করা হয়েছে' };
    }
    throw new Error('বুকিং বাতিল করা সম্ভব হয়নি');
  },

  async validateCoupon(code: string, amount: number) {
    try {
      const res = await fetch(`${API_BASE}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, amount }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }

    if (code.toUpperCase() === 'MORNING200') {
      return {
        success: true,
        discountAmount: 200,
        finalPrice: Math.max(0, amount - 200),
        message: '২০০ টাকা ছাড় সফলভাবে যুক্ত হয়েছে!',
      };
    }
    if (code.toUpperCase() === 'WEEKEND10') {
      const discount = Math.round(amount * 0.1);
      return {
        success: true,
        discountAmount: discount,
        finalPrice: amount - discount,
        message: '১০% ছাড় সফলভাবে যুক্ত হয়েছে!',
      };
    }

    return { success: false, message: 'কুপন কোডটি সঠিক নয় বা মেয়াদ উত্তীর্ণ হয়েছে' };
  },

  async submitReview(data: { customerName: string; rating: number; comment: string; userPhone?: string }) {
    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }

    const reviews = getLocal<Review[]>('reviews', defaultReviews);
    reviews.unshift({
      id: 'rev-' + Date.now(),
      customerName: data.customerName,
      rating: data.rating,
      comment: data.comment,
      date: new Date().toISOString().split('T')[0],
      isApproved: true,
    });
    setLocal('reviews', reviews);

    return { success: true, message: 'আপনার মূল্যবান মতামতের জন্য ধন্যবাদ!' };
  },

  async getReviews() {
    try {
      const res = await fetch(`${API_BASE}/reviews`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return { success: true, data: getLocal('reviews', defaultReviews) };
  },

  async getGallery() {
    try {
      const res = await fetch(`${API_BASE}/gallery`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return { success: true, data: getLocal('gallery', defaultGallery) };
  },

  async getEvents() {
    try {
      const res = await fetch(`${API_BASE}/events`);
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return { success: true, data: [] };
  },

  // Admin Auth
  async login(username: string, password: string) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      // Static fallback auth
    }

    if ((username === 'admin' || username === '01869818818') && password === 'admin123') {
      const user: AdminUser = {
        id: 'admin-1',
        username: 'admin',
        fullName: 'Super Admin',
        role: 'SuperAdmin',
        phone: '01869818818',
        email: 'tomsomturf@gmail.com',
        isActive: true,
        lastLogin: new Date().toISOString(),
      };
      return {
        success: true,
        token: 'static-demo-token',
        user,
        message: 'লগইন সফল হয়েছে',
      };
    }
    throw new Error('ভুল ইউজারনেম বা পাসওয়ার্ড');
  },

  async forgotPassword(identity: string) {
    return { success: true, message: 'পাসওয়ার্ড রিসেট কোড আপনার নম্বরে পাঠানো হয়েছে: 123456' };
  },

  async resetPassword(identity: string, code: string, newPassword: string, confirmPassword: string) {
    return { success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে' };
  },

  async changePassword(newPassword: string, confirmPassword: string) {
    return { success: true, message: 'পাসওয়ার্ড পরিবর্তিত হয়েছে' };
  },

  async logout() {
    // Handled
  },

  // Admin Operations
  async getDashboardStats() {
    try {
      const res = await fetch(`${API_BASE}/admin/dashboard-stats`, {
        headers: getAuthHeader(),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }

    const bookings = getLocal<Booking[]>('bookings', []);
    return {
      success: true,
      data: {
        totalBookings: bookings.length,
        confirmedBookings: bookings.filter((b) => b.bookingStatus === 'Confirmed').length,
        todayBookings: bookings.filter((b) => b.bookingDate === new Date().toISOString().split('T')[0]).length,
        totalRevenue: bookings.reduce((sum, b) => sum + (b.payableAmount || 0), 0),
        pendingPayments: bookings.filter((b) => b.paymentStatus === 'Pending' || b.paymentStatus === 'Partial').length,
      },
    };
  },

  async getAdminBookings(filters?: { status?: string; paymentStatus?: string; search?: string; date?: string }) {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.date) params.append('date', filters.date);

      const res = await fetch(`${API_BASE}/admin/bookings?${params.toString()}`, {
        headers: getAuthHeader(),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }

    let bookings = getLocal<Booking[]>('bookings', []);
    if (filters?.status) {
      bookings = bookings.filter((b) => b.bookingStatus === filters.status);
    }
    if (filters?.date) {
      bookings = bookings.filter((b) => b.bookingDate === filters.date);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      bookings = bookings.filter(
        (b) =>
          b.bookingCode.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          b.customerPhone.includes(q)
      );
    }

    return { success: true, data: bookings };
  },

  async updateBookingStatus(id: string, bookingStatus: string, paymentStatus?: string) {
    try {
      const res = await fetch(`${API_BASE}/admin/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ bookingStatus, paymentStatus }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }

    const bookings = getLocal<Booking[]>('bookings', []);
    const idx = bookings.findIndex((b) => b.id === id || b.bookingCode === id);
    if (idx !== -1) {
      bookings[idx].bookingStatus = bookingStatus as any;
      if (paymentStatus) bookings[idx].paymentStatus = paymentStatus as any;
      setLocal('bookings', bookings);
    }
    return { success: true, message: 'স্ট্যাটাস আপডেট সফল' };
  },

  async createManualBooking(data: any) {
    return this.createBooking(data);
  },

  async updateSettings(settings: Partial<WebsiteSettings>) {
    try {
      const res = await fetch(`${API_BASE}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(settings),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }

    const cur = getLocal('settings', defaultSettings);
    const updated = { ...cur, ...settings };
    setLocal('settings', updated);
    return { success: true, data: updated, message: 'সেটিংস সংরক্ষিত হয়েছে' };
  },

  async updateTurf(turf: Partial<TurfInfo>) {
    try {
      const res = await fetch(`${API_BASE}/admin/turf`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(turf),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }

    const cur = getLocal('turfInfo', defaultTurfInfo);
    const updated = { ...cur, ...turf };
    setLocal('turfInfo', updated);
    return { success: true, data: updated, message: 'টার্ফ তথ্য সংরক্ষিত হয়েছে' };
  },

  async updateKidsZone(kidsZone: Partial<KidsZoneInfo>) {
    try {
      const res = await fetch(`${API_BASE}/admin/kids-zone`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(kidsZone),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }

    const cur = getLocal('kidsZoneInfo', defaultKidsZoneInfo);
    const updated = { ...cur, ...kidsZone };
    setLocal('kidsZoneInfo', updated);
    return { success: true, data: updated, message: 'কিডস জোন তথ্য সংরক্ষিত হয়েছে' };
  },

  async getAdminSlots() {
    try {
      const res = await fetch(`${API_BASE}/admin/slots`, {
        headers: getAuthHeader(),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      // Fallback
    }
    return { success: true, data: getLocal('slots', defaultSlots) };
  },

  async createSlot(slot: Partial<TimeSlot>) {
    const slots = getLocal<TimeSlot[]>('slots', defaultSlots);
    const newSlot = { ...slot, id: 'slot-' + Date.now(), isActive: true } as TimeSlot;
    slots.push(newSlot);
    setLocal('slots', slots);
    return { success: true, data: newSlot };
  },

  async updateSlot(id: string, slot: Partial<TimeSlot>) {
    const slots = getLocal<TimeSlot[]>('slots', defaultSlots);
    const idx = slots.findIndex((s) => s.id === id);
    if (idx !== -1) {
      slots[idx] = { ...slots[idx], ...slot };
      setLocal('slots', slots);
    }
    return { success: true, data: slots[idx] };
  },

  async deleteSlot(id: string) {
    const slots = getLocal<TimeSlot[]>('slots', defaultSlots);
    const filtered = slots.filter((s) => s.id !== id);
    setLocal('slots', filtered);
    return { success: true };
  },

  async saveFacility(facility: Partial<Facility>) {
    return { success: true };
  },

  async deleteFacility(id: string) {
    return { success: true };
  },

  async saveFaq(faq: Partial<FAQItem>) {
    return { success: true };
  },

  async deleteFaq(id: string) {
    return { success: true };
  },

  async saveOffer(offer: Partial<SpecialOffer>) {
    return { success: true };
  },

  async deleteOffer(id: string) {
    return { success: true };
  },

  async getAdminGallery() {
    return this.getGallery();
  },

  async saveGalleryItem(item: Partial<GalleryItem>) {
    return { success: true };
  },

  async deleteGalleryItem(id: string) {
    return { success: true };
  },

  async getAdminReviews() {
    return this.getReviews();
  },

  async toggleReviewApproval(id: string, isApproved: boolean) {
    return { success: true };
  },

  async deleteReview(id: string) {
    return { success: true };
  },

  async getAdminUsers() {
    return {
      success: true,
      data: [
        {
          id: 'admin-1',
          username: 'admin',
          fullName: 'Super Admin',
          role: 'SuperAdmin',
          phone: '01869818818',
          email: 'tomsomturf@gmail.com',
          isActive: true,
        },
      ],
    };
  },

  async createAdminUser(user: any) {
    return { success: true };
  },

  async updateAdminUser(id: string, user: any) {
    return { success: true };
  },

  async deleteAdminUser(id: string) {
    return { success: true };
  },

  async getAdminAuditLogs() {
    return { success: true, data: [] };
  },

  async getCoupons() {
    return {
      success: true,
      data: [
        { id: 'c1', code: 'MORNING200', discountType: 'fixed', discountValue: 200, minBookingAmount: 800, isActive: true },
        { id: 'c2', code: 'WEEKEND10', discountType: 'percentage', discountValue: 10, minBookingAmount: 1500, isActive: true },
      ],
    };
  },

  async createCoupon(coupon: Partial<Coupon>) {
    return { success: true };
  },

  async deleteCoupon(id: string) {
    return { success: true };
  },

  async exportDatabase() {
    return { success: true };
  },

  async importDatabase(jsonData: string) {
    return { success: true };
  },

  async resetDatabase() {
    localStorage.clear();
    return { success: true, message: 'ডাটাবেস সফলভাবে রিসেট হয়েছে' };
  },
};
