"use client";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { MOCK_PRODUCTS } from "@/lib/products";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: Props) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    comparePrice: "",
    description: "",
    categoryId: "beef",
    inStock: true,
    badge: "",
    imageUrl: "",
    leanness: 5,
    firmness: 5,
    richness: 5
  });

  useEffect(() => {
    const found = MOCK_PRODUCTS.find(p => p.id === id);
    if (found) {
      setProduct(found);
      setForm({
        name: found.name,
        slug: found.slug,
        price: found.price.toString(),
        comparePrice: found.compare_at_price?.toString() || "",
        description: found.description || "",
        categoryId: found.category_id || "beef",
        inStock: found.in_stock,
        badge: found.badge || "",
        imageUrl: found.image_url,
        leanness: found.leanness_rating || 5,
        firmness: found.firmness_rating || 5,
        richness: found.richness_rating || 5
      });
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulating save for now since mock data is used
    setTimeout(() => {
      setLoading(false);
      router.push("/admin/products");
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  if (!product) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Edit Product</h1>
            <p className="text-gray-500 text-sm mt-1">Editing {product.name}</p>
          </div>
        </div>
        <button className="btn-outline border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 flex items-center gap-2">
          <Trash2 size={16} /> Delete
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-4">Basic Details</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Product Name *</label>
              <input type="text" name="name" required value={form.name} onChange={handleChange} className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">URL Slug *</label>
              <input type="text" name="slug" required value={form.slug} onChange={handleChange} className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-lg" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Price ($) *</label>
              <input type="number" step="0.01" name="price" required value={form.price} onChange={handleChange} className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Compare at Price</label>
              <input type="number" step="0.01" name="comparePrice" value={form.comparePrice} onChange={handleChange} className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Category *</label>
              <select name="categoryId" required value={form.categoryId} onChange={handleChange} className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-lg bg-white">
                <option value="beef">Beef</option>
                <option value="lamb">Lamb</option>
                <option value="pork">Pork</option>
                <option value="chicken">Chicken</option>
                <option value="wagyu">Wagyu</option>
                <option value="bbq">BBQ Packs</option>
                <option value="sausages">Sausages</option>
                <option value="burgers">Burgers</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Description</label>
            <textarea name="description" rows={4} value={form.description} onChange={handleChange} className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-lg resize-y" />
          </div>
        </div>

        {/* Media Upload */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-4">Product Image</h2>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Image URL</label>
            <div className="flex gap-4">
              <input type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange} className="flex-1 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-lg" />
              <button type="button" className="btn-outline px-6 whitespace-nowrap flex items-center gap-2">
                <Upload size={16} /> Update Image
              </button>
            </div>
            {form.imageUrl && (
              <div className="mt-4 relative w-32 h-32 rounded-lg overflow-hidden border">
                <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Product Profile Sliders (Interactive for Admin Upload) */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-4">Product Profile</h2>
          <p className="text-sm text-gray-500 max-w-2xl mb-6">Adjust the sliders to define the meat's profile. This will be shown visually to customers on the product detail page.</p>

          <div className="space-y-6 max-w-md">
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                <span>Lean</span>
                <span>Fatty</span>
              </div>
              <input
                type="range"
                min={1} max={10}
                name="leanness"
                value={form.leanness}
                onChange={handleChange}
                className="attr-slider w-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                <span>Soft</span>
                <span>Firm</span>
              </div>
              <input
                type="range"
                min={1} max={10}
                name="firmness"
                value={form.firmness}
                onChange={handleChange}
                className="attr-slider w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                <span>Light</span>
                <span>Rich</span>
              </div>
              <input
                type="range"
                min={1} max={10}
                name="richness"
                value={form.richness}
                onChange={handleChange}
                className="attr-slider w-full"
              />
            </div>
          </div>
        </div>

        {/* Status / Settings */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-4">Status & Promos</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-gray-500">Badge</label>
              <input type="text" name="badge" value={form.badge} onChange={handleChange} className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-lg" />
            </div>
            <div className="flex items-center gap-3 h-full pt-6">
              <input type="checkbox" id="inStock" name="inStock" checked={form.inStock} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black" />
              <label htmlFor="inStock" className="text-sm font-bold">Product is In Stock</label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button type="submit" disabled={loading} className="btn-accent px-10 py-4 flex items-center gap-2 text-lg">
            <Save size={20} />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
