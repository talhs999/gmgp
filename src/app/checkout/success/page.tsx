"use client";
import Link from "next/link";
import { CheckCircle, Download, FileText, ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const isGuest = searchParams.get("guest") === "true";
  const total = searchParams.get("total") || "0.00";
  const fee = searchParams.get("fee") || "100";

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 border border-gray-100 shadow-xl rounded-2xl text-center relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-600" />
      
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      
      <h1 className="text-4xl font-black uppercase tracking-tight mb-3">Order Confirmed!</h1>
      <p className="text-gray-500 mb-8 text-lg">Thank you for your purchase. Your premium meat is being prepared.</p>

      {/* Invoice Card */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-left mb-10">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
          <div>
            <h2 className="font-bold text-gray-900 uppercase tracking-widest text-sm mb-1">Invoice Summary</h2>
            <p className="text-xs text-gray-500">Order #{orderId ? orderId.split("-")[0].toUpperCase() : Math.floor(Math.random() * 1000000)}</p>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full uppercase tracking-wider">
              Cash on Delivery
            </span>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-bold text-gray-900">Processing</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-bold text-gray-900">COD (Pay on Arrival)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Amount Due:</span>
            <span className="font-black text-lg text-accent">AUD ${orderId ? "---" : parseFloat(total).toFixed(2)}</span>
          </div>
          {orderId && (
            <div className="text-xs text-blue-600 bg-blue-50 p-3 rounded mt-2">
              The exact total has been calculated and saved to your account. You can view the full itemized invoice in your dashboard.
            </div>
          )}
          {isGuest && (
            <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
              <span>Includes Shipping:</span>
              <span>AUD ${parseFloat(fee).toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {orderId ? (
          <Link href="/account" className="btn-outline flex items-center justify-center gap-2 py-4">
            <FileText size={18} /> View Full Invoice
          </Link>
        ) : (
          <button onClick={() => window.print()} className="btn-outline flex items-center justify-center gap-2 py-4">
            <Download size={18} /> Save Receipt
          </button>
        )}
        <Link href="/shop" className="btn-primary flex items-center justify-center gap-2 py-4">
          <ArrowLeft size={18} /> Continue Shopping
        </Link>
      </div>
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
