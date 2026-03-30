"use client";
import Link from "next/link";
import { CheckCircle, Download, ArrowLeft, Star, Send, Printer } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { saveOrderRating, getOrderById } from "@/lib/supabase-queries";
import { useState, useEffect } from "react";
import { Suspense } from "react";
import { Order } from "@/lib/types";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId).then((data) => {
        setOrder(data);
        setLoadingOrder(false);
      });
    } else {
      setLoadingOrder(false);
    }
  }, [orderId]);

  const handleRatingSubmit = async () => {
    if (rating === 0 || !orderId) return;
    setSubmitting(true);
    const ok = await saveOrderRating(orderId, rating, comment);
    if (ok) setSubmitted(true);
    setSubmitting(false);
  };

  if (loadingOrder) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Generating Invoice...</p>
      </div>
    );
  }

  return (
    <div className="pt-10 pb-20 container-custom max-w-4xl mx-auto">
      <div className="text-center mb-12 print:hidden">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <CheckCircle size={48} />
          </div>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 text-lg">Thank you for your purchase. Your premium meat is being prepared.</p>
      </div>

      {/* Professional Invoice Layout */}
      <div className="printable-order-content bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-2xl transition-all text-black">
        {/* Print-Only Header */}
        <div className="hidden print:flex justify-between items-start border-b-2 border-black pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">GMGP<span className="text-accent">.</span></h1>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Premium Meats | Quality Australian Butcher Shop</p>
          </div>
          <div className="text-right text-xs space-y-1">
            <p className="font-bold uppercase">Tax Invoice / Receipt</p>
            <p>Invoice #: {orderId?.split("-")[0].toUpperCase()}</p>
            <p>Date: {order ? new Date(order.created_at).toLocaleDateString() : new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Web Visual Header */}
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-12 border-b border-gray-100 pb-12 print:hidden">
          <div className="space-y-1">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Order Summary</h2>
            <p className="text-xl font-bold">Order #{orderId?.split("-")[0].toUpperCase()}</p>
            <p className="text-sm text-gray-500">{order ? new Date(order.created_at).toLocaleString() : ""}</p>
          </div>
          <div className="text-right">
            <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 text-xs font-black rounded-full uppercase tracking-widest">
              Cash on Delivery (Pending)
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Bill To */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Customer Details</h3>
            <div className="space-y-1 text-sm">
              <p className="font-bold text-lg">{order?.address_snapshot?.full_name}</p>
              <p className="text-gray-600">{order?.address_snapshot?.email}</p>
              <p className="text-gray-600">{order?.address_snapshot?.phone}</p>
            </div>
          </div>
          {/* Shipping Address */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Delivery Address</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>{order?.address_snapshot?.address}</p>
              <p>{order?.address_snapshot?.suburb}, {order?.address_snapshot?.state} {order?.address_snapshot?.postcode}</p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-12">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Ordered Items</h3>
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 uppercase text-[10px] font-black tracking-widest text-gray-400">
                  <th className="px-6 py-4">Item Description</th>
                  <th className="px-6 py-4 text-center">Qty</th>
                  <th className="px-6 py-4 text-right">Unit Price</th>
                  <th className="px-6 py-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {order?.order_items?.map((item) => (
                  <tr key={item.id} className="text-sm">
                    <td className="px-6 py-4">
                      <p className="font-bold text-black">{item.product?.name}</p>
                      {item.weight_option && (
                        <p className="text-[10px] text-gray-500 uppercase font-medium">{item.weight_option}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center font-bold">{item.quantity}</td>
                    <td className="px-6 py-4 text-right text-gray-500 font-medium">${item.unit_price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-bold text-black">${(item.quantity * item.unit_price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="flex flex-col items-end pt-8 border-t-2 border-gray-100">
          <div className="w-full md:w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium uppercase tracking-widest text-[10px]">Subtotal:</span>
              <span className="font-bold">${((order?.total || 0) - (order?.address_snapshot?.state === "within" ? 100 : 200)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium uppercase tracking-widest text-[10px]">Delivery Fee:</span>
              <span className="font-bold">${(order?.address_snapshot?.state === "within" ? 100 : 200).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <span className="text-black font-black uppercase tracking-widest text-xs">Total Paid:</span>
              <span className="text-3xl font-black text-accent">${order?.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 pt-8 border-t border-dashed border-gray-200 text-center text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
          <p className="font-bold text-gray-600 mb-1">Thank you for choosing GMGP Premium Meats.</p>
          <p>Please have the exact cash ready on arrival. Our delivery partner will contact you shortly.</p>
          <p className="mt-4">Support: support@gmgp.com | www.gmgp.com</p>
        </div>
      </div>

      {/* Rating Section (Hidden in Print) */}
      {orderId && !submitted && (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mt-12 print:hidden transition-all text-black">
          <h3 className="font-black uppercase tracking-widest text-sm mb-6 text-center">Rate Your Experience</h3>
          <div className="flex justify-center gap-3 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
                className={`transition-all transform hover:scale-110 ${(hover || rating) >= star ? "text-yellow-400" : "text-gray-200"}`}
              >
                <Star size={40} fill={(hover || rating) >= star ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Tell us what you liked about our service (optional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-gray-100 p-4 rounded-2xl text-sm mb-6 focus:outline-none focus:border-black min-h-[100px] transition-all"
          />
          <button
            onClick={handleRatingSubmit}
            disabled={rating === 0 || submitting}
            className="btn-primary w-full flex items-center justify-center gap-3 py-5 rounded-2xl disabled:opacity-50 font-bold uppercase tracking-widest"
          >
            {submitting ? "Submitting..." : "Send Feedback"} <Send size={18} />
          </button>
        </div>
      )}

      {submitted && (
        <div className="bg-green-50 border border-green-100 text-green-700 p-6 rounded-3xl mt-12 flex items-center justify-center gap-3 animate-in fade-in zoom-in print:hidden shadow-sm">
          <CheckCircle size={24} /> <span className="font-black uppercase tracking-tight">Your review has been shared!</span>
        </div>
      )}

      {/* Actions */}
      <div className="grid sm:grid-cols-2 gap-6 mt-12 print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-white border-2 border-black text-black font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-all transform hover:scale-[1.02]"
        >
          <Printer size={20} /> Print / Save PDF Invoice
        </button>
        <Link href="/shop" className="bg-black text-white font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-3 transform hover:scale-[1.02] hover:bg-accent transition-all">
          <ArrowLeft size={20} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="pt-24 pb-24 min-h-screen bg-gray-50 px-4 flex items-center justify-center">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Authenticating Order...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
