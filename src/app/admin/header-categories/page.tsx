"use client";
import { useEffect, useState } from "react";
import { getCategories, updateCategory } from "@/lib/supabase-queries";
import { Category } from "@/lib/types";
import { Check, Edit2, Loader2, Image as ImageIcon, Plus, Link2, X } from "lucide-react";
import { ICON_MAP, AVAILABLE_ICONS } from "@/lib/icon-map";

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
    return { type: "url", value: imageUrl, color: "#000000", inHeader: false };
  }
  return { type: "empty", value: "", color: "#000000", inHeader: false };
};

export default function HeaderCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  // Edit Modal State
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [iconType, setIconType] = useState<"icon" | "url">("icon");
  const [selectedIcon, setSelectedIcon] = useState("Beef");
  const [iconColor, setIconColor] = useState("#000000");
  const [iconUrl, setIconUrl] = useState("");

  const load = () => getCategories().then((c) => { setCategories(c); setLoading(false); });
  useEffect(() => { load(); }, []);

  const openEditor = (cat: Category) => {
    const data = parseIconData(cat.image_url);
    if (data.type === "url") {
      setIconType("url");
      setIconUrl(data.value);
      setSelectedIcon("Beef");
      setIconColor("#000000");
    } else if (data.type === "icon") {
      setIconType("icon");
      setSelectedIcon(data.value || "Beef");
      setIconColor(data.color || "#000000");
      setIconUrl("");
    } else {
      setIconType("icon");
      setSelectedIcon("Beef");
      setIconColor("#000000");
      setIconUrl("");
    }
    setEditingCat(cat);
  };

  const toggleHeaderStatus = async (cat: Category, status: boolean) => {
    setSaving(cat.id);
    const data = parseIconData(cat.image_url);
    const updatedData = { ...data, inHeader: status };
    const jsonString = JSON.stringify(updatedData);
    await updateCategory(cat.id, { image_url: jsonString });
    setCategories(prev => prev.map(c => c.id === cat.id ? { ...c, image_url: jsonString } : c));
    setSaving(null);
  };

  const handleSave = async () => {
    if (!editingCat) return;
    setSaving(editingCat.id);
    
    let saveData: IconData;
    const currentData = parseIconData(editingCat.image_url);
    if (iconType === "icon") {
      saveData = { type: "icon", value: selectedIcon, color: iconColor, inHeader: currentData.inHeader };
    } else {
      saveData = { type: "url", value: iconUrl, color: "#000000", inHeader: currentData.inHeader };
    }

    const jsonString = JSON.stringify(saveData);
    await updateCategory(editingCat.id, { image_url: jsonString });
    
    setCategories(prev => prev.map(c => c.id === editingCat.id ? { ...c, image_url: jsonString } : c));
    setEditingCat(null);
    setSaving(null);
  };

  const renderIconPreview = (imageUrl: string | null) => {
    const data = parseIconData(imageUrl);
    if (data.type === "url" && data.value) {
      return <img src={data.value} alt="icon" className="w-8 h-8 object-contain" />;
    }
    if (data.type === "icon" && data.value) {
      const IconComponent = ICON_MAP[data.value];
      return IconComponent ? <IconComponent size={32} color={data.color || "#000000"} /> : <ImageIcon size={32} className="text-gray-300" />;
    }
    return <ImageIcon size={32} className="text-gray-200 border border-dashed rounded p-1" />;
  };

  const headerCategories = categories.filter(c => parseIconData(c.image_url).inHeader);
  const inactiveCategories = categories.filter(c => !parseIconData(c.image_url).inHeader);

  return (
    <div className="relative">
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tight">Header Menu Builder</h1>
        <p className="text-gray-500 text-sm mt-1">Select which categories appear in the top Mega Menu and format their appearance.</p>
      </div>

      {loading ? (
        <div className="bg-white p-6 rounded-xl border border-gray-100 flex items-center justify-center min-h-[300px]">
          <Loader2 className="animate-spin text-gray-400" size={32} />
        </div>
      ) : (
        <div className="space-y-12">
          {/* Active Header Items */}
          <div>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b pb-2 text-black">Active in Header ({headerCategories.length})</h2>
            {headerCategories.length === 0 ? (
              <div className="bg-orange-50 text-orange-600 p-6 rounded-xl border border-orange-100 text-sm font-semibold">
                No categories are currently displayed in your header. Add some from the list below!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {headerCategories.map((cat) => (
                  <div key={cat.id} className="bg-white p-6 rounded-xl border-2 border-green-100 shadow-sm flex flex-col items-center justify-center text-center group transition-all relative">
                    <button 
                      onClick={() => toggleHeaderStatus(cat, false)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                      title="Remove from Header"
                    >
                      {saving === cat.id ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                    </button>
                    
                    <div className="mb-4 w-16 h-16 flex items-center justify-center bg-gray-50 rounded-full border border-gray-100 transition-colors">
                      {renderIconPreview(cat.image_url)}
                    </div>
                    <h3 className="font-black text-lg mb-4">{cat.name}</h3>
                    
                    <button 
                      onClick={() => openEditor(cat)}
                      className="btn-outline w-full text-xs py-2 flex justify-center items-center gap-2"
                    >
                      <Edit2 size={14} /> Edit Icon
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inactive / Available Categories */}
          <div>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b pb-2 text-gray-400">Available Categories ({inactiveCategories.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 opacity-75 hover:opacity-100 transition-opacity">
              {inactiveCategories.map((cat) => (
                <div key={cat.id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                  <div className="font-bold text-sm text-gray-600">{cat.name}</div>
                  <button 
                    onClick={() => toggleHeaderStatus(cat, true)}
                    disabled={saving === cat.id}
                    className="flex items-center gap-1 bg-black text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded hover:bg-accent transition-colors"
                  >
                    {saving === cat.id ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-black uppercase tracking-tight">Edit Icon: <span className="text-accent">{editingCat.name}</span></h2>
              <button onClick={() => setEditingCat(null)} className="text-gray-400 hover:text-black transition-colors rounded-lg p-1 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Type Switcher */}
              <div className="flex gap-4 mb-6 p-1 bg-gray-100 rounded-lg w-full max-w-sm mx-auto">
                <button
                  onClick={() => setIconType("icon")}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${iconType === "icon" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"}`}
                >
                  Icon Grid
                </button>
                <button
                  onClick={() => setIconType("url")}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${iconType === "url" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"}`}
                >
                  Custom URL
                </button>
              </div>

              {iconType === "icon" ? (
                <div className="space-y-6">
                  {/* Color Picker */}
                  <div className="flex items-center gap-4 justify-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">Icon Color</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={iconColor} 
                        onChange={(e) => setIconColor(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                      />
                      <span className="text-sm font-mono text-gray-600 bg-white px-3 py-1 rounded border border-gray-200">{iconColor}</span>
                    </div>
                  </div>

                  {/* Icon Grid */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3 text-center">Select Icon</label>
                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 max-h-64 overflow-y-auto p-2">
                      {AVAILABLE_ICONS.map((iconName) => {
                        const IconComponent = ICON_MAP[iconName];
                        if (!IconComponent) return null;
                        const isSelected = selectedIcon === iconName;
                        return (
                          <button
                            key={iconName}
                            onClick={() => setSelectedIcon(iconName)}
                            className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-all ${isSelected ? "border-accent bg-red-50 text-accent scale-105" : "border-gray-100 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"}`}
                            title={iconName}
                          >
                            <IconComponent size={24} color={isSelected ? iconColor : "currentColor"} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                    <Link2 size={32} className="mx-auto text-gray-400 mb-3" />
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Paste Image URL</label>
                    <input 
                      type="url" 
                      value={iconUrl} 
                      onChange={(e) => setIconUrl(e.target.value)}
                      placeholder="https://example.com/icon.png"
                      className="w-full max-w-md mx-auto border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black rounded-lg text-center"
                    />
                    <p className="text-[10px] text-gray-400 mt-3">Supports .png, .jpg, .svg URLs</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
              <button 
                onClick={() => setEditingCat(null)}
                className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-black transition-colors"
                disabled={saving === editingCat.id}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={saving === editingCat.id}
                className="btn-primary flex items-center gap-2"
              >
                {saving === editingCat.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {saving === editingCat.id ? "Saving..." : "Save Icon"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
