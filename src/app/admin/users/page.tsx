"use client";
import { useEffect, useState } from "react";
import { getAllProfiles } from "@/lib/supabase-queries";
import { Profile } from "@/lib/types";
import { Users, Shield, User as UserIcon } from "lucide-react";

export default function AdminUsersPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProfiles().then((data) => { setProfiles(data); setLoading(false); });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tight">Users</h1>
        <p className="text-gray-500 text-sm mt-1">{profiles.length} registered users</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="p-16 text-center">
            <Users size={40} className="mx-auto text-gray-200 mb-4" />
            <p className="font-bold text-gray-400">No registered users yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-bold uppercase tracking-widest text-gray-400">
              <tr>
                <th className="text-left px-6 py-3">User</th>
                <th className="text-left px-6 py-3">Phone</th>
                <th className="text-left px-6 py-3">Member</th>
                <th className="text-left px-6 py-3">Role</th>
                <th className="text-left px-6 py-3">Joined</th>
                <th className="text-left px-6 py-3">Referral Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {profiles.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <UserIcon size={14} className="text-gray-400" />
                      </div>
                      <span className="font-semibold text-sm">{p.full_name || "—"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{p.phone || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${
                      p.is_member ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {p.is_member ? "Member" : "Standard"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {p.is_admin ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded-full w-fit">
                        <Shield size={10} /> Admin
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Customer</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(p.created_at).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">{p.referral_code || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
