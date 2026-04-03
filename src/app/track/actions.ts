"use server";
import { getOrderById } from "@/lib/supabase-queries";
import { Order } from "@/lib/types";

// Public lightweight tracking method that DOES NOT leak sensitive email or internal user details unnecessarily
export async function trackPublicOrder(orderId: string): Promise<{ 
  success: boolean; 
  order?: { id: string; status: Order["status"]; total: number; delivery_date: string | null; created_at: string };
  error?: string;
}> {
  try {
    if (!orderId || typeof orderId !== "string" || orderId.trim() === "") {
      return { success: false, error: "Please enter a valid Order ID." };
    }

    const order = await getOrderById(orderId.trim());
    
    if (!order) {
      return { success: false, error: "Order not found. Please check your ID and try again." };
    }

    // Return only public-safe subset of the order
    return {
      success: true,
      order: {
        id: order.id,
        status: order.status,
        total: order.total,
        delivery_date: order.delivery_date,
        created_at: order.created_at
      }
    };
  } catch (error) {
    console.error("trackPublicOrder error:", error);
    return { success: false, error: "An error occurred while tracking. Please try again later." };
  }
}
