"use client";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video / Image */}
      <div className="absolute inset-0 z-0">
        {/* HTML5 Native Video for reliable autoplay */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://cdn.pixabay.com/video/2021/04/13/70891-536442655_large.mp4" type="video/mp4" />
        </video>
        {/* Fallback background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=1920&q=80')",
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 animate-fade-up">
        {/* Decorative icon */}
        <div className="mb-6">
          <svg
            className="mx-auto w-16 h-16 text-white/60"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32 8c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M20 32h24M32 20v24"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
          PREMIUM MEAT
          <br />
          <span className="text-accent">FOR EVERY TABLE</span>
        </h1>
        <p className="text-lg md:text-xl text-white/80 font-medium max-w-lg mx-auto mb-8 tracking-wide">
          100% Australian. Vacuum-sealed fresh. Saturday delivery.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/shop" className="btn-accent px-10 py-4 text-base">
            Shop Now
          </a>
          <a href="/membership" className="btn-outline border-white text-white hover:bg-white hover:text-black px-10 py-4 text-base">
            Join Membership
          </a>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-6 mt-10 text-white/60 text-xs font-semibold uppercase tracking-widest">
          <span>✓ 100% Halal</span>
          <span className="w-px h-4 bg-white/30" />
          <span>✓ Sat Delivery</span>
          <span className="w-px h-4 bg-white/30" />
          <span>✓ Premium Quality</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center pt-2">
          <div className="w-1 h-3 bg-white rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
