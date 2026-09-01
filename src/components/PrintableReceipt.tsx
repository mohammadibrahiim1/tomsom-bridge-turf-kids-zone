import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Download, Printer, ShieldCheck, CheckCircle2, QrCode, MessageCircle, Copy, Check } from 'lucide-react';
import type { Booking, WebsiteSettings } from '../types';

interface PrintableReceiptProps {
  booking?: Booking;
  settings?: WebsiteSettings;
}

export const PrintableReceipt: React.FC<PrintableReceiptProps> = ({ booking, settings }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const headerTitle = settings?.receiptHeaderTitle || settings?.websiteNameEn || 'TOMSOM BRIDGE TURF & KIDS ZONE';
      const headerSubtitle =
        settings?.receiptHeaderSubtitle ||
        settings?.addressEn ||
        'Madhya Ashrafpur, Mazar Gate (Near Tomsom Bridge), Cumilla';
      const contactInfo = settings?.receiptContactText || `Phone: ${settings?.phone} | Web: ${settings?.websiteNameEn}`;
      const issueDate = booking?.createdAt ? new Date(booking.createdAt) : new Date();

      // Simple clean vector PDF rendering
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(220, 38, 38); // Red
      doc.text(headerTitle, 105, 20, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(headerSubtitle, 105, 26, { align: 'center' });
      doc.text(contactInfo, 105, 31, { align: 'center' });

      doc.setDrawColor(220, 38, 38);
      doc.setLineWidth(0.8);
      doc.line(15, 36, 195, 36);

      // Voucher Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('OFFICIAL BOOKING RECEIPT / VOUCHER', 105, 45, { align: 'center' });

      // Booking ID Box
      doc.setFillColor(245, 245, 245);
      doc.rect(15, 50, 180, 12, 'F');
      doc.setFontSize(11);
      doc.setTextColor(220, 38, 38);
      doc.text(`BOOKING ID: ${booking?.id}`, 20, 58);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(
        `Date of Issue: ${booking?.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}`,
        190,
        58,
        { align: 'right' },
      );

      // Customer Info
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text('CUSTOMER INFORMATION', 15, 72);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(`Name: ${booking?.customerName}`, 15, 80);
      doc.text(`Phone: ${booking?.customerPhone}`, 15, 86);
      if (booking?.customerEmail) {
        doc.text(`Email: ${booking?.customerEmail}`, 15, 92);
      }

      // Slot & Match Info
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text('SLOT & MATCH DETAILS', 115, 72);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(`Match Date: ${booking?.bookingDate}`, 115, 80);
      doc.text(`Time Slot: ${booking?.slotTime}`, 115, 86);
      doc.text(`Duration: 55 min play + 5 min transition`, 115, 92);

      // Financials Table
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(240, 240, 240);
      doc.rect(15, 105, 180, 10, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('DESCRIPTION', 20, 111);
      doc.text('AMOUNT (BDT)', 185, 111, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.text(`Turf Ground Booking (${booking?.slotTime})`, 20, 122);
      doc.text(`Tk. ${booking?.amount}`, 185, 122, { align: 'right' });

      if ((booking?.discountAmount ?? 0) > 0) {
        doc.text(`Discount (Coupon: ${booking?.couponCode || 'PROMO'})`, 20, 128);
        doc.text(`- Tk. ${booking?.discountAmount ?? 0}`, 185, 128, { align: 'right' });
      }

      doc.setLineWidth(0.4);
      doc.line(15, 134, 195, 134);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(220, 38, 38);
      doc.text('TOTAL PAYABLE:', 20, 142);
      doc.text(`Tk. ${booking?.totalAmount}`, 185, 142, { align: 'right' });

      // Payment Details
      doc.setFillColor(248, 248, 248);
      doc.rect(15, 150, 180, 25, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('PAYMENT DETAILS', 20, 157);

      doc.setFont('helvetica', 'normal');
      doc.text(`Method: ${booking?.paymentMethod}`, 20, 164);
      doc.text(`Status: ${booking?.paymentStatus}`, 20, 170);

      if (booking?.transactionId) {
        doc.text(`TrxID: ${booking?.transactionId}`, 100, 164);
      }
      doc.text(`Booking Status: ${booking?.bookingStatus}`, 100, 170);

      // Rules & Conditions
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text('TERMS & GROUND RULES:', 15, 186);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(90, 90, 90);
      const defaultRules = [
        '1. Please arrive at the turf 15 minutes before your scheduled slot time.',
        '2. Strictly turf boots / flat sneakers allowed. Hard metal studs or bare feet are prohibited.',
        '3. Smoking, betel leaf (paan), and outside food/drinks inside the turf are strictly prohibited.',
        '4. Cancellation must be notified at least 3 days prior. Non-refundable within 3 days.',
        '5. Management reserves the right to enforce disciplinary rules inside the facility.',
      ];
      const rulesToUse =
        settings?.receiptFooterRules && settings?.receiptFooterRules.length > 0
          ? settings?.receiptFooterRules
          : defaultRules;

      let y = 192;
      rulesToUse.forEach((rule, idx) => {
        const lineText = rule.startsWith(`${idx + 1}.`) ? rule : `${idx + 1}. ${rule}`;
        doc.text(lineText, 15, y);
        y += 5.5;
      });

      // Signature & Stamp
      doc.line(140, 245, 185, 245);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Authorized Signature', 162.5, 250, { align: 'center' });
      doc.text(settings?.receiptAuthorizedSealText || headerTitle, 162.5, 254, { align: 'center' });

      // Footer
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(
        settings?.receiptFooterNote || 'Thank you for choosing Tomsom Bridge Turf & Kids Zone. Enjoy your match!',
        105,
        280,
        { align: 'center' },
      );

      doc.save(`TomsomTurf_Receipt_${booking?.id}.pdf`);
    } catch (e) {
      console.error('Error generating PDF:', e);
      window.print();
    }
  };

  const handleCopyText = () => {
    const textReceipt = `====================================
🧾 টমছম ব্রিজ টার্ফ ও কিডস জোন — অফিসিয়াল রসিদ
====================================
বুকিং আইডি: ${booking?.id}
তারিখ: ${booking?.bookingDate}
সময় স্লট: ${booking?.slotTime} (${booking?.slotDuration})
গ্রাহকের নাম: ${booking?.customerName}
মোবাইল: ${booking?.customerPhone}
মোট ভাড়া: ৳${booking?.totalAmount}
পেমেন্ট মাধ্যম: ${booking?.paymentMethod}
পেমেন্ট স্ট্যাটাস: ${booking?.paymentStatus}
বুকিং স্ট্যাটাস: ${booking?.bookingStatus}
${booking?.transactionId ? `TrxID: ${booking?.transactionId}\n` : ''}ঠিকানা: ${settings?.addressBn}
হটলাইন: ${settings?.phone}
====================================`;
    navigator.clipboard.writeText(textReceipt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`*টমছম ব্রিজ টার্ফ ও কিডস জোন — বুকিং রসিদ*
বুকিং আইডি: ${booking?.id}
তারিখ: ${booking?.bookingDate}
স্লট: ${booking?.slotTime}
গ্রাহক: ${booking?.customerName}
মোবাইল: ${booking?.customerPhone}
মোট প্রদেয়: ৳${booking?.totalAmount} (${booking?.paymentStatus})
বুকিং অবস্থা: ${booking?.bookingStatus}
লোকেশন: ${settings?.addressBn}
হটলাইন: ${settings?.phone}`);
    const phoneClean = booking?.customerPhone?.replace(/\D/g, '');
    const waUrl =
      phoneClean && phoneClean.length >= 10
        ? `https://wa.me/88${phoneClean.startsWith('88') ? phoneClean.slice(2) : phoneClean.startsWith('0') ? phoneClean.slice(1) : phoneClean}?text=${text}`
        : `https://wa.me/?text=${text}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className='bg-white p-6 sm:p-8 max-w-3xl mx-auto printable-area border border-gray-200 rounded-2xl shadow-sm'>
      {/* Top Action buttons in on-screen view */}
      <div className='flex flex-wrap items-center justify-between gap-2 mb-6 no-print border-b pb-4'>
        <div className='text-xs font-bold text-gray-700'>রসিদ অ্যাকশন ও শেয়ারিং</div>
        <div className='flex flex-wrap items-center gap-2'>
          <button
            id='btn-copy-receipt'
            onClick={handleCopyText}
            className='inline-flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer border border-gray-200'
            title='মেমো কপি করুন'
          >
            {isCopied ? (
              <Check className='w-3.5 h-3.5 mr-1 text-emerald-600' />
            ) : (
              <Copy className='w-3.5 h-3.5 mr-1 text-gray-600' />
            )}
            {isCopied ? 'কপি হয়েছে!' : 'রসিদ টেক্সট কপি'}
          </button>

          <button
            id='btn-whatsapp-receipt'
            onClick={handleShareWhatsApp}
            className='inline-flex items-center px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer'
            title='গ্রাহককে হোয়াটসঅ্যাপে পাঠান'
          >
            <MessageCircle className='w-3.5 h-3.5 mr-1' />
            হোয়াটসঅ্যাপে পাঠান
          </button>

          <button
            id='btn-download-pdf-receipt'
            onClick={handleDownloadPDF}
            className='inline-flex items-center px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer'
          >
            <Download className='w-3.5 h-3.5 mr-1' />
            PDF ডাউনলোড
          </button>

          <button
            id='btn-print-receipt'
            onClick={handlePrint}
            className='inline-flex items-center px-3.5 py-2 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer'
          >
            <Printer className='w-3.5 h-3.5 mr-1 text-red-400' />
            প্রিন্ট
          </button>
        </div>
      </div>

      {/* Official Receipt Content */}
      <div className='space-y-6 text-gray-900'>
        {/* Brand Header */}
        <div className='text-center space-y-1 pb-4 border-b-2 border-red-600'>
          <div className='inline-block px-3 py-1 bg-red-600 text-white font-black text-xs rounded-full uppercase tracking-wider mb-1'>
            অফিসিয়াল বুকিং ভাউচার / রসিদ
          </div>
          <h2 className='text-2xl sm:text-3xl font-black text-gray-950'>
            {settings?.websiteNameBn || 'টমছম ব্রিজ টার্ফ ও কিডস জোন'}
          </h2>
          <p className='text-xs font-semibold text-red-600 tracking-wide'>
            {settings?.receiptHeaderTitle || settings?.websiteNameEn || 'TOMSOM BRIDGE TURF & KIDS ZONE'}
          </p>
          <p className='text-xs text-gray-600'>
            {settings?.receiptHeaderSubtitle || settings?.addressBn} | মোবাইল: {settings?.phone}
          </p>
        </div>

        {/* Voucher Meta Info Bar */}
        <div className='grid grid-cols-2 bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs'>
          <div>
            <span className='text-gray-500 block font-medium'>বুকিং আইডি (Booking ID):</span>
            <span className='font-mono font-black text-sm text-red-600'>{booking?.id}</span>
          </div>
          <div className='text-right'>
            <span className='text-gray-500 block font-medium'>ইস্যুর তারিখ ও সময়:</span>
            <span className='font-semibold text-gray-800'>
              {booking?.createdAt &&
                new Date(booking.createdAt).toLocaleString('bn-BD', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
            </span>
          </div>
        </div>

        {/* Two Column details: Customer & Match */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs'>
          {/* Customer Details */}
          <div className='bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2'>
            <h4 className='font-bold text-gray-950 uppercase border-b border-gray-200 pb-1 flex items-center'>
              <span className='w-2 h-2 rounded-full bg-red-600 mr-2' />
              গ্রাহকের বিবরণ
            </h4>
            <div className='space-y-1.5 text-gray-700'>
              <div className='flex justify-between'>
                <span className='text-gray-500'>নাম:</span>
                <span className='font-bold text-gray-950'>{booking?.customerName}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-500'>মোবাইল:</span>
                <span className='font-bold font-mono text-gray-950'>{booking?.customerPhone}</span>
              </div>
              {booking?.customerEmail && (
                <div className='flex justify-between'>
                  <span className='text-gray-500'>ই-মেইল:</span>
                  <span>{booking?.customerEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Match & Slot Details */}
          <div className='bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2'>
            <h4 className='font-bold text-gray-950 uppercase border-b border-gray-200 pb-1 flex items-center'>
              <span className='w-2 h-2 rounded-full bg-red-600 mr-2' />
              খেলার স্লট ও সময়সূচি
            </h4>
            <div className='space-y-1.5 text-gray-700'>
              <div className='flex justify-between'>
                <span className='text-gray-500'>খেলার তারিখ:</span>
                <span className='font-bold text-gray-950'>{booking?.bookingDate}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-500'>খেলার সময়:</span>
                <span className='font-bold text-red-600'>{booking?.slotTime}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-500'>সময়সীমা:</span>
                <span>{booking?.slotDuration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Financial Breakdown */}
        <div className='border border-gray-200 rounded-xl overflow-hidden text-xs'>
          <table className='w-full text-left'>
            <thead className='bg-gray-900 text-white font-bold'>
              <tr>
                <th className='p-3'>বিবরণ</th>
                <th className='p-3 text-center'>সময়কাল</th>
                <th className='p-3 text-right'>পরিমাণ (টাকা)</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              <tr>
                <td className='p-3 font-semibold text-gray-900'>টার্ফ গ্রাউন্ড ভাড়া ({booking?.slotTime})</td>
                <td className='p-3 text-center text-gray-600'>১ ঘণ্টা (৬০ মিনিট)</td>
                <td className='p-3 text-right font-bold text-gray-900'>৳{booking?.amount}</td>
              </tr>
              {(booking?.discountAmount ?? 0) > 0 && (
                <tr className='bg-emerald-50 text-emerald-800'>
                  <td className='p-3 font-semibold'>কুপন ডিসকাউন্ট ({booking?.couponCode || 'PROMO'})</td>
                  <td className='p-3 text-center'>-</td>
                  <td className='p-3 text-right font-bold'>- ৳{booking?.discountAmount ?? 0}</td>
                </tr>
              )}
              <tr className='bg-gray-100 font-bold text-sm text-gray-950'>
                <td colSpan={2} className='p-3 text-right'>
                  সর্বমোট প্রদেয়:
                </td>
                <td className='p-3 text-right text-red-600 font-black text-base'>৳{booking?.totalAmount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment & Booking Status Box */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs'>
          <div>
            <div className='text-gray-500'>পেমেন্ট মাধ্যম:</div>
            <div className='font-bold text-gray-900 text-sm'>{booking?.paymentMethod}</div>
            {booking?.transactionId && (
              <div className='text-gray-600 mt-1'>
                TrxID: <span className='font-mono font-bold text-gray-950'>{booking?.transactionId}</span>
              </div>
            )}
          </div>

          <div className='sm:text-right space-y-1'>
            <div>
              <span className='text-gray-500 mr-2'>পেমেন্ট স্ট্যাটাস:</span>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                  booking?.paymentStatus === 'সফল'
                    ? 'bg-emerald-100 text-emerald-800'
                    : booking?.paymentStatus === 'অপেক্ষমাণ'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {booking?.paymentStatus}
              </span>
            </div>

            <div>
              <span className='text-gray-500 mr-2'>বুকিং স্ট্যাটাস:</span>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                  booking?.bookingStatus === 'নিশ্চিত'
                    ? 'bg-emerald-100 text-emerald-800'
                    : booking?.bookingStatus === 'অপেক্ষমাণ'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                }`}
              >
                {booking?.bookingStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Rules & Guidelines */}
        <div className='p-4 bg-red-50/60 rounded-xl border border-red-200 text-2xs sm:text-xs text-gray-700 space-y-1.5'>
          <div className='font-bold text-red-700 uppercase flex items-center'>
            <ShieldCheck className='w-3.5 h-3.5 mr-1' />
            টার্ফ নিয়মাবলী ও নির্দেশিকা:
          </div>
          <ul className='list-disc list-inside space-y-0.5 text-gray-600'>
            {settings?.receiptFooterRules && settings?.receiptFooterRules.length > 0 ? (
              settings.receiptFooterRules.map((r, i) => <li key={i}>{r}</li>)
            ) : (
              <>
                <li>খেলার নির্ধারিত সময়ের কমপক্ষে ১৫ মিনিট পূর্বে মাঠে উপস্থিত হতে হবে।</li>
                <li>
                  টার্ফে অবশ্যই উপযুক্ত টার্ফ বুট অথবা সাধারণ স্নিকার্স পরতে হবে। ব্লেড বুট/খালি পায়ে খেলা নিষিদ্ধ।
                </li>
                <li>টার্ফের ভিতরে ধূমপান, পান-সুপারি খাওয়া সম্পূর্ণ নিষিদ্ধ।</li>
                <li>বাতিল নীতিমালা: ম্যাচ শুরুর কমপক্ষে ৩ দিন (৭২ ঘণ্টা) পূর্বে কর্তৃপক্ষের সাথে যোগাযোগ করতে হবে।</li>
              </>
            )}
          </ul>
        </div>

        {/* Seal & Signature Line */}
        <div className='pt-6 flex justify-between items-end text-xs'>
          <div className='flex items-center space-x-2 text-gray-400'>
            <QrCode className='w-10 h-10 text-gray-700' />
            <span className='text-3xs leading-tight text-gray-600'>
              অনলাইন ভেরিফায়েড বুকিং
              <br />
              {settings?.websiteNameBn || 'টমছম ব্রিজ টার্ফ'}
            </span>
          </div>

          <div className='text-center'>
            <div className='w-44 border-b border-gray-400 mb-1' />
            <span className='font-semibold text-gray-800 text-2xs block'>
              {settings?.receiptAuthorizedSealText || 'অনুমোদিত স্বাক্ষর ও সিল'}
            </span>
            <span className='text-gray-500 text-3xs'>কর্তৃপক্ষ, {settings?.websiteNameBn}</span>
          </div>
        </div>

        {/* Bottom Thank you note */}
        <div className='text-center pt-2 text-3xs text-gray-500 italic'>
          {settings?.receiptFooterNote || 'ধন্যবাদ! টমছম ব্রিজ টার্ফ ও কিডস জোনে আপনাকে স্বাগতম।'}
        </div>
      </div>
    </div>
  );
};
