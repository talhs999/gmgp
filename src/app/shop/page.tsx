"use client";
import { useState, useMemo, useEffect, Suspense } from "react";
import ProductCard from "@/components/product/ProductCard";
import { getProducts, getCategories } from "@/lib/supabase-queries";
import { Product, Category } from "@/lib/types";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";

function ShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const activeTag = searchParams.get("tag");

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([prods, cats]) => {
      setProducts(prods);
      setCategories(cats);
      
      // Auto-filter by slug if present in URL
      if (categorySlug) {
        const found = cats.find(c => c.slug === categorySlug);
        if (found) setActiveCategory(found.id);
      }
      
      setLoading(false);
    });
  }, [categorySlug]);

  const filtered = useMemo(() => {
    let list = [...products];

    // Basic Filters
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || (p.tags && p.tags.some((t) => t.includes(q))));
    }
    if (activeCategory !== "all") {
      list = list.filter((p) => p.category_id === activeCategory);
    }

    // Special Tag Filter
    if (activeTag === "special") {
      list = list.filter((p) => p.is_special);
    }
    
    // Sort logic
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest") list.sort((a, b) => (a.badge === "NEW" ? -1 : 1));
    else if (activeTag !== "special") {
      // Default: Specials first
      list.sort((a, b) => (a.is_special === b.is_special ? 0 : a.is_special ? -1 : 1));
    }
    
    return list;
  }, [search, activeCategory, sortBy, products, activeTag]);

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="relative h-48 md:h-64 flex items-center justify-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
            {activeTag === "special" ? "Today's Special" : "Our Cuts"}
          </h1>
          <p className="text-white/70 mt-2 text-sm">
            {loading ? "Loading..." : `${products.length} premium products available`}
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Search + Sort Bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search cuts, categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-200 pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-black"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <X size={14} />
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-black"
          >
            <option value="default">Sort by: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 border px-4 py-2.5 text-sm font-semibold transition-colors ${
              showFilters ? "bg-black text-white border-black" : "border-gray-200 hover:border-black"
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
              activeCategory === "all" ? "bg-black text-white border-black" : "border-gray-300 hover:border-black"
            }`}
          >
            All ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category_id === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-colors ${
                  activeCategory === cat.id ? "bg-black text-white border-black" : "border-gray-300 hover:border-black"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing <strong>{filtered.length}</strong> products
          {activeCategory !== "all" && ` in ${categories.find((c) => c.id === activeCategory)?.name}`}
        </p>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-xl aspect-[4/5]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl font-bold text-gray-300 mb-2">No products found</p>
            <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="btn-primary mt-4 inline-block">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center text-gray-400">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
