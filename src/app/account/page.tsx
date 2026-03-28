"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getUserOrders, updateProfile, cancelOrder, deleteOrder } from "@/lib/supabase-queries";
import { Order } from "@/lib/types";
import Link from "next/link";
import { Package, User as UserIcon, LogOut, Heart, CheckCircle, XCircle, Trash2 } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AccountPage() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Cancellation & Deletion state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(profile?.full_name || user.user_metadata?.full_name || "");
      setPhone(profile?.phone || "");
      fetchOrders();
    }
  }, [user, profile]);

  const fetchOrders = () => {
    if (user) {
      getUserOrders(user.id).then((data) => {
        setOrders(data);
        setOrdersLoading(false);
      });
    }
  };

  const handleCancelRequest = async () => {
    if (!selectedOrder) return;
    setCancelling(true);
    const ok = await cancelOrder(selectedOrder, cancelReason);
    if (ok) {
      await fetchOrders();
      setShowCancelModal(false);
      setCancelReason("");
    } else {
      window.alert("Cancellation failed. Please try again.");
    }
    setCancelling(false);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to delete this order record?")) return;
    setDeleting(orderId);
    const ok = await deleteOrder(orderId);
    if (ok) {
      await fetchOrders();
    } else {
      window.alert("Delete failed. Please try again.");
    }
    setDeleting(null);
  };
  
  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const ok = await updateProfile(user.id, { full_name: fullName, phone });
    if (ok) { await refreshProfile(); setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000); }
    setSaving(false);
  };

  if (loading) return <div className="pt-32 pb-20 text-center animate-pulse text-gray-400">Loading...</div>;

  if (!user) {
    return (
      <div className="pt-40 pb-20 container-custom text-center min-h-[60vh]">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-4">My Account</h1>
        <p className="text-gray-500 mb-8">Please sign in to view your account details.</p>
        <Link href="/login" className="btn-primary inline-block">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="container-custom max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tight">Your Account</h1>
          <button onClick={signOut} className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black flex items-center gap-2">
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
              <div className="p-6 bg-black text-white text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserIcon size={24} className="text-white" />
                </div>
                <p className="font-bold truncate">{profile?.full_name || user.user_metadata?.full_name || "Customer"}</p>
                <p className="text-xs text-white/70 truncate">{user.email}</p>
                {profile?.is_member && (
                  <span className="mt-2 inline-block text-[10px] font-bold bg-accent px-2 py-0.5 rounded text-white">MEMBER</span>
                )}
              </div>
              <div className="p-2">
                <a href="#orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 font-semibold text-sm">
                  <Package size={18} className="text-gray-400" /> Order History
                </a>
                <a href="#profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 font-semibold text-sm">
                  <UserIcon size={18} className="text-gray-400" /> Profile Details
                </a>
              </div>
              {profile?.referral_code && (
                <div className="p-4 border-t border-gray-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Your Referral Code</p>
                  <p className="font-mono font-bold text-sm">GMGP-{profile.referral_code.toUpperCase()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-8 lg:col-span-9 space-y-8">
            
            {/* Order History */}
            <div id="orders" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-black">
              <h2 className="font-bold uppercase tracking-widest text-sm border-b pb-4 mb-4">Recent Orders</h2>
              {ordersLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <Package size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm font-bold text-gray-500">No orders placed yet.</p>
                  <Link href="/shop" className="text-accent text-sm font-bold mt-2 hover:underline inline-block">Start Shopping</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex-1">
                        <p className="font-bold text-sm text-accent">#{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{new Date(order.created_at).toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" })}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                        <span className="font-black text-lg text-accent">${Number(order.total).toFixed(2)}</span>
                        
                        {order.status === 'pending' && (
                          <button 
                            onClick={() => { setSelectedOrder(order.id); setShowCancelModal(true); }}
                            className="text-xs font-bold text-red-500 hover:text-red-700 underline flex items-center gap-1"
                          >
                            <XCircle size={14} /> Cancel
                          </button>
                        )}

                        {order.status === 'cancelled' && (
                          <button 
                            disabled={deleting === order.id}
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                          >
                            <Trash2 size={14} /> {deleting === order.id ? "Deleting..." : "Delete"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div id="profile" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-black">
              <h2 className="font-bold uppercase tracking-widest text-sm border-b pb-4 mb-4">Account Details</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                  <input type="text" disabled value={user.email || ""} className="w-full border border-gray-200 bg-gray-50 p-3 rounded-lg text-sm text-gray-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-black" />
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={handleSaveProfile} disabled={saving} className="btn-primary mt-2 flex items-center gap-2">
                    {saving ? "Saving..." : "Update Profile"}
                  </button>
                  {saveSuccess && <span className="flex items-center gap-1 text-green-600 text-sm font-bold"><CheckCircle size={14} /> Saved!</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl animate-in zoom-in duration-200 text-black">
            <h3 className="text-xl font-black uppercase mb-2">Cancel Order</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to cancel this order? Please tell us why.</p>
            
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Reason for Cancellation</label>
            <textarea 
              autoFocus
              required
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g., Wrong items selected, changed my mind..."
              className="w-full border border-gray-200 p-4 rounded-xl text-sm min-h-[120px] focus:border-black focus:outline-none mb-6"
            />
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 font-bold uppercase tracking-widest text-xs border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button 
                onClick={handleCancelRequest}
                disabled={!cancelReason.trim() || cancelling}
                className="flex-1 py-3 font-bold uppercase tracking-widest text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
