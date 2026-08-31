import type { Booking } from '../types';

/**
 * Utility to convert data arrays into CSV/Excel format with UTF-8 BOM 
 * so that Bengali characters, dates, amounts, and symbols appear properly in Microsoft Excel.
 */

function downloadCsvBlob(csvContent: string, fileName: string) {
  // UTF-8 BOM (\uFEFF) ensures Excel recognizes Unicode characters (Bangla, etc.)
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCsvValue(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Export Bookings Table to Excel / CSV
 */
export function exportBookingsToExcel(bookings: Booking[], customFileName?: string) {
  const headers = [
    'বুকিং আইডি (Booking ID)',
    'গ্রাহকের নাম (Customer Name)',
    'মোবাইল নম্বর (Phone)',
    'ইমেইল (Email)',
    'ম্যাচের তারিখ (Match Date)',
    'টাইম স্লট (Time Slot)',
    'ধরণ (Type)',
    'মূল ফি (Base Amount)',
    'ডিসকাউন্ট (Discount)',
    'কুপন কোড (Coupon)',
    'মোট প্রদেয় (Total Payable)',
    'পেমেন্ট মাধ্যম (Payment Method)',
    'ট্রানজাকশন আইডি (TrxID)',
    'প্রেরক নম্বর (Sender No)',
    'পেমেন্ট স্ট্যাটাস (Payment Status)',
    'বুকিং স্ট্যাটাস (Booking Status)',
    'বুকিং তৈরির সময় (Created At)',
    'বিশেষ নোট (Notes)'
  ];

  const rows = bookings.map((b) => [
    b.id,
    b.customerName,
    b.customerPhone,
    b.customerEmail || '-',
    b.bookingDate,
    b.slotTime,
    b.type || 'টার্ফ',
    b.amount,
    b.discountAmount || 0,
    b.couponCode || '-',
    b.totalAmount,
    b.paymentMethod,
    b.transactionId || '-',
    b.paymentSenderNumber || '-',
    b.paymentStatus,
    b.bookingStatus,
    new Date(b.createdAt).toLocaleString('bn-BD'),
    b.notes || '-'
  ]);

  const csvRows = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map(row => row.map(escapeCsvValue).join(','))
  ];

  const fileName = customFileName || `tomsom_turf_bookings_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCsvBlob(csvRows.join('\r\n'), fileName);
}

/**
 * Export Customer Database to Excel / CSV
 */
export function exportCustomersToExcel(customers: any[], customFileName?: string) {
  const headers = [
    'ক্রমিক (SL)',
    'গ্রাহকের নাম (Customer Name)',
    'মোবাইল নম্বর (Phone Number)',
    'ইমেইল (Email)',
    'মোট বুকিং সংখ্যা (Total Bookings)',
    'মোট ব্যয় (Total Spent BDT)',
    'সর্বশেষ ম্যাচ তারিখ (Last Booking Date)'
  ];

  const rows = customers.map((c, i) => [
    i + 1,
    c.name,
    c.phone,
    c.email || '-',
    c.totalBookings || 0,
    c.totalSpent || 0,
    c.lastBookingDate || '-'
  ]);

  const csvRows = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map(row => row.map(escapeCsvValue).join(','))
  ];

  const fileName = customFileName || `tomsom_turf_customers_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCsvBlob(csvRows.join('\r\n'), fileName);
}

/**
 * Export Financial & Revenue Report to Excel / CSV
 */
export function exportFinancialReportToExcel(reportData: any, bookings: Booking[], customFileName?: string) {
  const headers = [
    'বুকিং আইডি',
    'তারিখ',
    'স্লট',
    'গ্রাহক',
    'মোবাইল',
    'পেমেন্ট মাধ্যম',
    'Trx ID',
    'পেমেন্ট স্ট্যাটাস',
    'পরিমাণ (টাকা)'
  ];

  const rows = bookings
    .filter(b => b.paymentStatus === 'সফল' || b.bookingStatus === 'নিশ্চিত')
    .map(b => [
      b.id,
      b.bookingDate,
      b.slotTime,
      b.customerName,
      b.customerPhone,
      b.paymentMethod,
      b.transactionId || '-',
      b.paymentStatus,
      b.totalAmount
    ]);

  const totalSum = rows.reduce((acc, r) => acc + (Number(r[8]) || 0), 0);

  const csvRows = [
    ['টমছম ব্রিজ টার্ফ ও কিডস জোন — আয় ও রাজস্ব রিপোর্ট'].map(escapeCsvValue).join(','),
    [`রিপোর্ট তৈরির তারিখ: ${new Date().toLocaleDateString('bn-BD')}`].map(escapeCsvValue).join(','),
    [`সর্বমোট সংগৃহীত আয়: ৳ ${totalSum}`].map(escapeCsvValue).join(','),
    '',
    headers.map(escapeCsvValue).join(','),
    ...rows.map(row => row.map(escapeCsvValue).join(',')),
    '',
    ['', '', '', '', '', '', '', 'মোট আয়:', `৳ ${totalSum}`].map(escapeCsvValue).join(',')
  ];

  const fileName = customFileName || `tomsom_financial_report_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCsvBlob(csvRows.join('\r\n'), fileName);
}
