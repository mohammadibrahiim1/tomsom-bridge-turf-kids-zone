import express from 'express';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { db, hashPassword } from './db.js';
import type {
  Booking,
  Coupon,
  Facility,
  FAQItem,
  GalleryItem,
  SpecialOffer,
  TimeSlot,
  TournamentEvent,
} from '../src/types';

export const apiRouter = express.Router();

// Middleware for JSON parsing
apiRouter.use(express.json({ limit: '15mb' }));

// Helper to check admin authorization header
const verifyAdminSession = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'অননুমোদিত অ্যাক্সেস। অনুগ্রহ করে লগইন করুন।' });
  }
  const token = authHeader.split(' ')[1];
  // Simple token format: user_id:random
  try {
    const [userId] = Buffer.from(token, 'base64').toString('utf-8').split(':');
    const admin = db.getAdminUsers().find((u) => u.id === userId);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'সেশন অবৈধ বা মেয়াদ শেষ। আবার লগইন করুন।' });
    }
    (req as any).adminUser = admin;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'অবৈধ লগইন টোকেন।' });
  }
};

// ----------------------------------------------------------------------
// PUBLIC ENDPOINTS
// ----------------------------------------------------------------------

// 1. Full Config for public site
apiRouter.get('/config', (req, res) => {
  try {
    const settings = db.getSettings();
    const turfInfo = db.getTurfInfo();
    const kidsZoneInfo = db.getKidsZoneInfo();
    const facilities = db.getFacilities().filter((f) => f.isActive);
    const offers = db.getOffers().filter((o) => o.isActive);
    const reviews = db.getApprovedReviews();
    const faqs = db.getFAQs();
    const events = db.getEvents();

    res.json({
      success: true,
      data: {
        settings,
        turfInfo,
        kidsZoneInfo,
        facilities,
        offers,
        reviews,
        faqs,
        events,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'সার্ভার ত্রুটি' });
  }
});

// 2. Slot status for a given date
apiRouter.get('/slots', (req, res) => {
  try {
    const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const slots = db.getSlotStatusForDate(date);
    res.json({ success: true, date, slots });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'স্লট লোড করতে ব্যর্থ' });
  }
});

// 3. Lock slot temporarily during checkout
apiRouter.post('/slots/lock', (req, res) => {
  try {
    const { slotId, date, sessionId } = req.body;
    if (!slotId || !date || !sessionId) {
      return res.status(400).json({ success: false, message: 'প্রয়োজনীয় তথ্য অনুপস্থিত।' });
    }
    const locked = db.lockSlot(slotId, date, sessionId);
    if (!locked) {
      return res.status(409).json({ success: false, message: 'এই সময়টি ইতোমধ্যে অন্য একজন গ্রাহক নির্বাচন করেছেন।' });
    }
    res.json({ success: true, message: 'স্লট সাময়িকভাবে লক করা হয়েছে।' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Release locked slot
apiRouter.post('/slots/release', (req, res) => {
  try {
    const { slotId, date } = req.body;
    if (slotId && date) {
      db.releaseSlotLock(slotId, date);
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false });
  }
});

// 5. Create new Booking
apiRouter.post('/bookings', (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      bookingDate,
      slotId,
      slotTime,
      slotDuration,
      type = 'টার্ফ',
      amount,
      discountAmount = 0,
      couponCode,
      totalAmount,
      paymentMethod,
      transactionId,
      paymentSenderNumber,
      notes,
    } = req.body;

    // Strict validation
    if (!customerName || !customerPhone || !bookingDate || !slotId || !slotTime || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'অনুগ্রহ করে সকল আবশ্যক তথ্য (নাম, মোবাইল, তারিখ, সময়, পেমেন্ট মাধ্যম) পূরণ করুন।',
      });
    }

    // Phone number format validation (Bangladesh 11 digits)
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 11) {
      return res.status(400).json({
        success: false,
        message: 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন।',
      });
    }

    // Payment & Booking status
    let paymentStatus: Booking['paymentStatus'] = 'অপেক্ষমাণ';
    let bookingStatus: Booking['bookingStatus'] = 'অপেক্ষমাণ';

    if (paymentMethod === 'ক্যাশ') {
      paymentStatus = 'অপেক্ষমাণ';
      bookingStatus = 'অপেক্ষমাণ';
    } else if (transactionId && transactionId.trim().length > 3) {
      paymentStatus = 'অপেক্ষমাণ'; // Requires admin confirmation of transaction ID
      bookingStatus = 'অপেক্ষমাণ';
    }

    const newBooking = db.createBooking(
      {
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        customerEmail: customerEmail?.trim() || '',
        bookingDate,
        slotId,
        slotTime,
        slotDuration: slotDuration || '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট',
        type,
        amount: Number(amount) || 0,
        discountAmount: Number(discountAmount) || 0,
        couponCode: couponCode || undefined,
        totalAmount: Number(totalAmount) || Number(amount) || 0,
        paymentMethod,
        transactionId: transactionId?.trim() || '',
        paymentSenderNumber: paymentSenderNumber?.trim() || '',
        paymentStatus,
        bookingStatus,
        notes: notes || '',
      },
      customerName,
    );

    // If coupon used, increment count
    if (couponCode) {
      const coupons = db.getCoupons();
      const cp = coupons.find((c) => c.code.toUpperCase() === couponCode.trim().toUpperCase());
      if (cp) {
        cp.usedCount += 1;
        db.saveCoupon(cp, 'System');
      }
    }

    res.status(201).json({
      success: true,
      message: 'আপনার বুকিং সফলভাবে সম্পন্ন হয়েছে।',
      data: newBooking,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || 'বুকিং তৈরি করতে সমস্যা হয়েছে।',
    });
  }
});

