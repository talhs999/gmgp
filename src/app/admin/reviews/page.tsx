"use client";
import { useState, useEffect } from "react";
import { Star, Trash2, ExternalLink, ShoppingBag } from "lucide-react";
import { 
  getAllReviewsWithProducts, 
  deleteProductReview, 
  getOrderFeedback, 
  deleteOrderFeedback 
} from "@/lib/supabase-queries";
import { ProductReview, Order } from "@/lib/types";
import Link from "next/link";

export default function AdminReviewsPage() {
  const [activeTab, setActiveTab] = useState<"product" | "order">("product");
  const [productReviews, setProductReviews] = useState<(ProductReview & { product?: { name: string, slug: string } })[]>([]);
  const [orderFeedback, setOrderFeedback] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [pData, oData] = await Promise.all([
      getAllReviewsWithProducts(),
      getOrderFeedback()
    ]);
    setProductReviews(pData);
    setOrderFeedback(oData);
    setLoading(false);
  };

  const handleDeleteProductReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product review?")) return;
    setDeletingId(id);
    const ok = await deleteProductReview(id);
    if (ok) setProductReviews(productReviews.filter(r => r.id !== id));
    setDeletingId(null);
  };

  const handleDeleteOrderFeedback = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order feedback?")) return;
    setDeletingId(id);
    const ok = await deleteOrderFeedback(id);
    if (ok) setOrderFeedback(orderFeedback.filter(o => o.id !== id));
    setDeletingId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Reviews & Feedback</h1>
          <p className="text-gray-500 mt-1">Manage customer sentiments from products and orders.</p>
        </div>
        
        {/* Tabs */}
        <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
          <button 
            onClick={() => setActiveTab("product")}
            className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "product" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Product Reviews ({productReviews.length})
          </button>
          <button 
            onClick={() => setActiveTab("order")}
            className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "order" ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Order Feedback ({orderFeedback.length})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {activeTab === "product" ? "Product" : "Order ID"}
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Reviewer</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Rating</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Comment</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeTab === "product" ? (
                productReviews.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No product reviews found.</td></tr>
                ) : (
                  productReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-black line-clamp-1">{review.product?.name || "Unknown Product"}</span>
                          <Link href={`/products/${review.product?.slug}`} className="text-[10px] text-gray-400 hover:text-accent flex items-center gap-1 mt-0.5" target="_blank">
                            View Product <ExternalLink size={10} />
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-sm font-bold text-gray-700">
                          {review.user_name}
                          <span className="text-[10px] text-gray-400 uppercase font-medium">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4"><p className="text-sm text-gray-600 line-clamp-2 max-w-md">{review.comment}</p></td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteProductReview(review.id)} disabled={deletingId === review.id} className="p-2 text-gray-400 hover:text-accent hover:bg-red-50 rounded-lg transition-all disabled:opacity-50">
                          {deletingId === review.id ? <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                orderFeedback.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No order feedback found.</td></tr>
                ) : (
                  orderFeedback.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-black">#{order.id.split("-")[0].toUpperCase()}</span>
                          <Link href={`/admin/orders`} className="text-[10px] text-gray-400 hover:text-accent flex items-center gap-1 mt-0.5">
                            Manage Order <ShoppingBag size={10} />
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-sm font-bold text-gray-700">
                          {order.address_snapshot?.full_name || "Guest User"}
                          <span className="text-[10px] text-gray-400 uppercase font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} size={12} className={s <= (order.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4"><p className="text-sm text-gray-600 line-clamp-2 max-w-md">{order.rating_comment}</p></td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteOrderFeedback(order.id)} disabled={deletingId === order.id} className="p-2 text-gray-400 hover:text-accent hover:bg-red-50 rounded-lg transition-all disabled:opacity-50">
                          {deletingId === order.id ? <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
