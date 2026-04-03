"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategories } from "@/lib/supabase-queries";
import { Category } from "@/lib/types";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { ICON_MAP } from "@/lib/icon-map";

interface IconData {
  type: "icon" | "url" | "empty";
  value: string;
  color: string;
  inHeader: boolean;
}

const parseIconData = (imageUrl: string | null): IconData => {
  if (!imageUrl) return { type: "empty", value: "", color: "#000000", inHeader: false };
  try {
    const data = JSON.parse(imageUrl);
    if (data.type) return { ...data, inHeader: data.inHeader ?? false };
  } catch (e) {
    // Legacy support
    return { type: "url", value: imageUrl, color: "#000000", inHeader: false };
  }
  return { type: "empty", value: "", color: "#000000", inHeader: false };
};

export default function MegaMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  const headerCategories = categories.filter(cat => parseIconData(cat.image_url).inHeader);

  const renderIcon = (imageUrl: string | null) => {
    const data = parseIconData(imageUrl);
    
    if (data.type === "url" && data.value) {
      return (
        <img 
          src={data.value} 
          alt="icon" 
          className="w-8 h-8 object-contain transition-transform group-hover:scale-110 duration-300"
        />
      );
    }
    
    if (data.type === "icon" && data.value) {
      const IconComponent = ICON_MAP[data.value];
      if (IconComponent) {
        return (
          <div className="transition-transform group-hover:scale-110 duration-300">
            <IconComponent size={32} color={data.color || "#000000"} strokeWidth={1.5} />
          </div>
        );
      }
    }

    // Fallback if no icon is set
    return (
      <div className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-full text-gray-300 transition-transform group-hover:scale-110 duration-300">
        <ImageIcon size={20} />
      </div>
    );
  };

  return (
    <div className="bg-white shadow-2xl border-t border-gray-200">
      <div className="container-custom py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 size={32} className="animate-spin text-gray-300" />
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4">
            {headerCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all group"
              >
                {renderIcon(cat.image_url)}
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-center text-black group-hover:text-accent transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
          <Link href="/shop" className="btn-primary inline-flex items-center gap-2">
            View All Products
          </Link>
          <Link href="/shop?tag=special" className="btn-outline inline-flex items-center gap-2">
            Today's Special
          </Link>
        </div>
      </div>
    </div>
  );
}
