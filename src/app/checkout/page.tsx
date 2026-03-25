"use client";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createOrder, AddressInput } from "@/lib/supabase-queries";
import { CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    address: "", suburb: "", postcode: "", phone: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const address: AddressInput = {
      full_name: `${form.firstName} ${form.lastName}`,
      address: form.address,
      suburb: form.suburb,
      state: "NSW",
      postcode: form.postcode,
      phone: form.phone,
    };

    const orderItems = items.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.weight_option ? item.weight_option.price : item.product.price,
      weight_option: item.weight_option?.label ?? null,
    }));

    const total = getTotal() + 15; // +$15 shipping

    if (user) {
      const order = await createOrder(user.id, total, orderItems, address);
      if (order) {
        clearCart();
        setSuccess(true);
      } else {
        setError("Failed to place order. Please try again.");
      }
    } else {
      // Guest: show success without saving to DB
      setTimeout(() => {
        clearCart();
        setSuccess(true);
      }, 800);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="pt-32 pb-20 container-custom text-center min-h-[60vh]">
        <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
        <h1 className="text-3xl font-black uppercase tracking-tight mb-3">Order Placed! 🎉</h1>
        <p className="text-gray-500 mb-2">Thank you for your order!</p>
        <p className="text-gray-400 text-sm mb-8">
          {user ? "You can track your order in your account." : "We'll be in touch via email."}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/shop" className="btn-primary inline-block">Continue Shopping</Link>
          {user && <Link href="/account" className="btn-outline inline-block">View My Orders</Link>}
        </div>
      </div>
    );
  }

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
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="container-custom max-w-6xl">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-8">Secure Checkout</h1>
        
        {!user && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
            <span>💡</span>
            <span><strong>Sign in</strong> to save your order history. <Link href="/login" className="underline font-bold">Sign In</Link> or continue as guest.</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>
        )}
        
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <form id="checkout-form" onSubmit={handleCheckout} className="bg-white p-8 border border-gray-100 shadow-sm rounded-xl space-y-6">
              
              <h2 className="font-bold uppercase tracking-widest text-sm border-b pb-4">Contact Information</h2>
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                  <input required type="email" name="email" value={form.email} onChange={handleChange}
                    className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone</label>
                  <input required type="tel" name="phone" value={form.phone} onChange={handleChange}
                    className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black" />
                </div>
              </div>

              <h2 className="font-bold uppercase tracking-widest text-sm border-b pb-4 pt-4">Delivery Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Street Address</label>
                  <input required type="text" name="address" value={form.address} onChange={handleChange}
                    className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Suburb</label>
                  <input required type="text" name="suburb" value={form.suburb} onChange={handleChange}
                    className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Postcode</label>
                  <input required type="text" name="postcode" value={form.postcode} onChange={handleChange}
                    className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:border-black" />
                </div>
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
                        <span className="font-bold">${((item.weight_option ? item.weight_option.price : item.product.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t mt-6 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping (Saturday Delivery)</span>
                  <span>$15.00</span>
                </div>
                <div className="flex justify-between font-black text-lg pt-2 border-t mt-2">
                  <span>Total</span>
                  <span className="text-accent">${(getTotal() + 15).toFixed(2)}</span>
                </div>
              </div>

              <button 
                form="checkout-form" type="submit" disabled={loading}
                className="w-full btn-accent py-4 mt-6 text-base"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
