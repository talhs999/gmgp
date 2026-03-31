"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/lib/supabase-queries";
import { Product } from "@/lib/types";

const TABS = [
  { label: "All Products", filter: (p: Product) => true },
  { label: "BBQ Essentials", filter: (p: Product) => p.tags.includes("bbq") },
  { label: "Best Sellers",  filter: (p: Product) => p.is_best_seller },
  { label: "What's New",    filter: (p: Product) => p.badge === "NEW" },
];

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => { setProducts(data); setLoading(false); });
  }, []);

  const filtered = products.filter(TABS[activeTab].filter).slice(0, 12);

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h2 className="section-title">Shop Our Cuts</h2>
          <div className="flex border border-gray-200 overflow-x-auto scrollbar-hide whitespace-nowrap rounded-sm max-w-full">
            {TABS.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-wider border-r last:border-r-0 transition-colors border-gray-200 flex-shrink-0
                  ${activeTab === i ? "bg-black text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-xl aspect-[4/5]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <a href="/shop" className="btn-outline inline-block px-12">
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
}
