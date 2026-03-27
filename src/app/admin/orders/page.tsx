"use client";
import { useEffect, useState } from "react";
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
                <th className="text-left px-6 py-3">Customer</th>
                <th className="text-left px-6 py-3">Date</th>
                <th className="text-left px-6 py-3">Items</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-right px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-accent">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-[150px]">
                        {order.profile?.full_name || order.address_snapshot?.full_name || "Unknown"}
                      </span>
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
                    {(order.order_items as unknown as unknown[])?.length ?? "—"} items
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
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
                  <td className="px-6 py-4 text-sm font-bold text-right">
                    <div className="flex items-center justify-end gap-4">
                      <span>${Number(order.total).toFixed(2)}</span>
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
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
