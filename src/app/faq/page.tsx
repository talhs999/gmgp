"use client";
import { useState } from "react";
import { ChevronDown, MessageSquare, MapPin } from "lucide-react";
import Link from "next/link";

const faqData = [
  {
    category: "Products & Quality",
    items: [
      {
        q: "Where is your Wagyu from?",
        a: "Our Wagyu is sourced from Jac Wagyu (NSW) and processed at John Dee (QLD), one of Australia’s largest Halal-certified abattoirs.\nWe carefully select only well-marbled, high-quality cuts so you can enjoy restaurant-grade Wagyu at home."
      },
      {
        q: "Is your beef Grass Fed or Grain Fed?",
        a: "All GMGP beef is Grain Fed.\nGrain feeding ensures consistent marbling, tenderness, and rich flavour — especially for Wagyu and Angus — delivering the best BBQ experience."
      },
      {
        q: "How long can I store the meat?",
        a: "Fresh products can be stored 12–15 days refrigerated (unopened, skin-packed).\nOnce opened, consume within 2–3 days.\nFreezing is also possible and won’t affect quality if done early."
      },
      {
        q: "What’s the difference between Fullblood and F1 Wagyu?",
        a: "• Fullblood Wagyu: 100% purebred Wagyu with the highest marbling and rich, buttery flavour.\n• F1 Wagyu: 50% Wagyu crossbred with Angus or similar — slightly leaner, more affordable, but still premium.\n\nIn short:\nFullblood = ultimate luxury\nF1 = everyday premium value."
      }
    ]
  },
  {
    category: "Delivery & Pick-up",
    items: [
      {
        q: "Where do you deliver and when?",
        a: "Delivery runs every Saturday.\n• Sydney Metro: Within 35km of Lakemba (some Campbelltown areas included by location)\n• Wollongong: Within 20km of Wollongong Central\n\nYou’ll receive an ETA SMS on Friday afternoon, followed by a live update on Saturday morning when delivery starts. Tracking is available."
      },
      {
        q: "Can I choose my delivery time?",
        a: "Specific time requests aren’t available.\nOur in-house team follows the most efficient route to ensure freshness, but you’ll receive an estimated delivery window by SMS to help you plan ahead."
      },
      {
        q: "Can I pick up instead of delivery?",
        a: "Yes. Pick-up is available at:\n99–101 Yerrick Rd, Lakemba NSW 2195\nSaturday | 9:00 AM – 2:30 PM\n\nYou’ll be notified by SMS or email once your order is ready."
      }
    ]
  },
  {
    category: "In-Store & Walk-In",
    items: [
      {
        q: "Do you have a physical store?",
        a: "Yes. GMGP has two locations.\n\n📍 GMGP Warehouse K-Butchery is located at 99–101 Yerrick Rd, Lakemba NSW 2195. Open Monday–Saturday, 8:00 AM – 3:00 PM (AEST).\n\n📍 GMGP Kiosk (Westfield Hurstville) is located in front of Woolworths & ALDI, 3 Cross St, Hurstville NSW 2220. Open Monday–Saturday, 9:30 AM – 6:00 PM, Thursday until 9:00 PM, and Sunday 10:00 AM – 6:00 PM."
      },
      {
        q: "Can I walk in without ordering online?",
        a: "Yes. K-Butchery (Lakemba) and GMGP Kiosk (Hurstville) are walk-in stores, and no online order is required.\nYou’re welcome to visit us in-store, and our staff will be happy to help you choose the right cuts."
      },
      {
        q: "Do you sell in-store exclusive items?",
        a: "Yes. Some items are available in-store only and may vary daily depending on preparation and stock."
      },
      {
        q: "What are your business hours?",
        a: "We’re open Monday–Saturday, 8:00 AM – 3:00 PM (AEST).\nVisit us in-store or contact us online during these hours."
      }
    ]
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        q: "What is your return and refund policy?",
        a: "• Contact: 0487 500 555 or retail@gmgp.com.au\n\nTimeframe:\n• For missing items, contact us within 48 hours of delivery.\n• For incorrect deliveries, include a photo of the items in your inquiry.\n• For returns due to product issues, provide photos to customer service.\n• Requests for exchange or return must be made within 7 days of delivery.\n• Refunds: Processed within 3-7 business days after item retrieval."
      },
      {
        q: "What items are non-returnable?",
        a: "• Change of mind, personal reasons, or taste preferences.\n• Incorrect recipient address or phone number.\n• Items disposed of or returned without prior agreement.\n• Perishable items are non-returnable once disposed of."
      }
    ]
  },
  {
    category: "Halal Information",
    items: [
      {
        q: "Is your meat Halal?",
        a: "Yes. All Wagyu, Angus, and Duck products are Halal-certified.\nTo respect diversity, we also sell pork. Pork is handled separately using dedicated tools, stored in a separate cool room, and processed on different days under strict Halal protocols."
      },
      {
        q: "How do you prevent cross-contamination with pork?",
        a: "Pork is handled completely separately from Halal meats.\nIt is stored in a separate cool room, processed on different days, and handled using dedicated tools and equipment, following strict Halal protocols."
      },
      {
        q: "Where is your Wagyu processed?",
        a: "All GMGP Wagyu is processed at John Dee (QLD), one of Australia’s largest Halal-certified abattoirs, ensuring strict compliance with food safety and Halal standards."
      }
    ]
  }
];

function AccordionItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl mb-3 overflow-hidden bg-white shadow-sm hover:border-black transition-colors duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left bg-white focus:outline-none"
      >
        <span className="font-bold text-gray-900 group-hover:text-accent transition-colors">{question}</span>
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-black" : ""}`} 
        />
      </button>
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-5 pt-0 text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-black py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
          FAQ & Help Centre
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Find answers to common questions about GMGP’s meat delivery, walk-in shops, Halal certification, storage tips, and more.
        </p>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Support Info Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <h3 className="font-black text-xl uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Need More Help?</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 text-accent flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Live Chat & Support</h4>
                    <p className="text-xs text-gray-500 mt-1 mb-2">Have a question? Don't be shy, reach out and say hi!</p>
                    <div className="text-sm font-bold text-black mt-1">Mon-Sat: 8:30 AM - 2:30 PM</div>
                    <a href="mailto:retail@gmgp.com.au" className="block text-sm text-accent hover:underline mt-1">retail@gmgp.com.au</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 text-accent flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Physical Stores</h4>
                    <p className="text-xs text-black font-semibold mt-1">GMGP Warehouse K-Butchery</p>
                    <p className="text-xs text-gray-500">99–101 Yerrick Rd, Lakemba NSW</p>
                    
                    <p className="text-xs text-black font-semibold mt-3">GMGP Kiosk</p>
                    <p className="text-xs text-gray-500">Westfield Hurstville (Near Woolworths)</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <Link href="/shop" className="btn-primary w-full block text-center">
                  Shop All Products
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ Accordions */}
          <div className="lg:col-span-8">
            <div className="space-y-12">
              {faqData.map((category, idx) => (
                <div key={idx} id={category.category.toLowerCase().replace(/\s+/g, '-')}>
                  <h2 className="text-2xl font-black uppercase tracking-widest mb-6 flex items-center gap-3">
                    <span className="w-8 h-1 bg-accent inline-block rounded-full"></span>
                    {category.category}
                  </h2>
                  <div className="space-y-3">
                    {category.items.map((item, idxx) => (
                      <AccordionItem key={idxx} question={item.q} answer={item.a} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
