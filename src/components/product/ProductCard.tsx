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

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addItem(product);
    setTimeout(() => setAdding(false), 800);
  };

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="product-card block">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, 33vw"
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
          {discount > 0 && (
            <span className="badge-red">-{discount}%</span>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="product-card-overlay gap-2">
          <button className="bg-white text-black p-3 rounded-full hover:bg-accent hover:text-white transition-colors shadow-lg">
            <Eye size={18} />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            className="bg-accent text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-accent-dark transition-colors disabled:bg-gray-400 shadow-lg flex items-center gap-2"
          >
            <ShoppingCart size={14} />
            {adding ? "Added!" : product.in_stock ? "Add to Cart" : "Sold Out"}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest mb-1">
          {product.category?.name || "Premium Meat"}
        </p>
        <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-2 group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-black text-accent text-lg">
            ${product.price.toFixed(2)}
          </span>
          {product.compare_at_price && (
            <span className="text-gray-400 text-sm line-through">
              ${product.compare_at_price.toFixed(2)}
            </span>
          )}
        </div>
        {/* Mini star rating — decorative */}
        <div className="flex items-center gap-0.5 mt-1.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">(4.9)</span>
        </div>
      </div>
    </Link>
  );
}
