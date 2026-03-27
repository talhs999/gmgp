"use client";
import { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { sendProductFeedback } from "@/lib/supabase-queries";

export default function FeedbackModal({ productName }: { productName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await sendProductFeedback(productName, form.name, form.email, form.message);
    setLoading(false);
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        setForm({ name: "", email: "", message: "" });
      }, 3000);
    } else {
      alert("Failed to send feedback. Please try again.");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex flex-1 items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-bold uppercase tracking-widest text-gray-700"
      >
        <MessageSquare size={16} />
        Ask a Question
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-black uppercase tracking-tight mb-2">Have a question?</h2>
            <p className="text-sm text-gray-500 mb-6">Ask us anything about the {productName}. Our butchers are here to help.</p>

            {success ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl font-bold flex flex-col items-center gap-2 py-8">
                <span className="text-3xl">✅</span>
                Message sent successfully!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-gray-500">Name</label>
                  <input
                    type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-lg"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-gray-500">Email</label>
                  <input
                    type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-lg"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-1 text-gray-500">Message</label>
                  <textarea
                    required rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-lg resize-y"
                    placeholder="How long can I freeze this for...?"
                  />
                </div>
                <button
                  type="submit" disabled={loading}
                  className="btn-accent w-full flex items-center justify-center gap-2 py-4"
                >
                  <Send size={16} />
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
