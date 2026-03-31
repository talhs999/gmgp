"use client";
import { useEffect, useState } from "react";
import { getProducts, deleteProduct } from "@/lib/supabase-queries";
import { Product } from "@/lib/types";
import { Plus, Pencil, Trash2, Search, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => getProducts().then((p) => { setProducts(p); setLoading(false); });

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    const ok = await deleteProduct(id);
    if (ok) setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products in your store</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-black rounded-lg"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-400">
              <tr>
                <th className="text-left px-6 py-3">Product</th>
                <th className="text-left px-6 py-3">Category</th>
                <th className="text-left px-6 py-3">Price</th>
                <th className="text-left px-6 py-3">Badge</th>
                <th className="text-left px-6 py-3">Stock</th>
                <th className="text-right px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm line-clamp-1">{product.name}</p>
                        <p className="text-[11px] text-gray-400">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-gray-600 capitalize">{product.category?.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-bold text-accent">${product.price.toFixed(2)}</span>
                      {product.compare_at_price && (
                        <span className="text-xs text-gray-400 line-through ml-1">${product.compare_at_price.toFixed(2)}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.badge ? (
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                        product.badge_color === "red" ? "bg-red-100 text-red-700" :
                        product.badge_color === "green" ? "bg-green-100 text-green-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {product.badge}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${
                      product.in_stock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {product.in_stock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-black"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deletingId === product.id}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-500 hover:text-accent disabled:opacity-40"
                        title="Delete"
                      >
                        {deletingId === product.id ? (
                          <AlertCircle size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
}
