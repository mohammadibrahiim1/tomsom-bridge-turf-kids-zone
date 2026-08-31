import React from 'react';
import { Trophy, Calendar, Clock, Award, Phone, Users, ShieldCheck } from 'lucide-react';
import type { TournamentEvent, WebsiteSettings } from '../types';

interface EventsSectionProps {
  events: TournamentEvent[];
  settings: WebsiteSettings;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ events, settings }) => {
  return (
    <section id="events" className="py-20 bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3.5 py-1.5 rounded-full">
            প্রতিযোগিতা ও টুর্নামেন্ট
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950">
            টুর্নামেন্ট ও বিশেষ ইভেন্ট
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            টমছম ব্রিজ টার্ফে অনুষ্ঠিতব্য আকর্ষণীয় ফুটবল টুর্নামেন্ট এবং আগের আসরগুলোর বিজয়ী তালিকা।
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200 flex flex-col justify-between"
            >
              {evt.posterImage && (
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={evt.posterImage}
                    alt={evt.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-md">
                    {evt.type}
                  </div>
                  <div className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full shadow-md ${
                    evt.registrationStatus === 'চলমান'
                      ? 'bg-emerald-600 text-white'
                      : evt.registrationStatus === 'আসন্ন'
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-800 text-gray-200'
                  }`}>
                    রেজিস্ট্রেশন: {evt.registrationStatus}
                  </div>
                </div>
              )}

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-950">{evt.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{evt.description}</p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-gray-700 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-red-600 shrink-0" />
                    <span>তারিখ: <strong>{evt.date}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-red-600 shrink-0" />
                    <span>সময়: <strong>{evt.time}</strong></span>
                  </div>
                  {evt.entryFee && (
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-red-600 shrink-0" />
                      <span>এন্ট্রি ফি: <strong>৳{evt.entryFee}</strong></span>
                    </div>
                  )}
                  {evt.prizeMoney && (
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4 text-red-600 shrink-0" />
                      <span>পুরস্কার: <strong className="text-red-600">{evt.prizeMoney}</strong></span>
                    </div>
                  )}
                </div>

                {evt.winner && (
                  <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs space-y-1">
                    <div className="font-bold text-red-900 flex items-center">
                      <Award className="w-4 h-4 mr-1 text-red-600" />
                      বিজয়ীদের নাম:
                    </div>
                    <div className="text-gray-700">🏆 চ্যাম্পিয়ন: <strong>{evt.winner}</strong></div>
                    {evt.runnerUp && <div className="text-gray-600">🥈 রানার্স আপ: {evt.runnerUp}</div>}
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="p-6 pt-0">
                <a
                  href={`tel:${settings.phone}`}
                  className="w-full inline-flex items-center justify-center py-2.5 px-4 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 mr-1.5 text-red-500" />
                  রেজিস্ট্রেশন বা তথ্যের জন্য কল করুন
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
