"use client";
import { useEffect, useState } from "react";
import { getCoupons, createCoupon, deleteCoupon } from "@/lib/supabase-queries";
import { Coupon } from "@/lib/types";
import { Ticket, Plus, Trash2, Calendar, Tag, CheckCircle, XCircle } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: 0,
    min_order_amount: 0,
    max_uses: "" as any,
    expires_at: "",
    is_active: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    const data = await getCoupons();
    setCoupons(data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...newCoupon,
      code: newCoupon.code.toUpperCase(),
      discount_value: Number(newCoupon.discount_value),
      min_order_amount: Number(newCoupon.min_order_amount),
      max_uses: newCoupon.max_uses ? Number(newCoupon.max_uses) : null,
      expires_at: newCoupon.expires_at || null,
    };

    const created = await createCoupon(payload);
    if (created) {
      setIsModalOpen(false);
      setNewCoupon({
        code: "",
        discount_type: "percentage",
        discount_value: 0,
        min_order_amount: 0,
        max_uses: "",
        expires_at: "",
        is_active: true
      });
      fetchCoupons();
    } else {
      alert("Failed to create coupon. Code might already exist.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    const ok = await deleteCoupon(id);
    if (ok) fetchCoupons();
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Coupons</h1>
          <p className="text-gray-500 text-sm mt-1">Manage discount codes and promotions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2 px-6"
        >
          <Plus size={18} />
          Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-2xl" />
          ))
        ) : coupons.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
            <Ticket size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold">No coupons found. Create your first one!</p>
          </div>
        ) : (
          coupons.map((coupon) => (
            <div key={coupon.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-black text-white text-xs font-black px-3 py-1 rounded-full tracking-widest uppercase">
                  {coupon.code}
                </div>
                <button 
                  onClick={() => handleDelete(coupon.id)}
                  className="text-gray-300 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center text-accent">
                    <Tag size={20} />
                  </div>
                  <div>
                    <p className="text-lg font-black leading-tight">
                      {coupon.discount_type === "percentage" ? `${coupon.discount_value}%` : `$${coupon.discount_value}`} OFF
                    </p>
                    <p className="text-xs text-gray-500 font-medium">Discount Value</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-gray-50 p-2.5 rounded-xl">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Min Spend</p>
                    <p className="text-sm font-bold text-gray-900">${coupon.min_order_amount}</p>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-wider">Uses</p>
                    <p className="text-sm font-bold text-gray-900">{coupon.used_count} / {coupon.max_uses || "∞"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 text-[11px] font-bold">
                  <Calendar size={14} className="text-gray-400" />
                  <span className={new Date(coupon.expires_at || "") < new Date() ? "text-red-500" : "text-gray-500"}>
                    {coupon.expires_at ? `Expires: ${new Date(coupon.expires_at).toLocaleDateString()}` : "No expiry"}
                  </span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 group-hover:bg-accent transition-colors duration-500" />
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-black uppercase tracking-tight">Create Coupon</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl transition-colors">
                <XCircle className="text-gray-400 hover:text-black" size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Coupon Code</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. WELCOME20"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-black font-bold uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Type</label>
                    <select 
                      value={newCoupon.discount_type}
                      onChange={(e) => setNewCoupon({...newCoupon, discount_type: e.target.value as any})}
                      className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-black font-bold"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Value</label>
                    <input 
                      required 
                      type="number" 
                      value={newCoupon.discount_value}
                      onChange={(e) => setNewCoupon({...newCoupon, discount_value: Number(e.target.value)})}
                      className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-black font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Min Spend ($)</label>
                    <input 
                      type="number" 
                      value={newCoupon.min_order_amount}
                      onChange={(e) => setNewCoupon({...newCoupon, min_order_amount: Number(e.target.value)})}
                      className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-black font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Max Uses</label>
                    <input 
                      type="number" 
                      placeholder="Unlimited"
                      value={newCoupon.max_uses}
                      onChange={(e) => setNewCoupon({...newCoupon, max_uses: e.target.value})}
                      className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-black font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Expiry Date</label>
                  <input 
                    type="date" 
                    value={newCoupon.expires_at}
                    onChange={(e) => setNewCoupon({...newCoupon, expires_at: e.target.value})}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-black font-bold"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-black/10"
              >
                <CheckCircle size={20} />
                Create Promotion
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
