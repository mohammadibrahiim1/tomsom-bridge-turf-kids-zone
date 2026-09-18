export const SlotBookingStatusLegend = () => (
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
);