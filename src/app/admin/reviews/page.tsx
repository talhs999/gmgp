"use client";
import { useState, useEffect } from "react";
import { Star, Trash2, ExternalLink, MessageSquare } from "lucide-react";
import { getAllReviewsWithProducts, deleteProductReview } from "@/lib/supabase-queries";
import { ProductReview } from "@/lib/types";
import Link from "next/link";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<(ProductReview & { product?: { name: string, slug: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    const data = await getAllReviewsWithProducts();
    setReviews(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    setDeletingId(id);
    const ok = await deleteProductReview(id);
    if (ok) {
      setReviews(reviews.filter(r => r.id !== id));
    } else {
      alert("Failed to delete review.");
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Product Reviews</h1>
          <p className="text-gray-500 mt-1">Manage customer feedback across all products.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 flex items-center gap-2 shadow-sm">
          <MessageSquare size={16} className="text-gray-400" />
          <span className="text-sm font-bold">{reviews.length} Total Reviews</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Reviewer</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Rating</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Comment</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-black line-clamp-1">{review.product?.name || "Unknown Product"}</span>
                        <Link 
                          href={`/products/${review.product?.slug}`}
                          className="text-[10px] text-gray-400 hover:text-accent flex items-center gap-1 mt-0.5"
                          target="_blank"
                        >
                          View Product <ExternalLink size={10} />
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-gray-700">{review.user_name}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-medium">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            size={12} 
                            className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600 line-clamp-2 max-w-md">{review.comment}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(review.id)}
                        disabled={deletingId === review.id}
                        className="p-2 text-gray-400 hover:text-accent hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                        title="Delete Review"
                      >
                        {deletingId === review.id ? (
                          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
