import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, PlusCircle, List } from 'lucide-react';
import CreateSlotForm from '../components/CreateSlotForm';
import { SlotTable } from '../components/SlotTable';
import { TabType } from '../slotTypes/slot.types';
import { useGetAllSlotsQuery } from '../service/slotApi/slotApi';

const SlotManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('list');

  
  const { data: response, isLoading, isError, error } = useGetAllSlotsQuery({});
  const slots = response?.data || [];

  return (
    <div className='min-h-screen text-slate-800 pb-12 antialiased'>
      {/* Header Section */}
      <header className='relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden shadow-2xl'>
        <div className='max-w-full mx-auto relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
          <div>
            <div className='inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/35 rounded-full text-xs font-semibold text-indigo-300 mb-3 backdrop-blur-md'>
              <Calendar className='w-3.5 h-3.5' />
              <span>স্মার্ট সময় ও স্লট ব্যবস্থাপনা</span>
            </div>
            <h1 className='text-3xl sm:text-4xl font-extrabold tracking-tight text-white'>
              স্লট ম্যানেজমেন্ট ড্যাশবোর্ড
            </h1>
            <p className='mt-2 text-sm text-slate-300 max-w-xl'>
              নতুন খেলার সময় নির্ধারণ করুন, আগের স্লটগুলোর অবস্থা পর্যবেক্ষণ করুন এবং সহজ কন্ট্রোল প্যানেল থেকে সার্বিক সিডিউল পরিবর্তন করুন।
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <div className='bg-white/10 backdrop-blur-md border border-white/10 px-4 py-3 rounded-md text-center min-w-[100px]'>
              <span className='block text-2xl font-black text-white'>{slots.length}</span>
              <span className='text-[11px] font-semibold text-slate-300 uppercase tracking-wider'>মোট স্লট</span>
            </div>
            <div className='bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 px-4 py-3 rounded-md text-center min-w-[100px]'>
              <span className='block text-2xl font-black text-emerald-400'>
                {slots?.filter((slot) => slot?.status === 'AVAILABLE')?.length}
              </span>
              <span className='text-[11px] font-semibold text-emerald-300 uppercase tracking-wider'>ফাঁকা আছে</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className='max-w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-6'>
        {/* Navigation Tabs */}
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

        {/* Tab Contents */}
        <AnimatePresence mode='wait'>
          {activeTab === 'create' ? (
            <motion.div
              key='create-slot-form'
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className='bg-white p-6 sm:p-8 rounded-md shadow-sm border border-slate-200/80'
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
            >
              {/* TanStack Table Component */}
              <SlotTable 
                data={slots} 
                isLoading={isLoading} 
                isError={isError} 
                errorMessage={(error as any)?.data?.message}
                meta={response?.meta}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SlotManagement;