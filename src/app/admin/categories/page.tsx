"use client";
import { useEffect, useState } from "react";
import { getCategories, createCategory, deleteCategory } from "@/lib/supabase-queries";
import { Category } from "@/lib/types";
import { Plus, Trash2, Tag } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [adding, setAdding] = useState(false);

  const load = () => getCategories().then((c) => { setCategories(c); setLoading(false); });
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    const slug = newSlug || newName.toLowerCase().replace(/\s+/g, "-");
    await createCategory({ name: newName, slug, image_url: null, sort_order: categories.length + 1 });
    setNewName(""); setNewSlug("");
    await load();
    setAdding(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tight">Categories</h1>
        <p className="text-gray-500 text-sm mt-1">{categories.length} categories</p>
      </div>

      {/* Add category */}
      <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Category Name *</label>
          <input required value={newName} onChange={(e) => setNewName(e.target.value)}
            className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-black rounded-lg"
            placeholder="e.g. Veal" />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Slug (auto)</label>
          <input value={newSlug} onChange={(e) => setNewSlug(e.target.value)}
            className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-black rounded-lg"
            placeholder="e.g. veal (auto-generated)" />
        </div>
        <button type="submit" disabled={adding} className="btn-primary flex items-center gap-2 py-2.5">
          <Plus size={16} /> {adding ? "Adding..." : "Add"}
        </button>
      </form>

      {/* Categories list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-400">
              <tr>
                <th className="text-left px-6 py-3">Name</th>
                <th className="text-left px-6 py-3">Slug</th>
                <th className="text-left px-6 py-3">Sort Order</th>
                <th className="text-right px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Tag size={14} className="text-gray-400" />
                      <span className="font-bold text-sm">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{cat.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cat.sort_order}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-500 hover:text-accent"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
