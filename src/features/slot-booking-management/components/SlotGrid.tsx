import { Loader2, Info } from 'lucide-react';
import { MappedTimeSlot } from '../slotBookingTypes/slotBookingTypes';
import { SlotBookingStatusLegend } from './SlotBookingStatusLegend';
// import { StatusLegend } from './SlotBookingStatusLegend';
// import type { MappedTimeSlot } from '../types';
// import { StatusLegend } from './StatusLegend';

interface SlotGridProps {
  filteredSlots: MappedTimeSlot[];
  selectedSlot: MappedTimeSlot | null;
  isLoading: boolean;
  isFetching: boolean;
  filterType: string;
  onFilterChange: (type: string) => void;
  onSelectSlot: (slot: MappedTimeSlot) => void;
}

const FILTERS = ['All', 'সকাল', 'দুপুর', 'বিকাল', 'সন্ধ্যা', 'রাত'] as const;

export const SlotGrid = ({
  filteredSlots,
  selectedSlot,
  isLoading,
  isFetching,
  filterType,
  onFilterChange,
  onSelectSlot,
}: SlotGridProps) => (
  <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-base font-bold text-gray-950 flex items-center">
        <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs mr-2 font-black">
          ২
        </span>
        উপলব্ধ খেলার সময় নির্বাচন করুন
      </h3>

      <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg text-xs font-semibold">
        {FILTERS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onFilterChange(t)}
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

    <SlotBookingStatusLegend />

    {isLoading || isFetching ? (
      <div className="py-12 flex flex-col items-center justify-center text-gray-500 space-y-2">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        <span className="text-sm font-semibold">স্লট লোড হচ্ছে...</span>
      </div>
    ) : filteredSlots.length === 0 ? (
      <div className="py-10 text-center text-gray-500 bg-gray-50 rounded-md">
        এই তারিখে বর্তমানে কোনো সময় উপলব্ধ নেই।
      </div>
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filteredSlots.map((slot) => {
          const isSelected = selectedSlot?.id === slot.id;
          const isBooked = slot.currentStatus === 'বুকড';
          const isPending = slot.currentStatus === 'অপেক্ষমাণ';
          const isClosed = slot.currentStatus === 'বন্ধ';

          let btnStyle =
            'bg-white border-2 border-gray-200 hover:border-red-500 text-gray-900';
          if (isSelected) {
            btnStyle =
              'bg-red-600 border-2 border-red-600 text-white shadow-md ring-2 ring-red-600/30';
          } else if (isBooked || isClosed) {
            btnStyle =
              'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed opacity-70';
          } else if (isPending) {
            btnStyle =
              'bg-amber-50 border-2 border-amber-300 text-amber-900 hover:border-amber-500';
          }

          return (
            <button
              key={slot.id}
              type="button"
              id={`slot-card-${slot.id}`}
              disabled={isBooked || isClosed}
              onClick={() => onSelectSlot(slot)}
              className={`p-2 rounded-md flex flex-col items-center justify-center text-center transition-all cursor-pointer ${btnStyle}`}
            >
              <span className="text-xs font-semibold opacity-80 uppercase tracking-wide">
                {slot.slotType}
              </span>
              <span className="text-sm sm:text-base font-bold my-0.5">
                {slot.displayTime}
              </span>
              <div
                className={`mt-2 pt-1 border-t w-full text-sm font-bold ${
                  isSelected
                    ? 'border-red-400 text-white'
                    : 'border-gray-100 text-red-600'
                }`}
              >
                {isBooked
                  ? 'বুকড'
                  : isClosed
                  ? 'বন্ধ'
                  : `৳${slot.regularPrice}`}
              </div>
            </button>
          );
        })}
      </div>
    )}

    <div className="bg-red-50 border border-red-200 p-3 rounded-md text-xs text-red-900 flex items-start space-x-2">
      <Info className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
      <div>
        <span className="font-bold">স্লটের নিয়ম: </span>
        প্রতিটি স্লট ৬০ মিনিটের। এর মধ্যে ৫৫ মিনিট খেলা এবং ৫ মিনিট খেলোয়াড়দের
        ইন/আউট ও মাঠ প্রস্তুত করার সময়।
      </div>
    </div>
  </div>
);