// 6. Search Bookings by ID or Phone
apiRouter.get('/bookings/search', (req, res) => {
  try {
    const query = (req.query.q as string) || '';
    if (!query.trim()) {
      return res.status(400).json({ success: false, message: 'বুকিং আইডি বা ফোন নম্বর প্রদান করুন।' });
    }
    const results = db.searchBookings(query);
    res.json({ success: true, count: results.length, data: results });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 7. Get single Booking by ID
apiRouter.get('/bookings/:id', (req, res) => {
  try {
    const booking = db.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'আপনার কোনো বুকিং পাওয়া যায়নি।' });
    }
    res.json({ success: true, data: booking });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 8. Customer Request Cancellation (3-day notice policy verification)
apiRouter.post('/bookings/:id/cancel', (req, res) => {
  try {
    const booking = db.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'বুকিং পাওয়া যায়নি।' });
    }

    const { phone, reason } = req.body;
    if (booking.customerPhone !== phone?.replace(/\D/g, '')) {
      return res.status(403).json({ success: false, message: 'মোবাইল নম্বর মেলেনি।' });
    }

    // Check 3 days notice
    const bookingDateTime = new Date(`${booking.bookingDate}T00:00:00`).getTime();
    const nowTime = Date.now();
    const daysDiff = (bookingDateTime - nowTime) / (1000 * 60 * 60 * 24);

    const settings = db.getSettings();
    const requiredDays = settings.cancellationNoticeDays || 3;

    if (daysDiff < requiredDays) {
      return res.status(400).json({
        success: false,
        message: `নীতিমালা অনুযায়ী খেলার কমপক্ষে ${requiredDays} দিন (৭২ ঘণ্টা) পূর্বে বাতিলের আবেদন করতে হবে। সরাসরি কর্তৃপক্ষের সাথে যোগাযোগ করুন।`,
      });
    }

    const cancelled = db.cancelBooking(booking.id, reason || 'গ্রাহক কর্তৃক অনলাইন বাতিল', booking.customerName);
    res.json({
      success: true,
      message: 'বুকিং সফলভাবে বাতিল করা হয়েছে।',
      data: cancelled,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 9. Validate Coupon
apiRouter.post('/coupons/validate', (req, res) => {
  try {
    const { code, amount } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'কুপন কোড প্রদান করুন।' });
    }
    const result = db.validateCoupon(code, Number(amount) || 0);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 10. Reviews (Public)
apiRouter.get('/reviews', (req, res) => {
  try {
    const reviews = db.getApprovedReviews();
    res.json({ success: true, data: reviews });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.post('/reviews', (req, res) => {
  try {
    const { customerName, rating, comment, userPhone } = req.body;
    if (!customerName || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'নাম, রেটিং এবং মতামত আবশ্যক।' });
    }
    const newRev = db.addReview({
      customerName: customerName.trim(),
      rating: Math.max(1, Math.min(5, Number(rating))),
      comment: comment.trim(),
      userPhone: userPhone || '',
    });
    res.json({
      success: true,
      message: 'আপনার মূল্যবান মতামতের জন্য ধন্যবাদ! অ্যাডমিন অনুমোদনের পর এটি ওয়েবসাইটে প্রকাশিত হবে।',
      data: newRev,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 11. Gallery (Public)
apiRouter.get('/gallery', (req, res) => {
  try {
    const gallery = db.getGallery();
    res.json({ success: true, data: gallery });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 12. Events & Tournaments (Public)
apiRouter.get('/events', (req, res) => {
  try {
    const events = db.getEvents();
    res.json({ success: true, data: events });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------------------------
// ADMIN AUTHENTICATION
// ----------------------------------------------------------------------

apiRouter.post('/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'ইউজারনেম ও পাসওয়ার্ড প্রদান করুন।' });
    }

    const admin = db.authenticateAdmin(username, password);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'ভুল ইউজারনেম বা পাসওয়ার্ড।' });
    }

    // Generate token
    const token = Buffer.from(`${admin.id}:${Date.now()}:${Math.random()}`).toString('base64');

    res.json({
      success: true,
      message: 'লগইন সফল হয়েছে।',
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          isMustChangePassword: !!admin.isMustChangePassword,
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.post('/auth/change-password', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    const { newPassword, confirmPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'নতুন পাসওয়ার্ড দুটি মিলছে না।' });
    }

    const success = db.changePassword(adminUser.id, newPassword, adminUser.name);
    if (!success) {
      return res.status(400).json({ success: false, message: 'পাসওয়ার্ড পরিবর্তন করতে ব্যর্থ।' });
    }

    res.json({ success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Forgot Password - Request Recovery Code
apiRouter.post('/auth/forgot-password', (req, res) => {
  try {
    const { identity } = req.body;
    if (!identity) {
      return res
        .status(400)
        .json({ success: false, message: 'অনুগ্রহ করে আপনার ইউজারনেম বা রেজিস্টার্ড ইমেইল প্রদান করুন।' });
    }

    const result = db.requestPasswordReset(identity);
    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json({
      success: true,
      message: `পাসওয়ার্ড রিসেট ওটিপি কোড প্রস্তুত করা হয়েছে।`,
      resetCode: result.resetCode,
      adminName: result.adminName,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Reset Password with Recovery Code
apiRouter.post('/auth/reset-password', (req, res) => {
  try {
    const { identity, code, newPassword, confirmPassword } = req.body;
    if (!identity || !code || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: 'ইউজারনেম/ইমেইল, ভেরিফিকেশন কোড ও নতুন পাসওয়ার্ড আবশ্যক।' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'নতুন পাসওয়ার্ড দুটি মিলছে না।' });
    }

    const result = db.resetPasswordWithCode(identity, code, newPassword);
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ----------------------------------------------------------------------
// ADMIN PROTECTED ROUTES
// ----------------------------------------------------------------------

// 1. Dashboard Stats & Analytics
apiRouter.get('/admin/dashboard-stats', verifyAdminSession, (req, res) => {
  try {
    const bookings = db.getBookings();
    const today = new Date().toISOString().split('T')[0];

    const todayBookings = bookings.filter((b) => b.bookingDate === today);
    const todayRevenue = todayBookings
      .filter((b) => b.paymentStatus === 'সফল' || (b.paymentMethod === 'ক্যাশ' && b.bookingStatus === 'সম্পন্ন'))
      .reduce((acc, b) => acc + b.totalAmount, 0);

    const totalRevenue = bookings
      .filter((b) => b.paymentStatus === 'সফল' || (b.paymentMethod === 'ক্যাশ' && b.bookingStatus === 'সম্পন্ন'))
      .reduce((acc, b) => acc + b.totalAmount, 0);

    const confirmedCount = bookings.filter((b) => b.bookingStatus === 'নিশ্চিত').length;
    const pendingCount = bookings.filter((b) => b.bookingStatus === 'অপেক্ষমাণ').length;
    const cancelledCount = bookings.filter((b) => b.bookingStatus === 'বাতিল').length;
    const completedCount = bookings.filter((b) => b.bookingStatus === 'সম্পন্ন').length;

    // Slot breakdown for today
    const todaySlots = db.getSlotStatusForDate(today);
    const availableSlotsCount = todaySlots.filter((s) => s.currentStatus === 'উপলব্ধ').length;
    const bookedSlotsCount = todaySlots.filter(
      (s) => s.currentStatus === 'বুকড' || s.currentStatus === 'অপেক্ষমাণ',
    ).length;

    // Weekly revenue chart calculation (last 7 days)
    const last7Days: { date: string; dateLabel: string; revenue: number; bookingsCount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('bn-BD', { weekday: 'short', day: 'numeric', month: 'short' });

      const dayBookings = bookings.filter((b) => b.bookingDate === dateStr && b.bookingStatus !== 'বাতিল');
      const dayRev = dayBookings.reduce((sum, b) => sum + (b.paymentStatus === 'সফল' ? b.totalAmount : 0), 0);

      last7Days.push({
        date: dateStr,
        dateLabel: dayLabel,
        revenue: dayRev,
        bookingsCount: dayBookings.length,
      });
    }

    res.json({
      success: true,
      data: {
        todayBookingsCount: todayBookings.length,
        todayRevenue,
        totalBookingsCount: bookings.length,
        confirmedCount,
        pendingCount,
        cancelledCount,
        completedCount,
        totalRevenue,
        availableSlotsCount,
        bookedSlotsCount,
        last7Days,
        recentBookings: bookings.slice(0, 10),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Admin Bookings Management
apiRouter.get('/admin/bookings', verifyAdminSession, (req, res) => {
  try {
    const { status, paymentStatus, search, date } = req.query;
    let list = db.getBookings();

    if (status && status !== 'All') {
      list = list.filter((b) => b.bookingStatus === status);
    }
    if (paymentStatus && paymentStatus !== 'All') {
      list = list.filter((b) => b.paymentStatus === paymentStatus);
    }
    if (date) {
      list = list.filter((b) => b.bookingDate === date);
    }
    if (search) {
      const q = (search as string).toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          b.customerPhone.includes(q) ||
          (b.transactionId && b.transactionId.toLowerCase().includes(q)),
      );
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.patch('/admin/bookings/:id/status', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    const { bookingStatus, paymentStatus } = req.body;
    const updated = db.updateBookingStatus(req.params.id, bookingStatus, paymentStatus, adminUser.name);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'বুকিং পাওয়া যায়নি।' });
    }
    res.json({ success: true, message: 'বুকিং স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে।', data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.post('/admin/bookings/manual', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    const newBooking = db.createBooking(req.body, `অ্যাডমিন (${adminUser.name})`);
    res.status(201).json({ success: true, message: 'ম্যানুয়াল বুকিং যোগ হয়েছে।', data: newBooking });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 3. Settings & Content Management
apiRouter.get('/admin/settings', verifyAdminSession, (req, res) => {
  res.json({ success: true, data: db.getSettings() });
});

apiRouter.put('/admin/settings', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    const updated = db.updateSettings(req.body, adminUser.name);
    res.json({ success: true, message: 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে।', data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Turf & Kids Zone Updates
apiRouter.put('/admin/turf', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    const updated = db.updateTurfInfo(req.body, adminUser.name);
    res.json({ success: true, message: 'টার্ফের তথ্য সংরক্ষিত হয়েছে।', data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.put('/admin/kids-zone', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    const updated = db.updateKidsZoneInfo(req.body, adminUser.name);
    res.json({ success: true, message: 'কিডস জোনের তথ্য সংরক্ষিত হয়েছে।', data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Time Slots Management
apiRouter.get('/admin/slots', verifyAdminSession, (req, res) => {
  res.json({ success: true, data: db.getTimeSlots() });
});

apiRouter.post('/admin/slots', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    const slots = db.getTimeSlots();
    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      playDuration: req.body.playDuration || '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট',
      slotType: req.body.slotType || 'সন্ধ্যা',
      regularPrice: Number(req.body.regularPrice) || 1200,
      peakPrice: req.body.peakPrice ? Number(req.body.peakPrice) : undefined,
      weekendPrice: req.body.weekendPrice ? Number(req.body.weekendPrice) : undefined,
      isActive: true,
    };
    slots.push(newSlot);
    db.setTimeSlots(slots, adminUser.name);
    res.json({ success: true, message: 'নতুন স্লট তৈরি করা হয়েছে।', data: newSlot });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.put('/admin/slots/:id', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    const updated = db.updateTimeSlot(req.params.id, req.body, adminUser.name);
    if (!updated) return res.status(404).json({ success: false, message: 'স্লট পাওয়া যায়নি।' });
    res.json({ success: true, message: 'স্লট আপডেট হয়েছে।', data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.delete('/admin/slots/:id', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    const slots = db.getTimeSlots().filter((s) => s.id !== req.params.id);
    db.setTimeSlots(slots, adminUser.name);
    res.json({ success: true, message: 'স্লট ডিলিট করা হয়েছে।' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. Facilities Management
apiRouter.get('/admin/facilities', verifyAdminSession, (req, res) => {
  res.json({ success: true, data: db.getFacilities() });
});

apiRouter.post('/admin/facilities', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    const facility: Facility = {
      id: req.body.id || `fac-${Date.now()}`,
      title: req.body.title,
      description: req.body.description,
      iconName: req.body.iconName || 'Trophy',
      isActive: req.body.isActive !== false,
    };
    const saved = db.saveFacility(facility, adminUser.name);
    res.json({ success: true, message: 'সুবিধা যোগ/আপডেট হয়েছে।', data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.delete('/admin/facilities/:id', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    db.deleteFacility(req.params.id, adminUser.name);
    res.json({ success: true, message: 'সুবিধা ডিলিট হয়েছে।' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 7. Gallery Management
apiRouter.post('/admin/gallery', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    const item: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: req.body.title || 'টার্ফ ছবি',
      category: req.body.category || 'টার্ফ',
      imageUrl: req.body.imageUrl,
      date: new Date().toISOString().split('T')[0],
    };
    const saved = db.addGalleryItem(item, adminUser.name);
    res.json({ success: true, message: 'ছবি গ্যালারিতে যোগ হয়েছে।', data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.delete('/admin/gallery/:id', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    db.deleteGalleryItem(req.params.id, adminUser.name);
    res.json({ success: true, message: 'ছবি মুছে ফেলা হয়েছে।' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 8. Events & Tournaments Management
apiRouter.post('/admin/events', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    const evt: TournamentEvent = {
      id: req.body.id || `evt-${Date.now()}`,
      title: req.body.title,
      type: req.body.type || 'টুর্নামেন্ট',
      date: req.body.date,
      time: req.body.time,
      description: req.body.description,
      posterImage: req.body.posterImage,
      registrationStatus: req.body.registrationStatus || 'চলমান',
      entryFee: req.body.entryFee ? Number(req.body.entryFee) : undefined,
      prizeMoney: req.body.prizeMoney,
      winner: req.body.winner,
      runnerUp: req.body.runnerUp,
    };
    const saved = db.saveEvent(evt, adminUser.name);
    res.json({ success: true, message: 'ইভেন্ট/টুর্নামেন্ট সেভ হয়েছে।', data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.delete('/admin/events/:id', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    db.deleteEvent(req.params.id, adminUser.name);
    res.json({ success: true, message: 'ইভেন্ট ডিলিট করা হয়েছে।' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 9. Reviews Moderation
apiRouter.get('/admin/reviews', verifyAdminSession, (req, res) => {
  res.json({ success: true, data: db.getAllReviews() });
});

apiRouter.patch('/admin/reviews/:id/status', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    const updated = db.updateReviewStatus(req.params.id, req.body.status, adminUser.name);
    res.json({ success: true, message: 'রিভিউ স্ট্যাটাস আপডেট হয়েছে।', data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.delete('/admin/reviews/:id', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    db.deleteReview(req.params.id, adminUser.name);
    res.json({ success: true, message: 'রিভিউ মুছে ফেলা হয়েছে।' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 10. FAQs Management
apiRouter.get('/admin/faqs', verifyAdminSession, (req, res) => {
  res.json({ success: true, data: db.getFAQs() });
});

apiRouter.post('/admin/faqs', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    const faq: FAQItem = {
      id: req.body.id || `faq-${Date.now()}`,
      question: req.body.question,
      answer: req.body.answer,
      order: Number(req.body.order) || 1,
    };
    const saved = db.saveFAQ(faq, adminUser.name);
    res.json({ success: true, message: 'FAQ সেভ হয়েছে।', data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.delete('/admin/faqs/:id', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    db.deleteFAQ(req.params.id, adminUser.name);
    res.json({ success: true, message: 'FAQ ডিলিট হয়েছে।' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 11. Coupons & Offers Management
apiRouter.get('/admin/coupons', verifyAdminSession, (req, res) => {
  res.json({ success: true, data: db.getCoupons() });
});

apiRouter.post('/admin/coupons', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    const coupon: Coupon = {
      id: req.body.id || `cp-${Date.now()}`,
      code: req.body.code.toUpperCase().trim(),
      discountPercentage: Number(req.body.discountPercentage) || 0,
      fixedDiscount: Number(req.body.fixedDiscount) || 0,
      minBookingAmount: Number(req.body.minBookingAmount) || 0,
      startDate: req.body.startDate || '2026-01-01',
      endDate: req.body.endDate || '2026-12-31',
      usageLimit: Number(req.body.usageLimit) || 0,
      usedCount: req.body.usedCount || 0,
      isActive: req.body.isActive !== false,
    };
    const saved = db.saveCoupon(coupon, adminUser.name);
    res.json({ success: true, message: 'কুপন সংরক্ষিত হয়েছে।', data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.delete('/admin/coupons/:id', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    db.deleteCoupon(req.params.id, adminUser.name);
    res.json({ success: true, message: 'কুপন ডিলিট হয়েছে।' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.get('/admin/offers', verifyAdminSession, (req, res) => {
  res.json({ success: true, data: db.getOffers() });
});

apiRouter.post('/admin/offers', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    const offer: SpecialOffer = {
      id: req.body.id || `off-${Date.now()}`,
      title: req.body.title,
      description: req.body.description,
      discountText: req.body.discountText,
      image: req.body.image,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      isActive: req.body.isActive !== false,
    };
    const saved = db.saveOffer(offer, adminUser.name);
    res.json({ success: true, message: 'অফার সেভ হয়েছে।', data: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.delete('/admin/offers/:id', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    db.deleteOffer(req.params.id, adminUser.name);
    res.json({ success: true, message: 'অফার ডিলিট হয়েছে।' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 12. Customers CRM
apiRouter.get('/admin/customers', verifyAdminSession, (req, res) => {
  try {
    const bookings = db.getBookings();
    const customerMap = new Map<
      string,
      {
        name: string;
        phone: string;
        email?: string;
        totalBookings: number;
        totalSpent: number;
        lastBookingDate: string;
      }
    >();

    bookings.forEach((b) => {
      const existing = customerMap.get(b.customerPhone);
      const isPaid = b.paymentStatus === 'সফল' || (b.paymentMethod === 'ক্যাশ' && b.bookingStatus === 'সম্পন্ন');
      const amount = isPaid ? b.totalAmount : 0;

      if (existing) {
        existing.totalBookings += 1;
        existing.totalSpent += amount;
        if (b.bookingDate > existing.lastBookingDate) {
          existing.lastBookingDate = b.bookingDate;
        }
      } else {
        customerMap.set(b.customerPhone, {
          name: b.customerName,
          phone: b.customerPhone,
          email: b.customerEmail,
          totalBookings: 1,
          totalSpent: amount,
          lastBookingDate: b.bookingDate,
        });
      }
    });

    const customers = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
    res.json({ success: true, count: customers.length, data: customers });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 13. Reports & Analytics
apiRouter.get('/admin/reports', verifyAdminSession, (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const bookings = db.getBookings();

    let filtered = bookings;
    if (startDate) {
      filtered = filtered.filter((b) => b.bookingDate >= (startDate as string));
    }
    if (endDate) {
      filtered = filtered.filter((b) => b.bookingDate <= (endDate as string));
    }

    const totalRevenue = filtered
      .filter((b) => b.paymentStatus === 'সফল' || (b.paymentMethod === 'ক্যাশ' && b.bookingStatus === 'সম্পন্ন'))
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const bKashRevenue = filtered
      .filter((b) => b.paymentMethod === 'বিকাশ' && b.paymentStatus === 'সফল')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const nagadRevenue = filtered
      .filter((b) => b.paymentMethod === 'নগদ' && b.paymentStatus === 'সফল')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const rocketRevenue = filtered
      .filter((b) => b.paymentMethod === 'রকেট' && b.paymentStatus === 'সফল')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const cashRevenue = filtered
      .filter((b) => b.paymentMethod === 'ক্যাশ' && (b.bookingStatus === 'সম্পন্ন' || b.paymentStatus === 'সফল'))
      .reduce((sum, b) => sum + b.totalAmount, 0);

    // Popular time slots
    const slotUsageMap = new Map<string, number>();
    filtered.forEach((b) => {
      const count = slotUsageMap.get(b.slotTime) || 0;
      slotUsageMap.set(b.slotTime, count + 1);
    });

    const popularSlots = Array.from(slotUsageMap.entries())
      .map(([slotTime, count]) => ({ slotTime, count }))
      .sort((a, b) => b.count - a.count);

    res.json({
      success: true,
      data: {
        totalBookings: filtered.length,
        confirmedBookings: filtered.filter((b) => b.bookingStatus === 'নিশ্চিত').length,
        completedBookings: filtered.filter((b) => b.bookingStatus === 'সম্পন্ন').length,
        cancelledBookings: filtered.filter((b) => b.bookingStatus === 'বাতিল').length,
        pendingBookings: filtered.filter((b) => b.bookingStatus === 'অপেক্ষমাণ').length,
        totalRevenue,
        bKashRevenue,
        nagadRevenue,
        rocketRevenue,
        cashRevenue,
        popularSlots,
        bookingsList: filtered,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 14. Activity Logs
apiRouter.get('/admin/activity-logs', verifyAdminSession, (req, res) => {
  try {
    const logs = db.getActivityLogs();
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 15. Staff & Admins Management
apiRouter.get('/admin/staff', verifyAdminSession, (req, res) => {
  try {
    const users = db.getAdminUsers().map(({ passwordHash, ...u }) => u);
    res.json({ success: true, data: users });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.post('/admin/staff', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    if (adminUser.role !== 'Super Admin') {
      return res.status(403).json({ success: false, message: 'শুধুমাত্র সুপার অ্যাডমিন নতুন স্টাফ তৈরি করতে পারেন।' });
    }

    const { username, name, email, role, password } = req.body;
    if (!username || !name || !password) {
      return res.status(400).json({ success: false, message: 'ইউজারনেম, নাম ও পাসওয়ার্ড আবশ্যক।' });
    }

    const existing = db.getAdminUsers().find((u) => (u?.username ?? '').toLowerCase() === username.toLowerCase());
    if (existing) {
      return res.status(400).json({ success: false, message: 'এই ইউজারনেম ইতোমধ্যে বিদ্যমান।' });
    }

    const newStaff = db.saveAdminUser(
      {
        id: `admin-${Date.now()}`,
        username: username.trim(),
        name: name.trim(),
        email: email?.trim() || '',
        role: role || 'Staff',
        passwordHash: hashPassword(password),
        isMustChangePassword: true,
        createdAt: new Date().toISOString(),
      },
      adminUser.name,
    );

    res.status(201).json({
      success: true,
      message: 'নতুন অ্যাডমিন/স্টাফ সফলভাবে তৈরি হয়েছে।',
      data: { id: newStaff.id, username: newStaff.username, name: newStaff.name, role: newStaff.role },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.delete('/admin/staff/:id', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    if (adminUser.role !== 'Super Admin') {
      return res.status(403).json({ success: false, message: 'শুধুমাত্র সুপার অ্যাডমিন স্টাফ ডিলিট করতে পারেন।' });
    }
    const success = db.deleteAdminUser(req.params.id, adminUser.name);
    if (!success) {
      return res.status(400).json({ success: false, message: 'শেষ অ্যাডমিন অ্যাকাউন্ট মোছা যাবে না।' });
    }
    res.json({ success: true, message: 'স্টাফ অ্যাকাউন্ট মোছা হয়েছে।' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 16. Snapshot Backup & Restore
apiRouter.get('/admin/backup/download', verifyAdminSession, (req, res) => {
  try {
    const snapshot = db.getSnapshot();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=tomsom-turf-backup-${Date.now()}.json`);
    res.send(JSON.stringify(snapshot, null, 2));
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

apiRouter.post('/admin/backup/restore', verifyAdminSession, (req, res) => {
  try {
    const adminUser = (req as any).adminUser;
    if (adminUser.role !== 'Super Admin') {
      return res.status(403).json({ success: false, message: 'শুধুমাত্র সুপার অ্যাডমিন ডাটাবেস রিস্টোর করতে পারেন।' });
    }

    const { snapshot } = req.body;
    if (!snapshot) {
      return res.status(400).json({ success: false, message: 'ব্যাকআপ ডাটা পাওয়া যায়নি।' });
    }

    const ok = db.restoreSnapshot(snapshot, adminUser.name);
    if (!ok) {
      return res.status(500).json({ success: false, message: 'ডাটা রিস্টোর ব্যর্থ হয়েছে।' });
    }

    res.json({ success: true, message: 'ডাটাবেস সফলভাবে রিস্টোর করা হয়েছে।' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Helper for recursive folder zip
function addDirToZip(zipInstance: JSZip, baseDir: string, relativeDir: string = '') {
  const currentPath = path.join(baseDir, relativeDir);
  if (!fs.existsSync(currentPath)) return;

  const entries = fs.readdirSync(currentPath, { withFileTypes: true });
  for (const entry of entries) {
    const entryRelativePath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
    const entryFullPath = path.join(baseDir, entryRelativePath);
    if (entry.isDirectory()) {
      addDirToZip(zipInstance, baseDir, entryRelativePath);
    } else {
      const fileData = fs.readFileSync(entryFullPath);
      zipInstance.file(entryRelativePath, fileData);
    }
  }
}

// 17. Direct cPanel / public_html ZIP Download Endpoint
apiRouter.get('/download-cpanel-zip', async (req, res) => {
  try {
    const distPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distPath)) {
      return res.status(404).json({ success: false, message: 'বিল্ড ফোল্ডার (dist) পাওয়া যায়নি।' });
    }

    const zip = new JSZip();
    addDirToZip(zip, distPath);

    // Also include .htaccess in root if exists in public
    const htaccessPath = path.join(process.cwd(), 'public', '.htaccess');
    if (fs.existsSync(htaccessPath) && !zip.file('.htaccess')) {
      zip.file('.htaccess', fs.readFileSync(htaccessPath));
    }

    // Add deploy guide
    const guidePath = path.join(process.cwd(), 'CPANEL_DEPLOY_GUIDE.md');
    if (fs.existsSync(guidePath)) {
      zip.file('CPANEL_DEPLOY_GUIDE.md', fs.readFileSync(guidePath));
    }

    const buffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 },
    });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="public_html-cpanel-ready.zip"');
    res.setHeader('Content-Length', buffer.length.toString());
    res.end(buffer);
  } catch (err: any) {
    console.error('Error generating cPanel zip:', err);
    res.status(500).json({ success: false, message: 'ZIP ফাইল তৈরিতে সমস্যা হয়েছে: ' + err.message });
  }
});

// Alias for public_html zip download
apiRouter.get('/download-public-html-zip', (req, res) => {
  res.redirect('/api/download-cpanel-zip');
});
