import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";

const footerLinks = {
  SHOP: [
    { label: "All Products", href: "/shop" },
    { label: "Beef", href: "/shop/beef" },
    { label: "Lamb", href: "/shop/lamb" },
    { label: "Chicken", href: "/shop/chicken" },
    { label: "BBQ Packs", href: "/shop/bbq" },
    { label: "Wagyu", href: "/shop/wagyu" },
    { label: "Best Sellers", href: "/shop?tag=best-seller" },
  ],
  "CUSTOMER SERVICE": [
    { label: "FAQ", href: "/faq" },
    { label: "Delivery Info", href: "/delivery" },
    { label: "Track Order", href: "/account/orders" },
    { label: "Returns Policy", href: "/returns" },
    { label: "Contact Us", href: "/contact" },
  ],
  "ABOUT GMGP": [
    { label: "Our Story", href: "/about" },
    { label: "Membership", href: "/membership" },
    { label: "Wholesale", href: "/wholesale" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container-custom">
        {/* Newsletter */}
        <div className="text-center mb-14 border-b border-white/10 pb-14">
          <h3 className="section-title text-white mb-2">KEEP UP TO DATE</h3>
          <p className="text-gray-400 text-sm mb-6">
            Subscribe for weekly specials, new arrivals & exclusive deals
          </p>
          <form className="flex gap-0 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="bg-accent text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-accent-dark transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <span className="font-black text-2xl tracking-tight uppercase">
              GMGP<span className="text-accent">.</span>
            </span>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              Premium quality Australian meats, delivered to your door every Saturday.
            </p>
            <div className="flex gap-4 mt-5">
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="text-gray-400 hover:text-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer"
                className="text-gray-400 hover:text-accent transition-colors">
                <Facebook size={20} />
              </a>
              {/* TikTok */}
              <a href="https://tiktok.com" target="_blank" rel="noreferrer"
                className="text-gray-400 hover:text-accent transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-4 text-gray-400">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-300 hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} GMGP Premium Meats. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-gray-600 text-xs">
            {["VISA", "MC", "AMEX", "PAYPAL", "AFTERPAY"].map((p) => (
              <span key={p} className="border border-white/20 px-2 py-1 rounded text-[10px] font-bold text-gray-400">
                {p}
              </span>
            ))}
          </div>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
