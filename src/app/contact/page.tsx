"use client";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-black pt-36 pb-20 md:pt-48 md:pb-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-6">
          Contact Us
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed px-4">
          Have a question or comment? Don't be shy: Reach out and say hi! We are here to help you six days a week.
        </p>
      </div>

      <div className="container-custom py-16 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          
          {/* Contact Information Sidebar */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-widest mb-6 border-b pb-4">Store Locations</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 text-accent flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-sm mb-1">GMGP Warehouse K-Butchery</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">99–101 Yerrick Rd<br/>Lakemba NSW 2195</p>
                    <p className="text-xs font-bold text-gray-400 mt-2 flex items-center gap-2"><Clock size={12}/> Mon-Sat: 8:00 AM – 3:00 PM</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 text-accent flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-sm mb-1">GMGP Kiosk</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">Westfield Hurstville (In front of Woolworths & ALDI)<br/>3 Cross St, Hurstville NSW 2220</p>
                    <div className="text-xs font-bold text-gray-400 mt-2 space-y-1">
                      <p className="flex items-center gap-2"><Clock size={12}/> Mon-Wed, Fri-Sat: 9:30 AM – 6:00 PM</p>
                      <p className="flex items-center gap-2 text-transparent select-none"><Clock size={12} className="text-transparent"/> Thu: 9:30 AM – 9:00 PM</p>
                      <p className="flex items-center gap-2 text-transparent select-none"><Clock size={12} className="text-transparent"/> Sun: 10:00 AM – 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black uppercase tracking-widest mb-6 border-b pb-4 pt-4">Get In Touch</h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Phone Support (8:30am - 2:30pm)</p>
                    <a href="tel:0487500555" className="font-bold text-lg hover:text-accent transition-colors">0487 500 555</a>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email Us</p>
                    <a href="mailto:retail@gmgp.com.au" className="font-bold text-lg hover:text-accent transition-colors">retail@gmgp.com.au</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black uppercase tracking-widest mb-2">Send a Message</h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">Fill out the form below and our customer service team will get back to you as soon as possible.</p>
            
            {success ? (
              <div className="bg-green-50 border border-green-100 text-green-700 p-8 rounded-xl flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle size={48} className="text-green-500" />
                <div>
                  <h3 className="font-bold text-lg">Message Sent!</h3>
                  <p className="text-sm mt-1">Thank you for reaching out. We will reply to your email shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">First Name</label>
                    <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Last Name</label>
                    <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                  <input required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" placeholder="john@example.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Order Number (Optional)</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors" placeholder="e.g. #1024" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Message</label>
                  <textarea required rows={5} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors resize-none" placeholder="How can we help?"></textarea>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center gap-2 py-4">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                  {loading ? "Sending..." : "Submit Message"}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
