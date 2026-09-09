import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, PlusCircle, List, Clock, CheckCircle2, AlertCircle, Trash2, Edit3 } from 'lucide-react';
import CreateSlotForm from '../components/CreateSlotForm';
import { Slot, TabType } from '../slotTypes/slot.types';

// Demo Slot List
const mockSlots: Slot[] = [
  { id: '1', startTime: '10:00 AM', endTime: '11:00 AM', price: 1200, status: 'Available', date: '2026-09-10' },
  { id: '2', startTime: '11:00 AM', endTime: '12:00 PM', price: 1200, status: 'Booked', date: '2026-09-10' },
  { id: '3', startTime: '04:00 PM', endTime: '05:00 PM', price: 1500, status: 'Available', date: '2026-09-10' },
  { id: '4', startTime: '06:00 PM', endTime: '07:00 PM', price: 1500, status: 'Maintenance', date: '2026-09-11' },
];

const SlotManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('create');
  const [slots, setSlots] = useState<Slot[]>(mockSlots);

  // Status Badge Styling Helper
  const getStatusBadge = (status: Slot['status']) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Booked':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Maintenance':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className='min-h-screen  text-slate-800 pb-12 antialiased'>
      {/* 1. Header with Sporty Dashboard Background */}
      <header className='relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-2xl'>
        {/* Background Decorative Grid Overlay */}
        <div className='absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none' />
        <div className='absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none' />
        <div className='absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none' />

        <div className='max-w-full mx-auto relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
          <div>
            <div className='inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-xs font-semibold text-indigo-300 mb-3 backdrop-blur-md'>
              <Calendar className='w-3.5 h-3.5' />
              <span>স্মার্ট সময় ও স্লট ব্যবস্থাপনা</span>
            </div>
            <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-white'>
              স্লট ম্যানেজমেন্ট ড্যাশবোর্ড
            </h1>
            <p className='mt-2 text-sm text-slate-300 max-w-xl'>
              নতুন খেলার সময় নির্ধারণ করুন, আগের স্লটগুলোর অবস্থা পর্যবেক্ষণ করুন এবং সহজ কন্ট্রোল প্যানেল থেকে সার্বিক
              সিডিউল পরিবর্তন করুন।
            </p>
          </div>

          {/* Quick Stats Summary */}
          <div className='flex items-center gap-3'>
            <div className='bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 rounded-md text-center min-w-[100px]'>
              <span className='block text-2xl font-black text-white'>{slots.length}</span>
              <span className='text-[11px] font-semibold text-slate-300 uppercase tracking-wider'>মোট স্লট</span>
            </div>
            <div className='bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 px-4 py-3 rounded-md text-center min-w-[100px]'>
              <span className='block text-2xl font-black text-emerald-400'>
                {slots.filter((s) => s.status === 'Available').length}
              </span>
              <span className='text-[11px] font-semibold text-emerald-300 uppercase tracking-wider'>ফাঁকা আছে</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Body Container with overlapping effect */}
      <main className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-6'>
        {/* Navigation Bar (Tabs) */}
        <div className='bg-white/90 backdrop-blur-md p-1.5 rounded-md shadow-lg border border-slate-200/80 flex items-center gap-2 max-w-md'>
          <button
            onClick={() => setActiveTab('create')}
            className={`relative flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              activeTab === 'create' ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {activeTab === 'create' && (
              <motion.div
                layoutId='activeTabIndicator'
                className='absolute inset-0 bg-indigo-50 border border-indigo-100 rounded-md'
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <PlusCircle className='w-4 h-4 z-10' />
            <span className='z-10'>নতুন স্লট তৈরি</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`relative flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              activeTab === 'list' ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {activeTab === 'list' && (
              <motion.div
                layoutId='activeTabIndicator'
                className='absolute inset-0 bg-indigo-50 border border-indigo-100 rounded-md'
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <List className='w-4 h-4 z-10' />
            <span className='z-10'>স্লট তালিকা ({slots.length})</span>
          </button>
        </div>

        {/* 3. Tab Contents with Framer Motion Animation */}
        <AnimatePresence mode='wait'>
          {activeTab === 'create' ? (
            <motion.div
              key='create-slot-form'
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className='bg-white p-6 sm:p-8'
            >
              <CreateSlotForm />
            </motion.div>
          ) : (
            <motion.div
              key='slot-list-view'
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className='bg-white border border-slate-200/80 rounded-md shadow-sm overflow-hidden'
            >
              <div className='p-6 border-b border-slate-100 flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-bold text-slate-900'>তৈরিকৃত স্লটের তালিকা</h3>
                  <p className='text-xs text-slate-500 font-medium'>
                    এডমিন প্যানেল থেকে সাম্প্রতিক সকল স্লটের বিস্তারিত
                  </p>
                </div>
              </div>

              {/* Desktop Table View */}
              <div className='hidden md:block overflow-x-auto'>
                <table className='w-full text-left border-collapse'>
                  <thead>
                    <tr className='bg-slate-50/80 border-b border-slate-100 text-[11px] uppercase font-extrabold text-slate-500 tracking-wider'>
                      <th className='p-4 pl-6'>তারিখ</th>
                      <th className='p-4'>সময়সূচি</th>
                      <th className='p-4'>মূল্য</th>
                      <th className='p-4'>স্ট্যাটাস</th>
                      <th className='p-4 pr-6 text-right'>অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-slate-100 text-xs font-semibold'>
                    {slots.map((slot) => (
                      <tr key={slot.id} className='hover:bg-slate-50/60 transition-colors'>
                        <td className='p-4 pl-6 font-bold text-slate-800 whitespace-nowrap'>
                          <div className='flex items-center gap-2'>
                            <Calendar className='w-4 h-4 text-indigo-600' />
                            {slot.date}
                          </div>
                        </td>
                        <td className='p-4 whitespace-nowrap'>
                          <div className='flex items-center gap-2 text-slate-700'>
                            <Clock className='w-4 h-4 text-slate-400' />
                            <span>
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                        </td>
                        <td className='p-4 font-black text-slate-900 whitespace-nowrap'>৳{slot.price}</td>
                        <td className='p-4 whitespace-nowrap'>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold border ${getStatusBadge(
                              slot.status,
                            )}`}
                          >
                            {slot.status === 'Available' && <CheckCircle2 className='w-3 h-3 mr-1 text-emerald-600' />}
                            {slot.status === 'Booked' && <AlertCircle className='w-3 h-3 mr-1 text-rose-600' />}
                            {slot.status}
                          </span>
                        </td>
                        <td className='p-4 pr-6 text-right whitespace-nowrap'>
                          <div className='flex items-center justify-end gap-2'>
                            <button
                              title='সম্পাদনা করুন'
                              className='p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer'
                            >
                              <Edit3 className='w-4 h-4' />
                            </button>
                            <button
                              title='মুছে ফেলুন'
                              className='p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Layout */}
              <div className='md:hidden divide-y divide-slate-100'>
                {slots.map((slot) => (
                  <div key={slot.id} className='p-5 space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span className='text-xs font-bold text-indigo-600 flex items-center gap-1.5'>
                        <Calendar className='w-3.5 h-3.5' /> {slot.date}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(
                          slot.status,
                        )}`}
                      >
                        {slot.status}
                      </span>
                    </div>

                    <div className='flex items-center justify-between text-xs pt-1'>
                      <div className='flex items-center gap-1.5 text-slate-700 font-bold'>
                        <Clock className='w-3.5 h-3.5 text-slate-400' />
                        {slot.startTime} - {slot.endTime}
                      </div>
                      <div className='font-black text-slate-900 text-sm'>৳{slot.price}</div>
                    </div>

                    <div className='flex justify-end gap-2 pt-2 border-t border-slate-50'>
                      <button className='px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg'>
                        এডিট
                      </button>
                      <button className='px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg'>
                        ডিলেট
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SlotManagement;
