"use client";
import Link from "next/link";
import { Check } from "lucide-react";

export default function MembershipPage() {
  return (
    <div className="pt-16">
      
      {/* Hero */}
      <div className="bg-black text-white py-20">
        <div className="container-custom max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight mb-4">
            Join the <span className="text-accent">Club</span>.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Become a GMGP member and unlock exclusive cuts, permanent discounts, and priority Saturday delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-accent px-10 py-4 text-base">Join Now for Free</Link>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-20 bg-gray-50">
        <div className="container-custom max-w-5xl">
          <h2 className="section-title text-center mb-16">Member Benefits</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-red-50 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-black">5%</span>
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest mb-3">Permanent Discount</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Enjoy a flat 5% off every single order, applied automatically at checkout to your account.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-red-50 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-black">⭐</span>
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest mb-3">First Access</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Get first dibs on rare Wagyu drops and limited-edition BBQ packs before the general public.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-red-50 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-black">🚚</span>
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest mb-3">Priority Delivery</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your Saturday delivery is given top priority on our refrigerated truck routes across Sydney.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Referral */}
      <div className="py-20">
        <div className="container-custom max-w-4xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2 block">Referral Program</span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">Give $10. Get $10.</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Invite your friends to try GMGP Premium Meats. They get $10 off their first order, and you get $10 credit when they purchase!
          </p>
          <div className="bg-gray-100 p-6 rounded-xl inline-flex items-center gap-4 max-w-md mx-auto w-full">
            <span className="flex-1 font-mono text-lg font-bold">GMGP-MEMBER-LINK</span>
            <button className="btn-primary">Copy Link</button>
          </div>
        </div>
      </div>
    </div>
  );
}
