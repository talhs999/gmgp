"use client";
import Link from "next/link";
import Image from "next/image";

const categories = [
  { name: "Beef", slug: "beef", emoji: "🥩" },
  { name: "Lamb", slug: "lamb", emoji: "🐑" },
  { name: "Chicken", slug: "chicken", emoji: "🍗" },
  { name: "BBQ Packs", slug: "bbq", emoji: "🔥" },
  { name: "Wagyu", slug: "wagyu", emoji: "⭐" },
  { name: "Sausages", slug: "sausages", emoji: "🌭" },
  { name: "Burgers", slug: "burgers", emoji: "🍔" },
  { name: "Marinated", slug: "marinated", emoji: "🫙" },
  { name: "Seafood", slug: "seafood", emoji: "🦐" },
  { name: "Halal", slug: "halal", emoji: "✅" },
  { name: "Gift Packs", slug: "gifts", emoji: "🎁" },
];

export default function MegaMenu() {
  return (
    <div className="bg-white shadow-2xl border-t border-gray-200">
      <div className="container-custom py-8">
        <div className="grid grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all group"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-center text-black group-hover:text-accent transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 flex gap-4">
          <Link
            href="/shop"
            className="btn-primary inline-block"
          >
            View All Products
          </Link>
          <Link
            href="/shop?tag=best-seller"
            className="btn-outline inline-block"
          >
            Best Sellers
          </Link>
        </div>
      </div>
    </div>
  );
}
