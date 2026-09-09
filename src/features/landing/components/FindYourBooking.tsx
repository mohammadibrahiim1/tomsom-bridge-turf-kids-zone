import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Printer,
  Ban,
  Loader2,
  ArrowLeft,
  Phone,
  Receipt,
  RotateCcw,
} from 'lucide-react';
import { PrintableReceipt } from '../../../components/PrintableReceipt';
import { api } from '../../../services/api';
import { Booking, WebsiteSettings } from '../../../types';

export interface CancelMessage {
  type: 'success' | 'error';
  text: string;
}

interface FindYourBookingProps {
  settings?: WebsiteSettings;
  onBackToHome?: () => void;
}

export const FindYourBooking: React.FC<FindYourBookingProps> = ({ settings = {}, onBackToHome }) => {
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Booking[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Selection & Action States
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState<Booking | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);

  // Cancellation Form State
  const [cancelPhone, setCancelPhone] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<CancelMessage | null>(null);

  // Search Handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setCancelMessage(null);
    setCancellingBooking(null);
    setSelectedBookingForReceipt(null);

    try {
      const res = await api.searchBookings(searchQuery.trim());
      if (res?.success && Array.isArray(res.data)) {
        setSearchResults(res.data);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Open Cancel Form
  const handleOpenCancel = (b: Booking) => {
    setCancellingBooking(b);
    setCancelPhone(b.customerPhone);
    setCancelReason('');
    setCancelMessage(null);
  };

  // Confirm Cancellation
  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingBooking) return;

    setIsCancelling(true);
    setCancelMessage(null);

    try {
      const res = await api.cancelBooking(cancellingBooking.id, cancelPhone.trim(), cancelReason.trim());
      if (res?.success) {
        setCancelMessage({ type: 'success', text: res.message || 'বুকিং বাতিল সফল হয়েছে।' });

        // Dynamic search result state update
        setSearchResults((prev) =>
          prev.map((item) =>
            item.id === cancellingBooking.id ? { ...item, ...res.data, bookingStatus: 'বাতিল' } : item,
          ),
        );

        setTimeout(() => {
          setCancellingBooking(null);
        }, 1800);
      } else {
        setCancelMessage({ type: 'error', text: res?.message || 'বুকিং বাতিল ব্যর্থ হয়েছে।' });
      }
    } catch (err: any) {
      setCancelMessage({ type: 'error', text: err?.message || 'নেটওয়ার্ক এরর! আবার চেষ্টা করুন।' });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased'>
      {/* Dynamic Header */}
      <header className='bg-slate-900 text-white shadow-xl border-b border-slate-800 sticky top-0 z-30'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className='p-2 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer text-slate-400 hover:text-white mr-1'
                title='হোমে যান'
              >
                <ArrowLeft className='w-5 h-5' />
              </button>
            )}
            <div className='p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl'>
              <Receipt className='w-6 h-6 text-emerald-500' />
            </div>
            <div>
              <h1 className='text-lg sm:text-xl font-extrabold tracking-tight text-white'>বুকিং অনুসন্ধান ও রসিদ</h1>
              <p className='text-xs text-slate-400 font-medium hidden sm:block'>
                আপনার বুকিং আইডি বা মোবাইল নম্বর ব্যবহার করে স্লট বিস্তারিত যাচাই করুন
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className='flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8'>
        {/* Receipt Printable View Section */}
        {selectedBookingForReceipt ? (
          <div className='bg-white border border-slate-200/80 rounded-3xl shadow-sm p-6 space-y-6 animate-in fade-in duration-200'>
            <div className='flex items-center justify-between border-b border-slate-100 pb-4'>
              <button
                onClick={() => setSelectedBookingForReceipt(null)}
                className='inline-flex items-center text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-all cursor-pointer'
              >
                <ArrowLeft className='w-4 h-4 mr-2' />
                তালিকায় ফিরে যান
              </button>
              <span className='text-xs font-semibold text-slate-500'>
                রসিদ নম্বর: <strong className='text-slate-800'>{selectedBookingForReceipt.id}</strong>
              </span>
            </div>
            <PrintableReceipt booking={selectedBookingForReceipt} settings={settings} />
          </div>
        ) : (
          <>
            {/* Search Box Section */}
            <section className='bg-white border border-slate-200/80 rounded-3xl shadow-sm p-6 sm:p-8 space-y-4'>
              <div className='max-w-2xl mx-auto text-center space-y-2 mb-2'>
                <h2 className='text-xl sm:text-2xl font-black text-slate-900'>বুকিং আইডি অথবা মোবাইল নম্বর দিন</h2>
                <p className='text-xs sm:text-sm text-slate-500 font-medium'>
                  বুকিং করার সময় ব্যবহৃত আইডি (যেমন: TBT-20260828-0001) অথবা ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন।
                </p>
              </div>

              <form onSubmit={handleSearch} className='max-w-3xl mx-auto flex flex-col sm:flex-row gap-3'>
                <div className='relative flex-1'>
                  <input
                    type='text'
                    id='booking-search-input'
                    placeholder='আইডি বা মোবাইল নম্বর লিখুন...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 focus:border-emerald-600 focus:bg-white rounded-2xl text-sm font-bold text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 placeholder:font-normal'
                  />
                  <Search className='w-5 h-5 text-slate-400 absolute left-4 top-4' />
                </div>
                <button
                  type='submit'
                  disabled={isSearching || !searchQuery.trim()}
                  className='px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/20 transition-all duration-200 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center'
                >
                  {isSearching ? (
                    <>
                      <Loader2 className='w-4 h-4 animate-spin mr-2' />
                      খুঁজা হচ্ছে...
                    </>
                  ) : (
                    'অনুসন্ধান করুন'
                  )}
                </button>
              </form>
            </section>

            {/* Cancel Form Section */}
            {cancellingBooking && (
              <section className='bg-red-50/70 border border-red-200/80 rounded-3xl p-6 space-y-4 animate-in fade-in duration-200 max-w-3xl mx-auto'>
                <div className='flex items-start justify-between'>
                  <div>
                    <h3 className='font-black text-red-900 text-base flex items-center'>
                      <Ban className='w-5 h-5 mr-2 text-red-600' />
                      বুকিং বাতিলের আবেদন ({cancellingBooking.id})
                    </h3>
                    <p className='text-xs text-red-600 font-medium mt-1'>
                      নীতিমালা অনুযায়ী ম্যাচ শুরুর অন্তত ৩ দিন (৭২ ঘণ্টা) পূর্বে বাতিলের আবেদন গ্রহণযোগ্য।
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={() => setCancellingBooking(null)}
                    className='text-xs text-slate-500 hover:text-slate-800 font-bold bg-white/80 border border-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer'
                  >
                    বন্ধ করুন
                  </button>
                </div>

                {cancelMessage && (
                  <div
                    className={`p-4 rounded-2xl text-xs font-bold flex items-center space-x-2 ${
                      cancelMessage.type === 'success'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        : 'bg-red-100 text-red-900 border border-red-200'
                    }`}
                  >
                    {cancelMessage.type === 'success' ? (
                      <CheckCircle2 className='w-4 h-4 text-emerald-600 shrink-0' />
                    ) : (
                      <AlertCircle className='w-4 h-4 text-red-600 shrink-0' />
                    )}
                    <span>{cancelMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleConfirmCancel} className='space-y-4 text-xs'>
                  <div>
                    <label className='block font-bold text-slate-700 uppercase tracking-wider mb-1.5'>
                      বুকিংয়ের মোবাইল নম্বর *
                    </label>
                    <input
                      type='tel'
                      required
                      value={cancelPhone}
                      onChange={(e) => setCancelPhone(e.target.value)}
                      className='w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-red-500'
                    />
                  </div>

                  <div>
                    <label className='block font-bold text-slate-700 uppercase tracking-wider mb-1.5'>
                      বাতিলের উপযুক্ত কারণ *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder='বাতিলের কারণ সংক্ষেপে উল্লেখ করুন...'
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className='w-full p-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:border-red-500'
                    />
                  </div>

                  <div className='flex justify-end space-x-3 pt-2'>
                    <button
                      type='button'
                      onClick={() => setCancellingBooking(null)}
                      className='px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer'
                    >
                      ফিরে যান
                    </button>
                    <button
                      type='submit'
                      disabled={isCancelling}
                      className='px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer flex items-center'
                    >
                      {isCancelling ? <Loader2 className='w-4 h-4 animate-spin mr-1.5' /> : null}
                      {isCancelling ? 'প্রসেসিং...' : 'বাতিল নিশ্চিত করুন'}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* Results Display */}
            {hasSearched && (
              <section className='space-y-4'>
                <div className='flex items-center justify-between px-1'>
                  <h3 className='text-xs font-bold text-slate-500 uppercase tracking-wider'>
                    অনুসন্ধানের ফলাফল ({searchResults.length} টি পাওয়া গেছে)
                  </h3>
                </div>

                {searchResults.length === 0 ? (
                  <div className='p-12 text-center bg-white border border-slate-200/80 rounded-3xl space-y-3 shadow-sm'>
                    <AlertCircle className='w-10 h-10 text-slate-300 mx-auto' />
                    <h4 className='font-bold text-slate-800 text-base'>কোনো বুকিং রেকর্ড পাওয়া যায়নি</h4>
                    <p className='text-xs text-slate-500 max-w-md mx-auto'>
                      প্রদত্ত বুকিং নম্বর বা মোবাইল নম্বরটি পুনরায় পরীক্ষা করুন। বুকিং আইডি সঠিকভাবে প্রদান করেছেন কিনা
                      নিশ্চিত করুন।
                    </p>
                  </div>
                ) : (
                  <div className='bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden'>
                    {/* Desktop Table View */}
                    <div className='hidden md:block overflow-x-auto'>
                      <table className='w-full text-left border-collapse'>
                        <thead>
                          <tr className='bg-slate-50 border-b border-slate-200/80 text-[11px] uppercase font-extrabold text-slate-500 tracking-wider'>
                            <th className='p-4 pl-6'>বুকিং আইডি</th>
                            <th className='p-4'>কাস্টমার তথ্য</th>
                            <th className='p-4'>তারিখ ও স্লট</th>
                            <th className='p-4'>পেমেন্ট details</th>
                            <th className='p-4'>স্ট্যাটাস</th>
                            <th className='p-4 pr-6 text-right'>অ্যাকশন</th>
                          </tr>
                        </thead>
                        <tbody className='divide-y divide-slate-100 text-xs font-semibold'>
                          {searchResults.map((b) => (
                            <tr key={b.id} className='hover:bg-slate-50/80 transition-colors'>
                              <td className='p-4 pl-6 font-mono font-bold text-emerald-700 whitespace-nowrap'>
                                {b.id}
                              </td>
                              <td className='p-4 whitespace-nowrap'>
                                <div className='font-bold text-slate-900'>{b.customerName}</div>
                                <div className='text-slate-500 text-[11px] flex items-center mt-0.5'>
                                  <Phone className='w-3 h-3 mr-1 text-slate-400' />
                                  {b.customerPhone}
                                </div>
                              </td>
                              <td className='p-4 whitespace-nowrap space-y-0.5'>
                                <div className='flex items-center text-slate-800 font-bold'>
                                  <Calendar className='w-3.5 h-3.5 mr-1 text-emerald-600' />
                                  {b.bookingDate}
                                </div>
                                <div className='flex items-center text-slate-500 text-[11px]'>
                                  <Clock className='w-3.5 h-3.5 mr-1 text-slate-400' />
                                  {b.slotTime}
                                </div>
                              </td>
                              <td className='p-4 whitespace-nowrap'>
                                <div className='font-extrabold text-slate-900'>৳{b.totalAmount}</div>
                                <div className='text-[11px] text-slate-500'>
                                  {b.paymentMethod} ({b.paymentStatus})
                                </div>
                              </td>
                              <td className='p-4 whitespace-nowrap'>
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full font-bold text-[10px] ${
                                    b.bookingStatus === 'নিশ্চিত'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : b.bookingStatus === 'অপেক্ষমাণ'
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {b.bookingStatus}
                                </span>
                              </td>
                              <td className='p-4 pr-6 text-right whitespace-nowrap'>
                                <div className='flex items-center justify-end space-x-2'>
                                  <button
                                    onClick={() => setSelectedBookingForReceipt(b)}
                                    className='inline-flex items-center px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer text-[11px]'
                                  >
                                    <Printer className='w-3.5 h-3.5 mr-1 text-emerald-400' />
                                    রসিদ
                                  </button>
                                  {b.bookingStatus !== 'বাতিল' && b.bookingStatus !== 'সম্পন্ন' && (
                                    <button
                                      onClick={() => handleOpenCancel(b)}
                                      className='inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl transition-colors cursor-pointer text-[11px]'
                                    >
                                      <Ban className='w-3.5 h-3.5 mr-1' />
                                      বাতিল
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card List View */}
                    <div className='md:hidden divide-y divide-slate-100'>
                      {searchResults.map((b) => (
                        <div key={b.id} className='p-5 space-y-3'>
                          <div className='flex items-center justify-between'>
                            <span className='font-mono font-bold text-sm text-emerald-700'>{b.id}</span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                b.bookingStatus === 'নিশ্চিত'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : b.bookingStatus === 'অপেক্ষমাণ'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {b.bookingStatus}
                            </span>
                          </div>

                          <div className='space-y-1 text-xs'>
                            <div className='font-bold text-slate-900 text-sm'>
                              {b.customerName} ({b.customerPhone})
                            </div>
                            <div className='text-slate-600 flex items-center space-x-3 pt-1'>
                              <span className='flex items-center'>
                                <Calendar className='w-3.5 h-3.5 mr-1 text-emerald-600' />
                                {b.bookingDate}
                              </span>
                              <span className='flex items-center'>
                                <Clock className='w-3.5 h-3.5 mr-1 text-emerald-600' />
                                {b.slotTime}
                              </span>
                            </div>
                            <div className='text-slate-700 pt-1'>
                              মূল্য: <span className='font-bold text-slate-900'>৳{b.totalAmount}</span> | মাধ্যম:{' '}
                              <span className='font-semibold'>{b.paymentMethod}</span>
                            </div>
                          </div>

                          <div className='flex gap-2 pt-2'>
                            <button
                              onClick={() => setSelectedBookingForReceipt(b)}
                              className='flex-1 inline-flex items-center justify-center px-3 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer'
                            >
                              <Printer className='w-3.5 h-3.5 mr-1.5 text-emerald-400' />
                              রসিদ দেখুন
                            </button>
                            {b.bookingStatus !== 'বাতিল' && b.bookingStatus !== 'সম্পন্ন' && (
                              <button
                                onClick={() => handleOpenCancel(b)}
                                className='flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-50 text-red-700 font-bold text-xs rounded-xl cursor-pointer'
                              >
                                <Ban className='w-3.5 h-3.5 mr-1.5' />
                                বাতিল আবেদন
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};
