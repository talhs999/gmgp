"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Tag, Users, LogOut, ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (!isAdmin) router.push("/");
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 pt-16">
      {/* Sidebar */}
      <aside className="w-64 fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 flex flex-col overflow-y-auto z-40">
        <div className="p-5 border-b border-gray-100">
          <span className="font-black text-xl tracking-tight uppercase">
            GMGP<span className="text-accent">.</span>
            <span className="text-xs font-normal text-gray-400 ml-2">Admin</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
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
          <a href="/" className="admin-sidebar-link">
            <LogOut size={18} />
            Back to Store
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
