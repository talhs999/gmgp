"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  Slide data — meat cutting & meat-only photography                  */
/* ------------------------------------------------------------------ */
const slides = [
  {
    id: 1,
    badge: "🥩 Hotpot & Slow Cook Bundle",
    heading: "Love Thin Slices? Save 10%",
    description:
      "Choose any 4 from our Hotpot & Slow Cook meats — discount applies at checkout.",
    cta: "Shop Thin Cuts",
    href: "/shop?category=hotpot",
    // Thinly sliced wagyu beef on tray
    image:
      "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=1400&q=85",
  },
  {
    id: 2,
    badge: "Buy 1 Steak, Get 2nd 35% Off",
    heading: "Steak Deal of the Month 💕",
    description:
      "Buy any steak cut, get your second at 35% off — no code needed.",
    cta: "Shop Artisan Steaks",
    href: "/shop?category=steaks",
    // Raw ribeye steak on dark background
    image:
      "https://images.unsplash.com/photo-1558030006-450675393462?w=1400&q=85",
  },
  {
    id: 3,
    badge: "🔪 Butcher's Pick",
    heading: "Fresh Cut, Every Saturday",
    description:
      "Our master butchers hand-select and cut every order fresh — delivered to your door weekly.",
    cta: "Explore Cuts",
    href: "/shop",
    // Butcher cutting meat on block
    image:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1400&q=85",
  },
  {
    id: 4,
    badge: "✨ New Arrivals",
    heading: "Wagyu Collection",
    description:
      "Hand-selected A5-grade Wagyu — marbled perfection, butcher-cut to order.",
    cta: "Explore Wagyu",
    href: "/shop?category=wagyu",
    // Close-up wagyu marble texture
    image:
      "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=1400&q=85",
  },
];

const AUTO_PLAY_MS = 4500;

export default function MainSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goTo = useCallback(
    (idx: number) => {
      setDirection(idx > current ? 1 : -1);
      setCurrent(idx);
    },
    [current]
  );

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(next, AUTO_PLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, next]);

  const prevIdx = (current - 1 + slides.length) % slides.length;
  const nextIdx = (current + 1) % slides.length;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0.6,
      scale: 0.97,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.65, ease: [0.32, 0.72, 0, 1] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0.6,
      scale: 0.97,
      transition: { duration: 0.65, ease: [0.32, 0.72, 0, 1] },
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 + i * 0.13, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <section
      className="relative w-full bg-black overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Promotional meat slider"
    >
      {/* ============================================================ */}
      {/*  Slider track — peek layout                                  */}
      {/* ============================================================ */}
      <div className="relative h-[380px] sm:h-[440px] md:h-[500px] lg:h-[520px] w-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={slides[current].id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            {/* Background meat image */}
            <Image
              src={slides[current].image}
              alt={slides[current].heading}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            {/* Left-sided gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />

            {/* Slide text content */}
            <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-14 md:px-24 lg:px-32 max-w-2xl">
              <motion.span
                custom={0}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/90 mb-3 tracking-wide"
              >
                {slides[current].badge}
              </motion.span>

              <motion.h2
                custom={1}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-5 uppercase tracking-tighter"
              >
                {slides[current].heading}
              </motion.h2>

              <motion.p
                custom={2}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-sm sm:text-base text-white/75 leading-relaxed mb-8 max-w-md"
              >
                {slides[current].description}
              </motion.p>

              <motion.div
                custom={3}
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                <a
                  href={slides[current].href}
                  className="inline-flex items-center gap-3 bg-white text-black font-black text-xs sm:text-sm uppercase tracking-widest px-8 py-4 hover:bg-accent hover:text-white transition-all duration-300 shadow-xl group/btn"
                >
                  {slides[current].cta}
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-0 right-0 z-20 pointer-events-none flex items-center justify-between px-4 sm:px-8">
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous slide"
            className="pointer-events-auto w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-accent hover:scale-110 transition-all duration-300 border border-white/10 group shadow-2xl"
          >
            <svg className="w-6 h-6 lg:w-7 lg:h-7 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next slide"
            className="pointer-events-auto w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-accent hover:scale-110 transition-all duration-300 border border-white/10 group shadow-2xl"
          >
            <svg className="w-6 h-6 lg:w-7 lg:h-7 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>


      {/* ============================================================ */}
      {/*  Bottom strip: Join Membership + Pagination dots             */}
      {/* ============================================================ */}
      <div className="bg-white px-5 py-4 sm:py-5 border-t border-gray-100">
        <div className="container-custom relative flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Join Membership */}
          <a
            href="/membership"
            className="flex items-center gap-2 bg-accent text-white text-xs sm:text-sm font-black px-6 py-3 rounded-full hover:bg-black hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Join Membership
          </a>

          {/* Pagination dots */}
          <div className="flex items-center gap-3">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => goTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  idx === current
                    ? "w-10 h-2.5 bg-accent"
                    : "w-2.5 h-2.5 bg-gray-200 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          {/* Right side spacer to keep dots centered on desktop */}
          <div className="hidden sm:block w-[160px]" />
        </div>
      </div>

    </section>
  );
}
