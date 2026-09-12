import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2, User, Send, Loader2 } from 'lucide-react';
// import { api } from '../../../services/api';
import { ReviewsSectionProps } from '../landingTypes/reviews.types';

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews = [] }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // const res = await api.submitReview({
      //   customerName: name.trim(),
      //   rating,
      //   comment: comment.trim(),
      //   userPhone: phone.trim(),
      // });

      // if (res.success) {
      //   setSuccessMessage(res.message || 'আপনার মতামতের জন্য ধন্যবাদ! পর্যালোচনার পর এটি প্রদর্শিত হবে।');
      //   setName('');
      //   setPhone('');
      //   setComment('');
      //   setRating(5);

      //   setTimeout(() => {
      //     setShowReviewForm(false);
      //     setSuccessMessage(null);
      //   }, 3000);
      // } else {
      //   setErrorMessage(res.message || 'সাবমিট করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      // }
    } catch (err) {
      setErrorMessage('একটি অপ্রত্যাশিত সমস্যা দেখা দিয়েছে। অনুগ্রহ করে পরে চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id='reviews' className='py-20 bg-gray-50 border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center max-w-3xl mx-auto mb-12 space-y-3'>
          <span className='text-xs font-black uppercase tracking-widest text-red-600 bg-red-50 px-3.5 py-1.5 rounded-full inline-block'>
            গ্রাহকের সন্তুষ্টি
          </span>
          <h2 className='text-3xl sm:text-4xl font-black text-gray-950'>খেলোয়াড় ও অভিভাবকদের মতামত</h2>
          <p className='text-gray-600 text-base'>
            টমছম ব্রিজ টার্ফে খেলে ও কিডস জোনে এসে সম্মানিত গ্রাহকদের অভিজ্ঞতা ও অনুভূতি।
          </p>
        </div>

        {/* Top CTA to write review */}
        <div className='text-center mb-10'>
          <button
            type='button'
            onClick={() => {
              setShowReviewForm(!showReviewForm);
              setErrorMessage(null);
            }}
            className='inline-flex items-center px-5 py-2.5 bg-black hover:bg-gray-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer'
          >
            <MessageSquarePlus className='w-4 h-4 mr-2 text-red-500' />
            {showReviewForm ? 'ফর্ম বন্ধ করুন' : 'আপনার মতামত / রিভিউ দিন'}
          </button>
        </div>

        {/* Submit Review Form */}
        {showReviewForm && (
          <div className='max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-12 space-y-4'>
            <h3 className='text-base font-bold text-gray-950'>আপনার খেলার অভিজ্ঞতা শেয়ার করুন</h3>

            {successMessage ? (
              <div className='p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center space-x-2'>
                <CheckCircle2 className='w-5 h-5 text-emerald-600 shrink-0' />
                <span>{successMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-3 text-xs'>
                {errorMessage && (
                  <div className='p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold'>
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label htmlFor='review-name' className='block font-bold text-gray-700 mb-1'>
                    আপনার নাম *
                  </label>
                  <input
                    id='review-name'
                    type='text'
                    required
                    placeholder='যেমন: তানভীর আহমেদ'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='w-full p-2.5 bg-gray-50 border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-100 rounded-xl outline-none transition-all'
                  />
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  <div>
                    <label htmlFor='review-phone' className='block font-bold text-gray-700 mb-1'>
                      মোবাইল নম্বর (গোপন থাকবে)
                    </label>
                    <input
                      id='review-phone'
                      type='tel'
                      placeholder='01XXXXXXXXX'
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className='w-full p-2.5 bg-gray-50 border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-100 rounded-xl outline-none transition-all'
                    />
                  </div>

                  <div>
                    <span className='block font-bold text-gray-700 mb-1'>রেটিং</span>
                    <div className='flex items-center space-x-1 pt-1'>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type='button'
                          onClick={() => setRating(star)}
                          className='p-1 hover:scale-110 transition-transform cursor-pointer'
                          aria-label={`${star} Star Rating`}
                        >
                          <Star
                            className={`w-5 h-5 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor='review-comment' className='block font-bold text-gray-700 mb-1'>
                    আপনার মন্তব্য *
                  </label>
                  <textarea
                    id='review-comment'
                    rows={3}
                    required
                    placeholder='টার্ফের ঘাস, আলো এবং পরিবেশ সম্পর্কে লিখুন...'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className='w-full p-2.5 bg-gray-50 border border-gray-300 focus:border-red-600 focus:ring-2 focus:ring-red-100 rounded-xl outline-none resize-none transition-all'
                  />
                </div>

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-red-600/20 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50'
                >
                  {isSubmitting ? (
                    <Loader2 className='w-4 h-4 animate-spin' />
                  ) : (
                    <>
                      <Send className='w-3.5 h-3.5 mr-1.5' />
                      <span>মতামত সাবমিট করুন</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Reviews Cards Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className='bg-white p-6 rounded-2xl shadow-xs border border-gray-200 space-y-3 flex flex-col justify-between hover:border-red-300 transition-colors'
            >
              <div className='space-y-2'>
                <div className='flex items-center space-x-1'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <p className='text-xs text-gray-700 italic leading-relaxed'>"{rev.comment}"</p>
              </div>

              <div className='pt-3 border-t border-gray-100 flex items-center justify-between text-xs'>
                <div className='flex items-center space-x-2'>
                  <div className='w-7 h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-2xs'>
                    <User className='w-4 h-4' />
                  </div>
                  <span className='font-bold text-gray-900'>{rev.customerName}</span>
                </div>
                {rev.date && <span className='text-2xs text-gray-400'>{rev.date}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
