import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone } from 'lucide-react';
import { FAQSectionProps } from '../features/landing/landingTypes/faq.types';

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs = [], settings }) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id='faqs' className='py-20 bg-gray-50 border-b border-gray-200'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-12 space-y-3'>
          <span className='text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3.5 py-1.5 rounded-full inline-block'>
            সাধারণ জিজ্ঞাসা
          </span>
          <h2 className='text-3xl sm:text-4xl font-black text-gray-950'>প্রায়শই জিজ্ঞাসিত প্রশ্ন ও উত্তর (FAQ)</h2>
          <p className='text-gray-600 text-base'>
            টার্ফ বুকিং, কিডস জোন ও নিয়মাবলী সম্পর্কিত প্রচলিত কিছু প্রশ্নের সমাধান।
          </p>
        </div>

        {/* Accordion List */}
        <div className='space-y-3'>
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            const buttonId = `faq-btn-${faq.id}`;
            const panelId = `faq-panel-${faq.id}`;

            return (
              <div
                key={faq.id}
                className='bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs transition-all'
              >
                <button
                  id={buttonId}
                  type='button'
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleFAQ(faq.id)}
                  className='w-full p-5 text-left flex items-center justify-between font-bold text-gray-900 text-sm sm:text-base hover:text-red-600 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1'
                >
                  <div className='flex items-center space-x-3 pr-2'>
                    <HelpCircle className='w-5 h-5 text-red-600 shrink-0' />
                    <span>{faq.question}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-red-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    role='region'
                    aria-labelledby={buttonId}
                    className='px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50'
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need more help banner */}
        <div className='mt-10 p-5 bg-white rounded-2xl border border-gray-200 text-center space-y-2'>
          <p className='text-xs font-bold text-gray-800'>অন্য কোনো প্রশ্ন বা সহায়তার প্রয়োজন?</p>
          <div className='flex items-center justify-center space-x-4'>
            <a
              href={`tel:${settings?.phone}`}
              className='inline-flex items-center text-xs font-bold text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded-sm'
            >
              <Phone className='w-3.5 h-3.5 mr-1' />
              কল করুন: {settings?.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
