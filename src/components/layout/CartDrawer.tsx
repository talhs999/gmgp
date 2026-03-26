"use client";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

const FREE_SHIPPING_THRESHOLD = 150;

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, removeItem, updateQuantity, getTotal } = useCartStore();
  const total = getTotal();
  const progress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - total, 0);

  return (
    <>
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[190] backdrop-blur-sm"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div className={`cart-drawer ${isDrawerOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-black text-lg uppercase tracking-tight">
            Your Cart <span className="text-accent">({items.length})</span>
          </h2>
          <button onClick={closeDrawer} className="hover:text-accent transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Freebie Progress Bar */}
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          {remaining > 0 ? (
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Add <span className="text-accent font-bold">${remaining.toFixed(2)}</span> more for FREE delivery!
            </p>
          ) : (
            <p className="text-xs font-bold text-green-600 mb-2">🎉 You've unlocked FREE delivery!</p>
          )}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag size={48} className="text-gray-300 mb-4" />
              <p className="font-bold text-lg text-gray-400">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1">Add some premium cuts to get started</p>
              <button
                onClick={closeDrawer}
                className="btn-primary mt-6 inline-block"
              >
                Shop Now
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-3">
                <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm leading-tight line-clamp-2">
                    {item.product.name}
                  </p>
                  <p className="text-accent font-bold text-sm mt-1">
                    A${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 border border-gray-300 flex items-center justify-center hover:border-black transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 border border-gray-300 flex items-center justify-center hover:border-black transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="ml-2 text-gray-400 hover:text-accent transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 space-y-4 bg-white">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-bold uppercase tracking-widest">Subtotal</span>
              <span className="font-black text-lg">A${getTotal().toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500">Shipping calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="btn-accent block text-center w-full"
            >
              Checkout Now
            </Link>
            <button
              onClick={closeDrawer}
              className="btn-outline block text-center w-full"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
