"use client";
import { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings } from "@/lib/supabase-queries";
import { SiteSettings } from "@/lib/types";
import { Truck, Save, Info, CheckCircle, AlertTriangle } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Partial<SiteSettings>>({
    perth_fee: 100,
    outside_fee: 200,
    free_threshold: 150,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    getSiteSettings().then((data) => {
      if (data) setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    const ok = await updateSiteSettings({
      perth_fee: Number(settings.perth_fee),
      outside_fee: Number(settings.outside_fee),
      free_threshold: Number(settings.free_threshold),
    });

    if (ok) {
      setMessage({ type: "success", text: "Settings updated successfully! These changes are now live." });
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    } else {
      setMessage({ type: "error", text: "Failed to update settings. Please check your connection." });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-8 text-center animate-pulse text-gray-500">
        <Truck className="mx-auto mb-4 opacity-20" size={48} />
        Loading Shipping Configurations...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Shipping Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage delivery charges and free shipping thresholds globally.</p>
        </div>
        <Truck className="text-gray-200" size={40} />
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
          message.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
        }`}>
          {message.type === "success" ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <p className="text-sm font-bold">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-bold uppercase tracking-widest text-xs text-gray-400 border-b pb-3">Perth Delivery Fee</h2>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Fee (AUD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                <input
                  type="number"
                  required
                  value={settings.perth_fee}
                  onChange={(e) => setSettings({ ...settings, perth_fee: Number(e.target.value) })}
                  className="w-full border border-gray-200 pl-8 p-3 rounded-xl focus:border-black focus:outline-none font-bold"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-2 italic">Applied to orders within the Perth metropolitan area.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-bold uppercase tracking-widest text-xs text-gray-400 border-b pb-3">Outside Perth Delivery Fee</h2>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Fee (AUD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                <input
                  type="number"
                  required
                  value={settings.outside_fee}
                  onChange={(e) => setSettings({ ...settings, outside_fee: Number(e.target.value) })}
                  className="w-full border border-gray-200 pl-8 p-3 rounded-xl focus:border-black focus:outline-none font-bold"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-2 italic">Applied to orders outside of Perth (Regional & Interstate).</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="font-bold uppercase tracking-widest text-xs text-gray-400 border-b pb-3">Free Delivery Threshold</h2>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Minimum Order Value (AUD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                <input
                  type="number"
                  required
                  value={settings.free_threshold}
                  onChange={(e) => setSettings({ ...settings, free_threshold: Number(e.target.value) })}
                  className="w-full border border-gray-200 pl-8 p-3 rounded-xl focus:border-black focus:outline-none font-bold"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-2 italic">Orders above this amount will have $0.00 delivery fee.</p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <div className="flex gap-3 text-blue-800">
              <Info size={20} className="shrink-0" />
              <div>
                <p className="text-sm font-bold uppercase tracking-tight mb-1">How it works</p>
                <p className="text-xs leading-relaxed opacity-80">
                  When a customer checks out, the system will check these values. If their subtotal is 
                  above the <strong>Free Threshold</strong>, delivery is free. Otherwise, the specific 
                  regional fee is added.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-black/10 disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? "Saving Changes..." : "Save Shipping Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
