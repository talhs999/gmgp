import { Truck, MapPin, Clock, Calendar } from "lucide-react";
import Link from "next/link";

export default function DeliveryPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-black pt-36 pb-20 md:pt-48 md:pb-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-6">
          Delivery Info
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed px-4">
          Everything you need to know about receiving your premium meat orders across Sydney Metro and Wollongong.
        </p>
      </div>

      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          {/* Main Delivery Day */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 mb-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-accent"></div>
            <div className="w-16 h-16 bg-red-50 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar size={32} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-4">Saturdays Only</h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              To ensure peak freshness and streamline our process, **all deliveries run exclusively on Saturdays**. 
              This allows our butchers to prepare your order fresh just hours before it leaves our facility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Zones */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg uppercase tracking-wider mb-6 flex items-center gap-3">
                <MapPin className="text-accent" /> Delivery Zones
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="mt-1 w-2 h-2 rounded-full bg-accent flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-sm">Sydney Metro</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Within 35km of Lakemba. Some Campbelltown areas are included depending on exact location.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 w-2 h-2 rounded-full bg-accent flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-sm">Wollongong Area</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">Within 20km of Wollongong Central.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Timings */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg uppercase tracking-wider mb-6 flex items-center gap-3">
                <Clock className="text-accent" /> Tracking & Timings
              </h3>
              <ul className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <li className="flex gap-3">
                  <span className="font-bold text-black border border-gray-200 w-6 h-6 flex items-center justify-center rounded text-xs flex-shrink-0 mt-0.5">1</span>
                  You’ll receive an Estimated Time of Arrival (ETA) SMS on Friday afternoon.
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-black border border-gray-200 w-6 h-6 flex items-center justify-center rounded text-xs flex-shrink-0 mt-0.5">2</span>
                  A live update with tracking is sent on Saturday morning when delivery commences.
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-black border border-gray-200 w-6 h-6 flex items-center justify-center rounded text-xs flex-shrink-0 mt-0.5">3</span>
                  <span className="text-gray-500 italic">Note: Specific delivery time requests aren't available as our team follows the most efficient, mapped route to ensure all meat stays fresh.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Pick up */}
          <div className="bg-black text-white rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck size={28} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-wider mb-2">Prefer to Pick Up?</h3>
                <p className="text-sm text-gray-400">Pick up is available at Lakeba directly from our Warehouse (9am - 2:30pm Saturdays).</p>
              </div>
            </div>
            <Link href="/shop" className="btn-primary whitespace-nowrap">
              Shop Now
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
