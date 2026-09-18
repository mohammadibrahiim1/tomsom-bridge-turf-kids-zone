import { Calendar } from 'lucide-react';

interface SlotBookingDateSelectorProps {
  date: string;
  today: string;
  isFetching: boolean;
  onDateChange: (date: string) => void;
  onRefresh: () => void;
}

export const SlotBookingDateSelector = ({
  date,
  today,
  isFetching,
  onDateChange,
  onRefresh,
}: SlotBookingDateSelectorProps) => (
  <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-bold text-gray-950 flex items-center">
        <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs mr-2 font-black">
          ১
        </span>
        খেলার তারিখ নির্বাচন করুন
      </h3>
      <span className="text-xs text-gray-500 font-medium">
        আজ:{' '}
        {new Date().toLocaleDateString('bn-BD', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </span>
    </div>

    <div className="flex items-center space-x-3">
      <div className="relative flex-1">
        <input
          type="date"
          id="booking-flow-date"
          min={today}
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 focus:border-red-600 rounded-md text-base font-bold text-gray-900 outline-hidden"
        />
        <Calendar className="w-5 h-5 text-red-600 absolute left-3.5 top-3.5 pointer-events-none" />
      </div>

      <button
        type="button"
        onClick={onRefresh}
        disabled={isFetching}
        className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-xs font-bold transition-colors shrink-0 disabled:opacity-50"
        title="রিফ্রেশ করুন"
      >
        {isFetching ? 'লোড...' : 'স্লট রিফ্রেশ'}
      </button>
    </div>
  </div>
);