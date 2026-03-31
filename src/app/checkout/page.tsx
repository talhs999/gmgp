"use client";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { createOrder, AddressInput, getSiteSettings } from "@/lib/supabase-queries";
import { CheckCircle } from "lucide-react";
import { useCsrfToken } from "@/lib/csrf";

const PERTH_SUBURBS = [
  "Cottesloe", "Fremantle", "Subiaco", "Scarborough", "Joondalup", 
  "Rockingham", "Midland", "Armadale", "Canning Vale", "Morley", 
  "Nedlands", "Peppermint Grove", "South Perth", "Victoria Park", 
  "Belmont", "Osborne Park", "Balcatta", "Duncraig", "Hillarys",
  "Applecross", "Burswood", "Claremont", "Doubleview", "Floreat",
  "Guildford", "Innaloo", "Kalamunda", "Leederville", "Maylands",
  "Mount Lawley", "Northbridge", "Rivervale", "Wembley"
].sort();

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuth();
  const router = useRouter();
  const csrfToken = useCsrfToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState({ perth_fee: 100, outside_fee: 200, free_threshold: 150 });
  
  useEffect(() => {
    getSiteSettings().then(s => { if (s) setSettings(s); });
  }, []);

  // New Location state
  const [location, setLocation] = useState("perth"); // "perth" or "outside"
  
  const subtotal = getTotal();
  const shippingFee = subtotal >= settings.free_threshold ? 0 : (location === "perth" ? settings.perth_fee : settings.outside_fee);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    address: "", suburb: "", postcode: "", phone: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const address: AddressInput = {
      full_name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      address: form.address,
      suburb: form.suburb,
      state: location === "perth" ? "WA" : "Other",
      postcode: form.postcode,
      phone: form.phone,
    };

    const orderItems = items.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.weight_option ? item.weight_option.price : item.product.price,
      weight_option: item.weight_option?.label ?? null,
    }));

    const total = getTotal() + shippingFee;

    const order = await createOrder(user?.id || null, total, orderItems, address);
    
    if (order) {
      clearCart();
      router.push(`/checkout/success?id=${order.id}&total=${total}${!user ? "&guest=true" : ""}`);
    } else {
      setError("Failed to place order. Please try again.");
    }
    setLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 container-custom text-center min-h-[60vh]">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-4">Checkout</h1>
        <p className="text-gray-500 mb-8">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary inline-block">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 bg-gray-50 min-h-screen">
      <div className="container-custom max-w-6xl">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Secure Checkout</h1>
        
        {!user && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
            <span>💡</span>
            <span><strong>Sign in</strong> to track your order easily. <Link href="/login" className="underline font-bold">Sign In</Link> or continue as guest.</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>
        )}
        
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <form id="checkout-form" onSubmit={handleCheckout} className="bg-white p-8 border border-gray-100 shadow-sm rounded-xl space-y-6">
              
              {/* CSRF hidden token */}
              <input type="hidden" name="_csrf" value={csrfToken} readOnly />
              
              <h2 className="font-bold uppercase tracking-widest text-sm border-b pb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">First Name</label>
                  <input required type="text" name="firstName" value={form.firstName} onChange={handleChange}
                    className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Last Name</label>
                  <input required type="text" name="lastName" value={form.lastName} onChange={handleChange}
                    className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address (For Invoice)</label>
                  <input required type="email" name="email" value={form.email} onChange={handleChange}
                    className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                  <input required type="tel" name="phone" value={form.phone} onChange={handleChange}
                    className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black" />
                </div>
              </div>

              <h2 className="font-bold uppercase tracking-widest text-sm border-b pb-4 pt-4">Delivery Address</h2>
              
              <div className="mb-4 bg-gray-50 p-4 border border-gray-200 rounded-lg">
                <label className="block text-sm font-bold tracking-tight mb-2">Select Delivery Region</label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="location" value="perth" checked={location === "perth"} onChange={() => setLocation("perth")} className="w-4 h-4 text-black focus:ring-black" />
                    <span className="text-sm">
                      Within Perth (Delivery: {subtotal >= settings.free_threshold ? <span className="text-green-600 font-bold">FREE</span> : `$${settings.perth_fee} AUD`})
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="location" value="outside" checked={location === "outside"} onChange={() => setLocation("outside")} className="w-4 h-4 text-black focus:ring-black" />
                    <span className="text-sm">
                      Outside Perth (Delivery: {subtotal >= settings.free_threshold ? <span className="text-green-600 font-bold">FREE</span> : `$${settings.outside_fee} AUD`})
                    </span>
                  </label>
                </div>
              </div>

              {location === "perth" && (
                <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-200 mb-4 ring-2 ring-black/5">
                  <iframe 
                    width="100%" height="100%" frameBorder="0" style={{ border: 0 }}
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d216597.5855018679!2d115.700305!3d-31.954625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2a32966cdccfd739%3A0xc3fec3f309a96e94!2sPerth%20WA%2C%20Australia!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
                    allowFullScreen
                  />
                </div>
              )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Street Address</label>
                    <input required type="text" name="address" value={form.address} onChange={handleChange}
                      className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Suburb</label>
                      {location === "perth" ? (
                        <select required name="suburb" value={form.suburb} onChange={handleChange}
                          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black bg-white">
                          <option value="">Select Perth Suburb</option>
                          {PERTH_SUBURBS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <input required type="text" name="suburb" value={form.suburb} onChange={handleChange}
                          className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black" />
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Postcode</label>
                      <input required type="text" name="postcode" value={form.postcode} onChange={handleChange}
                        className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black" />
                    </div>
                  </div>
                </div>

              <h2 className="font-bold uppercase tracking-widest text-sm border-b pb-4 pt-4">Payment Method</h2>
              <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg">
                <label className="flex items-start gap-3">
                  <input type="radio" defaultChecked className="w-4 h-4 mt-0.5 text-black focus:ring-black" />
                  <div>
                    <span className="block text-sm font-bold">Cash on Delivery (COD)</span>
                    <span className="block text-xs text-gray-500 mt-1">Pay with cash upon delivery of your order.</span>
                  </div>
                </label>
              </div>

            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-xl sticky top-24">
              <h2 className="font-bold uppercase tracking-widest text-sm border-b pb-4 mb-4">Order Summary</h2>
              
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.weight_option?.label}`} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image src={item.product.image_url} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-bold line-clamp-1">{item.product.name}</p>
                      {item.weight_option && <p className="text-gray-500 text-xs">{item.weight_option.label}</p>}
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-500">Qty: {item.quantity}</span>
                        <span className="font-bold">AUD ${( (item.weight_option ? item.weight_option.price : item.product.price) * item.quantity ).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t mt-6 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>AUD ${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping ({location === "perth" ? "Within Perth" : "Outside Perth"})</span>
                  <span>AUD ${shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-black text-lg pt-2 border-t mt-2">
                  <span>Total</span>
                  <span className="text-accent">AUD ${(getTotal() + shippingFee).toFixed(2)}</span>
                </div>
              </div>

              <button 
                form="checkout-form" type="submit" disabled={loading}
                className="w-full btn-accent py-4 mt-6 text-base shadow-lg shadow-red-500/20"
              >
                {loading ? "Processing..." : "Place Order & Pay on Delivery"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
