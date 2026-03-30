"use client";
import React, { useState } from 'react';
import { Star, Send, X, LogIn, UserPlus } from 'lucide-react';
import { createProductReview } from '@/lib/supabase-queries';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

interface Props {
  productId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ productId, onSuccess }: Props) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleInteraction = (e: React.MouseEvent | React.FocusEvent) => {
    if (!user) {
      e.preventDefault();
      e.stopPropagation();
      setShowAuthModal(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const ok = await createProductReview({
      product_id: productId,
      user_name: name,
      rating,
      comment
    });

    if (ok) {
      setMessage({ type: 'success', text: 'Thank you! Your review has been submitted.' });
      setName('');
      setComment('');
      setRating(5);
      if (onSuccess) onSuccess();
    } else {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="relative bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-12 mb-20 max-w-4xl mx-auto shadow-sm">
      <div 
        className={!user ? "cursor-pointer" : ""}
        onClickCapture={handleInteraction}
      >
        <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">Leave a Review</h2>
        <p className="text-gray-500 text-sm">Share your experience with this premium cut.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 block text-center">Your Rating</label>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className="transition-transform active:scale-90"
              >
                <Star 
                  size={32} 
                  className={s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Input Name */}
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Your Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full bg-white border border-gray-200 px-6 py-4 rounded-xl focus:outline-none focus:border-black transition-colors"
            required
          />
        </div>

        {/* Textarea */}
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Your Comments</label>
          <textarea 
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you think of the tenderness and flavor?"
            className="w-full bg-white border border-gray-200 px-6 py-4 rounded-xl focus:outline-none focus:border-black transition-colors resize-none"
            required
          />
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-xl text-center text-sm font-bold ${
            message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-accent'
          }`}>
            {message.text}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-accent w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send size={18} />
              SUBMIT REVIEW
            </>
          )}
        </button>
      </form>
    </div>

      {/* Auth Prompt Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 md:p-10 max-w-md w-full shadow-2xl relative animate-in zoom-in slide-in-from-bottom-4 duration-300">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent animate-pulse">
                <LogIn size={32} />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Login Required</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                To leave a product review, please login or register for a GMGP account.
              </p>
              
              <div className="space-y-3">
                <Link 
                  href="/login" 
                  className="btn-accent w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-transform active:scale-95"
                >
                  <LogIn size={18} />
                  LOGIN TO MY ACCOUNT
                </Link>
                <Link 
                  href="/register" 
                  className="w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-gray-400 hover:text-black transition-colors"
                >
                  <UserPlus size={18} />
                  REGISTER NEW ACCOUNT
                </Link>
              </div>
              
              <button 
                onClick={() => setShowAuthModal(false)}
                className="mt-6 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
