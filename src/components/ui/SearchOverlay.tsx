"use client";
import { X, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const trending = ["Wagyu Beef", "Lamb Chops", "BBQ Pack", "Chicken Thighs", "Black Angus"];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-start justify-center pt-24 px-4">
      <div className="w-full max-w-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white hover:text-accent transition-colors"
        >
          <X size={28} />
        </button>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for premium cuts, BBQ packs..."
            className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 pl-12 pr-4 py-4 text-lg rounded-lg focus:outline-none focus:border-accent"
          />
        </div>

        {/* Trending */}
        <div className="mt-8">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
            Trending
          </p>
          <div className="flex flex-wrap gap-2">
            {trending.map((term) => (
              <Link
                key={term}
                href={`/shop?q=${encodeURIComponent(term)}`}
                onClick={onClose}
                className="bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-accent transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>

        {query && (
          <Link
            href={`/shop?q=${encodeURIComponent(query)}`}
            onClick={onClose}
            className="btn-accent inline-block mt-8"
          >
            Search for "{query}"
          </Link>
        )}
      </div>
    </div>
  );
}
