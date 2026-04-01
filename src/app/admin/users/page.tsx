"use client";
import { useEffect, useState } from "react";
import { getAllProfiles, softDeleteProfile, updateUserRole, updateAllowedTabs } from "@/lib/supabase-queries";
import { Profile } from "@/lib/types";
import { Users, Shield, User as UserIcon, Trash2, Settings, Check, X, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const ADMIN_TABS = [
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders" },
  { id: "categories", label: "Categories" },
  { id: "coupons", label: "Coupons" },
  { id: "settings", label: "Shipping" },
  { id: "reviews", label: "Reviews" },
  { id: "users", label: "Users" },
];

export default function AdminUsersPage() {
  const { user, isSuperAdmin } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleted, setShowDeleted] = useState(false);

  // Edit State
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [editingTabs, setEditingTabs] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    const data = await getAllProfiles();
    setProfiles(data);
    setLoading(false);
  };

  const handleDelete = async (p: Profile) => {
    if (p.id === user?.id) return alert("You cannot delete yourself.");
    
    // Logic: Admin can't delete Super Admin
    if (!isSuperAdmin && p.role === 'super_admin') {
      return alert("You do not have permission to delete a Super Admin.");
    }

    const confirmMsg = p.deleted_at 
      ? `Are you sure you want to PERMANENTLY delete this record?` 
      : `Are you sure you want to delete ${p.full_name || 'this user'}? This will be marked in the admin panel.`;
    
    if (!confirm(confirmMsg)) return;

    const ok = await softDeleteProfile(p.id);
    if (ok) {
      loadProfiles();
    } else {
      alert("Delete failed.");
    }
  };

  const handleRoleChange = async (id: string, newRole: any) => {
    if (!isSuperAdmin) return;
    if (id === user?.id) return alert("You cannot change your own role.");
    
    if (!confirm(`Change role to ${newRole.toUpperCase()}?`)) return;
    
    const ok = await updateUserRole(id, newRole);
    if (ok) loadProfiles();
    else alert("Update failed.");
  };

  const handleSaveTabs = async () => {
    if (!editingProfile || !isSuperAdmin) return;
    setIsUpdating(true);
    const ok = await updateAllowedTabs(editingProfile.id, editingTabs);
    if (ok) {
      loadProfiles();
      setEditingProfile(null);
    } else {
      alert("Update failed.");
    }
    setIsUpdating(false);
  };

  const filteredProfiles = profiles.filter(p => showDeleted ? !!p.deleted_at : !p.deleted_at);

  return (
    <div className="pb-20">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Users</h1>
          <p className="text-gray-500 text-sm mt-1">{profiles.length} total users</p>
        </div>
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100">
          <button 
            onClick={() => setShowDeleted(false)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${!showDeleted ? "bg-black text-white" : "text-gray-500 hover:text-black"}`}
          >
            Active
          </button>
          <button 
            onClick={() => setShowDeleted(true)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${showDeleted ? "bg-red-600 text-white" : "text-gray-500 hover:text-red-600"}`}
          >
            Deleted Accounts
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="p-16 text-center">
            <Users size={40} className="mx-auto text-gray-200 mb-4" />
            <p className="font-bold text-gray-400">No {showDeleted ? 'deleted' : 'active'} users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-400">
                <tr>
                  <th className="text-left px-6 py-4">User</th>
                  <th className="text-left px-6 py-4">Phone</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Role</th>
                  <th className="text-left px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProfiles.map((p) => (
                  <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${p.deleted_at ? "bg-red-50/20" : ""}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${p.deleted_at ? 'bg-red-100' : 'bg-gray-100'}`}>
                          <UserIcon size={16} className={p.deleted_at ? 'text-red-500' : 'text-gray-400'} />
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${p.deleted_at ? 'text-red-900' : ''}`}>{p.full_name || "—"}</p>
                          {p.deleted_at && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">Self-Deleted: {new Date(p.deleted_at).toLocaleDateString()}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{p.phone || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-full ${
                        p.deleted_at ? 'bg-red-100 text-red-700' : p.is_member ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {p.deleted_at ? "Inactive" : p.is_member ? "Member" : "Standard"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isSuperAdmin && p.id !== user?.id && !p.deleted_at ? (
                        <select 
                          value={p.role || (p.is_admin ? 'admin' : 'customer')}
                          onChange={(e) => handleRoleChange(p.id, e.target.value)}
                          className="text-xs font-bold bg-gray-50 border-gray-200 rounded-lg p-2 focus:ring-0"
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      ) : (
                        <span className={`flex items-center gap-1.5 text-[11px] font-black uppercase ${
                          p.role === 'super_admin' ? 'text-purple-700 bg-purple-100' : 
                          p.role === 'admin' ? 'text-blue-700 bg-blue-100' : 'text-gray-500 bg-gray-100'
                        } px-2.5 py-1 rounded-full w-fit`}>
                          {p.role === 'super_admin' ? <Shield size={10} /> : <UserIcon size={10} />}
                          {p.role || (p.is_admin ? 'admin' : 'customer')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {isSuperAdmin && p.role === 'admin' && !p.deleted_at && (
                          <button 
                            onClick={() => { setEditingProfile(p); setEditingTabs(p.allowed_tabs || []); }}
                            className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                            title="Set Tab Permissions"
                          >
                            <Settings size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(p)}
                          disabled={p.id === user?.id || (!isSuperAdmin && p.role === 'super_admin')}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-0"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Permissions Modal */}
      {editingProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl animate-in zoom-in duration-200">
            <h3 className="text-xl font-black uppercase mb-2">Edit Permissions</h3>
            <p className="text-gray-500 text-sm mb-6">Select which tabs <b>{editingProfile.full_name}</b> can access in the Admin Panel.</p>
            
            <div className="space-y-2 mb-8">
              {ADMIN_TABS.map((tab) => {
                if (tab.id === 'dashboard') return null;
                const isAllowed = editingTabs.includes(tab.id);
                return (
                  <label key={tab.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer group hover:bg-gray-100 transition-colors">
                    <span className="font-bold text-sm">{tab.label}</span>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isAllowed}
                      onChange={() => {
                        setEditingTabs(prev => isAllowed ? prev.filter(t => t !== tab.id) : [...prev, tab.id]);
                      }}
                    />
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${isAllowed ? 'bg-black text-white' : 'bg-white border-2 border-gray-200'}`}>
                      {isAllowed && <Check size={14} />}
                    </div>
                  </label>
                );
              })}
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setEditingProfile(null)}
                className="flex-1 py-3 font-bold uppercase tracking-widest text-xs border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveTabs}
                disabled={isUpdating}
                className="flex-1 py-3 font-bold uppercase tracking-widest text-xs bg-black text-white rounded-lg hover:bg-zinc-800 disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
