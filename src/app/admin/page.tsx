"use client";
import { useEffect, useState } from "react";
import { ShoppingBag, Package, Users, DollarSign, TrendingUp } from "lucide-react";
import { getAdminStats, getAllOrders } from "@/lib/supabase-queries";
import { Order } from "@/lib/types";

type AdminStats = {
  productCount: number;
  orderCount: number;
  totalRevenue: number;
  userCount: number;
  todayOrderCount: number;
  todayRevenue: number;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<(Order & { profile?: { full_name: string } })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getAllOrders()]).then(([s, o]) => {
      setStats(s);
      setOrders(o.slice(0, 5));
      setLoading(false);
    });
  }, []);

  const statCards = stats ? [
    { label: "Total Products", value: stats.productCount, icon: Package, color: "bg-blue-100 text-blue-700", change: "Live from DB" },
    { label: "Total Orders", value: stats.orderCount, icon: ShoppingBag, color: "bg-green-100 text-green-700", change: `+${stats.todayOrderCount} today` },
    { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: "bg-yellow-100 text-yellow-700", change: `+$${stats.todayRevenue.toFixed(2)} today` },
    { label: "Registered Users", value: stats.userCount, icon: Users, color: "bg-purple-100 text-purple-700", change: "Live from DB" },
  ] : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tight">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm animate-pulse h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
                <s.icon size={20} />
              </div>
              <p className="text-2xl font-black">{s.value}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">{s.label}</p>
              <p className="text-[11px] text-green-600 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp size={10} /> {s.change}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold uppercase tracking-wide text-sm">Recent Orders</h2>
          <a href="/admin/orders" className="text-xs text-accent font-bold hover:underline">View All</a>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <ShoppingBag size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-bold">No orders yet.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-400">
                <tr>
                  <th className="text-left px-6 py-3">Order</th>
                  <th className="text-left px-6 py-3">Customer</th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-right px-6 py-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-accent">#{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{order.profile?.full_name || "Guest"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-right">${Number(order.total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
