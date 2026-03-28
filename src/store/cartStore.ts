import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, WeightOption } from "@/lib/types";

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (product: Product, quantity?: number, weightOption?: WeightOption) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (product, quantity = 1, weightOption) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.product.id === product.id && i.weight_option?.label === weightOption?.label
          );
          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += quantity;
            return { items: updated, isDrawerOpen: true };
          }
          return {
            items: [...state.items, { product, quantity, weight_option: weightOption }],
            isDrawerOpen: true,
          };
        });
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.product.id !== productId)
              : state.items.map((i) =>
                  i.product.id === productId ? { ...i, quantity } : i
                ),
        })),

      clearCart: () => set({ items: [] }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      getTotal: () =>
        get().items.reduce(
          (sum, item) => {
            const price = item.weight_option ? item.weight_option.price : item.product.price;
            return sum + price * item.quantity;
          },
          0
        ),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: "gmgp-cart" }
  )
);
