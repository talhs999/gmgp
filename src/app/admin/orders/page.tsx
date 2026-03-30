"use client";
import { useEffect, useState, Fragment } from "react";
import { getAllOrders, updateOrderStatus, deleteOrder } from "@/lib/supabase-queries";
import { Order } from "@/lib/types";
import { ShoppingBag, ChevronDown, Trash2 } from "lucide-react";

const STATUS_OPTIONS: Order["status"][] = ["pending", "confirmed", "preparing", "delivered", "cancelled"];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<(Order & { profile?: { full_name: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    getAllOrders().then((data) => { setOrders(data); setLoading(false); });
  }, []);

  const handleStatusChange = async (orderId: string, status: Order["status"]) => {
    setUpdating(orderId);
    const ok = await updateOrderStatus(orderId, status);
    if (ok) {
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
    }
    setUpdating(null);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to permanently delete this order? This cannot be undone.")) return;
    setUpdating(orderId);
    const ok = await deleteOrder(orderId);
    if (ok) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } else {
      alert("Failed to delete order. It may be locked.");
    }
    setUpdating(null);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tight">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center">
            <ShoppingBag size={40} className="mx-auto text-gray-200 mb-4" />
            <p className="font-bold text-gray-400">No orders yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-400">
              <tr>
                <th className="text-left px-6 py-3">Order ID</th>
                <th className="text-left px-6 py-3">Customer & Contact</th>
                <th className="text-left px-6 py-3">Date</th>
                <th className="text-left px-6 py-3">Items</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-right px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                const isExpanded = expandedRow === order.id;
                const customerName = order.profile?.full_name || order.address_snapshot?.full_name || "Guest";
                const customerEmail = order.address_snapshot?.email || "No Email";
                const customerPhone = order.address_snapshot?.phone || "No Phone";

                return (
                  <Fragment key={order.id}>
                    <tr 
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${isExpanded ? "bg-gray-50/50" : ""}`}
                      onClick={() => setExpandedRow(isExpanded ? null : order.id)}
                    >
                      <td className="px-6 py-4 text-sm font-bold text-accent">
                        <div className="flex items-center gap-2">
                          <ChevronDown size={14} className={`transition-transform text-gray-400 ${isExpanded ? "rotate-180" : ""}`} />
                          #{order.id.slice(0, 8).toUpperCase()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold truncate max-w-[150px]">{customerName}</span>
                            {order.user_id ? (
                              <span className="text-[9px] bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-sm uppercase tracking-widest font-bold whitespace-nowrap">
                                Member
                              </span>
                            ) : (
                              <span className="text-[9px] bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-sm uppercase tracking-widest font-bold whitespace-nowrap">
                                Guest
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[200px]" title={customerEmail}>
                            {customerEmail}
                          </div>
                          <div className="text-xs text-gray-400">
                            {customerPhone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="text-gray-900 font-medium">
                          {new Date(order.created_at).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.created_at).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span className="font-bold text-gray-700">
                          {(order.order_items as unknown as unknown[])?.length ?? 0}
                        </span> items
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                              disabled={updating === order.id}
                              className="text-xs border border-gray-200 py-1 px-2 rounded appearance-none pr-6 bg-white cursor-pointer focus:outline-none focus:border-black"
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-4">
                          <span className="text-lg">${Number(order.total).toFixed(2)}</span>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            disabled={updating === order.id}
                            className="text-gray-300 hover:text-red-600 transition-colors disabled:opacity-50"
                            title="Delete Order"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expandable Order Details */}
                    {isExpanded && (
                      <tr className="bg-gray-50/50">
                        <td colSpan={6} className="px-6 py-8">
                          <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-200">
                            
                            {/* Left Column: Order Items */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                                <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">Order Items</span>
                                <span className="text-[10px] font-bold text-gray-400">#{order.id}</span>
                              </div>
                              <div className="divide-y divide-gray-100 flex-1 overflow-auto max-h-[400px]">
                                {(order.order_items as any[])?.map((item: any) => (
                                  <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden border border-gray-100">
                                        {item.product?.image_url ? (
                                          <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                                        ) : (
                                          <ShoppingBag size={20} />
                                        )}
                                      </div>
                                      <div>
                                        <div className="text-sm font-bold text-gray-900">{item.product?.name || "Product Deleted"}</div>
                                        <div className="text-[11px] text-gray-500 mt-0.5">
                                          <span className="bg-gray-100 px-1.5 py-0.5 rounded font-bold text-gray-600">
                                            {item.weight_option ? `${item.weight_option}` : "Standard Pack"}
                                          </span>
                                          {item.quantity > 1 && (
                                            <span className="ml-2 font-bold text-accent">× {item.quantity}</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-sm font-bold text-gray-900">
                                      ${(item.unit_price * item.quantity).toFixed(2)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center mt-auto">
                                <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Order Subtotal</span>
                                <span className="font-black text-gray-900 text-lg">${Number(order.total).toFixed(2)}</span>
                              </div>
                            </div>

                            {/* Right Column: Shipping & Delivery */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">Shipping & Delivery Details</span>
                              </div>
                              
                              <div className="p-6 space-y-6 flex-1">
                                {/* Delivery Region Badge */}
                                <div>
                                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Delivery Region</label>
                                  <div className="flex items-center gap-2">
                                    {order.address_snapshot?.state === "WA" ? (
                                      <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                        📍 Within Perth (Local)
                                      </span>
                                    ) : (
                                      <span className="bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                        🚚 Outside Perth (Regional)
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Full Address */}
                                <div>
                                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Delivery Address</label>
                                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="font-bold text-gray-900 mb-1">{order.address_snapshot?.full_name}</p>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                      {order.address_snapshot?.address}<br />
                                      {order.address_snapshot?.suburb}, {order.address_snapshot?.state} {order.address_snapshot?.postcode}
                                    </p>
                                  </div>
                                </div>

                                {/* Contact Person */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Direct Phone</label>
                                    <p className="text-sm font-bold text-accent">{customerPhone}</p>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Contact Email</label>
                                    <p className="text-sm font-bold text-gray-900 truncate">{customerEmail}</p>
                                  </div>
                                </div>

                                {/* Delivery Metadata */}
                                {order.delivery_date && (
                                  <div className="pt-4 border-t border-gray-100">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Requested Delivery Date</label>
                                    <p className="text-sm font-bold text-green-600">
                                      {new Date(order.delivery_date).toLocaleDateString("en-AU", { weekday: 'long', day: 'numeric', month: 'long' })}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="p-4 bg-gray-50 border-t border-gray-200">
                                <button 
                                  onClick={() => window.print()}
                                  className="w-full bg-white border border-gray-200 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                                >
                                  🖨️ Print Packing Slip
                                </button>
                              </div>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
