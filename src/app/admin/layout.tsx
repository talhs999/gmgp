"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Package, ShoppingBag, Tag, Users, LogOut, ChevronRight, Truck, X, Menu,
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
      <div className="lg:hidden sticky top-0 left-0 right-0 z-[60] bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between shadow-sm">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 bg-black text-white rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 group"
          aria-label="Toggle Menu"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          <span className="text-[10px] font-black uppercase tracking-widest pr-1">Menu</span>
        </button>
        <span className="font-black text-lg tracking-tight uppercase">
          GMGP<span className="text-accent">.</span>
          <span className="text-[10px] font-normal text-gray-400 ml-2 italic">Admin</span>
        </span>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-[2px] transition-all"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed lg:sticky top-0 h-screen w-72 bg-white lg:border-r border-gray-200 
        flex flex-col z-[70] transition-all duration-500 ease-in-out no-print shadow-2xl lg:shadow-none
        ${sidebarOpen ? "translate-x-0 right-0" : "translate-x-full lg:translate-x-0 right-0"}
      `}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between md:h-16">
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-black">
            <X size={24} />
          </button>
          <span className="font-black text-xl tracking-tight uppercase text-right lg:text-left w-full">
            GMGP<span className="text-accent">.</span>
            <span className="text-xs font-normal text-gray-400 ml-2">Admin</span>
          </span>
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
          <Link href="/" className="admin-sidebar-link group" onClick={() => setSidebarOpen(false)}>
            <LogOut size={18} className="group-hover:text-accent transition-colors" />
            <span>Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-4 md:p-8 pt-6 md:pt-8 w-full max-w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Secondary Admin Toggle (Requested) */}
          <div className="mb-6 lg:mb-8 flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="px-4 py-2 bg-black text-white rounded-lg shadow-md hover:bg-zinc-800 transition-all flex items-center gap-2 group"
            >
              <Menu size={18} className="group-hover:rotate-180 transition-transform duration-300" />
              <span className="text-[10px] font-black uppercase tracking-widest">Admin Menu</span>
            </button>
            <div className="h-px flex-1 bg-gray-100 hidden sm:block"></div>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
