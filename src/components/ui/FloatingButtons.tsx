"use client";
import Link from "next/link";
import { ArrowUp, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Join Membership — Bottom Left */}
      <Link
        href="/membership"
        className="fixed bottom-6 left-6 z-50 bg-accent text-white text-xs font-bold uppercase tracking-widest px-4 py-3 shadow-lg hover:bg-accent-dark transition-colors"
        style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
      >
        Join Membership
      </Link>

      {/* Right Side Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Chat Box Popup */}
        {chatOpen && (
          <div className="w-80 h-96 bg-white border border-gray-200 shadow-2xl rounded-xl flex flex-col overflow-hidden mb-2 animate-fade-up">
            <div className="bg-black text-white p-4 flex justify-between items-center">
              <span className="font-bold text-sm">GMGP Live Chat</span>
              <button onClick={() => setChatOpen(false)} className="text-white/70 hover:text-white">✕</button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
              <div className="bg-white border p-3 rounded-lg text-sm self-start max-w-[85%]">
                Hi there! Welcome to GMGP. Do you need help picking a cut or checking delivery?
              </div>
            </div>
            <div className="p-3 border-t bg-white flex gap-2">
              <input type="text" placeholder="Type a message..." className="flex-1 border p-2 text-sm rounded focus:outline-none" />
              <button className="bg-accent text-white px-3 py-2 text-sm font-bold rounded">Send</button>
            </div>
          </div>
        )}

        {/* Live Chat Toggle Button */}
        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-black text-white px-4 py-3 text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-accent transition-colors flex items-center gap-2"
        >
          <MessageCircle size={14} />
          {chatOpen ? "Close Chat" : "Live Chat"}
        </button>

        {/* Scroll to Top */}
        {showTop && !chatOpen && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-black text-white w-10 h-10 flex items-center justify-center shadow-lg hover:bg-accent transition-colors"
          >
            <ArrowUp size={16} />
          </button>
        )}
      </div>

      {/* Get $10 - Side Tab */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
        <button
          className="bg-accent text-white text-[10px] font-bold uppercase tracking-widest px-2 py-4 shadow-lg hover:bg-accent-dark transition-colors"
          style={{ writingMode: "vertical-lr" }}
        >
          Get $10 →
        </button>
      </div>
    </>
  );
}
