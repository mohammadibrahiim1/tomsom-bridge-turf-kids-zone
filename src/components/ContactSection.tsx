import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  ExternalLink, 
  Send, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import type { WebsiteSettings } from '../types';

interface ContactSectionProps {
  settings: WebsiteSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [formData, setFormData] = useState({ name: '', phone: '', subject: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setFormData({ name: '', phone: '', subject: '', message: '' });
      setIsSent(false);
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3.5 py-1.5 rounded-full">
            যোগাযোগ ও অবস্থান
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950">
            আমাদের সাথে যোগাযোগ করুন
          </h2>
          <p className="text-gray-600 text-base">
            যেকোনো তথ্য, টুর্নামেন্ট আয়োজন বা স্লট বুকিং সম্পর্কিত পরামর্শের জন্য সরাসরি যোগাযোগ করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Contact Cards & Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Institution Location Details */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="text-lg font-bold text-gray-950">
                টমছম ব্রিজ টার্ফ ও কিডস জোন
              </h3>

              <div className="space-y-3 text-xs text-gray-700">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-950 block text-sm">ঠিকানা:</strong>
                    <span>{settings.addressBn}</span>
                    <span className="block text-gray-500 mt-0.5">({settings.locationLandmark})</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-red-600 shrink-0" />
                  <div>
                    <strong className="text-gray-950 block text-sm">হটলাইন নম্বর:</strong>
                    <a href={`tel:${settings.phone}`} className="font-bold text-red-600 text-sm hover:underline">
                      {settings.phone}
                    </a>
                    {settings.phoneSecondary && (
                      <span className="text-gray-600 ml-2">| {settings.phoneSecondary}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="text-gray-950 block text-sm">হোয়াটসঅ্যাপ:</strong>
                    <a
                      href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-emerald-600 hover:underline"
                    >
                      {settings.whatsapp}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-red-600 shrink-0" />
                  <div>
                    <strong className="text-gray-950 block text-sm">ই-মেইল:</strong>
                    <span>{settings.email}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-red-600 shrink-0" />
                  <div>
                    <strong className="text-gray-950 block text-sm">টার্ফ খোলার সময়:</strong>
                    <span>সকাল ০৬:০০ AM - রাত ১২:০০ AM (প্রতিদিন)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <a
                  href={settings.googleMapDirectLink}
                  target="_blank"
                  rel="noreferrer"
                  id="contact-map-direct-btn"
                  className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm text-center flex items-center justify-center transition-colors"
                >
                  <MapPin className="w-4 h-4 mr-1.5" />
                  গুগল ম্যাপে যান
                </a>

                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm text-center flex items-center justify-center transition-colors"
                >
                  <MessageCircle className="w-4 h-4 mr-1.5" />
                  হোয়াটসঅ্যাপ চ্যাট
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Google Maps & Message Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Google Map Box */}
            <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-xs border border-gray-200 h-64 sm:h-72 relative">
              <iframe
                title="টমছম ব্রিজ টার্ফ ও কিডস জোন লোকেশন"
                src="https://maps.google.com/maps?q=Tomsom+Bridge+Cumilla&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 text-2xs font-bold text-gray-900 flex items-center">
                <MapPin className="w-3.5 h-3.5 text-red-600 mr-1" />
                মধ্য আশরাফপুর, মাজার গেট, কুমিল্লা
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="text-base font-bold text-gray-950">
                আমাদের সরাসরি মেসেজ পাঠান
              </h3>

              {isSent ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>ধন্যবাদ! আপনার বার্তাটি আমরা পেয়েছি। খুব দ্রুত যোগাযোগ করা হবে।</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">আপনার নাম *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl outline-hidden focus:border-red-600 font-semibold"
                        placeholder="আপনার পূর্ণ নাম"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">মোবাইল নম্বর *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-2.5 bg-white border border-gray-300 rounded-xl outline-hidden focus:border-red-600 font-semibold"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">বিষয়</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl outline-hidden focus:border-red-600"
                      placeholder="যেমন: টুর্নামেন্ট বুকিং বা কিডস জোন পার্টি"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">মেসেজ *</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl outline-hidden focus:border-red-600 resize-none"
                      placeholder="আপনার প্রশ্ন বা বার্তা বিস্তারিত লিখুন..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5 text-red-500" />
                    মেসেজ পাঠান
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
