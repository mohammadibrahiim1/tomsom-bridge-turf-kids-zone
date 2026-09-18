import React from 'react';
import { AlertCircle, Lock, Loader2 } from 'lucide-react';
import { SlotBookingManagement } from '../slotBookingTypes/slotBookingTypes';
import { useTurfSlotBooking } from '../slotBookingHooks/useTurfSlotBooking';
import { SlotBookingSuccess } from '../components/SlotBookingSuccess';
import { SlotBookingDateSelector } from '../components/SlotBookingDateSelector';
import { SlotGrid } from '../components/SlotGrid';
import { SlotBookingCustomerDetails } from '../components/SlotBookingCustomerDetails';
import { SlotBookingPaymentSummary } from '../components/SlotBookingPaymentSummary';

export const TurfBookingFlow: React.FC<SlotBookingManagement> = ({
  settings,
  initialDate,
  initialSlotId,
  onBookingSuccess,
  onOpenSearch,
}) => {
  const {
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

    handleDateChange,
    handleSelectSlot,
    handleApplyCoupon,
    calculateFinalTotal,
    handleSubmitBooking,
    handleNewBooking,
    refetch,
  } = useTurfSlotBooking({ initialDate, initialSlotId, onBookingSuccess });

  const handlePrint = () => window.print();

  if (confirmedBooking) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <SlotBookingSuccess
          booking={confirmedBooking}
          settings={settings}
          onPrint={handlePrint}
          onOpenSearch={onOpenSearch}
          onNewBooking={handleNewBooking}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-950">
            অনলাইন টার্ফ বুকিং
          </h1>
          <p className="text-sm text-gray-600">
            তারিখ ও স্লট নির্বাচন করে সহজে আপনার ম্যাচ বুক করুন। প্রতিটি স্লট ৬০
            মিনিট (৫৫ মিনিট খেলা + ৫ মিনিট ইন/আউট)।
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-xl flex items-start space-x-3 text-red-700 text-sm font-semibold">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-7 space-y-6">
            <SlotBookingDateSelector
              date={date}
              today={today}
              isFetching={isFetching}
              onDateChange={handleDateChange}
              onRefresh={refetch}
            />

            <SlotGrid
              filteredSlots={filteredSlots}
              selectedSlot={selectedSlot}
              isLoading={isLoadingSlots}
              isFetching={isFetching}
              filterType={filterType}
              onFilterChange={setFilterType}
              onSelectSlot={handleSelectSlot}
            />
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <SlotBookingCustomerDetails
                customerName={customerName}
                customerPhone={customerPhone}
                customerEmail={customerEmail}
                specialNotes={specialNotes}
                onNameChange={setCustomerName}
                onPhoneChange={setCustomerPhone}
                onEmailChange={setCustomerEmail}
                onNotesChange={setSpecialNotes}
              />

              <SlotBookingPaymentSummary
                selectedSlot={selectedSlot}
                date={date}
                couponCode={couponCode}
                couponDiscount={couponDiscount}
                couponStatusMessage={couponStatusMessage}
                isValidatingCoupon={isValidatingCoupon}
                paymentMethod={paymentMethod}
                transactionId={transactionId}
                paymentSenderPhone={paymentSenderPhone}
                agreedTerms={agreedTerms}
                isSubmitting={isSubmitting}
                settings={settings}
                finalTotal={calculateFinalTotal()}
                onCouponChange={setCouponCode}
                onApplyCoupon={handleApplyCoupon}
                onPaymentMethodChange={setPaymentMethod}
                onTransactionIdChange={setTransactionId}
                onSenderPhoneChange={setPaymentSenderPhone}
                onAgreedTermsChange={setAgreedTerms}
              />

              <button
                type="submit"
                id="submit-booking-btn"
                disabled={isSubmitting || !selectedSlot || !agreedTerms}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base rounded-md shadow-lg transition-all flex items-center justify-center cursor-pointer"
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};