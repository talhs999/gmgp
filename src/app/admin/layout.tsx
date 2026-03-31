"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Package, ShoppingBag, Tag, Users, LogOut, ChevronRight, Truck, X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/settings", label: "Shipping", icon: Truck },
  { href: "/admin/reviews", label: "Reviews", icon: ShoppingBag },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isAdmin, loading } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }
      if (profile && !isAdmin) {
        router.push("/");
      }
    }
  }, [user, isAdmin, loading, router, profile]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative">
      {/* Mobile Sticky Header */}
      <div className="md:hidden sticky top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between shadow-sm">
        <span className="font-black text-lg tracking-tight uppercase">
          GMGP<span className="text-accent">.</span>
          <span className="text-[10px] font-normal text-gray-400 ml-2">Admin</span>
        </span>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2.5 bg-black text-white rounded-xl shadow-md transition-transform active:scale-95"
          aria-label="Toggle Menu"
        >
          {sidebarOpen ? <X size={20} /> : <div className="flex flex-col gap-1 w-5"><div className="h-0.5 bg-white"></div><div className="h-0.5 bg-white w-3"></div><div className="h-0.5 bg-white"></div></div>}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-[2px] transition-all"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 h-screen w-64 bg-white border-r border-gray-200 
        flex flex-col z-[45] transition-all duration-300 no-print shadow-xl md:shadow-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between md:h-16">
          <span className="font-black text-xl tracking-tight uppercase">
            GMGP<span className="text-accent">.</span>
            <span className="text-xs font-normal text-gray-400 ml-2">Admin</span>
          </span>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-black">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`admin-sidebar-link ${active ? "active" : ""}`}
              >
                <Icon size={18} />
                <span>{label}</span>
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link href="/" className="admin-sidebar-link group">
            <LogOut size={18} className="group-hover:text-accent transition-colors" />
            <span>Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-4 md:p-8 pt-6 md:pt-8 w-full max-w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
