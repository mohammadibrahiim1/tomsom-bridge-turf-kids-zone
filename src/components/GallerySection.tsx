import React, { useState } from 'react';
import { Image as ImageIcon, X, ZoomIn } from 'lucide-react';
import type { GalleryItem } from '../types';

interface GallerySectionProps {
  gallery?: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const categories = ['All', 'টার্ফ', 'কিডস জোন', 'নাইট ম্যাচ', 'টুর্নামেন্ট'];

  const filteredItems = gallery?.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  return (
    <section id='gallery' className='py-20 bg-white border-b border-gray-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center max-w-3xl mx-auto mb-12 space-y-3'>
          <span className='text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3.5 py-1.5 rounded-full'>
            ছবির অ্যালবাম
          </span>
          <h2 className='text-3xl sm:text-4xl font-black text-gray-950'>টার্ফ ও কিডস জোনের স্থিরচিত্র</h2>
          <p className='text-gray-600 text-base'>
            আমাদের মনোরম খেলার মাঠ, রাতের রোমাঞ্চ এবং শিশুদের হাসিমাখা মুহূর্তগুলো একনজরে দেখুন।
          </p>
        </div>

        {/* Category Filters */}
        <div className='flex flex-wrap justify-center gap-2 mb-10'>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat === 'All' ? 'সব ছবি' : cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {filteredItems?.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className='group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer aspect-4/3 bg-gray-100'
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                loading='lazy'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white'>
                <span className='text-xs font-bold text-red-400 uppercase tracking-wide'>{item.category}</span>
                <span className='text-sm font-bold truncate'>{item.title}</span>
                <div className='absolute top-3 right-3 bg-black/60 p-1.5 rounded-full'>
                  <ZoomIn className='w-4 h-4 text-white' />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeImage && (
          <div className='fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4'>
            <div className='relative max-w-4xl w-full'>
              <button
                onClick={() => setActiveImage(null)}
                className='absolute -top-12 right-0 text-white hover:text-red-500 p-2 cursor-pointer'
              >
                <X className='w-8 h-8' />
              </button>
              <img
                src={activeImage.imageUrl}
                alt={activeImage.title}
                className='w-full max-h-[80vh] object-contain rounded-2xl'
              />
              <div className='mt-3 text-center text-white'>
                <span className='text-xs text-red-400 font-bold uppercase tracking-wider block'>
                  {activeImage.category}
                </span>
                <h4 className='text-lg font-bold'>{activeImage.title}</h4>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
