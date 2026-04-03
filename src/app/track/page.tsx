"use client";
import { useState } from "react";
import { Search, Package, Clock, CheckCircle2, Truck, XCircle, ChevronRight, Loader2 } from "lucide-react";
import { trackPublicOrder } from "./actions";

type PublicOrder = {
  id: string;
  status: "pending" | "confirmed" | "preparing" | "delivered" | "cancelled";
  total: number;
  delivery_date: string | null;
  created_at: string;
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<PublicOrder | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setLoading(true);
    setError(null);
    setOrder(null);
    
    const res = await trackPublicOrder(orderId.trim());
    if (res.success && res.order) {
      setOrder(res.order);
    } else {
      setError(res.error || "Failed to track order.");
    }
    setLoading(false);
  };

  const getStatusIndex = (status: PublicOrder["status"]) => {
    if (status === "cancelled") return -1;
    switch (status) {
      case "pending": return 0;
      case "confirmed": return 1;
      case "preparing": return 2;
      case "delivered": return 3;
      default: return 0;
    }
  };

  const currentStep = order ? getStatusIndex(order.status) : 0;

  const steps = [
    { title: "Order Placed", desc: "We've received your order", icon: Package },
    { title: "Confirmed", desc: "Payment verified", icon: CheckCircle2 },
    { title: "Preparing", desc: "Butchers are preparing cuts", icon: Clock },
    { title: "Delivered", desc: "Delivered successfully", icon: Truck }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-black pt-36 pb-20 md:pt-48 md:pb-32 px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-6">
          Track Order
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed px-4">
          Enter your Order ID below to check the real-time status of your premium meat delivery.
        </p>

        {/* Search Input */}
        <form onSubmit={handleTrack} className="mt-10 max-w-2xl mx-auto relative px-4 text-left">
          <label className="text-white text-xs font-bold uppercase tracking-widest mb-2 block ml-1">Order ID</label>
          <div className="flex bg-white rounded-xl shadow-lg border-2 border-transparent focus-within:border-accent overflow-hidden transition-colors">
            <div className="pl-5 flex items-center justify-center text-gray-400">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
              className="w-full bg-transparent px-4 py-4 md:py-5 text-black placeholder-gray-400 focus:outline-none"
            />
            <button 
              type="submit" 
              disabled={loading || !orderId.trim()}
              className="bg-accent text-white px-8 font-bold uppercase tracking-wider text-sm hover:bg-accent-dark transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : "Track"}
            </button>
          </div>
        </form>
      </div>

      <div className="container-custom py-16 px-4">
        {error && (
          <div className="max-w-3xl mx-auto bg-red-50 border border-red-100 text-red-600 p-6 rounded-xl flex items-center gap-4 shadow-sm">
            <XCircle size={24} className="flex-shrink-0" />
            <p className="font-semibold text-sm">{error}</p>
          </div>
        )}

        {order && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-8 mb-10 text-center md:text-left">
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Tracking Summary</p>
                <h2 className="text-xl md:text-2xl font-black truncate max-w-[200px] md:max-w-md">ID: {order.id.split("-")[0]}...</h2>
                <p className="text-sm text-gray-600 mt-2">Ordered on: {new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div className="w-full md:w-auto bg-gray-50 px-6 py-4 rounded-xl border border-gray-100">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Current Status</p>
                <p className={`text-lg font-black uppercase tracking-wider ${order.status === "cancelled" ? "text-red-500" : "text-black"}`}>
                  {order.status}
                </p>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="relative">
              {order.status === "cancelled" ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <XCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-black mb-2">Order Cancelled</h3>
                  <p className="text-gray-500">This order has been cancelled and will not be delivered.</p>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row justify-between relative mt-4">
                  {/* Connecting Line */}
                  <div className="absolute top-8 left-10 md:left-14 right-10 md:right-14 h-1 bg-gray-100 hidden md:block rounded-full">
                    <div 
                      className="absolute top-0 left-0 h-full bg-accent transition-all duration-1000 ease-in-out"
                      style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    ></div>
                  </div>

                  <div className="absolute top-0 bottom-0 left-8 w-1 bg-gray-100 block md:hidden rounded-full">
                    <div 
                      className="absolute top-0 left-0 w-full bg-accent transition-all duration-1000 ease-in-out"
                      style={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    ></div>
                  </div>

                  {steps.map((step, idx) => {
                    const isCompleted = currentStep >= idx;
                    const isCurrent = currentStep === idx;
                    const Icon = step.icon;

                    return (
                      <div key={step.title} className="relative z-10 flex md:flex-col items-center gap-6 md:gap-4 mb-10 md:mb-0 w-full md:w-1/4 text-left md:text-center">
                        <div className={`w-16 h-16 md:mx-auto rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0 ${
                          isCompleted ? "bg-accent text-white shadow-lg shadow-red-500/30 scale-110" : "bg-white border-2 border-gray-200 text-gray-300"
                        }`}>
                          <Icon size={24} />
                        </div>
                        <div>
                          <h4 className={`font-bold uppercase tracking-wider text-sm transition-colors duration-500 ${isCompleted ? "text-black" : "text-gray-400"}`}>
                            {step.title}
                          </h4>
                          <p className={`text-xs mt-1 transition-colors duration-500 hidden md:block ${isCurrent ? "text-gray-600 font-medium" : "text-gray-400"}`}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {order.delivery_date && order.status !== "delivered" && order.status !== "cancelled" && (
              <div className="mt-12 bg-blue-50 border border-blue-100 rounded-xl p-6 text-center text-blue-800">
                <span className="font-bold flex items-center justify-center gap-2">
                  <Clock size={16} /> Estimated Delivery Date: {new Date(order.delivery_date).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
