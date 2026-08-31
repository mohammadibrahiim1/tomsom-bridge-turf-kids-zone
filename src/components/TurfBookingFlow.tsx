import React, { useState, useEffect, useId } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Tag, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileText, 
  Printer, 
  Download, 
  Search, 
  Lock, 
  CreditCard,
  Info,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import type { Booking, TimeSlot, WebsiteSettings } from '../types';
import { PrintableReceipt } from './PrintableReceipt';

interface TurfBookingFlowProps {
  settings: WebsiteSettings;
  initialDate?: string;
  initialSlotId?: string;
  onBookingSuccess?: (booking: Booking) => void;
  onOpenSearch?: () => void;
}

export const TurfBookingFlow: React.FC<TurfBookingFlowProps> = ({
  settings,
  initialDate,
  initialSlotId,
  onBookingSuccess,
  onOpenSearch,
}) => {
  const sessionId = useId();
  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(initialDate || today);
  const [slots, setSlots] = useState<Array<TimeSlot & { currentStatus: 'উপলব্ধ' | 'বুকড' | 'অপেক্ষমাণ' | 'লকড' | 'বন্ধ' }>>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Form Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponStatusMessage, setCouponStatusMessage] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'বিকাশ' | 'নগদ' | 'রকেট' | 'ক্যাশ'>('বিকাশ');
  const [transactionId, setTransactionId] = useState('');
  const [paymentSenderPhone, setPaymentSenderPhone] = useState('');

  // Processing & Confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Slot filter by type
  const [filterType, setFilterType] = useState<string>('All');

  // Load Slots whenever date changes
  useEffect(() => {
    loadSlotsForDate(date);
  }, [date]);

  const loadSlotsForDate = async (targetDate: string) => {
    setIsLoadingSlots(true);
    setErrorMessage(null);
    try {
      const res = await api.getSlots(targetDate);
      if (res.success && Array.isArray(res.slots)) {
        setSlots(res.slots);
        if (initialSlotId) {
          const match = res.slots.find((s: TimeSlot) => s.id === initialSlotId);
          if (match && (match.currentStatus === 'উপলব্ধ' || match.currentStatus === 'অপেক্ষমাণ')) {
            setSelectedSlot(match);
          }
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'স্লট লোড করতে ব্যর্থ হয়েছে');
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleSelectSlot = async (slot: TimeSlot & { currentStatus: string }) => {
    if (slot.currentStatus === 'বুকড') {
      setErrorMessage('এই স্লটটি ইতোমধ্যে বুকড রয়েছে। অনুগ্রহ করে অন্য একটি সময় নির্বাচন করুন।');
      return;
    }
    if (slot.currentStatus === 'বন্ধ') {
      setErrorMessage('এই স্লটটি বর্তমানে বন্ধ রয়েছে।');
      return;
    }

    setErrorMessage(null);
    setSelectedSlot(slot);

    // Try temporary lock
    try {
      await api.lockSlot(slot.id, date, sessionId);
    } catch (e) {
      // Non-blocking lock attempt
    }
  };

  // Validate coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !selectedSlot) return;
    setIsValidatingCoupon(true);
    setCouponStatusMessage(null);
    try {
      const price = selectedSlot.regularPrice;
      const res = await api.validateCoupon(couponCode.trim(), price);
      if (res.valid) {
        setCouponDiscount(res.discount);
        setCouponStatusMessage({ type: 'success', msg: res.message });
      } else {
        setCouponDiscount(0);
        setCouponStatusMessage({ type: 'error', msg: res.message });
      }
    } catch (err: any) {
      setCouponDiscount(0);
      setCouponStatusMessage({ type: 'error', msg: 'কুপন যাচাই করা সম্ভব হয়নি' });
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const calculateFinalTotal = () => {
    if (!selectedSlot) return 0;
    const basePrice = selectedSlot.regularPrice;
    return Math.max(0, basePrice - couponDiscount);
  };

  // Submit Booking
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedSlot) {
      setErrorMessage('অনুগ্রহ করে একটি খেলার সময় (Time Slot) নির্বাচন করুন।');
      return;
    }

    if (!agreedTerms) {
      setErrorMessage('টার্ফ বুকিং সম্পন্ন করার জন্য নিয়ম ও শর্তাবলিতে সম্মতি দেওয়া আবশ্যক।');
      return;
    }

    if (paymentMethod !== 'ক্যাশ' && !transactionId.trim()) {
      setErrorMessage(`অনুগ্রহ করে ${paymentMethod} পেমেন্টের ট্রানজেকশন আইডি (Transaction ID) প্রদান করুন।`);
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingPayload: Partial<Booking> = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        bookingDate: date,
        slotId: selectedSlot.id,
        slotTime: `${selectedSlot.startTime} - ${selectedSlot.endTime}`,
        slotDuration: selectedSlot.playDuration || '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট',
        type: 'টার্ফ',
        amount: selectedSlot.regularPrice,
        discountAmount: couponDiscount,
        couponCode: couponDiscount > 0 ? couponCode.trim() : undefined,
        totalAmount: calculateFinalTotal(),
        paymentMethod,
        transactionId: transactionId.trim(),
        paymentSenderNumber: paymentSenderPhone.trim() || customerPhone.trim(),
        notes: specialNotes.trim(),
      };

      const res = await api.createBooking(bookingPayload);
      if (res.success && res.data) {
        setConfirmedBooking(res.data);
        if (onBookingSuccess) {
          onBookingSuccess(res.data);
        }
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'বুকিং সম্পন্ন করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewBooking = () => {
    setConfirmedBooking(null);
    setSelectedSlot(null);
    setCouponCode('');
    setCouponDiscount(0);
    setCouponStatusMessage(null);
    setTransactionId('');
    loadSlotsForDate(date);
  };

  // Filter slots
  const filteredSlots = slots.filter(s => {
    if (filterType === 'All') return true;
    return s.slotType === filterType;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      {/* If booking confirmed, show the Confirmation & PDF Receipt Screen */}
      {confirmedBooking ? (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-10 space-y-8">
          
          {/* Header Message */}
          <div className="text-center space-y-3 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950">
              আপনার বুকিং সফলভাবে সম্পন্ন হয়েছে!
            </h2>
            <p className="text-sm text-gray-600 max-w-lg mx-auto">
              টমছম ব্রিজ টার্ফে আপনার বুকিং রেকর্ড করা হয়েছে। অনুগ্রহ করে আপনার ইউনিক বুকিং আইডি এবং রসিদ সংরক্ষণ করুন।
            </p>

            <div className="inline-block bg-red-50 border-2 border-red-600 text-red-700 px-6 py-2 rounded-xl text-lg font-mono font-bold tracking-wider shadow-xs">
              বুকিং আইডি: {confirmedBooking.id}
            </div>
          </div>

          {/* Action Buttons: Download PDF, Print, Search */}
          <div className="flex flex-wrap items-center justify-center gap-3 no-print">
            <button
              id="print-receipt-btn"
              onClick={handlePrint}
              className="inline-flex items-center px-5 py-2.5 bg-black hover:bg-gray-800 text-white font-bold text-sm rounded-xl shadow-md transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 mr-2 text-red-500" />
              প্রিন্ট রসিদ
            </button>

            {onOpenSearch && (
              <button
                id="search-booking-jump-btn"
                onClick={onOpenSearch}
                className="inline-flex items-center px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 mr-2 text-red-600" />
                বুকিং খুঁজুন
              </button>
            )}

            <button
              id="new-booking-btn"
              onClick={handleNewBooking}
              className="inline-flex items-center px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 mr-2" />
              নতুন বুকিং করুন
            </button>
          </div>

          {/* Printable Official Receipt Component */}
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-xs">
            <PrintableReceipt booking={confirmedBooking} settings={settings} />
          </div>

        </div>
      ) : (
        /* Regular Booking Flow Form */
        <div className="space-y-8">
          
          {/* Top Title & Step Indicator */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-950">
              অনলাইন টার্ফ বুকিং
            </h1>
            <p className="text-sm text-gray-600">
              তারিখ ও স্লট নির্বাচন করে সহজে আপনার ম্যাচ বুক করুন। প্রতিটি স্লট ৬০ মিনিট (৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট)।
            </p>
          </div>

          {/* Error Message Toast */}
          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-xl flex items-start space-x-3 text-red-700 text-sm font-semibold">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Col: Step 1 & 2 - Date & Slot Selection */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 1: Date Picker */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-950 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs mr-2 font-black">
                      ১
                    </span>
                    খেলার তারিখ নির্বাচন করুন
                  </h3>
                  <span className="text-xs text-gray-500 font-medium">
                    আজ: {new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="relative flex-1">
                    <input
                      type="date"
                      id="booking-flow-date"
                      min={today}
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setSelectedSlot(null);
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-red-600 rounded-xl text-base font-bold text-gray-900 outline-hidden"
                    />
                    <Calendar className="w-5 h-5 text-red-600 absolute left-3.5 top-3.5 pointer-events-none" />
                  </div>

                  <button
                    type="button"
                    onClick={() => loadSlotsForDate(date)}
                    className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors shrink-0"
                    title="রিফ্রেশ করুন"
                  >
                    স্লট রিফ্রেশ
                  </button>
                </div>
              </div>

              {/* Step 2: Time Slots Grid */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-gray-950 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs mr-2 font-black">
                      ২
                    </span>
                    উপলব্ধ খেলার সময় নির্বাচন করুন
                  </h3>
                  
                  {/* Slot Filter tabs */}
                  <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg text-xs font-semibold">
                    {['All', 'সকাল', 'দুপুর', 'বিকাল', 'সন্ধ্যা', 'রাত'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFilterType(t)}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          filterType === t
                            ? 'bg-red-600 text-white font-bold shadow-xs'
                            : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        {t === 'All' ? 'সব' : t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slot Status Legend */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600 pt-1 pb-2 border-b border-gray-100">
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5" />
                    উপলব্ধ
                  </span>
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-red-600 mr-1.5" />
                    নির্বাচিত
                  </span>
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-gray-300 mr-1.5" />
                    বুকড
                  </span>
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-amber-400 mr-1.5" />
                    অপেক্ষমাণ
                  </span>
                </div>

                {/* Slots Rendering */}
                {isLoadingSlots ? (
                  <div className="py-12 flex flex-col items-center justify-center text-gray-500 space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                    <span className="text-sm font-semibold">স্লট লোড হচ্ছে...</span>
                  </div>
                ) : filteredSlots.length === 0 ? (
                  <div className="py-10 text-center text-gray-500 bg-gray-50 rounded-xl">
                    এই তারিখে বর্তমানে কোনো সময় উপলব্ধ নেই।
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredSlots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;
                      const isBooked = slot.currentStatus === 'বুকড';
                      const isPending = slot.currentStatus === 'অপেক্ষমাণ';
                      const isClosed = slot.currentStatus === 'বন্ধ';

                      let btnStyle = 'bg-white border-2 border-gray-200 hover:border-red-500 text-gray-900';
                      if (isSelected) {
                        btnStyle = 'bg-red-600 border-2 border-red-600 text-white shadow-md ring-2 ring-red-600/30';
                      } else if (isBooked) {
                        btnStyle = 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed opacity-70';
                      } else if (isClosed) {
                        btnStyle = 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed opacity-60';
                      } else if (isPending) {
                        btnStyle = 'bg-amber-50 border-2 border-amber-300 text-amber-900 hover:border-amber-500';
                      }

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          id={`slot-card-${slot.id}`}
                          disabled={isBooked || isClosed}
                          onClick={() => handleSelectSlot(slot)}
                          className={`p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${btnStyle}`}
                        >
                          <span className="text-xs font-semibold opacity-80 uppercase tracking-wide">
                            {slot.slotType}
                          </span>
                          <span className="text-sm sm:text-base font-bold my-0.5">
                            {slot.startTime}
                          </span>
                          <span className="text-xs">
                            {slot.endTime} পর্যন্ত
                          </span>
                          
                          <div className={`mt-2 pt-1 border-t w-full text-xs font-bold ${isSelected ? 'border-red-400 text-white' : 'border-gray-100 text-red-600'}`}>
                            {isBooked ? 'বুকড' : isClosed ? 'বন্ধ' : `৳${slot.regularPrice}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Slot Rule Notification */}
                <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-900 flex items-start space-x-2">
                  <Info className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">স্লটের নিয়ম: </span>
                    প্রতিটি স্লট ৬০ মিনিটের। এর মধ্যে ৫৫ মিনিট খেলা এবং ৫ মিনিট খেলোয়াড়দের ইন/আউট ও মাঠ প্রস্তুত করার সময়।
                  </div>
                </div>

              </div>

            </div>

            {/* Right Col: Step 3 & 4 - Customer Details & Payment */}
            <div className="lg:col-span-5 space-y-6">
              
              <form onSubmit={handleSubmitBooking} className="space-y-6">
                
                {/* Step 3: Customer Details */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
                  <h3 className="text-base font-bold text-gray-950 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs mr-2 font-black">
                      ৩
                    </span>
                    গ্রাহকের তথ্য (Customer Details)
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        পূর্ণ নাম *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="customer-name-input"
                          required
                          placeholder="আপনার নাম লিখুন"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 focus:border-red-600 rounded-xl text-sm font-semibold text-gray-900 outline-hidden"
                        />
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        মোবাইল নম্বর * (১১ ডিজিট)
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          id="customer-phone-input"
                          required
                          placeholder="01819XXXXXX"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 focus:border-red-600 rounded-xl text-sm font-semibold text-gray-900 outline-hidden"
                        />
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        ই-মেইল (ঐচ্ছিক)
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="customer-email-input"
                          placeholder="example@mail.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 focus:border-red-600 rounded-xl text-sm font-semibold text-gray-900 outline-hidden"
                        />
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        বিশেষ অনুরোধ বা নোট (ঐচ্ছিক)
                      </label>
                      <textarea
                        rows={2}
                        id="customer-notes-input"
                        placeholder="যেমন: বল বা বিবস প্রয়োজন"
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 focus:border-red-600 rounded-xl text-xs text-gray-900 outline-hidden resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 4: Coupon & Payment */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
                  <h3 className="text-base font-bold text-gray-950 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs mr-2 font-black">
                      ৪
                    </span>
                    পেমেন্ট ও বুকিং সারাংশ
                  </h3>

                  {/* Coupon Code Section */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ডিসকাউন্ট কুপন
                    </label>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          id="coupon-code-input"
                          placeholder="কুপন কোড (যেমন: WELCOME100)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-300 focus:border-red-600 rounded-xl text-xs font-bold text-gray-900 uppercase outline-hidden"
                        />
                        <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                      </div>
                      <button
                        type="button"
                        id="apply-coupon-btn"
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon || !couponCode.trim()}
                        className="px-3.5 py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {isValidatingCoupon ? 'যাচাই...' : 'প্রয়োগ করুন'}
                      </button>
                    </div>

                    {couponStatusMessage && (
                      <p className={`text-xs font-semibold ${couponStatusMessage.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {couponStatusMessage.msg}
                      </p>
                    )}
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      পেমেন্ট মাধ্যম নির্বাচন করুন *
                    </label>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {(['বিকাশ', 'নগদ', 'রকেট', 'ক্যাশ'] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          id={`payment-method-${method}`}
                          onClick={() => setPaymentMethod(method)}
                          className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                            paymentMethod === method
                              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-600/30'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200'
                          }`}
                        >
                          <CreditCard className="w-4 h-4 mb-1" />
                          <span>{method}</span>
                        </button>
                      ))}
                    </div>

                    {/* Payment details guidance */}
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs space-y-2">
                      {paymentMethod === 'বিকাশ' && (
                        <div>
                          <div className="font-bold text-gray-900">বিকাশ পেমেন্ট নির্দেশনা:</div>
                          <div className="text-gray-600">
                            বিকাশ {settings.bkashType} নম্বর: <span className="font-bold text-red-600 font-mono text-sm">{settings.bkashNumber}</span>
                          </div>
                          <div className="text-gray-500 text-2xs mt-1">
                            টাকা Send Money/Payment করে নিচে প্রাপ্ত Transaction ID ও সেন্ডার নম্বর বসান।
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'নগদ' && (
                        <div>
                          <div className="font-bold text-gray-900">নগদ পেমেন্ট নির্দেশনা:</div>
                          <div className="text-gray-600">
                            নগদ {settings.nagadType} নম্বর: <span className="font-bold text-red-600 font-mono text-sm">{settings.nagadNumber}</span>
                          </div>
                          <div className="text-gray-500 text-2xs mt-1">
                            টাকা পাঠিয়ে নিচে প্রাপ্ত Transaction ID বসান।
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'রকেট' && (
                        <div>
                          <div className="font-bold text-gray-900">রকেট পেমেন্ট নির্দেশনা:</div>
                          <div className="text-gray-600">
                            রকেট {settings.rocketType} নম্বর: <span className="font-bold text-red-600 font-mono text-sm">{settings.rocketNumber}</span>
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'ক্যাশ' && (
                        <div className="text-gray-700">
                          <span className="font-bold text-gray-900">ক্যাশ অন টার্ফ: </span>
                          {settings.cashInstruction}
                        </div>
                      )}

                      {/* Transaction ID input for online methods */}
                      {paymentMethod !== 'ক্যাশ' && (
                        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-2xs font-bold text-gray-700 mb-1">
                              ট্রানজেকশন আইডি (TrxID) *
                            </label>
                            <input
                              type="text"
                              id="payment-trx-id"
                              required
                              placeholder="TrxID (যেমন: BLK938DK)"
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                              className="w-full px-2.5 py-1.5 bg-white border border-gray-300 focus:border-red-600 rounded-lg text-xs font-mono font-bold text-gray-900 uppercase"
                            />
                          </div>
                          <div>
                            <label className="block text-2xs font-bold text-gray-700 mb-1">
                              যে নম্বর থেকে পাঠিয়েছেন
                            </label>
                            <input
                              type="tel"
                              id="payment-sender-number"
                              placeholder="01XXXXXXXXX"
                              value={paymentSenderPhone}
                              onChange={(e) => setPaymentSenderPhone(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-gray-300 focus:border-red-600 rounded-lg text-xs font-semibold text-gray-900"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price Calculation Breakdown */}
                  <div className="p-4 bg-gray-50 rounded-xl space-y-2 text-xs border border-gray-200">
                    <div className="flex justify-between text-gray-600">
                      <span>নির্বাচিত তারিখ:</span>
                      <span className="font-bold text-gray-900">{date}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>নির্বাচিত সময়:</span>
                      <span className="font-bold text-gray-900">
                        {selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : 'এখনও নির্বাচন করা হয়নি'}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>টার্ফ ভাড়া (১ ঘণ্টা):</span>
                      <span className="font-bold text-gray-900">
                        ৳{selectedSlot ? selectedSlot.regularPrice : 0}
                      </span>
                    </div>

                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>কুপন ডিসকাউন্ট:</span>
                        <span>- ৳{couponDiscount}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm font-black text-gray-950">
                      <span>মোট প্রদেয় মূল্য:</span>
                      <span className="text-lg text-red-600 font-bold">
                        ৳{calculateFinalTotal()}
                      </span>
                    </div>
                  </div>

                  {/* Terms & Consent Checkbox */}
                  <div className="flex items-start space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="agree-terms-checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
                      required
                    />
                    <label htmlFor="agree-terms-checkbox" className="text-xs text-gray-700 leading-relaxed cursor-pointer">
                      আমি টমছম ব্রিজ টার্ফের সকল{' '}
                      <span className="font-bold text-red-600 underline">নিয়ম ও শর্তাবলি</span>{' '}
                      এবং বাতিল নীতিমালা (কমপক্ষে ৩ দিন পূর্বে অবহিতকরণ) মেনে নিচ্ছি।
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    id="submit-booking-btn"
                    disabled={isSubmitting || !selectedSlot || !agreedTerms}
                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base rounded-xl shadow-lg transition-all flex items-center justify-center cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        বুকিং প্রক্রিয়াধীন...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        বুকিং নিশ্চিত করুন (৳{calculateFinalTotal()})
                      </>
                    )}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
