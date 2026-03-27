"use client";
import { use, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/supabase-queries";
import { useCartStore } from "@/store/cartStore";
import ProductCard from "@/components/product/ProductCard";
import ProductGallery from "@/components/product/ProductGallery";
import Accordion from "@/components/ui/Accordion";
import ShareButton from "@/components/product/ShareButton";
import FeedbackModal from "@/components/product/FeedbackModal";
import BeforeAfterSlider from "@/components/product/BeforeAfterSlider";
import { notFound } from "next/navigation";
import { WeightOption, Product } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: Props) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const [qty, setQty] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState<WeightOption | undefined>(undefined);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const addToCartRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    getProductBySlug(slug).then((p) => {
      if (!p) { setNotFoundState(true); setLoading(false); return; }
      setProduct(p);
      setSelectedWeight(p.weight_options?.[0]);
      getRelatedProducts(p.category_id ?? "", p.id).then(setRelated);
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (addToCartRef.current) observer.observe(addToCartRef.current);
    return () => observer.disconnect();
  }, [product]);

  if (loading) {
    return (
      <div className="pt-16">
        <div className="container-custom py-8">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 animate-pulse">
            <div className="aspect-square bg-gray-100 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-100 w-1/3 rounded" />
              <div className="h-10 bg-gray-100 rounded" />
              <div className="h-8 bg-gray-100 w-1/4 rounded" />
              <div className="h-24 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFoundState || !product) return notFound();

  const price = selectedWeight ? selectedWeight.price : product.price;

  return (
    <>
      <div className="pt-24 bg-gray-50 border-b border-gray-100 mb-8">
        {/* Breadcrumb */}
        <div className="container-custom py-4">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            <a href="/" className="hover:text-accent transition-colors">Home</a>
            <span className="text-gray-300">/</span>
            <a href="/shop" className="hover:text-accent transition-colors">Shop</a>
            <span className="text-gray-300">/</span>
            <span className="text-black">{product.name}</span>
          </nav>
        </div>
      </div>

      <div>
        {/* Product Detail */}
        <div className="container-custom py-8">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Image Gallery */}
            <ProductGallery 
              images={
                Array.isArray(product.images) && product.images.filter((img: string) => img && img.trim() !== '').length > 0 
                  ? product.images.filter((img: string) => img && img.trim() !== '') 
                  : (product.image_url ? [product.image_url] : [])
              } 
              productName={product.name}
              badge={product.badge}
              badgeColor={product.badge_color}
            />

            {/* Info */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                {product.category?.name}
              </p>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-black" style={{ color: "#E31B23" }}>
                  ${price.toFixed(2)}
                </span>
                {product.compare_at_price && (
                  <span className="text-xl text-gray-400 line-through">
                    ${product.compare_at_price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Trust icons */}
              <div className="flex gap-4 mb-6 text-xs font-semibold uppercase tracking-widest text-gray-500 flex-wrap">
                <span>✅ Halal</span>
                <span>🚚 Sat Delivery</span>
                <span>📦 Vac Sealed</span>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

              {/* Weight Options */}
              {product.weight_options && product.weight_options.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs font-bold uppercase tracking-widest mb-3">Size / Weight</p>
                  <div className="flex gap-2 flex-wrap">
                    {product.weight_options.map((w) => (
                      <button
                        key={w.label}
                        onClick={() => setSelectedWeight(w)}
                        className="border px-4 py-2 text-sm font-semibold transition-all"
                        style={{
                          borderColor: selectedWeight?.label === w.label ? "#000" : "#d1d5db",
                          background: selectedWeight?.label === w.label ? "#000" : "#fff",
                          color: selectedWeight?.label === w.label ? "#fff" : "#000",
                        }}
                      >
                        {w.label} — ${w.price.toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Attribute Sliders */}
              {product.leanness_rating && (
                <div className="mb-8 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest mb-1">Product Profile</p>
                  {[
                    { label: "Lean", oppositeLabel: "Fatty", value: product.leanness_rating },
                    { label: "Soft", oppositeLabel: "Firm", value: product.firmness_rating ?? 5 },
                    { label: "Light", oppositeLabel: "Rich", value: product.richness_rating ?? 5 },
                  ].map((attr) => (
                    <div key={attr.label}>
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                        <span>{attr.label}</span>
                        <span>{attr.oppositeLabel}</span>
                      </div>
                      <input
                        type="range" min={1} max={10} value={attr.value} readOnly
                        onChange={() => {}} className="attr-slider"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Add to Cart */}
              <div className="flex gap-3 items-center">
                <div className="flex items-center border border-gray-300">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-3 hover:bg-gray-100 transition-colors">
                    <Minus size={14} />
                  </button>
                  <span className="px-6 font-bold text-sm">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="px-4 py-3 hover:bg-gray-100 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  ref={addToCartRef}
                  onClick={() => addItem(product, qty, selectedWeight)}
                  disabled={!product.in_stock}
                  className="btn-accent flex-1 flex items-center justify-center gap-2 py-4"
                >
                  <ShoppingCart size={16} />
                  {product.in_stock ? "Add To Cart" : "Sold Out"}
                </button>
              </div>

              {/* Share & Ask Question */}
              <div className="flex gap-4 mt-8">
                <ShareButton title={product.name} url={typeof window !== "undefined" ? window.location.href : ""} />
                <FeedbackModal productName={product.name} />
              </div>

              {/* Expandable Info */}
              <div className="mt-8 border-t border-gray-200">
                <Accordion title="Delivery Information" defaultOpen>
                  <p>We deliver priority overnight to ensure your meat arrives fresh. Delivery is $100 AUD for Perth and $200 AUD for all other regions. Orders placed before 2 PM are dispatched the same day.</p>
                </Accordion>
                <Accordion title="Storage & Preparation">
                  <p>Store your fresh cuts in the coldest part of your refrigerator at 0-4°C. Vacuum-sealed products can be refrigerated for up to 14 days or frozen for up to 6 months. For best cooking results, let the meat come to room temperature for 30 minutes prior to cooking.</p>
                </Accordion>
                <Accordion title="Our Guarantee">
                  <p>Every cut is backed by our Desert Premium Guarantee. If you are not completely satisfied with the tenderness and flavor, let us know within 24 hours of delivery and we will make it right.</p>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Before/After Presentation */}
          <div className="max-w-4xl mx-auto my-20 text-center">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4 text-center">Vacuum-Skin Packaging: See the Difference</h2>
            <p className="text-gray-500 mb-8 max-w-2xl mx-auto">Our advanced vacuum-skin packaging locks in freshness, flavor, and quality for up to 14 days. Drag the slider to compare standard packaging versus the GMGP difference.</p>
            <BeforeAfterSlider 
              beforeImage="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80" 
              afterImage={product.image_url} 
            />
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="section-title mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {related.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      {showStickyBar && product && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-[150] py-3">
          <div className="container-custom flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                <Image src={product.image_url} alt={product.name} fill className="object-cover" />
              </div>
              <div>
                <p className="font-bold text-sm line-clamp-1">{product.name}</p>
                <p className="font-black text-lg" style={{ color: "#E31B23" }}>${price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-300">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2"><Minus size={12} /></button>
                <span className="px-4 font-bold text-sm">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-2"><Plus size={12} /></button>
              </div>
              <button onClick={() => addItem(product, qty, selectedWeight)} className="btn-accent flex items-center gap-2">
                <ShoppingCart size={14} /> Add To Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
