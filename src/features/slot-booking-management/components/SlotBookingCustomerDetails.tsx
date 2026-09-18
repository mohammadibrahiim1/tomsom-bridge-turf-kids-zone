import { User, Phone, Mail } from 'lucide-react';

interface SlotBookingCustomerDetailsProps {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  specialNotes: string;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onNotesChange: (v: string) => void;
}

export const SlotBookingCustomerDetails = ({
  customerName,
  customerPhone,
  customerEmail,
  specialNotes,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  onNotesChange,
}: SlotBookingCustomerDetailsProps) => (
  <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 space-y-4">
    <h3 className="text-base font-bold text-gray-950 flex items-center">
      <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs mr-2 font-black">
        ৩
      </span>
      গ্রাহকের তথ্য (Customer Details)
    </h3>

    <div className="space-y-3">
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
          পূর্ণ নাম *
        </label>
        <div className="relative">
          <input
            type="text"
            id="customer-name-input"
            required
            placeholder="আপনার নাম লিখুন"
            value={customerName}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 focus:border-red-600 rounded-md text-sm font-semibold text-gray-900 outline-hidden"
          />
          <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
          মোবাইল নম্বর * (১১ ডিজিট)
        </label>
        <div className="relative">
          <input
            type="tel"
            id="customer-phone-input"
            required
            placeholder="01819XXXXXX"
            value={customerPhone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 focus:border-red-600 rounded-md text-sm font-semibold text-gray-900 outline-hidden"
          />
          <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
          ই-মেইল (ঐচ্ছিক)
        </label>
        <div className="relative">
          <input
            type="email"
            id="customer-email-input"
            placeholder="example@mail.com"
            value={customerEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 focus:border-red-600 rounded-md text-sm font-semibold text-gray-900 outline-hidden"
          />
          <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
          বিশেষ অনুরোধ বা নোট (ঐচ্ছিক)
        </label>
        <textarea
          rows={2}
          id="customer-notes-input"
          placeholder="যেমন: বল বা বিবস প্রয়োজন"
          value={specialNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full p-2.5 bg-gray-50 border border-gray-300 focus:border-red-600 rounded-md text-xs text-gray-900 outline-hidden resize-none"
        />
      </div>
    </div>
  </div>
);