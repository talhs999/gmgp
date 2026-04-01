"use client";
import { useState, useRef } from "react";
import { Upload, Link2, Loader2, X, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"url" | "upload">("url");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(filename, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(filename);
      onChange(data.publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Make sure 'product-images' bucket exists in Supabase Storage.");
    }
    setUploading(false);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">{label}</label>
      <div className="flex gap-2 mb-3">
        <button type="button" onClick={() => setTab("url")} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${tab === "url" ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}>
          <Link2 size={12} /> URL
        </button>
        <button type="button" onClick={() => setTab("upload")} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${tab === "upload" ? "bg-black text-white" : "bg-gray-100 text-gray-500"}`}>
          <Upload size={12} /> Upload from PC
        </button>
      </div>

      {tab === "url" ? (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-lg"
          placeholder="https://images.unsplash.com/..."
        />
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-black transition-colors group"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Loader2 size={24} className="animate-spin" />
              <span className="text-xs font-bold uppercase">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-black transition-colors">
              <Upload size={24} />
              <span className="text-xs font-bold uppercase">Click to Upload</span>
              <span className="text-[10px] text-gray-400">JPG, PNG, WEBP up to 5MB</span>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </div>
      )}

      {value && (
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-100 shadow-sm group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

interface GalleryUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export function GalleryUpload({ value, onChange }: GalleryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [newUrl, setNewUrl] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of files) {
      try {
        const ext = file.name.split(".").pop();
        const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("product-images").upload(filename, file, { upsert: true });
        if (!error) {
          const { data } = supabase.storage.from("product-images").getPublicUrl(filename);
          newUrls.push(data.publicUrl);
        }
      } catch { /* skip failed */ }
    }
    onChange([...value, ...newUrls]);
    setUploading(false);
  };

  const addUrl = () => {
    if (newUrl.trim()) {
      onChange([...value, newUrl.trim()]);
      setNewUrl("");
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Gallery Images</label>

      {/* Existing images grid */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-2">
          {value.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-100 shadow-sm group">
              <img src={url} alt={`gallery-${i}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
          placeholder="Paste image URL and press Enter..."
          className="flex-1 border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-black rounded-lg"
        />
        <button type="button" onClick={addUrl} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
          <Plus size={16} />
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="px-4 py-2.5 bg-black text-white rounded-lg flex items-center gap-2 text-xs font-bold whitespace-nowrap hover:bg-zinc-800 transition-colors"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          Upload
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
      </div>
    </div>
  );
}

interface WeightOption {
  label: string;
  price: number;
}

interface WeightOptionsProps {
  value: WeightOption[];
  onChange: (opts: WeightOption[]) => void;
}

export function WeightOptions({ value, onChange }: WeightOptionsProps) {
  const [label, setLabel] = useState("");
  const [price, setPrice] = useState("");

  const add = () => {
    if (!label.trim() || !price) return;
    onChange([...value, { label: label.trim(), price: parseFloat(price) }]);
    setLabel("");
    setPrice("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Weight Options & Prices</label>
        <span className="text-[10px] text-gray-400 font-medium">Optional — leave empty for single-price products</span>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((opt, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 group">
              <div className="flex items-center gap-4">
                <span className="text-sm font-black">{opt.label}</span>
                <span className="text-sm text-green-700 font-bold">${opt.price.toFixed(2)}</span>
              </div>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 items-center">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label (e.g. 500g)"
          className="flex-1 border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-black rounded-lg"
        />
        <div className="relative w-36">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="w-full border border-gray-200 pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:border-black rounded-lg"
          />
        </div>
        <button
          type="button"
          onClick={add}
          className="px-4 py-2.5 bg-black text-white rounded-lg flex items-center gap-2 text-xs font-bold hover:bg-zinc-800 transition-colors whitespace-nowrap"
        >
          <Plus size={14} /> Add Option
        </button>
      </div>
    </div>
  );
}
