"use client";
import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { createProductReview } from '@/lib/supabase-queries';

interface Props {
  productId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ productId, onSuccess }: Props) {
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
    <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-12 mb-20 max-w-4xl mx-auto shadow-sm">
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
  );
}
