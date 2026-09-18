import { Tag, CreditCard, Lock, Loader2 } from 'lucide-react';
import { CouponStatus, MappedTimeSlot, PaymentMethod } from '../slotBookingTypes/slotBookingTypes';
import { WebsiteSettings } from '../../../types';

interface SlotBookingPaymentSummaryProps {
  selectedSlot: MappedTimeSlot | null;
  date: string;
  couponCode: string;
  couponDiscount: number;
  couponStatusMessage: CouponStatus | null;
  isValidatingCoupon: boolean;
  paymentMethod: PaymentMethod;
  transactionId: string;
  paymentSenderPhone: string;
  agreedTerms: boolean;
  isSubmitting: boolean;
  settings?: WebsiteSettings;
  finalTotal: number;
  onCouponChange: (v: string) => void;
  onApplyCoupon: () => void;
  onPaymentMethodChange: (m: PaymentMethod) => void;
  onTransactionIdChange: (v: string) => void;
  onSenderPhoneChange: (v: string) => void;
  onAgreedTermsChange: (v: boolean) => void;
}

const PAYMENT_METHODS: PaymentMethod[] = ['বিকাশ', 'নগদ', 'রকেট', 'ক্যাশ'];

export const SlotBookingPaymentSummary = ({
  selectedSlot,
  date,
  couponCode,
  couponDiscount,
  couponStatusMessage,
  isValidatingCoupon,
  paymentMethod,
  transactionId,
  paymentSenderPhone,
  agreedTerms,
  isSubmitting,
  settings,
  finalTotal,
  onCouponChange,
  onApplyCoupon,
  onPaymentMethodChange,
  onTransactionIdChange,
  onSenderPhoneChange,
  onAgreedTermsChange,
}: SlotBookingPaymentSummaryProps) => (
  <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 space-y-4">
    <h3 className="text-base font-bold text-gray-950 flex items-center">
      <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs mr-2 font-black">
        ৪
      </span>
      পেমেন্ট ও বুকিং সারাংশ
    </h3>

    {/* Coupon */}
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
            onChange={(e) => onCouponChange(e.target.value.toUpperCase())}
            className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-300 focus:border-red-600 rounded-md text-xs font-bold text-gray-900 uppercase outline-hidden"
          />
          <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
        </div>
        <button
          type="button"
          id="apply-coupon-btn"
          onClick={onApplyCoupon}
          disabled={isValidatingCoupon || !couponCode.trim()}
          className="px-3.5 py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-md transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isValidatingCoupon ? 'যাচাই...' : 'প্রয়োগ করুন'}
        </button>
      </div>
      {couponStatusMessage && (
        <p
          className={`text-xs font-semibold ${
            couponStatusMessage.type === 'success'
              ? 'text-emerald-600'
              : 'text-red-600'
          }`}
        >
          {couponStatusMessage.msg}
        </p>
      )}
    </div>

    {/* Payment Method */}
    <div className="space-y-2 pt-2 border-t border-gray-100">
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
        পেমেন্ট মাধ্যম নির্বাচন করুন *
      </label>

      <div className="grid grid-cols-4 gap-2">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method}
            type="button"
            id={`payment-method-${method}`}
            onClick={() => onPaymentMethodChange(method)}
            className={`py-2.5 px-2 rounded-md text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
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

      <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-xs space-y-2">
        {paymentMethod === 'বিকাশ' && (
          <div>
            <div className="font-bold text-gray-900">বিকাশ পেমেন্ট নির্দেশনা:</div>
            <div className="text-gray-600">
              বিকাশ {settings?.bkashType} নম্বর:{' '}
              <span className="font-bold text-red-600 font-mono text-sm">
                {settings?.bkashNumber}
              </span>
            </div>
            <div className="text-gray-500 text-2xs mt-1">
              টাকা Send Money/Payment করে নিচে প্রাপ্ত Transaction ID ও সেন্ডার
              নম্বর বসান।
            </div>
          </div>
        )}

        {paymentMethod === 'নগদ' && (
          <div>
            <div className="font-bold text-gray-900">নগদ পেমেন্ট নির্দেশনা:</div>
            <div className="text-gray-600">
              নগদ {settings?.nagadType} নম্বর:{' '}
              <span className="font-bold text-red-600 font-mono text-sm">
                {settings?.nagadNumber}
              </span>
            </div>
            <div className="text-gray-500 text-2xs mt-1">
              টাকা পাঠিয়ে নিচে প্রাপ্ত Transaction ID বসান।
            </div>
          </div>
        )}

        {paymentMethod === 'রকেট' && (
          <div>
            <div className="font-bold text-gray-900">রকেট পেমেন্ট নির্দেশনা:</div>
            <div className="text-gray-600">
              রকেট {settings?.rocketType} নম্বর:{' '}
              <span className="font-bold text-red-600 font-mono text-sm">
                {settings?.rocketNumber}
              </span>
            </div>
          </div>
        )}

        {paymentMethod === 'ক্যাশ' && (
          <div className="text-gray-700">
            <span className="font-bold text-gray-900">ক্যাশ অন টার্ফ: </span>
            {settings?.cashInstruction}
          </div>
        )}

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
                onChange={(e) =>
                  onTransactionIdChange(e.target.value.toUpperCase())
                }
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
                onChange={(e) => onSenderPhoneChange(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-gray-300 focus:border-red-600 rounded-lg text-xs font-semibold text-gray-900"
              />
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Price Summary */}
    <div className="p-4 bg-gray-50 rounded-md space-y-2 text-xs border border-gray-200">
      <div className="flex justify-between text-gray-600">
        <span>নির্বাচিত তারিখ:</span>
        <span className="font-bold text-gray-900">{date}</span>
      </div>
      <div className="flex justify-between text-gray-600">
        <span>নির্বাচিত সময়:</span>
        <span className="font-bold text-gray-900">
          {selectedSlot
            ? `${selectedSlot.startTime} - ${selectedSlot.endTime}`
            : 'এখনও নির্বাচন করা হয়নি'}
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
        <span className="text-lg text-red-600 font-bold">৳{finalTotal}</span>
      </div>
    </div>

    {/* Terms */}
    <div className="flex items-start space-x-2 pt-1">
      <input
        type="checkbox"
        id="agree-terms-checkbox"
        checked={agreedTerms}
        onChange={(e) => onAgreedTermsChange(e.target.checked)}
        className="mt-1 w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500 cursor-pointer"
        required
      />
      <label
        htmlFor="agree-terms-checkbox"
        className="text-xs text-gray-700 leading-relaxed cursor-pointer"
      >
        আমি টমছম ব্রিজ টার্ফের সকল{' '}
        <span className="font-bold text-red-600 underline">নিয়ম ও শর্তাবলি</span>{' '}
        এবং বাতিল নীতিমালা (কমপক্ষে ৩ দিন পূর্বে অবহিতকরণ) মেনে নিচ্ছি।
      </label>
    </div>

    {/* Submit is handled by the form in the parent */}
  </div>
);