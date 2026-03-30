"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { ProductReview } from '@/lib/types';

interface Props {
  reviews: ProductReview[];
}

export default function ReviewSlider({ reviews }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const shouldScroll = reviews.length >= 3;

  useEffect(() => {
    if (!shouldScroll || isPaused || isDragging) return;

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollWidth = scrollContainer.scrollWidth;
    
    const interval = setInterval(() => {
      scrollContainer.scrollLeft += 1;
      if (scrollContainer.scrollLeft >= scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      }
    }, 30);

    return () => clearInterval(interval);
  }, [shouldScroll, isPaused, isDragging, reviews]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!shouldScroll) return;
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  if (reviews.length === 0) return null;

  // Duplicate reviews for infinite scroll effect if needed
  const displayReviews = shouldScroll ? [...reviews, ...reviews] : reviews;

  return (
    <div className="mt-12 mb-16 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black uppercase tracking-tight">Customer Reviews</h3>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {reviews.length} total
        </span>
      </div>

      <div 
        ref={scrollRef}
        className={`flex gap-6 overflow-x-auto pb-4 scrollbar-hide select-none ${shouldScroll ? 'cursor-grab active:cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsPaused(true)}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {displayReviews.map((review, idx) => (
          <div 
            key={`${review.id}-${idx}`}
            className="flex-shrink-0 w-[300px] md:w-[350px] bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                />
              ))}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
              "{review.comment}"
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm font-bold text-black uppercase tracking-tight">{review.user_name}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {new Date(review.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
