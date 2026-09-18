import { useState, useEffect, useId, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { mapSlotToTimeSlot } from '../utils/slotMappers';
import { CouponStatus, MappedTimeSlot, PaymentMethod, SlotBookingManagement } from '../slotBookingTypes/slotBookingTypes';
import { useGetAllSlotsQuery } from '../../slot-management/service/slotApi/slotApi';
import { Booking } from '../../../types';


export function useTurfSlotBooking({
  initialDate,
  initialSlotId,
  onBookingSuccess,
}: Pick<
  SlotBookingManagement,
  'initialDate' | 'initialSlotId' | 'onBookingSuccess'
>) {
  const sessionId = useId();
  const today = new Date().toISOString().split('T')[0];

  // ---------- Core state ----------
  const [date, setDate] = useState(initialDate || today);
  const [selectedSlot, setSelectedSlot] = useState<MappedTimeSlot | null>(null);

  // Customer
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponStatusMessage, setCouponStatusMessage] =
    useState<CouponStatus | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Payment
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('বিকাশ');
  const [transactionId, setTransactionId] = useState('');
  const [paymentSenderPhone, setPaymentSenderPhone] = useState('');

  // Submit & Confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Filter
  const [filterType, setFilterType] = useState<string>('All');

  // ---------- RTK Query ----------
  const {
    data: slotsResponse,
    isLoading: isLoadingSlots,
    isFetching,
    isError: isSlotsError,
    error: slotsError,
    refetch,
  } = useGetAllSlotsQuery(
    { page: 1, limit: 100 }, // TODO: pass { date } when backend supports it
    { refetchOnMountOrArgChange: true }
  );

  const slots = useMemo(() => {
    if (!slotsResponse?.data || !Array.isArray(slotsResponse.data)) return [];
    return slotsResponse.data.map(mapSlotToTimeSlot);
  }, [slotsResponse]);

  // Auto-select initialSlotId
  useEffect(() => {
    if (!initialSlotId || !slots.length || selectedSlot) return;

    const match = slots.find(
      (s) =>
        s.id === initialSlotId &&
        (s.currentStatus === 'উপলব্ধ' || s.currentStatus === 'অপেক্ষমাণ')
    );
    if (match) setSelectedSlot(match);
  }, [slots, initialSlotId, selectedSlot]);

  // Surface RTK errors
  useEffect(() => {
    if (isSlotsError) {
      const msg =
        (slotsError as any)?.data?.message ||
        (slotsError as any)?.message ||
        'স্লট লোড করতে ব্যর্থ হয়েছে';
      setErrorMessage(msg);
    }
  }, [isSlotsError, slotsError]);

  // ---------- Handlers ----------
  const handleDateChange = useCallback((newDate: string) => {
    setDate(newDate);
    setSelectedSlot(null);
    setErrorMessage(null);
  }, []);

  const handleSelectSlot = useCallback(
    async (slot: MappedTimeSlot) => {
      if (slot.currentStatus === 'বুকড') {
        setErrorMessage(
          'এই স্লটটি ইতোমধ্যে বুকড রয়েছে। অনুগ্রহ করে অন্য একটি সময় নির্বাচন করুন।'
        );
        return;
      }
      if (slot.currentStatus === 'বন্ধ') {
        setErrorMessage('এই স্লটটি বর্তমানে বন্ধ রয়েছে।');
        return;
      }

      setErrorMessage(null);
      setSelectedSlot(slot);

      // Optional temporary lock (non-blocking)
      try {
        // await lockSlot(slot.id, date, sessionId);
      } catch {
        // ignore
      }
    },
    [date, sessionId]
  );

  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim() || !selectedSlot) return;

    setIsValidatingCoupon(true);
    setCouponStatusMessage(null);

    try {
      // const res = await api.validateCoupon(couponCode.trim(), selectedSlot.regularPrice);
      // if (res.valid) {
      //   setCouponDiscount(res.discount);
      //   setCouponStatusMessage({ type: 'success', msg: res.message });
      // } else {
      //   setCouponDiscount(0);
      //   setCouponStatusMessage({ type: 'error', msg: res.message });
      // }

      // Temporary stub – remove when API is ready
      setCouponDiscount(0);
      setCouponStatusMessage({
        type: 'error',
        msg: 'কুপন যাচাই API এখনো কানেক্ট করা হয়নি',
      });
    } catch {
      setCouponDiscount(0);
      setCouponStatusMessage({
        type: 'error',
        msg: 'কুপন যাচাই করা সম্ভব হয়নি',
      });
    } finally {
      setIsValidatingCoupon(false);
    }
  }, [couponCode, selectedSlot]);

  const calculateFinalTotal = useCallback(() => {
    if (!selectedSlot) return 0;
    return Math.max(0, selectedSlot.regularPrice - couponDiscount);
  }, [selectedSlot, couponDiscount]);

  const handleSubmitBooking = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage(null);

      if (!selectedSlot) {
        setErrorMessage('অনুগ্রহ করে একটি খেলার সময় (Time Slot) নির্বাচন করুন।');
        return;
      }
      if (!agreedTerms) {
        setErrorMessage(
          'টার্ফ বুকিং সম্পন্ন করার জন্য নিয়ম ও শর্তাবলিতে সম্মতি দেওয়া আবশ্যক।'
        );
        return;
      }
      if (paymentMethod !== 'ক্যাশ' && !transactionId.trim()) {
        setErrorMessage(
          `অনুগ্রহ করে ${paymentMethod} পেমেন্টের ট্রানজেকশন আইডি (Transaction ID) প্রদান করুন।`
        );
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
          slotDuration:
            selectedSlot.playDuration || '৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট',
          type: 'টার্ফ',
          amount: selectedSlot.regularPrice,
          discountAmount: couponDiscount,
          couponCode: couponDiscount > 0 ? couponCode.trim() : undefined,
          totalAmount: calculateFinalTotal(),
          paymentMethod,
          transactionId: transactionId.trim(),
          paymentSenderNumber:
            paymentSenderPhone.trim() || customerPhone.trim(),
          notes: specialNotes.trim(),
        };

        // const res = await api.createBooking(bookingPayload);
        // if (res.success && res.data) {
        //   setConfirmedBooking(res.data);
        //   onBookingSuccess?.(res.data);
        //   confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        // } else {
        //   setErrorMessage(res.message || 'বুকিং সম্পন্ন করতে ব্যর্থ হয়েছে।');
        // }

        // Temporary success stub – remove when API is ready
        const mockBooking = {
          id: `BK-${Date.now()}`,
          ...bookingPayload,
        } as Booking;

        setConfirmedBooking(mockBooking);
        onBookingSuccess?.(mockBooking);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (err: any) {
        setErrorMessage(
          err?.message || 'বুকিং সম্পন্ন করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      selectedSlot,
      agreedTerms,
      paymentMethod,
      transactionId,
      customerName,
      customerPhone,
      customerEmail,
      date,
      couponDiscount,
      couponCode,
      paymentSenderPhone,
      specialNotes,
      calculateFinalTotal,
      onBookingSuccess,
    ]
  );

  const handleNewBooking = useCallback(() => {
    setConfirmedBooking(null);
    setSelectedSlot(null);
    setCouponCode('');
    setCouponDiscount(0);
    setCouponStatusMessage(null);
    setTransactionId('');
    setPaymentSenderPhone('');
    setAgreedTerms(false);
    setErrorMessage(null);
    refetch();
  }, [refetch]);

  const filteredSlots = useMemo(() => {
    if (filterType === 'All') return slots;
    return slots.filter((s) => s.slotType === filterType);
  }, [slots, filterType]);

  return {
    // State
    date,
    selectedSlot,
    customerName,
    customerPhone,
    customerEmail,
    specialNotes,
    agreedTerms,
    couponCode,
    couponDiscount,
    couponStatusMessage,
    isValidatingCoupon,
    paymentMethod,
    transactionId,
    paymentSenderPhone,
    isSubmitting,
    errorMessage,
    confirmedBooking,
    filterType,
    filteredSlots,
    isLoadingSlots,
    isFetching,
    today,

    // Setters
    setCustomerName,
    setCustomerPhone,
    setCustomerEmail,
    setSpecialNotes,
    setAgreedTerms,
    setCouponCode,
    setPaymentMethod,
    setTransactionId,
    setPaymentSenderPhone,
    setFilterType,

    // Handlers
    handleDateChange,
    handleSelectSlot,
    handleApplyCoupon,
    calculateFinalTotal,
    handleSubmitBooking,
    handleNewBooking,
    refetch,
  };
}