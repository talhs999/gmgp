"use client";
import Link from "next/link";
import { CheckCircle, Download, ArrowLeft, Star, Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { saveOrderRating } from "@/lib/supabase-queries";
import { useState } from "react";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const isGuest = searchParams.get("guest");
  const total = searchParams.get("total") || "0";
  const fee = searchParams.get("fee") || "0";

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleRatingSubmit = async () => {
    if (rating === 0 || !orderId) return;
    setSubmitting(true);
    const ok = await saveOrderRating(orderId, rating, comment);
    if (ok) setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div className="pt-32 pb-20 container-custom max-w-2xl text-center">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
          <CheckCircle size={48} />
        </div>
      </div>
      <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 mb-8 text-lg">Thank you for your purchase. Your premium meat is being prepared.</p>

      {/* Invoice Card */}
      <div id="invoice-card" className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-left mb-8 print:m-0 print:p-0 print:border-none print:bg-white text-black">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
          <div>
            <h2 className="font-bold text-gray-900 uppercase tracking-widest text-sm mb-1">Invoice Summary</h2>
            <p className="text-xs text-gray-500">Order #{orderId ? orderId.split("-")[0].toUpperCase() : "TEMP-" + Math.floor(Math.random() * 1000000)}</p>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full uppercase tracking-wider print:hidden">
              Cash on Delivery
            </span>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-bold text-gray-900">Processing / Ready to Pay</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-bold text-gray-900">COD (Pay on Arrival)</span>
          </div>
          <div className="flex justify-between pt-2 border-t mt-2">
            <span className="text-gray-600 font-bold">Total Amount Due:</span>
            <span className="font-black text-xl text-accent">AUD ${parseFloat(total).toFixed(2)}</span>
          </div>
          
          <div className="hidden print:block mt-8 pt-8 border-t border-dashed">
            <h3 className="font-bold uppercase mb-2">Delivery Instructions:</h3>
            <p className="text-xs text-gray-600">Please have the exact amount ready in cash at the time of delivery. A delivery partner will contact you shortly.</p>
          </div>
        </div>
      </div>

      {/* Rating Section */}
      {orderId && !submitted && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8 print:hidden transition-all text-black">
          <h3 className="font-bold uppercase tracking-widest text-sm mb-4">Rate Your Experience</h3>
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
                className={`transition-colors ${(hover || rating) >= star ? "text-yellow-400" : "text-gray-200"}`}
              >
                <Star size={32} fill={(hover || rating) >= star ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
          <textarea
            placeholder="Tell us what you liked (optional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-gray-100 p-3 rounded-lg text-sm mb-4 focus:outline-none focus:border-black min-h-[80px]"
          />
          <button
            onClick={handleRatingSubmit}
            disabled={rating === 0 || submitting}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Submit Review"} <Send size={16} />
          </button>
        </div>
      )}

      {submitted && (
        <div className="bg-green-50 border border-green-100 text-green-700 p-4 rounded-xl mb-8 flex items-center justify-center gap-2 animate-in fade-in zoom-in">
          <CheckCircle size={20} /> <span className="font-bold">Thank you for your feedback!</span>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 print:hidden">
        <button 
          onClick={() => window.print()}
          className="btn-outline flex items-center justify-center gap-2 py-4 hover:bg-black hover:text-white transition-all transform hover:scale-[1.02] text-black"
        >
          <Download size={18} /> Download PDF Invoice
        </button>
        <Link href="/shop" className="btn-primary flex items-center justify-center gap-2 py-4 transform hover:scale-[1.02]">
          <ArrowLeft size={18} /> Continue Shopping
        </Link>
      </div>

      <style jsx global>{`
        @media print {
          nav, footer, .btn-primary, .btn-outline, .print\\:hidden { display: none !important; }
          body { background: white !important; padding: 0 !important; margin: 0 !important; }
          .pt-32 { padding-top: 20px !important; }
          #invoice-card { width: 100% !important; max-width: 100% !important; box-shadow: none !important; margin: 0 !important; }
        }
      `}</style>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="pt-32 pb-24 min-h-[80vh] bg-gray-50 px-4">
      <Suspense fallback={<div className="text-center pt-20">Loading invoice...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
