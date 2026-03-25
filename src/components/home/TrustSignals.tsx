import { Truck, Shield, Star, Clock } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Saturday Delivery",
    desc: "Freshly packed and delivered every Saturday across Australia",
  },
  {
    icon: Shield,
    title: "100% Australian",
    desc: "Locally sourced from premium Australian farms you can trust",
  },
  {
    icon: Star,
    title: "Premium Quality",
    desc: "Vacuum-sealed to lock in freshness. Restaurant-grade cuts",
  },
  {
    icon: Clock,
    title: "Easy Ordering",
    desc: "Order online anytime. No subscription required",
  },
];

export default function TrustSignals() {
  return (
    <section className="py-16 bg-cream">
      <div className="container-custom">
        <h2 className="section-title text-center mb-12">Why Shop With Us?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4 group-hover:bg-accent transition-colors duration-300">
                <f.icon size={26} className="text-white" />
              </div>
              <h3 className="font-bold text-sm uppercase tracking-widest mb-2">
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
