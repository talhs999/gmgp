"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import MegaMenu from "./MegaMenu";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "../ui/SearchOverlay";

const navLinks = [
  { label: "Today's Special", href: "/shop?tag=special" },
  { label: "Shop Meat", href: "/shop", hasMega: true },
  { label: "Membership", href: "/membership" },
  { label: "Info & FAQ", href: "/faq" },
  { label: "Find a Store", href: "/stores" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Behind GMGP", href: "/about" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const openDrawer = useCartStore((s) => s.openDrawer);
  const megaRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const needsSolidHeader = pathname !== "/" && pathname !== "/shop";
  const isSolid = scrolled || needsSolidHeader || megaOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isSolid ? "header-solid" : "header-transparent"
        }`}
      >
        {/* Top Row */}
        <nav className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Left Nav */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.slice(0, 4).map((link) => (
                <div key={link.label} className="relative" ref={link.hasMega ? megaRef : undefined}>
                  {link.hasMega ? (
                    <button
                      onMouseEnter={() => setMegaOpen(true)}
                      onMouseLeave={() => setMegaOpen(false)}
                      className={`flex items-center gap-1 text-xs font-semibold uppercase tracking-widest
                        hover:text-accent transition-colors ${isSolid ? "text-black" : "text-white"}`}
                    >
                      {link.label}
                      <ChevronDown size={14} className={`transition-transform ${megaOpen ? "rotate-180" : ""}`} />
                    </button>
                  ) : (
                    <Link
                      href={link.href}
                      className={`text-xs font-semibold uppercase tracking-widest hover:text-accent transition-colors
                        ${isSolid ? "text-black" : "text-white"}`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Logo — Center */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <span
                className={`font-black text-xl tracking-tight uppercase ${
                  isSolid ? "text-black" : "text-white"
                }`}
              >
                GMGP<span className="text-accent">.</span>
              </span>
            </Link>

            {/* Right Nav */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.slice(4).map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-xs font-semibold uppercase tracking-widest hover:text-accent transition-colors
                    ${isSolid ? "text-black" : "text-white"}`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Icons */}
              <button
                onClick={() => setSearchOpen(true)}
                className={`hover:text-accent transition-colors ${isSolid ? "text-black" : "text-white"}`}
              >
                <Search size={20} />
              </button>
              <Link
                href="/account"
                className={`hover:text-accent transition-colors ${isSolid ? "text-black" : "text-white"}`}
              >
                <User size={20} />
              </Link>
              <button
                onClick={openDrawer}
                className={`relative hover:text-accent transition-colors ${isSolid ? "text-black" : "text-white"}`}
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Right */}
            <div className="flex lg:hidden items-center gap-4">
              <button onClick={openDrawer} className={`relative ${isSolid ? "text-black" : "text-white"}`}>
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={isSolid ? "text-black" : "text-white"}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mega Menu */}
        {megaOpen && (
          <div
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <MegaMenu />
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-6 py-4 text-sm font-semibold uppercase tracking-widest text-black border-b border-gray-100 hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-6 px-6 py-4">
              <button onClick={() => { setSearchOpen(true); setMobileOpen(false); }}>
                <Search size={20} />
              </button>
              <Link href="/account"><User size={20} /></Link>
            </div>
          </div>
        )}
      </header>

      <CartDrawer />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
