"use client";
import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingCart, Star } from "lucide-react";
import { Product } from "@/lib/types";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

// High-quality fallback images per category slug (or generic)
const FALLBACKS: Record<string, string> = {
  lamb:    "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=600&q=80",
  beef:    "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80",
  steaks:  "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80",
  wagyu:   "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=600&q=80",
  pork:    "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80",
  chicken: "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=600&q=80",
  bbq:     "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80",
  default: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80",
};

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [adding, setAdding] = useState(false);

  // Pick a category-appropriate fallback
  const categorySlug = product.category?.slug ?? "";
  const fallbackSrc =
    FALLBACKS[categorySlug] ||
    FALLBACKS[Object.keys(FALLBACKS).find((k) => categorySlug.includes(k)) ?? "default"] ||
    FALLBACKS.default;

  const [imgSrc, setImgSrc] = useState(
    product.image_url?.startsWith("http") ? product.image_url : fallbackSrc
  );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    // Use the first weight option as default if available
    const defaultWeight = product.weight_options && product.weight_options.length > 0 
      ? product.weight_options[0] 
      : undefined;
    addItem(product, 1, defaultWeight);
    setTimeout(() => setAdding(false), 800);
  };

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const hasWeights = product.weight_options && product.weight_options.length > 0;
  const displayPrice = hasWeights ? product.weight_options![0].price : product.price;

  return (
    <Link href={`/products/${product.slug}`} className="product-card block group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500 shadow-inner"
          sizes="(max-width: 768px) 50vw, 33vw"
          onError={() => setImgSrc(fallbackSrc)}
          unoptimized={!imgSrc.includes("unsplash.com") && !imgSrc.includes("supabase.co")}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span
              className={
                product.badge_color === "red"
                  ? "badge-red"
                  : product.badge_color === "green"
                  ? "badge-green"
                  : "badge-grey"
              }
            >
              {product.badge}
            </span>
          )}
          {!product.in_stock && (
            <span className="badge-grey">Sold Out</span>
          )}
          {discount > 0 && !hasWeights && (
            <span className="badge-red">-{discount}%</span>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="product-card-overlay gap-2">
          <button aria-label={`Quick view ${product.name}`} className="bg-white text-black p-3 rounded-full hover:bg-black hover:text-white transition-colors shadow-lg">
            <Eye size={18} />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            aria-label={`Add ${product.name} to cart`}
            className="bg-black text-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:bg-gray-400 shadow-lg flex items-center gap-2"
          >
            <ShoppingCart size={14} />
            {adding ? "Added!" : product.in_stock ? "Add to Cart" : "Sold Out"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 bg-white">
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5 flex items-center gap-2">
          {product.category?.name || "Premium Meat"}
          {hasWeights && <span className="h-1 w-1 rounded-full bg-gray-300"></span>}
          {hasWeights && <span>{product.weight_options?.length} Sizes</span>}
        </p>
        <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-2 group-hover:text-accent transition-colors min-h-[2.5rem]">
          {product.name}
        </h3>
        
        <div className="flex flex-col gap-0.5">
          {hasWeights && (
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              From
            </span>
          )}
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-black">
              ${displayPrice.toFixed(2)}
            </span>
            {product.compare_at_price && !hasWeights && (
              <span className="text-xs font-bold text-gray-400 line-through">
                ${product.compare_at_price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Mini star rating — decorative */}
        <div className="flex items-center gap-0.5 mt-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">(4.9)</span>
        </div>
      </div>
    </Link>
  );
}
