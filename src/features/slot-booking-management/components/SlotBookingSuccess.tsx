import { CheckCircle2, Printer, Search, Calendar } from 'lucide-react';
import { Booking, WebsiteSettings } from '../../../types';
import { PrintableReceipt } from '../../../components/PrintableReceipt';

interface BookingSuccessProps {
  booking: Booking;
  settings?: WebsiteSettings;
  onPrint: () => void;
  onOpenSearch?: () => void;
  onNewBooking: () => void;
}

export const SlotBookingSuccess = ({
  booking,
  settings,
  onPrint,
  onOpenSearch,
  onNewBooking,
}: BookingSuccessProps) => (
  <div className="bg-white rounded-md shadow-xl border border-gray-200 p-6 sm:p-10 space-y-8">
    <div className="text-center space-y-3 pb-6 border-b border-gray-100">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-gray-950">
        আপনার বুকিং সফলভাবে সম্পন্ন হয়েছে!
      </h2>
      <p className="text-sm text-gray-600 max-w-lg mx-auto">
        টমছম ব্রিজ টার্ফে আপনার বুকিং রেকর্ড করা হয়েছে। অনুগ্রহ করে আপনার ইউনিক
        বুকিং আইডি এবং রসিদ সংরক্ষণ করুন।
      </p>
      <div className="inline-block bg-red-50 border-2 border-red-600 text-red-700 px-6 py-2 rounded-md text-lg font-mono font-bold tracking-wider shadow-xs">
        বুকিং আইডি: {booking.id}
      </div>
    </div>

    <div className="flex flex-wrap items-center justify-center gap-3 no-print">
      <button
        id="print-receipt-btn"
        onClick={onPrint}
        className="inline-flex items-center px-5 py-2.5 bg-black hover:bg-gray-800 text-white font-bold text-sm rounded-md shadow-md transition-colors cursor-pointer"
      >
        <Printer className="w-4 h-4 mr-2 text-red-500" />
        প্রিন্ট রসিদ
      </button>

      {onOpenSearch && (
        <button
          id="search-booking-jump-btn"
          onClick={onOpenSearch}
          className="inline-flex items-center px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-sm rounded-md transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4 mr-2 text-red-600" />
          বুকিং খুঁজুন
        </button>
      )}

      <button
        id="new-booking-btn"
        onClick={onNewBooking}
        className="inline-flex items-center px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-md transition-colors cursor-pointer"
      >
        <Calendar className="w-4 h-4 mr-2" />
        নতুন বুকিং করুন
      </button>
    </div>

    <div className="border border-gray-200 rounded-md overflow-hidden shadow-xs">
      <PrintableReceipt booking={booking} settings={settings} />
    </div>
  </div>
);