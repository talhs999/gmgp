"use client";
import { useState, useRef } from "react";
import { Upload, Link2, Loader2, X, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onAddToGallery?: (url: string) => void;
  label?: string;
}

export function ImageUpload({ value, onChange, onAddToGallery, label = "Image" }: ImageUploadProps) {
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
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(`Upload failed: ${err.message || "Unknown error"}. Make sure 'product-images' bucket exists and RLS policies are set in Supabase.`);
    }
    setUploading(false);
  };

  return (
    <div className="space-y-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-black uppercase tracking-widest text-gray-500">{label}</label>
        <div className="flex gap-1">
          <button type="button" onClick={() => setTab("url")} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${tab === "url" ? "bg-black text-white shadow-sm" : "bg-white border border-gray-100 text-gray-400 hover:text-black"}`}>URL</button>
          <button type="button" onClick={() => setTab("upload")} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${tab === "upload" ? "bg-black text-white shadow-sm" : "bg-white border border-gray-100 text-gray-400 hover:text-black"}`}>Upload</button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          {tab === "url" ? (
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-xl bg-white shadow-sm transition-all"
              placeholder="Paste main image URL..."
            />
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-black hover:bg-white transition-all group bg-gray-50"
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2 text-gray-400"><Loader2 size={32} className="animate-spin" /><span className="text-[10px] font-black uppercase tracking-widest">Uploading...</span></div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-black">
                  <Upload size={32} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Select Image</span>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </div>
          )}
        </div>

        {value && (
          <div className="relative w-full md:w-48 h-48 rounded-2xl overflow-hidden border border-gray-200 shadow-md group animate-in fade-in zoom-in slide-in-from-right-4 duration-300">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onChange("")}
                className="bg-white text-red-500 rounded-full p-2 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                title="Remove"
              >
                <X size={16} />
              </button>
              {onAddToGallery && (
                <button
                  type="button"
                  onClick={() => onAddToGallery(value)}
                  className="bg-white text-black rounded-full p-2 hover:bg-black hover:text-white transition-all shadow-lg"
                  title="Add to Gallery"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface GalleryUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  onSetAsMain?: (url: string) => void;
}

export function GalleryUpload({ value, onChange, onSetAsMain }: GalleryUploadProps) {
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
        const filename = `products/gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("product-images").upload(filename, file, { upsert: true });
        if (!error) {
          const { data } = supabase.storage.from("product-images").getPublicUrl(filename);
          newUrls.push(data.publicUrl);
        }
      } catch (err: any) { 
        console.error("Gallery upload error:", err);
        alert(`Gallery upload failed: ${err.message}`);
      }
    }
    onChange([...value, ...newUrls]);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const addUrl = () => {
    if (newUrl.trim() && !value.includes(newUrl.trim())) {
      onChange([...value, newUrl.trim()]);
      setNewUrl("");
    }
  };

  return (
    <div className="space-y-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
      <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Gallery Images</label>

      {/* Existing images grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {value.map((url, i) => (
          <div key={`${url}-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm group bg-white animate-in fade-in zoom-in duration-300" style={{ animationDelay: `${i * 50}ms` }}>
            <img src={url} alt={`gallery-${i}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="bg-white text-red-500 rounded-full p-1.5 hover:bg-red-500 hover:text-white transition-all"
                title="Remove"
              >
                <X size={12} />
              </button>
              {onSetAsMain && (
                <button
                  type="button"
                  onClick={() => onSetAsMain(url)}
                  className="bg-white text-black rounded-full p-1.5 hover:bg-black hover:text-white transition-all"
                  title="Make Main Image"
                >
                  <Upload size={12} className="rotate-180" />
                </button>
              )}
            </div>
          </div>
        ))}
        <div
          onClick={() => fileRef.current?.click()}
          className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-black hover:bg-white transition-all text-gray-400 hover:text-black group"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={20} />}
          <span className="text-[10px] font-black uppercase tracking-widest">Add Image</span>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} />
        </div>
      </div>

      <div className="flex gap-2 bg-white p-2 rounded-xl border border-gray-100 mt-4">
        <input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
          placeholder="Or paste image URL and press Enter..."
          className="flex-1 px-4 py-2.5 text-sm focus:outline-none rounded-lg"
        />
        <button type="button" onClick={addUrl} className="px-6 py-2.5 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-zinc-800 transition-all flex items-center gap-2">
          Add URL
        </button>
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
