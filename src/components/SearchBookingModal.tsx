import React, { useState } from 'react';
import { Search, X, Calendar, Clock, AlertCircle, CheckCircle2, Phone, Printer, Ban, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import type { Booking, WebsiteSettings } from '../types';
import { PrintableReceipt } from './PrintableReceipt';

interface SearchBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WebsiteSettings;
}

export const SearchBookingModal: React.FC<SearchBookingModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Booking[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState<Booking | null>(null);

  // Cancellation State
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancelPhone, setCancelPhone] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setCancelMessage(null);
    try {
      const res = await api.searchBookings(searchQuery.trim());
      if (res.success && Array.isArray(res.data)) {
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

  const handleOpenCancel = (b: Booking) => {
    setCancellingBooking(b);
    setCancelPhone(b.customerPhone);
    setCancelReason('');
    setCancelMessage(null);
  };

  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingBooking) return;

    setIsCancelling(true);
    setCancelMessage(null);
    try {
      const res = await api.cancelBooking(cancellingBooking.id, cancelPhone.trim(), cancelReason.trim());
      if (res.success) {
        setCancelMessage({ type: 'success', text: res.message || 'বুকিং বাতিল করা হয়েছে।' });
        // Update item in searchResults
        setSearchResults(prev => prev.map(item => item.id === cancellingBooking.id ? res.data : item));
        setTimeout(() => {
          setCancellingBooking(null);
        }, 1500);
      }
    } catch (err: any) {
      setCancelMessage({ type: 'error', text: err.message || 'বুকিং বাতিল ব্যর্থ হয়েছে।' });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gray-900 text-white flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold">আমার বুকিং খুঁজুন ও রসিদ ডাউনলোড</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {selectedBookingForReceipt ? (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedBookingForReceipt(null)}
                className="inline-flex items-center text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg"
              >
                ← তালিকায় ফিরে যান
              </button>
              <PrintableReceipt booking={selectedBookingForReceipt} settings={settings} />
            </div>
          ) : cancellingBooking ? (
            /* Cancel Request Form */
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-red-800 text-base flex items-center">
                    <Ban className="w-4 h-4 mr-1.5" />
                    বুকিং বাতিলের আবেদন ({cancellingBooking.id})
                  </h4>
                  <p className="text-xs text-red-600 mt-1">
                    নীতিমালা অনুযায়ী ম্যাচ শুরুর কমপক্ষে ৩ দিন (৭২ ঘণ্টা) পূর্বে বাতিলের আবেদন করতে হবে।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCancellingBooking(null)}
                  className="text-xs text-gray-500 hover:text-gray-700 font-bold"
                >
                  বন্ধ করুন
                </button>
              </div>

              {cancelMessage && (
                <div className={`p-3 rounded-lg text-xs font-bold ${cancelMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {cancelMessage.text}
                </div>
              )}

              <form onSubmit={handleConfirmCancel} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    বুকিংয়ের মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    required
                    value={cancelPhone}
                    onChange={(e) => setCancelPhone(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    বাতিলের কারণ
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="কেন বাতিল করতে চাচ্ছেন লিখুন..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCancellingBooking(null)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg"
                  >
                    না, ফেরত যান
                  </button>
                  <button
                    type="submit"
                    disabled={isCancelling}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg disabled:opacity-50"
                  >
                    {isCancelling ? 'বাতিল হচ্ছে...' : 'বাতিল নিশ্চিত করুন'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Search Form & Results */
            <>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="search-booking-query-input"
                    placeholder="বুকিং আইডি (যেমন: TBT-20260828-0001) অথবা মোবাইল নম্বর লিখুন"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-300 focus:border-red-600 rounded-xl text-sm font-semibold text-gray-900 outline-hidden"
                  />
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
                <button
                  type="submit"
                  id="search-booking-submit-btn"
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors shrink-0 disabled:opacity-50 cursor-pointer flex items-center"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'অনুসন্ধান'}
                </button>
              </form>

              {/* Search Results */}
              {hasSearched && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    অনুসন্ধানের ফলাফল ({searchResults.length} টি বুকিং)
                  </h4>

                  {searchResults.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-xl text-gray-500 space-y-2">
                      <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
                      <div className="font-bold text-gray-700">কোনো বুকিং পাওয়া যায়নি।</div>
                      <p className="text-xs">
                        দয়া করে সঠিক বুকিং আইডি বা ১১ ডিজিটের মোবাইল নম্বর প্রদান করে পুনরায় চেষ্টা করুন।
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {searchResults.map((b) => (
                        <div
                          key={b.id}
                          className="bg-gray-50 hover:bg-gray-100/80 p-4 rounded-xl border border-gray-200 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                        >
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-bold text-sm text-red-600">{b.id}</span>
                              <span className={`px-2 py-0.5 rounded-full font-bold text-2xs ${
                                b.bookingStatus === 'নিশ্চিত'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : b.bookingStatus === 'অপেক্ষমাণ'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {b.bookingStatus}
                              </span>
                            </div>
                            <div className="font-bold text-gray-900 text-sm">{b.customerName} ({b.customerPhone})</div>
                            <div className="text-gray-600 flex items-center space-x-3">
                              <span className="flex items-center">
                                <Calendar className="w-3.5 h-3.5 mr-1 text-red-500" />
                                {b.bookingDate}
                              </span>
                              <span className="flex items-center">
                                <Clock className="w-3.5 h-3.5 mr-1 text-red-500" />
                                {b.slotTime}
                              </span>
                            </div>
                            <div className="text-gray-700">
                              মূল্য: <span className="font-bold text-red-600">৳{b.totalAmount}</span> | মাধ্যম: <span className="font-semibold">{b.paymentMethod}</span> ({b.paymentStatus})
                            </div>
                          </div>

                          <div className="flex sm:flex-col gap-2 shrink-0">
                            <button
                              onClick={() => setSelectedBookingForReceipt(b)}
                              className="flex-1 inline-flex items-center justify-center px-3 py-1.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5 mr-1 text-red-500" />
                              রসিদ দেখুন
                            </button>

                            {b.bookingStatus !== 'বাতিল' && b.bookingStatus !== 'সম্পন্ন' && (
                              <button
                                onClick={() => handleOpenCancel(b)}
                                className="flex-1 inline-flex items-center justify-center px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                              >
                                <Ban className="w-3.5 h-3.5 mr-1" />
                                বাতিল আবেদন
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};
