import HeroSection from "@/components/home/HeroSection";
import MainSlider from "@/components/home/MainSlider";
import CountdownTimer from "@/components/home/CountdownTimer";
import Marquee from "@/components/home/Marquee";
import ProductTabs from "@/components/home/ProductTabs";
import TrustSignals from "@/components/home/TrustSignals";
import BeforeAfterSlider from "@/components/product/BeforeAfterSlider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GMGP Premium Meats | Australia's Best Online Butcher",
  description: "Shop premium Australian meats delivered to your door every Saturday. Wagyu, Beef, Lamb, Chicken, BBQ Packs & more.",
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Saturday Delivery Countdown */}
      <CountdownTimer />

      {/* 3. Scrolling Marquee */}
      <Marquee />

      {/* 4. Product Tabs — All / BBQ / Best Sellers / New */}
      <ProductTabs />

      {/* 5. Trust Signals */}
      <TrustSignals />

      {/* 6. Packaging Feature Banner */}
      <section className="py-16 bg-black text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-accent text-xs font-bold uppercase tracking-widest mb-3">Our Packaging</p>
              <h2 className="section-title text-white mb-5">
                Vacuum-Skin <br />Sealed Fresh
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Our state-of-the-art vacuum-skin packaging technology ensures your meat stays fresher for longer — 
                up to 28 days in the fridge and 12 months in the freezer. No air. No bacteria. No compromise.
              </p>
              <ul className="space-y-3 mb-8">
                {["No freezer burn", "Longer shelf life", "Locks in natural juices", "Tamper-evident seal"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="text-accent font-bold">✓</span> {item}
                  </li>
                ))}
              </ul>
              <a href="/shop" className="btn-accent inline-block">Shop Now</a>
            </div>
            <div
              className="aspect-square rounded-2xl overflow-hidden"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>
        </div>
      </section>

      {/* 7. Referral Banner */}
      <section className="py-12 bg-accent text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Give $10, Get $10! 🎁</h2>
          <p className="text-white/80 mb-5 max-w-md mx-auto">
            Refer a friend to GMGP and you both get $10 credit. It's meat you love, shared.
          </p>
          <a href="/membership" className="bg-white text-accent px-8 py-3 font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors inline-block">
            Learn More
          </a>
        </div>
      </section>

      {/* 8. Premium Promotional Slider */}
      <MainSlider />

      {/* 9. Packaging Comparison Slider */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 text-center">Vacuum-Skin Packaging: <span className="text-accent">See the Difference</span></h2>
            <p className="text-gray-500 mb-10 max-w-2xl mx-auto">
              Our advanced vacuum-skin packaging locks in freshness, flavor, and quality for up to 14 days. Drag the slider to compare standard packaging versus the GMGP difference.
            </p>
            <BeforeAfterSlider 
              beforeImage="/images/home-slider-before.png" 
              afterImage="/images/home-slider-after.png" 
            />
          </div>
        </div>
      </section>

      {/* 10. Video Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="section-title text-center mb-3">Sydney's Foodies Fire Up 🔥</h2>
          <p className="text-center text-gray-500 text-sm mb-10">See what our customers are cooking</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "6JtLxCszFsE", // New Short 1
              "3eGqirz2P7Y", // New Short 2
              "i2xKkIQ8eNU", // New Short 3
              "tQWg27P9zM4", // 4th User Provided Short
            ].map((ytId, i) => (
              <div key={i} className="aspect-[9/16] relative rounded-xl overflow-hidden bg-black shadow-md group">
                <iframe
                  className="absolute inset-0 w-full h-full object-cover scale-[1.3] pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity"
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&bg=000000&color=white`}
                  allow="autoplay; encrypted-media"
                  frameBorder="0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
