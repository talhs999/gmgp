"use client";
import Link from "next/link";
import { ArrowUp, MessageCircle, Send, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

/* ================================================================== */
/*  GMGP BUSINESS KNOWLEDGE BASE                                       */
/* ================================================================== */
const KB = {
  business: {
    name: "GMGP Premium Meats",
    tagline: "Australia's Best Online Butcher",
    email: "support@gmgp.com.au",
    phone: "+61 (08) 0000 0000",
    location: "Perth, Western Australia, Australia",
    halal: true,
    currency: "AUD",
    website: "https://gmgp.com.au",
  },

  delivery: {
    day: "Saturday",
    perth_fee: "$0 (free for orders over $100) or A$10 flat delivery fee",
    outside_perth_fee: "A$15–$25 depending on location",
    cutoff: "Thursday midnight",
    time_range: "8am–6pm Saturday",
    packaging: "Vacuum-skin sealed, stays fresh up to 28 days in fridge, 12 months in freezer",
    areas: "Australia-wide, with Saturday delivery for Perth metro",
  },

  checkout: {
    payment_methods: ["Credit / Debit Card (Stripe)", "Cash on Delivery (Perth only)"],
    steps: [
      "1. Browse shop and add products to cart",
      "2. View cart and adjust quantities",
      "3. Click Checkout and fill in delivery address",
      "4. Choose payment method (Card or Cash on Delivery)",
      "5. Place order — you'll receive an email confirmation",
      "6. Your order is delivered on Saturday",
    ],
    min_order: "No minimum order",
    returns: "If meat arrives damaged or not fresh, contact us within 24hrs for a replacement or refund",
  },

  membership: {
    benefits: ["10% off all orders", "$10 referral credit for you and friend", "Early access to new products", "Free delivery priority"],
    price: "Free to join",
    how: "Click 'Join Membership' on our website",
  },

  products: {
    categories: ["Beef", "Lamb", "Pork", "Chicken", "BBQ Packs", "Wagyu", "Sausages", "Burgers", "Marinated", "Halal", "Gift Packs"],
    highlights: [
      { name: "Wagyu Ribeye Steak MB5+", price: "A$89.99", category: "Beef/Wagyu", badge: "ALL-TIME FAVOURITE" },
      { name: "Black Angus Tenderloin Fillet", price: "A$64.99", category: "Beef" },
      { name: "Premium Beef Mince 5-Star", price: "A$18.99", category: "Beef", badge: "BEST VALUE" },
      { name: "Beef Short Ribs (Korean Style)", price: "A$34.99", category: "Beef", badge: "BBQ FAVOURITE" },
      { name: "T-Bone Steak 500g", price: "A$42.99", category: "Beef" },
      { name: "Lamb Shoulder Chops Pack", price: "A$29.99", category: "Lamb", badge: "ALL-TIME FAVOURITE" },
      { name: "Lamb Rack – French Trimmed", price: "A$54.99", category: "Lamb", badge: "PREMIUM" },
      { name: "Lamb Leg Bone-In", price: "A$39.99", category: "Lamb", badge: "FAMILY PACK" },
      { name: "Pork Belly Strips", price: "A$22.99", category: "Pork", badge: "BBQ MUST-HAVE" },
      { name: "Pork Spare Ribs Full Rack", price: "A$32.99", category: "Pork" },
      { name: "Chicken Maryland Pack", price: "A$16.99", category: "Chicken", badge: "FAMILY PACK" },
      { name: "Chicken Thigh Fillets Skinless", price: "A$14.99", category: "Chicken" },
      { name: "Whole Free Range Chicken", price: "A$21.99", category: "Chicken", badge: "FREE RANGE" },
      { name: "Ultimate BBQ Party Pack", price: "A$79.99 (was $109.99)", category: "BBQ Packs", badge: "BEST SELLER" },
      { name: "Weekend BBQ Essentials Pack", price: "A$54.99 (was $74.99)", category: "BBQ Packs" },
      { name: "Family Grill Pack x8", price: "A$44.99", category: "BBQ Packs", badge: "FAMILY VALUE" },
      { name: "Wagyu Striploin MB9 200g", price: "A$129.99", category: "Wagyu", badge: "LUXURY" },
      { name: "Wagyu Flat Iron Steak MB5", price: "A$59.99", category: "Wagyu" },
      { name: "Angus Beef Sausages 500g", price: "A$12.99", category: "Sausages" },
      { name: "Lamb Merguez Sausages", price: "A$14.99", category: "Sausages" },
      { name: "Wagyu Beef Burger Patties 4-Pack", price: "A$29.99", category: "Burgers", badge: "MUST TRY" },
      { name: "Smash Burger Patties 6-Pack", price: "A$19.99", category: "Burgers" },
      { name: "Greek Lemon-Herb Lamb Cutlets", price: "A$32.99", category: "Marinated", badge: "READY TO COOK" },
      { name: "Teriyaki Chicken Wings 1kg", price: "A$19.99", category: "Marinated" },
      { name: "Halal Beef Shawarma Pack", price: "A$24.99", category: "Halal", badge: "✅ HALAL" },
      { name: "Halal Lamb Kofta Mix 500g", price: "A$18.99", category: "Halal", badge: "✅ HALAL" },
      { name: "The Steak Lover Gift Box", price: "A$149.99 (was $199.99)", category: "Gift Packs", badge: "GIFT READY" },
      { name: "Beef Cheeks Slow Braise Pack", price: "A$27.99", category: "Beef" },
      { name: "Premium Rump Steak 400g", price: "A$24.99", category: "Beef" },
      { name: "Chicken Breast Fillets 1kg", price: "A$18.99", category: "Chicken" },
    ],
    valueItems: ["Beef Mince (A$18.99)", "Chicken Thighs (A$14.99)", "Lamb Kofta (A$18.99)", "Smash Burger Patties (A$19.99)"],
    premiumItems: ["Wagyu MB9 Striploin (A$129.99)", "Steak Lover Gift Box (A$149.99)", "Wagyu Ribeye MB5+ (A$89.99)"],
  },

  security: {
    admin_phrases: ["admin password", "admin login", "admin credentials", "admin access", "bypass", "hack", "inject", "sql", "exploit", "database password", "api key", "secret key", "env", ".env", "config", "supabase", "token", "jwt", "session"],
    blocked_topics: ["competitor pricing", "staff salaries", "financial reports", "internal data", "order data of other users"],
  },
};

/* ================================================================== */
/*  Smart rule-based NLP engine                                        */
/* ================================================================== */
function getBotReply(msg: string): string {
  const q = msg.toLowerCase().trim();

  // ── SECURITY GUARDRAILS ───────────────────────────────────────────
  if (KB.security.admin_phrases.some((p) => q.includes(p))) {
    return "⚠️ Sorry, I can't help with that. For account or security issues please contact our team at support@gmgp.com.au.";
  }
  if (KB.security.blocked_topics.some((p) => q.includes(p))) {
    return "Sorry, I'm not able to share that information. I'm here to help with products, delivery, and orders!";
  }

  // ── GREETINGS ─────────────────────────────────────────────────────
  if (/\b(hi|hello|hey|assalam|salam|hiya|howdy|hy|aoa)\b/.test(q)) {
    return "👋 Hello! Welcome to GMGP Premium Meats — Australia's finest online butcher! How can I help you today? You can ask me about:\n• Products & prices\n• Delivery info\n• How to checkout\n• Memberships";
  }

  // ── HALAL ─────────────────────────────────────────────────────────
  if (/halal/.test(q)) {
    return "✅ Yes! ALL our meat is 100% Halal certified. We have a dedicated Halal category with items like:\n• Halal Beef Shawarma Pack — A$24.99\n• Halal Lamb Kofta Mix — A$18.99\n\nYou can filter by Halal on our Shop page.";
  }

  // ── DELIVERY ─────────────────────────────────────────────────────
  if (/deliver|shipping|postage|dispatch|when.*arrive|arrive.*when|saturday/.test(q)) {
    return `🚚 Delivery Info:\n• We deliver on **Saturdays** (8am–6pm)\n• Perth metro: Free/flat rate\n• Outside Perth: A$15–$25\n• Order cutoff: **Thursday midnight**\n• Packaging: Vacuum-skin sealed — stays fresh 28 days in fridge, 12 months frozen\n\nMissed the cutoff? Your order ships the following Saturday!`;
  }

  // ── LOCATION ─────────────────────────────────────────────────────
  if (/location|where.*you|address|perth|australia|shop.*where|where.*shop/.test(q)) {
    return `📍 We're based in **Perth, Western Australia**. We deliver Australia-wide!\n• Perth Saturday delivery (free/flat fee)\n• Australia-wide shipping available\n\nCheck gmgp.com.au for your specific suburb.`;
  }

  // ── CHECKOUT ─────────────────────────────────────────────────────
  if (/checkout|check.?out|how.*order|order.*how|pay|payment|place.*order|buy|purchase/.test(q)) {
    return `🛒 How to order:\n1. Browse our Shop and add items to cart\n2. Click the cart icon → Review items\n3. Click **Checkout** → Enter delivery address\n4. Choose payment: **Card (Stripe)** or **Cash on Delivery** (Perth only)\n5. Place order → Get email confirmation\n6. Relax — your meat arrives Saturday! 🥩`;
  }

  // ── PAYMENT ──────────────────────────────────────────────────────
  if (/cash|card|credit|debit|stripe|eftpos|paypal/.test(q)) {
    return "💳 We accept:\n• **Credit/Debit Card** (via Stripe — secure)\n• **Cash on Delivery** (Perth metro only)\n\nNo PayPal currently. Card payment is recommended for fastest processing.";
  }

  // ── MEMBERSHIP / REFERRAL ─────────────────────────────────────────
  if (/member|membership|referral|refer|10 dollar|\$10|credit|reward/.test(q)) {
    return "💎 **GMGP Membership — FREE to join!**\n• 10% off all orders\n• \$10 referral credit (for you + your friend)\n• Early access to new products\n• Priority delivery\n\nClick **Join Membership** at the bottom of the page to sign up!";
  }

  // ── WAGYU ─────────────────────────────────────────────────────────
  if (/wagyu|mb9|mb5|marble|luxury/.test(q)) {
    return "⭐ Our Wagyu Selection:\n• **Wagyu Ribeye MB5+** — A$89.99 (All-Time Favourite!)\n• **Wagyu Flat Iron MB5** — A$59.99 (New!)\n• **Wagyu Striploin MB9** — A$129.99 (Ultra Luxury)\n• **Wagyu Burger Patties 4-pack** — A$29.99\n\nWagyu = melt-in-your-mouth marbling. Worth every cent! 🔥";
  }

  // ── STEAK ─────────────────────────────────────────────────────────
  if (/steak|ribeye|sirloin|tenderloin|fillet|t.bone|rump|striploin/.test(q)) {
    return "🥩 Our Steaks:\n• **Wagyu Ribeye MB5+** — A$89.99 (FAVOURITE)\n• **Black Angus Tenderloin** — A$64.99\n• **T-Bone Steak 500g** — A$42.99\n• **Premium Rump Steak 400g** — A$24.99\n• **Wagyu Striploin MB9** — A$129.99\n\nFor a date night → Wagyu Ribeye. Everyday → Rump Steak great value!";
  }

  // ── LAMB ─────────────────────────────────────────────────────────
  if (/lamb|cutlet|chop.*lamb|rack|leg.*lamb/.test(q)) {
    return "🐑 Our Lamb Cuts:\n• **Lamb Shoulder Chops** — A$29.99 (BBQ fav!)\n• **Lamb Rack French Trimmed** — A$54.99\n• **Lamb Leg Bone-In** — A$39.99\n• **Greek Lemon-Herb Lamb Cutlets** (marinated) — A$32.99\n• **Halal Lamb Kofta Mix** — A$18.99\n\nBest for BBQ? → Lamb Shoulder Chops! 🔥";
  }

  // ── BBQ ──────────────────────────────────────────────────────────
  if (/bbq|grill|barbecue|bbq pack|party/.test(q)) {
    return "🔥 BBQ Packs (great value!):\n• **Ultimate BBQ Party Pack** — A$79.99 (was $109.99) — burgers, chops, wings, ribs, snags!\n• **Weekend BBQ Essentials** — A$54.99 (was $74.99) — 4 rump steaks, lamb cutlets, chicken wings, sausages\n• **Family Grill Pack x8** — A$44.99\n\nBest value? → Ultimate BBQ Party Pack saves you $30!";
  }

  // ── CHICKEN ──────────────────────────────────────────────────────
  if (/chicken|thigh|breast|wing|maryland|free.range/.test(q)) {
    return "🍗 Our Chicken Range:\n• **Chicken Breast Fillets 1kg** — A$18.99\n• **Chicken Thigh Fillets Skinless** — A$14.99 ← Best value!\n• **Chicken Maryland Pack** — A$16.99\n• **Whole Free Range Chicken** — A$21.99\n• **Teriyaki Chicken Wings 1kg** (marinated) — A$19.99\n\nFor karahi/biryani → Thigh Fillets are perfect!";
  }

  // ── PORK ─────────────────────────────────────────────────────────
  if (/pork|bacon|rib.*pork|belly|spar.*rib/.test(q)) {
    return "🐷 Our Pork Cuts:\n• **Pork Belly Strips 500g** — A$22.99 (BBQ Must-Have!)\n• **Pork Spare Ribs Full Rack** — A$32.99 (was $44.99)\n• **Pork Neck Collar Steak** — A$19.99 (Thai BBQ style!)\n\nBest for slow cook BBQ → Belly Strips low & slow = crispy perfection!";
  }

  // ── SAUSAGES / BURGERS ───────────────────────────────────────────
  if (/sausage|snag|burger|patt(y|ies)|mince/.test(q)) {
    return "🌭 Sausages & Burgers:\n• **Angus Beef Sausages 500g** — A$12.99\n• **Lamb Merguez Sausages** — A$14.99\n• **Wagyu Beef Burger Patties 4-pack** — A$29.99 ← MUST TRY\n• **Smash Burger Patties 6-pack** — A$19.99 (Trending!)\n• **Premium Beef Mince 5-Star** — A$18.99";
  }

  // ── GIFT ─────────────────────────────────────────────────────────
  if (/gift|present|box|occasion|special/.test(q)) {
    return "🎁 Perfect Gift Idea:\n• **The Steak Lover Gift Box** — A$149.99 (was $199.99)\n  Includes 2x Wagyu Ribeye, 2x Angus Tenderloin, 2x Premium Sirloin\n  All vacuum-sealed in premium packaging — perfect gift!\n\nWant something at a lower price? Our BBQ Packs also make great gifts!";
  }

  // ── PRICE / CHEAP / VALUE ─────────────────────────────────────────
  if (/cheap|value|budget|afford|cheapest|best.*price|price.*best/.test(q)) {
    return "💰 Best Value Picks:\n• Chicken Thigh Fillets — A$14.99\n• Angus Beef Sausages — A$12.99\n• Premium Beef Mince — A$18.99\n• Chicken Breast 1kg — A$18.99\n• Halal Lamb Kofta — A$18.99\n\nAlso check our **BBQ Packs** — they save up to $30 vs buying individual cuts!";
  }

  // ── BIRYANI / KARAHI / CURRY ──────────────────────────────────────
  if (/biryani|curry|karahi|masala|desi|pakistani|indian/.test(q)) {
    return "😋 Best cuts for desi cooking:\n• **Biryani** → Beef Mince or Chicken Thighs (cut small)\n• **Karahi** → Chicken Thigh Fillets Skinless (A$14.99) — stays juicy!\n• **Nihari/Stew** → Beef Cheeks (A$27.99) or Oxtail (A$22.99)\n• **Kofta** → Halal Lamb Kofta Mix (A$18.99) ready to use!\n\nAll our meat is 100% Halal ✅";
  }

  // ── SLOW COOK / ROAST ─────────────────────────────────────────────
  if (/slow.?cook|braise|stew|roast|oven/.test(q)) {
    return "🍲 Best for Slow Cooking & Roasts:\n• **Beef Cheeks** — A$27.99 (silky braised perfection)\n• **Oxtail Braising Pack** — A$22.99\n• **Lamb Leg Bone-In** — A$39.99 (perfect Sunday roast!)\n• **Pork Spare Ribs** — A$32.99\n\nPro tip: Beef cheeks + red wine + 6hrs = restaurant quality! 🍷";
  }

  // ── FRESH / QUALITY ───────────────────────────────────────────────
  if (/fresh|quality|premium|grass.?fed|free.?range|australian|100%/.test(q)) {
    return "✅ Quality Guarantee:\n• 100% Australian-sourced meat\n• Vacuum-skin sealed (freshness locked in)\n• Up to 28 days fresh in fridge, 12 months in freezer\n• No fillers, no additives — just premium meat\n• 100% Halal certified\n\nNot happy? Contact us within 24hrs for a replacement or refund!";
  }

  // ── RETURN / REFUND ───────────────────────────────────────────────
  if (/return|refund|replace|wrong|damaged|bad|not fresh|complaint/.test(q)) {
    return "We're sorry to hear that! 😟 Here's our process:\n• Contact us within **24 hours** of delivery\n• Email: support@gmgp.com.au\n• We offer a **replacement or full refund** for damaged/not-fresh orders\n• Our team responds within 1 business day";
  }

  // ── CONTACT ───────────────────────────────────────────────────────
  if (/contact|email|phone|call|reach|support|help.*team/.test(q)) {
    return "📞 Contact Us:\n• Email: support@gmgp.com.au\n• Phone: +61 (08) 0000 0000\n• Location: Perth, Western Australia\n• Website: gmgp.com.au\n\nOur team responds within 1 business day!";
  }

  // ── ACCOUNT / LOGIN ───────────────────────────────────────────────
  if (/account|sign.?up|register|login|log.?in|password|forgot/.test(q)) {
    return "👤 Account Help:\n• Click **Login** in the top navigation\n• New customer? Click **Sign Up** to create an account\n• Forgot password? Use the 'Forgot Password' link on the login page\n\nWith an account you can track orders, save addresses, and manage your membership!";
  }

  // ── ORDER STATUS / TRACKING ───────────────────────────────────────
  if (/order.*status|track.*order|where.*order|my.*order|status.*order/.test(q)) {
    return "📦 Order Tracking:\n• Log into your account → Click **My Orders**\n• You'll see order status: Pending → Confirmed → Preparing → Delivered\n• You'll also get an email confirmation when your order is placed\n\nDelivery is always on **Saturday** 8am–6pm!";
  }

  // ── CANCEL ORDER ─────────────────────────────────────────────────
  if (/cancel|cancell/.test(q)) {
    return "❌ Cancellations:\n• Go to My Account → My Orders → Click Cancel\n• You can cancel before **Thursday midnight** (delivery cutoff)\n• After that, orders are preparing for Saturday delivery\n• For late cancellations, email: support@gmgp.com.au";
  }

  // ── PRODUCTS / CATEGORIES OVERVIEW ───────────────────────────────
  if (/product|categor|what.*sell|what.*have|menu|range/.test(q)) {
    return "🥩 We sell 30+ premium cuts across:\n\n🐄 Beef | 🐑 Lamb | 🐷 Pork | 🍗 Chicken | 🔥 BBQ Packs | ⭐ Wagyu | 🌭 Sausages | 🍔 Burgers | 🌿 Marinated | ✅ Halal | 🎁 Gift Packs\n\nPrices from A$12.99 to A$149.99. Visit our **Shop** page to browse everything!";
  }

  // ── THANKS / BYE ─────────────────────────────────────────────────
  if (/thank|thanks|thankyou|bye|goodbye|ok|okay|cheers|great|awesome|perfect/.test(q)) {
    return "😊 You're welcome! Happy shopping at GMGP 🥩\nEnjoy your order and don't forget — all deliveries are on **Saturday**!\n\nAny more questions? I'm right here! 🙌";
  }

  // ── FALLBACK ─────────────────────────────────────────────────────
  return "Hmm, I'm not sure about that one! 🤔 You can ask me about:\n\n• 🥩 Products & prices\n• 🚚 Delivery info & areas\n• 🛒 How to checkout\n• 💳 Payment methods\n• 💎 Membership benefits\n• 📞 Contact details\n\nOr email us at **support@gmgp.com.au** and our team will help!";
}

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */
interface Message {
  role: "bot" | "user";
  text: string;
}

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "👋 Hi! Welcome to **GMGP Premium Meats**!\n\nI can help with products, prices, delivery, and checkout. What do you need?",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (chatOpen) scrollToBottom();
  }, [messages, chatOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotReply(userMsg);
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
      setIsTyping(false);
    }, 650);
  };

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Format bot text: **bold** and newlines
  const formatText = (text: string) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i} className="block">
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j}>{part}</strong> : part
          )}
        </span>
      );
    });
  };

  return (
    <>
      {/* Join Membership — Bottom Left (Hidden on Mobile) */}
      <Link
        href="/membership"
        className="hidden md:flex fixed bottom-6 left-6 z-50 bg-accent text-white text-xs font-bold uppercase tracking-widest px-4 py-3 shadow-lg hover:bg-accent-dark transition-colors items-center justify-center"
        style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
      >
        Join Membership
      </Link>

      {/* Right Side */}
      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[60] flex flex-col items-end gap-3">
        {/* Chat Popup */}
        {chatOpen && (
          <div className="w-[calc(100vw-2rem)] sm:w-96 bg-white border border-gray-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden mb-2 animate-fade-up max-w-[400px]" style={{ height: "480px", maxHeight: "70vh" }}>
            {/* Header */}
            <div className="bg-black text-white px-4 py-3 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-bold text-sm">GMGP Support</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/60 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 overflow-y-auto bg-gray-50 flex flex-col gap-2">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`px-3 py-2.5 rounded-2xl text-sm leading-relaxed max-w-[88%] ${
                    m.role === "bot"
                      ? "bg-white border border-gray-100 shadow-sm self-start rounded-tl-sm text-gray-800"
                      : "bg-black text-white self-end rounded-tr-sm"
                  }`}
                >
                  {formatText(m.text)}
                </div>
              ))}
              {isTyping && (
                <div className="bg-white border border-gray-100 self-start px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                  <span className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick reply chips */}
            <div className="px-3 pt-2 pb-1 flex gap-1.5 flex-wrap bg-white border-t border-gray-100 flex-shrink-0">
              {["Delivery info", "Wagyu prices", "BBQ Packs", "Halal?", "Checkout help"].map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setInput(chip);
                    setTimeout(() => handleSend(), 50);
                  }}
                  className="text-[10px] font-semibold bg-gray-100 hover:bg-accent hover:text-white text-gray-600 px-2.5 py-1 rounded-full transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white flex gap-2 flex-shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask anything about GMGP..."
                className="flex-1 border border-gray-200 px-3 py-2 text-sm rounded-xl focus:outline-none focus:border-accent text-black placeholder-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-accent text-white p-2.5 rounded-xl hover:bg-accent-dark transition-colors disabled:opacity-40 flex items-center justify-center"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Live Chat Toggle */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-black text-white px-4 py-3 text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-accent transition-colors flex items-center gap-2 rounded-sm"
        >
          <MessageCircle size={14} />
          {chatOpen ? "Close Chat" : "Live Chat"}
        </button>

        {/* Scroll to Top */}
        {showTop && !chatOpen && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-black text-white w-10 h-10 flex items-center justify-center shadow-lg hover:bg-accent transition-colors"
          >
            <ArrowUp size={16} />
          </button>
        )}
      </div>

      {/* Get $10 — Side Tab (Hidden on Mobile) */}
      <div className="hidden md:block fixed right-0 top-1/2 -translate-y-1/2 z-50">
        <button
          className="bg-accent text-white text-[10px] font-bold uppercase tracking-widest px-2 py-4 shadow-lg hover:bg-accent-dark transition-colors"
          style={{ writingMode: "vertical-lr" }}
        >
          Get $10 →
        </button>
      </div>
    </>
  );
}
