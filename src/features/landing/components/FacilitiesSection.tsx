import React from 'react';
import {
  Trophy,
  Lightbulb,
  DoorClosed,
  Bath,
  GlassWater,
  Cctv,
  Coffee,
  Car,
  Cross,
  Volume2,
  ShieldCheck,
  LucideProps,
} from 'lucide-react';
import { FacilitiesSectionProps } from '../landingTypes/facilities.types';

// Icon Mapping helper Component
const FacilityIcon: React.FC<{ iconName: string; className?: string }> = ({ iconName, className = 'w-6 h-6' }) => {
  const iconProps: LucideProps = { className };

  switch (iconName?.toLowerCase()) {
    case 'trophy':
      return <Trophy {...iconProps} />;
    case 'lightbulb':
      return <Lightbulb {...iconProps} />;
    case 'doorclosed':
      return <DoorClosed {...iconProps} />;
    case 'bath':
      return <Bath {...iconProps} />;
    case 'glasswater':
      return <GlassWater {...iconProps} />;
    case 'cctv':
      return <Cctv {...iconProps} />;
    case 'coffee':
      return <Coffee {...iconProps} />;
    case 'car':
      return <Car {...iconProps} />;
    case 'cross':
      return <Cross {...iconProps} />;
    case 'volume2':
      return <Volume2 {...iconProps} />;
    default:
      return <ShieldCheck {...iconProps} />;
  }
};

export const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({ facilities = [] }) => {
  return (
    <section id='facilities' className='py-20 bg-gray-50 border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center max-w-3xl mx-auto mb-16 space-y-3'>
          <span className='text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3.5 py-1.5 rounded-full inline-block'>
            আমাদের আয়োজন
          </span>
          <h2 className='text-3xl sm:text-4xl font-black text-gray-950'>আধুনিক সুযোগ-সুবিধা (World-Class Amenities)</h2>
          <p className='text-gray-600 text-base leading-relaxed'>
            খেলোয়াড় এবং দর্শকদের সর্বোচ্চ স্বাচ্ছন্দ্য ও নিরাপত্তা নিশ্চিত করতে আমরা রেখেছি প্রিমিয়াম সব
            সুযোগ-সুবিধা।
          </p>
        </div>

        {/* Facilities Bento Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {facilities?.map((fac) => (
            <div
              key={fac.id}
              className='bg-white p-6 rounded-2xl border border-gray-200 hover:border-red-600/50 hover:shadow-md transition-all space-y-3 group'
            >
              <div className='w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-200'>
                <FacilityIcon iconName={fac.iconName} />
              </div>
              <h3 className='text-base font-bold text-gray-950 group-hover:text-red-600 transition-colors'>
                {fac.title}
              </h3>
              <p className='text-xs text-gray-600 leading-relaxed'>{fac.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
